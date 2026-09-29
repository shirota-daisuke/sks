import '@servicenow/sdk/global'
import { Form, AnnotationType, default_view } from '@servicenow/sdk/core'

/**
 * SC-11 ユーザ登録審査画面（事務局・プロビジョニング） ①レイアウト構成
 *
 * 一覧（登録審査：要対応ほか）はワークスペース標準のリスト画面
 * （src/fluent/workspaces/staff-workspace/list-menu.now.ts）、
 * 詳細・審査フォームは本ファイルのフォームレイアウトで構成する。
 *
 * ■ 本定義が必要な理由
 * T02 は sys_user を継承しているため、フォームレイアウトを定義しないと
 * プラットフォームは親テーブル（sys_user）のレイアウトへフォールバックし、
 * 拡張フィールド（u_*）が1つも表示されない。
 * その結果 ③No.3「不備修正を依頼」で必須の「登録不備内容」を入力できず、
 * UI Action が常に「不備内容を入力してください。」で失敗する
 * （src/server/ui-actions/registration-request-defect.js は
 *   current.getValue('u_registration_issue_note') をフォームの入力値として読む）。
 *
 * ■ ビューの選択
 * ワークスペースのレコードページは view プロパティ「workspace-<sys_ux_app_config の sys_id>」を
 * 参照するが、この名前は sys_id を含むため直接指定するとトンマナ 3.4.1「sys_id のハードコード禁止」に反する。
 * 当該ビューにフォームレイアウトが無い場合はプラットフォームが Default view のレイアウトへ
 * フォールバックするため、Default view に対して定義する（SC-13／SC-14 と同じ方針）。
 *
 * ■ ②表示項目一覧
 *   ログインID     user_name                  sys_user 継承（一覧の先頭列と同じ）
 *   姓・名         last_name／first_name      sys_user 継承
 *   メールアドレス email                      sys_user 継承
 *   事業者         u_business_entity          T01 への参照（法人番号は事業者側で突合する）
 *   ユーザ区分     u_user_type                管理者／担当者
 *   登録ステータス u_registration_status      必須。③の3アクションは「登録申請審査中」のみ実行可
 *   重複チェック結果 u_duplicate_check_result 必須。「重複あり（確定）」は承認不可（Q04）
 *   登録申請日時   u_registration_requested_on
 *   承認日時       u_approved_on              承認・却下の実行時に自動設定
 *   承認者         u_approved_by              同上
 *   登録不備内容   u_registration_issue_note  ③No.3「不備修正を依頼」の入力欄・2000文字
 *   認証方式       u_auth_method              必須（通常認証／SSO）
 *   MFA設定有無    u_mfa_enabled
 *   SSO連携ID      u_sso_external_id
 *
 * 仮登録トークン・パスワード再設定トークンおよびその有効期限は認証情報であり、
 * 審査担当者が参照する必要がないためフォームには配置しない（トンマナ 2.1.1 最小権限の原則）。
 *
 * ■ セクション構成
 * 登録不備内容は複数行テキストのため全幅が必要で one-column とする
 * （form-layout-guide「Never put text areas in two-column blocks」）。
 * 審査に必要な項目（ステータス・重複チェック結果・登録不備内容）は、インスタンスのタブ設定で
 * 別タブへ隠れないよう先頭セクションにまとめ、認証設定は別セクションへ分ける。
 */
Form({
    table: 'x_dent2_dentsusoke_user',
    view: default_view,
    sections: [
        {
            caption: '登録審査',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        {
                            // ③の3アクションの実行条件と、不備修正依頼の入力手順を明示する
                            type: 'annotation',
                            annotationId: Now.ID['annotation_registration_review_flow'],
                            // text は文字列リテラルで指定する（文字列結合等の式は Fluent がビルド時に評価できない）
                            text: '「承認」「却下」「不備修正を依頼」はユーザ登録ステータスが「登録申請審査中」の場合のみ実行できます。重複チェック結果が「重複あり（確定）」の場合は承認できないため却下してください。「不備修正を依頼」は下の「登録不備内容」に修正が必要な項目と理由を入力してから実行してください。入力した内容は申請者へのメールにそのまま記載され、修正用リンク（有効期限14日）が送られます。申請者が修正画面を開くとステータスが「登録不備修正中」に、再提出すると「登録申請審査中」に戻ります。',
                            isPlainText: true,
                            annotationType: AnnotationType.Info_Box_Blue,
                        },
                    ],
                },
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'user_name', type: 'table_field' },
                        { field: 'last_name', type: 'table_field' },
                        { field: 'email', type: 'table_field' },
                        { field: 'u_business_entity', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'u_registration_status', type: 'table_field' },
                        { field: 'first_name', type: 'table_field' },
                        { field: 'u_user_type', type: 'table_field' },
                        { field: 'u_duplicate_check_result', type: 'table_field' },
                    ],
                },
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_registration_requested_on', type: 'table_field' },
                        { field: 'u_approved_on', type: 'table_field' },
                    ],
                    rightElements: [{ field: 'u_approved_by', type: 'table_field' }],
                },
                {
                    layout: 'one-column',
                    elements: [{ field: 'u_registration_issue_note', type: 'table_field' }],
                },
            ],
        },
        {
            caption: 'アカウント・認証',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_auth_method', type: 'table_field' },
                        { field: 'u_sso_external_id', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'u_mfa_enabled', type: 'table_field' },
                        { field: 'active', type: 'table_field' },
                    ],
                },
            ],
        },
    ],
})
