import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * 一次審査：申請詳細・審査の判定（画面イメージ ITCOM-07）の単体テスト
 *
 * 対象のカスタムロジックは ApplicationReviewUtil の complete／requestDefect／reject。
 *
 * ■ このテストで守りたいこと
 *   ・審査に着手していない申請（受付済）を判定できないこと
 *   ・担当外の事務局ユーザが判定できないこと
 *   ・判定結果・審査者・審査日時が記録されること
 *   ・不備確認依頼で前回の回答が入力欄から消え、履歴には残ること
 *   ・不採択は理由区分と通知文の両方を必須とすること
 *   ・判定後は同じ判定を二重に実行できないこと
 *
 * とくに不採択理由の必須化は、SC-11 のユーザ登録審査で「却下理由を記録する項目が無く
 * 後から追えない」という問題が残っているため、申請側で同じ状態にしないための検証。
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
Test(
    {
        $id: Now.ID['test_review_judge'],
        name: '一次審査：判定（完了・不備確認依頼・不採択）',
        description:
            'ApplicationReviewUtil.canJudge／validateNote／complete／requestDefect／reject を検証する。審査に着手していない申請と担当外の事務局ユーザが判定できないこと、一次審査完了で判定結果・審査者・審査日時が記録されること、不備確認依頼で回答期限が設定され前回の回答が入力欄から消えて履歴に残ること、不採択は理由区分と通知文の両方を必須とし確定日時も記録されること、判定後は二重に実行できないことを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_review_step_judge'],
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
        gr.setValue('u_business_name', 'ATF 審査判定テスト事業者 ' + RUN + '-' + seq)
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
        var login = 'atf.judge.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'JUDGE-' + seq)
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
        var login = 'atf.jstaff.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('sys_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'JSTAFF-' + seq)
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
    // 判定できるステータスの判定
    // -----------------------------------------------------------------------
    check('一次審査中は判定できる', reviewUtil.canJudge('first_review'), true)
    check('再審査中は判定できる', reviewUtil.canJudge('re_review'), true)
    check('受付済は判定できない', reviewUtil.canJudge('accepted'), false)
    check('不備修正回答ありは判定できない', reviewUtil.canJudge('defect_answered'), false)
    check('一次審査完了は判定できない', reviewUtil.canJudge('first_review_done'), false)
    check('不採択は判定できない', reviewUtil.canJudge('rejected'), false)
    check('未設定は判定できない', reviewUtil.canJudge(''), false)

    // -----------------------------------------------------------------------
    // 入力の検証
    // -----------------------------------------------------------------------
    check('任意の内容は未入力でも通る', reviewUtil.validateNote('', false).length, 0)
    check('必須の内容は未入力を弾く', reviewUtil.validateNote('', true).length > 0, true)
    check('空白のみも未入力として弾く', reviewUtil.validateNote('   ', true).length > 0, true)
    check('通常の内容は通る', reviewUtil.validateNote('ATF 審査メモ', true).length, 0)

    var longNote = ''
    while (longNote.length <= 2000) {
        longNote = longNote + 'あ'
    }
    check('文字数超過を弾く', reviewUtil.validateNote(longNote, false).length > 0, true)

    // 不備確認依頼の回答期限
    check('回答期限の日数が正の値', reviewUtil.getDefectDueDays() > 0, true)
    var expectedDue = new GlideDateTime()
    expectedDue.addDaysLocalTime(reviewUtil.getDefectDueDays())
    check('回答期限が依頼日＋日数で算出される',
        reviewUtil.calcDefectDueOn(), expectedDue.getDate().getValue())

    var category = pickSimpleCategory()
    check('日額上限のない経費区分が存在する', !!category, true)
    if (!category) {
        stepResult.setOutputMessage('対象経費区分マスタが未投入のため検証を中断しました')
        return
    }

    var staffId = createStaff()
    var otherStaffId = createStaff()
    check('検証用の事務局ユーザを作成できた', !!staffId, true)

    // -----------------------------------------------------------------------
    // 異常系：着手前・担当外・引数不足
    // -----------------------------------------------------------------------
    check('申請が未指定なら完了できない', reviewUtil.complete('', staffId, '').success, false)
    check('審査者が未指定なら完了できない',
        reviewUtil.complete('00000000000000000000000000000000', '', '').success, false)
    check('存在しない申請は完了できない',
        reviewUtil.complete('00000000000000000000000000000000', staffId, '').success, false)

    var notStartedId = createSubmitted(category.sys_id)
    check('検証用の提出済み申請を作成できた', !!notStartedId, true)
    if (!notStartedId) {
        stepResult.setOutputMessage('提出に失敗したため検証を中断しました')
        return
    }

    /**
     * 受付済のまま判定できないこと。
     * 担当も期限も決まっていない申請が結論だけ出るのを防ぐ。
     */
    check('着手前は完了できない', reviewUtil.complete(notStartedId, staffId, '').success, false)
    check('着手前は不備依頼できない',
        reviewUtil.requestDefect(notStartedId, staffId, 'ATF 指摘', '').success, false)
    check('着手前は不採択にできない',
        reviewUtil.reject(notStartedId, staffId, 'other', 'ATF 理由').success, false)
    check('ステータスは受付済のまま', reload(notStartedId).getValue('u_application_status'), 'accepted')

    // 担当外の事務局ユーザは判定できない
    reviewUtil.assign(notStartedId, staffId, staffId)
    check('着手後は一次審査中', reload(notStartedId).getValue('u_application_status'), 'first_review')
    check('担当外は完了できない', reviewUtil.complete(notStartedId, otherStaffId, '').success, false)
    check('担当外は不備依頼できない',
        reviewUtil.requestDefect(notStartedId, otherStaffId, 'ATF 指摘', '').success, false)
    check('担当外は不採択にできない',
        reviewUtil.reject(notStartedId, otherStaffId, 'other', 'ATF 理由').success, false)

    // -----------------------------------------------------------------------
    // 一次審査を完了する
    // -----------------------------------------------------------------------
    var completed = reviewUtil.complete(notStartedId, staffId, '  ATF 審査メモ：要件を満たしている  ')
    check('一次審査の完了が成功する', completed.success, true)
    check('返却されるアクション', completed.action, 'review_complete')
    check('遷移後のステータスが返る', completed.status, 'first_review_done')

    var afterComplete = reload(notStartedId)
    check('一次審査完了へ遷移する', afterComplete.getValue('u_application_status'), 'first_review_done')
    check('判定が記録される', afterComplete.getValue('u_review_result'), 'passed')
    check('審査理由が前後の空白を除いて記録される',
        afterComplete.getValue('u_review_note'), 'ATF 審査メモ：要件を満たしている')
    check('審査者が記録される', afterComplete.getValue('u_reviewed_by'), staffId)
    check('審査日時が記録される', !!afterComplete.getValue('u_reviewed_on'), true)
    check('履歴が記録される', countLogs(notStartedId, 'review_passed'), 1)

    // 判定後は二重に実行できない
    check('完了後は再度完了できない', reviewUtil.complete(notStartedId, staffId, '').success, false)
    check('完了後は不備依頼できない',
        reviewUtil.requestDefect(notStartedId, staffId, 'ATF 指摘', '').success, false)
    check('完了後は不採択にできない',
        reviewUtil.reject(notStartedId, staffId, 'other', 'ATF 理由').success, false)
    check('履歴は増えない', countLogs(notStartedId, 'review_passed'), 1)

    // -----------------------------------------------------------------------
    // 不備修正を依頼する
    // -----------------------------------------------------------------------
    var defectId = createSubmitted(category.sys_id)
    check('検証用の申請を作成できた', !!defectId, true)
    if (!defectId) {
        stepResult.setOutputMessage('提出に失敗したため検証を中断しました')
        return
    }
    reviewUtil.assign(defectId, staffId, staffId)

    // 前回の回答がある状態を作る（2回目の不備確認依頼を再現する）
    var withReply = reload(defectId)
    withReply.setValue('u_defect_reply', 'ATF 前回の回答')
    withReply.update()

    check('不備内容が未入力なら依頼できない',
        reviewUtil.requestDefect(defectId, staffId, '', '').success, false)
    check('ステータスは一次審査中のまま', reload(defectId).getValue('u_application_status'), 'first_review')

    var requested = reviewUtil.requestDefect(defectId, staffId, '  ATF 指摘：金額をご確認ください。  ', '')
    check('不備確認の依頼が成功する', requested.success, true)
    check('返却されるアクション', requested.action, 'review_request_defect')
    check('遷移後のステータスが返る', requested.status, 'defect_request')
    check('回答期限が既定日数で設定される', requested.dueOn, reviewUtil.calcDefectDueOn())
    check('案内メールが送信対象になる', requested.mailQueued, true)

    var afterDefect = reload(defectId)
    check('不備確認依頼へ遷移する', afterDefect.getValue('u_application_status'), 'defect_request')
    check('判定が記録される', afterDefect.getValue('u_review_result'), 'defect')
    check('不備内容が前後の空白を除いて記録される',
        afterDefect.getValue('u_defect_note'), 'ATF 指摘：金額をご確認ください。')
    check('回答期限が記録される', afterDefect.getValue('u_defect_due_on'), requested.dueOn)
    check('審査者が記録される', afterDefect.getValue('u_reviewed_by'), staffId)
    check('依頼の履歴が記録される', countLogs(defectId, 'defect_requested'), 1)

    /**
     * 前回の回答が入力欄から消えること。
     * 残っていると事業者の修正画面に前回の回答が初期値として表示され、
     * 今回の指摘への回答と混ざる。
     */
    check('前回の回答が消える', afterDefect.getValue('u_defect_reply'), '')
    check('前回の回答は履歴に残る', countLogs(defectId, 'defect_answered'), 1)

    // 回答期限を明示した場合はその値が優先されること
    var dueId = createSubmitted(category.sys_id)
    if (dueId) {
        reviewUtil.assign(dueId, staffId, staffId)
        var explicit = reviewUtil.requestDefect(dueId, staffId, 'ATF 指摘', '2026-12-25')
        check('明示した回答期限が優先される', explicit.dueOn, '2026-12-25')
        check('レコードにも明示した期限が入る',
            reload(dueId).getValue('u_defect_due_on'), '2026-12-25')
    }

    // -----------------------------------------------------------------------
    // 不採択にする
    // -----------------------------------------------------------------------
    var rejectId = createSubmitted(category.sys_id)
    check('検証用の申請を作成できた', !!rejectId, true)
    if (!rejectId) {
        stepResult.setOutputMessage('提出に失敗したため検証を中断しました')
        return
    }
    reviewUtil.assign(rejectId, staffId, staffId)

    check('理由区分が未選択なら不採択にできない',
        reviewUtil.reject(rejectId, staffId, '', 'ATF 理由').success, false)
    check('通知文が未入力なら不採択にできない',
        reviewUtil.reject(rejectId, staffId, 'other', '').success, false)
    check('どちらも未入力なら理由が2件返る',
        reviewUtil.reject(rejectId, staffId, '', '').errors.length, 2)
    check('ステータスは一次審査中のまま', reload(rejectId).getValue('u_application_status'), 'first_review')

    var rejected = reviewUtil.reject(
        rejectId,
        staffId,
        'sales_invalid',
        '  ATF 通知文：売上増加率の要件を満たしていません。  '
    )
    check('不採択の確定が成功する', rejected.success, true)
    check('返却されるアクション', rejected.action, 'review_reject')
    check('遷移後のステータスが返る', rejected.status, 'rejected')

    var afterReject = reload(rejectId)
    check('不採択へ遷移する', afterReject.getValue('u_application_status'), 'rejected')
    check('判定が記録される', afterReject.getValue('u_review_result'), 'rejected')
    check('理由区分が記録される', afterReject.getValue('u_reject_reason_code'), 'sales_invalid')
    check('通知文が前後の空白を除いて記録される',
        afterReject.getValue('u_reject_reason'), 'ATF 通知文：売上増加率の要件を満たしていません。')
    check('審査者が記録される', afterReject.getValue('u_reviewed_by'), staffId)

    /**
     * 不採択は終端状態のため、採択判定（ITCOM-09）を待たずに確定日時・確定者を記録する。
     * 空のままにすると、いつ誰が決めたのかが追えない。
     */
    check('確定日時が記録される', !!afterReject.getValue('u_decided_on'), true)
    check('確定者が記録される', afterReject.getValue('u_decided_by'), staffId)
    check('履歴が記録される', countLogs(rejectId, 'rejected'), 1)

    check('不採択後は判定できない', reviewUtil.complete(rejectId, staffId, '').success, false)
    check('不採択後は担当の引き受けもできない',
        reviewUtil.assign(rejectId, staffId, staffId).success, false)

    stepResult.setOutputMessage('一次審査の判定を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
