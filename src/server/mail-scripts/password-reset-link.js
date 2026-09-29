/**
 * パスワード再設定メールの再設定用リンクを生成する Email Script。
 *
 * リンク形式: <インスタンスURL>/<ポータルURLサフィックス>?id=<パスワードリセット画面のページID>&token=<再設定トークン>
 * インスタンスURLは環境ごとに異なるため glide.servlet.uri から動的に組み立てる。
 */
// 第5引数の event は本スクリプトで使用しないため受け取らない（SDK のリンタが Web API の event 参照として検出するため）。
;(function runMailScript(
    /* GlideRecord */ current,
    /* TemplatePrinter */ template,
    /* Optional EmailOutbound */ email,
    /* Optional GlideRecord */ email_action,
) {
    var instanceUrl = gs.getProperty('glide.servlet.uri') // 末尾に '/' を含む
    var portalSuffix = gs.getProperty('x_dent2_dentsusoke.portal.url_suffix', 'x_dent2_dentsusoke_sks')
    var resetPage = gs.getProperty('x_dent2_dentsusoke.page.reset', 'x_dent2_dentsusoke_reset')

    var url =
        instanceUrl + portalSuffix + '?id=' + resetPage + '&token=' + current.getValue('u_password_reset_token')

    template.print(url)
})(current, template, email, email_action)
