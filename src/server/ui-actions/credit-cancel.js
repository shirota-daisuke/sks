/**
 * 信用調査 ③アクション「調査を取り消す」（画面イメージ ITCOM-08）
 *
 * 依頼の誤り・調査機関の変更などでやり直す場合に使う。
 * 調査の状態を取消へ、申請を信用調査要否判定中（credit_judging）へ戻し、
 * 要否判定からやり直せるようにする。
 *
 * 取消の理由は「事務局メモ」（u_note）の入力値を読み、処理履歴へ残す。
 * 結果を取り込んだ調査は取消できない（記録を消さないため）。
 */
;(function () {
    var result = new x_dent2_dentsusoke.ApplicationCreditUtil().cancel(
        current.getUniqueValue(),
        gs.getUserID(),
        current.getValue('u_note'),
    )

    if (!result.success) {
        gs.addErrorMessage(result.errors.join(' '))
        action.setRedirectURL(current)
        return
    }

    gs.addInfoMessage(result.message)

    // 更新後の値を表示するためレコードを開き直す
    action.setRedirectURL(current)
})()
