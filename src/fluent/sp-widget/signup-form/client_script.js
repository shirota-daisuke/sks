/**
 * SC-03 本登録画面 — クライアントスクリプト
 *
 * ③アクション No.1「本登録を完了する」ボタン（F5 利用規約同意がチェック済みの場合のみ有効）
 * 成功時は「登録申請審査中」の案内メッセージを画面内に表示する（画面遷移はしない）。
 */
api.controller = function () {
    var c = this

    c.submitting = false
    c.serverErrors = []

    c.form = {
        business_name: '',
        entity_type: 'corporate',
        corporate_number: '',
        password: '',
        password_confirm: '',
        agreed: false,
    }

    /** 法人番号／本人識別情報の入力ヒント（事業者区分により異なる） */
    c.identifierHint = function () {
        return c.form.entity_type === 'corporate' ? '13桁の数字' : '半角英数字13桁以内'
    }

    c.passwordMismatch = function () {
        return !!c.form.password && !!c.form.password_confirm && c.form.password !== c.form.password_confirm
    }

    c.canSubmit = function () {
        return (
            !c.submitting &&
            c.form.agreed === true &&
            !!c.form.business_name &&
            !!c.form.entity_type &&
            !!c.form.corporate_number &&
            !!c.form.password &&
            !!c.form.password_confirm &&
            !c.passwordMismatch()
        )
    }

    c.submit = function () {
        c.serverErrors = []
        if (!c.canSubmit()) {
            return
        }

        c.submitting = true

        // c.server.update() は呼び出し時点の c.data を input として送るため、先に c.data へ載せる
        c.data.action = 'signup'
        c.data.token = c.data.token
        c.data.business_name = c.form.business_name
        c.data.entity_type = c.form.entity_type
        c.data.corporate_number = c.form.corporate_number
        c.data.password = c.form.password
        c.data.password_confirm = c.form.password_confirm
        c.data.agreed = c.form.agreed

        c.server.update().then(function () {
            c.submitting = false
            c.data.action = null
            // パスワードをクライアント側・data 上に残さない
            c.data.password = null
            c.data.password_confirm = null

            var result = c.data.result
            if (result && result.success) {
                c.form.password = ''
                c.form.password_confirm = ''
            } else if (result && result.errors) {
                c.serverErrors = result.errors
            } else if (c.data.state === 'form') {
                c.serverErrors = ['本登録に失敗しました。時間をおいて再度お試しください。']
            }
        })
    }
}
