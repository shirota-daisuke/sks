/**
 * 申請の不備修正（ITCOM-05）— クライアントスクリプト
 *
 * ③アクション No.1「一時保存」／No.2「修正内容を提出する」
 *
 * 再提出は取り消せないため、確認ダイアログを経由させる。
 */
api.controller = function ($window) {
    var c = this

    c.saving = false
    c.submitting = false
    c.serverErrors = []
    c.saved = false

    /** 事務局への回答（修正内容の説明）。保存済みの内容を初期値にする */
    c.reply = c.data.defect ? c.data.defect.defectReply : ''

    /** 入力済みの文字数（上限に近づいたことを示すため） */
    c.replyLength = function () {
        return (c.reply || '').length
    }

    c.canSave = function () {
        return !c.saving && !c.submitting
    }

    /**
     * 再提出できる条件。
     * 対象経費・添付書類の不足（c.data.blockers）はサーバー側で判定済み。
     * 回答は保存前の入力があるため画面側で見る。
     */
    c.canSubmit = function () {
        return (
            !c.saving &&
            !c.submitting &&
            c.data.blockers.length === 0 &&
            !!(c.reply || '').trim() &&
            c.replyLength() <= c.data.maxReplyLength
        )
    }

    /** ③No.1 一時保存 */
    c.save = function () {
        c.serverErrors = []
        c.saved = false
        if (!c.canSave()) {
            return
        }

        c.saving = true
        c.data.action = 'save_reply'
        c.data.reply = c.reply

        c.server.update().then(function () {
            c.saving = false
            c.data.action = null

            var result = c.data.saveResult
            if (result && result.success) {
                c.saved = true
            } else if (result && result.errors) {
                c.serverErrors = result.errors
            }
        })
    }

    /** ③No.2 修正内容を提出する */
    c.submit = function () {
        c.serverErrors = []
        c.saved = false
        if (!c.canSubmit()) {
            return
        }

        // 再提出後は事業者側から変更できないため確認を取る
        if (!$window.confirm('修正内容を提出します。提出後は内容を変更できません。よろしいですか？')) {
            return
        }

        c.submitting = true
        c.data.action = 'submit_fix'
        c.data.reply = c.reply

        c.server.update().then(function () {
            c.submitting = false
            c.data.action = null

            var result = c.data.submitResult
            if (result && !result.success && result.errors) {
                c.serverErrors = result.errors
            }
        })
    }
}
