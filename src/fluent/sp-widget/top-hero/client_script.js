/**
 * SC-00 トップ（未ログイン）画面 ヒーローエリア — クライアントスクリプト
 *
 * ⑤表示条件：ログイン済み（事業者ユーザ）でアクセスした場合は SC-05 マイページへ自動遷移する。
 * サーバー側で判定した data.redirectUrl が空でない場合のみ遷移する。
 */
api.controller = function ($window) {
    var c = this

    if (c.data.redirectUrl) {
        $window.location.href = c.data.redirectUrl
    }
}
