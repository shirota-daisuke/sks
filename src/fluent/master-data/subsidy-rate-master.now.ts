import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * 補助率マスタの初期データ（SC-16 マスタメンテナンス）
 *
 * ■ 値の根拠（要レビュー）
 * 確定しているのはデモ申請データ（le20＝6～20人）の 0.5 ＝ 1/2 のみ。
 * 小規模（個人事業主・5人以下）を 2/3、それ以外を 1/2 とした暫定値である。
 * TODO(要確認): 公募要領の補助率と、小規模事業者の定義（従業員数の閾値）を突合して確定する。
 *
 * 補助率は分子・分母の整数で保持する（DecimalColumn では 2/3 が 0.67 に丸められるため。
 * 経緯は src/fluent/tables/subsidy-rate.now.ts のコメントを参照）。
 *
 * ■ 投入方式（重要）— インスタンス側の値がコードと一致しない
 * アプリのインストールで行われるのは「レコードが存在しない場合の新規作成」のみで、
 * 既存レコードは後続のインストールで更新も削除もされない（当インスタンスで確認済み。
 * 値の変更・列の追加・Now.del() のいずれも既存行へ反映されなかった）。
 *
 * 本マスタは補助率を DecimalColumn から分子・分母へ作り替えた経緯があり、
 * 作り替え前に投入された6行が残っている。そのため既存環境では
 * 小規模区分（個人事業主・5人以下）が列の既定値だった 1/2 のままになり、
 * 全区分の補助率が 1/2 で同一になる（u_note も空のままになる）。
 *
 * この不一致は Fix Script「SKS 補助率マスタの値の是正」
 * （src/fluent/fix-scripts/align-subsidy-rate-master.now.ts）が是正する。
 * u_code を突合キーに本ファイルと同じ値へそろえるため、値を変更する場合は
 * 本ファイルと当該 Fix Script の双方を更新する。
 * 是正結果は ATF テスト「SC-16 マスタメンテナンス：補助率マスタの値」で確認できる。
 * なお新規インストール環境では本ファイルの値がそのまま投入されるため問題は生じない。
 */

Record({
    $id: Now.ID['master_rate_sole_proprietor'],
    table: 'x_dent2_dentsusoke_rate',
    data: {
        u_code: 'sole_proprietor',
        u_employee_count_category: 'sole_proprietor',
        u_rate_numerator: 2,
        u_rate_denominator: 3,
        u_note: '小規模事業者（個人事業主）。公募要領の小規模区分に該当するため引き上げ後の補助率を適用する。',
        u_order: 100,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_rate_le5'],
    table: 'x_dent2_dentsusoke_rate',
    data: {
        u_code: 'le5',
        u_employee_count_category: 'le5',
        u_rate_numerator: 2,
        u_rate_denominator: 3,
        u_note: '小規模事業者（従業員5人以下）。公募要領の小規模区分に該当するため引き上げ後の補助率を適用する。',
        u_order: 200,
        u_active: true,
    },
})

/** デモ申請データ（APP-2026-00123）の補助率 0.5 ＝ 1/2 と一致する確定値 */
Record({
    $id: Now.ID['master_rate_le20'],
    table: 'x_dent2_dentsusoke_rate',
    data: {
        u_code: 'le20',
        u_employee_count_category: 'le20',
        u_rate_numerator: 1,
        u_rate_denominator: 2,
        u_note: '中小企業者。デモ申請データ（APP-2026-00123）で確定している補助率。',
        u_order: 300,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_rate_le50'],
    table: 'x_dent2_dentsusoke_rate',
    data: {
        u_code: 'le50',
        u_employee_count_category: 'le50',
        u_rate_numerator: 1,
        u_rate_denominator: 2,
        u_note: '中小企業者。',
        u_order: 400,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_rate_le100'],
    table: 'x_dent2_dentsusoke_rate',
    data: {
        u_code: 'le100',
        u_employee_count_category: 'le100',
        u_rate_numerator: 1,
        u_rate_denominator: 2,
        u_note: '中小企業者。',
        u_order: 500,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_rate_gt100'],
    table: 'x_dent2_dentsusoke_rate',
    data: {
        u_code: 'gt100',
        u_employee_count_category: 'gt100',
        u_rate_numerator: 1,
        u_rate_denominator: 2,
        u_note: '中小企業者。',
        u_order: 600,
        u_active: true,
    },
})
