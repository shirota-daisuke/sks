/**
 * 申請の内容確認・提出（ITCOM-04）— サーバースクリプト
 *
 * ③アクション定義
 *   No.1「申請を提出する」→ 申請番号を採番し 申請入力中（input）→ 受付済（accepted）へ遷移
 *
 * ⑤表示条件
 *   自社の「申請入力中」または「不備修正中」の申請が対象。
 *   提出済みの申請がある場合は確認画面を出さず、申請状況画面へ誘導する。
 *
 * ■ この画面が提出の入口である
 * 基本情報（ITCOM-01）・対象経費（ITCOM-02）・添付書類（ITCOM-03）で入力した内容を
 * ひとまとめに表示し、ここでのみ提出できる。
 * 提出のボタンを各画面に置くと、未入力のまま提出される経路が複数できてしまうため
 * 入口は本画面に限る。
 *
 * ■ 提出できない理由を先に示す
 * 押してから失敗を返すのではなく、不足している項目を一覧で示して
 * 該当のステップへ戻せるようにする（data.blockers）。
 * 判定はいずれも提出時と同じロジックを使う
 * （ApplicationSubmitUtil.validate／ApplicationExpenseUtil／ApplicationDocumentUtil）。
 *
 * ■ 入力値は画面から受け取らない
 * 提出する内容は下書きのレコードに保存済みのものを正とする。
 * 確認画面から入力値を送り直すと、表示した内容と提出される内容が食い違う余地が生まれる。
 *
 * ■ 同意事項
 * 同意の記録先の列が T03 に無く、文面も未確定のため、
 * 同意は提出の条件としてサーバー側で検証し、事実は処理履歴へ残す。
 * TODO(要確認): 同意事項の文面が未確定（公募要領の遵守・虚偽申請時の取消等）。
 * TODO(要レビュー): 同意の取得日時を列として保持するかは未確定。
 *   現状は処理履歴（x_dent2_dentsusoke_req_log）の内容へ記録している。
 */
;(function () {
    data.isApplicant = false
    data.message = ''
    data.state = 'form' // 'form' | 'no_draft' | 'locked' | 'done'
    data.entity = null
    data.request = null
    data.items = []
    data.totalExpense = 0
    data.totalExpenseLabel = '0'
    data.documents = []
    data.estimate = null
    data.blockers = []
    data.submitResult = null
    data.applyUrl = '?id=' + (options.apply_page || 'x_dent2_dentsusoke_apply')
    data.expenseUrl = '?id=' + (options.expense_page || 'x_dent2_dentsusoke_apply_exp')
    data.documentUrl = '?id=' + (options.document_page || 'x_dent2_dentsusoke_apply_doc')
    data.applicationsUrl = '?id=' + (options.applications_page || 'x_dent2_dentsusoke_apps')
    data.profileUrl = '?id=' + (options.profile_page || 'x_dent2_dentsusoke_profile')
    data.note =
        options.note ||
        '受付内容のメール通知は要否が未確定のため送信していません（IF-07）。審査状況は「申請」画面でご確認いただけます。'

    /**
     * 同意事項。文面が未確定のため、運用で差し替えられるようウィジェットのオプションで持つ。
     * 表示順にそのまま並べる。
     */
    data.consentItems = [
        options.consent_1 || '記載内容および提出書類に虚偽がないことを確認しました。',
        options.consent_2 || '公募要領の内容を確認し、これに従うことに同意します。',
    ]

    var ctx = new x_dent2_dentsusoke.PortalContextUtil()
    var entityId = ctx.getMyEntityId()
    if (!entityId) {
        data.message = 'このページは事業者ユーザ向けです。事業者情報が紐づいたアカウントでログインしてください。'
        return
    }
    data.isApplicant = true

    var submitUtil = new x_dent2_dentsusoke.ApplicationSubmitUtil()
    var expenseUtil = new x_dent2_dentsusoke.ApplicationExpenseUtil()
    var docUtil = new x_dent2_dentsusoke.ApplicationDocumentUtil()
    var userId = gs.getUserID()

    var draftGr = submitUtil.getDraft(entityId)
    if (!draftGr) {
        describeWhyNoDraft(entityId)
        return
    }
    var requestId = draftGr.getUniqueValue()
    var draft = submitUtil.buildDraftContext(draftGr)

    /**
     * 提出する内容は下書きのレコードに保存済みのものを正とする。
     * 画面から入力値を送り直さないため、表示と提出の内容が食い違わない。
     */
    var submitInput = {
        organization_type: draft.organizationType,
        employee_category: draft.employeeCategory,
        sales_increase_target_month: draft.salesIncreaseTargetMonth,
        sales_increase_rate: draft.salesIncreaseRate,
        special_measure: draft.specialMeasure,
    }

    // ③アクション -----------------------------------------------------------
    if (input && input.action === 'submit') {
        data.submitResult = doSubmit(entityId, userId, requestId, submitInput, input)
        if (data.submitResult.success) {
            data.state = 'done'
            return
        }
    }

    // 表示用の情報 ----------------------------------------------------------
    data.entity = loadEntity(entityId)
    data.request = buildRequestContext(draftGr, draft)

    data.items = expenseUtil.list(requestId)
    data.totalExpense = expenseUtil.sum(requestId)
    data.totalExpenseLabel = addComma(data.totalExpense)

    docUtil.ensureRows(requestId)
    data.documents = docUtil.list(requestId)

    data.estimate = buildEstimate(submitUtil, draft, data.totalExpense)
    data.blockers = buildBlockers(submitUtil.checkReadyToSubmit(requestId, submitInput))

    // -----------------------------------------------------------------------
    /**
     * 提出。
     *
     * 同意事項の検証は本画面が提出の唯一の入口であるため、ここで行う。
     * ApplicationSubmitUtil.submit() は他の経路（不備修正の再提出など）からも
     * 使うため、画面固有の条件を持ち込まない。
     */
    function doSubmit(entityId, userId, requestId, submitInput, input) {
        if (input.consent !== true && input.consent !== 'true') {
            return { success: false, errors: ['申請にあたっての確認事項に同意してください。'] }
        }

        var result = submitUtil.submit(entityId, userId, submitInput)
        if (!result.success) {
            return result
        }

        /**
         * 同意した事実を処理履歴へ残す。
         * 同意の記録先の列が T03 に無いため、監査の追跡はここで担保する。
         */
        new x_dent2_dentsusoke.ApplicationLogUtil().record(requestId, 'consented', {
            detail: '申請にあたっての確認事項に同意：' + data.consentItems.join(' / '),
            actor: userId,
            visibleToApplicant: true,
        })

        return result
    }

    /**
     * 提出できない理由を画面表示用に整える。
     *
     * 判定そのものは ApplicationSubmitUtil.checkReadyToSubmit が行う
     * （submit() と同じ条件を使うため）。ここでは step を該当ステップへの導線に変換する。
     */
    function buildBlockers(ready) {
        var STEP_LINKS = {
            basic: { url: data.applyUrl, label: '基本情報を修正する' },
            expense: { url: data.expenseUrl, label: '対象経費を修正する' },
            document: { url: data.documentUrl, label: '添付書類を提出する' },
        }

        var rows = []
        for (var i = 0; i < ready.blockers.length; i++) {
            var blocker = ready.blockers[i]
            var link = STEP_LINKS[blocker.step] || STEP_LINKS.basic
            rows.push({ message: blocker.message, url: link.url, label: link.label })
        }
        return rows
    }

    /** 編集できる申請が無い理由を切り分けて案内する */
    function describeWhyNoDraft(entityId) {
        var submitted = new GlideRecord('x_dent2_dentsusoke_request')
        submitted.addQuery('u_business_entity', entityId)
        submitted.addQuery('u_application_status', '!=', 'input')
        submitted.orderByDesc('sys_updated_on')
        submitted.setLimit(1)
        submitted.query()

        if (submitted.next()) {
            data.state = 'locked'
            data.message =
                '申請は提出済みです（申請番号 ' +
                submitted.getValue('u_application_number') +
                '）。提出後は内容を変更できません。変更が必要な場合は事務局へお問い合わせください。'
            return
        }

        data.state = 'no_draft'
        data.message =
            '提出できる申請がありません。「申請の入力」で基本情報を保存してから、対象経費と添付書類を登録してください。'
    }

    /** 事業者情報（確認画面では参照のみ。変更は SC-06 自分の情報で行う） */
    function loadEntity(entityId) {
        // 対象は u_business_entity で確定しているため get() を使用する（トンマナ 3.2.3）
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        if (!gr.get(entityId)) {
            return null
        }
        return {
            businessName: gr.getValue('u_business_name') || '',
            entityTypeLabel: gr.getDisplayValue('u_entity_type') || '',
            corporateNumber: gr.getValue('u_corporate_number') || '',
            address: gr.getValue('u_address') || '',
            industryLabel: gr.getDisplayValue('u_industry') || '',
        }
    }

    /** 申請区分・売上増加率の表示用 */
    function buildRequestContext(gr, draft) {
        return {
            sys_id: draft.sys_id,
            status: gr.getValue('u_application_status'),
            statusLabel: new x_dent2_dentsusoke.ApplicationStatusUtil().getApplicantLabel(
                gr.getValue('u_application_status'),
            ),
            organizationTypeLabel: gr.getDisplayValue('u_organization_type') || '',
            employeeCategoryLabel: gr.getDisplayValue('u_employee_count_category') || '',
            salesIncreaseTargetMonthLabel: formatMonth(draft.salesIncreaseTargetMonth),
            salesIncreaseRateLabel: formatPercent(draft.salesIncreaseRate),
            specialMeasure: draft.specialMeasure,
            updatedOn: draft.updatedOn,
        }
    }

    /** 補助金額自動判定（処理No.17）の結果を表示用に整える */
    function buildEstimate(submitUtil, draft, total) {
        if (!draft.employeeCategory) {
            return {
                ok: false,
                errors: ['従業員数区分が未設定のため試算できません。「申請の入力」で先に選択してください。'],
            }
        }

        var judged = submitUtil.judgeAmount(draft.employeeCategory, draft.specialMeasure, total)
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

    /** yyyy-MM-dd を「2026年6月」の表記にする（対象月は月単位のため日は出さない） */
    function formatMonth(value) {
        var matched = /^([0-9]{4})-([0-9]{2})/.exec(value || '')
        if (!matched) {
            return ''
        }
        return matched[1] + '年' + parseInt(matched[2], 10) + '月'
    }

    /** 小数で保持している増加率を百分率の表記にする（0.15 → 15.0%） */
    function formatPercent(value) {
        var rate = parseFloat(value)
        if (isNaN(rate)) {
            return ''
        }
        return Math.round(rate * 1000) / 10 + '%'
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
