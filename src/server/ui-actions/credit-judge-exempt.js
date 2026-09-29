/**
 * 信用調査 ③アクション「信用調査を免除する」（画面イメージ ITCOM-08 ①要否判定）
 *
 * 一次審査完了／信用調査要否判定中 → 信用調査免除（credit_exempt）へ遷移させる。
 * 調査レコードは作成しない（調査を行わないため）。
 * 免除後は採択判定（ITCOM-09）へ進む。
 *
 * 免除条件は未確定であり、判定は事務局が行う。
 *
 * 妥当性の判定は ApplicationCreditUtil 側でも行う（UI Action の condition は
 * 表示制御であり、実行時の保証にはならないため）。
 */
;(function () {
    var result = new x_dent2_dentsusoke.ApplicationCreditUtil().judge(
        current.getUniqueValue(),
        gs.getUserID(),
        false,
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
