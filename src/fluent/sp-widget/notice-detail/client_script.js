/**
 * SC-09 お知らせ詳細画面 — クライアントスクリプト
 *
 * ③アクション No.1「一覧へ戻る」ボタンは href による画面遷移のみのため、
 * サーバーとの追加やり取りは行わない。
 */
api.controller = function () {
    var c = this

    c.hasBody = function () {
        return !!(c.data.notice && c.data.notice.body)
    }
}
