import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * 申請の内容確認・提出（画面イメージ ITCOM-04）の単体テスト
 *
 * 対象のカスタムロジックは ApplicationSubmitUtil.checkReadyToSubmit。
 *
 * ■ このテストで守りたいこと
 *   ・提出できない理由が、どのステップへ戻れば直せるか分かる形で返ること
 *   ・基本情報・対象経費・添付書類の3つがすべて判定されること
 *   ・画面を経由せず作られた日額上限違反の明細も検出されること
 *   ・そろっていれば ok になること
 *
 * この判定は submit() も使っている。確認画面と提出で条件が食い違うと、
 * 「提出できる」と表示されているのに提出できない画面になるため、
 * 同じメソッドを使っていることを前提に固定する。
 *
 * ■ テスト方式
 * Script Include には UI が無いため atf.server.runServerSideScript で
 * クラスを直接インスタンス化して検証する（他の SC テストと同じ方式）。
 * 検証には Jasmine を使わず assertEqual を使う（理由は sc11-registration-review.now.ts のコメント参照）。
 */
Test(
    {
        $id: Now.ID['test_confirm_ready'],
        name: '申請の内容確認：提出可否の判定',
        description:
            'ApplicationSubmitUtil.checkReadyToSubmit を検証する。基本情報の必須項目・対象経費明細の有無と日額上限違反・必須書類の充足がいずれも判定され、理由に戻るべきステップ（basic／expense／document）が付くこと、画面を経由せず作られた日額上限違反の明細も検出されること、すべてそろうと ok になり対象経費の合計が返ることを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_confirm_step_ready'],
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

    /** 基本情報がすべてそろった入力値 */
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
        gr.setValue('u_business_name', 'ATF 内容確認テスト事業者 ' + RUN + '-' + seq)
        gr.setValue('u_entity_type', 'corporate')
        gr.setValue('u_corporate_number', RUN + ('00' + seq).slice(-3))
        gr.setValue('u_address', 'ATF テスト住所')
        gr.setValue('u_industry', 'service')
        gr.setValue('u_employee_count', 10)
        gr.setValue('u_capital', 5000)
        return gr.insert()
    }

    function createUser(entityId) {
        seq++
        var login = 'atf.confirm.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'CONFIRM-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'registered')
        gr.setValue('u_duplicate_check_result', 'no_duplicate')
        gr.setValue('u_auth_method', 'standard')
        return gr.insert()
    }

    /** 下書きを1件用意する */
    function createDraft(input) {
        var entityId = createEntity()
        var userId = createUser(entityId)
        submitUtil.saveDraft(entityId, userId, input)
        return { entityId: entityId, userId: userId, requestId: submitUtil.getDraft(entityId).getUniqueValue() }
    }

    /** 必須書類にファイルを登録する（画面では添付 REST API から登録される） */
    function fillRequiredDocuments(requestId, input) {
        docUtil.ensureRows(requestId, {
            organizationType: input.organization_type,
            specialMeasure: input.special_measure
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

    /** 指定の step の理由が含まれているか */
    function hasStep(ready, step) {
        for (var i = 0; i < ready.blockers.length; i++) {
            if (ready.blockers[i].step === step) {
                return true
            }
        }
        return false
    }

    /** すべての理由にメッセージと step が付いているか */
    function allDescribed(ready) {
        var STEPS = ['basic', 'expense', 'document']
        for (var i = 0; i < ready.blockers.length; i++) {
            if (!ready.blockers[i].message) {
                return false
            }
            if (STEPS.indexOf(ready.blockers[i].step) < 0) {
                return false
            }
        }
        return true
    }

    var categories = expenseUtil.getCategories()
    var simple = null
    var capped = null
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].hasDailyCap) {
            if (!capped) {
                capped = categories[i]
            }
        } else if (!simple) {
            simple = categories[i]
        }
    }
    check('日額上限のない経費区分が存在する', !!simple, true)
    if (!simple) {
        stepResult.setOutputMessage('対象経費区分マスタが未投入のため検証を中断しました')
        return
    }

    // -----------------------------------------------------------------------
    // 申請が未指定の場合
    // -----------------------------------------------------------------------
    var noRequest = submitUtil.checkReadyToSubmit('', FULL_INPUT)
    check('申請が未指定なら提出できない', noRequest.ok, false)
    check('申請が未指定なら合計は0', noRequest.totalExpense, 0)

    // -----------------------------------------------------------------------
    // 入力直後：対象経費と添付書類が不足していること
    // -----------------------------------------------------------------------
    var draft = createDraft(FULL_INPUT)
    var initial = submitUtil.checkReadyToSubmit(draft.requestId, FULL_INPUT)

    check('入力直後は提出できない', initial.ok, false)
    check('理由が返る', initial.blockers.length > 0, true)
    check('すべての理由にメッセージと戻り先が付く', allDescribed(initial), true)
    check('基本情報の不足は無い', hasStep(initial, 'basic'), false)
    check('対象経費の不足が示される', hasStep(initial, 'expense'), true)
    check('添付書類の不足が示される', hasStep(initial, 'document'), true)

    // -----------------------------------------------------------------------
    // 基本情報が未入力の場合
    // -----------------------------------------------------------------------
    var emptyBasic = submitUtil.checkReadyToSubmit(draft.requestId, {})
    check('基本情報が未入力なら提出できない', emptyBasic.ok, false)
    check('基本情報の不足が示される', hasStep(emptyBasic, 'basic'), true)
    // 未入力の必須項目は4つ（組織形態・従業員数区分・対象月・増加率）
    var basicCount = 0
    for (var j = 0; j < emptyBasic.blockers.length; j++) {
        if (emptyBasic.blockers[j].step === 'basic') {
            basicCount++
        }
    }
    check('未入力の必須項目の数だけ理由が並ぶ', basicCount, 4)

    // 申請時点より後の月も基本情報の不足として扱う
    var futureMonth = submitUtil.checkReadyToSubmit(draft.requestId, {
        organization_type: 'corporate',
        employee_category: 'le20',
        sales_increase_target_month: '2099-12',
        sales_increase_rate: '0.15'
    })
    check('申請時点より後の月は基本情報の不足になる', hasStep(futureMonth, 'basic'), true)

    // -----------------------------------------------------------------------
    // 対象経費を登録すると経費の不足が消えること
    // -----------------------------------------------------------------------
    check('明細の追加が成功する', expenseUtil.save(draft.requestId, {
        category_id: simple.sys_id,
        description: 'ATF 明細1',
        amount: '2000000'
    }).success, true)

    var afterExpense = submitUtil.checkReadyToSubmit(draft.requestId, FULL_INPUT)
    check('対象経費の不足が消える', hasStep(afterExpense, 'expense'), false)
    check('添付書類の不足は残る', hasStep(afterExpense, 'document'), true)
    check('対象経費の合計が返る', afterExpense.totalExpense, 2000000)
    check('添付書類が未提出なら提出できない', afterExpense.ok, false)

    // -----------------------------------------------------------------------
    // 必須書類がそろえば提出できること
    // -----------------------------------------------------------------------
    fillRequiredDocuments(draft.requestId, FULL_INPUT)
    var ready = submitUtil.checkReadyToSubmit(draft.requestId, FULL_INPUT)
    check('すべてそろえば提出できる', ready.ok, true)
    check('理由は無い', ready.blockers.length, 0)
    check('合計が返る', ready.totalExpense, 2000000)

    // -----------------------------------------------------------------------
    // 画面を経由せず作られた日額上限違反の明細も検出すること
    //
    // ApplicationExpenseUtil.save は日額上限を検証して弾くため、
    // 違反した明細はレコードを直接作らないと再現できない。
    // 画面以外の経路（レコードの一覧・REST API）で作られた場合の保険であり、
    // ここが抜けると上限を超えた申請が提出できてしまう。
    // -----------------------------------------------------------------------
    check('日額上限のある経費区分が存在する', !!capped, true)
    var fees = expenseUtil.getExpertFees()
    var fee = null
    for (var k = 0; k < fees.length; k++) {
        if (fees[k].dailyCap > 0) {
            fee = fees[k]
            break
        }
    }
    check('専門家経費日額上限マスタが投入されている', !!fee, true)

    if (capped && fee) {
        var violation = new GlideRecord('x_dent2_dentsusoke_exp_item')
        violation.initialize()
        violation.setValue('u_request', draft.requestId)
        violation.setValue('u_expense_category', capped.sys_id)
        violation.setValue('u_expert_fee', fee.sys_id)
        violation.setValue('u_description', 'ATF 上限違反の明細')
        violation.setValue('u_amount', (fee.dailyCap + 1000) * 2)
        violation.setValue('u_days', 2)
        violation.setValue('u_order', 900)
        check('違反した明細を直接作成できた', !!violation.insert(), true)

        var withViolation = submitUtil.checkReadyToSubmit(draft.requestId, FULL_INPUT)
        check('上限違反があると提出できない', withViolation.ok, false)
        check('対象経費の理由として示される', hasStep(withViolation, 'expense'), true)

        // どの明細が原因か分かること（理由に明細の内容が含まれる）
        var mentioned = false
        for (var m = 0; m < withViolation.blockers.length; m++) {
            if (withViolation.blockers[m].message.indexOf('ATF 上限違反の明細') >= 0) {
                mentioned = true
            }
        }
        check('理由に対象の明細が示される', mentioned, true)

        // 違反した明細を削除すれば提出できる状態へ戻ること
        check('違反した明細を削除できる',
            expenseUtil.remove(draft.requestId, violation.getUniqueValue()).success, true)
        check('削除すれば提出できる', submitUtil.checkReadyToSubmit(draft.requestId, FULL_INPUT).ok, true)
    }

    // -----------------------------------------------------------------------
    // 提出まで通ること（確認画面の判定と提出が食い違わないこと）
    // -----------------------------------------------------------------------
    var submitted = submitUtil.submit(draft.entityId, draft.userId, FULL_INPUT)
    check('確認画面が ok なら提出できる', submitted.success, true)
    check('提出結果の対象経費が一致する', submitted.totalExpense, 2000000)

    stepResult.setOutputMessage('内容確認・提出の判定を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
