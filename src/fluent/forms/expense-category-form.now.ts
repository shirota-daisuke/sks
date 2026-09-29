import '@servicenow/sdk/global'
import { Form, AnnotationType, default_view } from '@servicenow/sdk/core'

/**
 * SC-16 マスタメンテナンス：対象経費区分マスタのフォームレイアウト
 *
 * ②表示項目一覧
 *   経費区分コード u_code           必須・一意。経費明細（申請機能側）からの引き当てキー
 *   経費区分名     u_name           必須
 *   日額上限あり   u_has_daily_cap  true の区分は専門家経費日額上限マスタの適用対象
 *   表示順         u_order          必須
 *   有効           u_active
 *   対象範囲       u_description    複数行テキストのため one-column で全幅に配置する
 */
Form({
    table: 'x_dent2_dentsusoke_expense',
    view: default_view,
    sections: [
        {
            caption: '対象経費区分',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        {
                            type: 'annotation',
                            annotationId: Now.ID['annotation_expense_category_master'],
                            text: '経費区分コードは経費明細からの引き当てキーです。運用開始後は既存区分のコードを変更しないでください。「対象範囲」は事業者向け画面と問合せ対応で参照される説明文です。公募要領の記載に合わせて記入してください。使わなくなった区分は削除せず「有効」をオフにしてください。',
                            isPlainText: true,
                            annotationType: AnnotationType.Info_Box_Red,
                        },
                    ],
                },
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_code', type: 'table_field' },
                        { field: 'u_order', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'u_name', type: 'table_field' },
                        { field: 'u_has_daily_cap', type: 'table_field' },
                        { field: 'u_active', type: 'table_field' },
                    ],
                },
                {
                    layout: 'one-column',
                    elements: [{ field: 'u_description', type: 'table_field' }],
                },
            ],
        },
    ],
})
