/**
 * 申請の不備確認依頼メールの修正画面リンクを生成する Email Script（ITCOM-07 → ITCOM-05）。
 *
 * リンク形式: <インスタンスURL>/<ポータルURLサフィックス>?id=<申請の不備修正画面のページID>&sys_id=<申請の sys_id>
 * インスタンスURLは環境ごとに異なるため、ハードコードせず glide.servlet.uri から動的に組み立てる。
 * ポータルサフィックス・ページIDはシステムプロパティで上書きできるようにしている
 * （プロパティ未作成でも第2引数の既定値が使われる）。
 *
 * ■ トークンを付けない
 * ユーザ登録の不備修正（defect-fix-link.js）は、本登録が承認されるまで
 * applicant ロールが無くポータルを開けないためトークン付きリンクにしている。
 * 申請の不備修正では事業者は既にログインできるため、対象の申請を sys_id で指定するだけでよい。
 * 他社の申請を開けないことは ApplicationDefectUtil.find がクエリ側で担保している。
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
    var fixPage = gs.getProperty('x_dent2_dentsusoke.page.app_defect_fix', 'x_dent2_dentsusoke_app_fix')

    var url =
        instanceUrl + portalSuffix + '?id=' + fixPage + '&sys_id=' + current.getUniqueValue()

    template.print(url)
})(current, template, email, email_action)
