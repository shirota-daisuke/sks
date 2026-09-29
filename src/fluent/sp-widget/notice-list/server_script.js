/**
 * SC-08 お知らせ一覧画面 — サーバースクリプト
 *
 * ②表示項目 D1：状態（未読／既読）／重要度／タイトル／公開日
 *   お知らせ作成処理（処理No.39）、既読／未読情報取得処理（処理No.43）
 * ③アクション No.1：行クリック → 既読／未読情報取得処理（処理No.43）→ SC-09 お知らせ詳細画面へ遷移
 * ⑤表示条件：公開範囲設定（処理No.40）に合致するお知らせのみ表示する
 *
 * 公開範囲判定・既読化は NoticeUtil に集約している（SC-05 マイページと共通）。
 */
;(function () {
    data.isApplicant = false
    data.message = ''
    data.notices = []
    data.totalCount = 0
    data.unreadCount = 0
    data.truncated = false
    data.markReadResult = null
    data.detailPage = options.detail_page || 'x_dent2_dentsusoke_notice'

    var ctx = new x_dent2_dentsusoke.PortalContextUtil()
    var entityId = ctx.getMyEntityId()
    if (!entityId) {
        data.message = 'このページは事業者ユーザ向けです。事業者情報が紐づいたアカウントでログインしてください。'
        return
    }
    data.isApplicant = true

    var noticeUtil = new x_dent2_dentsusoke.NoticeUtil()
    var entityType = ctx.getMyEntityType()
    var userId = gs.getUserID()
    var maxRecords = parseInt(options.max_records, 10) || 50

    // クライアントからの既読化要求（処理No.43）
    if (input && input.action === 'mark_read' && input.notice_id) {
        data.markReadResult = noticeUtil.markAsRead(input.notice_id + '', entityType, userId)
    }

    // TODO(SC-08 ⑥確認事項): 絞込要件の詳細が未確定のため絞込UIは実装しない。
    // 並び替えはウィジェットオプション（公開日／重要度）で切り替えられるようにしている。
    var rows = noticeUtil.list(entityType, userId, maxRecords, options.sort || 'publish_date')

    for (var i = 0; i < rows.length; i++) {
        rows[i].url = '?id=' + data.detailPage + '&sys_id=' + rows[i].sys_id
        data.notices.push(rows[i])
    }

    data.totalCount = noticeUtil.countVisible(entityType)
    data.unreadCount = noticeUtil.countUnread(entityType, userId)
    // 件数上限で切り捨てた場合は画面に明示する（黙って切らない）
    data.truncated = data.totalCount > data.notices.length
})()
