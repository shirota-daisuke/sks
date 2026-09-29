/**
 * T15 業種別基準マスタ（テーブル定義書 成果物No.9）
 *
 * 設計書物理名 x_gap_industry_standard → 本スコープ x_dent2_dentsusoke_industry
 * （ServiceNow のテーブル物理名は最大30文字。スコープ接頭辞 x_dent2_dentsusoke_ が19文字のため短縮）
 *
 * ■ 項目構成の根拠（要レビュー）
 * テーブル定義書 T15 の項目定義が手元にないため、以下の2点から項目を構成した。
 *   ・T01 事業者の業種（u_industry）が参照する先であること
 *     （entity.now.ts の TODO「設計書では業種別基準マスタ（T15）への参照型」）
 *   ・SC-06 自分の情報参照・変更 F3 が「業種マスタ（T15）からの選択」であること
 *     （profile-form/server_script.js の TODO）
 * 「基準」の内容は、T01 が資本金（u_capital）と従業員数（u_employee_count）を保持しており、
 * 中小企業基本法の中小企業者の定義が業種ごとに資本金・従業員数の上限で定められていることから、
 * 中小企業判定の基準値と解釈した。
 * TODO(要確認): T15 の項目定義（基準の内容）が未確定。基準が中小企業判定ではなく
 *   補助率・補助上限額の業種別区分である場合は、u_capital_limit／u_employee_limit を
 *   該当する項目へ置き換える。
 *
 * ■ 業種コード（u_code）を持たせる理由
 * 現在 T01 の業種は選択リスト（manufacturing／construction …）で運用しており、
 * 事業者データと SC-02／SC-03／SC-06 のポータル画面がこの値に依存している。
 * 参照型への移行を後から機械的に行えるよう、既存の選択リスト値と同じ値を u_code に持たせる。
 * TODO(SC-16 後続): T01 u_industry を本テーブルへの ReferenceColumn へ移行する。
 *   既存の事業者データの選択リスト値を u_code で突合して付け替える移行処理と、
 *   ポータル側3画面（register-form／signup-form／profile-form）の選択肢取得を
 *   sys_choice からマスタ参照へ切り替える改修が必要。本スライスでは実施しない。
 */
import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_industry = Table({
    name: 'x_dent2_dentsusoke_industry',
    label: '業種別基準マスタ',
    display: 'u_name',
    // マスタの変更履歴は監査対象（誰がいつ基準値を変えたかを追跡する）
    audit: true,
    schema: {
        u_code: StringColumn({
            label: '業種コード',
            maxLength: 40,
            mandatory: true,
            // 既存の T01 u_industry 選択リスト値と一致させる（移行時の突合キー）
            unique: true,
        }),
        u_name: StringColumn({
            label: '業種名',
            maxLength: 100,
            mandatory: true,
        }),
        u_capital_limit: IntegerColumn({
            label: '資本金上限（千円）',
            // 中小企業基本法の中小企業者の定義における資本金の額または出資の総額の上限
            // TODO(要確認): 基準値の出典（中小企業基本法／公募要領）を確定する。
        }),
        u_employee_limit: IntegerColumn({
            label: '従業員数上限（人）',
            // 中小企業基本法の中小企業者の定義における常時使用する従業員の数の上限
        }),
        u_order: IntegerColumn({
            label: '表示順',
            mandatory: true,
            default: 100,
            // ポータルの業種選択リストの並び順。現在の sys_choice の sequence を引き継ぐ
        }),
        u_active: BooleanColumn({
            label: '有効',
            default: true,
            // マスタは物理削除せず、無効化で運用する（過去の申請が参照している可能性があるため）
        }),
    },
})
