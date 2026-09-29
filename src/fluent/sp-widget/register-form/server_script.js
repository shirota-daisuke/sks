/**
 * SC-02 仮登録画面 — サーバースクリプト
 *
 * ③アクション定義 No.1「仮登録する」ボタン
 *   仮登録受付処理（処理No.1）を実行し、本登録案内メール送信処理（処理No.2）を起動する。
 *   業務フロー上のアクション「新規ユーザー登録を開始」に相当し、
 *   ユーザ登録ステータスを 未登録 → 登録中 に遷移させる。
 *
 * 未ログイン（guest）で実行されるため、入力検証と重複チェックはすべてサーバー側で行う。
 *
 * TODO: 未認証で書き込みが発生するエンドポイントであるため、本番相当ではスパム・総当たり対策
 *       （CAPTCHA、同一IPからの連続登録のレート制限等）が必要。本検証では未実装。
 */
;(function () {
    data.result = null
    data.noticeMessage =
        options.notice_message || 'ご入力のメールアドレス宛に、本登録用のご案内をお送りします。'

    if (input && input.action === 'register') {
        data.result = acceptTemporaryRegistration(input)
    }

    /** 仮登録受付処理（処理No.1） */
    function acceptTemporaryRegistration(input) {
        var loginId = trim(input.login_id)
        var email = trim(input.email)

        var errors = validate(loginId, email)
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        // ログインIDはインスタンス全体（sys_user）で一意
        // Q06 暫定推奨案「ログインIDなら全体一意」に対応
        if (existsLoginId(loginId)) {
            return { success: false, errors: ['このログインIDは既に使用されています。別のIDをご入力ください。'] }
        }

        // TODO(Q06): メールアドレスの一意性ルールが未確定。
        // 暫定として、登録手続き中／登録済のユーザに同一メールアドレスがある場合は受け付けない。
        if (existsActiveEmail(email)) {
            return {
                success: false,
                errors: [
                    'このメールアドレスは既に登録手続き中、または登録済です。案内メールが届かない場合は事務局へお問い合わせください。',
                ],
            }
        }

        var token = gs.generateGUID() + gs.generateGUID()
        var expiresOn = new GlideDateTime()
        expiresOn.addDaysLocalTime(parseInt(options.token_valid_days, 10) || 7)

        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', loginId)
        gr.setValue('email', email)
        gr.setValue('u_registration_status', 'registering') // 未登録 → 登録中
        gr.setValue('u_auth_method', 'standard')
        gr.setValue('u_registration_token', token)
        gr.setValue('u_registration_token_expires_on', expiresOn.getValue())
        var sysId = gr.insert()

        if (!sysId) {
            gs.error('[SKS] 仮登録レコードの作成に失敗しました。login_id=' + loginId)
            return { success: false, errors: ['仮登録に失敗しました。時間をおいて再度お試しください。'] }
        }

        // 本登録案内メール送信処理（処理No.2）を起動する。
        // parm1 に sys_id を渡し、通知側（eventParm1WithRecipient）が宛先として解決する。
        gs.eventQueue('x_dent2_dentsusoke.registration.invite', gr, sysId, '')

        gs.info('[SKS] 仮登録を受け付けました。login_id=' + loginId)
        return { success: true, email: email }
    }

    function validate(loginId, email) {
        var errors = []

        // TODO(SC-02 確認事項): ログインIDの命名規則（使用可能文字・桁数）が未確定。
        // 画面設計書 F1 の「半角英数字（4～20桁）」を暫定仕様とする。
        if (!loginId) {
            errors.push('ログインIDを入力してください。')
        } else if (!/^[0-9A-Za-z]{4,20}$/.test(loginId)) {
            errors.push('ログインIDは半角英数字4～20桁で入力してください。')
        }

        if (!email) {
            errors.push('メールアドレスを入力してください。')
        } else if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) {
            errors.push('メールアドレスの形式が正しくありません。')
        } else if (email.length > 256) {
            errors.push('メールアドレスは256文字以内で入力してください。')
        }

        return errors
    }

    function existsLoginId(loginId) {
        var gr = new GlideRecord('sys_user')
        gr.addQuery('user_name', loginId)
        gr.setLimit(1)
        gr.query()
        return gr.hasNext()
    }

    function existsActiveEmail(email) {
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.addQuery('email', email)
        gr.addQuery('u_registration_status', 'IN', 'registering,review,defect_request,defect_fixing,registered')
        gr.setLimit(1)
        gr.query()
        return gr.hasNext()
    }

    function trim(value) {
        if (value === null || value === undefined) {
            return ''
        }
        return (value + '').trim()
    }
})()
