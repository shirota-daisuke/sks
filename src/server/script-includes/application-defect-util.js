/**
 * ApplicationDefectUtil
 *
 * 申請の不備修正（事業者側／画面イメージ ITCOM-05）。
 *   不備確認依頼（defect_request）→ 不備修正中（defect_fixing）
 *   → 不備修正回答あり（defect_answered）
 *
 * ■ ユーザ登録の不備対応（処理No.7）とは別物
 * ユーザ登録の不備対応は RegistrationDefectUtil が担当する。
 *   ユーザ登録: T02 の u_registration_status
 *   申請      : T03 の u_application_status
 * 対象も遷移するステータスも異なるため、別のクラスとして持つ。
 *
 * ■ トークンを使わない
 * ユーザ登録の不備対応は、本登録が承認されるまで applicant ロールが付与されず
 * ポータルのページを開けないため、トークン付きリンクで未認証のまま処理する。
 * 申請の不備修正では事業者は既に applicant ロールを持ってログインできるため、
 * 通常のページとして実装し、範囲は ACL で担保する
 * （自社かつ申請入力中／不備修正中のみ更新可：src/fluent/acls/portal-acls.now.ts）。
 *
 * ■ 修正できる範囲
 * 対象経費明細（ITCOM-02）と添付書類（ITCOM-03）は、いずれも
 * 不備修正中のステータスで編集を許可しているため、それぞれの画面で修正する。
 * 基本情報（組織形態・従業員数区分・売上増加率）は変更できない。
 * TODO(要確認): 修正できる範囲が未確定。基本情報の修正も認める場合は、
 *   申請の入力画面（ITCOM-01）が不備修正中の申請を読み込めるようにする必要がある
 *   （現状は getDraft が申請入力中のみを対象にしている）。
 *
 * ■ 指摘の単位
 * 不備内容は u_defect_note の自由記述1件のみで、項目単位の指摘を保持する構造が無い。
 * そのため本画面は「どの項目が指摘されたか」を機械的に判定できない。
 * TODO(要確認): 指摘の単位（申請全体への自由記述か、項目単位か）が未確定。
 *   項目単位にする場合は指摘を保持する子テーブルが必要になる。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない。
 */
var ApplicationDefectUtil = Class.create()

/** 事務局が不備確認を依頼した直後のステータス */
ApplicationDefectUtil.REQUESTED = 'defect_request'

/** 事業者が修正に着手した状態。この間だけ明細・添付を編集できる */
ApplicationDefectUtil.FIXING = 'defect_fixing'

/** 修正内容を再提出した状態。事務局の再審査へ引き継ぐ */
ApplicationDefectUtil.ANSWERED = 'defect_answered'

/** 事業者が対応中とみなすステータス（画面の対象） */
ApplicationDefectUtil.OPEN_STATUSES = ['defect_request', 'defect_fixing']

/** 回答（修正内容の説明）の最大文字数。u_defect_reply の桁数に合わせる */
ApplicationDefectUtil.MAX_REPLY_LENGTH = 2000

ApplicationDefectUtil.prototype = {
    initialize: function () {},

    /**
     * 不備対応中の申請を取得する。無ければ null を返す。
     *
     * @param entityId  自社の事業者（必須。他社の申請を開けないようにするため）
     * @param requestId 対象を絞る場合に指定（申請状況一覧からの遷移で使う）
     */
    find: function (entityId, requestId) {
        if (!entityId) {
            return null
        }

        // 自社かつ不備対応中の単一レコード取得。
        // get() では自社以外を除外する条件が適用されないためクエリ側で担保する（トンマナ 3.2.3 の例外）
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.addQuery('u_business_entity', entityId)
        gr.addQuery('u_application_status', 'IN', ApplicationDefectUtil.OPEN_STATUSES.join(','))
        if (requestId) {
            gr.addQuery('sys_id', requestId + '')
        }
        gr.orderByDesc('sys_updated_on')
        gr.setLimit(1)
        gr.query()

        if (!gr.next()) {
            return null
        }
        return gr
    },

    /** 画面表示用の文脈を組み立てる */
    buildContext: function (gr) {
        if (!gr) {
            return null
        }

        var status = gr.getValue('u_application_status')
        var dueOn = gr.getValue('u_defect_due_on')
        var daysLeft = this.getDaysLeft(dueOn)

        return {
            sys_id: gr.getUniqueValue(),
            applicationNumber: gr.getValue('u_application_number') || '',
            status: status,
            statusLabel: new x_dent2_dentsusoke.ApplicationStatusUtil().getApplicantLabel(status),
            defectNote: gr.getValue('u_defect_note') || '',
            defectReply: gr.getValue('u_defect_reply') || '',
            dueOn: gr.getDisplayValue('u_defect_due_on'),
            daysLeft: daysLeft,
            // 期限当日は超過扱いにしない（当日中の回答を認める）
            overdue: daysLeft !== null && daysLeft < 0,
            reviewer: gr.getDisplayValue('u_review_assigned_to') || '',
            requestedOn: this._findRequestedOn(gr.getUniqueValue()),
            submittedOn: gr.getDisplayValue('u_submitted_on'),
        }
    },

    /**
     * 回答期限までの残日数。期限が未設定なら null を返す。
     * 負の値は期限超過を表す。
     *
     * TODO(要確認): 期限超過時の扱いが未確定（提出を止めるか、警告のみか）。
     *   現状は警告のみとし、提出は受け付ける。
     */
    getDaysLeft: function (dueOn) {
        var text = this._trim(dueOn)
        if (!text) {
            return null
        }

        var due = new GlideDate()
        due.setValue(text)

        var today = new GlideDate()
        var diff = due.getNumericValue() - today.getNumericValue()
        if (isNaN(diff)) {
            return null
        }
        return Math.round(diff / (24 * 60 * 60 * 1000))
    },

    /**
     * 修正の開始。不備確認依頼（defect_request）→ 不備修正中（defect_fixing）。
     *
     * 明細・添付の編集を許可するステータスは不備修正中のみのため、
     * 画面を開いた時点で遷移させる。
     * 既に不備修正中の場合は何もしない（画面の再読み込みで二重に記録しないため）。
     */
    startFixing: function (entityId, requestId, userId) {
        var gr = this.find(entityId, requestId)
        if (!gr) {
            return { success: false, errors: ['対応が必要な申請が見つかりません。'] }
        }

        if (gr.getValue('u_application_status') === ApplicationDefectUtil.FIXING) {
            return { success: true, action: 'already_fixing', sys_id: gr.getUniqueValue() }
        }

        gr.setValue('u_application_status', ApplicationDefectUtil.FIXING)
        if (!gr.update()) {
            gs.error('[SKS] 申請の不備修正の開始に失敗しました。request=' + gr.getUniqueValue())
            return { success: false, errors: ['処理に失敗しました。時間をおいて再度お試しください。'] }
        }

        new x_dent2_dentsusoke.ApplicationLogUtil().record(gr.getUniqueValue(), 'defect_fixing', {
            fromStatus: ApplicationDefectUtil.REQUESTED,
            toStatus: ApplicationDefectUtil.FIXING,
            actor: userId,
        })

        return { success: true, action: 'start_fixing', sys_id: gr.getUniqueValue() }
    },

    /** 回答（修正内容の説明）の検証 */
    validateReply: function (reply, forSubmit) {
        var errors = []
        var text = this._trim(reply)

        if (!text) {
            if (forSubmit) {
                errors.push('修正内容の説明を入力してください。')
            }
            return errors
        }

        if (text.length > ApplicationDefectUtil.MAX_REPLY_LENGTH) {
            errors.push(
                '修正内容の説明は' + ApplicationDefectUtil.MAX_REPLY_LENGTH + '文字以内で入力してください。',
            )
        }

        return errors
    },

    /**
     * 回答の一時保存。ステータスは変更しない。
     * 途中まで書いて保存できないと、長い説明を一度に書き切れない申請者が離脱する。
     */
    saveReply: function (entityId, requestId, reply) {
        var gr = this.find(entityId, requestId)
        if (!gr) {
            return { success: false, errors: ['対応が必要な申請が見つかりません。'] }
        }

        var errors = this.validateReply(reply, false)
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        gr.setValue('u_defect_reply', this._trim(reply))
        if (!gr.update()) {
            gs.error('[SKS] 申請の不備修正の一時保存に失敗しました。request=' + gr.getUniqueValue())
            return { success: false, errors: ['保存に失敗しました。時間をおいて再度お試しください。'] }
        }

        return {
            success: true,
            action: 'save_reply',
            sys_id: gr.getUniqueValue(),
            message: '入力内容を保存しました。まだ再提出は完了していません。',
        }
    },

    /**
     * 再提出できるかどうかの判定。
     *
     * 対象経費と添付書類の条件は提出（ITCOM-04）と同一のものを使う
     * （ApplicationSubmitUtil.checkExpenseAndDocuments）。
     * 基本情報は不備修正では変更できないため検証しない。
     *
     * @return { ok, blockers: [{ step, message }], totalExpense }
     *         step は 'reply'（回答）／'expense'（対象経費）／'document'（添付書類）
     */
    checkReadyToAnswer: function (requestId, reply) {
        var blockers = []

        var replyErrors = this.validateReply(reply, true)
        for (var i = 0; i < replyErrors.length; i++) {
            blockers.push({ step: 'reply', message: replyErrors[i] })
        }

        if (!requestId) {
            return { ok: false, blockers: blockers, totalExpense: 0 }
        }

        // 必須区分は申請レコードの値で評価する（基本情報は変更できないため）
        var checked = new x_dent2_dentsusoke.ApplicationSubmitUtil().checkExpenseAndDocuments(requestId)
        blockers = blockers.concat(checked.blockers)

        return {
            ok: blockers.length === 0,
            blockers: blockers,
            totalExpense: checked.totalExpense,
        }
    },

    /**
     * 修正内容の再提出。不備修正中 → 不備修正回答あり へ遷移させる。
     *
     * 対象経費が変わっている可能性があるため、遷移の前に合計と補助金額を再判定する。
     * 再判定しないと、明細を直したのに補助金額が古いまま審査へ渡る。
     */
    submitFix: function (entityId, requestId, userId, reply) {
        var target = this.find(entityId, requestId)
        if (!target) {
            return { success: false, errors: ['対応が必要な申請が見つかりません。'] }
        }
        var targetId = target.getUniqueValue()

        var ready = this.checkReadyToAnswer(targetId, reply)
        if (!ready.ok) {
            var errors = []
            for (var i = 0; i < ready.blockers.length; i++) {
                errors.push(ready.blockers[i].message)
            }
            return { success: false, errors: errors }
        }

        /**
         * 合計と補助金額の再判定を先に行う。
         * recalcTotal は申請レコードを自分で更新するため、
         * 後から古い GlideRecord を update すると金額が巻き戻る。
         * そのため再判定のあとにレコードを取り直す。
         */
        var expenseUtil = new x_dent2_dentsusoke.ApplicationExpenseUtil()
        expenseUtil.recalcTotal(targetId)

        var gr = this.find(entityId, targetId)
        if (!gr) {
            gs.error('[SKS] 申請の不備修正で対象を再取得できませんでした。request=' + targetId)
            return { success: false, errors: ['処理に失敗しました。時間をおいて再度お試しください。'] }
        }

        var fromStatus = gr.getValue('u_application_status')
        gr.setValue('u_defect_reply', this._trim(reply))
        gr.setValue('u_application_status', ApplicationDefectUtil.ANSWERED)
        if (!gr.update()) {
            gs.error('[SKS] 申請の不備修正の再提出に失敗しました。request=' + targetId)
            return { success: false, errors: ['再提出に失敗しました。時間をおいて再度お試しください。'] }
        }

        gs.info(
            '[SKS] 申請の不備修正を再提出しました。request=' +
                targetId +
                ' number=' +
                gr.getValue('u_application_number') +
                ' expense=' +
                ready.totalExpense,
        )

        new x_dent2_dentsusoke.ApplicationLogUtil().record(targetId, 'defect_answered', {
            fromStatus: fromStatus,
            toStatus: ApplicationDefectUtil.ANSWERED,
            detail: '対象経費 ' + ready.totalExpense + '円で再提出',
            actor: userId,
        })

        return {
            success: true,
            action: 'submit_fix',
            sys_id: targetId,
            applicationNumber: gr.getValue('u_application_number'),
            totalExpense: ready.totalExpense,
            subsidyAmount: parseInt(gr.getValue('u_subsidy_amount'), 10) || 0,
            message: '修正内容を提出しました。事務局が再審査を行います。',
            /**
             * TODO(IF-07): 不備修正の受付メールの要否・テンプレートが未確定のため送信しない。
             *   確定後に sysevent_register ＋ sysevent_email_action を追加する。
             */
            warnings: [
                '再提出のメール通知は要否が未確定のため送信していません。状況は「申請」画面でご確認いただけます。',
            ],
        }
    },

    // -----------------------------------------------------------------------
    /**
     * 不備確認が依頼された日時。
     * 依頼日時を保持する列が T03 に無いため、処理履歴の最新の「不備修正を依頼」から引く。
     * TODO(要レビュー): 依頼日時を T03 の列として持つかは未確定。
     */
    _findRequestedOn: function (requestId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_req_log')
        gr.addQuery('u_request', requestId + '')
        gr.addQuery('u_action', 'defect_requested')
        gr.orderByDesc('u_occurred_on')
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return ''
        }
        return gr.getDisplayValue('u_occurred_on')
    },

    _trim: function (value) {
        return value === null || value === undefined ? '' : (value + '').trim()
    },

    type: 'ApplicationDefectUtil',
}
