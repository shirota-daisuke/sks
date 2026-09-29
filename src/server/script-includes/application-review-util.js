/**
 * ApplicationReviewUtil
 *
 * 一次審査（事務局側／画面イメージ ITCOM-06）。
 * 審査対象の抽出条件、審査期限の算出、審査担当者の割当と審査の開始を担当する。
 *
 * ■ 担当（ITCOM-06）と判定（ITCOM-07）
 * ITCOM-06「誰が・いつまでに審査するか」（assign）と
 * ITCOM-07「審査の判定」（complete／requestDefect／reject）をまとめて持つ。
 * いずれも同じ申請の同じ審査フェーズを扱い、遷移できるステータスの判定を共有するため
 * 1つのクラスにしている。
 *
 * ■ ステータスの遷移
 *   受付済（accepted）           → 一次審査中（first_review）
 *   不備修正回答あり（defect_answered） → 再審査中（re_review）
 * 事務局が担当を引き受けた時点で遷移させる。
 * 不備修正の回答を受けた申請は「再審査」として区別する（初回審査と混ざらないようにする）。
 *
 * ■ 審査期限
 * 提出日 ＋ プロパティ x_dent2_dentsusoke.review.sla_days の日数。
 * 一覧で「期限超過」を絞り込めるように T03 の u_review_due_on へ保存する
 * （一覧では経過日数を算出できない）。
 * TODO(要確認): 審査期限・SLA が未確定（暫定30日）。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない。
 */
var ApplicationReviewUtil = Class.create()

/** 一次審査の対象となる申請ステータス（画面イメージ ITCOM-06 の絞込） */
ApplicationReviewUtil.PENDING_STATUSES = ['accepted', 'first_review', 'defect_answered', 're_review']

/** 審査を引き受けられるステータスと、引き受けた後のステータスの対応 */
ApplicationReviewUtil.START_TRANSITIONS = {
    accepted: 'first_review',
    defect_answered: 're_review',
}

/** 審査期限の既定日数（提出日から）。プロパティで変更できる */
ApplicationReviewUtil.DEFAULT_SLA_DAYS = 30

/**
 * 判定を実行できる申請ステータス（ITCOM-07）。
 * 担当を引き受けて審査に着手した状態に限る。
 * 受付済のまま判定できると、担当も期限も決まっていない申請が結論だけ出ることになる。
 */
ApplicationReviewUtil.JUDGE_STATUSES = ['first_review', 're_review']

/** 判定結果ごとの遷移先ステータス */
ApplicationReviewUtil.PASSED = 'first_review_done'
ApplicationReviewUtil.DEFECT = 'defect_request'
ApplicationReviewUtil.REJECTED = 'rejected'

/** 不備確認依頼の回答期限の既定日数（依頼日から）。プロパティで変更できる */
ApplicationReviewUtil.DEFAULT_DEFECT_DUE_DAYS = 14

/** 不備内容・不採択理由の最大文字数（T03 の桁数に合わせる） */
ApplicationReviewUtil.MAX_NOTE_LENGTH = 2000

/** 不備確認依頼メールを送信するイベント */
ApplicationReviewUtil.DEFECT_EVENT = 'x_dent2_dentsusoke.request.defect'

ApplicationReviewUtil.prototype = {
    initialize: function () {},

    /** 一次審査の対象ステータスか */
    isPending: function (status) {
        return ApplicationReviewUtil.PENDING_STATUSES.indexOf((status || '') + '') >= 0
    },

    /** 審査を引き受けられるステータスか（引き受けで遷移が発生するもの） */
    canStart: function (status) {
        return !!ApplicationReviewUtil.START_TRANSITIONS[(status || '') + '']
    },

    /** 審査期限の日数。運用で変更できるようプロパティから取得する（トンマナ 3.4.4） */
    getSlaDays: function () {
        var days = parseInt(
            gs.getProperty('x_dent2_dentsusoke.review.sla_days', ApplicationReviewUtil.DEFAULT_SLA_DAYS),
            10,
        )
        if (isNaN(days) || days <= 0) {
            days = ApplicationReviewUtil.DEFAULT_SLA_DAYS
        }
        return days
    },

    /**
     * 審査期限（yyyy-MM-dd）を算出する。
     *
     * @param submittedOn 提出日時（yyyy-MM-dd HH:mm:ss）。省略時は現在日時
     */
    calcDueOn: function (submittedOn) {
        var base = new GlideDateTime()
        var text = this._trim(submittedOn)
        if (text) {
            base.setValue(text)
        }

        base.addDaysLocalTime(this.getSlaDays())
        return base.getDate().getValue()
    },

    /**
     * 審査担当者の割当と審査の開始。
     *
     * 担当が未設定の場合のみ割り当てる。既に他の担当者が付いている申請を
     * 黙って奪うと、二重に審査される恐れがあるため上書きしない。
     * 担当の変更が必要な場合はレコードフォームで審査担当者を編集する。
     *
     * @param requestId  対象の申請
     * @param assigneeId 担当者（sys_user）
     * @param actorId    操作者（履歴の記録用。省略時は assigneeId）
     */
    assign: function (requestId, assigneeId, actorId) {
        if (!requestId || !assigneeId) {
            return { success: false, errors: ['対象の申請と担当者を指定してください。'] }
        }

        // 対象は sys_id で確定しているため get を使用する（トンマナ 3.2.3）
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        if (!gr.get(requestId + '')) {
            return { success: false, errors: ['対象の申請が見つかりません。'] }
        }

        var status = gr.getValue('u_application_status')
        if (!this.isPending(status)) {
            return { success: false, errors: ['この申請は一次審査の対象ではありません。'] }
        }

        var actor = this._trim(actorId) || assigneeId + ''
        var currentAssignee = gr.getValue('u_review_assigned_to')
        var assigned = false

        if (!currentAssignee) {
            gr.setValue('u_review_assigned_to', assigneeId + '')
            assigned = true
        } else if (currentAssignee !== assigneeId + '') {
            return {
                success: false,
                errors: [
                    '別の担当者（' +
                        gr.getDisplayValue('u_review_assigned_to') +
                        '）が割り当てられています。担当を変更する場合は「審査担当者」を編集してください。',
                ],
            }
        }

        // 期限が未設定の申請（提出時より前に作られたもの）はこの時点で補う
        if (!gr.getValue('u_review_due_on')) {
            gr.setValue('u_review_due_on', this.calcDueOn(gr.getValue('u_submitted_on')))
        }

        var nextStatus = ApplicationReviewUtil.START_TRANSITIONS[status]
        if (nextStatus) {
            gr.setValue('u_application_status', nextStatus)
        }

        if (!gr.update()) {
            gs.error('[SKS] 審査担当の割当に失敗しました。request=' + requestId)
            return { success: false, errors: ['処理に失敗しました。時間をおいて再度お試しください。'] }
        }

        var logUtil = new x_dent2_dentsusoke.ApplicationLogUtil()
        if (assigned) {
            logUtil.record(requestId, 'review_assigned', {
                detail: '審査担当：' + gr.getDisplayValue('u_review_assigned_to'),
                actor: actor,
            })
        }
        if (nextStatus) {
            logUtil.record(requestId, 'review_started', {
                fromStatus: status,
                toStatus: nextStatus,
                actor: actor,
            })
        }

        gs.info(
            '[SKS] 審査担当を割り当てました。request=' +
                requestId +
                ' number=' +
                gr.getValue('u_application_number') +
                ' assignee=' +
                gr.getDisplayValue('u_review_assigned_to') +
                ' status=' +
                gr.getValue('u_application_status'),
        )

        return {
            success: true,
            action: 'assign_review',
            sys_id: requestId + '',
            assigned: assigned,
            statusChanged: !!nextStatus,
            status: gr.getValue('u_application_status'),
            statusLabel: gr.getDisplayValue('u_application_status'),
            dueOn: gr.getValue('u_review_due_on'),
            message: nextStatus
                ? '審査を開始しました（' + gr.getDisplayValue('u_application_status') + '）。'
                : '審査担当を確認しました。',
        }
    },

    // =======================================================================
    // 一次審査の判定（ITCOM-07）
    // =======================================================================

    /** 判定を実行できる申請ステータスか */
    canJudge: function (status) {
        return ApplicationReviewUtil.JUDGE_STATUSES.indexOf((status || '') + '') >= 0
    },

    /** 不備確認依頼の回答期限の日数（トンマナ 3.4.4） */
    getDefectDueDays: function () {
        var days = parseInt(
            gs.getProperty(
                'x_dent2_dentsusoke.review.defect_due_days',
                ApplicationReviewUtil.DEFAULT_DEFECT_DUE_DAYS,
            ),
            10,
        )
        if (isNaN(days) || days <= 0) {
            days = ApplicationReviewUtil.DEFAULT_DEFECT_DUE_DAYS
        }
        return days
    },

    /** 不備確認依頼の回答期限（依頼日＋日数） */
    calcDefectDueOn: function () {
        var base = new GlideDateTime()
        base.addDaysLocalTime(this.getDefectDueDays())
        return base.getDate().getValue()
    },

    /**
     * 一次審査の完了（判定：一次審査完了）。
     *
     * 一次審査完了（first_review_done）へ遷移させる。
     * 信用調査の要否判定（credit_judging）へは自動遷移させない。
     * TODO(要確認): 一次審査完了後に信用調査要否判定へ自動遷移させるか手動操作かが未確定。
     *   自動遷移とする場合は本メソッドの遷移先を credit_judging へ変更する（ITCOM-08 の実装時に判断する）。
     *
     * @param requestId 対象の申請
     * @param staffId   審査者
     * @param note      審査理由・特記事項（任意）
     */
    complete: function (requestId, staffId, note) {
        var loaded = this._loadJudgeable(requestId, staffId)
        if (loaded.errors) {
            return { success: false, errors: loaded.errors }
        }

        var errors = this.validateNote(note, false)
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        var gr = loaded.gr
        var fromStatus = gr.getValue('u_application_status')

        gr.setValue('u_review_result', 'passed')
        gr.setValue('u_review_note', this._trim(note))
        gr.setValue('u_reviewed_on', new GlideDateTime().getValue())
        gr.setValue('u_reviewed_by', staffId + '')
        gr.setValue('u_application_status', ApplicationReviewUtil.PASSED)

        if (!gr.update()) {
            gs.error('[SKS] 一次審査の完了に失敗しました。request=' + requestId)
            return { success: false, errors: ['処理に失敗しました。時間をおいて再度お試しください。'] }
        }

        new x_dent2_dentsusoke.ApplicationLogUtil().record(requestId, 'review_passed', {
            fromStatus: fromStatus,
            toStatus: ApplicationReviewUtil.PASSED,
            detail: this._trim(note),
            actor: staffId,
        })

        gs.info(
            '[SKS] 一次審査を完了しました。request=' +
                requestId +
                ' number=' +
                gr.getValue('u_application_number'),
        )

        return {
            success: true,
            action: 'review_complete',
            sys_id: requestId + '',
            status: ApplicationReviewUtil.PASSED,
            message: '一次審査を完了しました（' + gr.getDisplayValue('u_application_status') + '）。',
            /**
             * TODO(要確認): 一次審査完了の通知メールの要否が未確定（IF-07）。
             *   事業者側の表記は「一次審査完了」であり、審査が続くことが伝わる必要がある。
             */
            warnings: [
                '一次審査完了の通知メールは要否が未確定のため送信していません。',
                '信用調査の要否判定へは自動遷移しません（ITCOM-08 の実装時に判断します）。',
            ],
        }
    },

    /**
     * 不備確認の依頼（判定：不備確認依頼）。
     *
     * 不備確認依頼（defect_request）へ遷移させ、申請者へ不備内容と
     * 修正画面（ITCOM-05）へのリンクを含むメールを送信する。
     *
     * 前回の回答（u_defect_reply）は消す。
     * 消さないと事業者の修正画面に前回の回答が初期値として残り、
     * 今回の指摘への回答と混ざる。消す前の内容は処理履歴へ残す。
     *
     * @param requestId 対象の申請
     * @param staffId   審査者
     * @param note      不備内容（必須。申請者へのメールにそのまま記載される）
     * @param dueOn     回答期限（yyyy-MM-dd。省略時は依頼日＋既定日数）
     */
    requestDefect: function (requestId, staffId, note, dueOn) {
        var loaded = this._loadJudgeable(requestId, staffId)
        if (loaded.errors) {
            return { success: false, errors: loaded.errors }
        }

        var errors = this.validateNote(note, true)
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        var gr = loaded.gr
        var fromStatus = gr.getValue('u_application_status')
        var previousReply = gr.getValue('u_defect_reply') || ''

        var due = this._trim(dueOn)
        if (!due) {
            due = this.calcDefectDueOn()
        }

        gr.setValue('u_review_result', 'defect')
        gr.setValue('u_defect_note', this._trim(note))
        gr.setValue('u_defect_due_on', due)
        gr.setValue('u_defect_reply', '')
        gr.setValue('u_reviewed_on', new GlideDateTime().getValue())
        gr.setValue('u_reviewed_by', staffId + '')
        gr.setValue('u_application_status', ApplicationReviewUtil.DEFECT)

        if (!gr.update()) {
            gs.error('[SKS] 不備確認依頼に失敗しました。request=' + requestId)
            return { success: false, errors: ['処理に失敗しました。時間をおいて再度お試しください。'] }
        }

        var logUtil = new x_dent2_dentsusoke.ApplicationLogUtil()
        logUtil.record(requestId, 'defect_requested', {
            fromStatus: fromStatus,
            toStatus: ApplicationReviewUtil.DEFECT,
            detail: this._trim(note),
            actor: staffId,
        })

        // 消した前回の回答を履歴へ残す（往復の記録が失われないようにする）
        if (previousReply) {
            logUtil.record(requestId, 'defect_answered', {
                detail: '前回の回答（再依頼により入力欄からは削除）：' + previousReply,
                actor: staffId,
            })
        }

        /**
         * 不備確認依頼メール（処理No.45 と同じ方式）。
         * parm1 に申請者ユーザの sys_id を渡し、通知側で宛先として解決する。
         */
        var applicantUserId = gr.getValue('u_applicant_user')
        if (applicantUserId) {
            gs.eventQueue(ApplicationReviewUtil.DEFECT_EVENT, gr, applicantUserId, requestId + '')
        } else {
            gs.error(
                '[SKS] 申請者ユーザが未設定のため不備確認依頼メールを送信できません。request=' + requestId,
            )
        }

        gs.info(
            '[SKS] 不備確認を依頼しました。request=' +
                requestId +
                ' number=' +
                gr.getValue('u_application_number') +
                ' due=' +
                due,
        )

        return {
            success: true,
            action: 'review_request_defect',
            sys_id: requestId + '',
            status: ApplicationReviewUtil.DEFECT,
            dueOn: due,
            mailQueued: !!applicantUserId,
            message: '不備修正を依頼しました（回答期限 ' + due + '）。',
            warnings: applicantUserId
                ? []
                : ['申請者ユーザが未設定のため、案内メールを送信できませんでした。'],
        }
    },

    /**
     * 不採択の確定（判定：不採択）。
     *
     * 不採択（rejected）は終端状態であり、事業者側から再提出はできない。
     * 理由区分と申請者への通知文の両方を必須とする。
     * SC-11 のユーザ登録審査では却下理由を記録する項目が無く、
     * 「なぜ却下されたか」が後から追えない問題が TODO として残っている。
     * 申請側では同じ状態にしないため、理由の入力を必須にしている。
     *
     * @param requestId  対象の申請
     * @param staffId    審査者
     * @param reasonCode 不採択理由区分（必須）
     * @param reason     不採択理由・申請者への通知文（必須）
     */
    reject: function (requestId, staffId, reasonCode, reason) {
        var loaded = this._loadJudgeable(requestId, staffId)
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

        gr.setValue('u_review_result', 'rejected')
        gr.setValue('u_reject_reason_code', this._trim(reasonCode))
        gr.setValue('u_reject_reason', this._trim(reason))
        gr.setValue('u_reviewed_on', now)
        gr.setValue('u_reviewed_by', staffId + '')
        /**
         * 不採択は終端状態のため、採択判定の確定（ITCOM-09）を待たずここで確定する。
         * 確定日時・確定者を空のままにすると、いつ誰が決めたのかが追えない。
         */
        gr.setValue('u_decided_on', now)
        gr.setValue('u_decided_by', staffId + '')
        gr.setValue('u_application_status', ApplicationReviewUtil.REJECTED)

        if (!gr.update()) {
            gs.error('[SKS] 不採択の確定に失敗しました。request=' + requestId)
            return { success: false, errors: ['処理に失敗しました。時間をおいて再度お試しください。'] }
        }

        new x_dent2_dentsusoke.ApplicationLogUtil().record(requestId, 'rejected', {
            fromStatus: fromStatus,
            toStatus: ApplicationReviewUtil.REJECTED,
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
            action: 'review_reject',
            sys_id: requestId + '',
            status: ApplicationReviewUtil.REJECTED,
            message: '不採択として確定しました（終端状態のため以降の操作はできません）。',
            /**
             * TODO(要確認): 不採択通知メールの要否・文面が未確定（IF-07）。
             *   u_reject_reason は「申請者への通知文」として保持しているため、
             *   確定後はこの内容をメール本文へ流用できる。
             */
            warnings: [
                '不採択の通知メールは要否・文面が未確定のため送信していません。申請者は「申請」画面で結果を確認できます。',
            ],
        }
    },

    /** 審査理由・不備内容・不採択理由の検証 */
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

        if (text.length > ApplicationReviewUtil.MAX_NOTE_LENGTH) {
            errors.push(name + 'は' + ApplicationReviewUtil.MAX_NOTE_LENGTH + '文字以内で入力してください。')
        }

        return errors
    },

    // -----------------------------------------------------------------------
    /**
     * 判定できる状態の申請を取得する。
     *
     * 担当者の確認まで行う。担当以外の事務局ユーザが判定できると、
     * 引き受けた担当者の審査と結論が食い違う。
     *
     * @return { gr } または { errors }
     */
    _loadJudgeable: function (requestId, staffId) {
        if (!requestId || !staffId) {
            return { errors: ['対象の申請と審査者を指定してください。'] }
        }

        // 対象は sys_id で確定しているため get を使用する（トンマナ 3.2.3）
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        if (!gr.get(requestId + '')) {
            return { errors: ['対象の申請が見つかりません。'] }
        }

        var status = gr.getValue('u_application_status')
        if (!this.canJudge(status)) {
            return {
                errors: [
                    '審査を開始していない、または既に判定済みの申請です（' +
                        gr.getDisplayValue('u_application_status') +
                        '）。「自分が審査を担当する」を実行してください。',
                ],
            }
        }

        var assignee = gr.getValue('u_review_assigned_to')
        if (assignee && assignee !== staffId + '') {
            return {
                errors: [
                    '別の担当者（' +
                        gr.getDisplayValue('u_review_assigned_to') +
                        '）が審査中です。担当を変更する場合は「審査担当者」を編集してください。',
                ],
            }
        }

        return { gr: gr }
    },

    _trim: function (value) {
        return value === null || value === undefined ? '' : (value + '').trim()
    },

    type: 'ApplicationReviewUtil',
}
