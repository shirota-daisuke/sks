/**
 * SC-03 本登録画面 — サーバースクリプト
 *
 * ③アクション定義 No.1「本登録を完了する」ボタン（F5 利用規約同意がチェック済みの場合のみ有効）
 *   本登録処理（処理No.3）を実行（業務フロー上の「登録情報を保存」の最終段階）。
 *   続けて前年登録判定処理（処理No.4）→ 重複チェック処理（処理No.5）を実行し、
 *   業務フロー上の「登録を申請」に相当する操作としてステータスを 登録中 → 登録申請審査中 に遷移する。
 *
 * アクセス制御（権限設計書 SC-03）
 *   仮登録案内メールのリンクに含まれる一時トークンでアクセスする（未認証）。
 *   本登録完了まで applicant ロールは付与しない（事務局の承認時に付与する）。
 */
;(function () {
    data.state = 'invalid' // 'form' | 'done' | 'expired' | 'invalid'
    data.result = null
    data.loginId = ''
    data.email = ''
    data.token = ''
    data.topUrl = '?id=' + (options.top_page || 'x_dent2_dentsusoke_top')
    data.registerUrl = '?id=' + (options.register_page || 'x_dent2_dentsusoke_register')

    // 初回表示は URL パラメータ、更新時（c.server.update）はクライアントが保持している値を使う
    var token = ''
    if (input && input.token) {
        token = input.token + ''
    } else {
        token = ($sp.getParameter('token') || '') + ''
    }

    var found = findUserByToken(token)
    if (!found) {
        return
    }
    if (found.expired) {
        data.state = 'expired'
        return
    }

    data.state = 'form'
    data.token = token
    data.loginId = found.gr.getValue('user_name')
    data.email = found.gr.getValue('email')

    if (input && input.action === 'signup') {
        data.result = completeRegistration(found.gr, input)
        if (data.result.success) {
            data.state = 'done'
        }
    }

    // -----------------------------------------------------------------------
    // 本登録処理（処理No.3）＋ 前年登録判定（処理No.4）＋ 重複チェック（処理No.5）
    // -----------------------------------------------------------------------
    function completeRegistration(userGr, input) {
        var businessName = trim(input.business_name)
        var entityType = trim(input.entity_type)
        var corporateNumber = trim(input.corporate_number)
        var password = input.password === null || input.password === undefined ? '' : input.password + ''
        var passwordConfirm =
            input.password_confirm === null || input.password_confirm === undefined ? '' : input.password_confirm + ''
        var agreed = input.agreed === true || input.agreed === 'true'

        var errors = validate(businessName, entityType, corporateNumber, password, passwordConfirm, agreed)
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        // 処理No.5 重複チェック（事業者レコード作成前に既存データと照合する）
        // 判定ロジックは登録不備修正（処理No.7）でも再実行するため Script Include に集約している
        var duplicateUtil = new x_dent2_dentsusoke.RegistrationDuplicateUtil()
        var duplicate = duplicateUtil.checkDuplicate(entityType, corporateNumber, businessName, '')

        // 処理No.4 前年登録判定
        var priorYear = duplicateUtil.judgePriorYearRegistration(corporateNumber, '')

        // 処理No.3 本登録処理：事業者レコードを作成する
        var entityGr = new GlideRecord('x_dent2_dentsusoke_entity')
        entityGr.initialize()
        entityGr.setValue('u_business_name', businessName)
        entityGr.setValue('u_entity_type', entityType)
        entityGr.setValue('u_corporate_number', corporateNumber)
        // 所在地・業種はテーブル定義書では必須だが、SC-03 の入力項目に含まれないため未設定のまま作成する
        // （SC-06 自分の情報／申請情報入力（処理No.16）で登録する運用を想定）。
        // TODO(要レビュー): テーブル定義書 T01 の必須指定と SC-03 の入力項目の整合。
        if (priorYear.matched) {
            entityGr.setValue('u_prior_year_awarded_flag', true)
            if (priorYear.awardNumber) {
                entityGr.setValue('u_prior_year_award_number', priorYear.awardNumber)
            }
            if (priorYear.salesforceAccountId) {
                entityGr.setValue('u_salesforce_account_id', priorYear.salesforceAccountId)
            }
        }
        var entityId = entityGr.insert()

        if (!entityId) {
            gs.error('[SKS] 事業者レコードの作成に失敗しました。login_id=' + userGr.getValue('user_name'))
            return { success: false, errors: ['本登録に失敗しました。時間をおいて再度お試しください。'] }
        }

        // 処理No.3 本登録処理：仮登録レコードを本登録済みの事業者ユーザへ更新する
        userGr.setValue('u_business_entity', entityId)
        setPassword(userGr, password)
        userGr.setValue('password_needs_reset', false)
        userGr.setValue('u_duplicate_check_result', duplicate.result)
        userGr.setValue('u_registration_status', 'review') // 登録中 → 登録申請審査中
        userGr.setValue('u_registration_requested_on', new GlideDateTime().getValue())
        // トークンは使い切りとし、本登録完了後に無効化する
        userGr.setValue('u_registration_token', '')
        userGr.setValue('u_registration_token_expires_on', '')
        if (!userGr.update()) {
            gs.error('[SKS] 事業者ユーザの本登録更新に失敗しました。login_id=' + userGr.getValue('user_name'))
            return { success: false, errors: ['本登録に失敗しました。時間をおいて再度お試しください。'] }
        }

        gs.info(
            '[SKS] 本登録を受け付けました。login_id=' +
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
            priorYearMatched: priorYear.matched,
        }
    }

    /**
     * ログインパスワードを設定する（一方向ハッシュで保存する）。
     *
     * user_password は「パスワード (1通りの暗号化)」型だが、
     * setValue() で書き込むとハッシュ化されず平文がそのまま保存され、
     * 認証時のハッシュ照合に一致しないためログインできない。
     * 項目（GlideElement）の setDisplayValue() を使うとプラットフォームが
     * ハッシュ化して保存する（$s$<salt>=$<hash>= 形式）。
     *
     * 当初 setValue() で実装しており、平文保存とログイン不可が発生していた。
     * 書き込み方法4通りを実測して確認した結果は次のとおり
     * （調査は ATF テストで実施。src/fluent/tests/sc03-password.now.ts が再発を検知する）。
     *   setValue('user_password', pw)              → 平文
     *   gr.setDisplayValue('user_password', pw)    → スコープアプリでは使用不可（例外）
     *   gr.user_password.setDisplayValue(pw)       → ハッシュ（これを使う）
     *   gr.user_password = pw                      → 平文
     */
    function setPassword(userGr, password) {
        userGr.user_password.setDisplayValue(password)
    }

    function validate(businessName, entityType, corporateNumber, password, passwordConfirm, agreed) {
        var errors = []

        if (!businessName) {
            errors.push('事業者名（法人名／屋号）を入力してください。')
        } else if (businessName.length > 100) {
            errors.push('事業者名は100文字以内で入力してください。')
        }

        if (entityType !== 'corporate' && entityType !== 'sole_proprietor') {
            errors.push('事業者区分を選択してください。')
        }

        // TODO(Q01): 重複判定の主キーが未確定。暫定として
        //   法人         → 法人番号13桁（数字）
        //   個人事業主   → 本人識別情報（半角英数字13桁以内）
        // としている。
        if (!corporateNumber) {
            errors.push('法人番号／本人識別情報を入力してください。')
        } else if (entityType === 'corporate' && !/^[0-9]{13}$/.test(corporateNumber)) {
            errors.push('法人番号は13桁の数字で入力してください。')
        } else if (entityType === 'sole_proprietor' && !/^[0-9A-Za-z]{1,13}$/.test(corporateNumber)) {
            errors.push('本人識別情報は半角英数字13桁以内で入力してください。')
        }

        // TODO(SC-03 ②F2 備考): パスワードの桁数・複雑性ルールが未確定。暫定で8文字以上128文字以内とする。
        if (!password) {
            errors.push('パスワードを入力してください。')
        } else if (password.length < 8 || password.length > 128) {
            errors.push('パスワードは8文字以上128文字以内で入力してください。')
        }
        if (password && password !== passwordConfirm) {
            errors.push('パスワード（確認）が一致していません。')
        }

        if (!agreed) {
            errors.push('利用規約に同意してください。')
        }

        return errors
    }

    /** 仮登録トークンから対象の事業者ユーザを解決する */
    function findUserByToken(token) {
        if (!token || token.length < 32) {
            return null
        }

        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.addQuery('u_registration_token', token)
        gr.addQuery('u_registration_status', 'registering')
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return null
        }

        var expiresOn = gr.getValue('u_registration_token_expires_on')
        if (expiresOn && new GlideDateTime(expiresOn).compareTo(new GlideDateTime()) < 0) {
            return { expired: true, gr: gr }
        }
        return { expired: false, gr: gr }
    }

    function trim(value) {
        if (value === null || value === undefined) {
            return ''
        }
        return (value + '').trim()
    }
})()
