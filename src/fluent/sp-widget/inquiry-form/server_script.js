/**
 * SC-10 問合せ一覧・作成画面 — サーバースクリプト
 *
 * ③アクション定義
 *   No.1「送信する」ボタン      → 問合せ作成処理（処理No.46）→ 左側の問合せ履歴に追加表示
 *   No.2 問合せ履歴行クリック   → 処理なし（詳細情報の取得・表示）→ 問合せ詳細・返信内容を表示
 *
 * ⑤表示条件：自身が起票した問合せのみを一覧表示する。
 */
;(function () {
    data.isApplicant = false
    data.message = ''
    data.inquiries = []
    data.selected = null
    data.createResult = null
    data.totalCount = 0
    data.truncated = false

    var ctx = new x_dent2_dentsusoke.PortalContextUtil()
    var entityId = ctx.getMyEntityId()
    if (!entityId) {
        data.message = 'このページは事業者ユーザ向けです。事業者情報が紐づいたアカウントでログインしてください。'
        return
    }
    data.isApplicant = true

    var userId = gs.getUserID()
    var maxRecords = parseInt(options.max_records, 10) || 30

    // ⑤表示条件は「自身が起票した問合せのみ」。
    // TODO(Q05): 1事業者に複数ユーザーを認める場合、事業者管理者が同一事業者の問合せを
    //   まとめて参照する要件が生じ得るため、対象範囲をオプションで切り替えられるようにしている。
    var scope = options.scope === 'entity' ? 'entity' : 'self'

    if (input && input.action === 'create') {
        data.createResult = createInquiry(entityId, userId, input)
    }

    loadList(entityId, userId, scope, maxRecords)

    // 詳細パネルの対象（③No.2）。作成直後は作成した問合せを選択状態にする。
    var selectedId = ''
    if (data.createResult && data.createResult.success) {
        selectedId = data.createResult.sys_id
    } else if (input && input.selected_id) {
        selectedId = input.selected_id + ''
    }
    if (selectedId) {
        data.selected = loadDetail(entityId, userId, scope, selectedId)
    }

    // -----------------------------------------------------------------------
    // 問合せ履歴（件名／状態／更新日）
    // -----------------------------------------------------------------------
    function loadList(entityId, userId, scope, maxRecords) {
        var agg = new GlideAggregate('x_dent2_dentsusoke_inquiry')
        applyScope(agg, entityId, userId, scope)
        agg.addAggregate('COUNT')
        agg.query()
        if (agg.next()) {
            data.totalCount = parseInt(agg.getAggregate('COUNT'), 10) || 0
        }

        var gr = new GlideRecord('x_dent2_dentsusoke_inquiry')
        applyScope(gr, entityId, userId, scope)
        gr.orderByDesc('sys_updated_on')
        gr.setLimit(maxRecords)
        gr.query()

        while (gr.next()) {
            var state = gr.getValue('u_state')
            data.inquiries.push({
                sys_id: gr.getUniqueValue(),
                subject: gr.getValue('u_subject'),
                state: state,
                stateLabel: gr.getDisplayValue('u_state'),
                // 未回答＝要確認系（warning）／回答済＝完了系（success）：画面イメージ凡例の区分に合わせる
                stateClass: state === 'answered' ? 'label-success' : 'label-warning',
                updatedOn: formatDate(gr.getDisplayValue('sys_updated_on')),
            })
        }

        // 件数上限で切り捨てた場合は画面に明示する（黙って切らない）
        data.truncated = data.totalCount > data.inquiries.length
    }

    // -----------------------------------------------------------------------
    // 問合せ詳細・返信内容（③No.2）
    // -----------------------------------------------------------------------
    function loadDetail(entityId, userId, scope, sysId) {
        // 単一レコード取得だが get() は使用しない（トンマナ 3.2.3 の例外）。
        // get() では applyScope の参照範囲（自社／自身が起票）が適用されず、
        // 他者の問合せを sys_id 指定で参照できてしまうため、クエリ側で担保する。
        var gr = new GlideRecord('x_dent2_dentsusoke_inquiry')
        applyScope(gr, entityId, userId, scope)
        gr.addQuery('sys_id', sysId)
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return null
        }

        var state = gr.getValue('u_state')
        return {
            sys_id: gr.getUniqueValue(),
            subject: gr.getValue('u_subject'),
            description: gr.getValue('u_description'),
            state: state,
            stateLabel: gr.getDisplayValue('u_state'),
            stateClass: state === 'answered' ? 'label-success' : 'label-warning',
            receivedOn: formatDateTime(gr.getDisplayValue('u_received_on')),
            repliedOn: formatDateTime(gr.getDisplayValue('u_replied_on')),
            replyBody: gr.getValue('u_reply_body') || '',
        }
    }

    // -----------------------------------------------------------------------
    // 問合せ作成処理（処理No.46）
    // -----------------------------------------------------------------------
    function createInquiry(entityId, userId, input) {
        var subject = trim(input.subject)
        var description = trim(input.description)

        var errors = []
        if (!subject) {
            errors.push('件名を入力してください。')
        } else if (subject.length > 200) {
            errors.push('件名は200文字以内で入力してください。')
        }
        if (!description) {
            errors.push('本文を入力してください。')
        } else if (description.length > 2000) {
            errors.push('本文は2000文字以内で入力してください。')
        }
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        var gr = new GlideRecord('x_dent2_dentsusoke_inquiry')
        gr.initialize()
        gr.setValue('u_subject', subject)
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_created_by_applicant', userId)
        gr.setValue('u_description', description)
        gr.setValue('u_state', 'open')
        gr.setValue('u_received_on', new GlideDateTime().getValue())
        var sysId = gr.insert()

        if (!sysId) {
            gs.error('[SKS] 問合せの作成に失敗しました。user=' + userId)
            return { success: false, errors: ['問合せの送信に失敗しました。時間をおいて再度お試しください。'] }
        }

        // TODO(SC-14 確認事項): 問合せ受付時・返信時のメール通知要否が未確定のため通知は送信しない。
        gs.info('[SKS] 問合せを受け付けました。inquiry=' + sysId)
        return { success: true, sys_id: sysId + '' }
    }

    /** 参照範囲の絞り込み（自身が起票した問合せ／同一事業者の問合せ） */
    function applyScope(gr, entityId, userId, scope) {
        gr.addQuery('u_business_entity', entityId)
        if (scope !== 'entity') {
            gr.addQuery('u_created_by_applicant', userId)
        }
        return gr
    }

    /** 表示用日時から日付部分だけを yyyy/mm/dd で返す */
    function formatDate(displayValue) {
        if (!displayValue) {
            return ''
        }
        return (displayValue + '').split(' ')[0].split('-').join('/')
    }

    /** 表示用日時を yyyy/mm/dd hh:mm で返す */
    function formatDateTime(displayValue) {
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
    }

    function trim(value) {
        if (value === null || value === undefined) {
            return ''
        }
        return (value + '').trim()
    }
})()
