/**
 * InquiryAdminUtil
 *
 * SC-14 問合せ管理・返信画面（事務局）のサーバー側処理をまとめたユーティリティ。
 *   ・問合せ返信処理（処理No.47）
 *   ・対応者の割当（T12 u_assigned_staff の設定）
 *
 * 事業者側の起票・履歴表示は SC-10 のウィジェット（問合せ作成処理：処理No.46）が担当しており、
 * 本ユーティリティは事務局側の対応・返信操作のみを担当する。
 * 状態遷移の妥当性判定を画面側へ散らさないため Script Include に集約し、
 * ビジネスルール（保存時）と UI Action（返信時）の双方から同じ検証を呼ぶ。
 *
 * UI Action・ビジネスルールのスクリプト内の GlideRecord は ACL 非適用のため、
 * 本ユーティリティ側でロールを明示的に検証する（トンマナ 2.1.2 ロールベースアクセス制御）。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない。
 */
var InquiryAdminUtil = Class.create()

/** 問合せに対応できるロール（権限設計書 5章：SC-14 は staff ○／staff_admin ○） */
InquiryAdminUtil.STAFF_ROLE = 'x_dent2_dentsusoke.staff'

/** 状態（T12 u_state の選択リスト値） */
InquiryAdminUtil.OPEN = 'open'
InquiryAdminUtil.ANSWERED = 'answered'

/** 回答本文の桁数上限（テーブル定義書 T12 u_reply_body の桁数に合わせる） */
InquiryAdminUtil.REPLY_BODY_MAX_LENGTH = 2000

/**
 * 状態 → Bootstrap3 ラベルクラス。
 * SC-10 のウィジェット（未回答＝warning／回答済＝success）と同じ区分を用いる。
 */
InquiryAdminUtil.STATE_LABEL_CLASSES = {
    open: 'label-warning',
    answered: 'label-success',
}

InquiryAdminUtil.prototype = {
    initialize: function () {},

    /** 問合せに対応できるユーザか（admin も true を返す） */
    canManage: function () {
        return gs.hasRole(InquiryAdminUtil.STAFF_ROLE)
    },

    /** 状態に対応する Bootstrap3 ラベルクラス */
    getStateLabelClass: function (state) {
        return InquiryAdminUtil.STATE_LABEL_CLASSES[(state || '') + ''] || 'label-default'
    },

    /**
     * 回答本文の検証。
     * 「状態＝回答済かつ回答本文が空」の問合せを作らないための判定であり、
     * UI Action（返信実行時）とビジネスルール（保存時）の双方から呼ぶ。
     */
    validateReply: function (replyBody) {
        var body = this._trim(replyBody)
        if (!body) {
            return { valid: false, errors: ['回答本文を入力してください。'] }
        }
        if (body.length > InquiryAdminUtil.REPLY_BODY_MAX_LENGTH) {
            return {
                valid: false,
                errors: ['回答本文は' + InquiryAdminUtil.REPLY_BODY_MAX_LENGTH + '文字以内で入力してください。'],
            }
        }
        return { valid: true, errors: [] }
    },

    /**
     * 問合せ返信処理（処理No.47）
     *
     * 回答本文を保存し、状態を「回答済」へ、回答日時を現在時刻へ確定する。
     * テーブル定義書 T12 は「1問合せ＝1回答」の単一回答モデルのため、
     * 回答済の問合せへは重ねて返信できない（修正は「未回答に戻す」を経由する）。
     *
     * @param inquiryId 対象の問合せ
     * @param replyBody 回答本文（レコードフォームの未保存値を呼び出し元から渡す）
     * @param assignedStaff 対応者（レコードフォームの未保存値。未指定なら保存済みの値、それも無ければ実行者）
     */
    reply: function (inquiryId, replyBody, assignedStaff) {
        var loaded = this._loadOpen(inquiryId)
        if (!loaded.ok) {
            return loaded.result
        }

        var validation = this.validateReply(replyBody)
        if (!validation.valid) {
            return { success: false, errors: validation.errors }
        }

        var gr = loaded.record
        gr.setValue('u_reply_body', this._trim(replyBody))
        gr.setValue('u_state', InquiryAdminUtil.ANSWERED)
        gr.setValue('u_replied_on', new GlideDateTime().getValue())

        // 対応者は「フォームの入力値 → 保存済みの値 → 返信した事務局ユーザ」の順に決定する。
        // 誰が回答したかを必ず追跡できるようにするため、未設定のままにはしない。
        var staff = this._trim(assignedStaff) || this._trim(gr.getValue('u_assigned_staff')) || gs.getUserID()
        gr.setValue('u_assigned_staff', staff)

        if (!gr.update()) {
            gs.error('[SKS] 問合せの返信に失敗しました。inquiry=' + inquiryId)
            return { success: false, errors: ['返信に失敗しました。時間をおいて再度お試しください。'] }
        }

        gs.info('[SKS] 問合せに回答しました。inquiry=' + inquiryId + ' staff=' + staff)

        return {
            success: true,
            action: 'reply',
            message: '問合せに回答しました（回答済）。',
            // TODO(SC-14 確認事項／IF-07): 問合せ受付時・返信時のメール通知の要否・テンプレート・
            //   送信元アドレスが未確定のため送信しない（SC-10 の問合せ作成処理と同じ扱い）。
            //   確定後に sysevent_register ＋ sysevent_email_action を追加し、本警告を削除する。
            warnings: [
                '回答内容のメール通知は要否が未確定のため送信していません。事業者はポータルの問合せ画面で回答を確認します（IF-07）。',
            ],
        }
    },

    /** 対応者に自分を設定する（T12 u_assigned_staff。担当の重複対応を避けるための取得操作） */
    assignToMe: function (inquiryId) {
        var loaded = this._load(inquiryId)
        if (!loaded.ok) {
            return loaded.result
        }

        var gr = loaded.record
        var me = gs.getUserID()
        if (this._trim(gr.getValue('u_assigned_staff')) === me + '') {
            return { success: false, errors: ['既にご自身が対応者に設定されています。'] }
        }

        var previous = gr.getDisplayValue('u_assigned_staff')
        gr.setValue('u_assigned_staff', me)
        if (!gr.update()) {
            gs.error('[SKS] 問合せの対応者設定に失敗しました。inquiry=' + inquiryId)
            return { success: false, errors: ['対応者の設定に失敗しました。時間をおいて再度お試しください。'] }
        }

        gs.info('[SKS] 問合せの対応者を変更しました。inquiry=' + inquiryId + ' from=' + previous + ' to=' + me)
        return {
            success: true,
            action: 'assign',
            message: previous
                ? '対応者をご自身に変更しました（変更前：' + previous + '）。'
                : '対応者にご自身を設定しました。',
        }
    },

    /**
     * 未回答に戻す（回答内容の訂正のため状態を差し戻す）。
     *
     * 回答日時は次の返信で再設定されるためクリアし、回答本文は訂正の下書きとして残す。
     *
     * TODO(SC-10 ⑥／SC-14 確認事項): 問合せへの追記（やり取りの継続）の可否が未確定であり、
     *   単一回答モデルでは回答の訂正手段が他にないため本操作を用意している。
     *   複数往復を認める方針が確定した場合は、差し戻しではなく追記として実装し直す。
     */
    reopen: function (inquiryId) {
        var loaded = this._load(inquiryId)
        if (!loaded.ok) {
            return loaded.result
        }

        var gr = loaded.record
        if (gr.getValue('u_state') !== InquiryAdminUtil.ANSWERED) {
            return { success: false, errors: ['この問合せは回答済ではありません。'] }
        }

        gr.setValue('u_state', InquiryAdminUtil.OPEN)
        gr.setValue('u_replied_on', '')
        if (!gr.update()) {
            gs.error('[SKS] 問合せの差し戻しに失敗しました。inquiry=' + inquiryId)
            return { success: false, errors: ['未回答への変更に失敗しました。時間をおいて再度お試しください。'] }
        }

        gs.info('[SKS] 問合せを未回答に戻しました。inquiry=' + inquiryId)
        return {
            success: true,
            action: 'reopen',
            message: '問合せを未回答に戻しました。回答本文を修正して再度「返信する」を実行してください。',
        }
    },

    /** 実行権限・対象の存在をまとめて検証し、対象レコードを返す */
    _load: function (inquiryId) {
        if (!this.canManage()) {
            return { ok: false, result: { success: false, errors: ['この操作には事務局ユーザの権限が必要です。'] } }
        }
        if (!inquiryId) {
            return { ok: false, result: { success: false, errors: ['対象の問合せが指定されていません。'] } }
        }

        // 事務局ユーザは全問合せを参照できるため追加条件を持たない
        // 単一レコード取得であり、get() を使用する（トンマナ 3.2.3）。
        var gr = new GlideRecord('x_dent2_dentsusoke_inquiry')
        if (!gr.get(inquiryId + '')) {
            return { ok: false, result: { success: false, errors: ['対象の問合せが見つかりません。'] } }
        }
        return { ok: true, record: gr }
    },

    /** 返信できる状態（未回答）であることを併せて検証する */
    _loadOpen: function (inquiryId) {
        var loaded = this._load(inquiryId)
        if (!loaded.ok) {
            return loaded
        }

        if (loaded.record.getValue('u_state') !== InquiryAdminUtil.OPEN) {
            return {
                ok: false,
                result: {
                    success: false,
                    errors: [
                        '状態が「' +
                            loaded.record.getDisplayValue('u_state') +
                            '」のため返信できません。回答を修正する場合は「未回答に戻す」を実行してください。',
                    ],
                },
            }
        }

        return loaded
    },

    _trim: function (value) {
        return value === null || value === undefined ? '' : (value + '').trim()
    },

    type: 'InquiryAdminUtil',
}
