/**
 * ApplicationExpenseUtil
 *
 * 対象経費明細（処理No.18 対象経費登録／ITCOM-02）。
 * 明細の登録・更新・削除と、合計金額の再計算、日額上限の検証を担当する。
 *
 * ■ 合計金額の持ち方
 * 明細の合計は保存のたびに T03 の u_total_expense_amount へ書き戻す。
 * 既存の SC-05／SC-07・SC-17 帳票・SC-15 ダッシュボードが
 * u_total_expense_amount を参照しているため、合計の置き場所は変えない。
 *
 * ■ 日額上限の検証
 * 対象経費区分マスタの u_has_daily_cap が true の区分は、
 * 専門家経費日額上限マスタの u_daily_cap_amount 以内であることを検証する。
 * 判定は「金額 ÷ 日数」で行う。
 * TODO(要確認): 判定単位（1人1日あたりか、延べ日数か）が未確定。
 *
 * ■ 編集できる状態
 * 明細を編集できるのは申請が「申請入力中」または「不備修正中」のときのみ。
 * 提出後に金額が変わると審査の前提が崩れるため、呼び出し元で状態を検証する
 * （canEdit）。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない。
 */
var ApplicationExpenseUtil = Class.create()

/** 明細を編集できる申請ステータス */
ApplicationExpenseUtil.EDITABLE_STATUSES = ['input', 'defect_fixing']

/** 明細1行の金額上限（円）。桁数の誤入力を弾くための上限であり業務上の上限ではない */
ApplicationExpenseUtil.MAX_AMOUNT = 9999999999

/** 1申請あたりの明細行数の上限（画面の描画とクエリ件数を抑えるため） */
ApplicationExpenseUtil.MAX_ITEMS = 50

ApplicationExpenseUtil.prototype = {
    initialize: function () {},

    /** 明細を編集できる申請ステータスか */
    canEdit: function (status) {
        return ApplicationExpenseUtil.EDITABLE_STATUSES.indexOf((status || '') + '') >= 0
    },

    /**
     * 明細の一覧。画面表示用に整形して返す。
     * 併せて日額上限の超過を判定し、行ごとに capError を持たせる。
     */
    list: function (requestId) {
        var rows = []
        if (!requestId) {
            return rows
        }

        var gr = new GlideRecord('x_dent2_dentsusoke_exp_item')
        gr.addQuery('u_request', requestId + '')
        gr.orderBy('u_order')
        gr.orderBy('sys_created_on')
        gr.setLimit(ApplicationExpenseUtil.MAX_ITEMS)
        gr.query()

        while (gr.next()) {
            var amount = parseInt(gr.getValue('u_amount'), 10) || 0
            var days = parseInt(gr.getValue('u_days'), 10)
            var categoryId = gr.getValue('u_expense_category')
            var expertFeeId = gr.getValue('u_expert_fee')

            var check = this.checkDailyCap(categoryId, expertFeeId, amount, days)

            rows.push({
                sys_id: gr.getUniqueValue(),
                categoryId: categoryId,
                categoryName: gr.getDisplayValue('u_expense_category'),
                hasDailyCap: check.hasDailyCap,
                description: gr.getValue('u_description'),
                amount: amount,
                amountLabel: this._addComma(amount),
                days: isNaN(days) ? '' : days,
                expertFeeId: expertFeeId,
                expertFeeName: gr.getDisplayValue('u_expert_fee'),
                note: gr.getValue('u_note') || '',
                order: parseInt(gr.getValue('u_order'), 10) || 100,
                capError: check.ok ? '' : check.message,
            })
        }

        return rows
    },

    /** 明細の合計金額（円） */
    sum: function (requestId) {
        if (!requestId) {
            return 0
        }

        // 件数が上限内に収まる前提で GlideAggregate を使う（トンマナ 3.3.2）
        var agg = new GlideAggregate('x_dent2_dentsusoke_exp_item')
        agg.addQuery('u_request', requestId + '')
        agg.addAggregate('SUM', 'u_amount')
        agg.query()
        if (agg.next()) {
            return parseInt(agg.getAggregate('SUM', 'u_amount'), 10) || 0
        }
        return 0
    },

    /**
     * 日額上限の検証。
     *
     * @return { ok, hasDailyCap, cap, daily, message }
     */
    checkDailyCap: function (categoryId, expertFeeId, amount, days) {
        var result = { ok: true, hasDailyCap: false, cap: 0, daily: 0, message: '' }

        if (!categoryId) {
            return result
        }

        // 経費区分マスタの単一レコード取得（キーが確定しているため get を使用：トンマナ 3.2.3）
        var cat = new GlideRecord('x_dent2_dentsusoke_expense')
        if (!cat.get(categoryId + '')) {
            return result
        }
        if (cat.getValue('u_has_daily_cap') !== '1') {
            return result
        }

        result.hasDailyCap = true

        var d = parseInt(days, 10)
        if (isNaN(d) || d <= 0) {
            result.ok = false
            result.message = '日額上限のある経費区分では日数の入力が必要です。'
            return result
        }

        if (!expertFeeId) {
            result.ok = false
            result.message = '日額上限のある経費区分では専門家区分の選択が必要です。'
            return result
        }

        var fee = new GlideRecord('x_dent2_dentsusoke_expert_fee')
        if (!fee.get(expertFeeId + '')) {
            result.ok = false
            result.message = '専門家区分の基準が見つかりません。事務局へお問い合わせください。'
            return result
        }

        var cap = parseInt(fee.getValue('u_daily_cap_amount'), 10) || 0
        var amt = parseInt(amount, 10) || 0
        var daily = Math.floor(amt / d)

        result.cap = cap
        result.daily = daily

        if (cap > 0 && daily > cap) {
            result.ok = false
            result.message =
                '日額 ' +
                this._addComma(daily) +
                '円 が上限 ' +
                this._addComma(cap) +
                '円/日 を超えています（' +
                fee.getValue('u_name') +
                '）。'
        }

        return result
    },

    /** 明細1行の入力検証 */
    validate: function (input) {
        var errors = []

        var categoryId = this._trim(input && input.category_id)
        var description = this._trim(input && input.description)
        var amount = this._trim(input && input.amount)
        var days = this._trim(input && input.days)
        var expertFeeId = this._trim(input && input.expert_fee_id)

        if (!categoryId) {
            errors.push('経費区分を選択してください。')
        }

        if (!description) {
            errors.push('内容を入力してください。')
        } else if (description.length > 200) {
            errors.push('内容は200文字以内で入力してください。')
        }

        if (!amount) {
            errors.push('金額を入力してください。')
        } else if (!/^[0-9]+$/.test(amount)) {
            errors.push('金額は半角数字で入力してください。')
        } else {
            var amountValue = parseInt(amount, 10)
            if (amountValue <= 0) {
                errors.push('金額は1円以上で入力してください。')
            }
            if (amountValue > ApplicationExpenseUtil.MAX_AMOUNT) {
                errors.push('金額の桁数をご確認ください。')
            }
        }

        if (days && !/^[0-9]+$/.test(days)) {
            errors.push('日数は半角数字で入力してください。')
        }

        if (errors.length > 0) {
            return errors
        }

        // 形式が通ってから日額上限を検証する
        var check = this.checkDailyCap(categoryId, expertFeeId, parseInt(amount, 10), days)
        if (!check.ok) {
            errors.push(check.message)
        }

        return errors
    },

    /**
     * 明細の追加・更新。
     *
     * @param requestId 対象の申請
     * @param input     { item_id（更新時）, category_id, description, amount, days, expert_fee_id, note }
     */
    save: function (requestId, input) {
        if (!requestId) {
            return { success: false, errors: ['対象の申請が指定されていません。'] }
        }

        var errors = this.validate(input)
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        var itemId = this._trim(input && input.item_id)
        var gr
        var isNew = false

        if (itemId) {
            // 自分の申請に属する明細のみ更新できるよう、申請との紐付きをクエリ側で担保する
            // （get() では u_request の条件が適用されない：トンマナ 3.2.3 の例外）
            gr = new GlideRecord('x_dent2_dentsusoke_exp_item')
            gr.addQuery('u_request', requestId + '')
            gr.addQuery('sys_id', itemId)
            gr.setLimit(1)
            gr.query()
            if (!gr.next()) {
                return { success: false, errors: ['対象の明細が見つかりません。'] }
            }
        } else {
            if (this.count(requestId) >= ApplicationExpenseUtil.MAX_ITEMS) {
                return {
                    success: false,
                    errors: ['明細は' + ApplicationExpenseUtil.MAX_ITEMS + '件までです。'],
                }
            }
            gr = new GlideRecord('x_dent2_dentsusoke_exp_item')
            gr.initialize()
            gr.setValue('u_request', requestId + '')
            gr.setValue('u_order', (this.count(requestId) + 1) * 100)
            isNew = true
        }

        gr.setValue('u_expense_category', this._trim(input.category_id))
        gr.setValue('u_description', this._trim(input.description))
        gr.setValue('u_amount', parseInt(this._trim(input.amount), 10))

        var days = this._trim(input.days)
        gr.setValue('u_days', days === '' ? '' : parseInt(days, 10))

        var expertFeeId = this._trim(input.expert_fee_id)
        gr.setValue('u_expert_fee', expertFeeId)
        gr.setValue('u_note', this._trim(input.note))

        var result = isNew ? gr.insert() : gr.update()
        if (!result) {
            gs.error('[SKS] 対象経費明細の保存に失敗しました。request=' + requestId)
            return { success: false, errors: ['明細の保存に失敗しました。時間をおいて再度お試しください。'] }
        }

        var total = this.recalcTotal(requestId)

        return {
            success: true,
            action: isNew ? 'add_item' : 'update_item',
            sys_id: isNew ? result + '' : gr.getUniqueValue(),
            totalExpense: total,
            message: isNew ? '明細を追加しました。' : '明細を更新しました。',
        }
    },

    /** 明細の削除 */
    remove: function (requestId, itemId) {
        if (!requestId || !itemId) {
            return { success: false, errors: ['対象の明細が指定されていません。'] }
        }

        var gr = new GlideRecord('x_dent2_dentsusoke_exp_item')
        gr.addQuery('u_request', requestId + '')
        gr.addQuery('sys_id', itemId + '')
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return { success: false, errors: ['対象の明細が見つかりません。'] }
        }

        if (!gr.deleteRecord()) {
            gs.error('[SKS] 対象経費明細の削除に失敗しました。item=' + itemId)
            return { success: false, errors: ['明細の削除に失敗しました。時間をおいて再度お試しください。'] }
        }

        var total = this.recalcTotal(requestId)
        return { success: true, action: 'remove_item', totalExpense: total, message: '明細を削除しました。' }
    },

    /** 明細の件数 */
    count: function (requestId) {
        if (!requestId) {
            return 0
        }
        var agg = new GlideAggregate('x_dent2_dentsusoke_exp_item')
        agg.addQuery('u_request', requestId + '')
        agg.addAggregate('COUNT')
        agg.query()
        if (agg.next()) {
            return parseInt(agg.getAggregate('COUNT'), 10) || 0
        }
        return 0
    },

    /**
     * 明細の合計を T03 の u_total_expense_amount へ書き戻す。
     * 併せて補助金額（u_subsidy_amount）も再判定して保存する。
     * 対象経費が変わったのに補助金額が古いまま残るのを防ぐため、必ず同時に更新する。
     */
    recalcTotal: function (requestId) {
        var total = this.sum(requestId)

        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        if (!gr.get(requestId + '')) {
            return total
        }

        gr.setValue('u_total_expense_amount', total)

        var judged = new x_dent2_dentsusoke.ApplicationSubmitUtil().judgeAmount(
            gr.getValue('u_employee_count_category'),
            gr.getValue('u_special_measure_flag') === '1',
            total,
        )
        if (judged.ok) {
            gr.setValue('u_subsidy_cap_amount', judged.capAmount)
            gr.setValue('u_subsidy_rate_numerator', judged.numerator)
            gr.setValue('u_subsidy_rate_denominator', judged.denominator)
            // 既存の画面・帳票が参照する Decimal 列にも転記する（精度2桁のため参照用）
            gr.setValue('u_subsidy_rate', judged.numerator / judged.denominator)
            gr.setValue('u_subsidy_amount', judged.subsidyAmount)
        }

        if (!gr.update()) {
            gs.error('[SKS] 対象経費合計の書き戻しに失敗しました。request=' + requestId)
        }

        return total
    },

    /** 選択肢の取得：対象経費区分マスタ（有効なもののみ） */
    getCategories: function () {
        var rows = []
        var gr = new GlideRecord('x_dent2_dentsusoke_expense')
        gr.addQuery('u_active', true)
        gr.orderBy('u_order')
        gr.setLimit(100)
        gr.query()
        while (gr.next()) {
            rows.push({
                sys_id: gr.getUniqueValue(),
                code: gr.getValue('u_code'),
                name: gr.getValue('u_name'),
                hasDailyCap: gr.getValue('u_has_daily_cap') === '1',
            })
        }
        return rows
    },

    /** 選択肢の取得：専門家経費日額上限マスタ（有効なもののみ） */
    getExpertFees: function () {
        var rows = []
        var gr = new GlideRecord('x_dent2_dentsusoke_expert_fee')
        gr.addQuery('u_active', true)
        gr.orderBy('u_order')
        gr.setLimit(100)
        gr.query()
        while (gr.next()) {
            rows.push({
                sys_id: gr.getUniqueValue(),
                code: gr.getValue('u_code'),
                name: gr.getValue('u_name'),
                dailyCap: parseInt(gr.getValue('u_daily_cap_amount'), 10) || 0,
            })
        }
        return rows
    },

    _addComma: function (value) {
        var text = (parseInt(value, 10) || 0) + ''
        var result = ''
        var count = 0
        for (var i = text.length - 1; i >= 0; i--) {
            result = text.charAt(i) + result
            count++
            if (count % 3 === 0 && i > 0) {
                result = ',' + result
            }
        }
        return result
    },

    _trim: function (value) {
        return value === null || value === undefined ? '' : (value + '').trim()
    },

    type: 'ApplicationExpenseUtil',
}
