import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * 申請の不備修正（画面イメージ ITCOM-05）の単体テスト
 *
 * 対象のカスタムロジックは ApplicationDefectUtil（Script Include）。
 *
 * ■ このテストで守りたいこと
 *   ・他社の申請と、不備対応中でない申請を対象にしないこと
 *   ・画面を開いた時点で不備修正中へ遷移し、再読み込みで履歴が増えないこと
 *   ・一時保存ではステータスが変わらないこと
 *   ・回答・対象経費・添付書類のいずれかが欠けている間は再提出できないこと
 *   ・再提出で不備修正回答あり（defect_answered）へ遷移し、補助金額が再判定されること
 *
 * とくに補助金額の再判定は、明細を直したのに古い金額のまま審査へ渡るのを防ぐためのもの。
 * 再判定のあとにレコードを取り直さずに更新すると金額が巻き戻るため、順序も固定する。
 *
 * ■ ユーザ登録の不備対応（処理No.7）とは別物
 * ユーザ登録側は sc11-registration-defect.now.ts で検証している。
 * 対象テーブル・ステータス・トークンの有無が異なる。
 *
 * ■ テスト方式
 * Script Include には UI が無いため atf.server.runServerSideScript で
 * クラスを直接インスタンス化して検証する（他の SC テストと同じ方式）。
 * 検証には Jasmine を使わず assertEqual を使う（理由は sc11-registration-review.now.ts のコメント参照）。
 *
 * ■ 準備処理を2つのテストへ重複して書いている理由
 * script には必ず単一の文字列リテラルを渡す必要がある。
 * 共通部分を定数にして ${...} で差し込むと Fluent がビルド時に評価できず、
 * 「Failed to cast IdentifierShape to PropertyAccessShape」でテストが生成されない
 * （ACL の条件スクリプトと同じ制約：src/fluent/acls/application-acls.now.ts のコメント参照）。
 */

/** 対象の特定・修正の開始・一時保存 */
Test(
    {
        $id: Now.ID['test_app_defect_start'],
        name: '申請の不備修正：対象の特定と修正の開始',
        description:
            'ApplicationDefectUtil.find／buildContext／getDaysLeft／validateReply／startFixing／saveReply を検証する。自社かつ不備対応中の申請のみを対象とし他社・審査中の申請を返さないこと、指摘内容と回答期限の残日数が取得できること、開始で不備確認依頼から不備修正中へ遷移して履歴が1件だけ記録されること、一時保存では回答のみ保存されステータスが変わらないことを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_app_defect_step_start'],
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
    var defectUtil = new x_dent2_dentsusoke.ApplicationDefectUtil()

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
        gr.setValue('u_business_name', 'ATF 不備修正テスト事業者 ' + RUN + '-' + seq)
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
        var login = 'atf.appdefect.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'APPDEFECT-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'registered')
        gr.setValue('u_duplicate_check_result', 'no_duplicate')
        gr.setValue('u_auth_method', 'standard')
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

    /** 今日からの相対日付（yyyy-MM-dd）。日付境界の影響を避けるため正午を基準にする */
    function dateAfter(days) {
        var dt = new GlideDateTime()
        dt.setValue(new GlideDate().getValue() + ' 12:00:00')
        dt.addDays(days)
        return dt.getDate().getValue()
    }

    /** 提出済みの申請を1件作り、事務局が不備確認を依頼した状態にする */
    function createDefectRequest(categoryId, note, dueOn) {
        var entityId = createEntity()
        var userId = createUser(entityId)
        submitUtil.saveDraft(entityId, userId, FULL_INPUT)

        var requestId = submitUtil.getDraft(entityId).getUniqueValue()
        expenseUtil.save(requestId, {
            category_id: categoryId,
            description: 'ATF 明細1',
            amount: '3000000'
        })
        fillRequiredDocuments(requestId)

        var submitted = submitUtil.submit(entityId, userId, FULL_INPUT)
        if (!submitted.success) {
            return null
        }

        // 事務局側（ITCOM-07）は未実装のため、不備確認依頼の状態を直接作る
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.get(requestId)
        gr.setValue('u_application_status', 'defect_request')
        gr.setValue('u_defect_note', note)
        if (dueOn) {
            gr.setValue('u_defect_due_on', dueOn)
        }
        gr.update()

        new x_dent2_dentsusoke.ApplicationLogUtil().record(requestId, 'defect_requested', {
            fromStatus: 'first_review',
            toStatus: 'defect_request',
            detail: note,
            actor: userId
        })

        return { entityId: entityId, userId: userId, requestId: requestId }
    }

    function statusOf(requestId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.get(requestId)
        return gr.getValue('u_application_status')
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

    // -----------------------------------------------------------------------
    // 回答期限の残日数
    // -----------------------------------------------------------------------
    check('期限が未設定なら残日数は null', defectUtil.getDaysLeft(''), null)
    check('期限が null なら残日数は null', defectUtil.getDaysLeft(null), null)
    check('5日後の残日数', defectUtil.getDaysLeft(dateAfter(5)), 5)
    check('当日の残日数は0', defectUtil.getDaysLeft(dateAfter(0)), 0)
    check('期限超過は負の値', defectUtil.getDaysLeft(dateAfter(-3)), -3)

    // -----------------------------------------------------------------------
    // 回答の検証
    // -----------------------------------------------------------------------
    check('一時保存は未入力でも通る', defectUtil.validateReply('', false).length, 0)
    check('再提出は未入力を弾く', defectUtil.validateReply('', true).length > 0, true)
    check('空白のみも未入力として弾く', defectUtil.validateReply('   ', true).length > 0, true)
    check('通常の回答は通る', defectUtil.validateReply('見積書に合わせて修正しました。', true).length, 0)

    var longReply = ''
    while (longReply.length <= 2000) {
        longReply = longReply + 'あ'
    }
    check('文字数超過を弾く', defectUtil.validateReply(longReply, true).length > 0, true)

    // -----------------------------------------------------------------------
    // 対象の特定
    // -----------------------------------------------------------------------
    var target = createDefectRequest(category.sys_id, 'ATF 指摘：見積書と金額が一致していません。', dateAfter(14))
    check('検証用の不備確認依頼を作成できた', !!target, true)
    if (!target) {
        stepResult.setOutputMessage('提出に失敗したため検証を中断しました')
        return
    }

    check('事業者が未指定なら対象を返さない', defectUtil.find('', target.requestId), null)

    var found = defectUtil.find(target.entityId, target.requestId)
    check('自社の不備対応中の申請が取得できる', !!found, true)
    check('取得したのは対象の申請', found.getUniqueValue(), target.requestId)

    // 事業者を指定せず探しても自社の1件が見つかること（申請状況一覧を経由しない導線）
    check('sys_id 未指定でも自社の対象が見つかる',
        defectUtil.find(target.entityId, '').getUniqueValue(), target.requestId)

    /**
     * 他社の申請は取得できないこと。
     * URL の sys_id を差し替えて開かれても、事業者の条件をクエリ側で担保している。
     */
    var other = createDefectRequest(category.sys_id, 'ATF 他社の指摘', dateAfter(14))
    check('検証用の他社データを作成できた', !!other, true)
    if (!other) {
        stepResult.setOutputMessage('他社データの作成に失敗したため検証を中断しました')
        return
    }
    check('他社の申請は取得できない', defectUtil.find(other.entityId, target.requestId), null)

    // -----------------------------------------------------------------------
    // 表示用の文脈
    // -----------------------------------------------------------------------
    var context = defectUtil.buildContext(found)
    check('指摘内容が取得できる', context.defectNote, 'ATF 指摘：見積書と金額が一致していません。')
    check('ステータスの表記', context.statusLabel, '要対応：不備確認')
    check('残日数が取得できる', context.daysLeft, 14)
    check('期限超過ではない', context.overdue, false)
    check('回答は未入力', context.defectReply, '')
    check('指摘日時が処理履歴から取得できる', context.requestedOn !== '', true)
    check('レコードが無ければ null', defectUtil.buildContext(null), null)

    // -----------------------------------------------------------------------
    // 修正の開始（画面を開いた時点の遷移）
    // -----------------------------------------------------------------------
    check('開始前は不備確認依頼', statusOf(target.requestId), 'defect_request')

    var started = defectUtil.startFixing(target.entityId, target.requestId, target.userId)
    check('修正の開始が成功する', started.success, true)
    check('返却されるアクション', started.action, 'start_fixing')
    check('不備修正中へ遷移する', statusOf(target.requestId), 'defect_fixing')
    check('履歴が1件記録される', countLogs(target.requestId, 'defect_fixing'), 1)

    /**
     * 画面の再読み込みで二重に記録されないこと。
     * 開いた時点で遷移させる方式のため、再読み込みのたびに履歴が増えると経過が読めなくなる。
     */
    var again = defectUtil.startFixing(target.entityId, target.requestId, target.userId)
    check('2回目の開始も成功として扱う', again.success, true)
    check('2回目は遷移済みとして返る', again.action, 'already_fixing')
    check('履歴は増えない', countLogs(target.requestId, 'defect_fixing'), 1)
    check('ステータスは不備修正中のまま', statusOf(target.requestId), 'defect_fixing')

    check('他社からは開始できない',
        defectUtil.startFixing(other.entityId, target.requestId, other.userId).success, false)

    // -----------------------------------------------------------------------
    // 一時保存
    // -----------------------------------------------------------------------
    var saved = defectUtil.saveReply(target.entityId, target.requestId, '  ATF 回答の下書き  ')
    check('一時保存が成功する', saved.success, true)
    check('返却されるアクション', saved.action, 'save_reply')
    check('前後の空白が除かれて保存される',
        defectUtil.buildContext(defectUtil.find(target.entityId, target.requestId)).defectReply,
        'ATF 回答の下書き')
    check('一時保存でステータスは変わらない', statusOf(target.requestId), 'defect_fixing')
    check('一時保存で回答の履歴は記録されない', countLogs(target.requestId, 'defect_answered'), 0)

    check('文字数超過は一時保存でも弾く',
        defectUtil.saveReply(target.entityId, target.requestId, longReply).success, false)
    check('他社からは保存できない',
        defectUtil.saveReply(other.entityId, target.requestId, 'ATF 他社からの保存').success, false)
    check('弾かれた場合は上書きされない',
        defectUtil.buildContext(defectUtil.find(target.entityId, target.requestId)).defectReply,
        'ATF 回答の下書き')

    stepResult.setOutputMessage('対象の特定と修正の開始を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** 再提出 */
Test(
    {
        $id: Now.ID['test_app_defect_submit'],
        name: '申請の不備修正：再提出',
        description:
            'ApplicationDefectUtil.checkReadyToAnswer／submitFix を検証する。回答・対象経費・添付書類のいずれかが欠けている間は再提出できず理由に戻り先（reply／expense／document）が付くこと、再提出で不備修正回答あり（defect_answered）へ遷移して回答と履歴が記録されること、明細の変更が対象経費合計と補助金額へ再判定されて反映されること、他社からは再提出できないことを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_app_defect_step_submit'],
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
    var defectUtil = new x_dent2_dentsusoke.ApplicationDefectUtil()

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
        gr.setValue('u_business_name', 'ATF 不備修正テスト事業者 ' + RUN + '-' + seq)
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
        var login = 'atf.appdefect.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'APPDEFECT-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'registered')
        gr.setValue('u_duplicate_check_result', 'no_duplicate')
        gr.setValue('u_auth_method', 'standard')
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

    /** 今日からの相対日付（yyyy-MM-dd）。日付境界の影響を避けるため正午を基準にする */
    function dateAfter(days) {
        var dt = new GlideDateTime()
        dt.setValue(new GlideDate().getValue() + ' 12:00:00')
        dt.addDays(days)
        return dt.getDate().getValue()
    }

    /** 提出済みの申請を1件作り、事務局が不備確認を依頼した状態にする */
    function createDefectRequest(categoryId, note, dueOn) {
        var entityId = createEntity()
        var userId = createUser(entityId)
        submitUtil.saveDraft(entityId, userId, FULL_INPUT)

        var requestId = submitUtil.getDraft(entityId).getUniqueValue()
        expenseUtil.save(requestId, {
            category_id: categoryId,
            description: 'ATF 明細1',
            amount: '3000000'
        })
        fillRequiredDocuments(requestId)

        var submitted = submitUtil.submit(entityId, userId, FULL_INPUT)
        if (!submitted.success) {
            return null
        }

        // 事務局側（ITCOM-07）は未実装のため、不備確認依頼の状態を直接作る
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.get(requestId)
        gr.setValue('u_application_status', 'defect_request')
        gr.setValue('u_defect_note', note)
        if (dueOn) {
            gr.setValue('u_defect_due_on', dueOn)
        }
        gr.update()

        new x_dent2_dentsusoke.ApplicationLogUtil().record(requestId, 'defect_requested', {
            fromStatus: 'first_review',
            toStatus: 'defect_request',
            detail: note,
            actor: userId
        })

        return { entityId: entityId, userId: userId, requestId: requestId }
    }

    function statusOf(requestId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.get(requestId)
        return gr.getValue('u_application_status')
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

    /** 指定の step の理由が含まれているか */
    function hasStep(ready, step) {
        for (var i = 0; i < ready.blockers.length; i++) {
            if (ready.blockers[i].step === step) {
                return true
            }
        }
        return false
    }

    function reload(requestId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.get(requestId)
        return gr
    }

    var category = pickSimpleCategory()
    check('日額上限のない経費区分が存在する', !!category, true)
    if (!category) {
        stepResult.setOutputMessage('対象経費区分マスタが未投入のため検証を中断しました')
        return
    }

    var target = createDefectRequest(category.sys_id, 'ATF 指摘：金額をご確認ください。', dateAfter(14))
    check('検証用の不備確認依頼を作成できた', !!target, true)
    if (!target) {
        stepResult.setOutputMessage('提出に失敗したため検証を中断しました')
        return
    }
    defectUtil.startFixing(target.entityId, target.requestId, target.userId)

    var REPLY = 'ATF 回答：見積書に合わせて金額を修正しました。'

    // -----------------------------------------------------------------------
    // 再提出できるかどうかの判定
    // -----------------------------------------------------------------------
    check('回答が未入力なら再提出できない',
        defectUtil.checkReadyToAnswer(target.requestId, '').ok, false)
    check('回答の不足が示される',
        hasStep(defectUtil.checkReadyToAnswer(target.requestId, ''), 'reply'), true)
    check('申請が未指定なら再提出できない', defectUtil.checkReadyToAnswer('', REPLY).ok, false)

    var ready = defectUtil.checkReadyToAnswer(target.requestId, REPLY)
    check('回答があればそろっている', ready.ok, true)
    check('理由は無い', ready.blockers.length, 0)
    check('対象経費の合計が返る', ready.totalExpense, 3000000)

    /**
     * 必須書類を消すと再提出できなくなること。
     * 不備修正で書類を差し替える途中に再提出されるのを防ぐ。
     */
    var docs = docUtil.list(target.requestId)
    var removedDoc = null
    for (var i = 0; i < docs.length; i++) {
        if (docs[i].required && docs[i].submitted) {
            removedDoc = docs[i]
            break
        }
    }
    check('提出済みの必須書類がある', !!removedDoc, true)
    if (removedDoc) {
        check('必須書類を削除できる', docUtil.remove(target.requestId, removedDoc.sys_id).success, true)
        var withoutDoc = defectUtil.checkReadyToAnswer(target.requestId, REPLY)
        check('必須書類が欠けると再提出できない', withoutDoc.ok, false)
        check('添付書類の不足が示される', hasStep(withoutDoc, 'document'), true)
        check('その状態では再提出も失敗する',
            defectUtil.submitFix(target.entityId, target.requestId, target.userId, REPLY).success, false)
        check('失敗した場合ステータスは変わらない', statusOf(target.requestId), 'defect_fixing')

        // 差し替えて元に戻す
        var docGr = new GlideRecord('x_dent2_dentsusoke_req_doc')
        docGr.get(removedDoc.sys_id)
        new GlideSysAttachment().write(docGr, '差し替え.pdf', 'application/pdf', 'ATF')
        check('差し替えの後処理が成功する', docUtil.syncRow(target.requestId, removedDoc.sys_id).success, true)
        check('差し替えれば再提出できる', defectUtil.checkReadyToAnswer(target.requestId, REPLY).ok, true)
    }

    // -----------------------------------------------------------------------
    // 明細を修正すると金額が再判定されること
    //
    // 画面イメージの注記にある「提出のたびに再判定しないと、対象経費が変わったのに
    // 金額が古いままになる」を防ぐための検証。
    // -----------------------------------------------------------------------
    var items = expenseUtil.list(target.requestId)
    check('明細が1件ある', items.length, 1)
    check('明細を修正できる', expenseUtil.save(target.requestId, {
        item_id: items[0].sys_id,
        category_id: category.sys_id,
        description: 'ATF 明細1（修正）',
        amount: '2500000'
    }).success, true)

    var judged = submitUtil.judgeAmount('le20', false, 2500000)

    // -----------------------------------------------------------------------
    // 再提出
    // -----------------------------------------------------------------------
    var answered = defectUtil.submitFix(target.entityId, target.requestId, target.userId, '  ' + REPLY + '  ')
    check('再提出が成功する', answered.success, true)
    check('返却されるアクション', answered.action, 'submit_fix')
    check('再提出後の対象経費が返る', answered.totalExpense, 2500000)
    check('再提出後の補助金額が返る', answered.subsidyAmount, judged.subsidyAmount)

    var after = reload(target.requestId)
    check('不備修正回答ありへ遷移する', after.getValue('u_application_status'), 'defect_answered')
    check('回答が保存される', after.getValue('u_defect_reply'), REPLY)
    check('指摘内容は残る', after.getValue('u_defect_note'), 'ATF 指摘：金額をご確認ください。')
    check('対象経費合計が再計算される',
        parseInt(after.getValue('u_total_expense_amount'), 10), 2500000)
    check('補助金額が再判定される',
        parseInt(after.getValue('u_subsidy_amount'), 10), judged.subsidyAmount)
    check('補助率の分子が記録される',
        parseInt(after.getValue('u_subsidy_rate_numerator'), 10), judged.numerator)
    check('再提出の履歴が記録される', countLogs(target.requestId, 'defect_answered'), 1)

    // 再提出後は対応中ではなくなるため、画面の対象から外れること
    check('再提出後は対象から外れる', defectUtil.find(target.entityId, target.requestId), null)
    check('再提出後は一時保存できない',
        defectUtil.saveReply(target.entityId, target.requestId, '追記').success, false)
    check('二重の再提出はできない',
        defectUtil.submitFix(target.entityId, target.requestId, target.userId, REPLY).success, false)

    // -----------------------------------------------------------------------
    // 他社からは再提出できないこと
    // -----------------------------------------------------------------------
    var other = createDefectRequest(category.sys_id, 'ATF 他社の指摘', dateAfter(14))
    check('検証用の他社データを作成できた', !!other, true)
    if (other) {
        defectUtil.startFixing(other.entityId, other.requestId, other.userId)
        check('他社の申請は再提出できない',
            defectUtil.submitFix(target.entityId, other.requestId, target.userId, REPLY).success, false)
        check('他社の申請のステータスは変わらない', statusOf(other.requestId), 'defect_fixing')
    }

    stepResult.setOutputMessage('不備修正の再提出を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
