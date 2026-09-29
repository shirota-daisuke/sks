/**
 * SC-11 ユーザ登録審査：③アクション No.1「承認」
 *
 * 登録審査（承認・却下）処理（処理No.6）。
 * ステータスを「登録済」へ確定し、権限設計書 2章のロール付与ルールに従い applicant ロールを付与する。
 * 遷移の妥当性判定・ロール付与は RegistrationReviewUtil に集約している。
 *
 * ロールの付与に失敗した場合もステータスの更新は確定するため、警告として画面へ通知する。
 */
;(function approveRegistration(current) {
    var result = new x_dent2_dentsusoke.RegistrationReviewUtil().approve(current.getUniqueValue())

    if (!result.success) {
        gs.addErrorMessage(result.errors.join(' '))
        return
    }

    gs.addInfoMessage(result.message)
    if (result.warnings && result.warnings.length > 0) {
        gs.addErrorMessage(result.warnings.join(' '))
    }
})(current)
