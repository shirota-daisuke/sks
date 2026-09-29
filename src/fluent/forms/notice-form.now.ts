import '@servicenow/sdk/global'
import { Form, AnnotationType, default_view } from '@servicenow/sdk/core'

/**
 * SC-13 お知らせ作成・編集画面（事務局） ①レイアウト構成
 *
 * 事務局向け画面は SC-11／SC-12 と同じ SKS 事務局ワークスペース（Next Experience）で提供する
 * （題材システム構成図：事務局ユーザの入口はワークスペース）。
 * 一覧＋「＋新規」はワークスペース標準のリスト画面（src/fluent/workspaces/staff-workspace/list-menu.now.ts）、
 * 作成・編集フォームは本ファイルのフォームレイアウトで構成する。
 *
 * ■ ビューの選択
 * ワークスペースのレコードページは view プロパティ「workspace-<sys_ux_app_config の sys_id>」を
 * 参照するが、この名前は sys_id を含むため直接指定するとトンマナ 3.4.1「sys_id のハードコード禁止」に反する。
 * 当該ビューにフォームレイアウトが無い場合はプラットフォームが Default view のレイアウトへ
 * フォールバックするため、Default view に対して定義する。
 * これによりワークスペースと標準 UI（レコードフォーム）の双方で同じ項目構成になる。
 *
 * ■ ②表示項目一覧（テーブル定義書 T10 の全項目）
 *   タイトル       u_title              必須・100文字
 *   本文           u_body               必須・4000文字（リッチテキスト）
 *   公開範囲       u_visibility_scope   必須（法人／個人／全体）公開範囲設定処理：処理No.40
 *   重要度         u_priority           必須（高／中／低）
 *   公開開始日     u_publish_start_date 必須             公開期間設定処理：処理No.41
 *   公開終了日     u_publish_end_date   必須
 *   公開状態       u_publish_status     必須（公開／非公開）既定は非公開
 *   メール通知有無 u_email_notify_flag  既定はあり
 *   作成者         u_created_by_staff   必須・操作中のユーザを既定値とする
 *
 * 本文はリッチテキスト（HTML）のため全幅が必要で、レイアウトは one-column とする
 * （form-layout-guide「Never put text areas in two-column blocks」）。
 */
Form({
    table: 'x_dent2_dentsusoke_notice',
    view: default_view,
    sections: [
        {
            caption: 'お知らせ',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        {
                            // 公開状態は既定で「非公開」であり、公開は専用ボタンで行う運用を明示する
                            type: 'annotation',
                            annotationId: Now.ID['annotation_notice_publish_flow'],
                            // text は文字列リテラルで指定する（文字列結合等の式は Fluent がビルド時に評価できない）
                            text: '保存した時点では公開されません。内容を確定したら「公開する」を実行してください。事業者への表示は公開期間（公開開始日〜公開終了日）と公開範囲に従います。',
                            isPlainText: true,
                            annotationType: AnnotationType.Info_Box_Blue,
                        },
                        { field: 'u_title', type: 'table_field' },
                    ],
                },
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_visibility_scope', type: 'table_field' },
                        { field: 'u_publish_start_date', type: 'table_field' },
                        { field: 'u_publish_status', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'u_priority', type: 'table_field' },
                        { field: 'u_publish_end_date', type: 'table_field' },
                        { field: 'u_email_notify_flag', type: 'table_field' },
                    ],
                },
                {
                    layout: 'one-column',
                    elements: [{ field: 'u_body', type: 'table_field' }],
                },
                {
                    layout: 'one-column',
                    elements: [{ field: 'u_created_by_staff', type: 'table_field' }],
                },
            ],
        },
    ],
})
