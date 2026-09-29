/**
 * 一次審査 ③アクション「自分が審査を担当する」（画面イメージ ITCOM-06）
 *
 * 審査担当者を自分に設定し、審査を開始する。
 *   受付済（accepted）           → 一次審査中（first_review）
 *   不備修正回答あり（defect_answered） → 再審査中（re_review）
 *
 * 判定（一次審査完了／不備確認依頼／不採択）は ITCOM-07 の範囲であり本アクションには含まない。
 *
 * 妥当性の判定は ApplicationReviewUtil 側でも行う（UI Action の condition は
 * 表示制御であり、実行時の保証にはならないため）。
 */
;(function () {
    var result = new x_dent2_dentsusoke.ApplicationReviewUtil().assign(
        current.getUniqueValue(),
        gs.getUserID(),
        gs.getUserID(),
    )

    if (!result.success) {
        gs.addErrorMessage(result.errors.join(' '))
        action.setRedirectURL(current)
        return
    }

    gs.addInfoMessage(result.message)

    /**
     * 更新後の値を表示するためレコードを開き直す。
     * current は本アクションの外で更新されているため、リダイレクトしないと
     * 画面のステータス・担当者が古いまま残る。
     */
    action.setRedirectURL(current)
})()
