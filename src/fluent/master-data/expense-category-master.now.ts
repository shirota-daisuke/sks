import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * 対象経費区分マスタの初期データ（SC-16 マスタメンテナンス）
 *
 * ■ 値の根拠（要レビュー）
 * テーブル定義書・公募要領の対象経費一覧が手元にないため、
 * 設備投資型の補助金で一般的に対象経費とされる区分を暫定で設定した。
 * 「クラウドサービス利用費」は SC-10 の問合せデモデータ
 * （「クラウドサービス利用費の対象範囲について確認させてください」）から実在が確認できる区分。
 * TODO(要確認): 公募要領の対象経費一覧と突合し、区分の追加・削除・名称の修正を行う。
 *   区分コードは経費明細（申請機能側）からの引き当てキーになるため、
 *   運用開始後の変更は避ける必要がある。確定前に見直すこと。
 *
 * 対象範囲（u_description）は、問合せが発生しやすい区分にのみ記載している。
 * TODO: 公募要領の記載を転記して全区分を埋める。空欄の区分は画面上で説明が出ない。
 *
 * ■ 投入方式（重要）
 * アプリのインストールで行われるのは「レコードが存在しない場合の新規作成」のみで、
 * 既存レコードは後続のインストールで更新されない（インスタンスで確認済み）。
 * 本ファイルの値を変更して再デプロイしても、既に投入済みの行には反映されない。
 * 値を修正する場合は SC-16 マスタメンテナンス画面で直接編集する。
 */

Record({
    $id: Now.ID['master_expense_machinery'],
    table: 'x_dent2_dentsusoke_expense',
    data: {
        u_code: 'machinery',
        u_name: '機械装置等費',
        u_description: '事業に必要な機械装置・工具器具の購入、製作、借用に要する経費。',
        u_has_daily_cap: false,
        u_order: 100,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_expense_system'],
    table: 'x_dent2_dentsusoke_expense',
    data: {
        u_code: 'system',
        u_name: 'システム構築費',
        u_description: '事業に必要なソフトウェア・情報システムの開発、構築、導入に要する経費。',
        u_has_daily_cap: false,
        u_order: 200,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_expense_cloud'],
    table: 'x_dent2_dentsusoke_expense',
    data: {
        u_code: 'cloud',
        u_name: 'クラウドサービス利用費',
        u_description:
            '事業に必要なクラウドサービスの利用に要する経費。補助事業期間中の利用分のみが対象で、期間外の利用料・自社の他事業と共用する分は対象外。',
        u_has_daily_cap: false,
        u_order: 300,
        u_active: true,
    },
})

/** 日額上限の適用対象。上限額は専門家経費日額上限マスタで管理する */
Record({
    $id: Now.ID['master_expense_expert'],
    table: 'x_dent2_dentsusoke_expense',
    data: {
        u_code: 'expert',
        u_name: '専門家経費',
        u_description:
            '事業の実施に必要な専門家への謝金。専門家の区分ごとに1日当たりの上限額が定められている（専門家経費日額上限マスタを参照）。',
        u_has_daily_cap: true,
        u_order: 400,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_expense_outsourcing'],
    table: 'x_dent2_dentsusoke_expense',
    data: {
        u_code: 'outsourcing',
        u_name: '外注費',
        u_description: '事業の一部を外部へ委託する場合の経費。自社で実施できる業務の外注は対象外。',
        u_has_daily_cap: false,
        u_order: 500,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_expense_advertising'],
    table: 'x_dent2_dentsusoke_expense',
    data: {
        u_code: 'advertising',
        u_name: '広告宣伝・販売促進費',
        u_description: '事業で開発・提供する製品・サービスの広告宣伝、販売促進に要する経費。',
        u_has_daily_cap: false,
        u_order: 600,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_expense_material'],
    table: 'x_dent2_dentsusoke_expense',
    data: {
        u_code: 'material',
        u_name: '原材料費',
        u_description: '試作品の開発に要する原材料・副資材の購入費。',
        u_has_daily_cap: false,
        u_order: 700,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_expense_ip'],
    table: 'x_dent2_dentsusoke_expense',
    data: {
        u_code: 'ip',
        u_name: '知的財産権等関連経費',
        u_description: '事業の成果に係る特許権等の取得に要する弁理士費用、出願手数料等。',
        u_has_daily_cap: false,
        u_order: 800,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_expense_training'],
    table: 'x_dent2_dentsusoke_expense',
    data: {
        u_code: 'training',
        u_name: '研修費',
        u_description: '事業の実施に必要な教育訓練、講座受講に要する経費。',
        u_has_daily_cap: false,
        u_order: 900,
        u_active: true,
    },
})

Record({
    $id: Now.ID['master_expense_travel'],
    table: 'x_dent2_dentsusoke_expense',
    data: {
        u_code: 'travel',
        u_name: '旅費',
        u_description: '事業の実施に必要な出張の旅費。',
        u_has_daily_cap: false,
        u_order: 1000,
        u_active: true,
    },
})
