/**
 * 採択判定 ③アクション「不採択として確定する」（画面イメージ ITCOM-09）
 *
 * 信用調査結果確認中／信用調査免除 → 不採択（rejected）へ遷移させる。
 * 終端状態であり、確定後は申請者側から再申請・修正ができない。
 *
 * 入力はフォームの値を読む。
 *   不採択理由区分                 u_reject_reason_code  必須
 *   不採択理由・申請者への通知文   u_reject_reason       必須
 *
 * 確定操作は事務局管理者（staff_admin）のみ実行できる（権限設計書 A20）。
 * 権限の検証は ApplicationAwardUtil 側でも行う。
 */
;(function () {
    var result = new x_dent2_dentsusoke.ApplicationAwardUtil().reject(
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
