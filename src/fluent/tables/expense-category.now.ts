/**
 * 対象経費区分マスタ（SC-16 マスタメンテナンス）
 *
 * 設計書物理名 x_gap_expense_category → 本スコープ x_dent2_dentsusoke_expense
 *
 * ■ 用途
 * 対象経費登録処理（処理No.18）で事業者が経費明細を登録する際の区分の選択肢、
 * および審査時に事務局が対象経費の妥当性を判断する際の基準を保持する。
 * 経費明細を保持するテーブルは ITCOM 主担当の申請機能側の範囲であり、
 * 本マスタは参照元として用意する。T03 申請の u_total_expense_amount は
 * 経費明細の合計金額を保持する項目であり、本マスタを直接参照しない。
 *
 * ■ 項目構成の根拠（要レビュー）
 * テーブル定義書に本マスタの定義が無いため、以下から項目を構成した。
 *   ・処理No.18「対象経費登録処理」が区分ごとの経費登録を前提としていること
 *   ・SC-10 の問合せデモデータが「経費区分の判定について／クラウドサービス利用費の対象範囲」
 *     という内容であり、区分ごとに対象範囲の説明が必要とされていること
 * TODO(要確認): 区分ごとの上限（経費総額に対する割合上限・金額上限）の有無が未確定。
 *   広告宣伝費のように「対象経費総額の1/2以内」といった制約がある場合は
 *   上限割合・上限金額の項目を追加する。
 * TODO(要確認): 区分ごとに補助率が異なる場合は補助率マスタへの参照を持たせる。
 *
 * ■ 専門家経費との関係
 * 「専門家経費」区分には日額上限が別途定められるため、専門家経費日額上限マスタ
 * （x_dent2_dentsusoke_expert_fee）を別テーブルとして持つ。
 * 本マスタの u_has_daily_cap で、日額上限の適用対象である区分を識別する。
 */
import '@servicenow/sdk/global'
import { Table, StringColumn, MultiLineTextColumn, IntegerColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_expense = Table({
    name: 'x_dent2_dentsusoke_expense',
    label: '対象経費区分マスタ',
    display: 'u_name',
    audit: true,
    schema: {
        u_code: StringColumn({
            label: '経費区分コード',
            maxLength: 40,
            mandatory: true,
            unique: true,
            // 経費明細テーブル（申請機能側）からの引き当てキー
        }),
        u_name: StringColumn({
            label: '経費区分名',
            maxLength: 100,
            mandatory: true,
        }),
        u_description: MultiLineTextColumn({
            label: '対象範囲',
            maxLength: 2000,
            // 問合せの多い区分の対象範囲を記載する（SC-10 の問合せ内容を減らす目的）
        }),
        u_has_daily_cap: BooleanColumn({
            label: '日額上限あり',
            default: false,
            // true の区分は専門家経費日額上限マスタの適用対象（現時点は「専門家経費」のみ）
        }),
        u_order: IntegerColumn({
            label: '表示順',
            mandatory: true,
            default: 100,
        }),
        u_active: BooleanColumn({
            label: '有効',
            default: true,
            // 過去の申請の経費明細が参照しているため、物理削除せず無効化で運用する
        }),
    },
})
