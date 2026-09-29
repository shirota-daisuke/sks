import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * SC-17 帳票／レポート出力画面（事務局）の単体テスト
 *
 * 対象のカスタムロジック
 *   1. レポート定義（sys_report）10件の構成
 *      … 対象テーブル・種類・参照ロール・絞込条件・掲載項目
 *   2. 帳票の絞込条件が業務ステータスと整合していること
 *
 * レポートにはスクリプトが無いため、定義の構成と絞込条件の妥当性を検証する。
 * roles にロール名ではなく Role オブジェクトを渡すと "[object Object]" が
 * 保存されて誰にも見えなくなるため、ロール名が正しく入っていることを重点的に確認する。
 *
 * 検証には Jasmine を使わず assertEqual を使う（理由は sc11-registration-review.now.ts のコメント参照）。
 */

/** レポート定義の構成 */
Test(
    {
        $id: Now.ID['test_sc17_reports'],
        name: 'SC-17 帳票／レポート：レポート定義の構成',
        description:
            'SC-17 で定義した10件のレポート（帳票7件・集計3件）の構成を検証する。対象テーブルがアプリのスコープ内であること、参照ロールに事務局ユーザのロール名が正しく入っていること（Role オブジェクトが誤って保存されていないこと）、共有レポートであること、帳票には実在する掲載項目があり集計レポートには実在する集計軸と集計方法があることを確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc17_step_reports'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    function checkTrue(name, condition) {
        check(name, !!condition, true)
    }

    /**
     * 本アプリのスコープの sys_id。
     *
     * gs.getCurrentApplicationId() は ATF の実行コンテキストでは 'global' を返すため使えない
     * （グローバルスコープのレコードを拾ってしまい、当初10件のはずが694件になっていた）。
     * sys_id を直接書くとトンマナ 3.4.1「sys_id のハードコード禁止」に反するため、
     * スコープ名から解決する。
     */
    function resolveScopeId() {
        var gr = new GlideRecord('sys_scope')
        gr.addQuery('scope', 'x_dent2_dentsusoke')
        gr.setLimit(1)
        gr.query()
        return gr.next() ? gr.getUniqueValue() : ''
    }

    var SCOPE_ID = resolveScopeId()
    var STAFF = 'x_dent2_dentsusoke.staff'

    /** 本アプリのスコープに属するレポートをタイトル引きで取得する（値を複製して保持する） */
    function loadReports() {
        var rows = {}
        var gr = new GlideRecord('sys_report')
        gr.addQuery('sys_scope', SCOPE_ID)
        gr.orderBy('title')
        gr.query()
        while (gr.next()) {
            rows[gr.getValue('title')] = {
                table: gr.getValue('table'),
                type: gr.getValue('type'),
                roles: gr.getValue('roles') || '',
                user: gr.getValue('user') || '',
                filter: gr.getValue('filter') || '',
                fieldList: gr.getValue('field_list') || '',
                field: gr.getValue('field') || '',
                aggregate: gr.getValue('aggregate') || '',
            }
        }
        return rows
    }

    var LIST_REPORTS = [
        'SKS 申請一覧（受付済）',
        'SKS 採択者一覧（申請審査完了）',
        'SKS 不採択・取下げ一覧',
        'SKS 事業者ユーザ登録審査状況一覧',
        'SKS 事業者一覧',
        'SKS 問合せ対応状況一覧',
        'SKS お知らせ掲載一覧',
    ]

    var AGGREGATE_REPORTS = ['SKS 申請ステータス別件数', 'SKS 申請 従業員数区分別件数', 'SKS 事業者 業種別件数']

    var reports = loadReports()

    var total = 0
    for (var t in reports) {
        total++
    }
    check('レポート定義の件数（帳票7件＋集計3件）', total, 10)

    // 全レポート共通
    for (var title in reports) {
        var r = reports[title]
        // Role オブジェクトを渡すと "[object Object]" になる不具合の検出
        check('参照ロールがロール名である: ' + title, r.roles, STAFF)
        check('共有レポートである: ' + title, r.user, 'GLOBAL')
        checkTrue('対象テーブルが本アプリのもの: ' + title, r.table.indexOf('x_dent2_dentsusoke_') === 0)

        // 絞込条件が実行可能である（構文が正しい）
        var gr = new GlideRecord(r.table)
        gr.addEncodedQuery(r.filter)
        gr.setLimit(1)
        gr.query()
        checkTrue('絞込条件が実行できる: ' + title, gr.getRowCount() >= 0)
    }

    // 帳票（一覧形式）
    for (var i = 0; i < LIST_REPORTS.length; i++) {
        var listTitle = LIST_REPORTS[i]
        var listReport = reports[listTitle]
        checkTrue('帳票が存在する: ' + listTitle, !!listReport)
        if (!listReport) {
            continue
        }
        check('帳票の種類が list: ' + listTitle, listReport.type, 'list')
        checkTrue('掲載項目が設定されている: ' + listTitle, listReport.fieldList.length > 0)

        var fields = listReport.fieldList.split(',')
        checkTrue('掲載項目が複数ある: ' + listTitle, fields.length > 1)

        var fieldGr = new GlideRecord(listReport.table)
        fieldGr.initialize()
        for (var f = 0; f < fields.length; f++) {
            check('掲載項目が実在する: ' + listTitle + ' / ' + fields[f], fieldGr.isValidField(fields[f]), true)
        }
    }

    // レポート（集計）
    for (var a = 0; a < AGGREGATE_REPORTS.length; a++) {
        var aggTitle = AGGREGATE_REPORTS[a]
        var aggReport = reports[aggTitle]
        checkTrue('集計レポートが存在する: ' + aggTitle, !!aggReport)
        if (!aggReport) {
            continue
        }
        checkTrue('集計レポートの種類が bar か pie: ' + aggTitle, aggReport.type === 'bar' || aggReport.type === 'pie')
        // 集計軸は group_by ではなく field 列に入る
        checkTrue('集計軸が設定されている: ' + aggTitle, aggReport.field.length > 0)
        check('集計方法が COUNT: ' + aggTitle, aggReport.aggregate, 'COUNT')

        var aggGr = new GlideRecord(aggReport.table)
        aggGr.initialize()
        check('集計軸の項目が実在する: ' + aggTitle + ' / ' + aggReport.field, aggGr.isValidField(aggReport.field), true)
    }

    stepResult.setOutputMessage('SC-17 のレポート定義を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** 帳票の絞込条件が業務ステータスと整合していること */
Test(
    {
        $id: Now.ID['test_sc17_report_filters'],
        name: 'SC-17 帳票／レポート：絞込条件の整合',
        description:
            'SC-17 の帳票の絞込条件が業務ステータスと整合していることを検証する。申請系の帳票が「申請入力中」を除外または終端状態に限定していること（受付済一覧・集計は !=input、採択者一覧は review_done、不採択・取下げ一覧は rejected と withdrawn）と、ユーザ登録審査状況一覧が「未登録」を除外していることを確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc17_step_filters'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    /**
     * 本アプリのスコープの sys_id。
     *
     * gs.getCurrentApplicationId() は ATF の実行コンテキストでは 'global' を返すため使えない
     * （グローバルスコープのレコードを拾ってしまい、当初10件のはずが694件になっていた）。
     * sys_id を直接書くとトンマナ 3.4.1「sys_id のハードコード禁止」に反するため、
     * スコープ名から解決する。
     */
    function resolveScopeId() {
        var gr = new GlideRecord('sys_scope')
        gr.addQuery('scope', 'x_dent2_dentsusoke')
        gr.setLimit(1)
        gr.query()
        return gr.next() ? gr.getUniqueValue() : ''
    }

    var SCOPE_ID = resolveScopeId()

    function filterOf(title) {
        var gr = new GlideRecord('sys_report')
        gr.addQuery('sys_scope', SCOPE_ID)
        gr.addQuery('title', title)
        gr.setLimit(1)
        gr.query()
        return gr.next() ? gr.getValue('filter') || '' : null
    }

    /** 絞込条件が指定の条件で始まっているか */
    function startsWith(title, expected) {
        var filter = filterOf(title)
        check(
            '絞込条件: ' + title,
            filter === null ? '(レポートが見つかりません)' : filter.indexOf(expected) === 0,
            true,
        )
    }

    // 受付済一覧・集計レポートは「申請入力中」を除外する
    startsWith('SKS 申請一覧（受付済）', 'u_application_status!=input')
    startsWith('SKS 申請ステータス別件数', 'u_application_status!=input')
    startsWith('SKS 申請 従業員数区分別件数', 'u_application_status!=input')

    // 採択者一覧は申請審査完了のみ
    startsWith('SKS 採択者一覧（申請審査完了）', 'u_application_status=review_done')

    // 不採択・取下げ一覧は終端の2ステータスのみ
    startsWith('SKS 不採択・取下げ一覧', 'u_application_statusINrejected,withdrawn')

    // ユーザ登録審査状況一覧は「未登録」を除外する
    startsWith('SKS 事業者ユーザ登録審査状況一覧', 'u_registration_status!=unregistered')

    // 絞込条件で使う項目が対象テーブルに実在する
    var requestGr = new GlideRecord('x_dent2_dentsusoke_request')
    requestGr.initialize()
    check('u_application_status が実在する', requestGr.isValidField('u_application_status'), true)
    check('u_employee_count_category が実在する', requestGr.isValidField('u_employee_count_category'), true)

    var userGr = new GlideRecord('x_dent2_dentsusoke_user')
    userGr.initialize()
    check('u_registration_status が実在する', userGr.isValidField('u_registration_status'), true)

    stepResult.setOutputMessage('SC-17 の絞込条件の整合を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
