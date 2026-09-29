/**
 * SC-13 お知らせ作成・編集：③アクション「非公開にする」
 *
 * 公開状態を「非公開」へ戻し、事業者ポータル（SC-05／SC-08／SC-09）から掲載を取り下げる。
 * お知らせは物理削除しない方針（権限設計書 G4）のため、取り下げは本操作で行う。
 */
;(function unpublishNotice(current) {
    var result = new x_dent2_dentsusoke.NoticeAdminUtil().unpublish(current.getUniqueValue())

    if (!result.success) {
        gs.addErrorMessage(result.errors.join(' '))
        return
    }

    gs.addInfoMessage(result.message)
})(current)
