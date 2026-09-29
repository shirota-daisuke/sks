/**
 * SC-09 お知らせ詳細画面 — サーバースクリプト
 *
 * ②表示項目
 *   D1 タイトル／重要度／公開日 … お知らせ作成処理（処理No.39）、重要度設定処理（処理No.44）
 *   D2 本文（リッチテキスト表示） … お知らせ作成処理（処理No.39）
 *
 * 対象のお知らせは URL パラメータ sys_id で指定される。
 * 公開範囲・公開期間の判定は NoticeUtil に集約しており、自分に公開されていないお知らせは表示しない。
 */
;(function () {
    data.isApplicant = false
    data.found = false
    data.message = ''
    data.notice = null
    data.markedRead = false
    data.listUrl = '?id=' + (options.list_page || 'x_dent2_dentsusoke_notices')

    var ctx = new x_dent2_dentsusoke.PortalContextUtil()
    var entityId = ctx.getMyEntityId()
    if (!entityId) {
        data.message = 'このページは事業者ユーザ向けです。事業者情報が紐づいたアカウントでログインしてください。'
        return
    }
    data.isApplicant = true

    var sysId = ($sp.getParameter('sys_id') || '') + ''
    if (!sysId) {
        data.message = '表示するお知らせが指定されていません。'
        return
    }

    var noticeUtil = new x_dent2_dentsusoke.NoticeUtil()
    var entityType = ctx.getMyEntityType()
    var userId = gs.getUserID()

    // 単一レコード取得だが get() は使用しない（トンマナ 3.2.3 の例外）。
    // get() では applyVisibilityQuery の条件（公開状態・公開期間・公開範囲）が適用されず、
    // sys_id を知っていれば非公開のお知らせも閲覧できてしまうため、クエリ側で担保する。
    var gr = new GlideRecord('x_dent2_dentsusoke_notice')
    noticeUtil.applyVisibilityQuery(gr, entityType)
    gr.addQuery('sys_id', sysId)
    gr.setLimit(1)
    gr.query()
    if (!gr.next()) {
        data.message = 'お知らせが見つかりません。公開が終了した可能性があります。'
        return
    }

    data.found = true
    var priority = gr.getValue('u_priority')
    data.notice = {
        sys_id: gr.getUniqueValue(),
        title: gr.getValue('u_title'),
        priority: priority,
        // 画面イメージ SC-09 では重要度「高」を「重要」と表記しているため、高のみ表記を差し替える
        priorityLabel: priority === 'high' ? options.high_priority_label || '重要' : gr.getDisplayValue('u_priority'),
        priorityClass: x_dent2_dentsusoke.NoticeUtil.PRIORITY_LABEL_CLASSES[priority] || 'label-default',
        publishDate: noticeUtil.formatDate(gr.getValue('u_publish_start_date')),
        publishEndDate: noticeUtil.formatDate(gr.getValue('u_publish_end_date')),
        // D2 本文はリッチテキスト。テンプレート側で ng-bind-html（ngSanitize）により描画する
        body: gr.getValue('u_body') || '',
    }

    /**
     * 既読化（処理No.43）。
     * TODO(SC-09 ⑥確認事項): 既読化のタイミング（一覧クリック時／詳細画面表示時）が未確定。
     * 現在は SC-08 一覧のクリック時に既読化しているため、本画面での既読化は既定で無効。
     * 「詳細画面表示時」に決まった場合は本オプションを有効にする（一覧側の処理は残しても冪等）。
     */
    if (options.mark_read_on_view === true || options.mark_read_on_view === 'true') {
        var result = noticeUtil.markAsRead(data.notice.sys_id, entityType, userId)
        data.markedRead = !!(result && result.success)
    }
})()
