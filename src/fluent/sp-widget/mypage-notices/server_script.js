/**
 * SC-05 マイページ「最近のお知らせ」 — サーバースクリプト
 *
 * 表示項目 D4（重要度／タイトル／公開日、最大3件）
 * アクション：お知らせ行クリック → 既読／未読情報取得処理（処理No.43）→ SC-09 お知らせ詳細へ遷移
 *
 * 公開範囲判定（処理No.40／41）と既読化（処理No.43）は NoticeUtil に集約している
 * （SC-08 お知らせ一覧と同一ロジックを共通利用する）。
 */
;(function () {
    data.isApplicant = false
    data.notices = []
    data.detailPage = options.detail_page || 'x_dent2_dentsusoke_notice'
    data.listUrl = '?id=' + (options.notice_page || 'x_dent2_dentsusoke_notices')
    data.markReadResult = null

    var ctx = new x_dent2_dentsusoke.PortalContextUtil()
    var entityId = ctx.getMyEntityId()
    if (!entityId) {
        return
    }
    data.isApplicant = true

    var noticeUtil = new x_dent2_dentsusoke.NoticeUtil()
    var entityType = ctx.getMyEntityType()
    var userId = gs.getUserID()
    var maxRecords = parseInt(options.max_records, 10) || 3

    // クライアントからの既読化要求（処理No.43）
    if (input && input.action === 'mark_read' && input.notice_id) {
        data.markReadResult = noticeUtil.markAsRead(input.notice_id + '', entityType, userId)
    }

    // --- D4 最近のお知らせ ---------------------------------------------------
    var rows = noticeUtil.list(entityType, userId, maxRecords, 'publish_date')
    for (var i = 0; i < rows.length; i++) {
        rows[i].url = '?id=' + data.detailPage + '&sys_id=' + rows[i].sys_id
        data.notices.push(rows[i])
    }
})()
