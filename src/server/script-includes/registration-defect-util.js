/**
 * RegistrationDefectUtil
 *
 * 登録不備対応処理（処理No.7）のうち、事業者（申請者）側の操作をまとめたユーティリティ。
 * 事務局側の操作（不備修正の依頼）は RegistrationReviewUtil が担当する。
 *
 * ■ なぜトークン方式なのか
 * 権限設計書 2章のロール付与ルールでは applicant ロールは「登録審査で承認となった時点で自動付与」する。
 * したがって登録不備確認依頼（defect_request）の段階では申請者にロールが無く、
 * ポータルの認証ページ（すべて applicant／applicant_admin 必須）を開くことができない。
 *
 * ロール付与ルールを変更せずに経路を作るため、SC-03 本登録と同じ
 * 「案内メールのリンクに含む一時トークンで未認証アクセスする」方式を採る。
 *
 * ■ ステータス遷移（業務フロー「ユーザー登録ステータス一覧」）
 *   登録不備確認依頼（defect_request）
 *     → 申請者が修正画面を開く         → 登録不備修正中（defect_fixing）
 *     → 申請者が修正内容を再提出       → 登録申請審査中（review）
 *   再提出後は RegistrationReviewUtil.isActionable() が true となり、
 *   事務局が再度「承認」「却下」「不備修正を依頼」を実行できる。
 *
 * ■ ACL について
 * Service Portal のウィジェットのサーバースクリプトは ACL を経由しない（GlideRecord は ACL 非適用）。
 * 本ユーティリティはトークンの一致・有効期限・ステータスの3点で対象を限定することにより、
 * 未認証アクセスでも他人のレコードを操作できないようにしている（ロール判定は行えないため）。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない。
 */
var RegistrationDefectUtil = Class.create()

/** 修正画面を開ける（トークンが有効な）ユーザ登録ステータス */
RegistrationDefectUtil.FIXABLE_STATUSES = ['defect_request', 'defect_fixing']

/** 事務局が不備修正を依頼した直後の状態 */
RegistrationDefectUtil.REQUESTED = 'defect_request'

/** 申請者が修正画面を開いた後の状態 */
RegistrationDefectUtil.FIXING = 'defect_fixing'

/** 再提出後の状態（事務局の再審査待ち） */
RegistrationDefectUtil.RESUBMITTED = 'review'

/** トークン有効期限の既定値（日数）。プロパティ未設定時に使用する */
RegistrationDefectUtil.DEFAULT_TOKEN_VALID_DAYS = 14

/** トークン有効期限のシステムプロパティ名（定義は common/portal-properties.now.ts） */
RegistrationDefectUtil.TOKEN_VALID_DAYS_PROPERTY = 'x_dent2_dentsusoke.defect.token_valid_days'

/** 推測困難なトークンの最小長（GUID2個連結で32文字以上になる） */
RegistrationDefectUtil.MIN_TOKEN_LENGTH = 32

RegistrationDefectUtil.prototype = {
    initialize: function () {},

    /**
     * 不備修正用トークンを発行し、有効期限を設定する（事務局側の依頼時に呼ぶ）。
     * トークン文字列を返す。レコードの update は呼び出し元が行う
     * （依頼処理のステータス更新と1回の update にまとめるため）。
     */
    issueToken: function (userGr) {
        var token = gs.generateGUID() + gs.generateGUID()
        var expiresOn = new GlideDateTime()
        expiresOn.addDaysLocalTime(this.getTokenValidDays())

        userGr.setValue('u_defect_fix_token', token)
        userGr.setValue('u_defect_fix_expires_on', expiresOn.getValue())
        return token
    },

    /**
     * トークンから対象の事業者ユーザを解決する。
     *
     * @return null（該当なし）／{ state: 'expired'|'done'|'valid', gr }
     *   done … 既に再提出済み（登録申請審査中以降）。リンクを再度開いた場合に区別して案内する。
     */
    findByToken: function (token) {
        var value = token === null || token === undefined ? '' : token + ''
        if (value.length < RegistrationDefectUtil.MIN_TOKEN_LENGTH) {
            return null
        }

        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.addQuery('u_defect_fix_token', value)
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return null
        }

        var status = gr.getValue('u_registration_status')
        if (RegistrationDefectUtil.FIXABLE_STATUSES.indexOf(status) < 0) {
            // トークンは残っているがステータスが対象外（再提出済み・承認済み・却下済み）
            return { state: 'done', gr: gr }
        }

        var expiresOn = gr.getValue('u_defect_fix_expires_on')
        if (expiresOn && new GlideDateTime(expiresOn).compareTo(new GlideDateTime()) < 0) {
            return { state: 'expired', gr: gr }
        }

        return { state: 'valid', gr: gr }
    },

    /**
     * 修正画面の表示内容を組み立てる。
     * 事務局が記載した不備内容と、修正対象の現在値（SC-03 本登録で入力した項目）を返す。
     */
    buildContext: function (userGr) {
        var context = {
            loginId: userGr.getValue('user_name'),
            email: userGr.getValue('email'),
            issueNote: userGr.getValue('u_registration_issue_note') || '',
            requestedOn: userGr.getDisplayValue('u_registration_requested_on'),
            entityId: '',
            businessName: '',
            entityType: '',
            corporateNumber: '',
        }

        var entityId = userGr.getValue('u_business_entity')
        if (!entityId) {
            return context
        }

        // 自分の事業者レコードの単一取得であり、対象は u_business_entity で確定している（トンマナ 3.2.3）
        var entityGr = new GlideRecord('x_dent2_dentsusoke_entity')
        if (entityGr.get(entityId)) {
            context.entityId = entityId
            context.businessName = entityGr.getValue('u_business_name')
            context.entityType = entityGr.getValue('u_entity_type')
            context.corporateNumber = entityGr.getValue('u_corporate_number')
        }
        return context
    },

    /**
     * 修正画面を開いたことを記録する（登録不備確認依頼 → 登録不備修正中）。
     *
     * 事務局の一覧で「依頼したが未着手」と「申請者が修正中」を区別できるようにするための遷移であり、
     * 業務フローの登録不備修正中（defect_fixing）に対応する。
     * 既に修正中の場合は何もしない（リンクを何度開いても1回だけ遷移する）。
     */
    startFixing: function (userGr) {
        if (userGr.getValue('u_registration_status') !== RegistrationDefectUtil.REQUESTED) {
            return { success: true, changed: false }
        }

        userGr.setValue('u_registration_status', RegistrationDefectUtil.FIXING)
        if (!userGr.update()) {
            gs.error('[SKS] 登録不備修正中への遷移に失敗しました。login_id=' + userGr.getValue('user_name'))
            return { success: false, changed: false }
        }

        gs.info('[SKS] 申請者が登録不備の修正を開始しました。login_id=' + userGr.getValue('user_name'))
        return { success: true, changed: true }
    },

    /**
     * 修正内容の再提出（登録不備修正中 → 登録申請審査中）。
     *
     * 事業者情報を更新し、重複チェック（処理No.5）と前年登録判定（処理No.4）を再実行する。
     * 再判定が必要なのは、申請者が法人番号・事業者区分を修正した場合に
     * 重複チェック結果が古いままだと事務局が承認できない（canApprove が false のまま）ためである。
     *
     * @param token トークン（呼び出し元の入力値を再検証するため受け取る）
     * @param input { business_name, entity_type, corporate_number }
     */
    submitFix: function (token, input) {
        var found = this.findByToken(token)
        if (!found) {
            return { success: false, errors: ['修正用のリンクが無効です。お手数ですが事務局へお問い合わせください。'] }
        }
        if (found.state === 'expired') {
            return { success: false, errors: ['修正用リンクの有効期限が切れています。事務局へお問い合わせください。'] }
        }
        if (found.state === 'done') {
            return { success: false, errors: ['この登録申請は既に再提出済みです。事務局の審査結果をお待ちください。'] }
        }

        var businessName = this._trim(input && input.business_name)
        var entityType = this._trim(input && input.entity_type)
        var corporateNumber = this._trim(input && input.corporate_number)

        var errors = this.validate(businessName, entityType, corporateNumber)
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        var userGr = found.gr
        var entityId = userGr.getValue('u_business_entity')
        if (!entityId) {
            gs.error('[SKS] 登録不備修正：事業者レコードが紐づいていません。login_id=' + userGr.getValue('user_name'))
            return { success: false, errors: ['事業者情報が見つかりません。事務局へお問い合わせください。'] }
        }

        // 処理No.5 重複チェック／処理No.4 前年登録判定の再実行。
        // 自社の事業者レコードは既に存在するため、判定対象から除外する
        // （除外しないと自分自身と法人番号が一致し、必ず「重複あり（確定）」になる）。
        var duplicateUtil = new x_dent2_dentsusoke.RegistrationDuplicateUtil()
        var duplicate = duplicateUtil.checkDuplicate(entityType, corporateNumber, businessName, entityId)
        var priorYear = duplicateUtil.judgePriorYearRegistration(corporateNumber, entityId)

        var entityGr = new GlideRecord('x_dent2_dentsusoke_entity')
        if (!entityGr.get(entityId)) {
            return { success: false, errors: ['事業者情報が見つかりません。事務局へお問い合わせください。'] }
        }
        entityGr.setValue('u_business_name', businessName)
        entityGr.setValue('u_entity_type', entityType)
        entityGr.setValue('u_corporate_number', corporateNumber)
        entityGr.setValue('u_prior_year_awarded_flag', priorYear.matched)
        if (priorYear.matched) {
            if (priorYear.awardNumber) {
                entityGr.setValue('u_prior_year_award_number', priorYear.awardNumber)
            }
            if (priorYear.salesforceAccountId) {
                entityGr.setValue('u_salesforce_account_id', priorYear.salesforceAccountId)
            }
        }
        if (!entityGr.update()) {
            gs.error('[SKS] 登録不備修正：事業者情報の更新に失敗しました。entity=' + entityId)
            return { success: false, errors: ['修正内容の保存に失敗しました。時間をおいて再度お試しください。'] }
        }

        userGr.setValue('u_duplicate_check_result', duplicate.result)
        userGr.setValue('u_registration_status', RegistrationDefectUtil.RESUBMITTED)
        // トークンは使い切りとし、再提出後に無効化する
        userGr.setValue('u_defect_fix_token', '')
        userGr.setValue('u_defect_fix_expires_on', '')
        /**
         * u_registration_issue_note（事務局が記載した不備内容）は消さずに残す。
         * 再審査する事務局が「何を指摘したか」を確認できる必要があるためである。
         * 次に不備修正を依頼した時点で新しい内容へ上書きされる。
         *
         * TODO(Q12): 依頼回数の上限・回答期限が未確定。指摘と回答の履歴を複数回分残す場合は
         *   別テーブル（登録不備履歴）が必要になる。現時点では最新の1件のみを保持する。
         */
        if (!userGr.update()) {
            gs.error('[SKS] 登録不備修正：再提出の更新に失敗しました。login_id=' + userGr.getValue('user_name'))
            return { success: false, errors: ['再提出に失敗しました。時間をおいて再度お試しください。'] }
        }

        gs.info(
            '[SKS] 登録不備の修正を再提出しました。login_id=' +
                userGr.getValue('user_name') +
                ' duplicate=' +
                duplicate.result +
                ' priorYear=' +
                priorYear.matched,
        )

        return {
            success: true,
            businessName: businessName,
            duplicateResult: duplicate.result,
        }
    },

    /**
     * 入力検証。SC-03 本登録（signup-form）と同じ規則にそろえる。
     *
     * TODO(Q01): 重複判定の主キーが未確定。暫定として
     *   法人       → 法人番号13桁（数字）
     *   個人事業主 → 本人識別情報（半角英数字13桁以内）
     * としている。
     */
    validate: function (businessName, entityType, corporateNumber) {
        var errors = []

        if (!businessName) {
            errors.push('事業者名（法人名／屋号）を入力してください。')
        } else if (businessName.length > 100) {
            errors.push('事業者名は100文字以内で入力してください。')
        }

        if (entityType !== 'corporate' && entityType !== 'sole_proprietor') {
            errors.push('事業者区分を選択してください。')
        }

        if (!corporateNumber) {
            errors.push('法人番号／本人識別情報を入力してください。')
        } else if (entityType === 'corporate' && !/^[0-9]{13}$/.test(corporateNumber)) {
            errors.push('法人番号は13桁の数字で入力してください。')
        } else if (entityType === 'sole_proprietor' && !/^[0-9A-Za-z]{1,13}$/.test(corporateNumber)) {
            errors.push('本人識別情報は半角英数字13桁以内で入力してください。')
        }

        return errors
    },

    /** トークンの有効日数（プロパティ優先。未作成・不正値の場合は既定値を使用する） */
    getTokenValidDays: function () {
        var configured = parseInt(gs.getProperty(RegistrationDefectUtil.TOKEN_VALID_DAYS_PROPERTY, ''), 10)
        if (isNaN(configured) || configured <= 0) {
            return RegistrationDefectUtil.DEFAULT_TOKEN_VALID_DAYS
        }
        return configured
    },

    _trim: function (value) {
        return value === null || value === undefined ? '' : (value + '').trim()
    },

    type: 'RegistrationDefectUtil',
}
