import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * SC-16 マスタメンテナンス画面（事務局）の単体テスト
 *
 * 対象のカスタムロジック
 *   1. u_code の一意制約（5マスタすべて）
 *   2. 初期データの整合性（コード・基準値・表示順・有効フラグ）
 *   3. ACL による更新権限の限定（追加・変更はシステム管理者のみ）
 *   4. 辞書の既定値（u_active = true、u_order = 100）
 *
 * マスタにはスクリプトによるロジックが無いため、制約・データ・権限の3点を検証する。
 *
 * ■ 検証に Jasmine を使わない理由
 * runServerSideScript で Jasmine（describe／it／expect）を実行すると、
 * 期待値の不一致がステップの成否へ反映されない。
 * 実際に「Test results :: (98/122) :: failed」とログに出ていてもステップは成功扱いになり、
 * テストが偽の成功を返していた（当インスタンスで確認）。
 * ATF へ結果を伝えるには assertEqual を使う必要があるため、
 * 本ファイルは assertEqual を包んだ check／checkTrue で検証する。
 */

/** 初期データの整合性と既定値 */
Test(
    {
        $id: Now.ID['test_sc16_master_data'],
        name: 'SC-16 マスタメンテナンス：初期データと制約',
        description:
            '5マスタ（業種別基準・補助上限額・補助率・対象経費区分・専門家経費日額上限）の初期データを検証する。件数・コードの一意性・基準値の大小関係（特例措置ありの上限額が大きい、小規模区分の補助率が高い、業種別に資本金上限が異なる）・補助率の分母が0でないこと・u_active と u_order の既定値が効くことを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc16_step_data'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    var passed = 0
    var failed = 0
    var failures = []

    /** 値の一致を ATF へ報告する（文字列化して比較する） */
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
        if (String(value) === String(shouldbe)) {
            passed++
        } else {
            failed++
            failures.push(name + ' : expected=' + shouldbe + ' actual=' + value)
        }
    }

    /** 条件が真であることを報告する */
    function checkTrue(name, condition) {
        check(name, !!condition, true)
    }

    /**
     * マスタの全行をコード引きで取得する。
     * GlideRecord の参照をそのまま保持すると、ループ終了後は全要素が
     * 同一オブジェクト（最終行）を指してしまうため、値を複製して保持する。
     */
    function loadByCode(table, fields) {
        var rows = {}
        var gr = new GlideRecord(table)
        gr.orderBy('u_order')
        gr.query()
        while (gr.next()) {
            var row = {
                sys_id: gr.getUniqueValue(),
                code: gr.getValue('u_code'),
                order: parseInt(gr.getValue('u_order'), 10),
                active: gr.getValue('u_active'),
            }
            for (var i = 0; i < fields.length; i++) {
                row[fields[i]] = gr.getValue(fields[i])
            }
            rows[row.code] = row
        }
        return rows
    }

    function countRows(table) {
        var agg = new GlideAggregate(table)
        agg.addAggregate('COUNT')
        agg.query()
        return agg.next() ? parseInt(agg.getAggregate('COUNT'), 10) : 0
    }

    /** 指定テーブルの u_code に重複が無いか */
    function hasDuplicateCode(table) {
        var seen = {}
        var gr = new GlideRecord(table)
        gr.query()
        while (gr.next()) {
            var code = gr.getValue('u_code')
            if (seen[code]) {
                return true
            }
            seen[code] = true
        }
        return false
    }

    var MASTERS = [
        'x_dent2_dentsusoke_industry',
        'x_dent2_dentsusoke_cap',
        'x_dent2_dentsusoke_rate',
        'x_dent2_dentsusoke_expense',
        'x_dent2_dentsusoke_expert_fee',
    ]
    var CATEGORIES = ['sole_proprietor', 'le5', 'le20', 'le50', 'le100', 'gt100']

    // -----------------------------------------------------------------------
    // マスタ共通
    // -----------------------------------------------------------------------
    for (var m = 0; m < MASTERS.length; m++) {
        checkTrue('初期データが投入されている: ' + MASTERS[m], countRows(MASTERS[m]) > 0)
        check('コードが一意である: ' + MASTERS[m], hasDuplicateCode(MASTERS[m]), false)
    }

    // 既定値（u_active = true、u_order = 100）
    var defaults = new GlideRecord('x_dent2_dentsusoke_expense')
    defaults.initialize()
    defaults.setValue('u_code', 'atf_default_check')
    defaults.setValue('u_name', 'ATF 既定値確認')
    var defaultsId = defaults.insert()
    checkTrue('既定値確認用のレコードが登録できる', !!defaultsId)
    if (defaultsId) {
        var savedDefaults = new GlideRecord('x_dent2_dentsusoke_expense')
        savedDefaults.get(defaultsId)
        check('有効フラグの既定値が true', savedDefaults.getValue('u_active'), '1')
        check('表示順の既定値が 100', savedDefaults.getValue('u_order'), '100')
    }

    // -----------------------------------------------------------------------
    // T15 業種別基準マスタ
    // -----------------------------------------------------------------------
    var industries = loadByCode('x_dent2_dentsusoke_industry', ['u_name', 'u_capital_limit', 'u_employee_limit'])
    var INDUSTRY_CODES = ['manufacturing', 'construction', 'transportation', 'wholesale', 'service', 'retail', 'other']

    for (var i = 0; i < INDUSTRY_CODES.length; i++) {
        checkTrue('業種が存在する: ' + INDUSTRY_CODES[i], !!industries[INDUSTRY_CODES[i]])
    }

    for (var code in industries) {
        checkTrue(
            '資本金上限が設定されている: ' + code,
            parseInt(industries[code].u_capital_limit, 10) > 0,
        )
        checkTrue(
            '従業員数上限が設定されている: ' + code,
            parseInt(industries[code].u_employee_limit, 10) > 0,
        )
    }

    // 業種ごとに基準が異なること（中小企業基本法の区分）
    var manufacturingCapital = parseInt(industries['manufacturing'].u_capital_limit, 10)
    checkTrue(
        '卸売業の資本金上限は製造業より低い',
        parseInt(industries['wholesale'].u_capital_limit, 10) < manufacturingCapital,
    )
    checkTrue(
        '小売業の資本金上限は製造業より低い',
        parseInt(industries['retail'].u_capital_limit, 10) < manufacturingCapital,
    )
    checkTrue(
        '小売業の従業員数上限はサービス業より低い',
        parseInt(industries['retail'].u_employee_limit, 10) <
            parseInt(industries['service'].u_employee_limit, 10),
    )

    // -----------------------------------------------------------------------
    // 補助上限額マスタ
    // -----------------------------------------------------------------------
    var caps = loadByCode('x_dent2_dentsusoke_cap', [
        'u_employee_count_category',
        'u_special_measure_flag',
        'u_cap_amount',
    ])

    check('補助上限額マスタの件数（6区分 × 特例措置の有無）', countRows('x_dent2_dentsusoke_cap'), 12)

    for (var c = 0; c < CATEGORIES.length; c++) {
        var normalCode = CATEGORIES[c]
        var specialCode = CATEGORIES[c] + '_special'
        checkTrue('補助上限額（特例なし）が存在する: ' + normalCode, !!caps[normalCode])
        checkTrue('補助上限額（特例あり）が存在する: ' + specialCode, !!caps[specialCode])

        if (caps[normalCode] && caps[specialCode]) {
            check('特例措置フラグが false: ' + normalCode, caps[normalCode].u_special_measure_flag, '0')
            check('特例措置フラグが true: ' + specialCode, caps[specialCode].u_special_measure_flag, '1')
            check(
                '従業員数区分が一致する: ' + specialCode,
                caps[specialCode].u_employee_count_category,
                normalCode,
            )
            checkTrue(
                '特例ありの上限額は特例なしより大きい: ' + normalCode,
                parseInt(caps[specialCode].u_cap_amount, 10) > parseInt(caps[normalCode].u_cap_amount, 10),
            )
        }
    }

    // デモ申請データ（APP-2026-00123）で確定している値
    check('6～20人・特例なしの補助上限額', caps['le20'].u_cap_amount, '15000000')

    // 従業員数区分が大きいほど上限額が下がらない
    for (var s = 1; s < CATEGORIES.length; s++) {
        checkTrue(
            '上限額が単調非減少: ' + CATEGORIES[s - 1] + ' → ' + CATEGORIES[s],
            parseInt(caps[CATEGORIES[s]].u_cap_amount, 10) >=
                parseInt(caps[CATEGORIES[s - 1]].u_cap_amount, 10),
        )
    }

    // -----------------------------------------------------------------------
    // 補助率マスタ
    // -----------------------------------------------------------------------
    var rates = loadByCode('x_dent2_dentsusoke_rate', [
        'u_employee_count_category',
        'u_rate_numerator',
        'u_rate_denominator',
    ])

    check('補助率マスタの件数（従業員数区分6区分）', countRows('x_dent2_dentsusoke_rate'), 6)

    for (var r = 0; r < CATEGORIES.length; r++) {
        var rateCode = CATEGORIES[r]
        checkTrue('補助率が存在する: ' + rateCode, !!rates[rateCode])
        if (!rates[rateCode]) {
            continue
        }
        var numerator = parseInt(rates[rateCode].u_rate_numerator, 10)
        var denominator = parseInt(rates[rateCode].u_rate_denominator, 10)
        // 処理No.17 でのゼロ除算を防ぐ
        checkTrue('分母が0でない: ' + rateCode, denominator > 0)
        // 補助率が100%を超えない
        checkTrue('分子が分母以下: ' + rateCode, numerator <= denominator)
    }

    // デモ申請データ（APP-2026-00123）で確定している 1/2
    check('6～20人の補助率（分子）', rates['le20'].u_rate_numerator, '1')
    check('6～20人の補助率（分母）', rates['le20'].u_rate_denominator, '2')

    // 小規模区分に設定すべき具体値の検証は別テスト
    // 「SC-16 マスタメンテナンス：補助率マスタの値」で行う。
    // ATF の assertEqual は最初の不一致でステップを終了するため、
    // インスタンス側のデータ不整合で後続の検証が実行されなくなるのを避けている。

    // -----------------------------------------------------------------------
    // 対象経費区分マスタ
    // -----------------------------------------------------------------------
    var expenses = loadByCode('x_dent2_dentsusoke_expense', ['u_name', 'u_has_daily_cap'])

    // SC-10 の問合せデモデータで実在が確認できる区分
    checkTrue('クラウドサービス利用費が存在する', !!expenses['cloud'])
    check('クラウドサービス利用費の名称', expenses['cloud'].u_name, 'クラウドサービス利用費')

    // 日額上限ありの区分は専門家経費のみ
    var withDailyCap = []
    var orders = {}
    var duplicateOrder = false
    for (var e in expenses) {
        if (e === 'atf_default_check') {
            // 既定値確認で作成したレコードは対象外
            continue
        }
        if (expenses[e].u_has_daily_cap === '1') {
            withDailyCap.push(e)
        }
        if (orders[expenses[e].order]) {
            duplicateOrder = true
        }
        orders[expenses[e].order] = e
    }
    check('日額上限ありの区分数', withDailyCap.length, 1)
    check('日額上限ありの区分は専門家経費', withDailyCap[0], 'expert')
    check('表示順が重複していない', duplicateOrder, false)

    // -----------------------------------------------------------------------
    // 専門家経費日額上限マスタ
    // -----------------------------------------------------------------------
    var expertFees = loadByCode('x_dent2_dentsusoke_expert_fee', ['u_name', 'u_daily_cap_amount'])
    var expertList = []
    for (var x in expertFees) {
        checkTrue('日額上限が設定されている: ' + x, parseInt(expertFees[x].u_daily_cap_amount, 10) > 0)
        expertList.push(expertFees[x])
    }
    checkTrue('専門家区分が1件以上ある', expertList.length > 0)

    expertList.sort(function (a, b) {
        return a.order - b.order
    })
    for (var f = 1; f < expertList.length; f++) {
        checkTrue(
            '表示順が上位の区分ほど日額上限が高い: ' + expertList[f - 1].code + ' → ' + expertList[f].code,
            parseInt(expertList[f].u_daily_cap_amount, 10) <=
                parseInt(expertList[f - 1].u_daily_cap_amount, 10),
        )
    }

    stepResult.setOutputMessage(
        '検証結果: 成功 ' + passed + ' 件 / 失敗 ' + failed + ' 件' +
            (failed > 0 ? '\\n失敗一覧:\\n' + failures.join('\\n') : ''),
    )
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/**
 * 補助率マスタに設定すべき具体値
 *
 * 小規模区分（個人事業主・5人以下）は 2/3、それ以外は 1/2 を適用する設計。
 *
 * 本マスタは補助率を DecimalColumn から分子・分母へ作り替えた経緯があり、
 * アプリのインストールでは既存レコードが更新されないため、
 * 既存環境では作り替え前の値（列の既定値だった 1/2）が残っている。
 * この是正は Fix Script「SKS 補助率マスタの値の是正」
 * （src/fluent/fix-scripts/align-subsidy-rate-master.now.ts）が行う。
 * 本テストが失敗する場合は当該 Fix Script が実行されていないため、
 * Studio から手動実行する
 * （経緯は src/fluent/master-data/subsidy-rate-master.now.ts のコメントを参照）。
 *
 * 初期データの構造的な検証（件数・一意性・分母が0でない等）は
 * 「SC-16 マスタメンテナンス：初期データと制約」で行っており、本テストとは独立している。
 */
Test(
    {
        $id: Now.ID['test_sc16_rate_values'],
        name: 'SC-16 マスタメンテナンス：補助率マスタの値',
        description:
            '補助率マスタに設定すべき具体値を検証する。小規模区分（個人事業主・5人以下）が 2/3、中小企業区分（6～20人以上）が 1/2 であり、小規模区分の補助率が中小企業区分より高いことを確認する。失敗する場合は Fix Script「SKS 補助率マスタの値の是正」が実行されていない。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc16_step_rate_values'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function load() {
        var rows = {}
        var gr = new GlideRecord('x_dent2_dentsusoke_rate')
        gr.query()
        while (gr.next()) {
            rows[gr.getValue('u_code')] = {
                numerator: gr.getValue('u_rate_numerator'),
                denominator: gr.getValue('u_rate_denominator'),
                note: gr.getValue('u_note') || '',
            }
        }
        return rows
    }

    var rates = load()
    var SMALL = ['sole_proprietor', 'le5']
    var MEDIUM = ['le20', 'le50', 'le100', 'gt100']

    for (var s = 0; s < SMALL.length; s++) {
        assertEqual({
            name: '小規模区分の補助率は 2/3（分子）: ' + SMALL[s],
            shouldbe: '2',
            value: rates[SMALL[s]].numerator,
        })
        assertEqual({
            name: '小規模区分の補助率は 2/3（分母）: ' + SMALL[s],
            shouldbe: '3',
            value: rates[SMALL[s]].denominator,
        })
    }

    for (var m = 0; m < MEDIUM.length; m++) {
        assertEqual({
            name: '中小企業区分の補助率は 1/2（分子）: ' + MEDIUM[m],
            shouldbe: '1',
            value: rates[MEDIUM[m]].numerator,
        })
        assertEqual({
            name: '中小企業区分の補助率は 1/2（分母）: ' + MEDIUM[m],
            shouldbe: '2',
            value: rates[MEDIUM[m]].denominator,
        })
    }

    var smallRate = parseInt(rates['sole_proprietor'].numerator, 10) / parseInt(rates['sole_proprietor'].denominator, 10)
    var mediumRate = parseInt(rates['le20'].numerator, 10) / parseInt(rates['le20'].denominator, 10)
    assertEqual({
        name: '小規模区分の補助率は中小企業区分より高い',
        shouldbe: true,
        value: smallRate > mediumRate,
    })

    stepResult.setOutputMessage('補助率マスタの値を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/**
 * u_code の一意制約
 *
 * 重複登録はデータベースの一意キー違反となり、サーバーエラーとして記録される。
 * そのため failOnServerError: false を指定し、
 * 「登録されないこと」を record_not_inserted で判定する。
 */
Test(
    {
        $id: Now.ID['test_sc16_master_unique_code'],
        name: 'SC-16 マスタメンテナンス：コードの重複登録',
        description:
            '業種別基準マスタの u_code の一意制約を検証する。初期データに存在するコード（manufacturing）と同じ値で登録を試み、一意キー違反により登録されないこと（record_not_inserted）を確認する。コードは事業者データとの突合キーであり重複してはならない。',
        active: true,
        failOnServerError: false,
    },
    (atf) => {
        atf.server.recordInsert({
            $id: Now.ID['test_sc16_unique_code_step'],
            table: 'x_dent2_dentsusoke_industry',
            assert: 'record_not_inserted',
            fieldValues: {
                u_code: 'manufacturing',
                u_name: 'ATF 重複コード（登録されないこと）',
                u_order: 9997,
            },
        })
    },
)

/** ACL による更新権限の限定（追加・変更はシステム管理者のみ） */
Test(
    {
        $id: Now.ID['test_sc16_master_acl'],
        name: 'SC-16 マスタメンテナンス：更新権限の限定',
        description:
            'マスタの追加・変更をシステム管理者のみに許可する ACL を検証する。アプリのロールを持たないユーザを作成して業種別基準マスタへの登録を試み、ACL により拒否されること（record_not_inserted）を確認する。権限設計書2章「マスタメンテナンスはシステム管理者」の境界の否定側を確認するケース。',
        active: true,
        failOnServerError: false,
    },
    (atf) => {
        // アプリのロールを一切持たないユーザ（事業者ユーザでも事務局ユーザでもない）
        atf.server.createUser({
            $id: Now.ID['test_sc16_acl_create_user'],
            firstName: 'ATF',
            lastName: 'SC16-NoRole',
            fieldValues: {
                user_name: 'atf.sc16.norole',
                email: 'atf.sc16.norole@example.invalid',
            },
            groups: [],
            roles: [],
            impersonate: true,
        })

        atf.server.recordInsert({
            $id: Now.ID['test_sc16_acl_insert_denied'],
            table: 'x_dent2_dentsusoke_industry',
            assert: 'record_not_inserted',
            enforceSecurity: true,
            fieldValues: {
                u_code: 'atf_acl_denied',
                u_name: 'ATF ACL 拒否確認',
                u_order: 9998,
            },
        })
    },
)

/** ACL 定義そのものの構成確認（更新系がシステム管理者に限定されているか） */
Test(
    {
        $id: Now.ID['test_sc16_master_acl_config'],
        name: 'SC-16 マスタメンテナンス：ACL 構成の確認',
        description:
            '5マスタの ACL 構成を検証する。create／write が system_admin のみに紐づき、read には事務局ユーザ・事業者ユーザ・システム管理者が含まれ、delete の ACL が存在しない（マスタは物理削除せず無効化で運用する方針）ことを sys_security_acl と sys_security_acl_role の突き合わせで確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc16_step_acl_config'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    var passed = 0
    var failed = 0
    var failures = []

    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
        if (String(value) === String(shouldbe)) {
            passed++
        } else {
            failed++
            failures.push(name + ' : expected=' + shouldbe + ' actual=' + value)
        }
    }

    function checkTrue(name, condition) {
        check(name, !!condition, true)
    }

    /** 指定テーブル・操作の ACL に紐づくロール名の一覧 */
    function rolesFor(table, operation) {
        var roles = []
        var acl = new GlideRecord('sys_security_acl')
        acl.addQuery('name', table)
        acl.addQuery('operation', operation)
        acl.addQuery('active', true)
        acl.query()
        while (acl.next()) {
            var link = new GlideRecord('sys_security_acl_role')
            link.addQuery('sys_security_acl', acl.getUniqueValue())
            link.query()
            while (link.next()) {
                var name = link.getDisplayValue('sys_user_role')
                if (roles.indexOf(name) < 0) {
                    roles.push(name)
                }
            }
        }
        return roles
    }

    function aclCount(table, operation) {
        var agg = new GlideAggregate('sys_security_acl')
        agg.addQuery('name', table)
        agg.addQuery('operation', operation)
        agg.addAggregate('COUNT')
        agg.query()
        return agg.next() ? parseInt(agg.getAggregate('COUNT'), 10) : 0
    }

    var MASTERS = [
        'x_dent2_dentsusoke_industry',
        'x_dent2_dentsusoke_cap',
        'x_dent2_dentsusoke_rate',
        'x_dent2_dentsusoke_expense',
        'x_dent2_dentsusoke_expert_fee',
    ]

    var SYSTEM_ADMIN = 'x_dent2_dentsusoke.system_admin'
    var STAFF = 'x_dent2_dentsusoke.staff'
    var APPLICANT = 'x_dent2_dentsusoke.applicant'

    for (var i = 0; i < MASTERS.length; i++) {
        var table = MASTERS[i]

        var createRoles = rolesFor(table, 'create')
        check('追加を許可するロール数: ' + table, createRoles.length, 1)
        check('追加を許可するロール: ' + table, createRoles[0], SYSTEM_ADMIN)

        var writeRoles = rolesFor(table, 'write')
        check('変更を許可するロール数: ' + table, writeRoles.length, 1)
        check('変更を許可するロール: ' + table, writeRoles[0], SYSTEM_ADMIN)

        var readRoles = rolesFor(table, 'read')
        checkTrue('参照に事務局ユーザが含まれる: ' + table, readRoles.indexOf(STAFF) >= 0)
        checkTrue('参照に事業者ユーザが含まれる: ' + table, readRoles.indexOf(APPLICANT) >= 0)
        checkTrue('参照にシステム管理者が含まれる: ' + table, readRoles.indexOf(SYSTEM_ADMIN) >= 0)

        // マスタは物理削除せず無効化で運用する方針のため delete の ACL は作らない
        check('削除の ACL が存在しない: ' + table, aclCount(table, 'delete'), 0)
    }

    stepResult.setOutputMessage(
        '検証結果: 成功 ' + passed + ' 件 / 失敗 ' + failed + ' 件' +
            (failed > 0 ? '\\n失敗一覧:\\n' + failures.join('\\n') : ''),
    )
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
