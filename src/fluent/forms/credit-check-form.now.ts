import '@servicenow/sdk/global'
import { Form, AnnotationType, default_view } from '@servicenow/sdk/core'

/**
 * ITCOM-08 信用調査：外部調査・結果取込（事務局） ①レイアウト構成
 *
 * 画面イメージ ITCOM-08 のうち、②外部機関への調査依頼と③調査結果の取込を
 * 調査レコード（x_dent2_dentsusoke_credit）のフォームで構成する。
 * ①要否判定は申請（T03）のフォームで行う（src/fluent/forms/request-form.now.ts）。
 *
 * ■ 画面を2つに分けている理由
 * 画面イメージは①〜③を1画面に並べているが、調査の依頼内容・結果は
 * 再調査の履歴を残すため申請の子テーブルへ1対多で保持している。
 * UI Action はフォームの入力値を読むため、依頼内容・結果の入力欄は
 * 調査レコードのフォームに置く必要がある
 * （申請のフォームからは子レコードの項目を読めない）。
 * 申請側からは関連リストで調査レコードへ遷移する。
 *
 * ■ 本定義が必要な理由
 * ③の各アクションはフォームの入力値を読むため、入力欄が画面に無いと必ず失敗する。
 *   「外部機関へ依頼する」  … u_agency／u_due_on
 *   「調査結果を取り込む」  … u_result／u_note
 *   「調査を取り消す」      … u_note（取消理由として記録する）
 *
 * ■ ビューの選択
 * ワークスペースのレコードページは view プロパティ「workspace-<sys_ux_app_config の sys_id>」を
 * 参照するが、この名前は sys_id を含むため直接指定するとトンマナ 3.4.1 に反する。
 * 当該ビューにレイアウトが無い場合は Default view へフォールバックするため、
 * Default view に対して定義する（SC-11／ITCOM-07 と同じ方針）。
 *
 * ■ 依頼書・結果ファイル
 * 外部審査員には ServiceNow のロール・アカウントを付与しない方針（A17）のため、
 * 依頼書・結果ファイルの授受はシステム外で行い、ファイルは本レコードへ添付する。
 */
Form({
    table: 'x_dent2_dentsusoke_credit',
    view: default_view,
    sections: [
        {
            caption: '信用調査',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        {
                            type: 'annotation',
                            annotationId: Now.ID['annotation_credit_check_flow'],
                            // text は文字列リテラルで指定する（文字列結合等の式は Fluent がビルド時に評価できない）
                            text: '「外部機関へ依頼する」は調査機関を入力してから実行してください（回答予定日が未入力の場合は依頼日から既定日数で設定されます）。依頼書ファイルは本レコードへ添付してください。外部機関からの回答が遅れている場合は「調査を督促する」を実行すると、申請のステータスが「調査結果取込待ち」になり督促した記録が残ります。「調査結果を取り込む」は調査結果を選択してから実行してください（受領した結果ファイルは本レコードへ添付してください）。依頼の誤りや調査機関の変更でやり直す場合は「事務局メモ」に理由を入力して「調査を取り消す」を実行してください（申請は要否判定へ戻ります）。外部機関との授受はいずれもシステム外で行います。',
                            isPlainText: true,
                            annotationType: AnnotationType.Info_Box_Blue,
                        },
                    ],
                },
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_request', type: 'table_field' },
                        { field: 'u_sequence', type: 'table_field' },
                        { field: 'u_agency', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'u_state', type: 'table_field' },
                        { field: 'u_requested_on', type: 'table_field' },
                        { field: 'u_due_on', type: 'table_field' },
                    ],
                },
            ],
        },
        {
            caption: '調査結果',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_result', type: 'table_field' },
                        { field: 'u_received_on', type: 'table_field' },
                    ],
                    rightElements: [{ field: 'u_updated_by_staff', type: 'table_field' }],
                },
                {
                    /**
                     * 複数行テキストは全幅が必要
                     * （form-layout-guide「Never put text areas in two-column blocks」）。
                     * 事務局メモは調査結果の記録と取消理由の両方に使う。
                     */
                    layout: 'one-column',
                    elements: [{ field: 'u_note', type: 'table_field' }],
                },
            ],
        },
    ],
})
