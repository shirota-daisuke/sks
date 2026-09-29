/**
 * 一次審査 ③アクション「不備修正を依頼する」（画面イメージ ITCOM-07）
 *
 * 一次審査中／再審査中 → 不備確認依頼（defect_request）へ遷移させ、
 * 申請者へ不備内容と修正画面（ITCOM-05）へのリンクを含むメールを送信する。
 *
 * 入力はフォームの値を読む（SC-11 の「不備修正を依頼」と同じ構成）。
 *   不備内容   u_defect_note    必須。メール本文にそのまま記載される
 *   回答期限   u_defect_due_on  任意。未入力の場合は依頼日＋既定日数で設定する
 *
 * 妥当性の判定は ApplicationReviewUtil 側でも行う（UI Action の condition は
 * 表示制御であり、実行時の保証にはならないため）。
 */
;(function () {
    var result = new x_dent2_dentsusoke.ApplicationReviewUtil().requestDefect(
        current.getUniqueValue(),
        gs.getUserID(),
        current.getValue('u_defect_note'),
        current.getValue('u_defect_due_on'),
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
