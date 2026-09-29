import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * T15 業種別基準マスタの初期データ（SC-16 マスタメンテナンス）
 *
 * ■ 値の根拠（要レビュー）
 * 業種コード・業種名は、現在 T01 事業者の業種（u_industry）で運用している選択リストの
 * 値・ラベル・並び順をそのまま引き継いでいる。参照型への移行時に u_code で突合するため、
 * 値を変更してはならない（変更すると既存の事業者データと結び付かなくなる）。
 *
 * 資本金上限・従業員数上限は中小企業基本法における中小企業者の定義から設定した。
 *   製造業・建設業・運輸業 … 資本金3億円以下     または 従業員300人以下
 *   卸売業                 … 資本金1億円以下     または 従業員100人以下
 *   サービス業             … 資本金5,000万円以下 または 従業員100人以下
 *   小売業                 … 資本金5,000万円以下 または 従業員 50人以下
 * 資本金は T01 u_capital と同じ単位（千円）で保持する。
 * TODO(要確認): 公募要領が中小企業基本法と異なる基準を定めている場合は本値を差し替える。
 *   「その他」は製造業と同じ基準を暫定で設定しており、実際の運用区分が確定したら見直す。
 *
 * ■ 投入方式（重要）
 * アプリのインストールで行われるのは「レコードが存在しない場合の新規作成」のみで、
 * 既存レコードは後続のインストールで更新されない（インスタンスで確認済み。
 * 列を追加してデプロイしても、既存行の新しい列は空のままだった）。
 * したがって本ファイルの値を変更して再デプロイしても、既に投入済みの行には反映されない。
 *
 * 値を修正する場合は SC-16 マスタメンテナンス画面で直接編集する
 * （マスタ保守はそのための画面であり、事務局の変更がデプロイで戻らない点でも都合が良い）。
 * 本ファイルの値は初期投入の内容と、値の根拠を残すための記録として維持する。
 */

Record({
    $id: Now.ID['master_industry_manufacturing'],
    table: 'x_dent2_dentsusoke_industry',
    data: {
        u_code: 'manufacturing',
        u_name: '製造業',
        u_capital_limit: 300000,
        u_employee_limit: 300,
        u_order: 100,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_industry_construction'],
    table: 'x_dent2_dentsusoke_industry',
    data: {
        u_code: 'construction',
        u_name: '建設業',
        u_capital_limit: 300000,
        u_employee_limit: 300,
        u_order: 200,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_industry_transportation'],
    table: 'x_dent2_dentsusoke_industry',
    data: {
        u_code: 'transportation',
        u_name: '運輸業',
        u_capital_limit: 300000,
        u_employee_limit: 300,
        u_order: 300,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_industry_wholesale'],
    table: 'x_dent2_dentsusoke_industry',
    data: {
        u_code: 'wholesale',
        u_name: '卸売業',
        u_capital_limit: 100000,
        u_employee_limit: 100,
        u_order: 400,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_industry_service'],
    table: 'x_dent2_dentsusoke_industry',
    data: {
        u_code: 'service',
        u_name: 'サービス業',
        u_capital_limit: 50000,
        u_employee_limit: 100,
        u_order: 500,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_industry_retail'],
    table: 'x_dent2_dentsusoke_industry',
    data: {
        u_code: 'retail',
        u_name: '小売業',
        u_capital_limit: 50000,
        u_employee_limit: 50,
        u_order: 600,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_industry_other'],
    table: 'x_dent2_dentsusoke_industry',
    data: {
        u_code: 'other',
        u_name: 'その他',
        u_capital_limit: 300000,
        u_employee_limit: 300,
        u_order: 700,
        u_active: true,
    },
})
