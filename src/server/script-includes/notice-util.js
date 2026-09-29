/**
 * NoticeUtil
 *
 * お知らせ（T10）の公開範囲判定と既読／未読の管理をまとめたユーティリティ。
 *   ・公開範囲設定処理（処理No.40）／公開期間設定処理（処理No.41）に基づく可視条件
 *   ・既読／未読情報取得処理（処理No.43）
 *
 * SC-05 マイページ（最近のお知らせ・未読件数）と SC-08 お知らせ一覧で同じ判定を使うため、
 * ウィジェット側に同じロジックを二重に持たせない目的で切り出している。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない。
 */
var NoticeUtil = Class.create()

/** 重要度 → Bootstrap3 ラベルクラス（テンプレート側で ng-class にバインドする） */
NoticeUtil.PRIORITY_LABEL_CLASSES = {
    high: 'label-danger',
    middle: 'label-info',
    low: 'label-default',
}

/**
 * 未読件数の集計上限の既定値。
 * 実効値はシステムプロパティ x_dent2_dentsusoke.notice.max_visible_for_count で変更できる
 * （トンマナ 3.4.4「設定値の外部化」／プロパティ定義は src/fluent/common/portal-properties.now.ts）。
 * Script Include はウィジェットオプションを持たないため、プロパティで外部化している。
 */
NoticeUtil.DEFAULT_MAX_VISIBLE_FOR_COUNT = 500

/** 未読件数の集計上限（プロパティ優先。未作成・不正値の場合は既定値を使用する） */
NoticeUtil.getMaxVisibleForCount = function () {
    var configured = parseInt(gs.getProperty('x_dent2_dentsusoke.notice.max_visible_for_count', ''), 10)
    if (isNaN(configured) || configured <= 0) {
        return NoticeUtil.DEFAULT_MAX_VISIBLE_FOR_COUNT
    }
    return configured
}

NoticeUtil.prototype = {
    initialize: function () {},

    /**
     * 事業者が閲覧できるお知らせの条件を GlideRecord に適用する。
     * TODO(処理No.40): 設計上は「申請ステータス、その他管理項目」による公開範囲設定も想定されているが、
     *   テーブル定義書 T10 に該当項目がないため、事業者区分（法人／個人／全体）と公開状態・公開期間のみで判定する。
     * @param gr お知らせテーブルの GlideRecord
     * @param entityType 事業者区分（corporate / sole_proprietor）。空の場合は「全体」のみ対象
     */
    applyVisibilityQuery: function (gr, entityType) {
        var today = new GlideDate().getValue()
        gr.addQuery('u_publish_status', 'published')
        gr.addQuery('u_publish_start_date', '<=', today)
        gr.addQuery('u_publish_end_date', '>=', today)
        var scopeQuery = gr.addQuery('u_visibility_scope', 'all')
        if (entityType) {
            scopeQuery.addOrCondition('u_visibility_scope', entityType)
        }
        return gr
    },

    /** 閲覧可能なお知らせの総件数 */
    countVisible: function (entityType) {
        var agg = new GlideAggregate('x_dent2_dentsusoke_notice')
        this.applyVisibilityQuery(agg, entityType)
        agg.addAggregate('COUNT')
        agg.query()
        if (agg.next()) {
            return parseInt(agg.getAggregate('COUNT'), 10) || 0
        }
        return 0
    },

    /**
     * 未読件数（既読／未読情報取得処理：処理No.43 の集計）。
     * 閲覧可能な件数から、既読行が存在する件数を差し引いて求める。
     * 既読行はお知らせを開いた時点でのみ作られるため、行が無い＝未読として扱う。
     */
    countUnread: function (entityType, userId) {
        var visibleIds = this.getVisibleIds(entityType, NoticeUtil.getMaxVisibleForCount())
        if (visibleIds.length === 0) {
            return 0
        }

        var readCount = 0
        var agg = new GlideAggregate('x_dent2_dentsusoke_read')
        agg.addQuery('u_applicant_user', userId)
        agg.addQuery('u_read_flag', true)
        agg.addQuery('u_notice', 'IN', visibleIds.join(','))
        agg.addAggregate('COUNT')
        agg.query()
        if (agg.next()) {
            readCount = parseInt(agg.getAggregate('COUNT'), 10) || 0
        }

        return Math.max(0, visibleIds.length - readCount)
    },

    /** 閲覧可能なお知らせの sys_id 一覧 */
    getVisibleIds: function (entityType, limit) {
        var ids = []
        var gr = new GlideRecord('x_dent2_dentsusoke_notice')
        this.applyVisibilityQuery(gr, entityType)
        gr.setLimit(limit || NoticeUtil.getMaxVisibleForCount())
        gr.query()
        while (gr.next()) {
            ids.push(gr.getUniqueValue())
        }
        return ids
    },

    /**
     * 閲覧可能なお知らせの一覧を返す（既読状態を付与）。
     * @param entityType 事業者区分
     * @param userId 既読判定の対象ユーザ
     * @param limit 取得件数
     * @param sort 'publish_date'（公開日降順・既定）または 'priority'（重要度→公開日降順）
     */
    list: function (entityType, userId, limit, sort) {
        var rows = []
        var ids = []

        var gr = new GlideRecord('x_dent2_dentsusoke_notice')
        this.applyVisibilityQuery(gr, entityType)
        if (sort === 'priority') {
            // 重要度は high / middle / low の順に並べたいが選択リスト値の辞書順とは一致しないため、
            // 表示順を持つ sequence ではなく値でのソートは行わず、重要度ごとの優先度を後段で付与する。
            gr.orderBy('u_priority')
            gr.orderByDesc('u_publish_start_date')
        } else {
            gr.orderByDesc('u_publish_start_date')
        }
        gr.setLimit(limit || 20)
        gr.query()

        while (gr.next()) {
            var noticeId = gr.getUniqueValue()
            ids.push(noticeId)
            rows.push({
                sys_id: noticeId,
                title: gr.getValue('u_title'),
                priority: gr.getValue('u_priority'),
                priorityLabel: gr.getDisplayValue('u_priority'),
                priorityClass: NoticeUtil.PRIORITY_LABEL_CLASSES[gr.getValue('u_priority')] || 'label-default',
                publishDate: this.formatDate(gr.getValue('u_publish_start_date')),
                publishEndDate: this.formatDate(gr.getValue('u_publish_end_date')),
                read: false,
            })
        }

        // 既読状況は1クエリでまとめて取得する（ループ内での都度クエリを避ける）
        if (ids.length > 0) {
            var readIds = {}
            var readGr = new GlideRecord('x_dent2_dentsusoke_read')
            readGr.addQuery('u_applicant_user', userId)
            readGr.addQuery('u_read_flag', true)
            readGr.addQuery('u_notice', 'IN', ids.join(','))
            readGr.setLimit(ids.length)
            readGr.query()
            while (readGr.next()) {
                readIds[readGr.getValue('u_notice')] = true
            }
            for (var i = 0; i < rows.length; i++) {
                rows[i].read = readIds[rows[i].sys_id] === true
            }
        }

        // 重要度順の指定時は 高→中→低 の順に整える
        if (sort === 'priority') {
            var order = { high: 0, middle: 1, low: 2 }
            rows.sort(function (a, b) {
                var diff = (order[a.priority] === undefined ? 9 : order[a.priority]) -
                    (order[b.priority] === undefined ? 9 : order[b.priority])
                if (diff !== 0) {
                    return diff
                }
                return a.publishDate < b.publishDate ? 1 : -1
            })
        }

        return rows
    },

    /**
     * 既読化（既読／未読情報取得処理：処理No.43）。
     * 自分に公開されていないお知らせを既読化できないよう、対象が閲覧可能かを検証してから登録する。
     *
     * TODO: 既読化のタイミング（一覧クリック時／詳細画面表示時）が未確定（SC-09 確認事項）。
     *       暫定として一覧クリック時に既読化する。
     */
    markAsRead: function (noticeId, entityType, userId) {
        if (!noticeId || !userId) {
            return { success: false, message: '対象のお知らせが指定されていません。' }
        }

        // 単一レコード取得だが get() は使用しない（トンマナ 3.2.3 の例外）。
        // 公開状態・公開期間・公開範囲の条件をクエリ側で担保する必要があり、
        // get() では applyVisibilityQuery の条件が適用されず、非公開のお知らせも既読化できてしまう。
        var check = new GlideRecord('x_dent2_dentsusoke_notice')
        this.applyVisibilityQuery(check, entityType)
        check.addQuery('sys_id', noticeId)
        check.setLimit(1)
        check.query()
        if (!check.next()) {
            return { success: false, message: '対象のお知らせが見つかりません。' }
        }

        var existing = new GlideRecord('x_dent2_dentsusoke_read')
        existing.addQuery('u_notice', noticeId)
        existing.addQuery('u_applicant_user', userId)
        existing.setLimit(1)
        existing.query()

        if (existing.next()) {
            if (existing.getValue('u_read_flag') !== '1') {
                existing.setValue('u_read_flag', true)
                existing.setValue('u_read_on', new GlideDateTime().getValue())
                existing.update()
            }
            return { success: true, created: false }
        }

        var inserted = new GlideRecord('x_dent2_dentsusoke_read')
        inserted.initialize()
        inserted.setValue('u_notice', noticeId)
        inserted.setValue('u_applicant_user', userId)
        inserted.setValue('u_read_flag', true)
        inserted.setValue('u_read_on', new GlideDateTime().getValue())
        var sysId = inserted.insert()

        return { success: !!sysId, created: true }
    },

    /** yyyy-mm-dd → yyyy/mm/dd（画面イメージの表記に合わせる） */
    formatDate: function (value) {
        if (!value) {
            return ''
        }
        return (value + '').split('-').join('/')
    },

    type: 'NoticeUtil',
}
