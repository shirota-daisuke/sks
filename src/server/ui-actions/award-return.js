/**
 * 採択判定 ③アクション「一次審査へ差し戻す」（画面イメージ ITCOM-09）
 *
 * 確定の直前に審査のやり直しが必要と判断した場合に使う。
 * 信用調査結果確認中／信用調査免除 → 一次審査中（first_review）へ戻す。
 *
 * 差し戻しの理由は「採択判定の理由・特記事項」（u_decision_note）の入力値を読み、
 * 処理履歴へ残す。一次審査の判定と審査日時は消去する
 * （残すと「差し戻したのに完了扱いの判定が残っている」状態になる）。
 *
 * 確定操作は事務局管理者（staff_admin）のみ実行できる（権限設計書 A20）。
 */
;(function () {
    var result = new x_dent2_dentsusoke.ApplicationAwardUtil().returnToReview(
        current.getUniqueValue(),
        gs.getUserID(),
        current.getValue('u_decision_note'),
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
