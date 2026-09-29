import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * 対象経費明細（処理No.18 対象経費登録／画面イメージ ITCOM-02）の単体テスト
 *
 * 対象のカスタムロジックは ApplicationExpenseUtil（Script Include）。
 *
 * ■ このテストで守りたいこと
 *   ・明細を編集できるのが「申請入力中」「不備修正中」に限られること
 *   ・日額上限のある経費区分で、日数・専門家区分の未入力と上限超過を弾くこと
 *   ・日額の判定が「金額 ÷ 日数」であること（合計額との比較に戻っていないこと）
 *   ・明細の追加・更新・削除のたびに T03 の対象経費合計と補助金額が再計算されること
 *   ・他の申請の明細を sys_id 指定で更新・削除できないこと
 *
 * とくに合計の書き戻しは、既存の SC-05／SC-07・SC-17 帳票・SC-15 ダッシュボードが
 * u_total_expense_amount を参照しているため、止まると金額表示が明細と食い違う。
 *
 * ■ テスト方式
 * Script Include には UI が無いため atf.server.runServerSideScript で
 * クラスを直接インスタンス化して検証する（他の SC テストと同じ方式）。
 * 検証には Jasmine を使わず assertEqual を使う（理由は sc11-registration-review.now.ts のコメント参照）。
 */

/** 入力検証と日額上限 */
Test(
    {
        $id: Now.ID['test_exp_validate'],
        name: '対象経費明細：入力検証と日額上限',
        description:
            'ApplicationExpenseUtil.canEdit／validate／checkDailyCap を検証する。明細を編集できるのが申請入力中と不備修正中に限られること、経費区分・内容・金額の未入力と形式不正を弾くこと、日額上限のある経費区分では日数と専門家区分を要求し「金額÷日数」が専門家経費日額上限マスタの上限を超える場合に弾くことを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_exp_step_validate'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var util = new x_dent2_dentsusoke.ApplicationExpenseUtil()

    // -----------------------------------------------------------------------
    // 編集できる申請ステータス
    //
    // 提出後に金額が変わると審査の前提が崩れるため、受付済以降は編集させない。
    // -----------------------------------------------------------------------
    check('申請入力中は編集できる', util.canEdit('input'), true)
    check('不備修正中は編集できる', util.canEdit('defect_fixing'), true)
    check('受付済は編集できない', util.canEdit('accepted'), false)
    check('一次審査中は編集できない', util.canEdit('review'), false)
    check('採択は編集できない', util.canEdit('approved'), false)
    check('未設定は編集できない', util.canEdit(''), false)
    check('null は編集できない', util.canEdit(null), false)

    // -----------------------------------------------------------------------
    // マスタから検証用の経費区分を選ぶ（期待値をテストへ固定値で書かない）
    // -----------------------------------------------------------------------
    var categories = util.getCategories()
    check('対象経費区分マスタが投入されている', categories.length > 0, true)

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
    check('日額上限のある経費区分が存在する', !!capped, true)

    if (!simple || !capped) {
        stepResult.setOutputMessage('対象経費区分マスタが未投入のため検証を中断しました')
        return
    }

    // -----------------------------------------------------------------------
    // 入力検証（形式）
    // -----------------------------------------------------------------------
    check('未入力はエラーになる', util.validate({}).length > 0, true)
    check('経費区分の未選択を弾く',
        util.validate({ description: 'テスト', amount: '1000' }).length > 0, true)
    check('内容の未入力を弾く',
        util.validate({ category_id: simple.sys_id, amount: '1000' }).length > 0, true)
    check('金額の未入力を弾く',
        util.validate({ category_id: simple.sys_id, description: 'テスト' }).length > 0, true)
    check('金額の非数値を弾く',
        util.validate({ category_id: simple.sys_id, description: 'テスト', amount: '1,000' }).length > 0, true)
    check('金額0を弾く',
        util.validate({ category_id: simple.sys_id, description: 'テスト', amount: '0' }).length > 0, true)
    check('金額の桁数超過を弾く',
        util.validate({ category_id: simple.sys_id, description: 'テスト', amount: '99999999999' }).length > 0, true)
    check('日数の非数値を弾く',
        util.validate({ category_id: simple.sys_id, description: 'テスト', amount: '1000', days: '3日' }).length > 0, true)

    var longText = ''
    while (longText.length <= 200) {
        longText = longText + 'あ'
    }
    check('内容の文字数超過を弾く',
        util.validate({ category_id: simple.sys_id, description: longText, amount: '1000' }).length > 0, true)

    check('日額上限のない区分は日数なしでも通る',
        util.validate({ category_id: simple.sys_id, description: 'テスト', amount: '1000' }).length, 0)

    // -----------------------------------------------------------------------
    // 日額上限の検証（日額上限のある経費区分）
    // -----------------------------------------------------------------------
    var fees = util.getExpertFees()
    var fee = null
    for (var j = 0; j < fees.length; j++) {
        if (fees[j].dailyCap > 0) {
            fee = fees[j]
            break
        }
    }
    check('専門家経費日額上限マスタが投入されている', !!fee, true)
    if (!fee) {
        stepResult.setOutputMessage('専門家経費日額上限マスタが未投入のため日額上限の検証を中断しました')
        return
    }

    check('日額上限のある区分は hasDailyCap が立つ',
        util.checkDailyCap(capped.sys_id, fee.sys_id, fee.dailyCap, 1).hasDailyCap, true)
    check('日額上限のない区分は hasDailyCap が立たない',
        util.checkDailyCap(simple.sys_id, '', 1000, '').hasDailyCap, false)

    var noDays = util.checkDailyCap(capped.sys_id, fee.sys_id, fee.dailyCap, '')
    check('日数がないと判定できない', noDays.ok, false)
    check('日数0も判定できない', util.checkDailyCap(capped.sys_id, fee.sys_id, 1000, 0).ok, false)

    var noFee = util.checkDailyCap(capped.sys_id, '', fee.dailyCap, 1)
    check('専門家区分がないと判定できない', noFee.ok, false)

    /**
     * 判定は「金額 ÷ 日数」で行う。
     * 合計額と上限を直接比べる実装に戻すと、2日で上限の2倍まで使える申請を弾いてしまう。
     */
    var days = 2
    var justCap = util.checkDailyCap(capped.sys_id, fee.sys_id, fee.dailyCap * days, days)
    check('日額が上限ちょうどなら通る', justCap.ok, true)
    check('日額が算出される', justCap.daily, fee.dailyCap)
    check('上限額がマスタと一致する', justCap.cap, fee.dailyCap)

    var over = util.checkDailyCap(capped.sys_id, fee.sys_id, (fee.dailyCap + 1000) * days, days)
    check('日額が上限を超えると弾く', over.ok, false)
    check('超過時はメッセージが付く', over.message !== '', true)

    // 上限超過は validate からも弾かれること（画面の保存経路と同じ入り口）
    check('validate も日額上限超過を弾く',
        util.validate({
            category_id: capped.sys_id,
            description: 'テスト',
            amount: '' + ((fee.dailyCap + 1000) * days),
            days: '' + days,
            expert_fee_id: fee.sys_id
        }).length > 0, true)
    check('validate は上限内なら通る',
        util.validate({
            category_id: capped.sys_id,
            description: 'テスト',
            amount: '' + (fee.dailyCap * days),
            days: '' + days,
            expert_fee_id: fee.sys_id
        }).length, 0)

    stepResult.setOutputMessage('対象経費明細の入力検証と日額上限を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** 明細の登録・更新・削除と合計の再計算 */
Test(
    {
        $id: Now.ID['test_exp_save'],
        name: '対象経費明細：登録と合計の再計算',
        description:
            'ApplicationExpenseUtil.save／list／sum／count／remove／recalcTotal を検証する。明細の追加・更新・削除が行えること、そのたびに T03 の対象経費合計金額と補助金額・補助率の分子分母が再計算されて書き戻されること、他の申請の明細を sys_id 指定で更新・削除できないこと、日額上限を超えた明細が保存されないことを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_exp_step_save'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var seq = 0
    var RUN = ('' + new GlideDateTime().getNumericValue()).slice(-10)

    var submitUtil = new x_dent2_dentsusoke.ApplicationSubmitUtil()
    var util = new x_dent2_dentsusoke.ApplicationExpenseUtil()

    function createEntity() {
        seq++
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.initialize()
        gr.setValue('u_business_name', 'ATF 経費明細テスト事業者 ' + RUN + '-' + seq)
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
        var login = 'atf.expense.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'EXPENSE-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'registered')
        gr.setValue('u_duplicate_check_result', 'no_duplicate')
        gr.setValue('u_auth_method', 'standard')
        return gr.insert()
    }

    /** 明細を紐づけるための下書きを1件用意する */
    function createDraft(employeeCategory) {
        var entityId = createEntity()
        var userId = createUser(entityId)
        submitUtil.saveDraft(entityId, userId, { employee_category: employeeCategory })
        return submitUtil.getDraft(entityId).getUniqueValue()
    }

    function reloadRequest(requestId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.get(requestId)
        return gr
    }

    var categories = util.getCategories()
    var simple = null
    for (var i = 0; i < categories.length; i++) {
        if (!categories[i].hasDailyCap) {
            simple = categories[i]
            break
        }
    }
    check('日額上限のない経費区分が存在する', !!simple, true)
    if (!simple) {
        stepResult.setOutputMessage('対象経費区分マスタが未投入のため検証を中断しました')
        return
    }

    var requestId = createDraft('le20')
    check('検証用の下書きが作成できた', !!requestId, true)

    // -----------------------------------------------------------------------
    // 初期状態
    // -----------------------------------------------------------------------
    check('明細は0件', util.count(requestId), 0)
    check('合計は0円', util.sum(requestId), 0)
    check('一覧は空', util.list(requestId).length, 0)
    check('申請が未指定なら0件', util.count(''), 0)
    check('申請が未指定なら合計0', util.sum(''), 0)

    // -----------------------------------------------------------------------
    // 追加：合計と補助金額が書き戻されること
    // -----------------------------------------------------------------------
    var added = util.save(requestId, {
        category_id: simple.sys_id,
        description: 'ATF 明細1',
        amount: '3000000',
        note: 'ATF 備考'
    })
    check('明細の追加が成功する', added.success, true)
    check('返却されるアクション', added.action, 'add_item')
    check('追加後の合計が返る', added.totalExpense, 3000000)
    check('明細が1件になる', util.count(requestId), 1)

    var afterAdd = reloadRequest(requestId)
    check('対象経費合計が書き戻される',
        parseInt(afterAdd.getValue('u_total_expense_amount'), 10), 3000000)

    /**
     * 補助金額も同時に再判定されること。
     * 合計だけ書き戻して補助金額を更新しない実装に戻ると、
     * 明細を直したのに補助金額が古いまま残る。
     */
    var judged1 = submitUtil.judgeAmount('le20', false, 3000000)
    check('補助金額が再判定される',
        parseInt(afterAdd.getValue('u_subsidy_amount'), 10), judged1.subsidyAmount)
    check('補助率の分子が記録される',
        parseInt(afterAdd.getValue('u_subsidy_rate_numerator'), 10), judged1.numerator)
    check('補助率の分母が記録される',
        parseInt(afterAdd.getValue('u_subsidy_rate_denominator'), 10), judged1.denominator)
    check('補助上限額が記録される',
        parseInt(afterAdd.getValue('u_subsidy_cap_amount'), 10), judged1.capAmount)

    // 2件目を追加すると合計が増えること
    var added2 = util.save(requestId, {
        category_id: simple.sys_id,
        description: 'ATF 明細2',
        amount: '1500000'
    })
    check('2件目の追加が成功する', added2.success, true)
    check('合計が加算される', util.sum(requestId), 4500000)
    check('明細が2件になる', util.count(requestId), 2)

    // -----------------------------------------------------------------------
    // 一覧：登録内容と並び順
    // -----------------------------------------------------------------------
    var rows = util.list(requestId)
    check('一覧が2件返る', rows.length, 2)
    check('1行目が先に追加した明細', rows[0].description, 'ATF 明細1')
    check('2行目が後に追加した明細', rows[1].description, 'ATF 明細2')
    check('並び順が採番される', rows[0].order < rows[1].order, true)
    check('経費区分名が取れる', rows[0].categoryName, simple.name)
    check('金額が数値で返る', rows[0].amount, 3000000)
    check('金額のカンマ区切り', rows[0].amountLabel, '3,000,000')
    check('備考が返る', rows[0].note, 'ATF 備考')
    check('日額上限のない区分は上限エラーなし', rows[0].capError, '')

    // -----------------------------------------------------------------------
    // 更新
    // -----------------------------------------------------------------------
    var updated = util.save(requestId, {
        item_id: rows[0].sys_id,
        category_id: simple.sys_id,
        description: 'ATF 明細1（修正）',
        amount: '2000000'
    })
    check('明細の更新が成功する', updated.success, true)
    check('返却されるアクション', updated.action, 'update_item')
    check('更新でも件数は増えない', util.count(requestId), 2)
    check('更新後の合計', util.sum(requestId), 3500000)
    check('更新後の合計が書き戻される',
        parseInt(reloadRequest(requestId).getValue('u_total_expense_amount'), 10), 3500000)

    var updatedRows = util.list(requestId)
    check('内容が更新される', updatedRows[0].description, 'ATF 明細1（修正）')
    check('金額が更新される', updatedRows[0].amount, 2000000)

    // -----------------------------------------------------------------------
    // 他の申請の明細は操作できないこと
    //
    // 画面から sys_id を差し替えて送られても、u_request の紐付きで拒否する。
    // -----------------------------------------------------------------------
    var otherRequestId = createDraft('le20')
    check('別の申請の明細は更新できない',
        util.save(otherRequestId, {
            item_id: updatedRows[0].sys_id,
            category_id: simple.sys_id,
            description: '他人の明細を書き換える',
            amount: '1'
        }).success, false)
    check('別の申請の明細は削除できない',
        util.remove(otherRequestId, updatedRows[0].sys_id).success, false)
    check('書き換えられていない', util.list(requestId)[0].description, 'ATF 明細1（修正）')
    check('別の申請の明細は0件のまま', util.count(otherRequestId), 0)

    // 存在しない明細
    check('存在しない明細は更新できない',
        util.save(requestId, {
            item_id: '00000000000000000000000000000000',
            category_id: simple.sys_id,
            description: 'テスト',
            amount: '1000'
        }).success, false)
    check('存在しない明細は削除できない',
        util.remove(requestId, '00000000000000000000000000000000').success, false)

    // -----------------------------------------------------------------------
    // 検証エラーの明細は保存されないこと
    // -----------------------------------------------------------------------
    check('金額0の明細は保存されない',
        util.save(requestId, {
            category_id: simple.sys_id,
            description: 'ATF 不正な明細',
            amount: '0'
        }).success, false)
    check('件数は変わらない', util.count(requestId), 2)
    check('合計は変わらない', util.sum(requestId), 3500000)

    check('申請が未指定では保存できない',
        util.save('', { category_id: simple.sys_id, description: 'テスト', amount: '1000' }).success, false)
    check('明細が未指定では削除できない', util.remove(requestId, '').success, false)

    // -----------------------------------------------------------------------
    // 削除：合計が減ること
    // -----------------------------------------------------------------------
    var removed = util.remove(requestId, updatedRows[1].sys_id)
    check('明細の削除が成功する', removed.success, true)
    check('返却されるアクション', removed.action, 'remove_item')
    check('削除後の合計が返る', removed.totalExpense, 2000000)
    check('明細が1件になる', util.count(requestId), 1)
    check('削除後の合計が書き戻される',
        parseInt(reloadRequest(requestId).getValue('u_total_expense_amount'), 10), 2000000)

    var judged2 = submitUtil.judgeAmount('le20', false, 2000000)
    check('削除後も補助金額が再判定される',
        parseInt(reloadRequest(requestId).getValue('u_subsidy_amount'), 10), judged2.subsidyAmount)

    // 全件削除すると合計0へ戻ること
    check('最後の明細を削除できる', util.remove(requestId, util.list(requestId)[0].sys_id).success, true)
    check('明細が0件になる', util.count(requestId), 0)
    check('合計が0へ戻る',
        parseInt(reloadRequest(requestId).getValue('u_total_expense_amount'), 10) || 0, 0)

    stepResult.setOutputMessage('対象経費明細の登録・更新・削除と合計の再計算を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
