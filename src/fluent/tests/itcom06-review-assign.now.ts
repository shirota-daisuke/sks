import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * 一次審査：対象一覧と担当者割当（画面イメージ ITCOM-06）の単体テスト
 *
 * 対象のカスタムロジックは ApplicationReviewUtil（Script Include）。
 *
 * ■ このテストで守りたいこと
 *   ・一次審査の対象ステータスの判定が業務フローと一致していること
 *   ・審査期限が「提出日＋SLA日数」で算出されること（一覧の期限超過の絞込に使う）
 *   ・担当を引き受けると受付済→一次審査中、不備修正回答あり→再審査中へ遷移すること
 *   ・既に他の担当者が付いている申請を奪えないこと
 *   ・同じ担当者が再実行しても履歴が増えないこと
 *
 * とくに「他の担当者の申請を奪えないこと」は、二重に審査されて判定が上書きされるのを
 * 防ぐためのもの。UI Action の condition は表示制御でしかないため、サーバー側で固定する。
 *
 * ■ テスト方式
 * Script Include には UI が無いため atf.server.runServerSideScript で
 * クラスを直接インスタンス化して検証する（他の SC テストと同じ方式）。
 * 検証には Jasmine を使わず assertEqual を使う（理由は sc11-registration-review.now.ts のコメント参照）。
 */
Test(
    {
        $id: Now.ID['test_review_assign'],
        name: '一次審査：担当者割当と審査開始',
        description:
            'ApplicationReviewUtil.isPending／canStart／getSlaDays／calcDueOn／assign を検証する。一次審査の対象ステータスの判定、審査期限が提出日＋SLA日数で算出されること、担当の引き受けで受付済から一次審査中・不備修正回答ありから再審査中へ遷移して担当者と履歴が記録されること、他の担当者が割り当てられている申請は引き受けられないこと、同じ担当者の再実行で履歴が増えないことを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_review_step_assign'],
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
        gr.setValue('u_business_name', 'ATF 一次審査テスト事業者 ' + RUN + '-' + seq)
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
        var login = 'atf.review.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'REVIEW-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'registered')
        gr.setValue('u_duplicate_check_result', 'no_duplicate')
        gr.setValue('u_auth_method', 'standard')
        return gr.insert()
    }

    /** 事務局ユーザ（標準の sys_user をそのまま使う方針） */
    function createStaff() {
        seq++
        var login = 'atf.staff.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('sys_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'STAFF-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('active', true)
        return gr.insert()
    }

    /** 必須書類にファイルを登録する（画面では添付 REST API から登録される） */
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

    /** 提出済み（受付済）の申請を1件作る */
    function createSubmitted(categoryId) {
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
    // 対象ステータスの判定
    //
    // 業務フロー「申請ステータス一覧」のうち、事務局が一次審査で扱うもの。
    // -----------------------------------------------------------------------
    check('受付済は対象', reviewUtil.isPending('accepted'), true)
    check('一次審査中は対象', reviewUtil.isPending('first_review'), true)
    check('不備修正回答ありは対象', reviewUtil.isPending('defect_answered'), true)
    check('再審査中は対象', reviewUtil.isPending('re_review'), true)
    check('申請入力中は対象外', reviewUtil.isPending('input'), false)
    check('不備修正中は対象外', reviewUtil.isPending('defect_fixing'), false)
    check('一次審査完了は対象外', reviewUtil.isPending('first_review_done'), false)
    check('不採択は対象外', reviewUtil.isPending('rejected'), false)
    check('未設定は対象外', reviewUtil.isPending(''), false)

    // 引き受けで遷移が発生するステータス
    check('受付済は引き受けできる', reviewUtil.canStart('accepted'), true)
    check('不備修正回答ありは引き受けできる', reviewUtil.canStart('defect_answered'), true)
    check('一次審査中は引き受け済み', reviewUtil.canStart('first_review'), false)
    check('再審査中は引き受け済み', reviewUtil.canStart('re_review'), false)
    check('申請入力中は引き受けできない', reviewUtil.canStart('input'), false)

    // -----------------------------------------------------------------------
    // 審査期限（提出日＋SLA日数）
    //
    // 期待値はテストへ固定値で書かず、プロパティの値から組み立てる。
    // -----------------------------------------------------------------------
    var slaDays = reviewUtil.getSlaDays()
    check('SLA日数が正の値', slaDays > 0, true)

    var expected = new GlideDateTime()
    expected.setValue('2026-09-01 09:00:00')
    expected.addDaysLocalTime(slaDays)
    check('提出日＋SLA日数で算出される',
        reviewUtil.calcDueOn('2026-09-01 09:00:00'), expected.getDate().getValue())

    // 提出日が未設定の場合は現在日時から算出する（未設定でも期限を空にしない）
    check('提出日が未設定でも期限を返す', reviewUtil.calcDueOn('') !== '', true)

    // -----------------------------------------------------------------------
    // 異常系
    // -----------------------------------------------------------------------
    var staffId = createStaff()
    check('検証用の事務局ユーザを作成できた', !!staffId, true)

    check('申請が未指定なら割当できない', reviewUtil.assign('', staffId, staffId).success, false)
    check('担当者が未指定なら割当できない',
        reviewUtil.assign('00000000000000000000000000000000', '', staffId).success, false)
    check('存在しない申請は割当できない',
        reviewUtil.assign('00000000000000000000000000000000', staffId, staffId).success, false)

    var category = pickSimpleCategory()
    check('日額上限のない経費区分が存在する', !!category, true)
    if (!category) {
        stepResult.setOutputMessage('対象経費区分マスタが未投入のため検証を中断しました')
        return
    }

    // 申請入力中（下書き）は一次審査の対象ではない
    var draftEntityId = createEntity()
    var draftUserId = createApplicant(draftEntityId)
    submitUtil.saveDraft(draftEntityId, draftUserId, FULL_INPUT)
    var draftId = submitUtil.getDraft(draftEntityId).getUniqueValue()
    check('申請入力中の申請は割当できない', reviewUtil.assign(draftId, staffId, staffId).success, false)
    check('割当できなかった申請のステータスは変わらない',
        reload(draftId).getValue('u_application_status'), 'input')

    // -----------------------------------------------------------------------
    // 受付済 → 一次審査中
    // -----------------------------------------------------------------------
    var requestId = createSubmitted(category.sys_id)
    check('検証用の提出済み申請を作成できた', !!requestId, true)
    if (!requestId) {
        stepResult.setOutputMessage('提出に失敗したため検証を中断しました')
        return
    }

    var beforeAssign = reload(requestId)
    check('提出直後は受付済', beforeAssign.getValue('u_application_status'), 'accepted')
    check('提出時に審査期限が設定される', beforeAssign.getValue('u_review_due_on') !== '', true)
    check('審査期限が提出日から算出されている',
        beforeAssign.getValue('u_review_due_on'),
        reviewUtil.calcDueOn(beforeAssign.getValue('u_submitted_on')))
    check('提出直後は担当未割当', beforeAssign.getValue('u_review_assigned_to'), '')

    var assigned = reviewUtil.assign(requestId, staffId, staffId)
    check('担当の引き受けが成功する', assigned.success, true)
    check('返却されるアクション', assigned.action, 'assign_review')
    check('担当を割り当てたことが返る', assigned.assigned, true)
    check('ステータスが変わったことが返る', assigned.statusChanged, true)
    check('遷移後のステータスが返る', assigned.status, 'first_review')

    var afterAssign = reload(requestId)
    check('一次審査中へ遷移する', afterAssign.getValue('u_application_status'), 'first_review')
    check('審査担当者が記録される', afterAssign.getValue('u_review_assigned_to'), staffId)
    check('担当割当の履歴が記録される', countLogs(requestId, 'review_assigned'), 1)
    check('審査開始の履歴が記録される', countLogs(requestId, 'review_started'), 1)

    /**
     * 同じ担当者が再実行しても履歴が増えないこと。
     * 一覧から続けて開く操作で履歴が積み上がると経過が読めなくなる。
     */
    var again = reviewUtil.assign(requestId, staffId, staffId)
    check('同じ担当者の再実行は成功として扱う', again.success, true)
    check('2回目は割当を行わない', again.assigned, false)
    check('2回目は遷移も行わない', again.statusChanged, false)
    check('担当割当の履歴は増えない', countLogs(requestId, 'review_assigned'), 1)
    check('審査開始の履歴は増えない', countLogs(requestId, 'review_started'), 1)
    check('ステータスは一次審査中のまま', reload(requestId).getValue('u_application_status'), 'first_review')

    /**
     * 他の担当者が割り当てられている申請は引き受けられないこと。
     * 黙って奪えると二重に審査され、判定が上書きされる。
     */
    var otherStaffId = createStaff()
    var stolen = reviewUtil.assign(requestId, otherStaffId, otherStaffId)
    check('他の担当者は引き受けできない', stolen.success, false)
    check('理由が返る', stolen.errors.length > 0, true)
    check('担当者は変わらない', reload(requestId).getValue('u_review_assigned_to'), staffId)

    // -----------------------------------------------------------------------
    // 不備修正回答あり → 再審査中
    // -----------------------------------------------------------------------
    var reRequestId = createSubmitted(category.sys_id)
    check('検証用の申請を作成できた', !!reRequestId, true)
    if (reRequestId) {
        // 事務局側（ITCOM-07）は未実装のため、不備修正の回答を受けた状態を直接作る
        var reGr = reload(reRequestId)
        reGr.setValue('u_application_status', 'defect_answered')
        reGr.update()

        var reAssigned = reviewUtil.assign(reRequestId, staffId, staffId)
        check('不備修正回答ありの引き受けが成功する', reAssigned.success, true)
        check('再審査中へ遷移する', reAssigned.status, 're_review')
        check('レコードも再審査中になる',
            reload(reRequestId).getValue('u_application_status'), 're_review')
        check('審査開始の履歴が記録される', countLogs(reRequestId, 'review_started'), 1)
    }

    // -----------------------------------------------------------------------
    // 期限が未設定の申請は割当時に補うこと
    //
    // 審査期限を提出時に設定する前に作られた申請でも、一覧の期限超過の絞込から
    // 漏れないようにする。
    // -----------------------------------------------------------------------
    var noDueId = createSubmitted(category.sys_id)
    check('検証用の申請を作成できた', !!noDueId, true)
    if (noDueId) {
        var noDueGr = reload(noDueId)
        noDueGr.setValue('u_review_due_on', '')
        noDueGr.update()
        check('期限を空にできた', reload(noDueId).getValue('u_review_due_on'), '')

        check('割当が成功する', reviewUtil.assign(noDueId, staffId, staffId).success, true)
        check('割当時に期限が補われる', reload(noDueId).getValue('u_review_due_on') !== '', true)
    }

    stepResult.setOutputMessage('一次審査の担当者割当と審査開始を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
