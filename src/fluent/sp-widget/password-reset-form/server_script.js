/**
 * SC-04 パスワードリセット画面 — サーバースクリプト
 *
 * ③アクション定義
 *   No.1「再設定用リンクを送信」ボタン → パスワードリセット処理（処理No.11）前半：再設定メール送信
 *   No.2「パスワードを更新」ボタン     → パスワードリセット処理（処理No.11）後半：パスワード更新
 *
 * ⑤表示条件
 *   STEP2 はメール内の再設定用リンクを経由してアクセスした場合のみ表示する。
 *
 * アクセス制御（権限設計書 5章／6章）
 *   SC-04 はアノニマス（未認証／トークン）でもアクセス可。
 *   「パスワードを更新」の整理後ロールは「（未認証／一時トークン）」。
 */
;(function () {
    data.sendResult = null
    data.updateResult = null
    data.tokenState = 'none' // 'none' | 'valid' | 'expired' | 'invalid'
    data.token = ''
    data.maskedEmail = ''
    data.loginUrl = '?id=' + (options.login_page || 'login')

    // 初回表示は URL パラメータ、更新時（c.server.update）はクライアントが保持している値を使う
    var token = ''
    if (input && input.token) {
        token = input.token + ''
    } else {
        token = ($sp.getParameter('token') || '') + ''
    }

    if (token) {
        var found = findUserByResetToken(token)
        if (!found) {
            data.tokenState = 'invalid'
        } else if (found.expired) {
            data.tokenState = 'expired'
        } else {
            data.tokenState = 'valid'
            data.token = token
            data.maskedEmail = maskEmail(found.gr.getValue('email'))
        }
    }

    if (input && input.action === 'send_link') {
        data.sendResult = sendResetLink(input)
    } else if (input && input.action === 'update_password') {
        data.updateResult = updatePassword(token, input)
        if (data.updateResult.success) {
            // 使い切りにするためトークンは無効化済み。以降 STEP2 は表示しない。
            data.tokenState = 'used'
            data.token = ''
        }
    }

    // -----------------------------------------------------------------------
    // 処理No.11 前半：再設定メール送信
    // -----------------------------------------------------------------------
    function sendResetLink(input) {
        var email = trim(input.email)

        if (!email) {
            return { success: false, errors: ['メールアドレスを入力してください。'] }
        }
        if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) {
            return { success: false, errors: ['メールアドレスの形式が正しくありません。'] }
        }

        var gr = findUserByEmail(email)
        if (gr) {
            var token = gs.generateGUID() + gs.generateGUID()
            var expiresOn = new GlideDateTime()
            expiresOn.addSeconds((parseInt(options.token_valid_hours, 10) || 24) * 3600)

            gr.setValue('u_password_reset_token', token)
            gr.setValue('u_password_reset_expires_on', expiresOn.getValue())
            if (gr.update()) {
                // 再設定メール送信（処理No.11 前半）を起動する。
                // parm1 に sys_id を渡し、通知側（eventParm1WithRecipient）が宛先として解決する。
                gs.eventQueue('x_dent2_dentsusoke.password.reset', gr, gr.getUniqueValue(), '')
                gs.info('[SKS] パスワード再設定メールを送信しました。user=' + gr.getValue('user_name'))
            } else {
                gs.error('[SKS] 再設定トークンの保存に失敗しました。email=' + email)
            }
        } else {
            // 該当ユーザなし。ログのみ残し、画面には成功時と同じメッセージを返す（下記の注記参照）。
            gs.info('[SKS] パスワード再設定の対象ユーザが見つかりませんでした。')
        }

        /**
         * 画面設計書 ②F1 の入力規則は「メールアドレス形式・登録済みチェック」だが、
         * 登録済みか否かを画面に出すとアカウントの存在有無を第三者が探索できてしまう。
         * そのため該当有無にかかわらず同一の完了メッセージを返す実装としている。
         * TODO(要レビュー): 「登録済みチェック」の結果表示方針（アカウント存在の非開示）を設計へ反映する。
         */
        return { success: true }
    }

    // -----------------------------------------------------------------------
    // 処理No.11 後半：パスワード更新
    // -----------------------------------------------------------------------
    function updatePassword(token, input) {
        var password = input.password === null || input.password === undefined ? '' : input.password + ''
        var passwordConfirm =
            input.password_confirm === null || input.password_confirm === undefined ? '' : input.password_confirm + ''

        var found = findUserByResetToken(token)
        if (!found) {
            return { success: false, errors: ['再設定用のリンクが無効です。お手数ですが再度お手続きをお願いします。'] }
        }
        if (found.expired) {
            return { success: false, errors: ['再設定用リンクの有効期限が切れています。再度お手続きをお願いします。'] }
        }

        var errors = []
        // TODO(SC-04 ②F2 備考): パスワードの桁数・複雑性ルールが未確定。暫定で8文字以上128文字以内とする。
        // SC-03 本登録と同じ基準に揃えている。
        if (!password) {
            errors.push('新しいパスワードを入力してください。')
        } else if (password.length < 8 || password.length > 128) {
            errors.push('パスワードは8文字以上128文字以内で入力してください。')
        }
        if (password && password !== passwordConfirm) {
            errors.push('新しいパスワード（確認）が一致していません。')
        }
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        var gr = found.gr
        /**
         * user_password は「パスワード (1通りの暗号化)」型だが、
         * setValue() で書き込むとハッシュ化されず平文が保存され、
         * 認証時のハッシュ照合に一致しないためログインできない。
         * 項目（GlideElement）の setDisplayValue() を使うとプラットフォームが
         * ハッシュ化して保存する（$s$<salt>=$<hash>= 形式）。
         *
         * 当初 setValue() で実装しており、平文保存とパスワード再設定の不成立が発生していた。
         * SC-03 本登録（signup-form/server_script.js の setPassword）と同じ方法にそろえている。
         */
        gr.user_password.setDisplayValue(password)
        gr.setValue('password_needs_reset', false)
        // トークンは使い切りとし、更新後に無効化する
        gr.setValue('u_password_reset_token', '')
        gr.setValue('u_password_reset_expires_on', '')
        if (!gr.update()) {
            gs.error('[SKS] パスワードの更新に失敗しました。user=' + gr.getValue('user_name'))
            return { success: false, errors: ['パスワードの更新に失敗しました。時間をおいて再度お試しください。'] }
        }

        gs.info('[SKS] パスワードを更新しました。user=' + gr.getValue('user_name'))
        return { success: true }
    }

    /**
     * 再設定対象となる事業者ユーザを解決する。
     * 仮登録のみ（registering）はパスワード未設定、登録不可（rejected）は対象外とする。
     * TODO(IF-01): SSO 認証のユーザはパスワードを持たないため対象外としている。
     *              SAML／OIDC の採用方式確定後に、SSO ユーザへの案内文言を検討する。
     */
    function findUserByEmail(email) {
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.addQuery('email', email)
        gr.addQuery('active', true)
        gr.addQuery('u_auth_method', 'standard')
        gr.addQuery('u_registration_status', 'IN', 'review,defect_request,defect_fixing,registered')
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return null
        }
        return gr
    }

    /** 再設定トークンから対象の事業者ユーザを解決する */
    function findUserByResetToken(token) {
        if (!token || token.length < 32) {
            return null
        }

        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.addQuery('u_password_reset_token', token)
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return null
        }

        var expiresOn = gr.getValue('u_password_reset_expires_on')
        if (expiresOn && new GlideDateTime(expiresOn).compareTo(new GlideDateTime()) < 0) {
            return { expired: true, gr: gr }
        }
        return { expired: false, gr: gr }
    }

    /** 対象アカウントの確認用にメールアドレスを部分マスクして表示する */
    function maskEmail(email) {
        if (!email) {
            return ''
        }
        var parts = (email + '').split('@')
        if (parts.length !== 2) {
            return ''
        }
        var local = parts[0]
        var masked = local.length <= 2 ? local.charAt(0) + '***' : local.substring(0, 2) + '***'
        return masked + '@' + parts[1]
    }

    function trim(value) {
        if (value === null || value === undefined) {
            return ''
        }
        return (value + '').trim()
    }
})()
