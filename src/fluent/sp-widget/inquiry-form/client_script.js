/**
 * SC-10 問合せ一覧・作成画面 — クライアントスクリプト
 *
 * ③アクション No.1「送信する」→ 問合せ作成処理（処理No.46）。左側の履歴に追加表示される。
 * ③アクション No.2 問合せ履歴行クリック → 右側パネルに問合せ詳細・返信内容を表示する。
 */
api.controller = function () {
    var c = this

    // 右側パネルの表示内容：'new'（新規問合せ）／'detail'（問合せ詳細）
    c.panel = 'new'
    c.submitting = false
    c.loading = false
    c.serverErrors = []
    c.created = false

    c.form = { subject: '', description: '' }

    c.isSelected = function (inquiry) {
        return !!c.data.selected && c.data.selected.sys_id === inquiry.sys_id
    }

    /** ③No.1「送信する」 */
    c.submit = function () {
        c.serverErrors = []
        c.created = false
        if (!c.form.subject || !c.form.description || c.submitting) {
            return
        }
        c.submitting = true

        // c.server.update() は呼び出し時点の c.data を input として送るため、先に c.data へ載せる
        c.data.action = 'create'
        c.data.subject = c.form.subject
        c.data.description = c.form.description

        c.server.update().then(function () {
            c.submitting = false
            c.data.action = null

            var result = c.data.createResult
            if (result && result.success) {
                c.form = { subject: '', description: '' }
                c.created = true
                // 送信した問合せの詳細を表示する
                c.panel = 'detail'
            } else if (result && result.errors) {
                c.serverErrors = result.errors
            }
        })
    }

    /** ③No.2 問合せ履歴行クリック */
    c.showDetail = function (inquiry) {
        if (!inquiry || c.loading) {
            return
        }
        c.loading = true
        c.created = false
        c.serverErrors = []

        c.data.selected_id = inquiry.sys_id

        c.server.update().then(function () {
            c.loading = false
            c.panel = 'detail'
        })
    }

    /** 新規問合せフォームへ戻る */
    c.showNewForm = function () {
        c.created = false
        c.serverErrors = []
        c.panel = 'new'
    }
}
