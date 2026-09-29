/**
 * 登録不備修正画面 — クライアントスクリプト（処理No.7 の事業者側）
 *
 * ③アクション No.1「修正内容を提出する」
 * 成功時は「登録申請審査中」の案内メッセージを画面内に表示する（画面遷移はしない）。
 * 実装は SC-03 本登録（signup-form）のクライアントスクリプトと同じ方針。
 */
api.controller = function () {
    var c = this

    c.submitting = false
    c.serverErrors = []

    c.form = {
        business_name: '',
        entity_type: 'corporate',
        corporate_number: '',
    }

    // フォーム表示時は現在の登録内容を初期値として埋める（どこを直すのか分かるようにする）
    if (c.data.context) {
        c.form.business_name = c.data.context.businessName || ''
        c.form.entity_type = c.data.context.entityType || 'corporate'
        c.form.corporate_number = c.data.context.corporateNumber || ''
    }

    /** 法人番号／本人識別情報の入力ヒント（事業者区分により異なる） */
    c.identifierHint = function () {
        return c.form.entity_type === 'corporate' ? '13桁の数字' : '半角英数字13桁以内'
    }

    c.canSubmit = function () {
        return (
            !c.submitting &&
            !!c.form.business_name &&
            !!c.form.entity_type &&
            !!c.form.corporate_number
        )
    }

    c.submit = function () {
        c.serverErrors = []
        if (!c.canSubmit()) {
            return
        }

        c.submitting = true

        // c.server.update() は呼び出し時点の c.data を input として送るため、先に c.data へ載せる
        c.data.action = 'submit_fix'
        c.data.business_name = c.form.business_name
        c.data.entity_type = c.form.entity_type
        c.data.corporate_number = c.form.corporate_number

        c.server.update().then(function () {
            c.submitting = false
            c.data.action = null

            var result = c.data.result
            if (result && !result.success && result.errors) {
                c.serverErrors = result.errors
            } else if (result && !result.success) {
                c.serverErrors = ['再提出に失敗しました。時間をおいて再度お試しください。']
            }
        })
    }
}
