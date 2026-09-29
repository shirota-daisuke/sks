import '@servicenow/sdk/global'
import { Form, AnnotationType, default_view } from '@servicenow/sdk/core'

/**
 * SC-16 マスタメンテナンス：補助率マスタのフォームレイアウト
 *
 * ②表示項目一覧
 *   コード         u_code                    必須・一意。処理No.17 からの引き当てキー
 *   従業員数区分   u_employee_count_category 必須。T03 申請と同一の6区分
 *   補助率（分子） u_rate_numerator          必須・整数（1/2 なら 1）
 *   補助率（分母） u_rate_denominator        必須・整数（1/2 なら 2）
 *   表示順         u_order                   必須
 *   有効           u_active
 *   備考           u_note                    その区分にその補助率を適用する根拠
 *
 * 補助率を小数ではなく分数で保持する理由は
 * src/fluent/tables/subsidy-rate.now.ts のコメントを参照（0.67 への丸めを避けるため）。
 */
Form({
    table: 'x_dent2_dentsusoke_rate',
    view: default_view,
    sections: [
        {
            caption: '補助率',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        {
                            type: 'annotation',
                            annotationId: Now.ID['annotation_subsidy_rate_master'],
                            text: '補助率は分数で入力してください（1/2 なら分子1・分母2、2/3 なら分子2・分母3）。小数ではなく分数で保持するのは、小数だと 2/3 が 0.67 に丸められ補助金額に無視できない差が出るためです。分母に 0 は設定しないでください。使わなくなった行は削除せず「有効」をオフにしてください。',
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
                        { field: 'u_rate_numerator', type: 'table_field' },
                        { field: 'u_rate_denominator', type: 'table_field' },
                        { field: 'u_active', type: 'table_field' },
                    ],
                },
                {
                    layout: 'one-column',
                    elements: [{ field: 'u_note', type: 'table_field' }],
                },
            ],
        },
    ],
})
