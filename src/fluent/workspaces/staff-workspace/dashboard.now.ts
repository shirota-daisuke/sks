import '@servicenow/sdk/global'
import { Dashboard } from '@servicenow/sdk/core'
import { staffWorkspace } from './workspace.now'

/**
 * SC-15 ダッシュボード画面（事務局）
 *
 * 事務局ワークスペースのランディングページ。
 * 題材システム構成図（研究開発計画書 p2／p4）で事務局ユーザの入口に置かれている
 * 「ダッシュボード」に対応し、申請件数・審査進捗の可視化を担当する。
 * ワークスペースの動作にもダッシュボードが必須である
 * （creating-workspaces-guide.md Step 4「The dashboard is mandatory」）。
 *
 * ■ 指標の選定根拠（要レビュー）
 * 画面設計書 SC-15 ⑥確認事項で「表示する KPI・進捗指標」は未確定とされている。
 * そのため本実装では、テーブル定義書と業務フローで既に確定している値のみから
 * 「事務局が対応の要否を判断できること」を基準に指標を選定した。
 *   ・件数の内訳は、業務フローのステータス一覧に定義済みの値でのみ集計する
 *   ・滞留・漏れの検知に使える指標（要対応件数・対応者未設定件数）を優先する
 *   ・平均処理日数・SLA 達成率のような、算出定義が未確定の指標は置かない
 * TODO(SC-15 ⑥): KPI・進捗指標の確定後に本構成を見直す。特に審査のリードタイム系指標は
 *   起点・終点となる日時項目（T03 の各審査工程の完了日時）がテーブル定義書に無いため、
 *   採用する場合は項目追加が前提となる。
 *
 * ■ タブ構成（事務局の担当業務の単位で分ける）
 *   申請状況         … SC-15 本体（申請件数・審査進捗）
 *   ユーザ登録審査   … SC-11 の対応状況
 *   お知らせ・問合せ … SC-13／SC-14 の対応状況
 *
 * ■ componentProps に必要なプロパティ（重要）
 * SDK 公式ドキュメント（creating-workspaces-guide.md「Dashboard Example」）の例は
 * dataSources に label／sourceType／tableOrViewName／filterQuery／id の5項目しか
 * 記載していないが、この5項目だけではウィジェットが描画されない（当インスタンスで確認済み）。
 * レポート基盤は下記を必要とするため、OOTB のウィジェットと同じ形にそろえる。
 *   dataSources[]
 *     dataCategories  … そのデータソースが使える可視化の種類。
 *                        Group 系（vertical-bar／donut）は 'group' を含まないと採用されない
 *     allowRealTime   … リアルタイム更新の可否
 *     isDatabaseView  … データベースビュー参照かどうか
 *     preferredVisualizations … データソースの推奨可視化。
 *                        ウィジェット自身の種別ではなく、稼働中ウィジェット37件
 *                        （vertical-bar／donut／single-score 等9種類）すべてで
 *                        single-score のコンポーネント sys_id が入っている。
 *                        ここへウィジェット種別の sys_id を入れるとグラフが描画されない。
 *   metrics[]
 *     numberFormat    … 数値の書式指定
 *   groupBy[]
 *     numberOfGroupsBasedOn … グループ数上限の適用単位
 *     groupBy[].isChoice    … 選択リスト項目かどうか（true でラベルへ変換される）
 *     groupBy[].isRange／isPaBucket … 範囲・PA バケットによるグループ化かどうか
 *
 * 当インスタンスの稼働中ウィジェット（表テーブル参照）39件のうち38件が
 * dataCategories／allowRealTime／isDatabaseView を保持していることを根拠としている。
 *   now-sdk query par_dashboard_widget -q 'component_propsLIKEsourceType' -f 'component_props' -o json
 *
 * dataSources[].id／metrics[].id は素のキー（data_source_1／metric_1）で動作する。
 * 稼働中ウィジェットは base64（'table' ＋ テーブル名 ＋ タイムスタンプ）を使っているが、
 * これはダッシュボードエディタが一意キーを生成した結果であり、
 * 値を解釈しているわけではない（base64 化しても描画は改善しなかった）。
 * ウィジェット内で dataSources[].id と metrics[].dataSource／groupBy[].dataSource が
 * 一致していれば足りる。
 *
 * Fluent ファイルではオブジェクトのスプレッド構文が使えない
 * （ビルドエラー TS305「Node kind "SpreadAssignment" is not allowed in Fluent files.」）ため、
 * 共通プロパティを定数へ切り出さず各ウィジェットへ展開している。
 *
 * ■ 使用するコンポーネント
 * 件数は single-score、内訳は vertical-bar と donut のみを使用する
 * （creating-workspaces-guide.md「Data Type Requirements」
 *   Simple 系＝dataSources ＋ metrics／Group 系＝それに groupBy を追加）。
 * 推移系（line／area）は起点となる日時項目が未確定のため採用しない。
 *
 * ■ グリッド
 * 横幅48単位。件数は幅12を4枚並べ、内訳グラフは幅24を2枚並べる。
 */
Dashboard({
    $id: Now.ID['sks_staff_dashboard'],
    name: 'SKS 事務局ダッシュボード',
    description: '申請件数・審査進捗、ユーザ登録審査、お知らせ・問合せの対応状況（SC-15）',
    tabs: [
        // -------------------------------------------------------------------
        // 申請状況（SC-15 本体：申請件数・審査進捗）
        //
        // 申請ステータスは業務フロー「申請ステータス一覧」の事務局用ステータス（T03 の16値）。
        // 「申請入力中」は事業者が作成中で事務局へ到達していないため、件数からは除外する。
        //
        // 申請機能（処理No.16 以降）は ITCOM 主担当の別スライスであり、
        // 現時点のインスタンスには申請データがほとんど無い。件数が0でも構成上の誤りではない。
        // -------------------------------------------------------------------
        {
            $id: Now.ID['sks_dashboard_tab_requests'],
            name: '申請状況',
            widgets: [
                {
                    // 事務局へ到達した申請の総数（申請入力中を除く）
                    $id: Now.ID['sks_widget_request_submitted_count'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                label: '申請',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_request',
                                filterQuery: 'u_application_status!=input',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '受付済 申請件数',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                    },
                    height: 14,
                    width: 12,
                    position: { x: 0, y: 0 },
                },
                {
                    /**
                     * 審査が進行中の申請（ApplicationStatusUtil.STATUS_TONES の progress 区分）。
                     * 事務局側で処理が動いている件数であり、要対応・完了と重複しない。
                     */
                    $id: Now.ID['sks_widget_request_reviewing_count'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                label: '申請',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_request',
                                filterQuery:
                                    'u_application_statusINaccepted,first_review,defect_answered,re_review,credit_judging,ext_preparing,ext_reviewing,result_waiting,result_checking',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '審査中',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                    },
                    height: 14,
                    width: 12,
                    position: { x: 12, y: 0 },
                },
                {
                    /**
                     * 事業者側の対応を待っている申請（error 区分のうち不備系）。
                     * 滞留の検知に使う指標のため、不採択・取下げ（終端状態）は含めない。
                     */
                    $id: Now.ID['sks_widget_request_defect_count'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                label: '申請',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_request',
                                filterQuery: 'u_application_statusINdefect_request,defect_fixing',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '不備対応中',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                    },
                    height: 14,
                    width: 12,
                    position: { x: 24, y: 0 },
                },
                {
                    // 申請審査完了（終端状態のうち採択判定まで到達したもの）
                    $id: Now.ID['sks_widget_request_done_count'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                label: '申請',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_request',
                                filterQuery: 'u_application_status=review_done',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '申請審査完了',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                    },
                    height: 14,
                    width: 12,
                    position: { x: 36, y: 0 },
                },
                {
                    /**
                     * 審査進捗の内訳（申請ステータス管理処理：処理No.22 のステータス分布）。
                     * T03 の選択肢は16値あり「申請入力中」を除くと15値のため、
                     * maxNumberOfGroups を16として「その他」へまとめられないようにする。
                     */
                    $id: Now.ID['sks_widget_request_status_breakdown'],
                    component: 'vertical-bar',
                    componentProps: {
                        dataSources: [
                            {
                                label: '申請',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_request',
                                filterQuery: 'u_application_status!=input',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '申請ステータス別（受付済）',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                        groupBy: [
                            {
                                groupBy: [
                                    {
                                        dataSource: 'data_source_1',
                                        groupByField: 'u_application_status',
                                        isRange: false,
                                        isChoice: true,
                                        isPaBucket: false,
                                    },
                                ],
                                maxNumberOfGroups: 16,
                                numberOfGroupsBasedOn: 'NO_OF_GROUP_BASED_ON_PER_METRIC',
                                showOthers: false,
                            },
                        ],
                        sortBy: 'value',
                    },
                    height: 16,
                    width: 24,
                    position: { x: 0, y: 14 },
                },
                {
                    /**
                     * 従業員数区分別の内訳。
                     * 公募要領「2.(1)基本概要」の補助上限表の6区分であり、
                     * 補助上限額の見込みを把握するために事務局が参照する区分。
                     */
                    $id: Now.ID['sks_widget_request_employee_breakdown'],
                    component: 'donut',
                    componentProps: {
                        dataSources: [
                            {
                                label: '申請',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_request',
                                filterQuery: 'u_application_status!=input',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '従業員数区分別（受付済）',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                        groupBy: [
                            {
                                groupBy: [
                                    {
                                        dataSource: 'data_source_1',
                                        groupByField: 'u_employee_count_category',
                                        isRange: false,
                                        isChoice: true,
                                        isPaBucket: false,
                                    },
                                ],
                                maxNumberOfGroups: 6,
                                numberOfGroupsBasedOn: 'NO_OF_GROUP_BASED_ON_PER_METRIC',
                                showOthers: false,
                            },
                        ],
                        sortBy: 'value',
                    },
                    height: 16,
                    width: 24,
                    position: { x: 24, y: 14 },
                },
            ],
        },
        // -------------------------------------------------------------------
        // ユーザ登録審査（SC-11 の対応状況）
        //
        // ユーザ登録ステータスは業務フロー「ユーザー登録ステータス一覧」の事務局用ステータス。
        // 絞込条件は SC-11 の一覧（list-menu.now.ts）と一致させ、
        // ダッシュボードの件数をクリックした先の一覧と件数がずれないようにする。
        // -------------------------------------------------------------------
        {
            $id: Now.ID['sks_dashboard_tab_review'],
            name: 'ユーザ登録審査',
            widgets: [
                {
                    // 承認・却下・不備修正の依頼を実行できる件数
                    $id: Now.ID['sks_widget_waiting_count'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                label: '事業者ユーザ',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_user',
                                filterQuery: 'u_registration_status=review',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '登録申請審査中',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                    },
                    height: 14,
                    width: 12,
                    position: { x: 0, y: 0 },
                },
                {
                    // 事業者側の修正待ち・修正中の件数
                    $id: Now.ID['sks_widget_defect_count'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                label: '事業者ユーザ',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_user',
                                filterQuery: 'u_registration_statusINdefect_request,defect_fixing',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '登録不備対応中',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                    },
                    height: 14,
                    width: 12,
                    position: { x: 12, y: 0 },
                },
                {
                    /**
                     * 重複チェック（処理No.5）で曖昧一致となり事務局確認が必要な件数。
                     * Q04（決定済）「確定一致は登録不可、曖昧一致のみ事務局確認」に対応する。
                     * 絞込条件は SC-11「重複あり（要確認）」の一覧と同一。
                     */
                    $id: Now.ID['sks_widget_review_duplicate_count'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                label: '事業者ユーザ',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_user',
                                filterQuery: 'u_duplicate_check_result=duplicate_review^u_registration_status=review',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '重複あり（要確認）',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                    },
                    height: 14,
                    width: 12,
                    position: { x: 24, y: 0 },
                },
                {
                    // 審査を通過した事業者ユーザの累計（登録済）
                    $id: Now.ID['sks_widget_registered_count'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                label: '事業者ユーザ',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_user',
                                filterQuery: 'u_registration_status=registered',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '登録済（累計）',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                    },
                    height: 14,
                    width: 12,
                    position: { x: 36, y: 0 },
                },
                {
                    // ユーザ登録ステータス別の件数（処理No.8 のステータス分布）
                    $id: Now.ID['sks_widget_status_breakdown'],
                    component: 'vertical-bar',
                    componentProps: {
                        dataSources: [
                            {
                                label: '事業者ユーザ',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_user',
                                filterQuery: 'u_registration_status!=unregistered',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: 'ユーザ登録ステータス別',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                        groupBy: [
                            {
                                groupBy: [
                                    {
                                        dataSource: 'data_source_1',
                                        groupByField: 'u_registration_status',
                                        isRange: false,
                                        isChoice: true,
                                        isPaBucket: false,
                                    },
                                ],
                                maxNumberOfGroups: 10,
                                numberOfGroupsBasedOn: 'NO_OF_GROUP_BASED_ON_PER_METRIC',
                                showOthers: false,
                            },
                        ],
                        sortBy: 'value',
                    },
                    height: 16,
                    width: 24,
                    position: { x: 0, y: 14 },
                },
                {
                    /**
                     * 重複チェック結果別の内訳（処理No.5 の実行結果の分布）。
                     * 「未実施」が滞留していないか、確定一致がどの程度発生しているかを把握する。
                     */
                    $id: Now.ID['sks_widget_duplicate_breakdown'],
                    component: 'donut',
                    componentProps: {
                        dataSources: [
                            {
                                label: '事業者ユーザ',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_user',
                                filterQuery: 'u_registration_status!=unregistered',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '重複チェック結果別',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                        groupBy: [
                            {
                                groupBy: [
                                    {
                                        dataSource: 'data_source_1',
                                        groupByField: 'u_duplicate_check_result',
                                        isRange: false,
                                        isChoice: true,
                                        isPaBucket: false,
                                    },
                                ],
                                maxNumberOfGroups: 4,
                                numberOfGroupsBasedOn: 'NO_OF_GROUP_BASED_ON_PER_METRIC',
                                showOthers: false,
                            },
                        ],
                        sortBy: 'value',
                    },
                    height: 16,
                    width: 24,
                    position: { x: 24, y: 14 },
                },
            ],
        },
        // -------------------------------------------------------------------
        // お知らせ・問合せ（SC-13／SC-14 の対応状況）
        //
        // お知らせの件数は公開状態のみで集計する。公開期間との突合（実際に事業者へ
        // 表示されているか）は日付項目に対する相対日付の比較が必要で、
        // 境界日の判定が保証されないため行わない（SC-13 の一覧と同じ方針）。
        // -------------------------------------------------------------------
        {
            $id: Now.ID['sks_dashboard_tab_communication'],
            name: 'お知らせ・問合せ',
            widgets: [
                {
                    // 公開状態＝公開のお知らせ（公開期間内かどうかは SC-13 の一覧で確認する）
                    $id: Now.ID['sks_widget_notice_published_count'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                label: 'お知らせ',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_notice',
                                filterQuery: 'u_publish_status=published',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '公開中のお知らせ',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                    },
                    height: 14,
                    width: 12,
                    position: { x: 0, y: 0 },
                },
                {
                    // 公開待ちのお知らせ（作成途中・取り下げ済み）
                    $id: Now.ID['sks_widget_notice_private_count'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                label: 'お知らせ',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_notice',
                                filterQuery: 'u_publish_status=private',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '非公開のお知らせ',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                    },
                    height: 14,
                    width: 12,
                    position: { x: 12, y: 0 },
                },
                {
                    // 事務局の対応が必要な問合せ（処理No.47 の対象）
                    $id: Now.ID['sks_widget_inquiry_open_count'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                label: '問合せ',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_inquiry',
                                filterQuery: 'u_state=open',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '未回答の問合せ',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                    },
                    height: 14,
                    width: 12,
                    position: { x: 24, y: 0 },
                },
                {
                    /**
                     * 対応者が未設定のまま残っている未回答問合せ（割当漏れの検知）。
                     * SC-14「自分が対応する」が実行されていない件数であり、
                     * 「未回答の問合せ」の内訳として誰も着手していないものを表す。
                     */
                    $id: Now.ID['sks_widget_inquiry_unassigned_count'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                label: '問合せ',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_inquiry',
                                filterQuery: 'u_state=open^u_assigned_staffISEMPTY',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '未回答・対応者未設定',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                    },
                    height: 14,
                    width: 12,
                    position: { x: 36, y: 0 },
                },
                {
                    /**
                     * 対応者別の未回答件数（担当の偏り・滞留の把握）。
                     * 対応者は sys_user への参照項目のため isChoice は false とする。
                     * 対応者未設定は showOthers: true により「その他」へまとめられる。
                     */
                    $id: Now.ID['sks_widget_inquiry_assignee_breakdown'],
                    component: 'vertical-bar',
                    componentProps: {
                        dataSources: [
                            {
                                label: '問合せ',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_inquiry',
                                filterQuery: 'u_state=open',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '未回答の問合せ：対応者別',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                        groupBy: [
                            {
                                groupBy: [
                                    {
                                        dataSource: 'data_source_1',
                                        groupByField: 'u_assigned_staff',
                                        isRange: false,
                                        isChoice: false,
                                        isPaBucket: false,
                                    },
                                ],
                                maxNumberOfGroups: 10,
                                numberOfGroupsBasedOn: 'NO_OF_GROUP_BASED_ON_PER_METRIC',
                                showOthers: true,
                            },
                        ],
                        sortBy: 'value',
                    },
                    height: 16,
                    width: 24,
                    position: { x: 0, y: 14 },
                },
                {
                    /**
                     * 公開中のお知らせの公開範囲別内訳（公開範囲設定処理：処理No.40）。
                     * 法人向け・個人向け・全体向けの掲載バランスを把握する。
                     */
                    $id: Now.ID['sks_widget_notice_scope_breakdown'],
                    component: 'donut',
                    componentProps: {
                        dataSources: [
                            {
                                label: 'お知らせ',
                                sourceType: 'table',
                                tableOrViewName: 'x_dent2_dentsusoke_notice',
                                filterQuery: 'u_publish_status=published',
                                id: 'data_source_1',
                                isDatabaseView: false,
                                allowRealTime: true,
                                dataCategories: ['trend', 'group', 'simple'],
                                preferredVisualizations: ['d24d53f60350de7a652caf3188a46ed2'],
                            },
                        ],
                        headerTitle: '公開中のお知らせ：公開範囲別',
                        metrics: [
                            {
                                dataSource: 'data_source_1',
                                id: 'metric_1',
                                aggregateFunction: 'COUNT',
                                axisId: 'primary',
                                numberFormat: { customFormat: false },
                            },
                        ],
                        groupBy: [
                            {
                                groupBy: [
                                    {
                                        dataSource: 'data_source_1',
                                        groupByField: 'u_visibility_scope',
                                        isRange: false,
                                        isChoice: true,
                                        isPaBucket: false,
                                    },
                                ],
                                maxNumberOfGroups: 3,
                                numberOfGroupsBasedOn: 'NO_OF_GROUP_BASED_ON_PER_METRIC',
                                showOthers: false,
                            },
                        ],
                        sortBy: 'value',
                    },
                    height: 16,
                    width: 24,
                    position: { x: 24, y: 14 },
                },
            ],
        },
    ],
    visibilities: [
        {
            $id: Now.ID['sks_dashboard_visibility'],
            experience: staffWorkspace,
        },
    ],
    /**
     * アクセス制御はワークスペースのルート ACL（now.sks-staff.*：staff／staff_admin／system_admin）で
     * 行うため、ダッシュボード個別の権限は設定しない（workspace.now.ts の Acl を参照）。
     */
    permissions: [],
})
