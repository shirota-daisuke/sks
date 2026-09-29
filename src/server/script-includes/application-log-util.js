/**
 * ApplicationLogUtil
 *
 * 申請の処理履歴（x_dent2_dentsusoke_req_log）へ業務イベントを記録する。
 * ITCOM-05／07／08／09 のタイムライン表示の元データになる。
 *
 * ■ sys_audit で代替しない理由
 * T03 は audit: true のため列単位の変更履歴は sys_audit に残るが、
 * 「申請を提出した」「一次審査を完了した」という業務上の単位で並べられない。
 * 1操作で複数列が変わると複数行になり、事業者へ見せる粒度にも整えづらい。
 *
 * ■ 記録の失敗は本処理を止めない
 * 履歴は業務処理の副産物であり、記録に失敗したからといって
 * ステータス遷移を巻き戻すべきではない（巻き戻すほうが不整合が大きい）。
 * 失敗は gs.error でログに残し、呼び出し元へは影響させない。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない。
 */
var ApplicationLogUtil = Class.create()

/** 事業者へ表示しない出来事（事務局の内部作業） */
ApplicationLogUtil.STAFF_ONLY_ACTIONS = ['review_assigned', 'review_started', 'credit_judged']

ApplicationLogUtil.prototype = {
    initialize: function () {},

    /**
     * 出来事を1件記録する。
     *
     * @param requestId  対象の申請
     * @param action     x_dent2_dentsusoke_req_log の u_action の値
     * @param options    { fromStatus, toStatus, detail, actor, visibleToApplicant }
     *                   visibleToApplicant を省略した場合は STAFF_ONLY_ACTIONS で判定する
     * @return 作成した履歴の sys_id（失敗時は空文字）
     */
    record: function (requestId, action, options) {
        if (!requestId || !action) {
            gs.error('[SKS] 処理履歴の記録に必要な引数が不足しています。request=' + requestId + ' action=' + action)
            return ''
        }

        var opt = options || {}

        var visible
        if (opt.visibleToApplicant === true || opt.visibleToApplicant === false) {
            visible = opt.visibleToApplicant
        } else {
            visible = ApplicationLogUtil.STAFF_ONLY_ACTIONS.indexOf(action) < 0
        }

        try {
            var gr = new GlideRecord('x_dent2_dentsusoke_req_log')
            gr.initialize()
            gr.setValue('u_request', requestId + '')
            gr.setValue('u_action', action)
            gr.setValue('u_occurred_on', new GlideDateTime().getValue())
            gr.setValue('u_visible_to_applicant', visible)

            if (opt.fromStatus) {
                gr.setValue('u_from_status', opt.fromStatus + '')
            }
            if (opt.toStatus) {
                gr.setValue('u_to_status', opt.toStatus + '')
            }
            if (opt.detail) {
                gr.setValue('u_detail', (opt.detail + '').substring(0, 1000))
            }
            // 実行者は明示指定がなければ現在のユーザ。
            // 未認証（不備修正のトークンアクセス）では gs.getUserID() が guest になるため
            // 呼び出し元が申請者の sys_id を渡せるようにしている。
            gr.setValue('u_actor', opt.actor ? opt.actor + '' : gs.getUserID())

            var sysId = gr.insert()
            if (!sysId) {
                gs.error('[SKS] 処理履歴の作成に失敗しました。request=' + requestId + ' action=' + action)
                return ''
            }
            return sysId + ''
        } catch (e) {
            gs.error('[SKS] 処理履歴の記録で例外が発生しました。request=' + requestId + ' action=' + action + ' error=' + e)
            return ''
        }
    },

    /**
     * 画面表示用の履歴一覧（新しい順ではなく古い順。タイムラインは上から下へ時系列で読む）。
     *
     * @param requestId     対象の申請
     * @param applicantView true なら事業者へ表示してよい行のみ
     * @param limit         取得件数の上限（既定20件）
     */
    list: function (requestId, applicantView, limit) {
        var rows = []
        if (!requestId) {
            return rows
        }

        var max = parseInt(limit, 10)
        if (isNaN(max) || max <= 0) {
            max = 20
        }

        var gr = new GlideRecord('x_dent2_dentsusoke_req_log')
        gr.addQuery('u_request', requestId + '')
        if (applicantView) {
            gr.addQuery('u_visible_to_applicant', true)
        }
        gr.orderBy('u_occurred_on')
        // トンマナ 3.3.2：取得件数に上限を設ける
        gr.setLimit(max)
        gr.query()

        while (gr.next()) {
            rows.push({
                sys_id: gr.getUniqueValue(),
                action: gr.getValue('u_action'),
                actionLabel: gr.getDisplayValue('u_action'),
                detail: gr.getValue('u_detail') || '',
                occurredOn: this._formatDateTime(gr.getDisplayValue('u_occurred_on')),
                actor: gr.getDisplayValue('u_actor') || '',
            })
        }

        return rows
    },

    /** 表示用日時を yyyy/mm/dd hh:mm で返す（他ウィジェットと同じ整形） */
    _formatDateTime: function (displayValue) {
        if (!displayValue) {
            return ''
        }
        var parts = (displayValue + '').split(' ')
        var date = parts[0].split('-').join('/')
        if (parts.length < 2) {
            return date
        }
        var time = parts[1].split(':')
        return date + ' ' + time[0] + ':' + time[1]
    },

    type: 'ApplicationLogUtil',
}
