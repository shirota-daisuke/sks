/**
 * SC-05 マイページ サマリカード — クライアントスクリプト
 * 表示のみのウィジェットのため、サーバーとの追加やり取りは行わない。
 */
api.controller = function () {
    var c = this

    /** カードに表示する件数（0件でもカード自体は表示する：画面設計書 SC-05 ②D2/D3） */
    c.hasUnreadNotice = function () {
        return c.data.unreadNoticeCount > 0
    }

    c.hasOpenInquiry = function () {
        return c.data.openInquiryCount > 0
    }
}
