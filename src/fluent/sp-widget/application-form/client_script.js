/**
 * 申請入力（基本情報）画面 — クライアントスクリプト（処理No.16／No.17）
 *
 * ③アクション No.1「入力内容を保存」
 *
 * 提出はこの画面では行わない（入口は内容確認・提出＝ITCOM-04 に限る）。
 */
api.controller = function ($window) {
    var c = this

    c.saving = false
    c.serverErrors = []
    c.saved = false

    c.form = {
        organization_type: '',
        employee_category: '',
        // input[type=month] のモデルは Date オブジェクト（下の toDate／toMonthText 参照）
        sales_increase_target_month: null,
        sales_increase_rate: '',
        special_measure: false,
    }

    // 下書きがあれば初期値として復元する
    if (c.data.draft) {
        c.form.organization_type = c.data.draft.organizationType || ''
        c.form.employee_category = c.data.draft.employeeCategory || ''
        c.form.sales_increase_target_month = toDate(c.data.draft.salesIncreaseTargetMonth)
        c.form.sales_increase_rate = c.data.draft.salesIncreaseRate || ''
        c.form.special_measure = c.data.draft.specialMeasure === true
    }

    /**
     * 売上増加率対象月の値の持ち方。
     *
     * AngularJS の input[type=month]（input[type=date] も同じ）は
     * ng-model に Date オブジェクトを入れる仕様であり、次の2点に注意が必要になる。
     *   ・文字列を入れると ngModel:datefmt エラーになり、入力欄に値が表示されない
     *     （下書きを読み込んでも対象月が空で表示される）
     *   ・Date のまま送るとサーバーへは JSON 変換された UTC の日時文字列
     *     （例 2026-05-31T15:00:00.000Z）が届く。サーバーは年月しか受け付けないため
     *     「売上増加率対象月は年月を選択してください」で弾かれる。
     *     先頭10文字を採る対処は、JST の月初が UTC では前月末日になるため月がずれる。
     * そのため表示用は Date、送信用は文字列と、変換を明示して扱う。
     */

    /** 保存済みの yyyy-MM-dd を入力欄用の Date にする */
    function toDate(text) {
        var matched = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(text || '')
        if (!matched) {
            return null
        }
        // new Date('2026-06-01') は UTC として解釈され JST では前日になるため数値から組み立てる
        return new Date(parseInt(matched[1], 10), parseInt(matched[2], 10) - 1, 1)
    }

    /** 入力欄の Date をサーバーへ送る yyyy-MM-01 の文字列にする */
    function toMonthText(value) {
        if (!value) {
            return ''
        }
        // 下書きの値が Date へ変換できなかった場合に文字列のまま残ることがある
        if (typeof value === 'string') {
            return value
        }
        if (typeof value.getFullYear !== 'function') {
            return ''
        }
        var month = value.getMonth() + 1
        return value.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-01'
    }

    /**
     * 未保存の入力があるかの判定。
     *
     * 対象経費（ITCOM-02）・添付書類（ITCOM-03）・内容確認（ITCOM-04）はいずれも
     * 保存済みの申請レコードを読む。入力しただけで保存していない値は
     * それらの画面に渡らないため、未保存のまま遷移させない・遷移前に保存することで
     * 「入力したのに未入力と案内される」状態を防ぐ。
     */
    var savedSnapshot = snapshot()

    function snapshot() {
        return angular.toJson(c.form)
    }

    c.isDirty = function () {
        return snapshot() !== savedSnapshot
    }

    /** 次の画面へ進める条件（保存してから進むため下書きの有無は問わない） */
    c.canProceed = function () {
        return !c.saving
    }

    /** c.server.update() は呼び出し時点の c.data を input として送るため、先に c.data へ載せる */
    function applyForm(action) {
        c.data.action = action
        c.data.organization_type = c.form.organization_type
        c.data.employee_category = c.form.employee_category
        c.data.sales_increase_target_month = toMonthText(c.form.sales_increase_target_month)
        c.data.sales_increase_rate = c.form.sales_increase_rate
        c.data.special_measure = c.form.special_measure
        // total_expense は送らない（明細から算出するため）
    }

    /**
     * 下書きの保存。
     * 成功したときだけ onSuccess を呼ぶ（保存できていないまま遷移させないため）。
     */
    function doSave(onSuccess) {
        c.serverErrors = []
        c.saved = false
        if (c.saving) {
            return
        }
        c.saving = true
        applyForm('save_draft')

        c.server.update().then(function () {
            c.saving = false
            c.data.action = null

            var result = c.data.saveResult
            if (result && result.success) {
                c.saved = true
                savedSnapshot = snapshot()
                if (onSuccess) {
                    onSuccess()
                }
            } else if (result && result.errors) {
                c.serverErrors = result.errors
            }
        })
    }

    /** ③No.1 入力内容を保存 */
    c.saveDraft = function () {
        doSave(null)
    }

    /**
     * 保存してから指定の画面へ進む。
     *
     * 入力しただけで保存していない値は次の画面へ渡らないため、遷移の前に必ず保存する。
     * 保存に失敗した場合は遷移しない（エラーを見せたまま入力を保持する）。
     */
    c.saveAndGo = function (url) {
        if (!url || c.saving) {
            return
        }

        // 変更が無く下書きも存在する場合は保存せずに遷移する（不要な更新を避ける）
        if (!c.isDirty() && c.data.draft) {
            $window.location.href = url
            return
        }

        doSave(function () {
            $window.location.href = url
        })
    }
}
