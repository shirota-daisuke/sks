/**
 * SC-14 問合せ管理・返信：③アクション「未回答に戻す」
 *
 * 回答内容を訂正するために状態を「未回答」へ差し戻す。
 * テーブル定義書 T12 は「1問合せ＝1回答」の単一回答モデルであり、
 * 回答済の問合せへ重ねて返信できないため、訂正はこの操作を経由する。
 */
;(function reopenInquiry(current) {
    var result = new x_dent2_dentsusoke.InquiryAdminUtil().reopen(current.getUniqueValue())

    if (!result.success) {
        gs.addErrorMessage(result.errors.join(' '))
        return
    }

    gs.addInfoMessage(result.message)
})(current)
