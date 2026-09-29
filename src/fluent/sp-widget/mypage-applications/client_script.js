/**
 * SC-05 マイページ「申請状況」 — クライアントスクリプト
 * 参照専用のため、サーバーとの追加やり取りは行わない。
 */
api.controller = function () {
    var c = this

    c.hasApplications = function () {
        return !!(c.data.applications && c.data.applications.length)
    }
}
