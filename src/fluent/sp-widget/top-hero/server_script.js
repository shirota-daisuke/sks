/**
 * SC-00 トップ（未ログイン）画面 ヒーローエリア — サーバースクリプト
 *
 * 画面設計書 ①レイアウト構成
 *   ヒーローエリア（キャッチコピー＋「ログイン」「新規登録」ボタン）
 * ③アクション定義
 *   No.1「ログイン」リンク／ボタン → SC-01 ログイン画面へ遷移（処理なし）
 *   No.2「新規登録」ボタン        → SC-02 仮登録画面へ遷移（処理なし）
 * ⑤表示条件
 *   ログイン済みセッションでアクセスした場合は SC-05 マイページへ自動遷移する
 */
;(function () {
    // TODO(SC-00 確認事項): 未ログイン時に表示するサービス説明文言・対象者要件の表示範囲が未確定。
    // 文言確定までコード変更なしで差し替えられるよう、既定値をウィジェットオプションで上書きできる構成としている。
    data.heroTitle = options.hero_title || '成長加速支援補助金の申請はこちらから'
    data.heroLead =
        options.hero_lead ||
        '中小企業・個人事業主の売上拡大と事業継続コストの軽減を支援する補助金です。本ポータルから電子申請を受け付けます。'

    data.loginUrl = '?id=' + (options.login_page || 'login')
    data.registerUrl = '?id=' + (options.register_page || 'x_dent2_dentsusoke_register')

    // ログイン済み事業者ユーザのみマイページへ自動遷移させる。
    // 事務局ユーザ・システム管理者・未ログイン（guest）はトップ画面をそのまま表示する。
    // TODO: 「ログイン済みセッション」の範囲（事務局ユーザを含めるか）は要確認（SC-00 ⑤表示条件）。
    data.redirectUrl = ''
    if (new x_dent2_dentsusoke.PortalContextUtil().isApplicant()) {
        data.redirectUrl = '?id=' + (options.mypage_page || 'x_dent2_dentsusoke_mypage')
    }
})()
