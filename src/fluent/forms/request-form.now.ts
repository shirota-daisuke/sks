import '@servicenow/sdk/global'
import { Form, AnnotationType, default_view } from '@servicenow/sdk/core'

/**
 * ITCOM-07 一次審査：申請詳細・審査（事務局） ①レイアウト構成
 *
 * 一覧（一次審査：要対応ほか）はワークスペース標準のリスト画面
 * （src/fluent/workspaces/staff-workspace/list-menu.now.ts の「申請審査」カテゴリ）、
 * 詳細・審査フォームは本ファイルのフォームレイアウトで構成する。
 *
 * ■ 本定義が必要な理由
 * T03 は項目数が多く（テーブル定義書の項目に加えて ITCOM-01〜09 の実装で追加した項目がある）、
 * レイアウトを定義しないと審査に必要な項目が既定の並びの中に埋もれる。
 * とくに ③の3アクションはフォームの入力値を読むため、
 * 入力欄が画面に無いと実行しても必ず失敗する
 * （SC-11 で同じ問題が起きた経緯：src/fluent/forms/user-form.now.ts のコメント参照）。
 *   「不備修正を依頼する」… u_defect_note／u_defect_due_on
 *   「不採択にする」      … u_reject_reason_code／u_reject_reason
 *   「一次審査を完了する」… u_review_note（任意）
 *
 * ■ ビューの選択
 * ワークスペースのレコードページは view プロパティ「workspace-<sys_ux_app_config の sys_id>」を
 * 参照するが、この名前は sys_id を含むため直接指定するとトンマナ 3.4.1「sys_id のハードコード禁止」に反する。
 * 当該ビューにフォームレイアウトが無い場合はプラットフォームが Default view のレイアウトへ
 * フォールバックするため、Default view に対して定義する（SC-11／SC-13／SC-14 と同じ方針）。
 *
 * ■ セクション構成
 * 画面イメージ ITCOM-07 の左カラム（申請内容・対象経費・審査チェック）と
 * 右カラム（補助金額の判定・添付書類・処理履歴）に対応させる。
 *   申請内容     … 識別・事業者・申請区分・売上増加率・提出日時
 *   補助金額     … 対象経費合計・補助上限額・補助率・補助金額（いずれも参照）
 *   一次審査     … 担当者・期限・判定・審査理由・審査者・審査日時
 *   不備確認依頼 … ③「不備修正を依頼する」の入力欄と事業者からの回答
 *   不採択       … ③「不採択にする」の入力欄
 *   採択判定     … ITCOM-09 で使用する項目（本スライスでは参照のみ）
 *
 * 対象経費の明細・提出書類・処理履歴は関連リストで参照する
 * （いずれも T03 への参照 u_request を持つ子テーブル）。
 * TODO(要レビュー): 関連リストの表示は Fluent の Form API では定義できないため、
 *   ワークスペースのレコードページ設定で追加する必要がある。
 *
 * ■ 審査チェックリストについて
 * 画面イメージには6項目のチェックリストがあるが、チェック項目とその保存先は未確定であり
 * 現時点では保持する仕組みが無い。
 * 自動判定できる内容（専門家経費の日額上限違反・必須書類の充足・補助金額の再計算）は
 * ApplicationExpenseUtil／ApplicationDocumentUtil が判定しており、
 * 提出時に条件を満たしていないと提出できないため、審査時に再掲していない。
 * TODO(要確認): 審査の観点・チェック項目が未確定。確定したら専用テーブルまたは列の追加が必要。
 */
Form({
    table: 'x_dent2_dentsusoke_request',
    view: default_view,
    sections: [
        {
            caption: '申請内容',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        {
                            // ③の各アクションの実行条件と入力手順を明示する
                            type: 'annotation',
                            annotationId: Now.ID['annotation_application_review_flow'],
                            // text は文字列リテラルで指定する（文字列結合等の式は Fluent がビルド時に評価できない）
                            text: 'まず「自分が審査を担当する」を実行してください（受付済→一次審査中、不備修正回答あり→再審査中へ遷移し、審査担当者が設定されます）。一次審査の判定3ボタンは一次審査中・再審査中の場合のみ実行できます。「不備修正を依頼する」は「不備確認依頼」セクションの不備内容を入力してから実行してください。入力した内容は申請者へのメールにそのまま記載され、申請の不備修正画面へのリンクが送られます。申請者が修正画面を開くとステータスが「不備修正中」に、再提出すると「不備修正回答あり」になります。「不採択にする」は「不採択」セクションの理由区分と通知文を入力してから実行してください。一次審査が完了したら「信用調査を実施する」または「信用調査を免除する」で要否を判定します。実施を選ぶと調査レコードが作成されるので、関連リストから開いて外部機関への依頼・結果の取込を行います。信用調査が済んだら「採択として確定する」「不採択として確定する」「一次審査へ差し戻す」で確定します（確定操作は事務局管理者のみ）。不採択は終端状態のため戻せません。',
                            isPlainText: true,
                            annotationType: AnnotationType.Info_Box_Blue,
                        },
                    ],
                },
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_application_number', type: 'table_field' },
                        { field: 'u_business_entity', type: 'table_field' },
                        { field: 'u_applicant_user', type: 'table_field' },
                        { field: 'u_organization_type', type: 'table_field' },
                        { field: 'u_employee_count_category', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'u_application_status', type: 'table_field' },
                        { field: 'u_submitted_on', type: 'table_field' },
                        { field: 'u_sales_increase_target_month', type: 'table_field' },
                        { field: 'u_sales_increase_rate', type: 'table_field' },
                        { field: 'u_special_measure_flag', type: 'table_field' },
                    ],
                },
            ],
        },
        {
            caption: '補助金額',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        {
                            type: 'annotation',
                            annotationId: Now.ID['annotation_application_review_amount'],
                            text: '対象経費合計は対象経費明細の合計であり、明細の追加・更新・削除のたびに再計算されます。補助上限額・補助率・補助金額は補助上限額マスタと補助率マスタから自動判定した値です。補助率は分子・分母の整数で計算しており、補助率（小数）は精度2桁のため参照用です（算出には使用しません）。',
                            isPlainText: true,
                            annotationType: AnnotationType.Info_Box_Blue,
                        },
                    ],
                },
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_total_expense_amount', type: 'table_field' },
                        { field: 'u_subsidy_cap_amount', type: 'table_field' },
                        { field: 'u_subsidy_amount', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'u_subsidy_rate_numerator', type: 'table_field' },
                        { field: 'u_subsidy_rate_denominator', type: 'table_field' },
                        { field: 'u_subsidy_rate', type: 'table_field' },
                    ],
                },
            ],
        },
        {
            caption: '一次審査',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_review_assigned_to', type: 'table_field' },
                        { field: 'u_review_result', type: 'table_field' },
                        { field: 'u_reviewed_by', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'u_review_due_on', type: 'table_field' },
                        { field: 'u_reviewed_on', type: 'table_field' },
                    ],
                },
                {
                    // 複数行テキストは全幅が必要（form-layout-guide「Never put text areas in two-column blocks」）
                    layout: 'one-column',
                    elements: [{ field: 'u_review_note', type: 'table_field' }],
                },
            ],
        },
        {
            caption: '不備確認依頼',
            content: [
                {
                    layout: 'one-column',
                    elements: [{ field: 'u_defect_note', type: 'table_field' }],
                },
                {
                    layout: 'one-column',
                    elements: [{ field: 'u_defect_due_on', type: 'table_field' }],
                },
                {
                    // 事業者からの回答（ITCOM-05 で入力される）
                    layout: 'one-column',
                    elements: [{ field: 'u_defect_reply', type: 'table_field' }],
                },
            ],
        },
        {
            caption: '不採択',
            content: [
                {
                    layout: 'one-column',
                    elements: [{ field: 'u_reject_reason_code', type: 'table_field' }],
                },
                {
                    layout: 'one-column',
                    elements: [{ field: 'u_reject_reason', type: 'table_field' }],
                },
            ],
        },
        {
            /**
             * ITCOM-08 信用調査の要否判定の結果。
             * 調査そのものの依頼・結果は調査レコード（x_dent2_dentsusoke_credit）側で扱う。
             */
            caption: '信用調査',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [{ field: 'u_credit_required', type: 'table_field' }],
                    rightElements: [{ field: 'u_credit_judged_on', type: 'table_field' }],
                },
            ],
        },
        {
            /**
             * ITCOM-09 採択判定。
             *
             * 「採択として確定する」は査定後の対象経費と判定理由の入力値を読む。
             * 採択番号・交付決定額・確定日時・確定者は確定時に自動設定されるため、
             * 手入力ではなく結果の確認用として配置する。
             */
            caption: '採択判定',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_approved_expense_amount', type: 'table_field' },
                        { field: 'u_award_amount', type: 'table_field' },
                        { field: 'u_award_number', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'u_decided_on', type: 'table_field' },
                        { field: 'u_decided_by', type: 'table_field' },
                        { field: 'u_withdrawal_flag', type: 'table_field' },
                    ],
                },
                {
                    // 複数行テキストは全幅が必要（form-layout-guide の指針）
                    layout: 'one-column',
                    elements: [{ field: 'u_decision_note', type: 'table_field' }],
                },
            ],
        },
    ],
})
