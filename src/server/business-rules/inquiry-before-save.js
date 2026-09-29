/**
 * SC-14 問合せ管理・返信：保存時の整合性確保
 *
 * ワークスペースのレコードフォーム・リストのインライン編集・REST いずれの経路でも
 * 「状態＝回答済かつ回答本文が空」「回答済なのに回答日時が空」の問合せを作らないよう、
 * before insert／update のビジネスルールで担保する。
 * 状態と他項目の関係は Data Policy・UI Policy では表現できないためビジネスルールで判定する。
 *
 * 検証内容は InquiryAdminUtil.validateReply に集約している
 * （UI Action「返信する」からも同じ検証を呼ぶ）。
 *
 * ポータルからの起票（処理No.46）は状態＝未回答で作成されるため、本ルールの判定対象外となる。
 */
;(function validateInquiryBeforeSave(current) {
    var util = new x_dent2_dentsusoke.InquiryAdminUtil()

    // 受付日時（ポータルからの起票では問合せ作成処理が設定する。辞書の既定値の保険）
    if (!current.getValue('u_received_on')) {
        current.setValue('u_received_on', new GlideDateTime().getValue())
    }

    if (current.getValue('u_state') !== 'answered') {
        return
    }

    var validation = util.validateReply(current.getValue('u_reply_body'))
    if (!validation.valid) {
        gs.addErrorMessage(validation.errors.join(' '))
        current.setAbortAction(true)
        return
    }

    // 回答日時の記録漏れを防ぐ（「返信する」を経由せず状態のみ変更された場合）
    if (!current.getValue('u_replied_on')) {
        current.setValue('u_replied_on', new GlideDateTime().getValue())
    }
})(current)
