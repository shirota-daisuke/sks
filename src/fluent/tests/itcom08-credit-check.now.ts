import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * 信用調査：要否判定・外部調査・結果取込（画面イメージ ITCOM-08）の単体テスト
 *
 * 対象のカスタムロジックは ApplicationCreditUtil（Script Include）。
 *
 * ■ このテストで守りたいこと
 *   ・一次審査が完了していない申請の要否判定ができないこと
 *   ・免除では調査レコードを作らず、実施では作ること
 *   ・申請ステータスと調査の状態が段階どおりに連動すること
 *   ・再調査で回次が増え、過去の調査の記録が残ること
 *   ・結果を取り込んだ調査を取消できないこと
 *   ・結果が「問題あり」でも自動で不採択にしないこと
 *
 * とくに「再調査で過去の記録が残ること」は、T03 へ列を足す方式だと2回目の調査で
 * 1回目が上書きされるため、子テーブルで1対多にした理由そのものの検証である。
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

/** 要否判定 */
Test(
    {
        $id: Now.ID['test_credit_judge'],
        name: '信用調査：要否判定',
        description:
            'ApplicationCreditUtil.canJudge／getThresholdAmount／suggest／judge を検証する。一次審査が完了していない申請の判定ができないこと、補助金額としきい値・前年度採択実績から要否の推奨が返ること、実施を選ぶと外部調査準備中へ遷移して調査レコードが1件作成されること、免除を選ぶと信用調査免除へ遷移して調査レコードが作られないこと、判定後は二重に判定できないことを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_credit_step_judge'],
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

    var FULL_INPUT = {
        organization_type: 'corporate',
        employee_category: 'le20',
        sales_increase_target_month: '2026-06',
        sales_increase_rate: '0.15',
        special_measure: false
    }

    function createEntity(priorYearAwarded) {
        seq++
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.initialize()
        gr.setValue('u_business_name', 'ATF 信用調査テスト事業者 ' + RUN + '-' + seq)
        gr.setValue('u_entity_type', 'corporate')
        gr.setValue('u_corporate_number', RUN + ('00' + seq).slice(-3))
        gr.setValue('u_address', 'ATF テスト住所')
        gr.setValue('u_industry', 'service')
        gr.setValue('u_employee_count', 10)
        gr.setValue('u_capital', 5000)
        gr.setValue('u_prior_year_awarded_flag', priorYearAwarded === true)
        return gr.insert()
    }

    function createApplicant(entityId) {
        seq++
        var login = 'atf.credit.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'CREDIT-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'registered')
        gr.setValue('u_duplicate_check_result', 'no_duplicate')
        gr.setValue('u_auth_method', 'standard')
        return gr.insert()
    }

    function createStaff() {
        seq++
        var login = 'atf.cstaff.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('sys_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'CSTAFF-' + seq)
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

    /** 一次審査完了まで進めた申請を1件作る */
    function createReviewed(categoryId, staffId, amount, priorYearAwarded) {
        var entityId = createEntity(priorYearAwarded)
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
        if (!reviewUtil.assign(requestId, staffId, staffId).success) {
            return null
        }
        if (!reviewUtil.complete(requestId, staffId, 'ATF 一次審査完了').success) {
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

    // -----------------------------------------------------------------------
    // 判定できるステータス
    // -----------------------------------------------------------------------
    check('一次審査完了は判定できる', creditUtil.canJudge('first_review_done'), true)
    check('信用調査要否判定中は判定できる', creditUtil.canJudge('credit_judging'), true)
    check('一次審査中は判定できない', creditUtil.canJudge('first_review'), false)
    check('外部調査準備中は判定できない', creditUtil.canJudge('ext_preparing'), false)
    check('信用調査免除は判定できない', creditUtil.canJudge('credit_exempt'), false)
    check('未設定は判定できない', creditUtil.canJudge(''), false)

    // 結果を取り込めるステータス
    check('外部信用調査中は取込できる', creditUtil.canReceive('ext_reviewing'), true)
    check('調査結果取込待ちは取込できる', creditUtil.canReceive('result_waiting'), true)
    check('外部調査準備中は取込できない', creditUtil.canReceive('ext_preparing'), false)

    // -----------------------------------------------------------------------
    // しきい値・回答予定日
    // -----------------------------------------------------------------------
    var threshold = creditUtil.getThresholdAmount()
    check('しきい値が0以上', threshold >= 0, true)
    check('回答予定日の日数が正の値', creditUtil.getDueDays() > 0, true)

    var expectedDue = new GlideDateTime()
    expectedDue.addDaysLocalTime(creditUtil.getDueDays())
    check('回答予定日が依頼日＋日数で算出される',
        creditUtil.calcDueOn(), expectedDue.getDate().getValue())

    var category = pickSimpleCategory()
    check('日額上限のない経費区分が存在する', !!category, true)
    if (!category) {
        stepResult.setOutputMessage('対象経費区分マスタが未投入のため検証を中断しました')
        return
    }

    var staffId = createStaff()
    check('検証用の事務局ユーザを作成できた', !!staffId, true)

    // -----------------------------------------------------------------------
    // 異常系
    // -----------------------------------------------------------------------
    check('申請が未指定なら判定できない', creditUtil.judge('', staffId, true).success, false)
    check('事務局ユーザが未指定なら判定できない',
        creditUtil.judge('00000000000000000000000000000000', '', true).success, false)
    check('存在しない申請は判定できない',
        creditUtil.judge('00000000000000000000000000000000', staffId, true).success, false)
    check('申請が未指定なら推奨を返さない', creditUtil.suggest('').ok, false)

    // -----------------------------------------------------------------------
    // 要否の推奨（しきい値以上／未満）
    //
    // 補助金額はマスタから算出されるため、しきい値の前後になる対象経費を
    // マスタの補助率から逆算して作る。
    // -----------------------------------------------------------------------
    var rate = submitUtil.judgeAmount('le20', false, 1000000)
    check('補助率が取得できる', rate.ok, true)

    // 補助金額がしきい値を確実に超える対象経費
    var bigExpense = Math.ceil(((threshold + 1000000) * rate.denominator) / rate.numerator)
    var bigId = createReviewed(category.sys_id, staffId, bigExpense, false)
    check('検証用の申請（高額）を作成できた', !!bigId, true)
    if (!bigId) {
        stepResult.setOutputMessage('一次審査完了まで進められなかったため検証を中断しました')
        return
    }

    var bigSuggest = creditUtil.suggest(bigId)
    check('推奨が取得できる', bigSuggest.ok, true)
    check('しきい値以上なら調査対象を推奨する', bigSuggest.required, true)
    check('しきい値が返る', bigSuggest.thresholdAmount, threshold)
    check('補助金額が返る', bigSuggest.subsidyAmount >= threshold, true)
    check('前年度採択実績なしが返る', bigSuggest.priorYearAwarded, false)
    check('判断材料の説明が返る', bigSuggest.reasons.length >= 3, true)

    // 補助金額がしきい値未満になる対象経費（前年度採択実績あり）
    var smallExpense = Math.floor(((threshold - 1) * rate.denominator) / rate.numerator)
    if (smallExpense < 1) {
        smallExpense = 1
    }
    var smallId = createReviewed(category.sys_id, staffId, smallExpense, true)
    check('検証用の申請（少額）を作成できた', !!smallId, true)
    if (smallId) {
        var smallSuggest = creditUtil.suggest(smallId)
        check('しきい値未満なら免除を推奨する', smallSuggest.required, false)
        check('前年度採択実績ありが返る', smallSuggest.priorYearAwarded, true)
    }

    // -----------------------------------------------------------------------
    // 実施：調査レコードが作られること
    // -----------------------------------------------------------------------
    check('判定前は一次審査完了', reload(bigId).getValue('u_application_status'), 'first_review_done')
    check('判定前の調査は0件', creditUtil.list(bigId).length, 0)
    check('判定前の最新調査は無い', creditUtil.getLatest(bigId), null)

    var judged = creditUtil.judge(bigId, staffId, true)
    check('要否判定が成功する', judged.success, true)
    check('返却されるアクション', judged.action, 'credit_required')
    check('遷移後のステータスが返る', judged.status, 'ext_preparing')
    check('作成した調査レコードが返る', !!judged.checkId, true)

    var afterJudge = reload(bigId)
    check('外部調査準備中へ遷移する', afterJudge.getValue('u_application_status'), 'ext_preparing')
    check('要否が記録される', afterJudge.getValue('u_credit_required'), 'required')
    check('判定日時が記録される', !!afterJudge.getValue('u_credit_judged_on'), true)
    check('履歴が記録される', countLogs(bigId, 'credit_judged'), 1)

    var checks = creditUtil.list(bigId)
    check('調査レコードが1件作られる', checks.length, 1)
    check('回次は1', checks[0].sequence, 1)
    check('状態は準備中', checks[0].state, 'preparing')
    check('調査機関は未入力', checks[0].agency, '')
    check('最新の調査が取得できる', creditUtil.getLatest(bigId).sys_id, judged.checkId)

    // 判定後は二重に判定できない
    check('判定後は再度判定できない', creditUtil.judge(bigId, staffId, true).success, false)
    check('判定後は免除にもできない', creditUtil.judge(bigId, staffId, false).success, false)
    check('調査レコードは増えない', creditUtil.list(bigId).length, 1)

    // -----------------------------------------------------------------------
    // 免除：調査レコードを作らないこと
    // -----------------------------------------------------------------------
    var exemptId = createReviewed(category.sys_id, staffId, 1000000, false)
    check('検証用の申請を作成できた', !!exemptId, true)
    if (exemptId) {
        var exempted = creditUtil.judge(exemptId, staffId, false)
        check('免除が成功する', exempted.success, true)
        check('返却されるアクション', exempted.action, 'credit_exempt')
        check('遷移後のステータスが返る', exempted.status, 'credit_exempt')
        check('調査レコードは作られない', exempted.checkId, '')
        check('調査は0件のまま', creditUtil.list(exemptId).length, 0)

        var afterExempt = reload(exemptId)
        check('信用調査免除へ遷移する', afterExempt.getValue('u_application_status'), 'credit_exempt')
        check('要否が記録される', afterExempt.getValue('u_credit_required'), 'exempt')
        check('判定日時が記録される', !!afterExempt.getValue('u_credit_judged_on'), true)
        check('履歴が記録される', countLogs(exemptId, 'credit_judged'), 1)
    }

    stepResult.setOutputMessage('信用調査の要否判定を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** 依頼・督促・結果取込・取消 */
Test(
    {
        $id: Now.ID['test_credit_flow'],
        name: '信用調査：依頼・督促・結果取込・取消',
        description:
            'ApplicationCreditUtil.request／remind／receive／cancel／validateResult を検証する。調査機関の未入力で依頼できないこと、依頼で外部信用調査中へ遷移すること、督促で調査結果取込待ちへ遷移し調査の状態は依頼済のままであること、結果の取込で信用調査結果確認中へ遷移して結果と取込日時が記録されること、結果が問題ありでも自動で不採択にしないこと、結果を取り込んだ調査は取消できないこと、取消で要否判定へ戻り再調査の回次が2になって1回目の記録が残ることを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_credit_step_flow'],
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
        gr.setValue('u_business_name', 'ATF 信用調査フローテスト事業者 ' + RUN + '-' + seq)
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
        var login = 'atf.cflow.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'CFLOW-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'registered')
        gr.setValue('u_duplicate_check_result', 'no_duplicate')
        gr.setValue('u_auth_method', 'standard')
        return gr.insert()
    }

    function createStaff() {
        seq++
        var login = 'atf.fstaff.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('sys_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'FSTAFF-' + seq)
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

    /** 信用調査の実施まで進めた申請を作る */
    function createWithCheck(categoryId, staffId) {
        var entityId = createEntity()
        var userId = createApplicant(entityId)
        submitUtil.saveDraft(entityId, userId, FULL_INPUT)

        var requestId = submitUtil.getDraft(entityId).getUniqueValue()
        expenseUtil.save(requestId, {
            category_id: categoryId,
            description: 'ATF 明細1',
            amount: '3000000'
        })
        fillRequiredDocuments(requestId)

        if (!submitUtil.submit(entityId, userId, FULL_INPUT).success) {
            return null
        }
        reviewUtil.assign(requestId, staffId, staffId)
        reviewUtil.complete(requestId, staffId, 'ATF 一次審査完了')

        var judged = creditUtil.judge(requestId, staffId, true)
        if (!judged.success) {
            return null
        }
        return { requestId: requestId, checkId: judged.checkId }
    }

    function statusOf(requestId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.get(requestId)
        return gr.getValue('u_application_status')
    }

    function reloadCheck(checkId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_credit')
        gr.get(checkId)
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

    // -----------------------------------------------------------------------
    // 結果の検証
    // -----------------------------------------------------------------------
    check('結果が未選択なら弾く', creditUtil.validateResult('', '').length > 0, true)
    check('不正な結果を弾く', creditUtil.validateResult('unknown', '').length > 0, true)
    check('問題なしは通る', creditUtil.validateResult('ok', '').length, 0)
    check('条件付きは通る', creditUtil.validateResult('conditional', 'ATF メモ').length, 0)
    check('問題ありは通る', creditUtil.validateResult('ng', '').length, 0)

    var longNote = ''
    while (longNote.length <= 2000) {
        longNote = longNote + 'あ'
    }
    check('メモの文字数超過を弾く', creditUtil.validateResult('ok', longNote).length > 0, true)

    var category = pickSimpleCategory()
    check('日額上限のない経費区分が存在する', !!category, true)
    if (!category) {
        stepResult.setOutputMessage('対象経費区分マスタが未投入のため検証を中断しました')
        return
    }

    var staffId = createStaff()
    var target = createWithCheck(category.sys_id, staffId)
    check('検証用の調査を作成できた', !!target, true)
    if (!target) {
        stepResult.setOutputMessage('信用調査の実施まで進められなかったため検証を中断しました')
        return
    }

    // -----------------------------------------------------------------------
    // 異常系
    // -----------------------------------------------------------------------
    check('調査が未指定なら依頼できない', creditUtil.request('', staffId, 'ATF 調査機関', '').success, false)
    check('存在しない調査は依頼できない',
        creditUtil.request('00000000000000000000000000000000', staffId, 'ATF 調査機関', '').success, false)
    check('調査機関が未入力なら依頼できない',
        creditUtil.request(target.checkId, staffId, '', '').success, false)
    check('調査機関が空白のみでも依頼できない',
        creditUtil.request(target.checkId, staffId, '   ', '').success, false)
    check('依頼前は結果を取り込めない',
        creditUtil.receive(target.checkId, staffId, 'ok', '').success, false)
    check('依頼前は督促できない', creditUtil.remind(target.checkId, staffId).success, false)
    check('状態は準備中のまま', reloadCheck(target.checkId).getValue('u_state'), 'preparing')

    // -----------------------------------------------------------------------
    // ②外部機関へ依頼する
    // -----------------------------------------------------------------------
    var requested = creditUtil.request(target.checkId, staffId, '  ATF 調査機関  ', '')
    check('依頼が成功する', requested.success, true)
    check('返却されるアクション', requested.action, 'credit_request')
    check('回答予定日が既定日数で設定される', requested.dueOn, creditUtil.calcDueOn())

    var afterRequest = reloadCheck(target.checkId)
    check('状態が依頼済になる', afterRequest.getValue('u_state'), 'requested')
    check('調査機関が前後の空白を除いて記録される', afterRequest.getValue('u_agency'), 'ATF 調査機関')
    check('依頼日が記録される', !!afterRequest.getValue('u_requested_on'), true)
    check('回答予定日が記録される', afterRequest.getValue('u_due_on'), requested.dueOn)
    check('登録した事務局ユーザが記録される', afterRequest.getValue('u_updated_by_staff'), staffId)
    check('外部信用調査中へ遷移する', statusOf(target.requestId), 'ext_reviewing')
    check('依頼の履歴が記録される', countLogs(target.requestId, 'credit_requested'), 1)

    check('依頼済から再度依頼できない',
        creditUtil.request(target.checkId, staffId, 'ATF 調査機関2', '').success, false)

    // 回答予定日を明示した場合はその値が優先されること
    var dueTarget = createWithCheck(category.sys_id, staffId)
    if (dueTarget) {
        var explicit = creditUtil.request(dueTarget.checkId, staffId, 'ATF 調査機関', '2026-12-25')
        check('明示した回答予定日が優先される', explicit.dueOn, '2026-12-25')
        check('レコードにも明示した予定日が入る',
            reloadCheck(dueTarget.checkId).getValue('u_due_on'), '2026-12-25')
    }

    // -----------------------------------------------------------------------
    // 督促
    //
    // 調査は継続しているため、調査レコードの状態は依頼済のまま変えない。
    // -----------------------------------------------------------------------
    var reminded = creditUtil.remind(target.checkId, staffId)
    check('督促が成功する', reminded.success, true)
    check('返却されるアクション', reminded.action, 'credit_remind')
    check('調査結果取込待ちへ遷移する', statusOf(target.requestId), 'result_waiting')
    check('調査の状態は依頼済のまま', reloadCheck(target.checkId).getValue('u_state'), 'requested')
    check('督促の履歴が記録される', countLogs(target.requestId, 'credit_reminded'), 1)

    // 2回目の督促も記録できる（同じステータスのまま履歴が増える）
    check('2回目の督促も成功する', creditUtil.remind(target.checkId, staffId).success, true)
    check('督促の履歴が増える', countLogs(target.requestId, 'credit_reminded'), 2)
    check('ステータスは調査結果取込待ちのまま', statusOf(target.requestId), 'result_waiting')

    // -----------------------------------------------------------------------
    // ③調査結果を取り込む
    // -----------------------------------------------------------------------
    check('結果が未選択なら取込できない',
        creditUtil.receive(target.checkId, staffId, '', '').success, false)
    check('状態は依頼済のまま', reloadCheck(target.checkId).getValue('u_state'), 'requested')

    var received = creditUtil.receive(target.checkId, staffId, 'ok', '  ATF 事務局メモ  ')
    check('結果の取込が成功する', received.success, true)
    check('返却されるアクション', received.action, 'credit_receive')
    check('結果が返る', received.result, 'ok')

    var afterReceive = reloadCheck(target.checkId)
    check('状態が結果受領になる', afterReceive.getValue('u_state'), 'received')
    check('結果が記録される', afterReceive.getValue('u_result'), 'ok')
    check('メモが前後の空白を除いて記録される', afterReceive.getValue('u_note'), 'ATF 事務局メモ')
    check('取込日時が記録される', !!afterReceive.getValue('u_received_on'), true)
    check('信用調査結果確認中へ遷移する', statusOf(target.requestId), 'result_checking')
    check('取込の履歴が記録される', countLogs(target.requestId, 'credit_received'), 1)

    check('取込後は再度取込できない',
        creditUtil.receive(target.checkId, staffId, 'ng', '').success, false)
    check('取込後は督促できない', creditUtil.remind(target.checkId, staffId).success, false)

    /**
     * 結果を取り込んだ調査は取消できないこと。
     * 取り込んだ記録を消すと、どの結果で判断したのかが追えなくなる。
     */
    check('取込後は取消できない',
        creditUtil.cancel(target.checkId, staffId, 'ATF 取消理由').success, false)
    check('状態は結果受領のまま', reloadCheck(target.checkId).getValue('u_state'), 'received')

    // -----------------------------------------------------------------------
    // 結果が「問題あり」でも自動で不採択にしないこと
    // -----------------------------------------------------------------------
    var ngTarget = createWithCheck(category.sys_id, staffId)
    check('検証用の調査を作成できた', !!ngTarget, true)
    if (ngTarget) {
        creditUtil.request(ngTarget.checkId, staffId, 'ATF 調査機関', '')
        var ngReceived = creditUtil.receive(ngTarget.checkId, staffId, 'ng', 'ATF 問題ありのメモ')
        check('問題ありでも取込は成功する', ngReceived.success, true)
        check('注意が返る', ngReceived.warnings.length > 0, true)
        check('自動で不採択にはしない', statusOf(ngTarget.requestId), 'result_checking')
    }

    // -----------------------------------------------------------------------
    // 取消と再調査
    //
    // 1対多で持っているため、再調査で1回目の記録が残ることを確認する。
    // -----------------------------------------------------------------------
    var cancelTarget = createWithCheck(category.sys_id, staffId)
    check('検証用の調査を作成できた', !!cancelTarget, true)
    if (!cancelTarget) {
        stepResult.setOutputMessage('信用調査の実施まで進められなかったため検証を中断しました')
        return
    }
    creditUtil.request(cancelTarget.checkId, staffId, 'ATF 誤った調査機関', '')

    check('取消理由が未入力なら取消できない',
        creditUtil.cancel(cancelTarget.checkId, staffId, '').success, false)

    var cancelled = creditUtil.cancel(cancelTarget.checkId, staffId, 'ATF 取消理由：調査機関の誤り')
    check('取消が成功する', cancelled.success, true)
    check('返却されるアクション', cancelled.action, 'credit_cancel')
    check('状態が取消になる', reloadCheck(cancelTarget.checkId).getValue('u_state'), 'cancelled')
    check('取消理由が記録される',
        reloadCheck(cancelTarget.checkId).getValue('u_note'), 'ATF 取消理由：調査機関の誤り')
    check('要否判定へ戻る', statusOf(cancelTarget.requestId), 'credit_judging')
    check('取消の履歴が記録される', countLogs(cancelTarget.requestId, 'credit_cancelled'), 1)
    check('取消済みは再度取消できない',
        creditUtil.cancel(cancelTarget.checkId, staffId, 'ATF 理由').success, false)

    // 再調査：回次が2になり、1回目の記録が残ること
    var rejudged = creditUtil.judge(cancelTarget.requestId, staffId, true)
    check('要否判定をやり直せる', rejudged.success, true)
    check('外部調査準備中へ戻る', statusOf(cancelTarget.requestId), 'ext_preparing')

    var allChecks = creditUtil.list(cancelTarget.requestId)
    check('調査が2件になる', allChecks.length, 2)
    check('最新の回次は2', allChecks[0].sequence, 2)
    check('最新の状態は準備中', allChecks[0].state, 'preparing')
    check('1回目の回次は1', allChecks[1].sequence, 1)
    check('1回目の記録が残る', allChecks[1].state, 'cancelled')
    check('1回目の調査機関が残る', allChecks[1].agency, 'ATF 誤った調査機関')

    stepResult.setOutputMessage('信用調査の依頼・督促・結果取込・取消を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
