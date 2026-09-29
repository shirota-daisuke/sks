/**
 * 採択判定 ③アクション「採択として確定する」（画面イメージ ITCOM-09）
 *
 * 信用調査結果確認中／信用調査免除 → 申請審査完了（review_done）へ遷移させ、
 * 採択番号を採番して交付決定額を確定する。
 *
 * 入力はフォームの値を読む。
 *   査定後の対象経費   u_approved_expense_amount  任意。未入力なら申請時の対象経費を使う
 *   判定理由・特記事項 u_decision_note            任意
 *
 * 確定操作は事務局管理者（staff_admin）のみ実行できる（権限設計書 A20）。
 * 権限の検証は ApplicationAwardUtil 側でも行う（UI Action の condition は
 * 表示制御であり、実行時の保証にはならないため）。
 *
 * 本遷移により SC-17「採択者一覧」帳票・SC-15 ダッシュボード・
 * RPA の添付ファイル転送（申請審査完了が契機）が動くようになる。
 */
;(function () {
    var result = new x_dent2_dentsusoke.ApplicationAwardUtil().approve(
        current.getUniqueValue(),
        gs.getUserID(),
        current.getValue('u_approved_expense_amount'),
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

    // 更新後の値（採択番号・交付決定額）を表示するためレコードを開き直す
    action.setRedirectURL(current)
})()
