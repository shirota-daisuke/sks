/**
 * NoticeAdminUtil
 *
 * SC-13 お知らせ作成・編集画面（事務局）のサーバー側処理をまとめたユーティリティ。
 *   ・お知らせ登録・更新時の入力検証（公開範囲設定処理：処理No.40／公開期間設定処理：処理No.41）
 *   ・公開／非公開の切替（公開状態の確定）
 *
 * 事業者向けの公開範囲判定・既読管理は NoticeUtil（処理No.40／41／43）が担当しており、
 * 本ユーティリティは事務局側の登録・更新・公開操作のみを担当する。
 * 同じ検証をビジネスルール（保存時）と UI Action（公開時）の双方から呼ぶため Script Include に集約する。
 *
 * ワークスペースのレコードフォームからの保存は ACL を経由するが、
 * UI Action・ビジネスルールのスクリプト内の GlideRecord は ACL 非適用のため、
 * 本ユーティリティ側でロールを明示的に検証する（トンマナ 2.1.2 ロールベースアクセス制御）。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない。
 */
var NoticeAdminUtil = Class.create()

/** お知らせを作成・編集できるロール（権限設計書 G4：作成・編集は staff、削除は staff_admin） */
NoticeAdminUtil.STAFF_ROLE = 'x_dent2_dentsusoke.staff'

/** 公開状態（T10 u_publish_status の選択リスト値） */
NoticeAdminUtil.PUBLISHED = 'published'
NoticeAdminUtil.PRIVATE = 'private'

/** 桁数上限（テーブル定義書 T10 の定義に合わせる。テーブル定義を変更した場合は本定数も合わせる） */
NoticeAdminUtil.TITLE_MAX_LENGTH = 100
NoticeAdminUtil.BODY_MAX_LENGTH = 4000

NoticeAdminUtil.prototype = {
    initialize: function () {},

    /** お知らせを作成・編集できるユーザか（admin も true を返す） */
    canManage: function () {
        return gs.hasRole(NoticeAdminUtil.STAFF_ROLE)
    },

    /**
     * お知らせ1件の入力検証。
     *
     * タイトル・本文・公開開始日・公開終了日・公開範囲・重要度はいずれも T10 で必須項目として
     * 定義済みであり、未入力はプラットフォームが弾く。本メソッドが担うのは
     *   ・宣言的に表現できない公開期間の前後関係（公開終了日 ＜ 公開開始日 を許さない）
     *   ・リッチテキストで空段落のみが入力された本文の未入力判定
     *   ・フォーム以外の経路（REST 等）からの登録に対する同等の検証
     * であり、必須・桁数の判定も日本語のエラーメッセージを返すためここで併せて行う。
     *
     * @param gr お知らせテーブルの GlideRecord（保存前の current でも可）
     * @return { valid: boolean, errors: string[] }
     */
    validate: function (gr) {
        if (!gr) {
            return { valid: false, errors: ['対象のお知らせが指定されていません。'] }
        }

        var errors = []

        var title = this._trim(gr.getValue('u_title'))
        if (!title) {
            errors.push('タイトルを入力してください。')
        } else if (title.length > NoticeAdminUtil.TITLE_MAX_LENGTH) {
            errors.push('タイトルは' + NoticeAdminUtil.TITLE_MAX_LENGTH + '文字以内で入力してください。')
        }

        var body = this._trim(gr.getValue('u_body'))
        if (!this._stripHtml(body)) {
            errors.push('本文を入力してください。')
        } else if (body.length > NoticeAdminUtil.BODY_MAX_LENGTH) {
            // 桁数は T10 の定義（HTML タグを含む格納値の長さ）で判定する
            errors.push('本文は' + NoticeAdminUtil.BODY_MAX_LENGTH + '文字以内で入力してください。')
        }

        // 公開期間設定処理（処理No.41）。日付項目の格納形式は yyyy-mm-dd で桁数が固定のため、
        // 文字列比較で前後関係を判定できる（GlideDate の生成を避ける）。
        var startDate = this._trim(gr.getValue('u_publish_start_date'))
        var endDate = this._trim(gr.getValue('u_publish_end_date'))
        if (!startDate) {
            errors.push('公開開始日を入力してください。')
        }
        if (!endDate) {
            errors.push('公開終了日を入力してください。')
        }
        if (startDate && endDate && startDate > endDate) {
            errors.push('公開終了日は公開開始日以降の日付を入力してください。')
        }

        // 公開範囲設定処理（処理No.40）。既定値を持つ必須の選択リストだが、
        // フォーム以外の経路で空・不正値が入る場合に備えて検証する。
        if (!this._trim(gr.getValue('u_visibility_scope'))) {
            errors.push('公開範囲を選択してください。')
        }
        if (!this._trim(gr.getValue('u_priority'))) {
            errors.push('重要度を選択してください。')
        }

        return { valid: errors.length === 0, errors: errors }
    },

    /**
     * 公開する（公開状態を「公開」へ確定する）。
     *
     * 実際に事業者へ表示されるかは公開期間・公開範囲との突合結果によるため
     * （NoticeUtil.applyVisibilityQuery）、公開状態の確定と表示開始は一致しない。
     */
    publish: function (noticeId) {
        var loaded = this._load(noticeId)
        if (!loaded.ok) {
            return loaded.result
        }

        var gr = loaded.record
        if (gr.getValue('u_publish_status') === NoticeAdminUtil.PUBLISHED) {
            return { success: false, errors: ['このお知らせは既に公開されています。'] }
        }

        var validation = this.validate(gr)
        if (!validation.valid) {
            return { success: false, errors: validation.errors }
        }

        gr.setValue('u_publish_status', NoticeAdminUtil.PUBLISHED)
        if (!gr.update()) {
            gs.error('[SKS] お知らせの公開に失敗しました。notice=' + noticeId)
            return { success: false, errors: ['公開に失敗しました。時間をおいて再度お試しください。'] }
        }

        var notifyRequested = gr.getValue('u_email_notify_flag') === '1'
        gs.info(
            '[SKS] お知らせを公開しました。notice=' +
                noticeId +
                ' scope=' +
                gr.getValue('u_visibility_scope') +
                ' period=' +
                gr.getValue('u_publish_start_date') +
                '〜' +
                gr.getValue('u_publish_end_date') +
                ' notify=' +
                notifyRequested,
        )

        return {
            success: true,
            action: 'publish',
            message: 'お知らせを公開しました。',
            // TODO(Q13/A21/IF-07): お知らせ公開時のメール通知の通知対象・テンプレート・
            //   送信元アドレスが未確定のため送信しない（T10 u_email_notify_flag の TODO と同一）。
            //   確定後に sysevent_register ＋ sysevent_email_action を追加し、本警告を削除する。
            warnings: notifyRequested
                ? ['メール通知有無が「あり」ですが、通知テンプレートが未確定のためメールは送信していません（IF-07）。']
                : [],
        }
    },

    /**
     * 非公開にする（公開状態を「非公開」へ戻す）。
     * お知らせは物理削除しない方針（権限設計書 G4 の Delete 方針）のため、掲載の取り下げは本操作で行う。
     */
    unpublish: function (noticeId) {
        var loaded = this._load(noticeId)
        if (!loaded.ok) {
            return loaded.result
        }

        var gr = loaded.record
        if (gr.getValue('u_publish_status') !== NoticeAdminUtil.PUBLISHED) {
            return { success: false, errors: ['このお知らせは公開されていません。'] }
        }

        gr.setValue('u_publish_status', NoticeAdminUtil.PRIVATE)
        if (!gr.update()) {
            gs.error('[SKS] お知らせの非公開化に失敗しました。notice=' + noticeId)
            return { success: false, errors: ['非公開への変更に失敗しました。時間をおいて再度お試しください。'] }
        }

        gs.info('[SKS] お知らせを非公開にしました。notice=' + noticeId)
        return { success: true, action: 'unpublish', message: 'お知らせを非公開にしました。' }
    },

    /** 実行権限・対象の存在をまとめて検証し、対象レコードを返す */
    _load: function (noticeId) {
        if (!this.canManage()) {
            return { ok: false, result: { success: false, errors: ['この操作には事務局ユーザの権限が必要です。'] } }
        }
        if (!noticeId) {
            return { ok: false, result: { success: false, errors: ['対象のお知らせが指定されていません。'] } }
        }

        // 事務局ユーザは全お知らせ（非公開含む）を参照できるため追加条件を持たない
        // 単一レコード取得であり、get() を使用する（トンマナ 3.2.3）。
        var gr = new GlideRecord('x_dent2_dentsusoke_notice')
        if (!gr.get(noticeId + '')) {
            return { ok: false, result: { success: false, errors: ['対象のお知らせが見つかりません。'] } }
        }
        return { ok: true, record: gr }
    },

    _trim: function (value) {
        return value === null || value === undefined ? '' : (value + '').trim()
    },

    /** HTML タグを除いた本文（リッチテキストで空段落のみが入力された場合を未入力として扱う） */
    _stripHtml: function (value) {
        return this._trim(
            (value === null || value === undefined ? '' : value + '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' '),
        )
    },

    type: 'NoticeAdminUtil',
}
