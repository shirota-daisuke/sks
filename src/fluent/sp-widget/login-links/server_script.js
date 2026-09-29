/**
 * SC-01 ログイン画面 補足リンク・注記 — サーバースクリプト
 *
 * 認証そのもの（処理No.9 通常認証／処理No.10 多要素認証／IF-01 SSO認証）は
 * OOTB ログインウィジェット（widget-login）＝プラットフォーム標準の認証機構に委譲する。
 * 本ウィジェットは画面設計書 SC-01 のうち、標準ウィジェットが持たない要素を補う。
 *   ・「パスワードをお忘れですか？」→ SC-04 パスワードリセット画面（③アクション No.2）
 *   ・新規登録への導線 → SC-02 仮登録画面
 *   ・注記（前年度登録済み事業者が対象／MFA 設定時は追加認証を求める）
 */
;(function () {
    data.resetUrl = '?id=' + (options.reset_page || 'x_dent2_dentsusoke_reset')
    data.registerUrl = '?id=' + (options.register_page || 'x_dent2_dentsusoke_register')
    data.note =
        options.note ||
        '※SSOでのログインは前年度登録済み事業者が対象です。多要素認証（MFA）が設定されている場合は追加認証を求めます。'

    // Multi-Provider SSO が未有効の場合、OOTB ログインウィジェットには SSO ボタンが表示されない。
    // IF-01（Salesforce SSO 認証連携）が未実装であることを画面上で明示する。
    data.ssoEnabled = gs.getProperty('glide.authenticate.multisso.enabled', 'false') === 'true'
    data.ssoNote =
        options.sso_note ||
        'SSOログイン（Salesforce）は現在未設定です。Multi-Provider SSO に Salesforce を IdP として登録すると、ログインフォームに SSO ログインボタンが表示されます。'
    data.showSsoNote = !data.ssoEnabled && options.show_sso_note !== false && options.show_sso_note !== 'false'
})()
