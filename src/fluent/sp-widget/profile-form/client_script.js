/**
 * SC-06 自分の情報参照・変更画面 — クライアントスクリプト
 *
 * ③アクション No.1／No.2「編集する」ボタン → 同画面が編集モードに切り替わる。
 * カード単位（事業者情報／アカウント情報）で参照モードと編集モードを切り替える。
 */
api.controller = function () {
    var c = this

    c.entityMode = 'view' // 'view' | 'edit'
    c.accountMode = 'view'
    c.entitySaving = false
    c.accountSaving = false
    c.entityErrors = []
    c.accountErrors = []
    c.entitySaved = false
    c.accountSaved = false

    c.entityForm = {}
    c.accountForm = {}

    // --- 事業者情報 --------------------------------------------------------
    c.editEntity = function () {
        c.entityErrors = []
        c.entitySaved = false
        c.entityForm = {
            business_name: c.data.entity.business_name,
            address: c.data.entity.address,
            industry: c.data.entity.industry,
            employee_count: c.data.entity.employee_count,
        }
        c.entityMode = 'edit'
    }

    c.cancelEntity = function () {
        c.entityErrors = []
        c.entityMode = 'view'
    }

    c.saveEntity = function () {
        c.entityErrors = []
        if (c.entitySaving) {
            return
        }
        c.entitySaving = true

        // c.server.update() は呼び出し時点の c.data を input として送るため、先に c.data へ載せる
        c.data.action = 'save_entity'
        c.data.business_name = c.entityForm.business_name
        c.data.address = c.entityForm.address
        c.data.industry = c.entityForm.industry
        c.data.employee_count = c.entityForm.employee_count

        c.server.update().then(function () {
            c.entitySaving = false
            c.data.action = null

            var result = c.data.entityResult
            if (result && result.success) {
                c.entityMode = 'view'
                c.entitySaved = true
            } else if (result && result.errors) {
                c.entityErrors = result.errors
            }
        })
    }

    // --- アカウント情報 ----------------------------------------------------
    c.editAccount = function () {
        c.accountErrors = []
        c.accountSaved = false
        c.accountForm = { email: c.data.account.email }
        c.accountMode = 'edit'
    }

    c.cancelAccount = function () {
        c.accountErrors = []
        c.accountMode = 'view'
    }

    c.saveAccount = function () {
        c.accountErrors = []
        if (c.accountSaving) {
            return
        }
        c.accountSaving = true

        c.data.action = 'save_account'
        c.data.email = c.accountForm.email

        c.server.update().then(function () {
            c.accountSaving = false
            c.data.action = null

            var result = c.data.accountResult
            if (result && result.success) {
                c.accountMode = 'view'
                c.accountSaved = true
            } else if (result && result.errors) {
                c.accountErrors = result.errors
            }
        })
    }
}
