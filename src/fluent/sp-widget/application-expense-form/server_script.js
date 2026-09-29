/**
 * 対象経費の入力（ITCOM-02／処理No.18 対象経費登録）— サーバースクリプト
 *
 * ③アクション定義
 *   No.1「明細を追加」／「明細を更新」 → 対象経費明細の登録・更新
 *   No.2「削除」                       → 明細の削除
 *   いずれも保存のたびに合計を T03 の u_total_expense_amount へ書き戻し、
 *   補助金額（処理No.17）を再判定する。
 *
 * ⑤表示条件
 *   自社の「申請入力中」または「不備修正中」の申請が対象。
 *   明細は申請レコードへ紐づくため、先に下書き（申請の入力）が存在している必要がある。
 *
 * ■ 合計金額の持ち方
 * 合計は本画面の明細から算出し ApplicationExpenseUtil.recalcTotal が T03 へ書き戻す。
 * 既存の SC-05／SC-07・SC-17 帳票・SC-15 ダッシュボードが u_total_expense_amount を
 * 参照しているため、合計の置き場所は変えていない。
 *
 * ■ ステップについて
 * 画面イメージ ITCOM-01〜04 の4ステップ構成（基本情報・対象経費・添付書類・内容確認と提出）
 * のうち、本画面は2つめにあたる。提出は内容確認・提出（ITCOM-04）で行う。
 */
;(function () {
    data.isApplicant = false
    data.message = ''
    data.state = 'form' // 'form' | 'no_draft' | 'locked'
    data.entityName = ''
    data.request = null
    data.items = []
    data.categories = []
    data.expertFees = []
    data.totalExpense = 0
    data.totalExpenseLabel = '0'
    data.estimate = null
    data.saveResult = null
    data.applyUrl = '?id=' + (options.apply_page || 'x_dent2_dentsusoke_apply')
    data.documentUrl = '?id=' + (options.document_page || 'x_dent2_dentsusoke_apply_doc')
    data.confirmUrl = '?id=' + (options.confirm_page || 'x_dent2_dentsusoke_apply_conf')
    data.applicationsUrl = '?id=' + (options.applications_page || 'x_dent2_dentsusoke_apps')
    data.note =
        options.note ||
        '対象経費の登録が終わったら「添付書類」へ進み、「内容確認・提出」で提出してください。'

    var ctx = new x_dent2_dentsusoke.PortalContextUtil()
    var entityId = ctx.getMyEntityId()
    if (!entityId) {
        data.message = 'このページは事業者ユーザ向けです。事業者情報が紐づいたアカウントでログインしてください。'
        return
    }
    data.isApplicant = true
    data.entityName = getEntityName(entityId)

    var submitUtil = new x_dent2_dentsusoke.ApplicationSubmitUtil()
    var expenseUtil = new x_dent2_dentsusoke.ApplicationExpenseUtil()

    // 対象の申請を決める。申請入力中の下書きが無ければ入力できない
    var requestGr = loadEditableRequest(entityId)
    if (!requestGr) {
        return
    }
    var requestId = requestGr.getUniqueValue()

    data.request = {
        sys_id: requestId,
        applicationNumber: requestGr.getValue('u_application_number') || '',
        status: requestGr.getValue('u_application_status'),
        statusLabel: new x_dent2_dentsusoke.ApplicationStatusUtil().getApplicantLabel(
            requestGr.getValue('u_application_status'),
        ),
        employeeCategory: requestGr.getValue('u_employee_count_category'),
        employeeCategoryLabel: requestGr.getDisplayValue('u_employee_count_category'),
        specialMeasure: requestGr.getValue('u_special_measure_flag') === '1',
        updatedOn: requestGr.getDisplayValue('sys_updated_on'),
    }

    // ③アクション -----------------------------------------------------------
    if (input && input.action === 'save_item') {
        data.saveResult = expenseUtil.save(requestId, input)
    } else if (input && input.action === 'remove_item') {
        data.saveResult = expenseUtil.remove(requestId, input.item_id)
    }

    // 一覧と選択肢 ----------------------------------------------------------
    data.items = expenseUtil.list(requestId)
    data.categories = expenseUtil.getCategories()
    data.expertFees = expenseUtil.getExpertFees()
    data.totalExpense = expenseUtil.sum(requestId)
    data.totalExpenseLabel = addComma(data.totalExpense)

    // 補助金額の試算（処理No.17）--------------------------------------------
    data.estimate = buildEstimate(submitUtil, data.request, data.totalExpense)

    // -----------------------------------------------------------------------
    /**
     * 編集対象の申請を取得する。
     * 申請入力中を優先し、無ければ不備修正中を探す（ITCOM-05 で使用する経路）。
     */
    function loadEditableRequest(entityId) {
        // 自社かつ編集可能なステータスの単一レコード取得。
        // get() では自社以外を除外する条件が適用されないためクエリ側で担保する（トンマナ 3.2.3 の例外）
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.addQuery('u_business_entity', entityId)
        gr.addQuery('u_application_status', 'IN', 'input,defect_fixing')
        gr.orderByDesc('sys_updated_on')
        gr.setLimit(1)
        gr.query()

        if (gr.next()) {
            return gr
        }

        // 編集できる申請が無い場合、理由を切り分けて案内する
        var submitted = new GlideRecord('x_dent2_dentsusoke_request')
        submitted.addQuery('u_business_entity', entityId)
        submitted.addQuery('u_application_status', '!=', 'input')
        submitted.orderByDesc('sys_updated_on')
        submitted.setLimit(1)
        submitted.query()

        if (submitted.next()) {
            data.state = 'locked'
            data.message =
                '申請は提出済みのため対象経費を変更できません（申請番号 ' +
                submitted.getValue('u_application_number') +
                '）。変更が必要な場合は事務局へお問い合わせください。'
        } else {
            data.state = 'no_draft'
            data.message =
                '対象経費を入力する前に「申請の入力」で基本情報を保存してください。明細は申請に紐づけて保存されます。'
        }
        return null
    }

    /** 補助金額自動判定（処理No.17）の結果を表示用に整える */
    function buildEstimate(submitUtil, request, total) {
        if (!request || !request.employeeCategory) {
            return {
                ok: false,
                errors: ['従業員数区分が未設定のため試算できません。「申請の入力」で先に選択してください。'],
            }
        }

        var judged = submitUtil.judgeAmount(request.employeeCategory, request.specialMeasure, total)
        if (!judged.ok) {
            return { ok: false, errors: judged.errors }
        }

        return {
            ok: true,
            errors: [],
            totalExpense: formatYen(total),
            rateLabel: judged.rateLabel,
            capAmount: formatYen(judged.capAmount),
            byRate: formatYen(Math.floor((total * judged.numerator) / judged.denominator)),
            subsidyAmount: formatYen(judged.subsidyAmount),
            cappedByLimit: judged.cappedByLimit,
        }
    }

    /** 自社の事業者名。対象は u_business_entity で確定しているため get() を使用する */
    function getEntityName(entityId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        if (!gr.get(entityId)) {
            return ''
        }
        return gr.getValue('u_business_name') || ''
    }

    function formatYen(value) {
        var amount = parseInt(value, 10)
        if (isNaN(amount)) {
            return ''
        }
        return addComma(amount) + '円'
    }

    function addComma(value) {
        var text = (parseInt(value, 10) || 0) + ''
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
