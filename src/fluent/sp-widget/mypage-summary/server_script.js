/**
 * SC-05 マイページ サマリカード — サーバースクリプト
 *
 * 表示項目（画面設計書 SC-05 ②表示項目一覧）
 *   D1 申請ステータス（カード）… 処理No.22 の値を事業者用ステータス表記で表示
 *   D2 未読のお知らせ件数（カード）… 処理No.43 の集計値
 *   D3 未対応の問合せ件数（カード）… 問合せデータの未回答件数を集計
 */
;(function () {
    // すべての data.* を初期化する（テンプレート側の undefined 参照を防ぐ）
    data.isApplicant = false
    data.message = ''
    data.applicationNumber = ''
    data.statusLabel = ''
    data.statusTone = 'neutral'
    data.unreadNoticeCount = 0
    data.openInquiryCount = 0

    // カードの遷移先（ポータルのページID）
    data.applicationUrl = '?id=' + (options.application_page || 'x_dent2_dentsusoke_apps')
    data.noticeUrl = '?id=' + (options.notice_page || 'x_dent2_dentsusoke_notices')
    data.inquiryUrl = '?id=' + (options.inquiry_page || 'x_dent2_dentsusoke_inquiries')

    var ctx = new x_dent2_dentsusoke.PortalContextUtil()
    var entityId = ctx.getMyEntityId()

    if (!entityId) {
        // 事務局ユーザ・システム管理者など、事業者に紐づかないユーザがアクセスした場合
        data.message = 'このページは事業者ユーザ向けです。事業者情報が紐づいたアカウントでログインしてください。'
        return
    }

    data.isApplicant = true

    // --- D1 申請ステータス -------------------------------------------------
    // 事業者に複数申請がある場合は最終更新が最も新しい申請を代表として表示する
    var statusUtil = new x_dent2_dentsusoke.ApplicationStatusUtil()
    var appGr = new GlideRecord('x_dent2_dentsusoke_request')
    appGr.addQuery('u_business_entity', entityId)
    appGr.orderByDesc('sys_updated_on')
    appGr.setLimit(1)
    appGr.query()

    if (appGr.next()) {
        var status = appGr.getValue('u_application_status')
        data.applicationNumber = appGr.getValue('u_application_number')
        data.statusLabel = statusUtil.getApplicantLabel(status)
        data.statusTone = statusUtil.getTone(status)
    } else {
        data.statusLabel = '申請なし'
        data.statusTone = 'neutral'
    }

    // --- D2 未読のお知らせ件数 ---------------------------------------------
    // 公開範囲判定と未読件数の算出は NoticeUtil に集約している（SC-08 と共通）。
    data.unreadNoticeCount = new x_dent2_dentsusoke.NoticeUtil().countUnread(ctx.getMyEntityType(), gs.getUserID())

    // --- D3 未対応の問合せ件数 ---------------------------------------------
    var inquiryAgg = new GlideAggregate('x_dent2_dentsusoke_inquiry')
    inquiryAgg.addQuery('u_business_entity', entityId)
    inquiryAgg.addQuery('u_state', 'open')
    inquiryAgg.addAggregate('COUNT')
    inquiryAgg.query()
    if (inquiryAgg.next()) {
        data.openInquiryCount = parseInt(inquiryAgg.getAggregate('COUNT'), 10) || 0
    }

})()
