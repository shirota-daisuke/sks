import '@servicenow/sdk/global'
import { Form, AnnotationType, default_view } from '@servicenow/sdk/core'

/**
 * SC-14 問合せ管理・返信画面（事務局） ①レイアウト構成
 *
 * 事務局向け画面は SC-11／SC-12／SC-13 と同じ SKS 事務局ワークスペース（Next Experience）で提供する
 * （題材システム構成図：事務局ユーザの入口はワークスペース＝ダッシュボード・ユーザ管理・
 * マスタメンテナンス・問合せ管理・帳票／レポート）。
 * 一覧（問合せ管理）はワークスペース標準のリスト画面
 * （src/fluent/workspaces/staff-workspace/list-menu.now.ts）、
 * 詳細・返信フォームは本ファイルのフォームレイアウトで構成する。
 *
 * ■ ビューの選択
 * ワークスペースのレコードページは view プロパティ「workspace-<sys_ux_app_config の sys_id>」を
 * 参照するが、この名前は sys_id を含むため直接指定するとトンマナ 3.4.1「sys_id のハードコード禁止」に反する。
 * 当該ビューにフォームレイアウトが無い場合はプラットフォームが Default view のレイアウトへ
 * フォールバックするため、Default view に対して定義する（SC-13 と同じ方針）。
 *
 * ■ ②表示項目一覧（テーブル定義書 T12 の全項目）
 *   件名       u_subject              必須・200文字
 *   事業者     u_business_entity      必須（T01 への参照）
 *   起票者     u_created_by_applicant 必須（T02 への参照）
 *   受付日時   u_received_on          必須・起票時に自動設定
 *   状態       u_state                必須（未回答／回答済）既定は未回答
 *   対応者     u_assigned_staff       任意（sys_user への参照）
 *   回答日時   u_replied_on           返信時に自動設定
 *   本文       u_description          必須・2000文字（事業者の問合せ内容。事務局は編集しない）
 *   回答本文   u_reply_body           2000文字（事務局が入力する唯一の本文項目）
 *
 * ■ セクション構成
 * 本文・回答本文はいずれも複数行テキストのため全幅が必要で one-column とする
 * （form-layout-guide「Never put text areas in two-column blocks」）。
 * 「問合せ内容」と「回答」を別セクションに分けるとインスタンスのタブ設定によって
 * 回答本文が別タブへ隠れる可能性があるため、1セクションに注記で区切って配置する。
 */
Form({
    table: 'x_dent2_dentsusoke_inquiry',
    view: default_view,
    sections: [
        {
            caption: '問合せ',
            content: [
                {
                    layout: 'one-column',
                    elements: [{ field: 'u_subject', type: 'table_field' }],
                },
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_business_entity', type: 'table_field' },
                        { field: 'u_created_by_applicant', type: 'table_field' },
                        { field: 'u_received_on', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'u_state', type: 'table_field' },
                        { field: 'u_assigned_staff', type: 'table_field' },
                        { field: 'u_replied_on', type: 'table_field' },
                    ],
                },
                {
                    layout: 'one-column',
                    elements: [{ field: 'u_description', type: 'table_field' }],
                },
                {
                    layout: 'one-column',
                    elements: [
                        {
                            // 単一回答モデル（1問合せ＝1回答）であることと返信手順を明示する
                            type: 'annotation',
                            annotationId: Now.ID['annotation_inquiry_reply_flow'],
                            // text は文字列リテラルで指定する（文字列結合等の式は Fluent がビルド時に評価できない）
                            text: '回答本文を入力してから「返信する」を実行してください。状態が「回答済」になり、回答日時と対応者が記録されます。回答は1問合せにつき1件です。訂正する場合は「未回答に戻す」を実行してから再度返信してください。',
                            isPlainText: true,
                            annotationType: AnnotationType.Info_Box_Blue,
                        },
                        { field: 'u_reply_body', type: 'table_field' },
                    ],
                },
            ],
        },
    ],
})
