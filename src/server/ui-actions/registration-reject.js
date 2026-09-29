/**
 * SC-11 ユーザ登録審査：③アクション No.2「却下」
 *
 * 登録審査（承認・却下）処理（処理No.6）。
 * ステータスを「登録不可」（終端状態）へ確定する。applicant ロールは付与しない。
 * 遷移の妥当性判定は RegistrationReviewUtil に集約している。
 */
;(function rejectRegistration(current) {
    var result = new x_dent2_dentsusoke.RegistrationReviewUtil().reject(current.getUniqueValue())

    if (!result.success) {
        gs.addErrorMessage(result.errors.join(' '))
        return
    }

    gs.addInfoMessage(result.message)
})(current)
