/**
 * SC-14 問合せ管理・返信：③アクション「返信する」
 *
 * 問合せ返信処理（処理No.47）。
 * 回答本文を保存し、状態を「回答済」へ、回答日時を現在時刻へ確定する。
 *
 * 回答本文・対応者はレコードフォームへ入力してから実行する。
 * サーバーサイドの UI Action は未保存のフォーム値を current から参照できるため、
 * 入力直後にボタンを押しても入力値が渡る（SC-11「不備修正を依頼」と同じ方式）。
 * 未入力の場合は InquiryAdminUtil 側で拒否する。
 *
 * メール通知は要否が未確定のため送信されない。事務局が通知されたと誤認しないよう警告として通知する。
 */
;(function replyInquiry(current) {
    var inquiry = new x_dent2_dentsusoke.InquiryAdminUtil()
    var result = inquiry.reply(
        current.getUniqueValue(),
        current.getValue('u_reply_body'),
        current.getValue('u_assigned_staff'),
    )

    if (!result.success) {
        gs.addErrorMessage(result.errors.join(' '))
        return
    }

    gs.addInfoMessage(result.message)
    if (result.warnings && result.warnings.length > 0) {
        gs.addErrorMessage(result.warnings.join(' '))
    }
})(current)
