import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * 専門家経費日額上限マスタの初期データ（SC-16 マスタメンテナンス）
 *
 * ■ 値の根拠（要レビュー・確定値なし）
 * 本マスタは他テーブル・デモデータに手掛かりが無く、初期データの全項目が推定値である。
 * 同種の補助金で専門家謝金が資格・職位の区分ごとに日額上限で定められている慣行に倣い、
 * 3区分の対応表として設定した。
 * TODO(要確認): 公募要領における専門家の区分の切り方・区分名・日額上限の実値をすべて突合する。
 *   区分数が3でない場合は行の追加・削除が必要。
 *
 * ■ 投入方式（重要）
 * アプリのインストールで行われるのは「レコードが存在しない場合の新規作成」のみで、
 * 既存レコードは後続のインストールで更新されない（インスタンスで確認済み）。
 * 本ファイルの値を変更して再デプロイしても、既に投入済みの行には反映されない。
 * 値を修正する場合は SC-16 マスタメンテナンス画面で直接編集する。
 */

Record({
    $id: Now.ID['master_expert_fee_class1'],
    table: 'x_dent2_dentsusoke_expert_fee',
    data: {
        u_code: 'class1',
        u_name: '大学教授・弁護士・公認会計士・医師等',
        u_daily_cap_amount: 50000,
        u_order: 100,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_expert_fee_class2'],
    table: 'x_dent2_dentsusoke_expert_fee',
    data: {
        u_code: 'class2',
        u_name: '大学准教授・技術士・中小企業診断士・税理士・社会保険労務士等',
        u_daily_cap_amount: 40000,
        u_order: 200,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_expert_fee_class3'],
    table: 'x_dent2_dentsusoke_expert_fee',
    data: {
        u_code: 'class3',
        u_name: 'その他の専門家',
        u_daily_cap_amount: 30000,
        u_order: 300,
        u_active: true,
    },
})
