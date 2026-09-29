/**
 * T01 事業者（テーブル定義書 成果物No.9）
 *
 * 設計書物理名 x_gap_business_entity → 本スコープ x_dent2_dentsusoke_entity
 * （ServiceNow のテーブル物理名は最大30文字。スコープ接頭辞 x_dent2_dentsusoke_ が19文字のため短縮）
 */
import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, IntegerColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_entity = Table({
    name: 'x_dent2_dentsusoke_entity',
    label: '事業者',
    display: 'u_business_name',
    audit: true,
    schema: {
        u_business_name: StringColumn({
            label: '事業者名（法人名／屋号）',
            maxLength: 100,
            mandatory: true,
        }),
        u_entity_type: ChoiceColumn({
            label: '事業者区分',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            choices: {
                corporate: '法人',
                sole_proprietor: '個人事業主',
            },
        }),
        u_corporate_number: StringColumn({
            label: '法人番号／本人識別情報',
            maxLength: 13,
            mandatory: true,
            // TODO(Q01/Q03): 重複チェック（処理No.5）の主キー・正規化範囲が未確定。
            // 暫定案として法人番号を第一キー（完全一致）とする前提でユニークインデックスは張らない。
        }),
        u_address: StringColumn({
            label: '所在地',
            maxLength: 200,
            mandatory: true,
        }),
        u_industry: ChoiceColumn({
            label: '業種',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            // TODO: 設計書では業種別基準マスタ（T15）への参照型。
            // T15 はマスタメンテナンス（SC-16）スライスで実装予定のため、暫定で選択リストとする。
            // T15 実装時に ReferenceColumn（referenceTable: 業種別基準マスタ）へ移行する。
            choices: {
                manufacturing: '製造業',
                construction: '建設業',
                transportation: '運輸業',
                wholesale: '卸売業',
                service: 'サービス業',
                retail: '小売業',
                other: 'その他',
            },
        }),
        u_employee_count: IntegerColumn({
            label: '従業員数',
            mandatory: true,
            default: 0,
        }),
        u_capital: IntegerColumn({
            label: '資本金（千円）',
            mandatory: true,
            default: 0,
        }),
        u_prior_year_awarded_flag: BooleanColumn({
            label: '前年度採択事業者フラグ',
            default: false,
            // TODO(IF-02): Salesforce との照合タイミング・方式が未確定。
            // 暫定案では前年登録判定処理（処理No.4）がリアルタイム照会で更新する。
        }),
        u_prior_year_award_number: StringColumn({
            label: '前年度採択番号',
            maxLength: 50,
        }),
        u_salesforce_account_id: StringColumn({
            label: 'Salesforce事業者ID',
            maxLength: 50,
        }),
    },
})
