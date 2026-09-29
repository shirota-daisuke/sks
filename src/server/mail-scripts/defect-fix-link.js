/**
 * 不備確認依頼メールの修正画面リンクを生成する Email Script。
 *
 * リンク形式: <インスタンスURL>/<ポータルURLサフィックス>?id=<登録不備修正画面のページID>&token=<不備修正トークン>
 * インスタンスURLは環境ごとに異なるため、ハードコードせず glide.servlet.uri から動的に組み立てる。
 * ポータルサフィックス・ページIDはシステムプロパティで上書きできるようにしている
 * （プロパティ未作成でも第2引数の既定値が使われる）。
 *
 * 実装は本登録案内メールの registration-link.js と同じ方針。
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
    var defectPage = gs.getProperty('x_dent2_dentsusoke.page.defect_fix', 'x_dent2_dentsusoke_defect_fix')

    var url =
        instanceUrl + portalSuffix + '?id=' + defectPage + '&token=' + current.getValue('u_defect_fix_token')

    template.print(url)
})(current, template, email, email_action)
