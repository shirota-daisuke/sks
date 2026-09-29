import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { loginLinksWidget } from '../../sp-widget/login-links/widget.now'
import { OOTB_WIDGET_LOGIN } from '../../common/ootb-references'

/**
 * SC-01 ログイン画面
 *
 * 画面設計書 ①レイアウト構成
 *   中央配置のログインカード（ログインID／パスワード入力、ログインボタン、
 *   パスワードリセットリンク、区切り線、SSOログインボタン）
 * ④画面遷移  SC-01 → SC-05（認証成功）／ SC-01 → SC-04（パスワードリセット）
 *
 * 認証機構の方針
 *   ・②F1／F2 の入力と③アクションNo.1「ログイン」ボタン（処理No.9 通常認証）、
 *     ③アクションNo.3「SSOでログイン」（処理No.9／IF-01）、⑤MFA（処理No.10）は
 *     OOTB ログインウィジェット（widget-login）に委譲する。
 *     パスワード検証・セッション確立・MFAフローはプラットフォームの責務であり、
 *     スコープ内スクリプトで自前実装すべきではないため。
 *   ・OOTB ウィジェットは Multi-Provider SSO に登録された IdP を検出して
 *     SSO ログインボタンを自動表示する。IF-01（Salesforce IdP）登録後に有効になる。
 *   ・③アクションNo.2「パスワードをお忘れですか？」（SC-04 へ遷移）と
 *     新規登録への導線・注記は loginLinksWidget で補う。
 *
 * 権限（権限設計書 5. 画面アクセス制御）：アノニマス ○ ／ その他ロール ×
 *   → public: true とし、roles は指定しない。
 */
export const loginPage = SPPage({
    pageId: 'x_dent2_dentsusoke_login',
    title: 'ログイン',
    shortDescription: 'SC-01 ログイン画面。通常ログイン・MFA・SSO（IF-01）はプラットフォーム標準認証に委譲する。',
    category: 'custom',
    public: true,
    draft: false,
    dynamicTitleStructure: 'ログイン - ${portal.title}',
    css: '.sks-login-page .sp-login-widget { max-width: 400px; margin: 0 auto; }',
    containers: [
        {
            $id: Now.ID['login_container'],
            name: 'ログイン',
            width: 'container',
            cssClass: 'sks-login-page',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['login_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['login_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    // 認証本体：OOTB ログインウィジェット
                                    $id: Now.ID['login_inst_form'],
                                    widget: OOTB_WIDGET_LOGIN,
                                    order: 100,
                                    active: true,
                                    shortDescription: 'ログインID／パスワード／MFA／SSO（プラットフォーム標準認証）',
                                    widgetParameters: '{"show_panel":"true"}',
                                },
                                {
                                    // 補足：SC-04 へのリンク・新規登録導線・注記
                                    $id: Now.ID['login_inst_links'],
                                    widget: loginLinksWidget,
                                    order: 200,
                                    active: true,
                                    shortDescription: 'パスワードリセット／新規登録リンク・注記',
                                    widgetParameters:
                                        '{"reset_page":"x_dent2_dentsusoke_reset","register_page":"x_dent2_dentsusoke_register"}',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
