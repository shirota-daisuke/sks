/**
 * 申請の不備修正（ITCOM-05）— サーバースクリプト
 *
 * ③アクション定義
 *   No.1「一時保存」          → 回答（修正内容の説明）のみ保存。ステータスは変えない
 *   No.2「修正内容を提出する」→ 不備修正中 → 不備修正回答あり へ遷移し、再審査へ引き継ぐ
 *
 * ⑤表示条件
 *   自社かつ不備確認依頼（defect_request）／不備修正中（defect_fixing）の申請のみ。
 *   対象は申請状況一覧（SC-07）の「不備を修正する」から sys_id で渡される。
 *   指定が無い場合は自社の対応中の申請を1件探す。
 *
 * ■ 画面を開いた時点で不備修正中へ遷移させる
 * 明細（ITCOM-02）と添付書類（ITCOM-03）の編集を許可しているステータスは
 * 不備修正中のみのため、開いた時点で遷移させないと修正に着手できない。
 * ユーザ登録の不備対応（処理No.7）と同じ方式。
 *
 * ■ 修正できる範囲
 * 対象経費明細と添付書類はそれぞれの画面（ITCOM-02／03）で修正する。
 * 本画面はそれらの現在の内容と、事務局への回答の入力を担う。
 * 基本情報（組織形態・従業員数区分・売上増加率）は変更できない。
 *
 * TODO(要確認): 修正できる範囲が未確定。画面イメージは「指摘された項目のみ編集可」だが、
 *   不備内容が自由記述1件のみで項目単位の指摘を保持できないため、
 *   どの項目が指摘されたかを機械的に判定できない。
 *   本画面では明細・添付を各画面で修正する構成としている。
 */
;(function () {
    data.isApplicant = false
    data.message = ''
    data.state = 'form' // 'form' | 'none' | 'done'
    data.entityName = ''
    data.defect = null
    data.items = []
    data.totalExpense = 0
    data.totalExpenseLabel = '0'
    data.documents = []
    data.estimate = null
    data.blockers = []
    data.timeline = []
    data.saveResult = null
    data.submitResult = null
    data.maxReplyLength = 2000
    data.expenseUrl = '?id=' + (options.expense_page || 'x_dent2_dentsusoke_apply_exp')
    data.documentUrl = '?id=' + (options.document_page || 'x_dent2_dentsusoke_apply_doc')
    data.applicationsUrl = '?id=' + (options.applications_page || 'x_dent2_dentsusoke_apps')
    data.inquiriesUrl = '?id=' + (options.inquiries_page || 'x_dent2_dentsusoke_inquiries')
    data.note =
        options.note ||
        '基本情報（組織形態・従業員数区分・売上増加率）は本画面では変更できません。変更が必要な場合は事務局へお問い合わせください。'

    var ctx = new x_dent2_dentsusoke.PortalContextUtil()
    var entityId = ctx.getMyEntityId()
    if (!entityId) {
        data.message = 'このページは事業者ユーザ向けです。事業者情報が紐づいたアカウントでログインしてください。'
        return
    }
    data.isApplicant = true
    data.entityName = getEntityName(entityId)

    var defectUtil = new x_dent2_dentsusoke.ApplicationDefectUtil()
    var expenseUtil = new x_dent2_dentsusoke.ApplicationExpenseUtil()
    var docUtil = new x_dent2_dentsusoke.ApplicationDocumentUtil()
    var userId = gs.getUserID()

    // 対象は申請状況一覧（SC-07）から sys_id で渡される
    var requestId = $sp.getParameter('sys_id') || ''

    var target = defectUtil.find(entityId, requestId)
    if (!target) {
        data.state = 'none'
        data.message =
            '対応が必要な申請はありません。事務局から不備確認の依頼があった場合に、この画面で修正して再提出します。'
        return
    }
    var targetId = target.getUniqueValue()

    /**
     * 明細・添付を編集できるようにするため、開いた時点で不備修正中へ遷移させる。
     * 既に不備修正中の場合は何も起きない（再読み込みで履歴が増えない）。
     */
    if (!input || !input.action) {
        defectUtil.startFixing(entityId, targetId, userId)
    }

    // ③アクション -----------------------------------------------------------
    if (input && input.action === 'save_reply') {
        data.saveResult = defectUtil.saveReply(entityId, targetId, input.reply)
    } else if (input && input.action === 'submit_fix') {
        data.submitResult = defectUtil.submitFix(entityId, targetId, userId, input.reply)
        if (data.submitResult.success) {
            data.state = 'done'
            return
        }
    }

    // 遷移・保存を反映した状態で読み直す
    var current = defectUtil.find(entityId, targetId)
    if (!current) {
        data.state = 'none'
        data.message = '対応が必要な申請はありません。'
        return
    }

    data.defect = defectUtil.buildContext(current)

    // 対象経費と添付書類の現在の内容（修正は各画面で行う）
    data.items = expenseUtil.list(targetId)
    data.totalExpense = expenseUtil.sum(targetId)
    data.totalExpenseLabel = addComma(data.totalExpense)

    docUtil.ensureRows(targetId)
    data.documents = docUtil.list(targetId)

    data.estimate = buildEstimate(current, data.totalExpense)

    /**
     * 再提出できない理由のうち、対象経費と添付書類のものを表示する。
     * 回答（修正内容の説明）は入力欄の内容が画面側にあり、保存前の入力を
     * サーバーは知らないため、ここでは判定しない（ボタンの活性は画面側で見る）。
     * 再提出の時点では ApplicationDefectUtil.submitFix が回答も含めて検証する。
     */
    data.blockers = buildBlockers(
        new x_dent2_dentsusoke.ApplicationSubmitUtil().checkExpenseAndDocuments(targetId),
    )

    // これまでの経過（事業者へ表示してよい履歴のみ）
    data.timeline = new x_dent2_dentsusoke.ApplicationLogUtil().list(targetId, true, 20)

    // -----------------------------------------------------------------------
    /**
     * 再提出できない理由を画面表示用に整える。
     * 判定そのものは ApplicationSubmitUtil.checkExpenseAndDocuments が行う
     * （提出＝ITCOM-04 と同じ条件を使うため）。ここでは step を導線に変換する。
     */
    function buildBlockers(ready) {
        var STEP_LINKS = {
            expense: { url: data.expenseUrl, label: '対象経費を修正する' },
            document: { url: data.documentUrl, label: '添付書類を差し替える' },
        }

        var rows = []
        for (var i = 0; i < ready.blockers.length; i++) {
            var blocker = ready.blockers[i]
            var link = STEP_LINKS[blocker.step]
            rows.push({
                message: blocker.message,
                url: link ? link.url : '',
                label: link ? link.label : '',
            })
        }
        return rows
    }

    /** 補助金額自動判定（処理No.17）の結果を表示用に整える */
    function buildEstimate(gr, total) {
        var category = gr.getValue('u_employee_count_category')
        if (!category) {
            return {
                ok: false,
                errors: ['従業員数区分が未設定のため試算できません。事務局へお問い合わせください。'],
            }
        }

        var judged = new x_dent2_dentsusoke.ApplicationSubmitUtil().judgeAmount(
            category,
            gr.getValue('u_special_measure_flag') === '1',
            total,
        )
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
