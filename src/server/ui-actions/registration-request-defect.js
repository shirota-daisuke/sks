/**
 * SC-11 ユーザ登録審査：③アクション No.3「不備修正を依頼」
 *
 * 登録不備対応処理（処理No.7）。
 * ステータスを「登録不備確認依頼」へ遷移させ、事務局が記載した不備内容を保持する。
 *
 * 不備内容はレコードフォームの「登録不備内容」（u_registration_issue_note）へ入力してから実行する。
 * サーバーサイドの UI Action は未保存のフォーム値を current から参照できるため、
 * 入力直後にボタンを押しても入力値が渡る。未入力の場合は RegistrationReviewUtil 側で拒否する。
 */
;(function requestDefectFix(current) {
    var review = new x_dent2_dentsusoke.RegistrationReviewUtil()
    var result = review.requestDefectFix(current.getUniqueValue(), current.getValue('u_registration_issue_note'))

    if (!result.success) {
        gs.addErrorMessage(result.errors.join(' '))
        return
    }

    gs.addInfoMessage(result.message)
})(current)
