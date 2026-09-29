/**
 * 申請入力・提出画面 — サーバースクリプト（処理No.16／No.17）
 *
 * ③アクション定義
 *   No.1「入力内容を保存」ボタン → 下書き保存（申請入力中のまま）
 *
 * ⑤表示条件
 *   自社の申請のみを対象とする。編集できるのは「申請入力中」の下書き1件。
 *   提出済みの申請がある場合は入力フォームを出さず、申請状況画面へ誘導する。
 *
 * ■ 提出はこの画面では行わない
 * 提出の入口は内容確認・提出（ITCOM-04）に限る。
 * 提出のボタンを各入力画面に置くと、未入力のまま提出される経路が複数できてしまう。
 * 本画面は基本情報の入力と保存、次のステップへの導線のみを担う。
 *
 * ■ スコープについて
 * 申請機能は ITCOM 主担当の範囲であり本アプリの設計対象外。
 * 事業者が申請を提出できる経路が存在しなかったため用意している画面であり、
 * 画面イメージ ITCOM-01（基本情報）に相当する。
 * 対象経費の明細（ITCOM-02）と添付書類（ITCOM-03）は別画面で入力し、
 * 本画面は入力内容の保存と提出のみを担う。
 */
;(function () {
    data.isApplicant = false
    data.message = ''
    data.state = 'form' // 'form' | 'submitted'
    data.entityName = ''
    data.draft = null
    data.saveResult = null
    data.estimate = null
    data.latestSubmitted = null
    data.applicationsUrl = '?id=' + (options.applications_page || 'x_dent2_dentsusoke_apps')
    data.expenseUrl = '?id=' + (options.expense_page || 'x_dent2_dentsusoke_apply_exp')
    data.documentUrl = '?id=' + (options.document_page || 'x_dent2_dentsusoke_apply_doc')
    data.confirmUrl = '?id=' + (options.confirm_page || 'x_dent2_dentsusoke_apply_conf')
    data.note =
        options.note ||
        '対象経費は「対象経費の入力」画面で明細として登録します。合計金額は明細から自動計算されます。添付書類は「添付書類の提出」画面で提出し、提出は「内容確認・提出」画面から行います。'

    var ctx = new x_dent2_dentsusoke.PortalContextUtil()
    var entityId = ctx.getMyEntityId()
    if (!entityId) {
        data.message = 'このページは事業者ユーザ向けです。事業者情報が紐づいたアカウントでログインしてください。'
        return
    }
    data.isApplicant = true
    data.entityName = getEntityName(entityId)

    var util = new x_dent2_dentsusoke.ApplicationSubmitUtil()
    var userId = gs.getUserID()

    /**
     * 売上増加率対象月の入力上限（申請時点の年月）。
     * 画面側の時計ではなくインスタンスの時計で境界を決めるため、サーバーから渡す。
     * サーバー側でも同じ判定を行う（validate）。
     */
    data.currentMonth = util.getCurrentMonth()

    /**
     * ③アクション
     *
     * 「補助金額を試算」ボタンは廃止した。
     * 対象経費が明細（ITCOM-02）から算出されるようになり、
     * 画面を開いた時点で常に試算を表示できるためボタンを押す意味が無い。
     *
     * 「申請を提出」ボタンも廃止した。提出の入口は内容確認・提出（ITCOM-04）に限る。
     */
    if (input && input.action === 'save_draft') {
        data.saveResult = util.saveDraft(entityId, userId, input)
    }

    // 下書きの読み込み -----------------------------------------------------
    var draftGr = util.getDraft(entityId)
    data.draft = util.buildDraftContext(draftGr)

    // 提出済みの申請（最新）を案内に使う
    data.latestSubmitted = loadLatestSubmitted(entityId)

    /**
     * 下書きが無く、かつ提出済みの申請がある場合は新規入力フォームを出さない。
     * 1事業者1申請の想定であり、2件目を作れると事務局がどちらを審査するか判断できない。
     * TODO(要確認): 複数回次・複数件の申請を認めるかは未確定（T03 に公募回次の項目が無い）。
     */
    if (!data.draft && data.latestSubmitted) {
        data.state = 'submitted'
        return
    }

    /**
     * 対象経費の状況。
     * 合計は明細（x_dent2_dentsusoke_exp_item）から算出するため、本画面では入力させず
     * 件数と合計を表示して「対象経費の入力」画面へ誘導する。
     */
    data.expense = { itemCount: 0, total: 0, totalLabel: '0' }
    if (data.draft) {
        var expenseUtil = new x_dent2_dentsusoke.ApplicationExpenseUtil()
        var total = expenseUtil.sum(data.draft.sys_id)
        data.expense = {
            itemCount: expenseUtil.count(data.draft.sys_id),
            total: total,
            totalLabel: addComma(total),
        }
    }

    /**
     * 添付書類の状況（ITCOM-03）。
     * 必須書類がそろっていないと提出できないため、この画面でも充足状況を示す。
     * 必須区分は保存済みの内容（組織形態・特例措置）で判定されるため、
     * 入力を変えた場合は保存後に再評価される。
     */
    data.document = { required: 0, requiredSubmitted: 0, complete: false, missing: [] }
    if (data.draft) {
        var docUtil = new x_dent2_dentsusoke.ApplicationDocumentUtil()
        docUtil.ensureRows(data.draft.sys_id)
        var docProgress = docUtil.countSubmitted(data.draft.sys_id)
        var docComplete = docUtil.checkComplete(data.draft.sys_id)
        data.document = {
            required: docProgress.required,
            requiredSubmitted: docProgress.requiredSubmitted,
            complete: docComplete.ok,
            missing: docComplete.missing,
        }
    }

    // 下書きがある場合は明細の合計で試算結果を表示する（判定の見通しを持たせる）
    if (!data.estimate && data.draft && data.draft.employeeCategory) {
        data.estimate = buildEstimate(util, {
            employee_category: data.draft.employeeCategory,
            special_measure: data.draft.specialMeasure,
            total_expense: data.expense.total,
        })
    }

    // -----------------------------------------------------------------------
    // 補助金額自動判定（処理No.17）の結果を表示用に整える
    // -----------------------------------------------------------------------
    function buildEstimate(util, source) {
        var specialMeasure = source.special_measure === true || source.special_measure === 'true'
        var judged = util.judgeAmount(source.employee_category, specialMeasure, source.total_expense)

        if (!judged.ok) {
            return { ok: false, errors: judged.errors }
        }

        return {
            ok: true,
            errors: [],
            capAmount: formatYen(judged.capAmount),
            rateLabel: judged.rateLabel,
            subsidyAmount: formatYen(judged.subsidyAmount),
            totalExpense: formatYen(parseInt(source.total_expense, 10) || 0),
            cappedByLimit: judged.cappedByLimit,
        }
    }

    /** 提出済み（申請入力中以外）の最新の申請 */
    function loadLatestSubmitted(entityId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.addQuery('u_business_entity', entityId)
        gr.addQuery('u_application_status', '!=', 'input')
        gr.orderByDesc('sys_updated_on')
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return null
        }

        var statusUtil = new x_dent2_dentsusoke.ApplicationStatusUtil()
        var status = gr.getValue('u_application_status')
        return {
            sys_id: gr.getUniqueValue(),
            number: gr.getValue('u_application_number'),
            statusLabel: statusUtil.getApplicantLabel(status),
            statusClass: statusUtil.getLabelClass(status),
            submittedOn: formatDateTime(gr.getDisplayValue('u_submitted_on')),
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
