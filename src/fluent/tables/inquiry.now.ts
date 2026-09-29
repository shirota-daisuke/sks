/**
 * T12 問合せ（テーブル定義書 成果物No.9）
 *
 * 設計書物理名 x_gap_inquiry → 本スコープ x_dent2_dentsusoke_inquiry
 * 設計書では「Task 拡張、または新規カスタムテーブル」の二案。本実装は新規カスタムテーブルを採用する
 * （Task 継承による不要フィールド・ワークフロー連動を避け、ポータル要件に必要な項目のみを持たせる）。
 */
import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, DateTimeColumn, MultiLineTextColumn, ReferenceColumn } from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_inquiry = Table({
    name: 'x_dent2_dentsusoke_inquiry',
    label: '問合せ',
    display: 'u_subject',
    audit: true,
    schema: {
        u_subject: StringColumn({
            label: '件名',
            maxLength: 200,
            mandatory: true,
        }),
        u_business_entity: ReferenceColumn({
            label: '事業者',
            referenceTable: 'x_dent2_dentsusoke_entity',
            mandatory: true,
        }),
        u_created_by_applicant: ReferenceColumn({
            label: '起票者',
            referenceTable: 'x_dent2_dentsusoke_user',
            mandatory: true,
        }),
        u_description: MultiLineTextColumn({
            label: '本文',
            maxLength: 2000,
            mandatory: true,
        }),
        u_state: ChoiceColumn({
            label: '状態',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            default: 'open',
            choices: {
                open: '未回答',
                answered: '回答済',
            },
        }),
        u_assigned_staff: ReferenceColumn({
            label: '対応者',
            referenceTable: 'sys_user',
        }),
        /**
         * 回答本文。テーブル定義書に未定義の追加項目。
         *
         * テーブル定義書 T12 の概要は「返信本文は ServiceNow 標準の追加コメント（sys_journal_field）を
         * 利用する想定とし、専用の返信テーブルは設けない」としているが、
         *   ・Journal 型は ServiceNow Fluent の Table API がサポートする列型に含まれない
         *   ・sys_journal_field は Task 系テーブル等が持つ journal 列に紐づく仕組みで、
         *     journal 列のない新規カスタムテーブルには書き込めない
         * ため、回答本文を保持する列を用意する。
         *
         * TODO(SC-10 ⑥確認事項): 問合せへの追記（やり取りの継続）の可否が未確定。
         *   現状は「1問合せ＝1回答」の単一回答モデル。複数往復を認める場合は
         *   Task 継承（comments／work_notes を利用）または返信テーブルの追加が必要となる。
         * TODO(要レビュー): テーブル定義書 T12 への項目追加、または Task 継承への方針変更を提案する。
         */
        u_reply_body: MultiLineTextColumn({
            label: '回答本文',
            maxLength: 2000,
        }),
        u_received_on: DateTimeColumn({
            label: '受付日時',
            mandatory: true,
            /**
             * ポータルからの起票（問合せ作成処理：処理No.46）では作成時刻を明示的に設定するが、
             * SC-14 で事務局が代理起票する場合に必須項目を手入力させないよう既定値を持たせる。
             * 未設定のまま登録された場合の補完はビジネスルールでも行う
             * （src/fluent/business-rules/inquiry-rules.now.ts）。
             *
             * gs.nowDateTime() は名前付きスコープでは使用できない。
             * 当初 javascript:gs.nowDateTime() を指定していたが、レコード登録時に
             * 「Function nowDateTime is not allowed in scope x_dent2_dentsusoke.
             *   Use GlideDateTime instead」で評価に失敗していた（ATF テストで検出）。
             * プラットフォームが案内する代替（GlideDateTime）を使用する。
             */
            default: 'javascript:new GlideDateTime().getDisplayValue()',
        }),
        u_replied_on: DateTimeColumn({
            label: '回答日時',
            /**
             * 問合せ返信処理（処理No.47）で設定する。手入力させる項目ではないため既定値は持たせない。
             * TODO(SC-14 確認事項): 返信時のメール通知要否が未確定。
             */
        }),
    },
})
