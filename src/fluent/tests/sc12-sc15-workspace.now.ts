import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * SC-12 事務局ユーザ管理画面／SC-15 ダッシュボード画面の単体テスト
 *
 * この2画面はスクリプトによるロジックを持たない。
 *   SC-12 … 標準の sys_user／sys_user_has_role／sys_user_role に対するリスト定義と
 *            表示対象ロール（Applicability）のみで構成される
 *   SC-15 … ダッシュボードのウィジェット構成（データソース・集計軸）のみで構成される
 *
 * したがって検証対象は「構成が正しいこと」になる。
 * とくに SC-15 は componentProps の項目が1つ欠けるとウィジェットが描画されない
 * （dataCategories が無いとグラフが出ず、preferredVisualizations に
 * ウィジェット種別の sys_id を入れるとグラフが消えることを実機で確認済み）ため、
 * 描画に必要なプロパティの存在をテストで固定する。
 *
 * 検証には Jasmine を使わず assertEqual を使う（理由は sc11-registration-review.now.ts のコメント参照）。
 */

/** SC-12 事務局ユーザ管理：リスト定義と表示対象ロール */
Test(
    {
        $id: Now.ID['test_sc12_workspace_lists'],
        name: 'SC-12 事務局ユーザ管理：リスト定義と表示対象ロール',
        description:
            'SC-12 のリスト定義を検証する。「事務局ユーザ管理」カテゴリの3リスト（ロール割当・ユーザーアカウント・ロール定義）が対象テーブルと絞込条件を持ち、表示対象がシステム管理者と事務局管理者に限定されていること（事務局ユーザ単独では表示されないこと）を sys_ux_list と Applicability の突き合わせで確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc12_step_lists'],
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
     * （グローバルスコープのレコードを拾ってしまい、当初 SC-15 で18件のはずが214件になっていた）。
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

    /** カテゴリ名からリストをタイトル引きで取得する（値を複製して保持する） */
    function loadListsByCategory(categoryTitle) {
        var rows = {}
        var gr = new GlideRecord('sys_ux_list')
        gr.addQuery('sys_scope', SCOPE_ID)
        gr.addQuery('category.title', categoryTitle)
        gr.orderBy('order')
        gr.query()
        while (gr.next()) {
            rows[gr.getValue('title')] = {
                table: gr.getValue('table'),
                condition: gr.getValue('condition') || '',
                columns: gr.getValue('columns') || '',
                sys_id: gr.getUniqueValue(),
            }
        }
        return rows
    }

    /**
     * リストに紐づく Applicability のロール名一覧。
     *
     * sys_ux_applicability.roles はロール名ではなく sys_id をカンマ区切りで保持する
     * （getValue は "9af77c86...,b1d4b95e..."、getDisplayValue は
     *   "x_dent2_dentsusoke.staff, x_dent2_dentsusoke.staff_admin"）。
     * 当初 getValue の結果をロール名と比較しており、
     * 「事務局ユーザが含まれない」という否定側の検証が
     * 常に成立する（sys_id はロール名と一致しない）空振りになっていた。
     * ロール名で比較するため表示値を使う。
     */
    function rolesForList(listId) {
        var roles = []
        var m2m = new GlideRecord('sys_ux_applicability_m2m_list')
        m2m.addQuery('list', listId)
        m2m.query()
        while (m2m.next()) {
            var app = new GlideRecord('sys_ux_applicability')
            if (!app.get(m2m.getValue('applicability'))) {
                continue
            }
            var names = (app.getDisplayValue('roles') || '').split(',')
            for (var i = 0; i < names.length; i++) {
                var name = names[i].replace(/^\\s+/, '').replace(/\\s+$/, '')
                if (name && roles.indexOf(name) < 0) {
                    roles.push(name)
                }
            }
        }
        return roles
    }

    var lists = loadListsByCategory('事務局ユーザ管理')

    var count = 0
    for (var title in lists) {
        count++
    }
    check('事務局ユーザ管理のリスト数', count, 3)

    // ロール割当（sys_user_has_role）— 本アプリのロールに絞る
    var roleList = lists['事務局ユーザ（ロール割当）']
    checkTrue('ロール割当のリストが存在する', !!roleList)
    check('ロール割当の対象テーブル', roleList.table, 'sys_user_has_role')
    checkTrue('ロール割当は本アプリのロールに絞っている', roleList.condition.indexOf('x_dent2_dentsusoke') > -1)

    // ユーザーアカウント（sys_user）— 事業者ユーザを除外する
    var accountList = lists['ユーザーアカウント（新規追加）']
    checkTrue('ユーザーアカウントのリストが存在する', !!accountList)
    check('ユーザーアカウントの対象テーブル', accountList.table, 'sys_user')
    checkTrue(
        'ユーザーアカウントは事業者ユーザを除外している',
        accountList.condition.indexOf('sys_class_name=sys_user') > -1,
    )

    // ロール定義（sys_user_role）— 本アプリのロールに絞る
    var roleDefList = lists['ロール定義']
    checkTrue('ロール定義のリストが存在する', !!roleDefList)
    check('ロール定義の対象テーブル', roleDefList.table, 'sys_user_role')
    checkTrue('ロール定義は本アプリのロールに絞っている', roleDefList.condition.indexOf('x_dent2_dentsusoke') > -1)

    // 表示対象（権限設計書5章：SC-12 は staff × ／staff_admin ○／system_admin ○）
    for (var t in lists) {
        var roles = rolesForList(lists[t].sys_id)
        checkTrue('表示対象ロールが設定されている: ' + t, roles.length > 0)
        check('事務局ユーザ単独では表示されない: ' + t, roles.indexOf('x_dent2_dentsusoke.staff') >= 0, false)
        checkTrue(
            'システム管理者が表示対象に含まれる: ' + t,
            roles.indexOf('x_dent2_dentsusoke.system_admin') >= 0,
        )
    }

    stepResult.setOutputMessage('SC-12 のリスト定義と表示対象ロールを検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** SC-15 ダッシュボード：ウィジェット構成 */
Test(
    {
        $id: Now.ID['test_sc15_dashboard'],
        name: 'SC-15 ダッシュボード：ウィジェット構成',
        description:
            'SC-15 ダッシュボードのウィジェット構成を検証する。3タブ・18ウィジェットが存在し、各ウィジェットの componentProps に描画に必要なプロパティ（dataCategories／allowRealTime／isDatabaseView／preferredVisualizations）が揃い、preferredVisualizations が single-score のコンポーネント sys_id であること（ウィジェット種別の sys_id を入れるとグラフが描画されない）を確認する。データソースの絞込条件が実行可能であることも併せて検証する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc15_step_dashboard'],
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
     * （グローバルスコープのレコードを拾ってしまい、当初 SC-15 で18件のはずが214件になっていた）。
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
    var SINGLE_SCORE = 'd24d53f60350de7a652caf3188a46ed2'

    /** 本アプリのダッシュボードウィジェットを読み込む（値を複製して保持する） */
    function loadWidgets() {
        var widgets = []
        var gr = new GlideRecord('par_dashboard_widget')
        gr.addQuery('sys_scope', SCOPE_ID)
        gr.query()
        while (gr.next()) {
            var props = null
            try {
                props = JSON.parse(gr.getValue('component_props'))
            } catch (e) {
                props = null
            }
            widgets.push({
                sys_id: gr.getUniqueValue(),
                canvas: gr.getValue('canvas'),
                component: gr.getValue('component'),
                props: props,
                x: parseInt(gr.getValue('x'), 10),
                y: parseInt(gr.getValue('y'), 10),
            })
        }
        return widgets
    }

    function countTabs() {
        var agg = new GlideAggregate('par_dashboard_tab')
        agg.addQuery('dashboard.name', 'SKS 事務局ダッシュボード')
        agg.addAggregate('COUNT')
        agg.query()
        return agg.next() ? parseInt(agg.getAggregate('COUNT'), 10) : 0
    }

    var widgets = loadWidgets()

    check('ダッシュボードのタブ数', countTabs(), 3)
    check('ウィジェット数', widgets.length, 18)

    var groupedCount = 0
    var byCanvas = {}
    var duplicatePosition = false

    for (var i = 0; i < widgets.length; i++) {
        var w = widgets[i]
        var label = 'ウィジェット ' + (i + 1)

        checkTrue(label + ': componentProps が正しい JSON', w.props !== null)
        if (w.props === null) {
            continue
        }

        var ds = w.props.dataSources[0]
        var titled = w.props.headerTitle || label

        check(titled + ': データソース種別', ds.sourceType, 'table')
        checkTrue(titled + ': 対象テーブルが本アプリのもの', ds.tableOrViewName.indexOf('x_dent2_dentsusoke_') === 0)

        // dataCategories が無いと Group 系（縦棒・ドーナツ）が描画されない
        checkTrue(titled + ": dataCategories に group を含む", ds.dataCategories.indexOf('group') >= 0)
        checkTrue(titled + ": dataCategories に simple を含む", ds.dataCategories.indexOf('simple') >= 0)
        check(titled + ': isDatabaseView', ds.isDatabaseView, false)
        check(titled + ': allowRealTime', ds.allowRealTime, true)

        // ウィジェット種別の sys_id を入れるとグラフが描画されなくなる
        check(titled + ': preferredVisualizations の要素数', ds.preferredVisualizations.length, 1)
        check(titled + ': preferredVisualizations の値', ds.preferredVisualizations[0], SINGLE_SCORE)

        // メトリクスがデータソースを正しく参照している
        var metric = w.props.metrics[0]
        check(titled + ': メトリクスの参照先', metric.dataSource, ds.id)
        check(titled + ': 集計方法', metric.aggregateFunction, 'COUNT')
        check(titled + ': 軸', metric.axisId, 'primary')

        // グラフ系は集計軸とグループ数上限の適用単位を持つ
        if (w.props.groupBy) {
            groupedCount++
            var group = w.props.groupBy[0]
            check(titled + ': 集計軸の参照先', group.groupBy[0].dataSource, ds.id)
            checkTrue(titled + ': 集計軸が設定されている', !!group.groupBy[0].groupByField)
            check(
                titled + ': グループ数上限の適用単位',
                group.numberOfGroupsBasedOn,
                'NO_OF_GROUP_BASED_ON_PER_METRIC',
            )

            // 集計軸の項目が対象テーブルに実在する
            var groupGr = new GlideRecord(ds.tableOrViewName)
            groupGr.initialize()
            check(
                titled + ': 集計軸の項目が実在する（' + group.groupBy[0].groupByField + '）',
                groupGr.isValidField(group.groupBy[0].groupByField),
                true,
            )
        }

        // 絞込条件が実行可能である（構文が正しい）
        var filterGr = new GlideRecord(ds.tableOrViewName)
        filterGr.addEncodedQuery(ds.filterQuery || '')
        filterGr.setLimit(1)
        filterGr.query()
        checkTrue(titled + ': 絞込条件が実行できる', filterGr.getRowCount() >= 0)

        // タブ内で位置が重複しない
        if (!byCanvas[w.canvas]) {
            byCanvas[w.canvas] = {}
        }
        var posKey = w.x + ',' + w.y
        if (byCanvas[w.canvas][posKey]) {
            duplicatePosition = true
        }
        byCanvas[w.canvas][posKey] = w.sys_id
    }

    // 縦棒3件＋ドーナツ3件
    check('グラフ系ウィジェット数', groupedCount, 6)
    check('タブ内で位置が重複していない', duplicatePosition, false)

    var canvasCount = 0
    for (var c in byCanvas) {
        canvasCount++
        var positions = 0
        for (var p in byCanvas[c]) {
            positions++
        }
        check('タブごとのウィジェット数', positions, 6)
    }
    check('ウィジェットが配置されているタブ数', canvasCount, 3)

    stepResult.setOutputMessage('SC-15 のウィジェット構成を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
