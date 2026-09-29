import '@servicenow/sdk/global'
import { Form, AnnotationType, default_view } from '@servicenow/sdk/core'

/**
 * SC-16 マスタメンテナンス：専門家経費日額上限マスタのフォームレイアウト
 *
 * ②表示項目一覧
 *   専門家区分コード u_code             必須・一意
 *   専門家区分       u_name             必須。対象資格を列挙するため長め（200文字）
 *   日額上限         u_daily_cap_amount 必須・円
 *   表示順           u_order            必須
 *   有効             u_active
 *
 * 専門家区分は資格を列挙して長くなるため one-column で全幅に配置する。
 */
Form({
    table: 'x_dent2_dentsusoke_expert_fee',
    view: default_view,
    sections: [
        {
            caption: '専門家経費日額上限',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        {
                            type: 'annotation',
                            annotationId: Now.ID['annotation_expert_fee_master'],
                            text: '対象経費区分マスタの「専門家経費」に登録された経費明細に適用される、専門家の区分ごとの1日当たり上限額です。金額は円単位で入力してください。使わなくなった区分は削除せず「有効」をオフにしてください。',
                            isPlainText: true,
                            annotationType: AnnotationType.Info_Box_Red,
                        },
                        { field: 'u_name', type: 'table_field' },
                    ],
                },
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_code', type: 'table_field' },
                        { field: 'u_order', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'u_daily_cap_amount', type: 'table_field' },
                        { field: 'u_active', type: 'table_field' },
                    ],
                },
            ],
        },
    ],
})
