/**
 * SC-08 お知らせ一覧画面 — クライアントスクリプト
 *
 * ③アクション No.1「行クリック」
 *   既読／未読情報取得処理（処理No.43）を実行したうえで SC-09 お知らせ詳細画面へ遷移する。
 */
api.controller = function ($window) {
    var c = this

    c.navigating = false

    c.openNotice = function (notice) {
        if (!notice || c.navigating) {
            return
        }
        c.navigating = true

        // 既読の場合は既読化を省略し、そのまま詳細へ遷移する
        if (notice.read) {
            $window.location.href = notice.url
            return
        }

        // c.server.update() は呼び出し時点の c.data を input として送るため、先に c.data へ載せる
        c.data.action = 'mark_read'
        c.data.notice_id = notice.sys_id

        c.server.update().then(function () {
            c.data.action = null
            c.data.notice_id = null
            $window.location.href = notice.url
        })
    }
}
