/**
 * 信用調査 ③アクション「調査結果を取り込む」（画面イメージ ITCOM-08 ③結果取込）
 *
 * 調査の状態を依頼済（調査中）→ 結果受領へ、
 * 申請を外部信用調査中／調査結果取込待ち → 信用調査結果確認中（result_checking）へ遷移させる。
 *
 * 入力はフォームの値を読む。
 *   調査結果     u_result  必須（問題なし／条件付き／問題あり）
 *   事務局メモ   u_note    任意
 *
 * 受領した結果ファイルは本レコードへ添付する（授受はシステム外）。
 * 結果が「問題あり」の場合に自動で不採択にはしない（採択判定＝ITCOM-09 で事務局が判断する）。
 */
;(function () {
    var result = new x_dent2_dentsusoke.ApplicationCreditUtil().receive(
        current.getUniqueValue(),
        gs.getUserID(),
        current.getValue('u_result'),
        current.getValue('u_note'),
    )

    if (!result.success) {
        gs.addErrorMessage(result.errors.join(' '))
        action.setRedirectURL(current)
        return
    }

    gs.addInfoMessage(result.message)
    for (var i = 0; i < result.warnings.length; i++) {
        gs.addErrorMessage(result.warnings[i])
    }

    // 更新後の値を表示するためレコードを開き直す
    action.setRedirectURL(current)
})()
