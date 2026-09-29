/**
 * SC-13 お知らせ作成・編集：保存時の検証と作成者の補完
 *
 * ワークスペースのレコードフォーム・リストのインライン編集・REST いずれの経路でも
 * 同じ検証を通すため、画面側ではなく before insert／update のビジネスルールで判定する。
 *
 * 検証内容は NoticeAdminUtil.validate に集約している（UI Action「公開する」からも同じ検証を呼ぶ）。
 * 宣言的に表現できないのは公開期間の前後関係（公開終了日 ＜ 公開開始日）であり、
 * これは Data Policy・UI Policy では表現できないためビジネスルールで判定する。
 *
 * 作成者（u_created_by_staff）は必須項目かつ画面で入力させない項目のため、
 * 未設定の場合に操作中のユーザで補完する（フォームからの登録は辞書の既定値で埋まる）。
 */
;(function validateNoticeBeforeSave(current) {
    var util = new x_dent2_dentsusoke.NoticeAdminUtil()

    if (!current.getValue('u_created_by_staff')) {
        current.setValue('u_created_by_staff', gs.getUserID())
    }

    var result = util.validate(current)
    if (!result.valid) {
        gs.addErrorMessage(result.errors.join(' '))
        current.setAbortAction(true)
    }
})(current)
