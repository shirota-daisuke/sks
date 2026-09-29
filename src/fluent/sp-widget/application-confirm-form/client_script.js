/**
 * 申請の内容確認・提出（ITCOM-04）— クライアントスクリプト
 *
 * ③アクション No.1「申請を提出する」
 *
 * 提出は取り消せないため、同意事項のチェックと確認ダイアログの2段で受ける。
 * 入力値は送らない（提出する内容は下書きのレコードを正とする）。
 */
api.controller = function ($window) {
    var c = this

    c.submitting = false
    c.serverErrors = []

    /**
     * 同意事項のチェック状態。
     * 同意事項は文面が未確定でオプションから差し替えるため、件数を固定しない。
     */
    c.consent = []

    /** すべての同意事項にチェックが付いているか */
    c.isConsented = function () {
        if (!c.data.consentItems || c.data.consentItems.length === 0) {
            return false
        }
        for (var i = 0; i < c.data.consentItems.length; i++) {
            if (c.consent[i] !== true) {
                return false
            }
        }
        return true
    }

    /**
     * 提出できる条件。
     * 不足している項目（c.data.blockers）はサーバー側で判定済みのため、
     * ここでは同意の有無だけを見る。
     */
    c.canSubmit = function () {
        return !c.submitting && c.data.blockers.length === 0 && c.isConsented()
    }

    /** ③No.1 申請を提出する */
    c.submit = function () {
        c.serverErrors = []
        if (!c.canSubmit()) {
            return
        }

        // 提出後は事業者側から変更できないため確認を取る
        if (!$window.confirm('申請を提出します。提出後は内容を変更できません。よろしいですか？')) {
            return
        }

        c.submitting = true
        c.data.action = 'submit'
        c.data.consent = true

        c.server.update().then(function () {
            c.submitting = false
            c.data.action = null
            c.data.consent = null

            var result = c.data.submitResult
            if (result && !result.success && result.errors) {
                c.serverErrors = result.errors
                // 提出に失敗した場合はチェックを外し、内容を見直してから再提出させる
                c.consent = []
            }
        })
    }
}
