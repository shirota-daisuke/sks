import '@servicenow/sdk/global'
import { Form, AnnotationType, default_view } from '@servicenow/sdk/core'

/**
 * SC-16 マスタメンテナンス：補助上限額マスタのフォームレイアウト
 *
 * ビューは Default view に定義する（ワークスペースのレコードページが参照する
 * 「workspace-<sys_ux_app_config の sys_id>」は sys_id を含むため直接指定できず、
 * レイアウトが無い場合は Default view へフォールバックする。SC-13〜SC-16 と同じ方針）。
 *
 * ②表示項目一覧
 *   コード         u_code                  必須・一意。処理No.17 からの引き当てキー
 *   従業員数区分   u_employee_count_category 必須。T03 申請と同一の6区分
 *   特例措置対象   u_special_measure_flag  true の行は特例措置該当時の上限額
 *   補助上限額     u_cap_amount            必須・円
 *   表示順         u_order                 必須
 *   有効           u_active
 */
Form({
    table: 'x_dent2_dentsusoke_cap',
    view: default_view,
    sections: [
        {
            caption: '補助上限額',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        {
                            type: 'annotation',
                            annotationId: Now.ID['annotation_subsidy_cap_master'],
                            // text は文字列リテラルで指定する（文字列結合等の式は Fluent がビルド時に評価できない）
                            text: '「従業員数区分」と「特例措置対象」の組み合わせごとに1件だけ登録してください。コードは補助金額自動判定処理からの引き当てキーです（例：le20／le20_special）。金額は円単位で入力してください。使わなくなった行は削除せず「有効」をオフにしてください。',
                            isPlainText: true,
                            annotationType: AnnotationType.Info_Box_Red,
                        },
                    ],
                },
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_code', type: 'table_field' },
                        { field: 'u_employee_count_category', type: 'table_field' },
                        { field: 'u_order', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'u_cap_amount', type: 'table_field' },
                        { field: 'u_special_measure_flag', type: 'table_field' },
                        { field: 'u_active', type: 'table_field' },
                    ],
                },
            ],
        },
    ],
})
