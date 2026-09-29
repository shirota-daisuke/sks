/**
 * SC-04 パスワードリセット画面 — クライアントスクリプト
 *
 * ③アクション No.1「再設定用リンクを送信」→ 画面内に送信完了メッセージを表示
 * ③アクション No.2「パスワードを更新」    → 更新後 SC-01 ログイン画面へ遷移
 */
api.controller = function ($window, $timeout) {
    var c = this

    c.sending = false
    c.updating = false
    c.sendErrors = []
    c.updateErrors = []
    c.sent = false

    c.step1 = { email: '' }
    c.step2 = { password: '', password_confirm: '' }

    c.passwordMismatch = function () {
        return (
            !!c.step2.password && !!c.step2.password_confirm && c.step2.password !== c.step2.password_confirm
        )
    }

    /** STEP1：再設定用リンクを送信 */
    c.sendLink = function () {
        c.sendErrors = []
        if (!c.step1.email || c.sending) {
            return
        }
        c.sending = true

        // c.server.update() は呼び出し時点の c.data を input として送るため、先に c.data へ載せる
        c.data.action = 'send_link'
        c.data.email = c.step1.email

        c.server.update().then(function () {
            c.sending = false
            c.data.action = null
            c.data.email = null

            var result = c.data.sendResult
            if (result && result.success) {
                c.sent = true
                c.step1.email = ''
            } else if (result && result.errors) {
                c.sendErrors = result.errors
            }
        })
    }

    /** STEP2：パスワードを更新 */
    c.updatePassword = function () {
        c.updateErrors = []
        if (!c.step2.password || !c.step2.password_confirm || c.passwordMismatch() || c.updating) {
            return
        }
        c.updating = true

        c.data.action = 'update_password'
        c.data.password = c.step2.password
        c.data.password_confirm = c.step2.password_confirm

        c.server.update().then(function () {
            c.updating = false
            c.data.action = null
            // パスワードをクライアント側・data 上に残さない
            c.data.password = null
            c.data.password_confirm = null
            c.step2 = { password: '', password_confirm: '' }

            var result = c.data.updateResult
            if (result && result.success) {
                // 完了メッセージを一瞬表示したうえで SC-01 ログイン画面へ遷移する
                $timeout(function () {
                    $window.location.href = c.data.loginUrl
                }, 1500)
            } else if (result && result.errors) {
                c.updateErrors = result.errors
            }
        })
    }
}
