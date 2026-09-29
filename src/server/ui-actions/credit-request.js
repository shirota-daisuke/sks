/**
 * 信用調査 ③アクション「外部機関へ依頼する」（画面イメージ ITCOM-08 ②調査依頼）
 *
 * 調査レコード（x_dent2_dentsusoke_credit）側の操作。
 * 調査の状態を準備中 → 依頼済（調査中）へ、
 * 申請を外部調査準備中 → 外部信用調査中（ext_reviewing）へ遷移させる。
 *
 * 入力はフォームの値を読む。
 *   調査機関     u_agency  必須
 *   回答予定日   u_due_on  任意。未入力の場合は依頼日＋既定日数で設定する
 *
 * 依頼書ファイルの授受はシステム外で行う（外部審査員にはアカウントを付与しない方針：A17）。
 */
;(function () {
    var result = new x_dent2_dentsusoke.ApplicationCreditUtil().request(
        current.getUniqueValue(),
        gs.getUserID(),
        current.getValue('u_agency'),
        current.getValue('u_due_on'),
    )

    if (!result.success) {
        gs.addErrorMessage(result.errors.join(' '))
        action.setRedirectURL(current)
        return
    }

    gs.addInfoMessage(result.message)
    for (var i = 0; i < result.warnings.length; i++) {
        gs.addInfoMessage(result.warnings[i])
    }

    // 更新後の値を表示するためレコードを開き直す
    action.setRedirectURL(current)
})()
