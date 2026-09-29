/**
 * 対象経費の入力（ITCOM-02）— クライアントスクリプト
 *
 * ③アクション No.1「明細を追加」／「明細を更新」／No.2「削除」
 *
 * ■ 入力方式
 * 全行をインライン編集にすると、どの行が未保存か分からなくなり
 * 日額上限の検証結果もどの行のものか判別しづらい。
 * そのため「一覧＋1行ぶんの入力フォーム」の構成とし、
 * 行の「編集」でフォームへ読み込む形にしている。
 */
api.controller = function ($window) {
    var c = this

    c.saving = false
    c.removing = false
    c.serverErrors = []
    c.saved = false
    c.editingId = ''

    c.form = {
        category_id: '',
        description: '',
        amount: '',
        days: '',
        expert_fee_id: '',
        note: '',
    }

    /** 選択中の経費区分が日額上限ありか（日数・専門家区分の入力可否を切り替える） */
    c.hasDailyCap = function () {
        if (!c.form.category_id) {
            return false
        }
        for (var i = 0; i < c.data.categories.length; i++) {
            if (c.data.categories[i].sys_id === c.form.category_id) {
                return c.data.categories[i].hasDailyCap === true
            }
        }
        return false
    }

    /** 経費区分を変えたとき、日額上限なしの区分では日数・専門家区分を空にする */
    c.onCategoryChange = function () {
        if (!c.hasDailyCap()) {
            c.form.days = ''
            c.form.expert_fee_id = ''
        }
    }

    c.canSave = function () {
        return !c.saving && !!c.form.category_id && !!c.form.description && !!c.form.amount
    }

    c.isEditing = function () {
        return !!c.editingId
    }

    /** 行の「編集」：フォームへ読み込む */
    c.edit = function (item) {
        c.serverErrors = []
        c.saved = false
        c.editingId = item.sys_id
        c.form.category_id = item.categoryId
        c.form.description = item.description
        c.form.amount = '' + item.amount
        c.form.days = item.days === '' ? '' : '' + item.days
        c.form.expert_fee_id = item.expertFeeId || ''
        c.form.note = item.note || ''
    }

    c.cancelEdit = function () {
        c.editingId = ''
        c.resetForm()
    }

    c.resetForm = function () {
        c.form = {
            category_id: '',
            description: '',
            amount: '',
            days: '',
            expert_fee_id: '',
            note: '',
        }
    }

    /** c.server.update() は呼び出し時点の c.data を input として送るため、先に c.data へ載せる */
    function applyForm(action) {
        c.data.action = action
        c.data.item_id = c.editingId
        c.data.category_id = c.form.category_id
        c.data.description = c.form.description
        c.data.amount = c.form.amount
        c.data.days = c.form.days
        c.data.expert_fee_id = c.form.expert_fee_id
        c.data.note = c.form.note
    }

    /** ③No.1 明細の追加・更新 */
    c.save = function () {
        c.serverErrors = []
        c.saved = false
        if (!c.canSave()) {
            return
        }
        c.saving = true
        applyForm('save_item')

        c.server.update().then(function () {
            c.saving = false
            c.data.action = null

            var result = c.data.saveResult
            if (result && result.success) {
                c.saved = true
                c.editingId = ''
                c.resetForm()
            } else if (result && result.errors) {
                c.serverErrors = result.errors
            }
        })
    }

    /** ③No.2 明細の削除 */
    c.remove = function (item) {
        c.serverErrors = []
        c.saved = false
        if (c.removing) {
            return
        }
        if (!$window.confirm('「' + item.description + '」を削除します。よろしいですか？')) {
            return
        }

        c.removing = true
        c.data.action = 'remove_item'
        c.data.item_id = item.sys_id

        c.server.update().then(function () {
            c.removing = false
            c.data.action = null
            c.data.item_id = null

            var result = c.data.saveResult
            if (result && result.success) {
                c.saved = true
                // 編集中の行を削除した場合はフォームを初期化する
                if (c.editingId === item.sys_id) {
                    c.editingId = ''
                    c.resetForm()
                }
            } else if (result && result.errors) {
                c.serverErrors = result.errors
            }
        })
    }
}
