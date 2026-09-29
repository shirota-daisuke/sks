/**
 * 信用調査 ③アクション「信用調査を実施する」（画面イメージ ITCOM-08 ①要否判定）
 *
 * 一次審査完了／信用調査要否判定中 → 外部調査準備中（ext_preparing）へ遷移させ、
 * 調査レコード（x_dent2_dentsusoke_credit）を1件作成する。
 * 作成した調査レコードのフォームから外部機関への依頼を登録する。
 *
 * 要否の判断材料（補助金額としきい値・前年度採択実績）は
 * ApplicationCreditUtil.suggest が提示する。判定そのものは事務局が行うため、
 * 本アクションは推奨結果に関わらず実行できる。
 *
 * 妥当性の判定は ApplicationCreditUtil 側でも行う（UI Action の condition は
 * 表示制御であり、実行時の保証にはならないため）。
 */
;(function () {
    var result = new x_dent2_dentsusoke.ApplicationCreditUtil().judge(
        current.getUniqueValue(),
        gs.getUserID(),
        true,
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
