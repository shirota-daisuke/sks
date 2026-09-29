/**
 * 補助上限額マスタ（SC-16 マスタメンテナンス）
 *
 * 設計書物理名 x_gap_subsidy_cap → 本スコープ x_dent2_dentsusoke_cap
 * （ServiceNow のテーブル物理名は最大30文字。スコープ接頭辞 x_dent2_dentsusoke_ が19文字のため短縮。
 *   T01／T12 と同じ短縮方針）
 *
 * ■ 用途
 * 補助金額自動判定処理（処理No.17）が、申請の従業員数区分と特例措置の該当有無から
 * 補助上限額を決定するための基準表。判定結果は T03 申請の u_subsidy_cap_amount へ保持される
 * （申請機能は ITCOM 主担当の別スライスであり、本マスタは参照元として用意する）。
 *
 * ■ キーの構成根拠
 * 公募要領「2.(1)基本概要」の補助上限表は従業員数区分ごとに定義されており、
 * T03 申請の u_employee_count_category（6区分）がその区分に対応している。
 * また T03 は u_special_measure_flag（特例措置対象フラグ）を持つため、
 * 「従業員数区分 × 特例措置の有無」を一意キーとする。
 *
 * ■ 基準値の根拠（要レビュー）
 * デモ申請データ（従業員数区分 le20＝6～20人、特例なし）の補助上限額が 15,000,000円 であることを
 * 唯一の確定値として、これに整合する上限表を設定した。
 * TODO(要確認): 公募要領の補助上限表の実値が未確認。le20／特例なし以外の11件は
 *   同種の補助金（従業員数区分5段階＋賃上げ特例で上限を引き上げる方式）の一般的な水準から
 *   設定した暫定値であり、公募要領との突合が必要。
 * TODO(要確認): 「個人事業主」区分は補助上限表に独立した行が無い想定のため
 *   「5人以下」と同額を設定している。独立した水準が定められている場合は差し替える。
 * TODO(要確認): 公募回次・年度によって上限額が変わる場合は適用期間（開始日・終了日）が必要になる。
 *   現在は単一の有効な表のみを保持する構成であり、履歴を持たない。
 */
import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, IntegerColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_cap = Table({
    name: 'x_dent2_dentsusoke_cap',
    label: '補助上限額マスタ',
    display: 'u_code',
    audit: true,
    schema: {
        u_code: StringColumn({
            label: 'コード',
            maxLength: 40,
            mandatory: true,
            unique: true,
            // 「従業員数区分」または「従業員数区分_special」。処理No.17 からの引き当てキー
        }),
        u_employee_count_category: ChoiceColumn({
            label: '従業員数区分',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            // T03 申請 u_employee_count_category と同一の選択肢（公募要領 2.(1) 補助上限表の6区分）
            choices: {
                sole_proprietor: '個人事業主',
                le5: '5人以下',
                le20: '6～20人',
                le50: '21～50人',
                le100: '51～100人',
                gt100: '101人以上',
            },
        }),
        u_special_measure_flag: BooleanColumn({
            label: '特例措置対象',
            default: false,
            // T03 申請 u_special_measure_flag に対応。true の行は特例措置該当時の上限額
        }),
        u_cap_amount: IntegerColumn({
            label: '補助上限額（円）',
            mandatory: true,
            // T03 u_subsidy_cap_amount と同じ単位（円）
        }),
        u_order: IntegerColumn({
            label: '表示順',
            mandatory: true,
            default: 100,
        }),
        u_active: BooleanColumn({
            label: '有効',
            default: true,
            // 過去の申請が参照した基準を追えるよう、物理削除せず無効化で運用する
        }),
    },
})
