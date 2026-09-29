/**
 * SC-14 問合せ管理・返信：③アクション「自分が対応する」
 *
 * 対応者（T12 u_assigned_staff）に自分を設定する。
 * 複数の事務局ユーザが同じ問合せを同時に対応することを避けるための取得操作であり、
 * 「問合せ（自分の担当）」リストの絞込条件にも使われる。
 */
;(function assignInquiryToMe(current) {
    var result = new x_dent2_dentsusoke.InquiryAdminUtil().assignToMe(current.getUniqueValue())

    if (!result.success) {
        gs.addErrorMessage(result.errors.join(' '))
        return
    }

    gs.addInfoMessage(result.message)
})(current)
