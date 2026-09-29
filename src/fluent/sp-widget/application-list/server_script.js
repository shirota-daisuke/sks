/**
 * SC-07 申請状況一覧・詳細画面 — サーバースクリプト
 *
 * 画面設計書 ②表示項目一覧
 *   D1 申請状況一覧（申請ID／ステータス（事業者用表記）／提出日／最終更新日／操作）… 処理No.22
 *   D2 申請詳細：ステータスチップ … 処理No.22
 *   D3 申請詳細：金額情報 … 補助金額自動判定処理（処理No.17）、対象経費登録処理（処理No.18）
 *
 * ⑤表示条件：自身が申請した申請のみを一覧表示する。
 * ②：参照専用画面。不備修正時の項目編集は ITCOM 主担当の申請入力機能側で提供する。
 */
;(function () {
    data.isApplicant = false
    data.message = ''
    data.applications = []
    data.selected = null
    data.totalCount = 0
    data.truncated = false
    data.withdrawResult = null
    data.note =
        options.note ||
        '※申請項目の内容・入力編集画面は「申請」機能（ITCOM主担当）側の画面設計書を参照してください。本画面は状況参照が中心です。'

    /**
     * ③アクション No.2「不備を修正する」の遷移先。
     * 既定は申請の不備修正画面（ITCOM-05／x_dent2_dentsusoke_app_fix）。
     * ITCOM 側の申請入力機能が別に用意される場合はページの
     * widgetParameters で差し替える（URL が未設定の場合はボタンを出さず案内のみ表示する）。
     */
    data.applicationFormUrl =
        options.application_form_url || '?id=x_dent2_dentsusoke_app_fix&sys_id={sys_id}'

    // ③アクション No.3「取下げる」は採用要否が未決（A02）のため既定で非表示。
    data.showWithdraw = options.show_withdraw === true || options.show_withdraw === 'true'

    var ctx = new x_dent2_dentsusoke.PortalContextUtil()
    var entityId = ctx.getMyEntityId()
    if (!entityId) {
        data.message = 'このページは事業者ユーザ向けです。事業者情報が紐づいたアカウントでログインしてください。'
        return
    }
    data.isApplicant = true

    var statusUtil = new x_dent2_dentsusoke.ApplicationStatusUtil()
    var maxRecords = parseInt(options.max_records, 10) || 20

    // ③アクション No.3「取下げる」（処理No.21）
    if (input && input.action === 'withdraw' && input.sys_id) {
        data.withdrawResult = withdraw(entityId, input.sys_id + '')
    }

    loadList(entityId, maxRecords, statusUtil)

    // 詳細パネルの対象を決定する
    // ・クライアントから「詳細」リンクで指定された申請
    // ・マイページ（SC-05）等から sys_id 付きで遷移してきた申請
    // ・いずれもなければ一覧の先頭
    var selectedId = ''
    if (input && input.selected_id) {
        selectedId = input.selected_id + ''
    } else {
        selectedId = ($sp.getParameter('sys_id') || '') + ''
    }
    if (!selectedId && data.applications.length > 0) {
        selectedId = data.applications[0].sys_id
    }
    if (selectedId) {
        data.selected = loadDetail(entityId, selectedId, statusUtil)
    }

    // -----------------------------------------------------------------------
    // D1 申請状況一覧
    // -----------------------------------------------------------------------
    function loadList(entityId, maxRecords, statusUtil) {
        var agg = new GlideAggregate('x_dent2_dentsusoke_request')
        agg.addQuery('u_business_entity', entityId)
        agg.addAggregate('COUNT')
        agg.query()
        if (agg.next()) {
            data.totalCount = parseInt(agg.getAggregate('COUNT'), 10) || 0
        }

        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.addQuery('u_business_entity', entityId)
        gr.orderByDesc('sys_updated_on')
        gr.setLimit(maxRecords)
        gr.query()

        while (gr.next()) {
            var status = gr.getValue('u_application_status')
            data.applications.push({
                sys_id: gr.getUniqueValue(),
                number: gr.getValue('u_application_number'),
                statusLabel: statusUtil.getApplicantLabel(status),
                statusClass: statusUtil.getLabelClass(status),
                submittedOn: formatDate(gr.getDisplayValue('u_submitted_on')),
                updatedOn: formatDate(gr.getDisplayValue('sys_updated_on')),
            })
        }

        // 件数上限で切り捨てた場合は画面に明示する（黙って切らない）
        data.truncated = data.totalCount > data.applications.length
    }

    // -----------------------------------------------------------------------
    // D2／D3 申請詳細
    // -----------------------------------------------------------------------
    function loadDetail(entityId, sysId, statusUtil) {
        // 単一レコード取得だが get() は使用しない（トンマナ 3.2.3 の例外）。
        // get() では自社データ以外を除外する条件が適用されず、他社の sys_id を指定すると
        // 参照できてしまうため、⑤表示条件をクエリ側で担保する。
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.addQuery('u_business_entity', entityId) // 自社の申請のみ（⑤表示条件）
        gr.addQuery('sys_id', sysId)
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return null
        }

        var status = gr.getValue('u_application_status')
        var detail = {
            sys_id: gr.getUniqueValue(),
            number: gr.getValue('u_application_number'),
            status: status,
            statusLabel: statusUtil.getApplicantLabel(status),
            statusClass: statusUtil.getLabelClass(status),
            statusTone: statusUtil.getTone(status),
            submittedOn: formatDate(gr.getDisplayValue('u_submitted_on')),
            updatedOn: formatDate(gr.getDisplayValue('sys_updated_on')),
            // D3 金額情報
            subsidyCap: formatAmount(gr.getValue('u_subsidy_cap_amount')),
            subsidyRate: formatRate(gr.getValue('u_subsidy_rate')),
            totalExpense: formatYen(gr.getValue('u_total_expense_amount')),
            employeeCategory: gr.getDisplayValue('u_employee_count_category'),
            organizationType: gr.getDisplayValue('u_organization_type'),
            specialMeasure: gr.getValue('u_special_measure_flag') === '1',
        }

        /**
         * ③アクション No.2「不備を修正する」：事業者の対応が必要なステータスのみ。
         *
         * 不備確認依頼（defect_request）は事務局が依頼した直後の状態で、
         * 不備修正中（defect_fixing）は事業者が着手した状態。
         * 依頼を受けた時点でボタンを出さないと修正に着手できないため両方を対象にする
         * （着手＝不備修正中への遷移は不備修正画面＝ITCOM-05 が行う）。
         */
        detail.canFixDefect = status === 'defect_request' || status === 'defect_fixing'
        detail.fixUrl = detail.canFixDefect && data.applicationFormUrl ? buildFixUrl(detail.sys_id) : ''

        // ③アクション No.3「取下げる」：一次審査開始前のステータスのみ
        detail.canWithdraw = data.showWithdraw && isBeforeReview(status)

        return detail
    }

    /** 申請入力機能へのURLを組み立てる（{sys_id} を差し替える） */
    function buildFixUrl(sysId) {
        var url = data.applicationFormUrl + ''
        if (url.indexOf('{sys_id}') >= 0) {
            return url.split('{sys_id}').join(sysId)
        }
        return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'sys_id=' + sysId
    }

    /** 一次審査開始前か（申請入力中／受付済） */
    function isBeforeReview(status) {
        return status === 'input' || status === 'accepted'
    }

    // -----------------------------------------------------------------------
    // 申請取下げ処理（処理No.21）
    // TODO(A02): 取下げの実施可否・ボタン表示要否が未確定。
    // オプション show_withdraw を有効にした場合のみ実行できる実装としている。
    // 採用が決定した場合、ステータス遷移の妥当性は Business Rule／State Model 側でも
    // 担保する必要がある（画面経由以外の更新を防ぐため）。
    // -----------------------------------------------------------------------
    function withdraw(entityId, sysId) {
        if (!data.showWithdraw) {
            return { success: false, errors: ['取下げは現在ご利用いただけません。'] }
        }

        // get() を使用しない理由は loadDetail と同じ（トンマナ 3.2.3 の例外）
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.addQuery('u_business_entity', entityId) // 自社の申請のみ
        gr.addQuery('sys_id', sysId)
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return { success: false, errors: ['対象の申請が見つかりません。'] }
        }
        if (!isBeforeReview(gr.getValue('u_application_status'))) {
            return { success: false, errors: ['一次審査開始後の申請は取下げできません。'] }
        }

        gr.setValue('u_application_status', 'withdrawn')
        gr.setValue('u_withdrawal_flag', true)
        if (!gr.update()) {
            gs.error('[SKS] 申請の取下げに失敗しました。application=' + sysId)
            return { success: false, errors: ['取下げに失敗しました。時間をおいて再度お試しください。'] }
        }

        gs.info('[SKS] 申請を取下げました。application=' + gr.getValue('u_application_number'))
        return { success: true }
    }

    // -----------------------------------------------------------------------
    // 表示整形
    // -----------------------------------------------------------------------
    /** 表示用日時から日付部分だけを yyyy/mm/dd で返す */
    function formatDate(displayValue) {
        if (!displayValue) {
            return ''
        }
        return (displayValue + '').split(' ')[0].split('-').join('/')
    }

    /** 金額。1万円単位で割り切れる場合は「1,500万円」形式、それ以外は円表記 */
    function formatAmount(value) {
        var amount = parseInt(value, 10)
        if (isNaN(amount)) {
            return ''
        }
        if (amount >= 10000 && amount % 10000 === 0) {
            return addComma(amount / 10000) + '万円'
        }
        return addComma(amount) + '円'
    }

    function formatYen(value) {
        var amount = parseInt(value, 10)
        if (isNaN(amount)) {
            return ''
        }
        return addComma(amount) + '円'
    }

    /** 補助率。1/2・2/3・1/3 等の分数表記に寄せ、該当しない場合は％表記 */
    function formatRate(value) {
        var rate = parseFloat(value)
        if (isNaN(rate) || rate <= 0) {
            return ''
        }
        var fractions = [
            { label: '1/2', value: 0.5 },
            { label: '2/3', value: 2 / 3 },
            { label: '1/3', value: 1 / 3 },
            { label: '3/4', value: 0.75 },
        ]
        for (var i = 0; i < fractions.length; i++) {
            if (Math.abs(rate - fractions[i].value) < 0.01) {
                return fractions[i].label
            }
        }
        return Math.round(rate * 1000) / 10 + '%'
    }

    function addComma(value) {
        var text = value + ''
        var result = ''
        var count = 0
        for (var i = text.length - 1; i >= 0; i--) {
            result = text.charAt(i) + result
            count++
            if (count % 3 === 0 && i > 0) {
                result = ',' + result
            }
        }
        return result
    }
})()
