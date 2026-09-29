import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * 採択・不採択の確定（画面イメージ ITCOM-09）の単体テスト
 *
 * 対象のカスタムロジックは ApplicationAwardUtil（Script Include）。
 *
 * ■ このテストで守りたいこと
 *   ・信用調査が済んでいない申請を確定できないこと
 *   ・交付決定額が「査定後の対象経費 × 補助率（上限で頭打ち）」で算出されること
 *   ・査定後の対象経費が申請額を超える値を受け付けないこと
 *   ・採択で採択番号が採番され、交付決定額・確定日時・確定者が記録されること
 *   ・採択番号が重複せず連番で採番されること
 *   ・不採択は理由区分と通知文の両方を必須とすること
 *   ・差し戻しで一次審査の判定が消えること
 *
 * とくに交付決定額は、申請時に確定した補助率（レコードの分子・分母）で計算する。
 * マスタを引き直す実装にすると、提出後にマスタが変わった場合に審査の前提が変わる。
 *
 * ■ 確定操作の権限について
 * 確定は staff_admin に限定している（権限設計書 A20）。
 * ATF は admin 権限で実行され gs.hasRole() は admin に対して真を返すため、
 * 権限が無い場合に拒否されることは本テストでは検証できない
 * （検証には impersonate が必要であり、runServerSideScript では扱わない）。
 * 権限の宣言は UI Action の condition と ApplicationAwardUtil.canDecideByRole にある。
 *
 * ■ テスト方式
 * Script Include には UI が無いため atf.server.runServerSideScript で
 * クラスを直接インスタンス化して検証する（他の SC テストと同じ方式）。
 * 検証には Jasmine を使わず assertEqual を使う（理由は sc11-registration-review.now.ts のコメント参照）。
 *
 * ■ 準備処理を重複して書いている理由
 * script には必ず単一の文字列リテラルを渡す必要があり、共通部分を定数にして
 * 差し込むと Fluent がビルド時に評価できずテストが生成されない
 * （itcom05-application-defect.now.ts のコメント参照）。
 */

/** 審査結果の集約と交付決定額の算定 */
Test(
    {
        $id: Now.ID['test_award_calc'],
        name: '採択判定：集約と交付決定額の算定',
        description:
            'ApplicationAwardUtil.canDecide／summarize／calcAwardAmount／generateAwardNumber を検証する。確定できる申請ステータスの判定、審査結果（一次審査・信用調査・重複申請・前年度採択実績）が集約されること、交付決定額が査定後の対象経費×補助率で算出され補助上限額で頭打ちになること、査定後の対象経費が申請額を超える値・非数値・0を弾くこと、採択番号が規則どおりの形式で採番されることを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_award_step_calc'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var seq = 0
    var RUN = ('' + new GlideDateTime().getNumericValue()).slice(-10)

    var submitUtil = new x_dent2_dentsusoke.ApplicationSubmitUtil()
    var expenseUtil = new x_dent2_dentsusoke.ApplicationExpenseUtil()
    var docUtil = new x_dent2_dentsusoke.ApplicationDocumentUtil()
    var reviewUtil = new x_dent2_dentsusoke.ApplicationReviewUtil()
    var creditUtil = new x_dent2_dentsusoke.ApplicationCreditUtil()
    var awardUtil = new x_dent2_dentsusoke.ApplicationAwardUtil()

    var FULL_INPUT = {
        organization_type: 'corporate',
        employee_category: 'le20',
        sales_increase_target_month: '2026-06',
        sales_increase_rate: '0.15',
        special_measure: false
    }

    function createEntity() {
        seq++
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.initialize()
        gr.setValue('u_business_name', 'ATF 採択判定テスト事業者 ' + RUN + '-' + seq)
        gr.setValue('u_entity_type', 'corporate')
        gr.setValue('u_corporate_number', RUN + ('00' + seq).slice(-3))
        gr.setValue('u_address', 'ATF テスト住所')
        gr.setValue('u_industry', 'service')
        gr.setValue('u_employee_count', 10)
        gr.setValue('u_capital', 5000)
        return gr.insert()
    }

    function createApplicant(entityId) {
        seq++
        var login = 'atf.award.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'AWARD-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'registered')
        gr.setValue('u_duplicate_check_result', 'no_duplicate')
        gr.setValue('u_auth_method', 'standard')
        return gr.insert()
    }

    function createStaff() {
        seq++
        var login = 'atf.astaff.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('sys_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'ASTAFF-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('active', true)
        return gr.insert()
    }

    function fillRequiredDocuments(requestId) {
        docUtil.ensureRows(requestId, {
            organizationType: FULL_INPUT.organization_type,
            specialMeasure: FULL_INPUT.special_measure
        })
        var docs = docUtil.list(requestId)
        for (var i = 0; i < docs.length; i++) {
            if (!docs[i].required || docs[i].submitted) {
                continue
            }
            var gr = new GlideRecord('x_dent2_dentsusoke_req_doc')
            if (!gr.get(docs[i].sys_id)) {
                continue
            }
            new GlideSysAttachment().write(gr, docs[i].documentType + '.pdf', 'application/pdf', 'ATF')
            docUtil.syncRow(requestId, docs[i].sys_id)
        }
    }

    /** 信用調査免除まで進めた申請を作る（採択判定の対象） */
    function createExempt(categoryId, staffId, amount) {
        var entityId = createEntity()
        var userId = createApplicant(entityId)
        submitUtil.saveDraft(entityId, userId, FULL_INPUT)

        var requestId = submitUtil.getDraft(entityId).getUniqueValue()
        expenseUtil.save(requestId, {
            category_id: categoryId,
            description: 'ATF 明細1',
            amount: '' + amount
        })
        fillRequiredDocuments(requestId)

        if (!submitUtil.submit(entityId, userId, FULL_INPUT).success) {
            return null
        }
        reviewUtil.assign(requestId, staffId, staffId)
        if (!reviewUtil.complete(requestId, staffId, 'ATF 一次審査完了').success) {
            return null
        }
        if (!creditUtil.judge(requestId, staffId, false).success) {
            return null
        }
        return requestId
    }

    function reload(requestId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.get(requestId)
        return gr
    }

    function pickSimpleCategory() {
        var categories = expenseUtil.getCategories()
        for (var i = 0; i < categories.length; i++) {
            if (!categories[i].hasDailyCap) {
                return categories[i]
            }
        }
        return null
    }

    // -----------------------------------------------------------------------
    // 確定できるステータス
    // -----------------------------------------------------------------------
    check('信用調査結果確認中は確定できる', awardUtil.canDecide('result_checking'), true)
    check('信用調査免除は確定できる', awardUtil.canDecide('credit_exempt'), true)
    check('一次審査完了は確定できない', awardUtil.canDecide('first_review_done'), false)
    check('外部信用調査中は確定できない', awardUtil.canDecide('ext_reviewing'), false)
    check('申請審査完了は確定できない', awardUtil.canDecide('review_done'), false)
    check('不採択は確定できない', awardUtil.canDecide('rejected'), false)
    check('未設定は確定できない', awardUtil.canDecide(''), false)

    // ATF は admin 権限で実行されるため、ロールの検証は真になる（上のコメント参照）
    check('確定操作の権限がある', awardUtil.canDecideByRole(), true)

    // -----------------------------------------------------------------------
    // 採択番号の形式
    // -----------------------------------------------------------------------
    check('採択番号の形式', /^AWD-[0-9]{4}-[0-9]{4}$/.test(awardUtil.generateAwardNumber()), true)

    // -----------------------------------------------------------------------
    // 異常系
    // -----------------------------------------------------------------------
    check('申請が未指定なら集約できない', awardUtil.summarize('').ok, false)
    check('存在しない申請は集約できない',
        awardUtil.summarize('00000000000000000000000000000000').ok, false)
    check('申請が未指定なら算定できない', awardUtil.calcAwardAmount('', '').ok, false)

    var category = pickSimpleCategory()
    check('日額上限のない経費区分が存在する', !!category, true)
    if (!category) {
        stepResult.setOutputMessage('対象経費区分マスタが未投入のため検証を中断しました')
        return
    }

    var staffId = createStaff()
    var requestId = createExempt(category.sys_id, staffId, 4000000)
    check('検証用の申請を作成できた', !!requestId, true)
    if (!requestId) {
        stepResult.setOutputMessage('信用調査免除まで進められなかったため検証を中断しました')
        return
    }

    // -----------------------------------------------------------------------
    // 審査結果の集約
    // -----------------------------------------------------------------------
    var summary = awardUtil.summarize(requestId)
    check('集約が取得できる', summary.ok, true)
    check('ステータスが返る', summary.status, 'credit_exempt')
    check('一次審査の判定が返る', summary.review.result, 'passed')
    check('一次審査の審査者が返る', summary.review.reviewer !== '', true)
    check('信用調査が免除として返る', summary.credit.exempt, true)
    check('免除なので調査結果は無い', summary.credit.result, '')
    check('要否の判定日時が返る', summary.credit.judgedOn !== '', true)
    check('重複申請は無い', summary.duplicate.ok, true)
    check('重複件数は0', summary.duplicate.count, 0)
    check('法人番号が返る', summary.duplicate.corporateNumber !== '', true)
    check('前年度採択実績は無い', summary.priorYearAwarded, false)
    check('申請時の対象経費が返る', summary.amount.totalExpense, 4000000)
    check('補助率の分母が返る', summary.amount.denominator > 0, true)

    // -----------------------------------------------------------------------
    // 交付決定額の算定
    //
    // 期待値はテストへ固定値で書かず、レコードに記録された補助率から組み立てる。
    // -----------------------------------------------------------------------
    var gr = reload(requestId)
    var numerator = parseInt(gr.getValue('u_subsidy_rate_numerator'), 10)
    var denominator = parseInt(gr.getValue('u_subsidy_rate_denominator'), 10)
    var capAmount = parseInt(gr.getValue('u_subsidy_cap_amount'), 10)

    var byDefault = awardUtil.calcAwardAmount(requestId, '')
    check('査定なしでも算定できる', byDefault.ok, true)
    check('査定なしなら申請時の対象経費を使う', byDefault.approvedExpense, 4000000)
    check('交付決定額が分数計算と一致する',
        byDefault.awardAmount, Math.min(Math.floor((4000000 * numerator) / denominator), capAmount))
    check('補助率の表記が返る', byDefault.rateLabel, numerator + '/' + denominator)

    var reduced = awardUtil.calcAwardAmount(requestId, '3500000')
    check('査定後の対象経費で算定できる', reduced.ok, true)
    check('査定後の対象経費が返る', reduced.approvedExpense, 3500000)
    check('減額後の交付決定額',
        reduced.awardAmount, Math.min(Math.floor((3500000 * numerator) / denominator), capAmount))
    check('減額により交付決定額が下がる', reduced.awardAmount < byDefault.awardAmount, true)

    /**
     * 査定は「対象外と判断した経費を除く」ものであり、申請額を超える査定はありえない。
     * 受け付けると事業者が申請していない額を交付することになる。
     */
    check('申請額を超える査定は弾く', awardUtil.calcAwardAmount(requestId, '5000000').ok, false)
    check('非数値は弾く', awardUtil.calcAwardAmount(requestId, '3,500,000').ok, false)
    check('0は弾く', awardUtil.calcAwardAmount(requestId, '0').ok, false)
    check('申請額と同額は通る', awardUtil.calcAwardAmount(requestId, '4000000').ok, true)

    // -----------------------------------------------------------------------
    // 補助上限額で頭打ちになること
    // -----------------------------------------------------------------------
    var bigExpense = Math.ceil((capAmount * denominator) / numerator) + 1000000
    var bigId = createExempt(category.sys_id, staffId, bigExpense)
    check('検証用の申請（高額）を作成できた', !!bigId, true)
    if (bigId) {
        var capped = awardUtil.calcAwardAmount(bigId, '')
        check('高額でも算定できる', capped.ok, true)
        check('交付決定額が上限額で止まる', capped.awardAmount, capAmount)
        check('上限適用のフラグが立つ', capped.cappedByLimit, true)
    }

    // -----------------------------------------------------------------------
    // 重複申請の確認
    //
    // 同一法人番号の他の申請が審査中・採択済みで存在するかを提示する
    // （機械的に弾かず件数を返す）。
    // -----------------------------------------------------------------------
    var entityId = reload(requestId).getValue('u_business_entity')
    var secondUserId = createApplicant(entityId)
    submitUtil.saveDraft(entityId, secondUserId, FULL_INPUT)
    var secondDraftId = submitUtil.getDraft(entityId).getUniqueValue()
    expenseUtil.save(secondDraftId, {
        category_id: category.sys_id,
        description: 'ATF 明細1',
        amount: '1000000'
    })
    fillRequiredDocuments(secondDraftId)
    check('2件目の申請を提出できた',
        submitUtil.submit(entityId, secondUserId, FULL_INPUT).success, true)

    var withDuplicate = awardUtil.summarize(requestId)
    check('重複申請が検出される', withDuplicate.duplicate.ok, false)
    check('重複件数が返る', withDuplicate.duplicate.count, 1)
    check('重複した申請番号が返る', withDuplicate.duplicate.numbers.length, 1)

    stepResult.setOutputMessage('審査結果の集約と交付決定額の算定を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** 確定と差し戻し */
Test(
    {
        $id: Now.ID['test_award_decide'],
        name: '採択判定：確定と差し戻し',
        description:
            'ApplicationAwardUtil.approve／reject／returnToReview を検証する。信用調査が済んでいない申請を確定できないこと、採択で採択番号が採番され交付決定額・査定後の対象経費・確定日時・確定者・判定理由が記録されて申請審査完了へ遷移すること、採択番号が重複せず連番で採番されること、確定後は二重に確定できないこと、不採択が理由区分と通知文の両方を必須とすること、差し戻しで一次審査中へ戻り一次審査の判定が消えることを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_award_step_decide'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var seq = 0
    var RUN = ('' + new GlideDateTime().getNumericValue()).slice(-10)

    var submitUtil = new x_dent2_dentsusoke.ApplicationSubmitUtil()
    var expenseUtil = new x_dent2_dentsusoke.ApplicationExpenseUtil()
    var docUtil = new x_dent2_dentsusoke.ApplicationDocumentUtil()
    var reviewUtil = new x_dent2_dentsusoke.ApplicationReviewUtil()
    var creditUtil = new x_dent2_dentsusoke.ApplicationCreditUtil()
    var awardUtil = new x_dent2_dentsusoke.ApplicationAwardUtil()

    var FULL_INPUT = {
        organization_type: 'corporate',
        employee_category: 'le20',
        sales_increase_target_month: '2026-06',
        sales_increase_rate: '0.15',
        special_measure: false
    }

    function createEntity() {
        seq++
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.initialize()
        gr.setValue('u_business_name', 'ATF 採択確定テスト事業者 ' + RUN + '-' + seq)
        gr.setValue('u_entity_type', 'corporate')
        gr.setValue('u_corporate_number', RUN + ('00' + seq).slice(-3))
        gr.setValue('u_address', 'ATF テスト住所')
        gr.setValue('u_industry', 'service')
        gr.setValue('u_employee_count', 10)
        gr.setValue('u_capital', 5000)
        return gr.insert()
    }

    function createApplicant(entityId) {
        seq++
        var login = 'atf.decide.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'DECIDE-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'registered')
        gr.setValue('u_duplicate_check_result', 'no_duplicate')
        gr.setValue('u_auth_method', 'standard')
        return gr.insert()
    }

    function createStaff() {
        seq++
        var login = 'atf.dstaff.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('sys_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'DSTAFF-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('active', true)
        return gr.insert()
    }

    function fillRequiredDocuments(requestId) {
        docUtil.ensureRows(requestId, {
            organizationType: FULL_INPUT.organization_type,
            specialMeasure: FULL_INPUT.special_measure
        })
        var docs = docUtil.list(requestId)
        for (var i = 0; i < docs.length; i++) {
            if (!docs[i].required || docs[i].submitted) {
                continue
            }
            var gr = new GlideRecord('x_dent2_dentsusoke_req_doc')
            if (!gr.get(docs[i].sys_id)) {
                continue
            }
            new GlideSysAttachment().write(gr, docs[i].documentType + '.pdf', 'application/pdf', 'ATF')
            docUtil.syncRow(requestId, docs[i].sys_id)
        }
    }

    /** 一次審査完了まで進めた申請を作る */
    function createReviewed(categoryId, staffId) {
        var entityId = createEntity()
        var userId = createApplicant(entityId)
        submitUtil.saveDraft(entityId, userId, FULL_INPUT)

        var requestId = submitUtil.getDraft(entityId).getUniqueValue()
        expenseUtil.save(requestId, {
            category_id: categoryId,
            description: 'ATF 明細1',
            amount: '4000000'
        })
        fillRequiredDocuments(requestId)

        if (!submitUtil.submit(entityId, userId, FULL_INPUT).success) {
            return null
        }
        reviewUtil.assign(requestId, staffId, staffId)
        if (!reviewUtil.complete(requestId, staffId, 'ATF 一次審査完了').success) {
            return null
        }
        return requestId
    }

    /** 信用調査免除まで進めた申請を作る */
    function createExempt(categoryId, staffId) {
        var requestId = createReviewed(categoryId, staffId)
        if (!requestId) {
            return null
        }
        if (!creditUtil.judge(requestId, staffId, false).success) {
            return null
        }
        return requestId
    }

    /** 信用調査の結果取込まで進めた申請を作る */
    function createChecked(categoryId, staffId, result) {
        var requestId = createReviewed(categoryId, staffId)
        if (!requestId) {
            return null
        }
        var judged = creditUtil.judge(requestId, staffId, true)
        if (!judged.success) {
            return null
        }
        creditUtil.request(judged.checkId, staffId, 'ATF 調査機関', '')
        if (!creditUtil.receive(judged.checkId, staffId, result, 'ATF メモ').success) {
            return null
        }
        return requestId
    }

    function reload(requestId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.get(requestId)
        return gr
    }

    function countLogs(requestId, action) {
        var gr = new GlideRecord('x_dent2_dentsusoke_req_log')
        gr.addQuery('u_request', requestId)
        gr.addQuery('u_action', action)
        gr.query()
        return gr.getRowCount()
    }

    function pickSimpleCategory() {
        var categories = expenseUtil.getCategories()
        for (var i = 0; i < categories.length; i++) {
            if (!categories[i].hasDailyCap) {
                return categories[i]
            }
        }
        return null
    }

    var category = pickSimpleCategory()
    check('日額上限のない経費区分が存在する', !!category, true)
    if (!category) {
        stepResult.setOutputMessage('対象経費区分マスタが未投入のため検証を中断しました')
        return
    }

    var staffId = createStaff()

    // -----------------------------------------------------------------------
    // 異常系：信用調査が済んでいない申請
    // -----------------------------------------------------------------------
    check('申請が未指定なら確定できない', awardUtil.approve('', staffId, '', '').success, false)
    check('確定者が未指定なら確定できない',
        awardUtil.approve('00000000000000000000000000000000', '', '', '').success, false)
    check('存在しない申請は確定できない',
        awardUtil.approve('00000000000000000000000000000000', staffId, '', '').success, false)

    var reviewedId = createReviewed(category.sys_id, staffId)
    check('検証用の申請（一次審査完了）を作成できた', !!reviewedId, true)
    if (!reviewedId) {
        stepResult.setOutputMessage('一次審査完了まで進められなかったため検証を中断しました')
        return
    }

    /**
     * 一次審査が完了しただけでは確定できないこと。
     * 信用調査の要否判定を経ずに採択されると、調査が必要な申請を素通しできる。
     */
    check('要否判定前は採択できない', awardUtil.approve(reviewedId, staffId, '', '').success, false)
    check('要否判定前は不採択にできない',
        awardUtil.reject(reviewedId, staffId, 'other', 'ATF 理由').success, false)
    check('要否判定前は差し戻せない',
        awardUtil.returnToReview(reviewedId, staffId, 'ATF 理由').success, false)
    check('ステータスは一次審査完了のまま',
        reload(reviewedId).getValue('u_application_status'), 'first_review_done')

    // -----------------------------------------------------------------------
    // 採択として確定する（信用調査免除の経路）
    // -----------------------------------------------------------------------
    var exemptId = createExempt(category.sys_id, staffId)
    check('検証用の申請（免除）を作成できた', !!exemptId, true)
    if (!exemptId) {
        stepResult.setOutputMessage('信用調査免除まで進められなかったため検証を中断しました')
        return
    }

    var expected = awardUtil.calcAwardAmount(exemptId, '3500000')
    check('交付決定額を算定できる', expected.ok, true)

    var approved = awardUtil.approve(exemptId, staffId, '3500000', '  ATF 判定理由：対象外経費を除外  ')
    check('採択の確定が成功する', approved.success, true)
    check('返却されるアクション', approved.action, 'award_approve')
    check('遷移後のステータスが返る', approved.status, 'review_done')
    check('採択番号が採番される', /^AWD-[0-9]{4}-[0-9]{4}$/.test(approved.awardNumber), true)
    check('交付決定額が返る', approved.awardAmount, expected.awardAmount)

    var afterApprove = reload(exemptId)
    check('申請審査完了へ遷移する', afterApprove.getValue('u_application_status'), 'review_done')
    check('採択番号が記録される', afterApprove.getValue('u_award_number'), approved.awardNumber)
    check('査定後の対象経費が記録される',
        parseInt(afterApprove.getValue('u_approved_expense_amount'), 10), 3500000)
    check('交付決定額が記録される',
        parseInt(afterApprove.getValue('u_award_amount'), 10), expected.awardAmount)
    check('判定理由が前後の空白を除いて記録される',
        afterApprove.getValue('u_decision_note'), 'ATF 判定理由：対象外経費を除外')
    check('確定日時が記録される', !!afterApprove.getValue('u_decided_on'), true)
    check('確定者が記録される', afterApprove.getValue('u_decided_by'), staffId)
    check('履歴が記録される', countLogs(exemptId, 'awarded'), 1)

    // 前年度実績連携用の採択番号とは別の項目であること
    check('前年度実績連携用の採択番号は空のまま',
        afterApprove.getValue('u_award_number_for_sync'), '')

    // 確定後は二重に確定できない
    check('確定後は再度採択できない', awardUtil.approve(exemptId, staffId, '', '').success, false)
    check('確定後は不採択にできない',
        awardUtil.reject(exemptId, staffId, 'other', 'ATF 理由').success, false)
    check('確定後は差し戻せない',
        awardUtil.returnToReview(exemptId, staffId, 'ATF 理由').success, false)
    check('履歴は増えない', countLogs(exemptId, 'awarded'), 1)

    // -----------------------------------------------------------------------
    // 採択番号が重複せず連番で採番されること（信用調査ありの経路）
    // -----------------------------------------------------------------------
    var checkedId = createChecked(category.sys_id, staffId, 'ok')
    check('検証用の申請（調査結果確認中）を作成できた', !!checkedId, true)
    if (checkedId) {
        check('信用調査結果確認中である',
            reload(checkedId).getValue('u_application_status'), 'result_checking')

        var approved2 = awardUtil.approve(checkedId, staffId, '', 'ATF 判定理由2')
        check('2件目の採択が成功する', approved2.success, true)
        check('採択番号が重複しない', approved.awardNumber === approved2.awardNumber, false)

        // 連番が1つ進んでいること（同一年内）
        var serial1 = parseInt(approved.awardNumber.slice(-4), 10)
        var serial2 = parseInt(approved2.awardNumber.slice(-4), 10)
        check('連番が1つ進む', serial2, serial1 + 1)

        // 査定を入力しない場合は申請時の対象経費が使われること
        check('査定なしなら申請時の対象経費が記録される',
            parseInt(reload(checkedId).getValue('u_approved_expense_amount'), 10), 4000000)
    }

    // -----------------------------------------------------------------------
    // 不採択として確定する
    // -----------------------------------------------------------------------
    var rejectId = createExempt(category.sys_id, staffId)
    check('検証用の申請を作成できた', !!rejectId, true)
    if (!rejectId) {
        stepResult.setOutputMessage('信用調査免除まで進められなかったため検証を中断しました')
        return
    }

    check('理由区分が未選択なら不採択にできない',
        awardUtil.reject(rejectId, staffId, '', 'ATF 通知文').success, false)
    check('通知文が未入力なら不採択にできない',
        awardUtil.reject(rejectId, staffId, 'other', '').success, false)
    check('どちらも未入力なら理由が2件返る',
        awardUtil.reject(rejectId, staffId, '', '').errors.length, 2)
    check('ステータスは信用調査免除のまま',
        reload(rejectId).getValue('u_application_status'), 'credit_exempt')

    var rejected = awardUtil.reject(rejectId, staffId, 'credit', '  ATF 通知文：信用調査の結果によります。  ')
    check('不採択の確定が成功する', rejected.success, true)
    check('返却されるアクション', rejected.action, 'award_reject')
    check('遷移後のステータスが返る', rejected.status, 'rejected')

    var afterReject = reload(rejectId)
    check('不採択へ遷移する', afterReject.getValue('u_application_status'), 'rejected')
    check('理由区分が記録される', afterReject.getValue('u_reject_reason_code'), 'credit')
    check('通知文が前後の空白を除いて記録される',
        afterReject.getValue('u_reject_reason'), 'ATF 通知文：信用調査の結果によります。')
    check('確定日時が記録される', !!afterReject.getValue('u_decided_on'), true)
    check('確定者が記録される', afterReject.getValue('u_decided_by'), staffId)
    check('採択番号は採番されない', afterReject.getValue('u_award_number'), '')
    check('履歴が記録される', countLogs(rejectId, 'rejected'), 1)

    // -----------------------------------------------------------------------
    // 一次審査へ差し戻す
    // -----------------------------------------------------------------------
    var returnId = createExempt(category.sys_id, staffId)
    check('検証用の申請を作成できた', !!returnId, true)
    if (!returnId) {
        stepResult.setOutputMessage('信用調査免除まで進められなかったため検証を中断しました')
        return
    }

    check('差し戻し前は一次審査の判定がある',
        reload(returnId).getValue('u_review_result'), 'passed')
    check('理由が未入力なら差し戻せない',
        awardUtil.returnToReview(returnId, staffId, '').success, false)

    var returned = awardUtil.returnToReview(returnId, staffId, 'ATF 差し戻し理由：経費の再確認が必要')
    check('差し戻しが成功する', returned.success, true)
    check('返却されるアクション', returned.action, 'award_return')
    check('遷移後のステータスが返る', returned.status, 'first_review')

    var afterReturn = reload(returnId)
    check('一次審査中へ戻る', afterReturn.getValue('u_application_status'), 'first_review')

    /**
     * 一次審査の判定が消えること。
     * 残すと「差し戻したのに完了扱いの判定が残っている」状態になり、
     * どの判定が有効なのか分からなくなる。
     */
    check('一次審査の判定が消える', afterReturn.getValue('u_review_result'), '')
    check('一次審査日時が消える', afterReturn.getValue('u_reviewed_on'), '')
    check('審査担当者は残る', afterReturn.getValue('u_review_assigned_to'), staffId)
    check('履歴が記録される', countLogs(returnId, 'returned'), 1)

    // 差し戻し後は一次審査の判定をやり直せること
    check('差し戻し後は一次審査を完了できる',
        reviewUtil.complete(returnId, staffId, 'ATF 再判定').success, true)
    check('再び一次審査完了になる',
        reload(returnId).getValue('u_application_status'), 'first_review_done')

    stepResult.setOutputMessage('採択・不採択の確定と差し戻しを検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
