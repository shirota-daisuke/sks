/**
 * 補助率マスタ（SC-16 マスタメンテナンス）
 *
 * 設計書物理名 x_gap_subsidy_rate → 本スコープ x_dent2_dentsusoke_rate
 *
 * ■ 用途
 * 補助金額自動判定処理（処理No.17）が、申請の従業員数区分から補助率を決定するための基準表。
 * 判定結果は T03 申請の u_subsidy_rate へ保持される。
 *
 * ■ キーの構成根拠（要レビュー）
 * T03 申請が持つ事業者規模の軸は u_employee_count_category（6区分）のみであり、
 * 補助率もこの区分で決まる前提でキーとした。
 * TODO(要確認): 補助率が業種・経費区分・特例措置によっても変わる場合はキーの拡張が必要。
 *
 * ■ 補助率を分数（分子・分母）で保持する理由
 * 当初 DecimalColumn で保持したが、2/3 を 0.6667 として投入しても 0.67 へ丸められた
 * （インスタンスで確認。生値・表示値ともに 0.67）。
 * DecimalColumn の scale 属性は表示桁数の指定であり、既に作成済みの列の格納精度は変わらない。
 * 0.67 で 10,000,000円 の対象経費を計算すると、2/3 との差は 33,300円 になり補助金額として無視できない。
 *
 * 公募要領の補助率は 1/2・2/3 のような分数で定められており、
 * SC-07 申請状況一覧も分数表記で表示する（application-list/server_script.js formatRate）。
 * そのため分子・分母を整数で保持し、丸め誤差が原理的に発生しない構成とする。
 * 補助金額は処理No.17 が「対象経費 × 分子 ÷ 分母」で算出する。
 *
 * TODO(要対応): DecimalColumn から作り替えた際、旧列 u_subsidy_rate・u_rate_note が
 *   インスタンス側に残っている（Fluent の定義から外しても列は自動削除されない）。
 *   一覧・フォームには表示されないため実害はないが、辞書から手動で削除するのが望ましい。
 * TODO(要確認): 端数処理の規則（切り捨て／四捨五入）が未確定（A08 と同じ論点）。
 *   処理No.17 の実装時に確定させる必要がある。
 * TODO(要レビュー): T03 申請の u_subsidy_rate は DecimalColumn（格納精度2桁）のため、
 *   本マスタの 2/3 を転記すると 0.67 になり精度が落ちる。
 *   申請ごとに厳密な補助率を残す必要がある場合は、T03 側も分子・分母の保持へ変更する
 *   （T03 は申請機能＝ITCOM 主担当の範囲のため本スライスでは変更しない）。
 */
import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, IntegerColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_rate = Table({
    name: 'x_dent2_dentsusoke_rate',
    label: '補助率マスタ',
    display: 'u_code',
    audit: true,
    schema: {
        u_code: StringColumn({
            label: 'コード',
            maxLength: 40,
            mandatory: true,
            unique: true,
            // 従業員数区分の値と同じ。処理No.17 からの引き当てキー
        }),
        u_employee_count_category: ChoiceColumn({
            label: '従業員数区分',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            // T03 申請 u_employee_count_category と同一の選択肢
            choices: {
                sole_proprietor: '個人事業主',
                le5: '5人以下',
                le20: '6～20人',
                le50: '21～50人',
                le100: '51～100人',
                gt100: '101人以上',
            },
        }),
        /**
         * 1/2 なら分子1・分母2、2/3 なら分子2・分母3。
         *
         * 既定値は設定しない。当初は分子1・分母2（＝1/2）を既定値としていたが、
         * 列を追加したデプロイでレコードの値が反映されず、全行が既定値の 1/2 になった際に
         * 「誤った補助率が無言で入る」状態になった（インスタンスで発生）。
         * 補助率は必ず明示的に設定すべき値であり、既定値で埋めてはならない。
         */
        u_rate_numerator: IntegerColumn({
            label: '補助率（分子）',
            mandatory: true,
        }),
        u_rate_denominator: IntegerColumn({
            label: '補助率（分母）',
            mandatory: true,
            // 0 は設定しない（処理No.17 でゼロ除算になる）
        }),
        u_note: StringColumn({
            label: '備考',
            maxLength: 200,
            // その区分にその補助率を適用する根拠（公募要領上の事業者規模の区分等）を記載する。
            // 保守画面で値の意図が分かるようにするための項目
            // （対象経費区分マスタの u_description と同じ役割）
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
