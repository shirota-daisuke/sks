/**
 * 専門家経費日額上限マスタ（SC-16 マスタメンテナンス）
 *
 * 設計書物理名 x_gap_expert_fee → 本スコープ x_dent2_dentsusoke_expert_fee
 *
 * ■ 用途
 * 対象経費区分マスタの「専門家経費」区分に登録された経費明細について、
 * 専門家の区分ごとに1日当たりの謝金上限を保持する。
 * 対象経費登録処理（処理No.18）の入力チェックと、審査時の妥当性判断で参照する。
 *
 * ■ 項目構成の根拠（要レビュー）
 * テーブル定義書に本マスタの定義が無い。同種の補助金では専門家経費の謝金が
 * 専門家の資格・職位の区分ごとに日額上限で定められているため、
 * 「専門家区分 → 日額上限」の対応表として構成した。
 * TODO(要確認): 公募要領における専門家の区分の切り方と日額上限の実値が未確認。
 *   区分数・区分名・金額はいずれも公募要領との突合が必要。
 * TODO(要確認): 日額ではなく時間単価・回数上限で定められている場合は項目を差し替える。
 * TODO(要確認): 旅費が謝金と別枠で定められている場合は、旅費の上限を持つ項目
 *   （または対象経費区分マスタ側の「旅費」区分）での管理が必要。
 */
import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_expert_fee = Table({
    name: 'x_dent2_dentsusoke_expert_fee',
    label: '専門家経費日額上限マスタ',
    display: 'u_name',
    audit: true,
    schema: {
        u_code: StringColumn({
            label: '専門家区分コード',
            maxLength: 40,
            mandatory: true,
            unique: true,
        }),
        u_name: StringColumn({
            label: '専門家区分',
            maxLength: 200,
            mandatory: true,
            // 「大学教授・弁護士・公認会計士等」のように対象資格を列挙する
        }),
        u_daily_cap_amount: IntegerColumn({
            label: '日額上限（円）',
            mandatory: true,
        }),
        u_order: IntegerColumn({
            label: '表示順',
            mandatory: true,
            default: 100,
        }),
        u_active: BooleanColumn({
            label: '有効',
            default: true,
        }),
    },
})
