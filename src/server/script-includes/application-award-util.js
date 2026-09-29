/**
 * ApplicationAwardUtil
 *
 * 採択・不採択の確定（事務局側／画面イメージ ITCOM-09）。
 * 審査結果の集約、交付決定額の算定、採択番号の採番、確定と一次審査への差し戻しを担当する。
 *
 * ■ 遷移
 *   信用調査結果確認中（result_checking）／信用調査免除（credit_exempt）
 *     → 申請審査完了（review_done。採択）
 *     → 不採択（rejected。終端状態）
 *     → 一次審査中（first_review。差し戻し）
 *
 * ■ この遷移が無いと動かなかったもの
 * 申請審査完了（review_done）へ遷移する処理が存在しなかったため、次が実質的に動いていなかった。
 *   SC-17「採択者一覧（申請審査完了）」帳票 … 常に0件
 *   SC-15 ダッシュボードの申請審査完了カード … 常に0件
 *   RPA 連携（添付ファイルの共有フォルダ転送） … 契機が発生しない
 *
 * ■ 確定操作の権限
 * 権限設計書 A20「不採択確定等の最終確定操作」に従い、確定は staff_admin に限定する。
 * 一次審査（ITCOM-06／07）・信用調査（ITCOM-08）は staff が実施できる。
 * UI Action の condition は表示制御でしかないため、本クラスでもロールを検証する。
 * TODO(A20): 事務局内の役割分離の権限粒度が未確定。確定後に本切り分けを見直す。
 *
 * ■ 交付決定額
 * 査定後の対象経費 × 補助率（補助上限額で頭打ち）。
 * 補助率はマスタの分子・分母で計算する（u_subsidy_rate は精度2桁のため使わない）。
 * TODO(要確認): 査定による減額を認めるかが未確定。
 *   現状は査定後の対象経費を任意入力とし、未入力なら申請時の対象経費をそのまま使う。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない。
 */
var ApplicationAwardUtil = Class.create()

/** 採択判定を確定できる申請ステータス */
ApplicationAwardUtil.DECIDE_STATUSES = ['result_checking', 'credit_exempt']

/** 遷移先ステータス */
ApplicationAwardUtil.AWARDED = 'review_done'
ApplicationAwardUtil.REJECTED = 'rejected'
ApplicationAwardUtil.RETURNED = 'first_review'

/** 確定操作に必要なロール（権限設計書 A20） */
ApplicationAwardUtil.DECIDE_ROLE = 'x_dent2_dentsusoke.staff_admin'

/** 採択番号の接頭辞。形式は AWD-<西暦>-<4桁連番> */
ApplicationAwardUtil.NUMBER_PREFIX = 'AWD'

/** 採択番号の採番でリトライする回数（同時確定による重複を避けるため） */
ApplicationAwardUtil.NUMBER_MAX_ATTEMPTS = 5

/** 判定理由・通知文の最大文字数（T03 の桁数に合わせる） */
ApplicationAwardUtil.MAX_NOTE_LENGTH = 2000

/**
 * 重複申請の確認で対象とする申請ステータス。
 * 申請入力中（事業者の下書き）と終端状態（不採択・取下げ）は重複として扱わない。
 */
ApplicationAwardUtil.ACTIVE_STATUSES = [
    'accepted',
    'first_review',
    'defect_request',
    'defect_fixing',
    'defect_answered',
    're_review',
    'first_review_done',
    'credit_judging',
    'credit_exempt',
    'ext_preparing',
    'ext_reviewing',
    'result_waiting',
    'result_checking',
    'review_done',
]

ApplicationAwardUtil.prototype = {
    initialize: function () {},

    /** 採択判定を確定できる申請ステータスか */
    canDecide: function (status) {
        return ApplicationAwardUtil.DECIDE_STATUSES.indexOf((status || '') + '') >= 0
    },

    /** 確定操作の権限があるか（権限設計書 A20） */
    canDecideByRole: function () {
        return gs.hasRole(ApplicationAwardUtil.DECIDE_ROLE)
    },

    /**
     * 審査結果の集約（画面イメージ ITCOM-09「審査結果の集約」）。
     *
     * 確定の判断材料を1か所に集める。値は保存しない。
     *
     * @return { ok, review, credit, duplicate, priorYearAwarded, amount, errors }
     */
    summarize: function (requestId) {
        if (!requestId) {
            return { ok: false, errors: ['対象の申請が指定されていません。'] }
        }

        // 対象は sys_id で確定しているため get を使用する（トンマナ 3.2.3）
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        if (!gr.get(requestId + '')) {
            return { ok: false, errors: ['対象の申請が見つかりません。'] }
        }

        var entityId = gr.getValue('u_business_entity')

        return {
            ok: true,
            errors: [],
            applicationNumber: gr.getValue('u_application_number') || '',
            status: gr.getValue('u_application_status'),
            statusLabel: gr.getDisplayValue('u_application_status'),

            // 一次審査（ITCOM-07）
            review: {
                result: gr.getValue('u_review_result') || '',
                resultLabel: gr.getDisplayValue('u_review_result') || '',
                reviewedOn: gr.getDisplayValue('u_reviewed_on'),
                reviewer: gr.getDisplayValue('u_reviewed_by') || '',
                note: gr.getValue('u_review_note') || '',
            },

            // 信用調査（ITCOM-08）。免除の場合は調査レコードが無い
            credit: this._summarizeCredit(gr, requestId),

            // 重複申請の確認
            duplicate: this._summarizeDuplicate(requestId, entityId),

            /**
             * 前年度採択実績。
             * 本システム内の u_prior_year_awarded_flag のみで判定する。
             * Salesforce 横断照合（IF-02）は未実装のため、他システムに実績があっても検出できない。
             */
            priorYearAwarded: this._isPriorYearAwarded(entityId),

            // 金額（申請時の値）
            amount: {
                totalExpense: parseInt(gr.getValue('u_total_expense_amount'), 10) || 0,
                capAmount: parseInt(gr.getValue('u_subsidy_cap_amount'), 10) || 0,
                numerator: parseInt(gr.getValue('u_subsidy_rate_numerator'), 10) || 0,
                denominator: parseInt(gr.getValue('u_subsidy_rate_denominator'), 10) || 0,
                subsidyAmount: parseInt(gr.getValue('u_subsidy_amount'), 10) || 0,
            },
        }
    },

    /**
     * 交付決定額の算定。
     *
     * 交付決定額 = min(査定後の対象経費 × 補助率, 補助上限額)
     * 補助率・補助上限額は申請時に確定した値（レコードの分子・分母・上限額）を使う。
     * 提出後にマスタが変更されても、審査の前提が変わらないようにするため。
     *
     * @param requestId       対象の申請
     * @param approvedExpense 査定後の対象経費（省略・空なら申請時の対象経費を使う）
     * @return { ok, approvedExpense, awardAmount, capAmount, rateLabel, cappedByLimit, errors }
     */
    calcAwardAmount: function (requestId, approvedExpense) {
        if (!requestId) {
            return { ok: false, errors: ['対象の申請が指定されていません。'] }
        }

        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        if (!gr.get(requestId + '')) {
            return { ok: false, errors: ['対象の申請が見つかりません。'] }
        }

        var totalExpense = parseInt(gr.getValue('u_total_expense_amount'), 10) || 0
        var capAmount = parseInt(gr.getValue('u_subsidy_cap_amount'), 10) || 0
        var numerator = parseInt(gr.getValue('u_subsidy_rate_numerator'), 10)
        var denominator = parseInt(gr.getValue('u_subsidy_rate_denominator'), 10)

        if (isNaN(numerator) || isNaN(denominator) || denominator <= 0) {
            gs.error('[SKS] 補助率が記録されていないため交付決定額を算定できません。request=' + requestId)
            return {
                ok: false,
                errors: ['補助率が記録されていないため交付決定額を算定できません。事務局へお問い合わせください。'],
            }
        }

        var expense = totalExpense
        var text = this._trim(approvedExpense)
        if (text) {
            if (!/^[0-9]+$/.test(text)) {
                return { ok: false, errors: ['査定後の対象経費は半角数字で入力してください。'] }
            }
            expense = parseInt(text, 10)
            if (expense <= 0) {
                return { ok: false, errors: ['査定後の対象経費は1円以上で入力してください。'] }
            }
            /**
             * 査定は「対象外と判断した経費を除く」ものであり、申請額を超える査定はありえない。
             * 超える値を受け付けると、事業者が申請していない額を交付することになる。
             */
            if (expense > totalExpense) {
                return {
                    ok: false,
                    errors: [
                        '査定後の対象経費が申請時の対象経費（' +
                            this._addComma(totalExpense) +
                            '円）を超えています。',
                    ],
                }
            }
        }

        // 分数のまま計算して丸め誤差を避ける。端数は切り捨て（申請時の判定と同じ規則）
        var byRate = Math.floor((expense * numerator) / denominator)
        var awardAmount = Math.min(byRate, capAmount)

        return {
            ok: true,
            errors: [],
            approvedExpense: expense,
            awardAmount: awardAmount,
            capAmount: capAmount,
            rateLabel: numerator + '/' + denominator,
            cappedByLimit: byRate > capAmount,
        }
    },

    /**
     * 採択番号の採番。形式は AWD-<西暦>-<4桁連番>。
     * 同一年内の最大連番へ1を加える。
     *
     * TODO(要確認): 採番規則が未確定（年度切り替えの基準・公募回次の反映）。
     *   暫定で西暦年＋年内通番としている。確定時のみ採番するため欠番は発生しない。
     */
    generateAwardNumber: function () {
        var year = new GlideDateTime().getYearLocalTime() + ''
        var prefix = ApplicationAwardUtil.NUMBER_PREFIX + '-' + year + '-'

        // 同一年の採択のうち番号が最大のものを取得する
        // （連番が固定4桁のため文字列としての降順で先頭が最大となる）
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.addQuery('u_award_number', 'STARTSWITH', prefix)
        gr.orderByDesc('u_award_number')
        gr.setLimit(1)
        gr.query()

        var next = 1
        if (gr.next()) {
            var current = (gr.getValue('u_award_number') || '') + ''
            var serial = parseInt(current.substring(prefix.length), 10)
            if (!isNaN(serial)) {
                next = serial + 1
            }
        }

        return prefix + this._padLeft(next, 4)
    },

    /**
     * 採択として確定する（ITCOM-09）。
     *
     * 申請審査完了（review_done）へ遷移させ、採択番号を採番して交付決定額を確定する。
     *
     * @param requestId       対象の申請
     * @param staffId         確定した事務局管理者
     * @param approvedExpense 査定後の対象経費（省略時は申請時の対象経費）
     * @param note            判定理由・特記事項（任意）
     */
    approve: function (requestId, staffId, approvedExpense, note) {
        var loaded = this._loadDecidable(requestId, staffId)
        if (loaded.errors) {
            return { success: false, errors: loaded.errors }
        }

        var errors = this.validateNote(note, false, '判定理由・特記事項')
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        var calculated = this.calcAwardAmount(requestId, approvedExpense)
        if (!calculated.ok) {
            return { success: false, errors: calculated.errors }
        }

        var gr = loaded.gr
        var fromStatus = gr.getValue('u_application_status')
        var now = new GlideDateTime().getValue()

        gr.setValue('u_approved_expense_amount', calculated.approvedExpense)
        gr.setValue('u_award_amount', calculated.awardAmount)
        gr.setValue('u_decision_note', this._trim(note))
        gr.setValue('u_decided_on', now)
        gr.setValue('u_decided_by', staffId + '')
        gr.setValue('u_application_status', ApplicationAwardUtil.AWARDED)

        // 採択番号の採番。同時確定で重複した場合はリトライする
        var attempt = 0
        var saved = false
        var awardNumber = ''
        while (attempt < ApplicationAwardUtil.NUMBER_MAX_ATTEMPTS && !saved) {
            attempt++
            awardNumber = this.generateAwardNumber()
            gr.setValue('u_award_number', awardNumber)

            if (this._existsAwardNumber(awardNumber, requestId)) {
                // 直前に他の申請が同じ番号を採ったため再採番する
                continue
            }

            if (gr.update()) {
                saved = true
            }
        }

        if (!saved) {
            gs.error('[SKS] 採択の確定に失敗しました。request=' + requestId + ' attempts=' + attempt)
            return { success: false, errors: ['処理に失敗しました。時間をおいて再度お試しください。'] }
        }

        new x_dent2_dentsusoke.ApplicationLogUtil().record(requestId, 'awarded', {
            fromStatus: fromStatus,
            toStatus: ApplicationAwardUtil.AWARDED,
            detail:
                '採択番号 ' +
                awardNumber +
                '／交付決定額 ' +
                calculated.awardAmount +
                '円（査定後の対象経費 ' +
                calculated.approvedExpense +
                '円）',
            actor: staffId,
        })

        gs.info(
            '[SKS] 採択として確定しました。request=' +
                requestId +
                ' number=' +
                gr.getValue('u_application_number') +
                ' award=' +
                awardNumber +
                ' amount=' +
                calculated.awardAmount,
        )

        return {
            success: true,
            action: 'award_approve',
            sys_id: requestId + '',
            status: ApplicationAwardUtil.AWARDED,
            awardNumber: awardNumber,
            approvedExpense: calculated.approvedExpense,
            awardAmount: calculated.awardAmount,
            cappedByLimit: calculated.cappedByLimit,
            message: '採択として確定しました（採択番号 ' + awardNumber + '）。',
            /**
             * TODO(IF-07): 採択通知の方式（メール／お知らせ／書面）が未確定のため送信しない。
             *   確定後に sysevent_register ＋ sysevent_email_action を追加する
             *   （申請の不備確認依頼メールと同じ実装パターン）。
             */
            warnings: [
                '採択通知は方式が未確定のため送信していません。申請者は「申請」画面で結果を確認できます。',
                '添付書類のファイルサーバへの複製（RPA 連携）は申請審査完了を契機に実行されます。',
            ],
        }
    },

    /**
     * 不採択として確定する（ITCOM-09）。
     *
     * 不採択（rejected）は終端状態であり、事業者側から再申請・修正はできない。
     * 理由区分と申請者への通知文の両方を必須とする
     * （一次審査の不採択＝ApplicationReviewUtil.reject と同じ方針）。
     */
    reject: function (requestId, staffId, reasonCode, reason) {
        var loaded = this._loadDecidable(requestId, staffId)
        if (loaded.errors) {
            return { success: false, errors: loaded.errors }
        }

        var errors = []
        if (!this._trim(reasonCode)) {
            errors.push('不採択理由区分を選択してください。')
        }
        errors = errors.concat(this.validateNote(reason, true, '不採択理由・申請者への通知文'))
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        var gr = loaded.gr
        var fromStatus = gr.getValue('u_application_status')
        var now = new GlideDateTime().getValue()

        gr.setValue('u_reject_reason_code', this._trim(reasonCode))
        gr.setValue('u_reject_reason', this._trim(reason))
        gr.setValue('u_decided_on', now)
        gr.setValue('u_decided_by', staffId + '')
        gr.setValue('u_application_status', ApplicationAwardUtil.REJECTED)

        if (!gr.update()) {
            gs.error('[SKS] 不採択の確定に失敗しました。request=' + requestId)
            return { success: false, errors: ['処理に失敗しました。時間をおいて再度お試しください。'] }
        }

        new x_dent2_dentsusoke.ApplicationLogUtil().record(requestId, 'rejected', {
            fromStatus: fromStatus,
            toStatus: ApplicationAwardUtil.REJECTED,
            detail: gr.getDisplayValue('u_reject_reason_code') + '：' + this._trim(reason),
            actor: staffId,
        })

        gs.info(
            '[SKS] 不採択として確定しました。request=' +
                requestId +
                ' number=' +
                gr.getValue('u_application_number') +
                ' code=' +
                this._trim(reasonCode),
        )

        return {
            success: true,
            action: 'award_reject',
            sys_id: requestId + '',
            status: ApplicationAwardUtil.REJECTED,
            message: '不採択として確定しました（終端状態のため以降の操作はできません）。',
            /**
             * TODO(IF-07): 不採択通知の方式が未確定のため送信しない。
             *   u_reject_reason は「申請者への通知文」として保持しているため本文へ流用できる。
             */
            warnings: [
                '不採択通知は方式が未確定のため送信していません。申請者は「申請」画面で結果を確認できます。',
            ],
        }
    },

    /**
     * 一次審査へ差し戻す（ITCOM-09）。
     *
     * 確定の直前に審査のやり直しが必要と判断した場合に使う。
     * 一次審査中（first_review）へ戻し、判定をやり直せるようにする。
     *
     * 一次審査の判定（u_review_result）と審査日時は消す。
     * 残しておくと「差し戻したのに完了扱いの判定が残っている」状態になり、
     * どの判定が有効なのか分からなくなる。
     *
     * @param reason 差し戻しの理由（必須。履歴へ残す）
     */
    returnToReview: function (requestId, staffId, reason) {
        var loaded = this._loadDecidable(requestId, staffId)
        if (loaded.errors) {
            return { success: false, errors: loaded.errors }
        }

        var errors = this.validateNote(reason, true, '差し戻しの理由')
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        var gr = loaded.gr
        var fromStatus = gr.getValue('u_application_status')

        gr.setValue('u_review_result', '')
        gr.setValue('u_reviewed_on', '')
        gr.setValue('u_application_status', ApplicationAwardUtil.RETURNED)

        if (!gr.update()) {
            gs.error('[SKS] 一次審査への差し戻しに失敗しました。request=' + requestId)
            return { success: false, errors: ['処理に失敗しました。時間をおいて再度お試しください。'] }
        }

        new x_dent2_dentsusoke.ApplicationLogUtil().record(requestId, 'returned', {
            fromStatus: fromStatus,
            toStatus: ApplicationAwardUtil.RETURNED,
            detail: this._trim(reason),
            actor: staffId,
        })

        return {
            success: true,
            action: 'award_return',
            sys_id: requestId + '',
            status: ApplicationAwardUtil.RETURNED,
            message: '一次審査へ差し戻しました。審査担当者が判定をやり直せます。',
            warnings: ['一次審査の判定と審査日時は消去しました（審査をやり直すため）。'],
        }
    },

    /** 判定理由・通知文の検証 */
    validateNote: function (note, required, label) {
        var errors = []
        var name = this._trim(label) || '内容'
        var text = this._trim(note)

        if (!text) {
            if (required) {
                errors.push(name + 'を入力してください。')
            }
            return errors
        }

        if (text.length > ApplicationAwardUtil.MAX_NOTE_LENGTH) {
            errors.push(name + 'は' + ApplicationAwardUtil.MAX_NOTE_LENGTH + '文字以内で入力してください。')
        }

        return errors
    },

    // -----------------------------------------------------------------------
    /**
     * 確定できる状態の申請を取得する。
     * ロールの検証も行う（権限設計書 A20：確定は staff_admin）。
     *
     * @return { gr } または { errors }
     */
    _loadDecidable: function (requestId, staffId) {
        if (!requestId || !staffId) {
            return { errors: ['対象の申請と確定者を指定してください。'] }
        }

        if (!this.canDecideByRole()) {
            return { errors: ['採択判定の確定は事務局管理者のみが実行できます。'] }
        }

        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        if (!gr.get(requestId + '')) {
            return { errors: ['対象の申請が見つかりません。'] }
        }

        var status = gr.getValue('u_application_status')
        if (!this.canDecide(status)) {
            return {
                errors: [
                    '採択判定を確定できる状態ではありません（' +
                        gr.getDisplayValue('u_application_status') +
                        '）。一次審査と信用調査を完了させてください。',
                ],
            }
        }

        return { gr: gr }
    },

    /** 信用調査の結果（免除の場合は調査レコードが無い） */
    _summarizeCredit: function (gr, requestId) {
        var required = gr.getValue('u_credit_required') || ''
        var latest = new x_dent2_dentsusoke.ApplicationCreditUtil().getLatest(requestId)

        return {
            required: required,
            requiredLabel: gr.getDisplayValue('u_credit_required') || '',
            judgedOn: gr.getDisplayValue('u_credit_judged_on'),
            exempt: required === 'exempt',
            result: latest ? latest.result : '',
            resultLabel: latest ? latest.resultLabel : '',
            receivedOn: latest ? latest.receivedOn : '',
            agency: latest ? latest.agency : '',
            note: latest ? latest.note : '',
        }
    },

    /**
     * 重複申請の確認。
     *
     * 同一法人番号の他の申請が審査中・採択済みで存在するかを確認する。
     * 1事業者が複数回申請できる運用かは未確定であり、機械的に弾かず件数を提示する。
     * TODO(要確認): 複数回次・複数件の申請を認めるかが未確定（T03 に公募回次の列はある）。
     */
    _summarizeDuplicate: function (requestId, entityId) {
        var result = { ok: true, count: 0, corporateNumber: '', numbers: [] }
        if (!entityId) {
            return result
        }

        var entity = new GlideRecord('x_dent2_dentsusoke_entity')
        if (!entity.get(entityId + '')) {
            return result
        }

        var corporateNumber = entity.getValue('u_corporate_number') || ''
        result.corporateNumber = corporateNumber

        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.addQuery('sys_id', '!=', requestId + '')
        gr.addQuery('u_application_status', 'IN', ApplicationAwardUtil.ACTIVE_STATUSES.join(','))

        if (corporateNumber) {
            // 法人番号が同じ事業者の申請（同一事業者の別レコードも含めて検出する）
            gr.addQuery('u_business_entity.u_corporate_number', corporateNumber)
        } else {
            // 法人番号が無い場合（個人事業主等）は同一事業者のみで判定する
            gr.addQuery('u_business_entity', entityId + '')
        }

        gr.orderBy('u_application_number')
        // 件数を提示するだけのため上限を明示する（トンマナ 3.3.2）
        gr.setLimit(20)
        gr.query()

        while (gr.next()) {
            result.numbers.push(gr.getValue('u_application_number') + '（' + gr.getDisplayValue('u_application_status') + '）')
        }

        result.count = result.numbers.length
        result.ok = result.count === 0
        return result
    },

    /** 前年度採択の有無（本システム内の登録内容のみで判定する） */
    _isPriorYearAwarded: function (entityId) {
        if (!entityId) {
            return false
        }
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        if (!gr.get(entityId + '')) {
            return false
        }
        return gr.getValue('u_prior_year_awarded_flag') === '1'
    },

    /** 指定した採択番号が既に使われているか（自分自身は除く） */
    _existsAwardNumber: function (awardNumber, excludeSysId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.addQuery('u_award_number', awardNumber)
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

    type: 'ApplicationAwardUtil',
}
