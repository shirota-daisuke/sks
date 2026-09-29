/**
 * RegistrationReviewUtil
 *
 * ユーザ登録審査（SC-11 プロビジョニング）のステータス遷移をまとめたユーティリティ。
 *   ・登録審査（承認・却下）処理（処理No.6）
 *   ・登録不備対応処理（処理No.7）の事務局側操作
 *   ・ユーザ登録ステータス管理処理（処理No.8）のうち画面表示区分の判定
 *
 * 遷移の妥当性判定を画面側へ散らさないため Script Include に集約する。
 * 業務フロー「ユーザー登録アクション・権限マトリクス」を単一の正とし、
 * 遷移可能なステータス・実行権限・重複チェック結果による制約をここだけで判定する。
 *
 * Service Portal のウィジェットのサーバースクリプトは ACL を経由しない（GlideRecord は ACL 非適用）ため、
 * 本ユーティリティ側でロールを明示的に検証する（トンマナ 2.1.2 ロールベースアクセス制御）。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない。
 */
var RegistrationReviewUtil = Class.create()

/** 審査操作を実行できるロール（SDK 公式ドキュメントに従いロールは名前文字列で参照する） */
RegistrationReviewUtil.STAFF_ROLE = 'x_dent2_dentsusoke.staff'

/** 承認時に付与するロール（権限設計書 2章 ロール付与ルール） */
RegistrationReviewUtil.APPLICANT_ROLE = 'x_dent2_dentsusoke.applicant'

/** 事務局の対応が必要なユーザ登録ステータス（SC-11 の既定の絞込対象） */
RegistrationReviewUtil.PENDING_STATUSES = ['review', 'defect_request', 'defect_fixing']

/**
 * 承認・却下・不備修正依頼を実行できるステータス。
 * 業務フロー「ユーザー登録アクション・権限マトリクス」では、3つのアクションはいずれも
 * 「登録申請審査中」からの遷移としてのみ定義されている。
 */
RegistrationReviewUtil.ACTIONABLE_STATUS = 'review'

/**
 * ユーザ登録ステータス → 表示区分。
 * 画面イメージ凡例（成果物No.5）の3区分に対応させる（ApplicationStatusUtil と同じ区分）。
 *   done    : 完了系（登録済）
 *   progress: 処理中／要確認系（登録申請審査中）
 *   error   : エラー／不備系（登録不備確認依頼・登録不備修正中・登録不可）
 *   neutral : 発行前（未登録・登録中）
 */
RegistrationReviewUtil.STATUS_TONES = {
    unregistered: 'neutral',
    registering: 'neutral',
    review: 'progress',
    defect_request: 'error',
    defect_fixing: 'error',
    registered: 'done',
    rejected: 'error',
}

/** 重複チェック結果（処理No.5）→ 表示区分 */
RegistrationReviewUtil.DUPLICATE_TONES = {
    not_executed: 'neutral',
    no_duplicate: 'done',
    duplicate_review: 'progress',
    duplicate_confirmed: 'error',
}

/** 表示区分 → Bootstrap3 ラベルクラス（テンプレート側で ng-class にバインドする） */
RegistrationReviewUtil.TONE_LABEL_CLASSES = {
    done: 'label-success',
    progress: 'label-warning',
    error: 'label-danger',
    neutral: 'label-default',
}

/** 登録不備内容の桁数上限（T02 u_registration_issue_note の桁数に合わせる） */
RegistrationReviewUtil.ISSUE_NOTE_MAX_LENGTH = 2000

RegistrationReviewUtil.prototype = {
    initialize: function () {},

    /** 審査操作を実行できるユーザか（admin も true を返す） */
    canReview: function () {
        return gs.hasRole(RegistrationReviewUtil.STAFF_ROLE)
    },

    /** 事務局の対応が必要なステータスの一覧（SC-11 の既定の絞込条件） */
    getPendingStatuses: function () {
        return RegistrationReviewUtil.PENDING_STATUSES
    },

    /** 承認・却下・不備修正依頼を実行できるステータスか */
    isActionable: function (status) {
        return (status || '') + '' === RegistrationReviewUtil.ACTIONABLE_STATUS
    },

    /**
     * 承認できる重複チェック結果か。
     * 業務フロー確認事項 Q04（決定済）「確定一致は登録不可、曖昧一致のみ事務局確認」に従い、
     * 重複あり（確定）は承認せず却下する運用とする。
     */
    canApprove: function (duplicateCheckResult) {
        return (duplicateCheckResult || '') + '' !== 'duplicate_confirmed'
    },

    /** ユーザ登録ステータスに対応する Bootstrap3 ラベルクラス */
    getStatusLabelClass: function (status) {
        var tone = RegistrationReviewUtil.STATUS_TONES[(status || '') + ''] || 'neutral'
        return RegistrationReviewUtil.TONE_LABEL_CLASSES[tone]
    },

    /** 重複チェック結果に対応する Bootstrap3 ラベルクラス */
    getDuplicateLabelClass: function (result) {
        var tone = RegistrationReviewUtil.DUPLICATE_TONES[(result || '') + ''] || 'neutral'
        return RegistrationReviewUtil.TONE_LABEL_CLASSES[tone]
    },

    /**
     * 登録審査：承認（処理No.6）
     * ステータスを「登録済」へ確定し、権限設計書 2章のロール付与ルールに従い applicant ロールを付与する。
     */
    approve: function (userId) {
        var loaded = this._loadActionable(userId)
        if (!loaded.ok) {
            return loaded.result
        }

        var gr = loaded.record
        var duplicateResult = gr.getValue('u_duplicate_check_result')
        if (!this.canApprove(duplicateResult)) {
            return {
                success: false,
                errors: [
                    '重複チェック結果が「' +
                        gr.getDisplayValue('u_duplicate_check_result') +
                        '」のため承認できません。却下を実行してください。',
                ],
            }
        }

        gr.setValue('u_registration_status', 'registered')
        gr.setValue('u_approved_on', new GlideDateTime().getValue())
        gr.setValue('u_approved_by', gs.getUserID())
        if (!gr.update()) {
            gs.error('[SKS] 登録審査（承認）の更新に失敗しました。user=' + userId)
            return { success: false, errors: ['承認に失敗しました。時間をおいて再度お試しください。'] }
        }

        var granted = this.grantApplicantRole(userId)
        gs.info(
            '[SKS] ユーザ登録を承認しました。login_id=' +
                gr.getValue('user_name') +
                ' duplicate=' +
                duplicateResult +
                ' roleGranted=' +
                granted.success,
        )

        return {
            success: true,
            action: 'approve',
            message: 'ユーザ登録を承認しました（登録済）。',
            warnings: granted.success ? [] : granted.errors,
        }
    },

    /**
     * 登録審査：却下（処理No.6）
     * ステータスを「登録不可」（終端状態）へ確定する。applicant ロールは付与しない。
     *
     * TODO(A15/Q11 相当の確認事項): 却下理由を記録する項目がテーブル定義書 T02 に定義されていない。
     *   現時点は操作ログ（gs.info）のみ記録している。理由の記録・申請者への通知範囲が確定したら項目を追加する。
     */
    reject: function (userId) {
        var loaded = this._loadActionable(userId)
        if (!loaded.ok) {
            return loaded.result
        }

        var gr = loaded.record
        gr.setValue('u_registration_status', 'rejected')
        gr.setValue('u_approved_on', new GlideDateTime().getValue())
        gr.setValue('u_approved_by', gs.getUserID())
        if (!gr.update()) {
            gs.error('[SKS] 登録審査（却下）の更新に失敗しました。user=' + userId)
            return { success: false, errors: ['却下に失敗しました。時間をおいて再度お試しください。'] }
        }

        gs.info(
            '[SKS] ユーザ登録を却下しました。login_id=' +
                gr.getValue('user_name') +
                ' duplicate=' +
                gr.getValue('u_duplicate_check_result'),
        )
        return { success: true, action: 'reject', message: 'ユーザ登録を却下しました（登録不可）。' }
    },

    /**
     * 登録不備対応：不備修正を依頼（処理No.7）
     * ステータスを「登録不備確認依頼」へ遷移させ、事務局が記載した不備内容を保持する。
     *
     * あわせて申請者向けの不備修正トークンを発行し、案内メール（処理No.45／IF-07）を起動する。
     * この時点の申請者には applicant ロールが無くポータルへログインできないため、
     * トークン付きリンクが申請者へ不備内容を伝える唯一の経路である
     * （詳細は RegistrationDefectUtil のコメントを参照）。
     *
     * TODO(Q11): 不備確認依頼の対象項目・理由区分が未確定。暫定で事務局の自由記述（必須）とする。
     * TODO(Q12): 依頼回数の上限・回答期限が未確定。現時点では回数のチェックを行わない
     *   （期限はトークンの有効期限として運用する）。
     */
    requestDefectFix: function (userId, issueNote) {
        var loaded = this._loadActionable(userId)
        if (!loaded.ok) {
            return loaded.result
        }

        var note = issueNote === null || issueNote === undefined ? '' : (issueNote + '').trim()
        if (!note) {
            return { success: false, errors: ['不備内容を入力してください。'] }
        }
        if (note.length > RegistrationReviewUtil.ISSUE_NOTE_MAX_LENGTH) {
            return {
                success: false,
                errors: ['不備内容は' + RegistrationReviewUtil.ISSUE_NOTE_MAX_LENGTH + '文字以内で入力してください。'],
            }
        }

        var gr = loaded.record
        gr.setValue('u_registration_status', 'defect_request')
        gr.setValue('u_registration_issue_note', note)

        // 申請者が不備内容を確認・修正するための一時トークンを発行する（ステータス更新と同じ update に含める）
        var defectUtil = new x_dent2_dentsusoke.RegistrationDefectUtil()
        defectUtil.issueToken(gr)

        if (!gr.update()) {
            gs.error('[SKS] 登録不備確認依頼の更新に失敗しました。user=' + userId)
            return { success: false, errors: ['不備修正の依頼に失敗しました。時間をおいて再度お試しください。'] }
        }

        // 不備確認依頼メール送信（処理No.45／IF-07）を起動する。
        // parm1 に sys_id を渡し、通知側（eventParm1WithRecipient）が宛先として解決する。
        gs.eventQueue('x_dent2_dentsusoke.registration.defect', gr, gr.getUniqueValue(), '')

        gs.info('[SKS] 登録不備の修正を依頼しました。login_id=' + gr.getValue('user_name'))
        return {
            success: true,
            action: 'request_defect',
            message:
                '登録不備の修正を依頼しました。申請者へ修正用リンクを含む案内メールを送信します（リンクの有効期限は' +
                defectUtil.getTokenValidDays() +
                '日間）。',
        }
    },

    /**
     * applicant ロールの付与（権限設計書 2章「登録審査で承認となった時点で自動付与する」）。
     * 既に付与済みの場合は何もしない（再実行しても重複行を作らない）。
     *
     * sys_user_has_role は Global スコープのテーブルであり、名前付きスコープからの書き込みが
     * クロススコープ設定で拒否される可能性がある。ロール付与の失敗でステータス更新まで巻き戻さず、
     * 呼び出し元へ警告として返す（ステータスは確定済みで、ロールは後から手動付与できる）。
     */
    grantApplicantRole: function (userId) {
        var roleGr = new GlideRecord('sys_user_role')
        roleGr.addQuery('name', RegistrationReviewUtil.APPLICANT_ROLE)
        roleGr.setLimit(1)
        roleGr.query()
        if (!roleGr.next()) {
            gs.error('[SKS] ロールが見つかりません。name=' + RegistrationReviewUtil.APPLICANT_ROLE)
            return {
                success: false,
                errors: ['ロール（' + RegistrationReviewUtil.APPLICANT_ROLE + '）が見つからないため付与できませんでした。'],
            }
        }
        var roleId = roleGr.getUniqueValue()

        var existing = new GlideRecord('sys_user_has_role')
        existing.addQuery('user', userId)
        existing.addQuery('role', roleId)
        existing.setLimit(1)
        existing.query()
        if (existing.hasNext()) {
            return { success: true, created: false }
        }

        try {
            var inserted = new GlideRecord('sys_user_has_role')
            inserted.initialize()
            inserted.setValue('user', userId)
            inserted.setValue('role', roleId)
            // state を明示する。空のまま投入するとロールが有効にならず、ロール必須ページで 404 となる
            inserted.setValue('state', 'active')
            var sysId = inserted.insert()
            if (!sysId) {
                gs.error('[SKS] applicant ロールの付与に失敗しました。user=' + userId)
                return {
                    success: false,
                    errors: ['ステータスは更新しましたが、ロールの付与に失敗しました。事務局管理者へご連絡ください。'],
                }
            }
            return { success: true, created: true }
        } catch (e) {
            gs.error('[SKS] applicant ロールの付与で例外が発生しました。user=' + userId + ' error=' + e)
            return {
                success: false,
                errors: ['ステータスは更新しましたが、ロールの付与に失敗しました。事務局管理者へご連絡ください。'],
            }
        }
    },

    /**
     * 対象の事業者ユーザを取得する。
     * 事務局ユーザは全事業者ユーザを参照できるため追加条件を持たない単一レコード取得であり、
     * get() を使用する（トンマナ 3.2.3）。
     */
    _load: function (userId) {
        if (!userId) {
            return null
        }
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        if (!gr.get(userId + '')) {
            return null
        }
        return gr
    },

    /** 実行権限・対象の存在・ステータス遷移の妥当性をまとめて検証する */
    _loadActionable: function (userId) {
        if (!this.canReview()) {
            return { ok: false, result: { success: false, errors: ['この操作には事務局ユーザの権限が必要です。'] } }
        }

        var gr = this._load(userId)
        if (!gr) {
            return { ok: false, result: { success: false, errors: ['対象の事業者ユーザが見つかりません。'] } }
        }

        if (!this.isActionable(gr.getValue('u_registration_status'))) {
            return {
                ok: false,
                result: {
                    success: false,
                    errors: [
                        'ステータスが「' +
                            gr.getDisplayValue('u_registration_status') +
                            '」のため実行できません。「登録申請審査中」の登録申請のみ操作できます。',
                    ],
                },
            }
        }

        return { ok: true, record: gr }
    },

    type: 'RegistrationReviewUtil',
}
