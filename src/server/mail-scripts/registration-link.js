/**
 * 本登録案内メールの本登録リンクを生成する Email Script。
 *
 * リンク形式: <インスタンスURL>/<ポータルURLサフィックス>?id=<本登録画面のページID>&token=<仮登録トークン>
 * インスタンスURLは環境ごとに異なるため、ハードコードせず glide.servlet.uri から動的に組み立てる。
 * ポータルサフィックス・ページIDはシステムプロパティで上書きできるようにしている
 * （プロパティ未作成でも第2引数の既定値が使われる）。
 */
// 第5引数の event（イベントレコード）は本スクリプトで使用しないため受け取らない。
// SDK のリンタが Web API の event グローバル参照として検出するため、渡さない実装としている。
;(function runMailScript(
    /* GlideRecord */ current,
    /* TemplatePrinter */ template,
    /* Optional EmailOutbound */ email,
    /* Optional GlideRecord */ email_action,
) {
    var instanceUrl = gs.getProperty('glide.servlet.uri') // 末尾に '/' を含む
    var portalSuffix = gs.getProperty('x_dent2_dentsusoke.portal.url_suffix', 'x_dent2_dentsusoke_sks')
    var signupPage = gs.getProperty('x_dent2_dentsusoke.page.signup', 'x_dent2_dentsusoke_signup')

    var url =
        instanceUrl + portalSuffix + '?id=' + signupPage + '&token=' + current.getValue('u_registration_token')

    template.print(url)
})(current, template, email, email_action)
