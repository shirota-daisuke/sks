import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * 申請入力・提出（処理No.16／No.17）の単体テスト
 *
 * 対象のカスタムロジックは ApplicationSubmitUtil（Script Include）。
 *
 * ■ このテストで守りたいこと
 *   ・補助金額を分数で計算していること（u_subsidy_rate の 0.67 を使って計算していないこと）
 *   ・補助上限額が効いていること
 *   ・申請番号が重複せず連番で採番されること
 *   ・下書きは緩く、提出時は必須項目をすべて要求すること
 *   ・下書きが1事業者1件に保たれること
 *   ・対象経費合計が画面の入力値ではなく明細（処理No.18）の合計で確定すること
 *   ・対象経費明細が0件のまま提出できないこと
 *   ・必須書類（ITCOM-03）が未提出のまま提出できないこと
 *   ・売上増加率対象月が月初日へそろえて保持され、申請時点より後の月を受け付けないこと
 *   ・売上増加率が保存され、保存済みの内容で提出の検証を通ること
 *   ・入力に含まれない項目を保存で消さないこと
 *
 * とくに補助金額の計算は、保存済みの u_subsidy_rate（格納精度2桁）を使う実装に戻すと
 * 対象経費1,000万円で33,300円ずれる。金額に直結するため必ず検知できるようにしている。
 *
 * ■ テスト方式
 * Script Include には UI が無いため atf.server.runServerSideScript で
 * クラスを直接インスタンス化して検証する（他の SC テストと同じ方式）。
 * 検証には Jasmine を使わず assertEqual を使う（理由は sc11-registration-review.now.ts のコメント参照）。
 */

/** 補助金額自動判定（処理No.17） */
Test(
    {
        $id: Now.ID['test_apply_judge_amount'],
        name: '申請：補助金額自動判定',
        description:
            'ApplicationSubmitUtil.judgeAmount を検証する。補助上限額マスタと補助率マスタから基準を引き当て、補助金額が min(対象経費×補助率, 補助上限額) になること、補助率を分数で計算して丸め誤差が出ないこと（小規模区分 2/3 で 0.67 による計算との差が出ないこと）、特例措置で上限額が切り替わること、従業員数区分が未設定・不正の場合に判定できないことを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_apply_step_judge_amount'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var util = new x_dent2_dentsusoke.ApplicationSubmitUtil()

    /** マスタの基準値を読む（期待値をテストへ固定値で書かず、マスタから取る） */
    function loadCap(category, special) {
        var gr = new GlideRecord('x_dent2_dentsusoke_cap')
        gr.addQuery('u_employee_count_category', category)
        gr.addQuery('u_special_measure_flag', special)
        gr.addQuery('u_active', true)
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return null
        }
        return parseInt(gr.getValue('u_cap_amount'), 10)
    }

    function loadRate(category) {
        var gr = new GlideRecord('x_dent2_dentsusoke_rate')
        gr.addQuery('u_employee_count_category', category)
        gr.addQuery('u_active', true)
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return null
        }
        return {
            numerator: parseInt(gr.getValue('u_rate_numerator'), 10),
            denominator: parseInt(gr.getValue('u_rate_denominator'), 10),
        }
    }

    // -----------------------------------------------------------------------
    // 異常系：区分が未設定・不正
    // -----------------------------------------------------------------------
    check('区分が空だと判定できない', util.judgeAmount('', false, 1000000).ok, false)
    check('存在しない区分だと判定できない', util.judgeAmount('not_exist', false, 1000000).ok, false)

    // -----------------------------------------------------------------------
    // 小規模区分（2/3）で丸め誤差が出ないこと
    //
    // 補助率 2/3 を 0.67 として計算すると 10,000,000 × 0.67 = 6,700,000 になる。
    // 分数で計算すれば 10,000,000 × 2 ÷ 3 = 6,666,666（切り捨て）であり、差は 33,334 円。
    // 上限額に張り付くと差が見えないため、上限を超えない金額で検証する。
    // -----------------------------------------------------------------------
    var smallRate = loadRate('le5')
    var smallCap = loadCap('le5', false)
    check('小規模区分の補助率マスタが存在する', !!smallRate, true)
    check('小規模区分の補助上限額マスタが存在する', !!smallCap, true)

    if (smallRate && smallCap) {
        // 上限に達しない対象経費を選ぶ（上限の半分）
        var expense = Math.floor(smallCap / 2)
        var judged = util.judgeAmount('le5', false, expense)
        check('小規模区分の判定が成功する', judged.ok, true)
        check('補助率の表記', judged.rateLabel, smallRate.numerator + '/' + smallRate.denominator)
        check('補助上限額がマスタと一致する', judged.capAmount, smallCap)

        var expected = Math.floor((expense * smallRate.numerator) / smallRate.denominator)
        check('補助金額が分数計算と一致する', judged.subsidyAmount, expected)
        check('上限には達していない', judged.cappedByLimit, false)

        // 小数の補助率で計算した場合との差を検出する（2/3 のときのみ差が出る）
        if (smallRate.numerator === 2 && smallRate.denominator === 3) {
            var byDecimal = Math.floor(expense * 0.67)
            check('0.67 による計算とは一致しない（丸め誤差を回避している）', judged.subsidyAmount === byDecimal, false)
        }
    }

    // -----------------------------------------------------------------------
    // 補助上限額が効くこと
    // -----------------------------------------------------------------------
    var cap20 = loadCap('le20', false)
    check('6～20人の補助上限額マスタが存在する', !!cap20, true)
    if (cap20) {
        // 上限を確実に超える対象経費
        var bigJudged = util.judgeAmount('le20', false, cap20 * 10)
        check('上限を超える場合の判定が成功する', bigJudged.ok, true)
        check('補助金額が上限額で止まる', bigJudged.subsidyAmount, cap20)
        check('上限適用のフラグが立つ', bigJudged.cappedByLimit, true)
    }

    // -----------------------------------------------------------------------
    // 特例措置で上限額が切り替わること
    // -----------------------------------------------------------------------
    var normalCap = loadCap('le20', false)
    var specialCap = loadCap('le20', true)
    check('特例措置ありの補助上限額マスタが存在する', !!specialCap, true)
    if (normalCap && specialCap) {
        check('特例措置なしの上限額', util.judgeAmount('le20', false, 1).capAmount, normalCap)
        check('特例措置ありの上限額', util.judgeAmount('le20', true, 1).capAmount, specialCap)
        // 特例措置は上限を引き上げる制度であり、下げることはない
        check('特例措置ありの上限は なし以上', specialCap >= normalCap, true)
    }

    // -----------------------------------------------------------------------
    // 対象経費が0・負の場合
    // -----------------------------------------------------------------------
    check('対象経費0なら補助金額も0', util.judgeAmount('le20', false, 0).subsidyAmount, 0)
    check('対象経費が負でも0として扱う', util.judgeAmount('le20', false, -100).subsidyAmount, 0)

    stepResult.setOutputMessage('補助金額自動判定を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** 入力検証と下書き・提出 */
Test(
    {
        $id: Now.ID['test_apply_submit'],
        name: '申請：下書き保存と提出',
        description:
            'ApplicationSubmitUtil の validate／saveDraft／submit／generateApplicationNumber を検証する。下書きは未入力を許し提出時は必須項目をすべて要求すること、売上増加率対象月が年月と日付のどちらの形式でも月初日へそろえて保存されISO 8601の日時文字列と申請時点より後の月は弾かれること、下書きが1事業者1件に保たれること、下書きが無い場合・対象経費明細が0件の場合・必須書類が未提出の場合は提出できないこと、提出で申請番号が採番され申請入力中から受付済へ遷移して提出日時・補助上限額・補助率の分子分母・補助金額・明細の合計が記録され処理履歴が残ること、申請番号が重複せず連番で採番されることを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_apply_step_submit'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var seq = 0
    var RUN = ('' + new GlideDateTime().getNumericValue()).slice(-10)

    function createEntity() {
        seq++
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.initialize()
        gr.setValue('u_business_name', 'ATF 申請テスト事業者 ' + RUN + '-' + seq)
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
        var login = 'atf.apply.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'APPLY-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'registered')
        gr.setValue('u_duplicate_check_result', 'no_duplicate')
        gr.setValue('u_auth_method', 'standard')
        return gr.insert()
    }

    function reload(requestId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.get(requestId)
        return gr
    }

    function countDrafts(entityId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.addQuery('u_business_entity', entityId)
        gr.addQuery('u_application_status', 'input')
        gr.query()
        return gr.getRowCount()
    }

    var util = new x_dent2_dentsusoke.ApplicationSubmitUtil()

    // -----------------------------------------------------------------------
    // 入力検証：下書きは緩く、提出は厳しい
    // -----------------------------------------------------------------------
    var empty = {}
    check('下書きは未入力でも通る', util.validate(empty, false).length, 0)
    check('提出は未入力を弾く', util.validate(empty, true).length > 0, true)

    var valid = {
        organization_type: 'corporate',
        employee_category: 'le20',
        sales_increase_target_month: '2026-06-01',
        sales_increase_rate: '0.15'
    }
    check('提出は必須が揃えば通る', util.validate(valid, true).length, 0)

    // 形式の検証（下書きでも不正な値は弾く）
    check('組織形態の不正値を弾く',
        util.validate({ organization_type: 'invalid' }, false).length > 0, true)
    check('従業員数区分の不正値を弾く',
        util.validate({ employee_category: 'invalid' }, false).length > 0, true)
    check('対象月の形式不正を弾く',
        util.validate({ sales_increase_target_month: '2026/06' }, false).length > 0, true)
    check('対象月は年月だけでも通る',
        util.validate({ sales_increase_target_month: '2026-06' }, false).length, 0)
    check('対象月は月初日を含む日付でも通る',
        util.validate({ sales_increase_target_month: '2026-06-01' }, false).length, 0)
    check('対象月の月が範囲外なら弾く',
        util.validate({ sales_increase_target_month: '2026-13' }, false).length > 0, true)

    /**
     * 画面の日付入力（AngularJS の input[type=month]／[type=date]）は ng-model へ
     * Date オブジェクトを入れるため、そのまま送ると UTC の日時文字列が届く。
     * JST の月初は UTC では前月末日になるため、受け付けて先頭10文字を採ると月がずれる。
     * 月がずれたまま保存するより検証エラーで気付けるほうが安全なため、弾くことを固定する。
     */
    check('ISO 8601 の日時文字列は弾く',
        util.validate({ sales_increase_target_month: '2026-05-31T15:00:00.000Z' }, false).length > 0, true)

    /**
     * 申請時点より後の月は指定できないこと。
     * 実績が存在しない月の増加率は根拠を確認できない。
     * 期待値はテストへ固定値で書かず、実行時の年月から組み立てる
     * （固定値にすると時間の経過でテストが壊れる）。
     */
    var nowDt = new GlideDateTime()
    var thisYear = nowDt.getYearLocalTime()
    var thisMonth = nowDt.getMonthLocalTime()

    function monthText(year, month) {
        var shiftedYear = year + Math.floor((month - 1) / 12)
        var shiftedMonth = ((month - 1) % 12 + 12) % 12 + 1
        return shiftedYear + '-' + ('0' + shiftedMonth).slice(-2)
    }

    check('申請時点の年月が取得できる', util.getCurrentMonth(), monthText(thisYear, thisMonth))
    check('当月は指定できる',
        util.validate({ sales_increase_target_month: monthText(thisYear, thisMonth) }, false).length, 0)
    check('前月は指定できる',
        util.validate({ sales_increase_target_month: monthText(thisYear, thisMonth - 1) }, false).length, 0)
    check('翌月は指定できない',
        util.validate({ sales_increase_target_month: monthText(thisYear, thisMonth + 1) }, false).length > 0, true)
    check('翌年は指定できない',
        util.validate({ sales_increase_target_month: monthText(thisYear + 1, thisMonth) }, false).length > 0, true)
    // 日付の形式で渡された場合も月で判定すること（月初日へそろえてから比較する）
    check('翌月を日付で渡しても指定できない',
        util.validate({ sales_increase_target_month: monthText(thisYear, thisMonth + 1) + '-01' }, false).length > 0, true)
    // 提出時も同じ判定が効くこと
    check('提出時も翌月は指定できない',
        util.validate({
            organization_type: 'corporate',
            employee_category: 'le20',
            sales_increase_target_month: monthText(thisYear, thisMonth + 1),
            sales_increase_rate: '0.15'
        }, true).length > 0, true)
    check('売上増加率の非数値を弾く',
        util.validate({ sales_increase_rate: 'abc' }, false).length > 0, true)

    /**
     * 対象経費合計金額は画面から受け取らないため validate では扱わない。
     * 画面の入力値を検証・保存する実装に戻すと明細（処理No.18）の合計と食い違うため、
     * 入力値を渡しても検証結果に影響しないことを固定する。
     */
    check('対象経費の入力値は検証対象外',
        util.validate({ total_expense: 'あいうえお' }, false).length, 0)

    // -----------------------------------------------------------------------
    // 下書き保存：1事業者1件に保たれること
    // -----------------------------------------------------------------------
    var entityId = createEntity()
    var userId = createUser(entityId)

    check('初期状態では下書きが無い', util.getDraft(entityId), null)

    var first = util.saveDraft(entityId, userId, { employee_category: 'le20' })
    check('下書き保存が成功する', first.success, true)
    check('下書きが1件になる', countDrafts(entityId), 1)

    var draftGr = util.getDraft(entityId)
    check('下書きが取得できる', !!draftGr, true)
    check('下書きのステータス', draftGr.getValue('u_application_status'), 'input')
    check('下書きに事業者が設定される', draftGr.getValue('u_business_entity'), entityId)
    // 下書きの時点では明細が無いため合計は0のまま（画面の入力値では動かない）
    check('下書きの対象経費は0', parseInt(draftGr.getValue('u_total_expense_amount'), 10) || 0, 0)

    // 2回目の保存は既存の下書きを更新する（2件目を作らない）
    var second = util.saveDraft(entityId, userId, { employee_category: 'le50' })
    check('2回目の保存が成功する', second.success, true)
    check('下書きは1件のまま', countDrafts(entityId), 1)
    check('下書きが更新される',
        util.getDraft(entityId).getValue('u_employee_count_category'), 'le50')

    /**
     * 売上増加率対象月は月初日へそろえて保持すること。
     * 入力値をそのまま保存すると月中の日付が混ざり、月単位の集計で別月扱いになる。
     */
    util.saveDraft(entityId, userId, { employee_category: 'le20', sales_increase_target_month: '2026-06' })
    check('年月の入力が月初日で保存される',
        util.getDraft(entityId).getValue('u_sales_increase_target_month'), '2026-06-01')

    util.saveDraft(entityId, userId, { employee_category: 'le20', sales_increase_target_month: '2026-07-15' })
    check('月中の日付も月初日へそろえる',
        util.getDraft(entityId).getValue('u_sales_increase_target_month'), '2026-07-01')

    /**
     * 売上増加率が保存され、提出の検証を通ること。
     *
     * 内容確認・提出（ITCOM-04）は画面の入力値ではなく保存済みの申請を読むため、
     * ここで値が空のまま返ると「売上増加率を入力してください。」と案内され、
     * 入力しているのに提出できない状態になる。
     * Decimal 列への保存が効いていることを含めて固定する。
     */
    util.saveDraft(entityId, userId, {
        organization_type: 'corporate',
        employee_category: 'le20',
        sales_increase_target_month: '2026-06',
        sales_increase_rate: '0.15'
    })

    var rateDraft = util.getDraft(entityId)
    check('売上増加率が空で保存されない', rateDraft.getValue('u_sales_increase_rate') !== '', true)
    check('売上増加率が入力どおりに保存される',
        parseFloat(rateDraft.getValue('u_sales_increase_rate')), 0.15)

    // 小数2桁へ丸められないこと（scale を指定しないと 0.1530 が 0.15 になる）
    util.saveDraft(entityId, userId, { sales_increase_rate: '0.153' })
    check('小数3桁が丸められない',
        parseFloat(util.getDraft(entityId).getValue('u_sales_increase_rate')), 0.153)

    // 内容確認・提出が組み立てる入力値（保存済みの内容）で検証が通ること
    util.saveDraft(entityId, userId, { sales_increase_rate: '0.15' })
    var rateContext = util.buildDraftContext(util.getDraft(entityId))
    check('下書きの文脈へ売上増加率が渡る', rateContext.salesIncreaseRate !== '', true)
    check('保存済みの内容で提出の検証が通る', util.validate({
        organization_type: rateContext.organizationType,
        employee_category: rateContext.employeeCategory,
        sales_increase_target_month: rateContext.salesIncreaseTargetMonth,
        sales_increase_rate: rateContext.salesIncreaseRate,
        special_measure: rateContext.specialMeasure
    }, true).length, 0)

    /**
     * 入力に含まれない項目を消さないこと。
     * 無条件に書き込む実装だと、一部の項目だけを渡した保存で
     * 保存済みの対象月・売上増加率・特例措置が消える。
     */
    util.saveDraft(entityId, userId, { employee_category: 'le20' })
    var afterPartial = util.getDraft(entityId)
    check('部分保存で売上増加率が消えない', afterPartial.getValue('u_sales_increase_rate') !== '', true)
    check('部分保存で対象月が消えない',
        afterPartial.getValue('u_sales_increase_target_month'), '2026-06-01')
    check('部分保存で組織形態が消えない', afterPartial.getValue('u_organization_type'), 'corporate')

    // 空文字を明示的に渡した場合はクリアできること
    util.saveDraft(entityId, userId, { sales_increase_rate: '' })
    check('空文字を渡すとクリアできる',
        util.getDraft(entityId).getValue('u_sales_increase_rate'), '')

    // 以降の検証のため元に戻す
    util.saveDraft(entityId, userId, { sales_increase_rate: '0.15' })

    // -----------------------------------------------------------------------
    // 提出の前提：下書きが無い／明細が無い場合は提出できない
    //
    // 対象経費明細は申請レコードへ紐づくため、明細ゼロ件の申請が
    // 提出されると補助金額を算出できない。提出の入口で止める。
    // -----------------------------------------------------------------------
    var submitInput = {
        organization_type: 'corporate',
        employee_category: 'le20',
        sales_increase_target_month: '2026-06-01',
        sales_increase_rate: '0.15',
        special_measure: false
    }

    var noDraftEntity = createEntity()
    var noDraftUser = createUser(noDraftEntity)
    var noDraft = util.submit(noDraftEntity, noDraftUser, submitInput)
    check('下書きが無いと提出できない', noDraft.success, false)
    check('下書きが無い場合レコードを作らない', countDrafts(noDraftEntity), 0)

    var noItem = util.submit(entityId, userId, submitInput)
    check('明細が無いと提出できない', noItem.success, false)
    check('明細が無い場合は下書きのまま', countDrafts(entityId), 1)

    /**
     * 必須書類（ITCOM-03）の充足チェック。
     * 添付が欠けた申請を受け付けると一次審査で必ず不備確認依頼になるため、
     * 提出の時点で止める。
     */
    var docUtil = new x_dent2_dentsusoke.ApplicationDocumentUtil()

    /** 必須書類にファイルを登録する（画面では添付 REST API から登録される） */
    function fillRequiredDocuments(requestId) {
        docUtil.ensureRows(requestId, {
            organizationType: submitInput.organization_type,
            specialMeasure: submitInput.special_measure
        })
        var docs = docUtil.list(requestId)
        for (var d = 0; d < docs.length; d++) {
            if (!docs[d].required || docs[d].submitted) {
                continue
            }
            var docGr = new GlideRecord('x_dent2_dentsusoke_req_doc')
            if (!docGr.get(docs[d].sys_id)) {
                continue
            }
            new GlideSysAttachment().write(docGr, docs[d].documentType + '.pdf', 'application/pdf', 'ATF')
            docUtil.syncRow(requestId, docs[d].sys_id)
        }
    }

    // -----------------------------------------------------------------------
    // 提出：採番とステータス遷移
    // -----------------------------------------------------------------------
    var expenseUtil = new x_dent2_dentsusoke.ApplicationExpenseUtil()

    /** 日額上限のない経費区分を1つ選ぶ（日数・専門家区分の入力が不要な区分） */
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
    check('日額上限のない経費区分マスタが存在する', !!category, true)
    if (!category) {
        stepResult.setOutputMessage('対象経費区分マスタが未投入のため提出の検証を中断しました')
        return
    }

    // 明細2件（400万＋200万＝600万円）。上限の適用は judgeAmount のテストで確認している
    var addFirst = expenseUtil.save(util.getDraft(entityId).getUniqueValue(), {
        category_id: category.sys_id,
        description: 'ATF 明細1',
        amount: '4000000'
    })
    check('明細1件目の追加が成功する', addFirst.success, true)

    var draftId = util.getDraft(entityId).getUniqueValue()
    var addSecond = expenseUtil.save(draftId, {
        category_id: category.sys_id,
        description: 'ATF 明細2',
        amount: '2000000'
    })
    check('明細2件目の追加が成功する', addSecond.success, true)
    check('明細の合計が算出される', expenseUtil.sum(draftId), 6000000)

    // 明細はそろったが必須書類が無い状態では提出できない
    var noDoc = util.submit(entityId, userId, submitInput)
    check('必須書類が無いと提出できない', noDoc.success, false)
    check('必須書類が無い場合は下書きのまま', countDrafts(entityId), 1)

    fillRequiredDocuments(draftId)
    check('必須書類がそろった', docUtil.checkComplete(draftId).ok, true)

    var submitted = util.submit(entityId, userId, submitInput)
    check('提出が成功する', submitted.success, true)
    check('返却されるアクション', submitted.action, 'submit')
    check('申請番号が採番される', /^APP-[0-9]{4}-[0-9]{5}$/.test(submitted.applicationNumber), true)
    check('提出結果の対象経費が明細の合計と一致する', submitted.totalExpense, 6000000)

    var requestGr = reload(submitted.sys_id)
    check('提出されたのは下書きのレコード', submitted.sys_id, draftId)
    check('ステータスが受付済へ遷移する', requestGr.getValue('u_application_status'), 'accepted')
    check('提出日時が記録される', !!requestGr.getValue('u_submitted_on'), true)
    check('申請番号がレコードへ保存される',
        requestGr.getValue('u_application_number'), submitted.applicationNumber)
    check('補助上限額が記録される', requestGr.getValue('u_subsidy_cap_amount'), '' + submitted.capAmount)
    check('申請者ユーザが記録される', requestGr.getValue('u_applicant_user'), userId)
    check('組織形態が記録される', requestGr.getValue('u_organization_type'), 'corporate')

    // 対象経費合計は明細から確定する（画面の入力値ではない）
    check('対象経費合計が明細の合計で保存される',
        parseInt(requestGr.getValue('u_total_expense_amount'), 10), 6000000)

    /**
     * 補助金額と補助率の分子・分母が保存されること。
     * u_subsidy_rate（精度2桁）を使って計算する実装に戻ると値がずれる。
     */
    var judged = util.judgeAmount('le20', false, 6000000)
    check('補助率の分子が記録される',
        parseInt(requestGr.getValue('u_subsidy_rate_numerator'), 10), judged.numerator)
    check('補助率の分母が記録される',
        parseInt(requestGr.getValue('u_subsidy_rate_denominator'), 10), judged.denominator)
    check('補助金額が分数計算の結果で記録される',
        parseInt(requestGr.getValue('u_subsidy_amount'), 10), judged.subsidyAmount)

    // 提出により下書きが無くなる（同じレコードが受付済へ遷移したため）
    check('提出後は下書きが無い', countDrafts(entityId), 0)

    // 処理履歴（ITCOM-05／07 のタイムライン）へ提出が記録されること
    var logs = new x_dent2_dentsusoke.ApplicationLogUtil().list(draftId, false, 10)
    var hasSubmitLog = false
    for (var j = 0; j < logs.length; j++) {
        if (logs[j].action === 'submitted') {
            hasSubmitLog = true
        }
    }
    check('提出が処理履歴に記録される', hasSubmitLog, true)

    // -----------------------------------------------------------------------
    // 採番が連番であること（2件目を別事業者で提出する）
    // -----------------------------------------------------------------------
    var entityId2 = createEntity()
    var userId2 = createUser(entityId2)
    util.saveDraft(entityId2, userId2, { employee_category: 'le20' })
    var draftId2 = util.getDraft(entityId2).getUniqueValue()
    expenseUtil.save(draftId2, {
        category_id: category.sys_id,
        description: 'ATF 明細1',
        amount: '1000000'
    })
    fillRequiredDocuments(draftId2)
    var submitted2 = util.submit(entityId2, userId2, submitInput)
    check('2件目の提出が成功する', submitted2.success, true)
    check('申請番号が重複しない', submitted.applicationNumber === submitted2.applicationNumber, false)

    // 連番が1つ進んでいること（同一年内）
    var serial1 = parseInt(submitted.applicationNumber.slice(-5), 10)
    var serial2 = parseInt(submitted2.applicationNumber.slice(-5), 10)
    check('連番が1つ進む', serial2, serial1 + 1)

    // -----------------------------------------------------------------------
    // 異常系：事業者が紐づいていない／必須未入力
    // -----------------------------------------------------------------------
    check('事業者なしでは下書き保存できない', util.saveDraft('', userId, {}).success, false)
    check('事業者なしでは提出できない', util.submit('', userId, submitInput).success, false)

    var entityId3 = createEntity()
    var userId3 = createUser(entityId3)
    check('必須未入力では提出できない',
        util.submit(entityId3, userId3, { employee_category: 'le20' }).success, false)
    check('提出に失敗した場合レコードを作らない', countDrafts(entityId3), 0)

    stepResult.setOutputMessage('下書き保存と提出を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
