/**
 * SC-13 お知らせ作成・編集：③アクション「公開する」
 *
 * 公開状態を「公開」へ確定する。公開期間・本文の妥当性は NoticeAdminUtil で再検証する
 * （UI Action の condition は表示制御であり、実行時の妥当性判定はサーバー側で行う）。
 *
 * メール通知有無が「あり」の場合、通知テンプレートが未確定のためメールは送信されない。
 * 事務局が通知されたと誤認しないよう、警告として画面へ通知する。
 */
;(function publishNotice(current) {
    var result = new x_dent2_dentsusoke.NoticeAdminUtil().publish(current.getUniqueValue())

    if (!result.success) {
        gs.addErrorMessage(result.errors.join(' '))
        return
    }

    gs.addInfoMessage(result.message)
    if (result.warnings && result.warnings.length > 0) {
        gs.addErrorMessage(result.warnings.join(' '))
    }
})(current)
