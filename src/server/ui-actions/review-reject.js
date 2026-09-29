/**
 * 一次審査 ③アクション「不採択にする」（画面イメージ ITCOM-07）
 *
 * 一次審査中／再審査中 → 不採択（rejected）へ遷移させる。終端状態であり戻せない。
 *
 * 入力はフォームの値を読む。
 *   不採択理由区分                 u_reject_reason_code  必須
 *   不採択理由・申請者への通知文   u_reject_reason       必須
 *
 * 理由を必須にしているのは、SC-11 のユーザ登録審査で「却下理由を記録する項目が無く
 * 後から追えない」という問題が TODO として残っているため、申請側で同じ状態にしないため。
 *
 * 妥当性の判定は ApplicationReviewUtil 側でも行う（UI Action の condition は
 * 表示制御であり、実行時の保証にはならないため）。
 */
;(function () {
    var result = new x_dent2_dentsusoke.ApplicationReviewUtil().reject(
        current.getUniqueValue(),
        gs.getUserID(),
        current.getValue('u_reject_reason_code'),
        current.getValue('u_reject_reason'),
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
