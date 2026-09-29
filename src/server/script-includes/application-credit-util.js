/**
 * ApplicationCreditUtil
 *
 * 信用調査（事務局側／画面イメージ ITCOM-08）。
 * 要否判定、外部機関への依頼、督促、結果の取込、調査の取消を担当する。
 *
 * ■ 申請ステータスと調査レコードの対応
 * 申請（T03 u_application_status）は申請全体の段階を表し、
 * 調査レコード（x_dent2_dentsusoke_credit の u_state）は1回の調査の段階を表す。
 *   一次審査完了（first_review_done）… 要否判定の対象
 *   信用調査要否判定中（credit_judging）… 判定を保留・取消で戻した状態
 *   信用調査免除（credit_exempt）  … 調査を行わず採択判定へ進む（調査レコードを作らない）
 *   外部調査準備中（ext_preparing）… 調査レコード作成済・依頼前（preparing）
 *   外部信用調査中（ext_reviewing）… 依頼済・回答待ち（requested）
 *   調査結果取込待ち（result_waiting）… 督促した状態（requested のまま）
 *   信用調査結果確認中（result_checking）… 結果を取り込んだ状態（received）
 *
 * TODO(要確認): 外部信用調査中と調査結果取込待ちの使い分けが未確定。
 *   本実装では「依頼済＝外部信用調査中」「督促後＝調査結果取込待ち」としている。
 *   回答予定日の超過で自動遷移させる案もあるが、定期実行の要否が未確定のため行わない。
 *
 * ■ 1申請に複数回の調査
 * 再調査があるため調査レコードは1対多で持つ（T03 へ列を足すと履歴が残らない）。
 * 「最新の調査」は回次（u_sequence）の最大値で判断する。
 *
 * ■ 外部機関との連携
 * 外部審査員には ServiceNow のロール・アカウントを付与しない方針（A17）のため、
 * 外部機関が直接入力する経路は取れない。
 * 依頼書・結果ファイルの授受を前提とし、事務局が結果を登録する。
 * ファイルは調査レコードへ添付する（sys_attachment）。
 * TODO(要確認): 外部機関との連携方式が未定義（IF 番号の割当も無い）。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない。
 */
var ApplicationCreditUtil = Class.create()

/** 調査レコードのテーブル */
ApplicationCreditUtil.TABLE = 'x_dent2_dentsusoke_credit'

/** 要否判定の対象となる申請ステータス */
ApplicationCreditUtil.JUDGE_STATUSES = ['first_review_done', 'credit_judging']

/** 申請ステータス */
ApplicationCreditUtil.JUDGING = 'credit_judging'
ApplicationCreditUtil.EXEMPT = 'credit_exempt'
ApplicationCreditUtil.PREPARING = 'ext_preparing'
ApplicationCreditUtil.REVIEWING = 'ext_reviewing'
ApplicationCreditUtil.RESULT_WAITING = 'result_waiting'
ApplicationCreditUtil.RESULT_CHECKING = 'result_checking'

/** 調査レコードの状態 */
ApplicationCreditUtil.STATE_PREPARING = 'preparing'
ApplicationCreditUtil.STATE_REQUESTED = 'requested'
ApplicationCreditUtil.STATE_RECEIVED = 'received'
ApplicationCreditUtil.STATE_CANCELLED = 'cancelled'

/** 結果の取込ができる申請ステータス（依頼済・督促後） */
ApplicationCreditUtil.RECEIVABLE_STATUSES = ['ext_reviewing', 'result_waiting']

/** 要否判定のしきい値（補助金額・円）の既定値。プロパティで変更できる */
ApplicationCreditUtil.DEFAULT_THRESHOLD_AMOUNT = 5000000

/** 回答予定日の既定日数（依頼日から）。プロパティで変更できる */
ApplicationCreditUtil.DEFAULT_DUE_DAYS = 14

/** 事務局メモの最大文字数（テーブルの桁数に合わせる） */
ApplicationCreditUtil.MAX_NOTE_LENGTH = 2000

/** 1申請あたりの調査回数の上限（取得件数を抑えるため：トンマナ 3.3.2） */
ApplicationCreditUtil.MAX_CHECKS = 20

ApplicationCreditUtil.prototype = {
    initialize: function () {},

    /** 要否判定の対象となる申請ステータスか */
    canJudge: function (status) {
        return ApplicationCreditUtil.JUDGE_STATUSES.indexOf((status || '') + '') >= 0
    },

    /** 結果を取り込める申請ステータスか */
    canReceive: function (status) {
        return ApplicationCreditUtil.RECEIVABLE_STATUSES.indexOf((status || '') + '') >= 0
    },

    /** 要否判定のしきい値（トンマナ 3.4.4） */
    getThresholdAmount: function () {
        var amount = parseInt(
            gs.getProperty(
                'x_dent2_dentsusoke.credit.threshold_amount',
                ApplicationCreditUtil.DEFAULT_THRESHOLD_AMOUNT,
            ),
            10,
        )
        if (isNaN(amount) || amount < 0) {
            amount = ApplicationCreditUtil.DEFAULT_THRESHOLD_AMOUNT
        }
        return amount
    },

    /** 回答予定日の日数（トンマナ 3.4.4） */
    getDueDays: function () {
        var days = parseInt(
            gs.getProperty('x_dent2_dentsusoke.credit.due_days', ApplicationCreditUtil.DEFAULT_DUE_DAYS),
            10,
        )
        if (isNaN(days) || days <= 0) {
            days = ApplicationCreditUtil.DEFAULT_DUE_DAYS
        }
        return days
    },

    /** 回答予定日（依頼日＋日数） */
    calcDueOn: function () {
        var base = new GlideDateTime()
        base.addDaysLocalTime(this.getDueDays())
        return base.getDate().getValue()
    },

    /**
     * 要否判定の材料と推奨結果。
     *
     * 判定そのものは事務局が行う。本メソッドは画面（ITCOM-08 ①要否判定）へ
     * 判断材料を提示するためのもので、値を保存しない。
     *
     * TODO(要確認): 要否判定基準・免除条件が未確定。
     *   現状は「補助金額がしきい値以上なら調査対象」「前年度採択実績があれば免除の候補」
     *   という暫定案であり、画面イメージの仮置きに合わせている。
     *
     * @return { ok, required, thresholdAmount, subsidyAmount, priorYearAwarded, reasons }
     */
    suggest: function (requestId) {
        if (!requestId) {
            return { ok: false, reasons: ['対象の申請が指定されていません。'] }
        }

        // 対象は sys_id で確定しているため get を使用する（トンマナ 3.2.3）
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        if (!gr.get(requestId + '')) {
            return { ok: false, reasons: ['対象の申請が見つかりません。'] }
        }

        var threshold = this.getThresholdAmount()
        var subsidyAmount = parseInt(gr.getValue('u_subsidy_amount'), 10) || 0
        var priorYearAwarded = this._isPriorYearAwarded(gr.getValue('u_business_entity'))

        var reasons = []
        var required = subsidyAmount >= threshold

        if (required) {
            reasons.push(
                '補助金額 ' +
                    this._addComma(subsidyAmount) +
                    '円 がしきい値 ' +
                    this._addComma(threshold) +
                    '円 以上のため調査対象の候補です。',
            )
        } else {
            reasons.push(
                '補助金額 ' +
                    this._addComma(subsidyAmount) +
                    '円 がしきい値 ' +
                    this._addComma(threshold) +
                    '円 未満のため免除の候補です。',
            )
        }

        if (priorYearAwarded) {
            reasons.push('前年度の採択実績があります（免除とする案がありますが基準は未確定です）。')
        } else {
            reasons.push('前年度の採択実績はありません。')
        }

        /**
         * 前年度採択の照合は本システム内の u_prior_year_awarded_flag のみで行う。
         * Salesforce 横断照合（IF-02）は未実装のため、他システムに実績があっても検出できない。
         */
        reasons.push('前年度採択の照合は本システム内の登録内容のみで行っています（IF-02 未実装）。')

        return {
            ok: true,
            required: required,
            thresholdAmount: threshold,
            subsidyAmount: subsidyAmount,
            priorYearAwarded: priorYearAwarded,
            employeeCategoryLabel: gr.getDisplayValue('u_employee_count_category'),
            reasons: reasons,
        }
    },

    /**
     * 信用調査の要否判定（ITCOM-08 ①）。
     *
     * @param requestId 対象の申請
     * @param staffId   判定した事務局ユーザ
     * @param required  true なら調査を実施（調査レコードを作成）、false なら免除
     */
    judge: function (requestId, staffId, required) {
        if (!requestId || !staffId) {
            return { success: false, errors: ['対象の申請と事務局ユーザを指定してください。'] }
        }

        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        if (!gr.get(requestId + '')) {
            return { success: false, errors: ['対象の申請が見つかりません。'] }
        }

        var status = gr.getValue('u_application_status')
        if (!this.canJudge(status)) {
            return {
                success: false,
                errors: [
                    '一次審査が完了していない、または既に判定済みの申請です（' +
                        gr.getDisplayValue('u_application_status') +
                        '）。',
                ],
            }
        }

        var isRequired = required === true || required === 'true'
        var nextStatus = isRequired ? ApplicationCreditUtil.PREPARING : ApplicationCreditUtil.EXEMPT

        gr.setValue('u_credit_required', isRequired ? 'required' : 'exempt')
        gr.setValue('u_credit_judged_on', new GlideDateTime().getValue())
        gr.setValue('u_application_status', nextStatus)

        if (!gr.update()) {
            gs.error('[SKS] 信用調査の要否判定に失敗しました。request=' + requestId)
            return { success: false, errors: ['処理に失敗しました。時間をおいて再度お試しください。'] }
        }

        var checkId = ''
        if (isRequired) {
            checkId = this._createCheck(requestId, staffId)
            if (!checkId) {
                gs.error('[SKS] 信用調査レコードの作成に失敗しました。request=' + requestId)
                return {
                    success: false,
                    errors: ['調査レコードの作成に失敗しました。時間をおいて再度お試しください。'],
                }
            }
        }

        new x_dent2_dentsusoke.ApplicationLogUtil().record(requestId, 'credit_judged', {
            fromStatus: status,
            toStatus: nextStatus,
            detail: isRequired ? '信用調査を実施' : '信用調査を免除',
            actor: staffId,
        })

        gs.info(
            '[SKS] 信用調査の要否を判定しました。request=' +
                requestId +
                ' number=' +
                gr.getValue('u_application_number') +
                ' required=' +
                isRequired,
        )

        return {
            success: true,
            action: isRequired ? 'credit_required' : 'credit_exempt',
            sys_id: requestId + '',
            status: nextStatus,
            checkId: checkId,
            message: isRequired
                ? '信用調査を実施します（外部調査準備中）。調査レコードから外部機関への依頼を登録してください。'
                : '信用調査を免除しました（採択判定へ進めます）。',
        }
    },

    /**
     * 外部機関への調査依頼（ITCOM-08 ②）。
     *
     * 調査レコード側の操作。依頼書のファイルは調査レコードへ添付する。
     *
     * @param checkId 調査レコード
     * @param staffId 操作した事務局ユーザ
     * @param agency  調査機関（必須）
     * @param dueOn   回答予定日（yyyy-MM-dd。省略時は依頼日＋既定日数）
     */
    request: function (checkId, staffId, agency, dueOn) {
        var loaded = this._loadCheck(checkId, staffId, ApplicationCreditUtil.STATE_PREPARING)
        if (loaded.errors) {
            return { success: false, errors: loaded.errors }
        }

        if (!this._trim(agency)) {
            return { success: false, errors: ['調査機関を入力してください。'] }
        }

        var check = loaded.check
        var requestId = check.getValue('u_request')
        var due = this._trim(dueOn) || this.calcDueOn()

        check.setValue('u_agency', this._trim(agency))
        check.setValue('u_requested_on', new GlideDate().getValue())
        check.setValue('u_due_on', due)
        check.setValue('u_state', ApplicationCreditUtil.STATE_REQUESTED)
        check.setValue('u_updated_by_staff', staffId + '')

        if (!check.update()) {
            gs.error('[SKS] 信用調査の依頼登録に失敗しました。check=' + checkId)
            return { success: false, errors: ['処理に失敗しました。時間をおいて再度お試しください。'] }
        }

        var moved = this._moveRequestStatus(
            requestId,
            [ApplicationCreditUtil.PREPARING],
            ApplicationCreditUtil.REVIEWING,
        )

        new x_dent2_dentsusoke.ApplicationLogUtil().record(requestId, 'credit_requested', {
            fromStatus: moved.fromStatus,
            toStatus: moved.changed ? ApplicationCreditUtil.REVIEWING : '',
            detail: '調査機関：' + this._trim(agency) + '／回答予定日：' + due,
            actor: staffId,
        })

        return {
            success: true,
            action: 'credit_request',
            sys_id: checkId + '',
            requestId: requestId,
            dueOn: due,
            message: '外部機関へ依頼済みとして記録しました（回答予定日 ' + due + '）。',
            /**
             * TODO(要確認): 依頼書の様式・送付方法が未確定。
             *   現状は依頼書ファイルを本レコードへ添付する運用を前提としている。
             */
            warnings: ['依頼書の授受はシステム外です。依頼書ファイルは本レコードへ添付してください。'],
        }
    },

    /**
     * 調査の督促（ITCOM-08）。
     *
     * 申請ステータスを調査結果取込待ち（result_waiting）へ移し、督促した事実を履歴へ残す。
     * 調査レコードの状態は依頼済（requested）のまま変えない（調査は継続しているため）。
     *
     * TODO(要確認): 督促の運用（タイミング・手段）が未確定。
     *   メール送付・定期実行による自動督促は実装していない。
     */
    remind: function (checkId, staffId) {
        var loaded = this._loadCheck(checkId, staffId, ApplicationCreditUtil.STATE_REQUESTED)
        if (loaded.errors) {
            return { success: false, errors: loaded.errors }
        }

        var check = loaded.check
        var requestId = check.getValue('u_request')

        var moved = this._moveRequestStatus(
            requestId,
            [ApplicationCreditUtil.REVIEWING, ApplicationCreditUtil.RESULT_WAITING],
            ApplicationCreditUtil.RESULT_WAITING,
        )
        if (!moved.ok) {
            return { success: false, errors: moved.errors }
        }

        new x_dent2_dentsusoke.ApplicationLogUtil().record(requestId, 'credit_reminded', {
            fromStatus: moved.fromStatus,
            toStatus: ApplicationCreditUtil.RESULT_WAITING,
            detail: '調査機関：' + (check.getValue('u_agency') || '') + '／回答予定日：' + (check.getValue('u_due_on') || ''),
            actor: staffId,
        })

        return {
            success: true,
            action: 'credit_remind',
            sys_id: checkId + '',
            requestId: requestId,
            message: '督促した記録を残しました（調査結果取込待ち）。',
            warnings: ['督促の連絡はシステム外です。督促メールの自動送信は実装していません。'],
        }
    },

    /**
     * 調査結果の取込（ITCOM-08 ③）。
     *
     * @param checkId 調査レコード
     * @param staffId 取り込んだ事務局ユーザ
     * @param result  調査結果（ok／conditional／ng。必須）
     * @param note    事務局メモ（任意）
     */
    receive: function (checkId, staffId, result, note) {
        var loaded = this._loadCheck(checkId, staffId, ApplicationCreditUtil.STATE_REQUESTED)
        if (loaded.errors) {
            return { success: false, errors: loaded.errors }
        }

        var errors = this.validateResult(result, note)
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        var check = loaded.check
        var requestId = check.getValue('u_request')

        check.setValue('u_result', this._trim(result))
        check.setValue('u_note', this._trim(note))
        check.setValue('u_received_on', new GlideDateTime().getValue())
        check.setValue('u_state', ApplicationCreditUtil.STATE_RECEIVED)
        check.setValue('u_updated_by_staff', staffId + '')

        if (!check.update()) {
            gs.error('[SKS] 信用調査結果の取込に失敗しました。check=' + checkId)
            return { success: false, errors: ['処理に失敗しました。時間をおいて再度お試しください。'] }
        }

        var moved = this._moveRequestStatus(
            requestId,
            ApplicationCreditUtil.RECEIVABLE_STATUSES,
            ApplicationCreditUtil.RESULT_CHECKING,
        )
        if (!moved.ok) {
            return { success: false, errors: moved.errors }
        }

        new x_dent2_dentsusoke.ApplicationLogUtil().record(requestId, 'credit_received', {
            fromStatus: moved.fromStatus,
            toStatus: ApplicationCreditUtil.RESULT_CHECKING,
            detail: '調査結果：' + check.getDisplayValue('u_result'),
            actor: staffId,
        })

        gs.info(
            '[SKS] 信用調査結果を取り込みました。check=' +
                checkId +
                ' request=' +
                requestId +
                ' result=' +
                this._trim(result),
        )

        return {
            success: true,
            action: 'credit_receive',
            sys_id: checkId + '',
            requestId: requestId,
            result: this._trim(result),
            message: '調査結果を取り込みました（信用調査結果確認中）。採択判定へ進めます。',
            /**
             * TODO(要確認): 結果が「問題あり」の場合の扱いが未確定
             *   （即不採択か、事務局判断か）。現状は自動で不採択にせず、
             *   採択判定（ITCOM-09）で事務局が判断する。
             */
            warnings:
                this._trim(result) === 'ng'
                    ? ['調査結果が「問題あり」です。不採択とするかは採択判定で判断してください（基準は未確定）。']
                    : [],
        }
    },

    /**
     * 調査の取消（ITCOM-08）。
     *
     * 依頼の誤り・調査機関の変更などでやり直す場合に使う。
     * 申請ステータスは信用調査要否判定中（credit_judging）へ戻し、
     * 要否判定からやり直せるようにする。
     *
     * @param reason 取消の理由（必須。履歴へ残す）
     */
    cancel: function (checkId, staffId, reason) {
        var loaded = this._loadCheck(checkId, staffId)
        if (loaded.errors) {
            return { success: false, errors: loaded.errors }
        }

        var check = loaded.check
        var state = check.getValue('u_state')
        if (state === ApplicationCreditUtil.STATE_CANCELLED) {
            return { success: false, errors: ['この調査は既に取消済みです。'] }
        }
        if (state === ApplicationCreditUtil.STATE_RECEIVED) {
            return {
                success: false,
                errors: ['結果を取り込んだ調査は取消できません。再調査が必要な場合は要否判定からやり直してください。'],
            }
        }

        if (!this._trim(reason)) {
            return { success: false, errors: ['取消の理由を入力してください。'] }
        }

        var requestId = check.getValue('u_request')

        check.setValue('u_state', ApplicationCreditUtil.STATE_CANCELLED)
        check.setValue('u_note', this._trim(reason))
        check.setValue('u_updated_by_staff', staffId + '')

        if (!check.update()) {
            gs.error('[SKS] 信用調査の取消に失敗しました。check=' + checkId)
            return { success: false, errors: ['処理に失敗しました。時間をおいて再度お試しください。'] }
        }

        var moved = this._moveRequestStatus(
            requestId,
            [
                ApplicationCreditUtil.PREPARING,
                ApplicationCreditUtil.REVIEWING,
                ApplicationCreditUtil.RESULT_WAITING,
            ],
            ApplicationCreditUtil.JUDGING,
        )

        new x_dent2_dentsusoke.ApplicationLogUtil().record(requestId, 'credit_cancelled', {
            fromStatus: moved.fromStatus,
            toStatus: moved.changed ? ApplicationCreditUtil.JUDGING : '',
            detail: this._trim(reason),
            actor: staffId,
        })

        return {
            success: true,
            action: 'credit_cancel',
            sys_id: checkId + '',
            requestId: requestId,
            message: '調査を取消しました（信用調査要否判定中へ戻しました）。',
        }
    },

    /** 調査結果・事務局メモの検証 */
    validateResult: function (result, note) {
        var errors = []
        var RESULTS = ['ok', 'conditional', 'ng']

        var value = this._trim(result)
        if (!value) {
            errors.push('調査結果を選択してください。')
        } else if (RESULTS.indexOf(value) < 0) {
            errors.push('調査結果の選択値が不正です。')
        }

        var text = this._trim(note)
        if (text.length > ApplicationCreditUtil.MAX_NOTE_LENGTH) {
            errors.push(
                '事務局メモは' + ApplicationCreditUtil.MAX_NOTE_LENGTH + '文字以内で入力してください。',
            )
        }

        return errors
    },

    /** 申請に紐づく調査の一覧（新しい回次が先） */
    list: function (requestId) {
        var rows = []
        if (!requestId) {
            return rows
        }

        var gr = new GlideRecord(ApplicationCreditUtil.TABLE)
        gr.addQuery('u_request', requestId + '')
        gr.orderByDesc('u_sequence')
        gr.setLimit(ApplicationCreditUtil.MAX_CHECKS)
        gr.query()

        while (gr.next()) {
            rows.push({
                sys_id: gr.getUniqueValue(),
                sequence: parseInt(gr.getValue('u_sequence'), 10) || 1,
                agency: gr.getValue('u_agency') || '',
                requestedOn: gr.getValue('u_requested_on') || '',
                dueOn: gr.getValue('u_due_on') || '',
                state: gr.getValue('u_state'),
                stateLabel: gr.getDisplayValue('u_state'),
                result: gr.getValue('u_result') || '',
                resultLabel: gr.getDisplayValue('u_result') || '',
                receivedOn: gr.getDisplayValue('u_received_on'),
                note: gr.getValue('u_note') || '',
            })
        }

        return rows
    },

    /** 最新（回次が最大）の調査。無ければ null */
    getLatest: function (requestId) {
        var rows = this.list(requestId)
        return rows.length > 0 ? rows[0] : null
    },

    // -----------------------------------------------------------------------
    /** 調査レコードを作成する。回次は既存の最大値＋1 */
    _createCheck: function (requestId, staffId) {
        var sequence = 1
        var latest = this.getLatest(requestId)
        if (latest) {
            sequence = latest.sequence + 1
        }

        if (sequence > ApplicationCreditUtil.MAX_CHECKS) {
            gs.error(
                '[SKS] 信用調査の回数が上限に達しています。request=' +
                    requestId +
                    ' max=' +
                    ApplicationCreditUtil.MAX_CHECKS,
            )
            return ''
        }

        var gr = new GlideRecord(ApplicationCreditUtil.TABLE)
        gr.initialize()
        gr.setValue('u_request', requestId + '')
        gr.setValue('u_sequence', sequence)
        gr.setValue('u_state', ApplicationCreditUtil.STATE_PREPARING)
        gr.setValue('u_updated_by_staff', staffId + '')

        var inserted = gr.insert()
        return inserted ? inserted + '' : ''
    },

    /**
     * 調査レコードを取得する。
     *
     * @param expectedState 期待する状態。指定した場合は一致しないとエラーにする
     * @return { check } または { errors }
     */
    _loadCheck: function (checkId, staffId, expectedState) {
        if (!checkId || !staffId) {
            return { errors: ['対象の調査と事務局ユーザを指定してください。'] }
        }

        // 対象は sys_id で確定しているため get を使用する（トンマナ 3.2.3）
        var gr = new GlideRecord(ApplicationCreditUtil.TABLE)
        if (!gr.get(checkId + '')) {
            return { errors: ['対象の調査が見つかりません。'] }
        }

        if (expectedState && gr.getValue('u_state') !== expectedState) {
            return {
                errors: [
                    'この操作は実行できない状態です（現在：' + gr.getDisplayValue('u_state') + '）。',
                ],
            }
        }

        return { check: gr }
    },

    /**
     * 申請ステータスを遷移させる。
     *
     * 調査レコード側の操作から申請のステータスを動かすため、
     * 想定した段階にあることを確認してから更新する。
     *
     * @return { ok, changed, fromStatus, errors }
     */
    _moveRequestStatus: function (requestId, allowedStatuses, nextStatus) {
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        if (!gr.get(requestId + '')) {
            return { ok: false, changed: false, fromStatus: '', errors: ['対象の申請が見つかりません。'] }
        }

        var fromStatus = gr.getValue('u_application_status')
        if (allowedStatuses.indexOf(fromStatus) < 0) {
            return {
                ok: false,
                changed: false,
                fromStatus: fromStatus,
                errors: [
                    '申請の状態が想定と異なります（' +
                        gr.getDisplayValue('u_application_status') +
                        '）。事務局へ確認してください。',
                ],
            }
        }

        if (fromStatus === nextStatus) {
            return { ok: true, changed: false, fromStatus: fromStatus }
        }

        gr.setValue('u_application_status', nextStatus)
        if (!gr.update()) {
            gs.error('[SKS] 申請ステータスの更新に失敗しました。request=' + requestId)
            return {
                ok: false,
                changed: false,
                fromStatus: fromStatus,
                errors: ['処理に失敗しました。時間をおいて再度お試しください。'],
            }
        }

        return { ok: true, changed: true, fromStatus: fromStatus }
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

    type: 'ApplicationCreditUtil',
}
