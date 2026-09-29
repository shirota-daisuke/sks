/**
 * ApplicationSubmitUtil
 *
 * 事業者ユーザによる申請の入力・提出をまとめたユーティリティ。
 *   ・申請情報入力処理（処理No.16）… 下書きの作成・保存
 *   ・補助金額自動判定処理（処理No.17）… 補助上限額・補助率の引き当てと補助金額の算出
 *   ・申請の提出 … 申請番号の採番と 申請入力中 → 受付済 への遷移
 *
 * ■ スコープについて（重要）
 * 申請機能は ITCOM 主担当の範囲であり、本アプリ（T03 は参照のみ）の設計対象外である。
 * 依頼により事業者が申請を提出できる最小限の画面を用意するものであり、
 * ITCOM 側の申請入力機能が確定した時点で置き換えるか、項目構成をそろえる必要がある。
 * そのため T03 のテーブル定義に項目を追加せず、既存の列のみで完結させている。
 *
 * ■ 1事業者あたりの下書きは1件
 * 同じ事業者で「申請入力中」の申請を複数作れると、どれを提出すべきか判断できなくなる。
 * 下書きは1件に限定し、既にあればそれを再利用する。
 * TODO(要確認): 1事業者が複数回次・複数件の申請を行う運用があるかは未確定。
 *   複数申請を認める場合は公募回次の項目が必要になる（T03 に該当列がない）。
 *
 * ■ 状態遷移
 *   申請入力中（input）… 下書き。事業者が編集できる唯一の状態
 *   受付済（accepted）… 提出済み。事業者は編集できない
 * 提出後の審査（一次審査・信用調査・採択判定）は本アプリの範囲外。
 *
 * Service Portal のウィジェットのサーバースクリプトは ACL を経由しない（GlideRecord は ACL 非適用）ため、
 * 本ユーティリティ側で事業者の所属を明示的に検証する（トンマナ 2.1.2）。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない。
 */
var ApplicationSubmitUtil = Class.create()

/** 事業者が編集できる申請ステータス */
ApplicationSubmitUtil.EDITABLE = 'input'

/** 提出後のステータス（業務フロー「申請ステータス一覧」の受付済） */
ApplicationSubmitUtil.SUBMITTED = 'accepted'

/** 申請番号の接頭辞。形式は APP-<西暦>-<5桁連番> */
ApplicationSubmitUtil.NUMBER_PREFIX = 'APP'

/** 申請番号の採番でリトライする回数（同時提出による重複を避けるため） */
ApplicationSubmitUtil.NUMBER_MAX_ATTEMPTS = 5

/**
 * 対象経費合計金額の上限は持たない。
 * 金額の桁数は明細1行ごとに ApplicationExpenseUtil.MAX_AMOUNT で検証する。
 */

ApplicationSubmitUtil.prototype = {
    initialize: function () {},

    /**
     * 下書き（申請入力中）を取得する。無ければ null を返す。
     * 作成は saveDraft／submit の中で行い、画面表示のみでレコードを作らない。
     */
    getDraft: function (entityId) {
        if (!entityId) {
            return null
        }

        // 自社かつ申請入力中の単一レコード取得。
        // get() では自社以外を除外する条件が適用されないためクエリ側で担保する（トンマナ 3.2.3 の例外）
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.addQuery('u_business_entity', entityId)
        gr.addQuery('u_application_status', ApplicationSubmitUtil.EDITABLE)
        gr.orderByDesc('sys_updated_on')
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return null
        }
        return gr
    },

    /** 下書きの入力値を画面へ渡す形に整える */
    buildDraftContext: function (gr) {
        if (!gr) {
            return null
        }
        return {
            sys_id: gr.getUniqueValue(),
            applicationNumber: gr.getValue('u_application_number') || '',
            organizationType: gr.getValue('u_organization_type') || '',
            employeeCategory: gr.getValue('u_employee_count_category') || '',
            salesIncreaseTargetMonth: gr.getValue('u_sales_increase_target_month') || '',
            salesIncreaseRate: gr.getValue('u_sales_increase_rate') || '',
            specialMeasure: gr.getValue('u_special_measure_flag') === '1',
            totalExpense: gr.getValue('u_total_expense_amount') || '0',
            updatedOn: gr.getDisplayValue('sys_updated_on'),
        }
    },

    /**
     * 補助金額自動判定処理（処理No.17）
     *
     * 補助上限額マスタと補助率マスタから基準を引き当て、補助金額を算出する。
     *
     * 補助金額 = min(対象経費 × 補助率, 補助上限額)
     *
     * 補助率はマスタの分子・分母（整数）で計算する。
     * T03 の u_subsidy_rate は DecimalColumn（格納精度2桁）であり 2/3 が 0.67 になるため、
     * 保存値を使って計算すると対象経費1,000万円で33,300円の差が生じる。
     * 算出は必ず分数で行い、u_subsidy_rate への保存は事務局の参照用と割り切る。
     *
     * TODO(A08): 端数処理の規則（切り捨て／四捨五入）が未確定。暫定で切り捨てとする。
     *
     * @return { ok, errors, capAmount, numerator, denominator, rateLabel, subsidyAmount }
     */
    judgeAmount: function (employeeCategory, specialMeasure, totalExpense) {
        var category = this._trim(employeeCategory)
        var expense = parseInt(totalExpense, 10)
        if (isNaN(expense) || expense < 0) {
            expense = 0
        }

        if (!category) {
            return { ok: false, errors: ['従業員数区分が未設定のため補助金額を判定できません。'] }
        }

        // 補助上限額マスタ（従業員数区分 × 特例措置の有無が一意キー）
        var capGr = new GlideRecord('x_dent2_dentsusoke_cap')
        capGr.addQuery('u_employee_count_category', category)
        capGr.addQuery('u_special_measure_flag', specialMeasure ? true : false)
        capGr.addQuery('u_active', true)
        capGr.setLimit(1)
        capGr.query()
        if (!capGr.next()) {
            gs.error(
                '[SKS] 補助上限額マスタに該当行がありません。category=' +
                    category +
                    ' special=' +
                    specialMeasure,
            )
            return {
                ok: false,
                errors: ['補助上限額の基準が見つかりません。事務局へお問い合わせください。'],
            }
        }

        // 補助率マスタ（従業員数区分が一意キー）
        var rateGr = new GlideRecord('x_dent2_dentsusoke_rate')
        rateGr.addQuery('u_employee_count_category', category)
        rateGr.addQuery('u_active', true)
        rateGr.setLimit(1)
        rateGr.query()
        if (!rateGr.next()) {
            gs.error('[SKS] 補助率マスタに該当行がありません。category=' + category)
            return { ok: false, errors: ['補助率の基準が見つかりません。事務局へお問い合わせください。'] }
        }

        var capAmount = parseInt(capGr.getValue('u_cap_amount'), 10) || 0
        var numerator = parseInt(rateGr.getValue('u_rate_numerator'), 10)
        var denominator = parseInt(rateGr.getValue('u_rate_denominator'), 10)

        if (isNaN(numerator) || isNaN(denominator) || denominator <= 0) {
            gs.error(
                '[SKS] 補助率マスタの値が不正です。category=' +
                    category +
                    ' numerator=' +
                    numerator +
                    ' denominator=' +
                    denominator,
            )
            return { ok: false, errors: ['補助率の基準が不正です。事務局へお問い合わせください。'] }
        }

        // 分数のまま計算して丸め誤差を避ける。端数は切り捨て
        var byRate = Math.floor((expense * numerator) / denominator)
        var subsidyAmount = Math.min(byRate, capAmount)

        return {
            ok: true,
            errors: [],
            capAmount: capAmount,
            numerator: numerator,
            denominator: denominator,
            rateLabel: numerator + '/' + denominator,
            subsidyAmount: subsidyAmount,
            cappedByLimit: byRate > capAmount,
        }
    },

    /**
     * 入力検証。
     *
     * @param input      画面の入力値
     * @param forSubmit  true なら提出時の検証（必須項目をすべて要求する）
     *
     * 下書き保存では未入力を許す。途中まで入力して保存できないと、
     * 一度に全項目を揃えられない申請者が保存できなくなるためである。
     */
    validate: function (input, forSubmit) {
        var errors = []

        var organizationType = this._trim(input && input.organization_type)
        var employeeCategory = this._trim(input && input.employee_category)
        var targetMonth = this._trim(input && input.sales_increase_target_month)
        var rate = this._trim(input && input.sales_increase_rate)
        var totalExpense = this._trim(input && input.total_expense)

        var ORGANIZATION_TYPES = ['corporate', 'sole_proprietor', 'other']
        var EMPLOYEE_CATEGORIES = ['sole_proprietor', 'le5', 'le20', 'le50', 'le100', 'gt100']

        if (organizationType) {
            if (ORGANIZATION_TYPES.indexOf(organizationType) < 0) {
                errors.push('組織形態の選択値が不正です。')
            }
        } else if (forSubmit) {
            errors.push('組織形態を選択してください。')
        }

        if (employeeCategory) {
            if (EMPLOYEE_CATEGORIES.indexOf(employeeCategory) < 0) {
                errors.push('従業員数区分の選択値が不正です。')
            }
        } else if (forSubmit) {
            errors.push('従業員数区分を選択してください。')
        }

        // 売上増加率対象月は年月のみを扱う（保持は DateColumn のため月初日）
        if (targetMonth) {
            var normalizedMonth = this._parseTargetMonth(targetMonth)
            if (!normalizedMonth) {
                errors.push('売上増加率対象月は年月を選択してください（例：2026-06）。')
            } else if (normalizedMonth > this._getCurrentMonthStart()) {
                /**
                 * 申請時点より後の月は指定できない。
                 * 売上の実績が存在しない月を対象にした増加率は根拠を確認できない。
                 * いずれも月初日（yyyy-MM-01）へそろえているため文字列比較で月を比較できる。
                 *
                 * TODO(A07): 対象期間の終期は未確定。
                 *   「申請時点で確定済みの直近月まで」とする場合、売上が締まっていない当月も
                 *   対象外になるため、ここを前月までの判定へ変更する必要がある。
                 *   下限（2025年1月以降）の判定も未実装。
                 */
                errors.push('売上増加率対象月に申請時点より後の月は指定できません。')
            }
        } else if (forSubmit) {
            errors.push('売上増加率対象月を入力してください。')
        }

        if (rate) {
            if (!/^-?[0-9]+(\.[0-9]+)?$/.test(rate)) {
                errors.push('売上増加率は数値で入力してください。')
            } else {
                var rateValue = parseFloat(rate)
                // 率は百分率ではなく小数（0.15＝15%）で保持する。負の増加率も入力は許す
                if (rateValue > 100) {
                    errors.push('売上増加率の値が大きすぎます。小数（例：0.15＝15%）で入力してください。')
                }
            }
        } else if (forSubmit) {
            errors.push('売上増加率を入力してください。')
        }

        /**
         * 対象経費合計金額は画面から受け取らない。
         * 対象経費明細（x_dent2_dentsusoke_exp_item）の合計を
         * ApplicationExpenseUtil.recalcTotal が T03 へ書き戻すため、
         * ここで入力値として検証・保存すると明細と食い違う。
         * 提出時の「明細が1件以上あること」の検証は submit() で行う。
         */

        return errors
    },

    /**
     * 提出できるかどうかの判定。
     *
     * submit() と内容確認・提出画面（ITCOM-04）が同じ条件を使うために切り出している。
     * 確認画面は押してから失敗を返すのではなく、不足している項目を先に一覧で示して
     * 該当のステップへ戻せるようにするため、理由に step を持たせる。
     *
     * @param requestId 対象の申請（下書き）
     * @param input     提出しようとしている入力値
     * @return { ok, blockers: [{ step, message }], totalExpense }
     *         step は 'basic'（基本情報＝ITCOM-01）／'expense'（対象経費＝ITCOM-02）／
     *         'document'（添付書類＝ITCOM-03）
     */
    checkReadyToSubmit: function (requestId, input) {
        var blockers = []

        // 基本情報の必須項目（処理No.16）
        var errors = this.validate(input, true)
        for (var i = 0; i < errors.length; i++) {
            blockers.push({ step: 'basic', message: errors[i] })
        }

        if (!requestId) {
            return { ok: false, blockers: blockers, totalExpense: 0 }
        }

        var checked = this.checkExpenseAndDocuments(requestId, {
            organizationType: this._trim(input && input.organization_type),
            specialMeasure: input && (input.special_measure === true || input.special_measure === 'true'),
        })
        blockers = blockers.concat(checked.blockers)

        return {
            ok: blockers.length === 0,
            blockers: blockers,
            totalExpense: checked.totalExpense,
        }
    },

    /**
     * 対象経費（ITCOM-02）と添付書類（ITCOM-03）の充足チェック。
     *
     * 提出（ITCOM-04）と不備修正の再提出（ITCOM-05）で同じ条件を使うために切り出している。
     * 基本情報の検証は含まない（不備修正では基本情報を変更しないため）。
     *
     * @param requestId 対象の申請
     * @param context   必須区分の判定に使う値 { organizationType, specialMeasure }。
     *                  省略した場合は申請レコードの値で評価する。
     * @return { blockers: [{ step, message }], totalExpense }
     */
    checkExpenseAndDocuments: function (requestId, context) {
        var blockers = []
        if (!requestId) {
            return { blockers: blockers, totalExpense: 0 }
        }

        // 対象経費（処理No.18）。合計は明細から算出する
        var expenseUtil = new x_dent2_dentsusoke.ApplicationExpenseUtil()
        var totalExpense = expenseUtil.sum(requestId)
        if (totalExpense <= 0) {
            blockers.push({ step: 'expense', message: '対象経費明細を1件以上登録してください。' })
        }

        // 日額上限違反が残っていないか（画面を経由しない更新への保険）
        var items = expenseUtil.list(requestId)
        for (var i = 0; i < items.length; i++) {
            if (items[i].capError) {
                blockers.push({
                    step: 'expense',
                    message: items[i].description + '：' + items[i].capError,
                })
            }
        }

        /**
         * 必須書類の充足チェック（ITCOM-03）。
         * 提出フラグではなく実ファイルの有無で判定する（ApplicationDocumentUtil）。
         * 書類が欠けた申請を受け付けると、一次審査で必ず不備確認依頼になり
         * 事務局と事業者の双方に往復が発生するため提出の時点で止める。
         */
        var docUtil = new x_dent2_dentsusoke.ApplicationDocumentUtil()
        docUtil.ensureRows(requestId, context)
        var complete = docUtil.checkComplete(requestId)
        if (!complete.ok) {
            blockers.push({
                step: 'document',
                message: '必須書類が未提出です：' + complete.missing.join('、'),
            })
        }

        return { blockers: blockers, totalExpense: totalExpense }
    },

    /**
     * 下書きの保存（処理No.16）。既に下書きが無ければ作成する。
     * ステータスは申請入力中のまま変更しない。
     */
    saveDraft: function (entityId, userId, input) {
        if (!entityId) {
            return { success: false, errors: ['事業者情報が紐づいたアカウントでログインしてください。'] }
        }

        var errors = this.validate(input, false)
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        var gr = this.getDraft(entityId)
        var isNew = false
        if (!gr) {
            gr = new GlideRecord('x_dent2_dentsusoke_request')
            gr.initialize()
            gr.setValue('u_business_entity', entityId)
            gr.setValue('u_applicant_user', userId)
            gr.setValue('u_application_status', ApplicationSubmitUtil.EDITABLE)
            /**
             * 申請番号は mandatory のため下書きの時点でも値が必要になる。
             * 提出時に正式採番するため、下書きでは採番せず仮の値を入れる。
             * TODO(要レビュー): 下書きにも正式な申請番号を割り当てる運用であれば、
             *   提出時の採番をやめて作成時に採番する（欠番が発生する点は要確認）。
             */
            gr.setValue('u_application_number', '(下書き)')
            isNew = true
        }

        this._applyInput(gr, input)

        var result = isNew ? gr.insert() : gr.update()
        if (!result) {
            gs.error('[SKS] 申請の下書き保存に失敗しました。entity=' + entityId)
            return { success: false, errors: ['保存に失敗しました。時間をおいて再度お試しください。'] }
        }

        gs.info('[SKS] 申請の下書きを保存しました。entity=' + entityId + ' new=' + isNew)
        return {
            success: true,
            action: 'save_draft',
            sys_id: isNew ? result + '' : gr.getUniqueValue(),
            message: '入力内容を保存しました。まだ提出は完了していません。',
        }
    },

    /**
     * 申請の提出。申請入力中 → 受付済 へ遷移させる。
     *
     * 提出時に次を確定する。
     *   ・申請番号の採番
     *   ・補助上限額・補助率（処理No.17 の判定結果）
     *   ・提出日時
     */
    submit: function (entityId, userId, input) {
        if (!entityId) {
            return { success: false, errors: ['事業者情報が紐づいたアカウントでログインしてください。'] }
        }

        /**
         * 提出には下書きが必須。
         *
         * 対象経費明細と提出書類は申請レコードへ紐づくため、それらを登録するには
         * 先に下書きが存在していなければならない。
         * したがって提出時に申請レコードを新規作成することはない
         * （明細ゼロ件・書類ゼロ件の申請が提出されるのを防ぐ）。
         */
        var gr = this.getDraft(entityId)
        if (!gr) {
            return {
                success: false,
                errors: ['先に「入力内容を保存」してから、対象経費と添付書類を登録して提出してください。'],
            }
        }
        var requestId = gr.getUniqueValue()

        /**
         * 提出できる状態かを判定する。
         * 内容確認・提出画面（ITCOM-04）が押す前に示す条件と同一のものを使う
         * （条件が二重に書かれて食い違うのを避けるため）。
         */
        var ready = this.checkReadyToSubmit(requestId, input)
        if (!ready.ok) {
            var blocked = []
            for (var i = 0; i < ready.blockers.length; i++) {
                blocked.push(ready.blockers[i].message)
            }
            return { success: false, errors: blocked }
        }

        // 対象経費は明細の合計を正とする（画面の入力値は受け取らない）
        var totalExpense = ready.totalExpense

        var specialMeasure = input && (input.special_measure === true || input.special_measure === 'true')
        var judged = this.judgeAmount(this._trim(input.employee_category), specialMeasure, totalExpense)
        if (!judged.ok) {
            return { success: false, errors: judged.errors }
        }

        this._applyInput(gr, input)
        gr.setValue('u_total_expense_amount', totalExpense)
        gr.setValue('u_subsidy_cap_amount', judged.capAmount)
        // 補助率は分子・分母で保持する（算出に使う値）
        gr.setValue('u_subsidy_rate_numerator', judged.numerator)
        gr.setValue('u_subsidy_rate_denominator', judged.denominator)
        // 精度2桁へ丸められることを前提に、既存の画面・帳票の参照用として転記する。
        // 補助金額の算出には使わない（judgeAmount が分数で計算する）
        gr.setValue('u_subsidy_rate', judged.numerator / judged.denominator)
        gr.setValue('u_subsidy_amount', judged.subsidyAmount)
        gr.setValue('u_application_status', ApplicationSubmitUtil.SUBMITTED)

        var submittedOn = new GlideDateTime().getValue()
        gr.setValue('u_submitted_on', submittedOn)

        /**
         * 一次審査の期限（提出日＋SLA日数）を確定する。
         * 事務局ワークスペースの一覧で期限超過を絞り込むために列として持つ
         * （一覧では経過日数を算出できない：ITCOM-06）。
         */
        gr.setValue(
            'u_review_due_on',
            new x_dent2_dentsusoke.ApplicationReviewUtil().calcDueOn(submittedOn),
        )

        // 申請番号の採番。同時提出で重複した場合はリトライする
        var attempt = 0
        var saved = false
        var applicationNumber = ''
        while (attempt < ApplicationSubmitUtil.NUMBER_MAX_ATTEMPTS && !saved) {
            attempt++
            applicationNumber = this.generateApplicationNumber()
            gr.setValue('u_application_number', applicationNumber)

            if (this._existsApplicationNumber(applicationNumber, requestId)) {
                // 直前に他の申請が同じ番号を採ったため再採番する
                continue
            }

            if (gr.update()) {
                saved = true
            }
        }

        if (!saved) {
            gs.error('[SKS] 申請の提出に失敗しました。entity=' + entityId + ' attempts=' + attempt)
            return { success: false, errors: ['提出に失敗しました。時間をおいて再度お試しください。'] }
        }

        gs.info(
            '[SKS] 申請を提出しました。number=' +
                applicationNumber +
                ' entity=' +
                entityId +
                ' expense=' +
                totalExpense +
                ' cap=' +
                judged.capAmount +
                ' rate=' +
                judged.rateLabel +
                ' subsidy=' +
                judged.subsidyAmount,
        )

        // 処理履歴へ記録する（ITCOM-05／07 のタイムラインの元データ）
        new x_dent2_dentsusoke.ApplicationLogUtil().record(requestId, 'submitted', {
            fromStatus: ApplicationSubmitUtil.EDITABLE,
            toStatus: ApplicationSubmitUtil.SUBMITTED,
            detail: '申請番号 ' + applicationNumber + '／対象経費 ' + totalExpense + '円',
            actor: userId,
        })

        return {
            success: true,
            action: 'submit',
            sys_id: requestId,
            applicationNumber: applicationNumber,
            totalExpense: totalExpense,
            capAmount: judged.capAmount,
            rateLabel: judged.rateLabel,
            subsidyAmount: judged.subsidyAmount,
            message: '申請を提出しました（受付済）。',
            /**
             * TODO(IF-07): 申請受付メールの要否・テンプレートが未確定のため送信しない。
             *   確定後に sysevent_register ＋ sysevent_email_action を追加する
             *   （SC-11 の不備確認依頼メールと同じ実装パターン）。
             */
            warnings: [
                '受付内容のメール通知は要否が未確定のため送信していません。申請状況は「申請」画面でご確認いただけます。',
            ],
        }
    },

    /**
     * 申請番号の採番。形式は APP-<西暦>-<5桁連番>。
     * 同一年内の最大連番へ1を加える。
     *
     * TODO(要確認): 採番規則（年度切り替えの基準・公募回次の反映・欠番の扱い）が未確定。
     *   暫定で西暦年＋年内通番としている。提出時のみ採番するため、
     *   下書きのまま提出されなかった申請で欠番は発生しない。
     */
    generateApplicationNumber: function () {
        var year = new GlideDateTime().getYearLocalTime() + ''
        var prefix = ApplicationSubmitUtil.NUMBER_PREFIX + '-' + year + '-'

        // 同一年の申請のうち番号が最大のものを取得する。
        // 文字列としての降順で先頭が最大となる（連番が固定5桁のため桁数の差が出ない）
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.addQuery('u_application_number', 'STARTSWITH', prefix)
        gr.orderByDesc('u_application_number')
        gr.setLimit(1)
        gr.query()

        var next = 1
        if (gr.next()) {
            var current = (gr.getValue('u_application_number') || '') + ''
            var serial = parseInt(current.substring(prefix.length), 10)
            if (!isNaN(serial)) {
                next = serial + 1
            }
        }

        return prefix + this._padLeft(next, 5)
    },

    /** 入力値をレコードへ反映する（ステータス・番号・金額は呼び出し元が設定する） */
    _applyInput: function (gr, input) {
        var organizationType = this._trim(input && input.organization_type)
        var employeeCategory = this._trim(input && input.employee_category)
        var targetMonth = this._trim(input && input.sales_increase_target_month)
        var rate = this._trim(input && input.sales_increase_rate)
        var specialMeasure = input && (input.special_measure === true || input.special_measure === 'true')

        if (organizationType) {
            gr.setValue('u_organization_type', organizationType)
        }
        if (employeeCategory) {
            gr.setValue('u_employee_count_category', employeeCategory)
        }

        /**
         * 売上増加率対象月・売上増加率・特例措置は、入力に項目が含まれている場合のみ書き込む。
         *
         * 以前は無条件に書き込んでいたため、これらを含まない入力で保存すると
         * 保存済みの値が消えていた。消えた値は内容確認・提出（ITCOM-04）で
         * 未入力と判定されるため、「入力しているのに未入力と案内される」状態になる。
         * 組織形態・従業員数区分と同じく、渡された項目だけを反映する。
         *
         * 値を空にする（クリアする）操作は、項目を空文字で明示的に渡せば行える。
         */
        if (this._has(input, 'sales_increase_target_month')) {
            // 月初日へそろえて保持する（月中の日付が混ざると月単位の集計が別月扱いになる）
            gr.setValue('u_sales_increase_target_month', this._parseTargetMonth(targetMonth))
        }

        /**
         * 売上増加率は検証済みの文字列のまま設定する。
         * parseFloat で数値に変換して渡していたが、他の項目はすべて文字列で
         * 設定しており、DecimalColumn へ数値を渡す扱いをプラットフォームに委ねる
         * 理由が無い。形式は validate で保証している（^-?[0-9]+(\.[0-9]+)?$）。
         */
        if (this._has(input, 'sales_increase_rate')) {
            gr.setValue('u_sales_increase_rate', rate)
        }

        if (this._has(input, 'special_measure')) {
            gr.setValue('u_special_measure_flag', specialMeasure ? true : false)
        }

        /**
         * u_total_expense_amount は設定しない。
         * 対象経費明細の合計を ApplicationExpenseUtil.recalcTotal が書き戻すため、
         * ここで入力値から上書きすると明細と食い違う。
         */
    },

    /**
     * 申請時点の年月（yyyy-MM）。
     * 画面の入力欄の上限（max 属性）に使う。
     * 画面側の時計ではなくインスタンスの時計で境界を決めるため、サーバーから渡す。
     */
    getCurrentMonth: function () {
        return this._getCurrentMonthStart().substring(0, 7)
    },

    /** 申請時点の月初日（yyyy-MM-01）。対象月の上限判定に使う */
    _getCurrentMonthStart: function () {
        var now = new GlideDateTime()
        return now.getYearLocalTime() + '-' + this._padLeft(now.getMonthLocalTime(), 2) + '-01'
    },

    /**
     * 売上増加率対象月の正規化。
     *
     * 受け付けるのは年月（yyyy-MM）と月初日を含む日付（yyyy-MM-dd）の2つで、
     * いずれも月初日の文字列（yyyy-MM-01）へそろえて返す。
     * 判定できない場合は空文字を返す（呼び出し元が検証エラーとして扱う）。
     *
     * ■ ISO 8601 の日時文字列（2026-05-31T15:00:00.000Z など）は受け付けない
     * AngularJS の input[type=month]／input[type=date] は ng-model へ Date オブジェクトを
     * 入れる仕様であり、そのまま送ると JSON 変換で UTC の日時文字列が届く。
     * JST の月初（2026-06-01 00:00）を UTC へ直すと 2026-05-31 15:00 となり、
     * 先頭10文字を採ると前月になってしまう。
     * 月がずれたまま保存するより、検証エラーとして気付けるほうが安全なため受け付けない。
     * 画面側は送信前に文字列へ変換する（application-form の client_script.js）。
     */
    _parseTargetMonth: function (value) {
        var text = this._trim(value)
        if (!text) {
            return ''
        }

        var matched = /^([0-9]{4})-([0-9]{2})(?:-([0-9]{2}))?$/.exec(text)
        if (!matched) {
            return ''
        }

        var month = parseInt(matched[2], 10)
        if (month < 1 || month > 12) {
            return ''
        }

        var day = matched[3] === undefined ? 1 : parseInt(matched[3], 10)
        if (isNaN(day) || day < 1 || day > 31) {
            return ''
        }

        return matched[1] + '-' + matched[2] + '-01'
    },

    /** 指定した申請番号が既に使われているか（自分自身は除く） */
    _existsApplicationNumber: function (applicationNumber, excludeSysId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.addQuery('u_application_number', applicationNumber)
        if (excludeSysId) {
            gr.addQuery('sys_id', '!=', excludeSysId)
        }
        gr.setLimit(1)
        gr.query()
        return gr.hasNext()
    },

    _padLeft: function (value, length) {
        var text = value + ''
        while (text.length < length) {
            text = '0' + text
        }
        return text
    },

    /**
     * 入力に項目が含まれているか（値が空かどうかとは区別する）。
     *
     * hasOwnProperty では判定しない。
     * Service Portal のウィジェットから渡る input は Java のオブジェクトを
     * ラップした形になることがあり、その場合 hasOwnProperty はすべてのキーに対して
     * false を返す。判定が常に false になると、渡された値を一切書き込まなくなる。
     * undefined／null でないことで判定すれば、どちらの形でも動作する。
     *
     * 値のクリアは空文字を渡して行う（空文字は「含まれている」と判定される）。
     */
    _has: function (input, key) {
        if (!input) {
            return false
        }
        return input[key] !== undefined && input[key] !== null
    },

    _trim: function (value) {
        return value === null || value === undefined ? '' : (value + '').trim()
    },

    type: 'ApplicationSubmitUtil',
}
