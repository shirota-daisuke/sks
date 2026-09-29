import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * 補助上限額マスタの初期データ（SC-16 マスタメンテナンス）
 *
 * 従業員数区分（6区分）× 特例措置の有無（2通り）＝ 12件。
 *
 * ■ 値の根拠（要レビュー）
 * 確定しているのはデモ申請データ（le20＝6～20人／特例なし）の 15,000,000円 のみ。
 * 残り11件は、従業員数区分ごとに上限を設け、特例措置該当時に引き上げる方式の
 * 一般的な水準から設定した暫定値である。
 * TODO(要確認): 公募要領「2.(1)基本概要」の補助上限表と突合して確定する。
 *
 * 個人事業主は「5人以下」と同額としている（補助上限表に独立した行が無い想定）。
 *
 * ■ 投入方式（重要）
 * アプリのインストールで行われるのは「レコードが存在しない場合の新規作成」のみで、
 * 既存レコードは後続のインストールで更新されない（インスタンスで確認済み）。
 * 本ファイルの値を変更して再デプロイしても、既に投入済みの行には反映されない。
 * 値を修正する場合は SC-16 マスタメンテナンス画面で直接編集する。
 * 本ファイルの値は初期投入の内容と、値の根拠を残すための記録として維持する。
 */

// ---------------------------------------------------------------------------
// 特例措置なし（通常の補助上限額）
// ---------------------------------------------------------------------------
Record({
    $id: Now.ID['master_cap_sole_proprietor'],
    table: 'x_dent2_dentsusoke_cap',
    data: {
        u_code: 'sole_proprietor',
        u_employee_count_category: 'sole_proprietor',
        u_special_measure_flag: false,
        u_cap_amount: 7500000,
        u_order: 100,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_cap_le5'],
    table: 'x_dent2_dentsusoke_cap',
    data: {
        u_code: 'le5',
        u_employee_count_category: 'le5',
        u_special_measure_flag: false,
        u_cap_amount: 7500000,
        u_order: 200,
        u_active: true,
    },
})

/** デモ申請データ（APP-2026-00123）の補助上限額と一致する確定値 */
Record({
    $id: Now.ID['master_cap_le20'],
    table: 'x_dent2_dentsusoke_cap',
    data: {
        u_code: 'le20',
        u_employee_count_category: 'le20',
        u_special_measure_flag: false,
        u_cap_amount: 15000000,
        u_order: 300,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_cap_le50'],
    table: 'x_dent2_dentsusoke_cap',
    data: {
        u_code: 'le50',
        u_employee_count_category: 'le50',
        u_special_measure_flag: false,
        u_cap_amount: 30000000,
        u_order: 400,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_cap_le100'],
    table: 'x_dent2_dentsusoke_cap',
    data: {
        u_code: 'le100',
        u_employee_count_category: 'le100',
        u_special_measure_flag: false,
        u_cap_amount: 50000000,
        u_order: 500,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_cap_gt100'],
    table: 'x_dent2_dentsusoke_cap',
    data: {
        u_code: 'gt100',
        u_employee_count_category: 'gt100',
        u_special_measure_flag: false,
        u_cap_amount: 80000000,
        u_order: 600,
        u_active: true,
    },
})

// ---------------------------------------------------------------------------
// 特例措置あり（引き上げ後の補助上限額）
// ---------------------------------------------------------------------------
Record({
    $id: Now.ID['master_cap_sole_proprietor_special'],
    table: 'x_dent2_dentsusoke_cap',
    data: {
        u_code: 'sole_proprietor_special',
        u_employee_count_category: 'sole_proprietor',
        u_special_measure_flag: true,
        u_cap_amount: 10000000,
        u_order: 700,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_cap_le5_special'],
    table: 'x_dent2_dentsusoke_cap',
    data: {
        u_code: 'le5_special',
        u_employee_count_category: 'le5',
        u_special_measure_flag: true,
        u_cap_amount: 10000000,
        u_order: 800,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_cap_le20_special'],
    table: 'x_dent2_dentsusoke_cap',
    data: {
        u_code: 'le20_special',
        u_employee_count_category: 'le20',
        u_special_measure_flag: true,
        u_cap_amount: 20000000,
        u_order: 900,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_cap_le50_special'],
    table: 'x_dent2_dentsusoke_cap',
    data: {
        u_code: 'le50_special',
        u_employee_count_category: 'le50',
        u_special_measure_flag: true,
        u_cap_amount: 40000000,
        u_order: 1000,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_cap_le100_special'],
    table: 'x_dent2_dentsusoke_cap',
    data: {
        u_code: 'le100_special',
        u_employee_count_category: 'le100',
        u_special_measure_flag: true,
        u_cap_amount: 65000000,
        u_order: 1100,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_cap_gt100_special'],
    table: 'x_dent2_dentsusoke_cap',
    data: {
        u_code: 'gt100_special',
        u_employee_count_category: 'gt100',
        u_special_measure_flag: true,
        u_cap_amount: 100000000,
        u_order: 1200,
        u_active: true,
    },
})
