import '@servicenow/sdk/global'
import { Form, AnnotationType, default_view } from '@servicenow/sdk/core'

/**
 * SC-16 マスタメンテナンス画面（事務局） ①レイアウト構成
 *
 * 事務局向け画面は SC-11〜SC-15 と同じ SKS 事務局ワークスペース（Next Experience）で提供する
 * （題材システム構成図：事務局ユーザの入口はワークスペース＝ダッシュボード・ユーザ管理・
 * マスタメンテナンス・問合せ管理・帳票／レポート）。
 * 一覧はワークスペース標準のリスト画面（src/fluent/workspaces/staff-workspace/list-menu.now.ts）、
 * 追加・編集フォームは本ファイルのフォームレイアウトで構成する。
 *
 * ■ ビューの選択
 * ワークスペースのレコードページは view プロパティ「workspace-<sys_ux_app_config の sys_id>」を
 * 参照するが、この名前は sys_id を含むため直接指定するとトンマナ 3.4.1「sys_id のハードコード禁止」に反する。
 * 当該ビューにフォームレイアウトが無い場合はプラットフォームが Default view のレイアウトへ
 * フォールバックするため、Default view に対して定義する（SC-13／SC-14 と同じ方針）。
 *
 * ■ ②表示項目一覧（T15 業種別基準マスタ）
 *   業種コード       u_code            必須・一意。T01 の選択リスト値と一致させる（変更禁止）
 *   業種名           u_name            必須。ポータルの業種選択に表示される名称
 *   資本金上限       u_capital_limit   千円単位（T01 u_capital と同じ単位）
 *   従業員数上限     u_employee_limit  人
 *   表示順           u_order           必須。ポータルの選択リストの並び順
 *   有効             u_active          無効化した業種は新規選択させない
 *
 * ■ 業種コードの取り扱い
 * 業種コードは既存の事業者データとの突合キーであり、変更すると結び付きが失われる。
 * 辞書側で読み取り専用にはせず（新規追加時に入力が必要なため）、
 * 注記で変更禁止であることを明示する。
 * TODO(SC-16 後続): 参照型への移行後は、既存レコードの u_code を変更できないよう
 *   UI Policy（新規時のみ編集可）またはビジネスルールで固定する。
 */
Form({
    table: 'x_dent2_dentsusoke_industry',
    view: default_view,
    sections: [
        {
            caption: '業種別基準',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        {
                            type: 'annotation',
                            annotationId: Now.ID['annotation_industry_master'],
                            // text は文字列リテラルで指定する（文字列結合等の式は Fluent がビルド時に評価できない）
                            text: '業種コードは事業者データとの突合キーです。既存の業種のコードは変更しないでください。使わなくなった業種は削除せず「有効」をオフにしてください。資本金上限は千円単位です。',
                            isPlainText: true,
                            annotationType: AnnotationType.Info_Box_Red,
                        },
                    ],
                },
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_code', type: 'table_field' },
                        { field: 'u_capital_limit', type: 'table_field' },
                        { field: 'u_order', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'u_name', type: 'table_field' },
                        { field: 'u_employee_limit', type: 'table_field' },
                        { field: 'u_active', type: 'table_field' },
                    ],
                },
            ],
        },
    ],
})
