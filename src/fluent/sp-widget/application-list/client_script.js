/**
 * SC-07 申請状況一覧・詳細画面 — クライアントスクリプト
 *
 * ③アクション No.1「詳細」リンク → 画面下段に詳細パネルを表示（サーバーから詳細を取得）
 * ③アクション No.2「不備を修正する」→ 申請入力機能（ITCOM主担当）へ遷移
 * ③アクション No.3「取下げる」（検討中）→ 申請取下げ処理（処理No.21）
 */
api.controller = function ($window) {
    var c = this

    c.loading = false
    c.withdrawing = false
    c.withdrawErrors = []

    /** 一覧で選択中の申請かどうか（行のハイライト用） */
    c.isSelected = function (app) {
        return !!c.data.selected && c.data.selected.sys_id === app.sys_id
    }

    /** ③No.1「詳細」リンク */
    c.showDetail = function (app) {
        if (!app || c.loading || c.isSelected(app)) {
            return
        }
        c.loading = true
        c.withdrawErrors = []

        // c.server.update() は呼び出し時点の c.data を input として送るため、先に c.data へ載せる
        c.data.selected_id = app.sys_id

        c.server.update().then(function () {
            c.loading = false
        })
    }

    /** ③No.2「不備を修正する」 */
    c.fixDefect = function () {
        if (!c.data.selected || !c.data.selected.fixUrl) {
            return
        }
        $window.location.href = c.data.selected.fixUrl
    }

    /** ③No.3「取下げる」 */
    c.withdraw = function () {
        if (!c.data.selected || c.withdrawing) {
            return
        }
        if (!$window.confirm('この申請を取下げます。取下げ後は元に戻せません。よろしいですか？')) {
            return
        }

        c.withdrawing = true
        c.withdrawErrors = []
        c.data.action = 'withdraw'
        c.data.sys_id = c.data.selected.sys_id
        c.data.selected_id = c.data.selected.sys_id

        c.server.update().then(function () {
            c.withdrawing = false
            c.data.action = null

            var result = c.data.withdrawResult
            if (result && !result.success && result.errors) {
                c.withdrawErrors = result.errors
            }
        })
    }
}
