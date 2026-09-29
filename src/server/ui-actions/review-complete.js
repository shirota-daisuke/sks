/**
 * 一次審査 ③アクション「一次審査を完了する」（画面イメージ ITCOM-07）
 *
 * 一次審査中／再審査中 → 一次審査完了（first_review_done）へ遷移させる。
 * 審査理由・特記事項（u_review_note）はフォームの入力値をそのまま記録する（任意）。
 *
 * 妥当性の判定は ApplicationReviewUtil 側でも行う（UI Action の condition は
 * 表示制御であり、実行時の保証にはならないため）。
 */
;(function () {
    var result = new x_dent2_dentsusoke.ApplicationReviewUtil().complete(
        current.getUniqueValue(),
        gs.getUserID(),
        current.getValue('u_review_note'),
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
