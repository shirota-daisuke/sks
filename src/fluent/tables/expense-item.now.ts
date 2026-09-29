/**
 * 対象経費明細（ITCOM-02／処理No.18 対象経費登録）
 *
 * テーブル定義書に未定義の追加テーブル。
 * T03 申請には u_total_expense_amount（対象経費合計金額）の1列しか無く、
 * 明細（区分・内容・金額・日数）を保持する先が存在しなかったため追加する。
 * 対象経費区分マスタ（x_dent2_dentsusoke_expense）と
 * 専門家経費日額上限マスタ（x_dent2_dentsusoke_expert_fee）は参照元として既に存在する。
 *
 * TODO(要レビュー): テーブル定義書への追加を提案する。
 *
 * ■ 物理名
 * ServiceNow のテーブル物理名は最大30文字。スコープ接頭辞 x_dent2_dentsusoke_ が19文字のため
 * 接尾辞は11文字以内（exp_item は8文字）。T01／T12 と同じ短縮方針。
 *
 * ■ 合計金額との関係
 * 明細の合計は保存時に T03 の u_total_expense_amount へ書き戻す
 * （ApplicationExpenseUtil.recalcTotal）。
 * 既存の SC-05／SC-07・帳票・ダッシュボードが u_total_expense_amount を参照しているため、
 * 合計の持ち方は変えずに明細を追加する構成とする。
 */
import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, ReferenceColumn } from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_exp_item = Table({
    name: 'x_dent2_dentsusoke_exp_item',
    label: '対象経費明細',
    display: 'u_description',
    audit: true,
    schema: {
        u_request: ReferenceColumn({
            label: '申請',
            referenceTable: 'x_dent2_dentsusoke_request',
            mandatory: true,
        }),

        /**
         * 経費区分。対象経費区分マスタへの参照。
         * マスタ側の u_has_daily_cap が true の区分は日数の入力が必要になる。
         */
        u_expense_category: ReferenceColumn({
            label: '経費区分',
            referenceTable: 'x_dent2_dentsusoke_expense',
            mandatory: true,
        }),

        u_description: StringColumn({
            label: '内容',
            maxLength: 200,
            mandatory: true,
        }),

        u_amount: IntegerColumn({
            label: '金額（円）',
            mandatory: true,
            default: 0,
        }),

        /**
         * 日数。日額上限ありの区分（専門家経費等）でのみ入力する。
         * 日額 = u_amount ÷ u_days が専門家経費日額上限マスタの上限内であることを検証する。
         * TODO(要確認): 日額上限の判定単位（1人1日あたりか、延べ日数か）が未確定。
         */
        u_days: IntegerColumn({
            label: '日数',
        }),

        /**
         * 専門家区分。経費区分が日額上限ありの場合に、どの上限を適用するかを決める。
         * TODO(要確認): 専門家区分を申請者が選ぶのか、事務局が審査で判断するのかが未確定。
         */
        u_expert_fee: ReferenceColumn({
            label: '専門家区分',
            referenceTable: 'x_dent2_dentsusoke_expert_fee',
        }),

        u_note: StringColumn({
            label: '備考',
            maxLength: 500,
        }),

        u_order: IntegerColumn({
            label: '表示順',
            mandatory: true,
            default: 100,
        }),
    },
    index: [{ name: 'idx_exp_item_request', unique: false, element: ['u_request'] }],
})
