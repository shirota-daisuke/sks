/**
 * SC-02 仮登録画面 — クライアントスクリプト
 *
 * ③アクション No.1「仮登録する」ボタン → サーバーで仮登録受付処理（処理No.1）を実行し、
 * 成功時は画面内に仮登録完了メッセージを表示する（画面遷移はしない）。
 */
api.controller = function () {
    var c = this

    c.view = 'form' // 'form' | 'done'
    c.submitting = false
    c.serverErrors = []
    c.registeredEmail = ''

    c.form = {
        login_id: '',
        email: '',
    }

    c.submit = function () {
        c.serverErrors = []
        if (!c.form.login_id || !c.form.email) {
            return
        }

        c.submitting = true

        // c.server.update() は呼び出し時点の c.data を input として送るため、先に c.data へ載せる
        c.data.action = 'register'
        c.data.login_id = c.form.login_id
        c.data.email = c.form.email

        c.server.update().then(function () {
            c.submitting = false
            c.data.action = null

            var result = c.data.result
            if (result && result.success) {
                c.registeredEmail = result.email
                c.view = 'done'
                c.form = { login_id: '', email: '' }
            } else if (result && result.errors) {
                c.serverErrors = result.errors
            } else {
                c.serverErrors = ['仮登録に失敗しました。時間をおいて再度お試しください。']
            }
        })
    }
}
