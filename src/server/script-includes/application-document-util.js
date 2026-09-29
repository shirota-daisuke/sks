/**
 * ApplicationDocumentUtil
 *
 * 申請の添付書類（画面イメージ ITCOM-03）。
 * 提出書類の行（x_dent2_dentsusoke_req_doc）の整備、実ファイル（sys_attachment）との
 * 突き合わせ、必須書類の充足チェックを担当する。
 *
 * ■ なぜ書類種別の行を持つのか
 * sys_attachment には「どの提出書類としてアップロードされたか」を表す項目が無い。
 * 申請レコードへ直接添付すると種別が判別できず、必須書類の充足チェックができない。
 * そのため「申請 × 書類種別」で1行を持ち、実ファイルはその行へ添付する
 * （sys_attachment.table_name = x_dent2_dentsusoke_req_doc）。
 *
 * ■ 充足チェックは実ファイルで判定する
 * u_submitted は一覧表示用のフラグであり、判定には使わない。
 * 画面以外の経路（レコードの添付欄・REST API）でファイルが削除された場合に
 * フラグと実体が食い違うため、必ず sys_attachment の実在で判定する。
 *
 * ■ アップロードの経路と検証のタイミング
 * ファイルのアップロード自体は画面から添付 REST API（/api/now/attachment/file）へ
 * 直接送る。サーバースクリプトを経由しないのは、Service Portal のウィジェットの
 * データ往復に載せられるサイズではないためである。
 * したがってファイル形式・サイズの検証はアップロード後に本クラスで行い、
 * 不適合のファイルは削除して行を未提出に戻す（画面側の検証は入力補助にすぎない）。
 *
 * ■ 差し替え
 * 1つの書類種別が保持するファイルは最新の1件のみとする。
 * 同じ行へ2件目がアップロードされた場合、古いファイルは syncRow で削除する。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない。
 */
var ApplicationDocumentUtil = Class.create()

/** 添付を編集できる申請ステータス */
ApplicationDocumentUtil.EDITABLE_STATUSES = ['input', 'defect_fixing']

/** 提出書類の行を持つテーブル */
ApplicationDocumentUtil.TABLE = 'x_dent2_dentsusoke_req_doc'

/**
 * 提出書類の定義。x_dent2_dentsusoke_req_doc.u_document_type の選択肢と1対1で対応させる。
 *
 * required は必須となる条件。
 *   always          … 常に必須
 *   corporate       … 組織形態が法人の場合のみ必須（履歴事項全部証明書は法人のみ）
 *   special_measure … 特例措置の対象である場合のみ必須
 *   never           … 任意
 *
 * TODO(要確認): 提出書類の種類と必須区分は公募要領の提出書類一覧と突合が必要（暫定値）。
 *   ラベルは選択肢の定義（src/fluent/tables/request-document.now.ts）を参照するため
 *   ここには持たない（二重管理を避ける）。
 */
ApplicationDocumentUtil.DOCUMENT_TYPES = [
    { code: 'financial', required: 'always', order: 100 },
    { code: 'registry', required: 'corporate', order: 200 },
    { code: 'quotation', required: 'always', order: 300 },
    { code: 'sales', required: 'always', order: 400 },
    { code: 'special', required: 'special_measure', order: 500 },
    { code: 'other', required: 'never', order: 600 },
]

/** ファイルサイズ上限の既定値（MB）。プロパティで変更できる */
ApplicationDocumentUtil.DEFAULT_MAX_FILE_SIZE_MB = 10

/** 許可する拡張子の既定値。プロパティで変更できる */
ApplicationDocumentUtil.DEFAULT_ALLOWED_EXTENSIONS = 'pdf,jpg,jpeg,png,xls,xlsx,doc,docx,zip'

ApplicationDocumentUtil.prototype = {
    initialize: function () {},

    /** 添付を編集できる申請ステータスか */
    canEdit: function (status) {
        return ApplicationDocumentUtil.EDITABLE_STATUSES.indexOf((status || '') + '') >= 0
    },

    /** ファイルサイズ上限（バイト）。運用で変更できるようプロパティから取得する（トンマナ 3.4.4） */
    getMaxFileSize: function () {
        var mb = parseInt(
            gs.getProperty(
                'x_dent2_dentsusoke.document.max_file_size_mb',
                ApplicationDocumentUtil.DEFAULT_MAX_FILE_SIZE_MB,
            ),
            10,
        )
        if (isNaN(mb) || mb <= 0) {
            mb = ApplicationDocumentUtil.DEFAULT_MAX_FILE_SIZE_MB
        }
        return mb * 1024 * 1024
    },

    /** 許可する拡張子（小文字の配列） */
    getAllowedExtensions: function () {
        var raw = gs.getProperty(
            'x_dent2_dentsusoke.document.allowed_extensions',
            ApplicationDocumentUtil.DEFAULT_ALLOWED_EXTENSIONS,
        )
        var list = (raw + '').toLowerCase().split(',')
        var result = []
        for (var i = 0; i < list.length; i++) {
            var ext = list[i].trim()
            if (ext) {
                result.push(ext)
            }
        }
        if (result.length === 0) {
            result = ApplicationDocumentUtil.DEFAULT_ALLOWED_EXTENSIONS.split(',')
        }
        return result
    },

    /**
     * 提出書類の定義（画面の説明表示用）。ラベルは選択肢の定義から取得する。
     */
    getDocumentTypes: function () {
        var rows = []
        var types = ApplicationDocumentUtil.DOCUMENT_TYPES
        for (var i = 0; i < types.length; i++) {
            rows.push({
                code: types[i].code,
                label: this._getTypeLabel(types[i].code),
                requiredCondition: types[i].required,
                order: types[i].order,
            })
        }
        return rows
    },

    /**
     * 申請に対する提出書類の行を整える（不足分を作成する）。
     *
     * 申請の内容（組織形態・特例措置の有無）によって必須区分が変わるため、
     * 編集できるステータスのうちは必須区分を再評価して更新する。
     * 提出後は評価し直さない（審査時点の前提を固定するため）。
     *
     * @param requestId 対象の申請
     * @param override  必須区分の判定に使う値を明示したい場合に渡す
     *                  { organizationType, specialMeasure }。
     *                  提出時はまだレコードへ書き込む前の入力値で判定する必要があるため使用する
     *                  （申請の入力画面で法人へ変えた直後に必須書類が増えないと、
     *                  必須チェックが古い前提で通ってしまう）。
     * @return 作成・更新した行数
     */
    ensureRows: function (requestId, override) {
        if (!requestId) {
            return 0
        }

        // 申請は sys_id で確定しているため get を使用する（トンマナ 3.2.3）
        var req = new GlideRecord('x_dent2_dentsusoke_request')
        if (!req.get(requestId + '')) {
            gs.error('[SKS] 提出書類の整備で申請が見つかりません。request=' + requestId)
            return 0
        }

        var editable = this.canEdit(req.getValue('u_application_status'))
        var organizationType = req.getValue('u_organization_type')
        var specialMeasure = req.getValue('u_special_measure_flag') === '1'

        if (override) {
            if (override.organizationType !== undefined && override.organizationType !== null) {
                organizationType = override.organizationType + ''
            }
            if (override.specialMeasure !== undefined && override.specialMeasure !== null) {
                specialMeasure = override.specialMeasure === true || override.specialMeasure === 'true'
            }
        }

        var existing = {}
        var gr = new GlideRecord(ApplicationDocumentUtil.TABLE)
        gr.addQuery('u_request', requestId + '')
        gr.setLimit(ApplicationDocumentUtil.DOCUMENT_TYPES.length * 2)
        gr.query()
        while (gr.next()) {
            existing[gr.getValue('u_document_type')] = gr.getUniqueValue()
        }

        var changed = 0
        var types = ApplicationDocumentUtil.DOCUMENT_TYPES
        for (var i = 0; i < types.length; i++) {
            var required = this._isRequired(types[i].required, organizationType, specialMeasure)

            if (!existing[types[i].code]) {
                var insertGr = new GlideRecord(ApplicationDocumentUtil.TABLE)
                insertGr.initialize()
                insertGr.setValue('u_request', requestId + '')
                insertGr.setValue('u_document_type', types[i].code)
                insertGr.setValue('u_required', required)
                insertGr.setValue('u_submitted', false)
                insertGr.setValue('u_order', types[i].order)
                if (insertGr.insert()) {
                    changed++
                } else {
                    gs.error(
                        '[SKS] 提出書類の行の作成に失敗しました。request=' +
                            requestId +
                            ' type=' +
                            types[i].code,
                    )
                }
                continue
            }

            if (!editable) {
                continue
            }

            // 既存行の必須区分を申請の内容に合わせ直す
            var updateGr = new GlideRecord(ApplicationDocumentUtil.TABLE)
            if (!updateGr.get(existing[types[i].code])) {
                continue
            }
            if ((updateGr.getValue('u_required') === '1') === required) {
                continue
            }
            updateGr.setValue('u_required', required)
            if (updateGr.update()) {
                changed++
            }
        }

        return changed
    },

    /**
     * 提出書類の一覧。実ファイル（sys_attachment）の情報を併せて返す。
     */
    list: function (requestId) {
        var rows = []
        if (!requestId) {
            return rows
        }

        var gr = new GlideRecord(ApplicationDocumentUtil.TABLE)
        gr.addQuery('u_request', requestId + '')
        gr.orderBy('u_order')
        gr.setLimit(ApplicationDocumentUtil.DOCUMENT_TYPES.length * 2)
        gr.query()

        while (gr.next()) {
            var docId = gr.getUniqueValue()
            var attachment = this._findLatestAttachment(docId)

            rows.push({
                sys_id: docId,
                documentType: gr.getValue('u_document_type'),
                documentTypeLabel: gr.getDisplayValue('u_document_type'),
                required: gr.getValue('u_required') === '1',
                // 表示は実ファイルの有無で決める（フラグと食い違っても実体を正とする）
                submitted: !!attachment,
                fileName: attachment ? attachment.fileName : '',
                sizeLabel: attachment ? this._formatSize(attachment.sizeBytes) : '',
                attachmentId: attachment ? attachment.sys_id : '',
                downloadUrl: attachment ? '/sys_attachment.do?sys_id=' + attachment.sys_id : '',
                submittedOn: gr.getDisplayValue('u_submitted_on'),
                order: parseInt(gr.getValue('u_order'), 10) || 100,
            })
        }

        return rows
    },

    /** 指定の提出書類に実ファイルが存在するか */
    hasFile: function (docId) {
        return !!this._findLatestAttachment(docId)
    },

    /**
     * アップロード後の後処理。
     *
     * ファイルは添付 REST API から直接登録されるため、本メソッドが唯一の検証点になる。
     *   ・拡張子とサイズを検証し、不適合なら削除して未提出へ戻す
     *   ・古いファイルを削除して最新の1件のみを残す（差し替え）
     *   ・行のファイル名・提出日時・提出済フラグを実体に合わせる
     *
     * @param requestId 対象の申請（他の申請の行を操作されないよう突き合わせる）
     * @param docId     提出書類の行
     */
    syncRow: function (requestId, docId) {
        if (!requestId || !docId) {
            return { success: false, errors: ['対象の提出書類が指定されていません。'] }
        }

        // 自分の申請に属する行のみ操作できるよう、申請との紐付きをクエリ側で担保する
        // （get() では u_request の条件が適用されない：トンマナ 3.2.3 の例外）
        var gr = new GlideRecord(ApplicationDocumentUtil.TABLE)
        gr.addQuery('u_request', requestId + '')
        gr.addQuery('sys_id', docId + '')
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return { success: false, errors: ['対象の提出書類が見つかりません。'] }
        }

        var attachments = this._findAttachments(docId)
        if (attachments.length === 0) {
            this._resetRow(gr)
            return { success: false, errors: ['ファイルが登録されていません。もう一度お試しください。'] }
        }

        // 先頭が最新。それ以外は差し替え前のファイルなので削除する
        var latest = attachments[0]
        var sysAttachment = new GlideSysAttachment()
        for (var i = 1; i < attachments.length; i++) {
            sysAttachment.deleteAttachment(attachments[i].sys_id)
        }

        var errors = this.validateFile(latest.fileName, latest.sizeBytes)
        if (errors.length > 0) {
            // 不適合のファイルは残さない（審査へ回ると差し戻しの手間になる）
            sysAttachment.deleteAttachment(latest.sys_id)
            this._resetRow(gr)
            gs.info(
                '[SKS] 不適合の添付ファイルを削除しました。doc=' +
                    docId +
                    ' file=' +
                    latest.fileName +
                    ' size=' +
                    latest.sizeBytes,
            )
            return { success: false, errors: errors }
        }

        gr.setValue('u_submitted', true)
        gr.setValue('u_file_name', latest.fileName)
        gr.setValue('u_submitted_on', new GlideDateTime().getValue())
        if (!gr.update()) {
            gs.error('[SKS] 提出書類の行の更新に失敗しました。doc=' + docId)
            return { success: false, errors: ['提出状況の保存に失敗しました。時間をおいて再度お試しください。'] }
        }

        return {
            success: true,
            action: 'upload_document',
            sys_id: docId,
            fileName: latest.fileName,
            message: gr.getDisplayValue('u_document_type') + 'を登録しました。',
        }
    },

    /** ファイル名・サイズの検証 */
    validateFile: function (fileName, sizeBytes) {
        var errors = []
        var name = this._trim(fileName)

        if (!name) {
            errors.push('ファイル名を取得できませんでした。')
            return errors
        }

        var dot = name.lastIndexOf('.')
        var ext = dot < 0 ? '' : name.substring(dot + 1).toLowerCase()
        var allowed = this.getAllowedExtensions()
        if (!ext || allowed.indexOf(ext) < 0) {
            errors.push('この形式のファイルは登録できません（' + allowed.join('／') + ' のみ）。')
        }

        var size = parseInt(sizeBytes, 10)
        var max = this.getMaxFileSize()
        if (isNaN(size) || size <= 0) {
            errors.push('ファイルの内容を確認できませんでした。')
        } else if (size > max) {
            errors.push(
                'ファイルサイズが上限（' + this._formatSize(max) + '）を超えています。',
            )
        }

        return errors
    },

    /** 添付の削除。行は未提出へ戻す */
    remove: function (requestId, docId) {
        if (!requestId || !docId) {
            return { success: false, errors: ['対象の提出書類が指定されていません。'] }
        }

        var gr = new GlideRecord(ApplicationDocumentUtil.TABLE)
        gr.addQuery('u_request', requestId + '')
        gr.addQuery('sys_id', docId + '')
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return { success: false, errors: ['対象の提出書類が見つかりません。'] }
        }

        var attachments = this._findAttachments(docId)
        var sysAttachment = new GlideSysAttachment()
        for (var i = 0; i < attachments.length; i++) {
            sysAttachment.deleteAttachment(attachments[i].sys_id)
        }

        this._resetRow(gr)

        return {
            success: true,
            action: 'remove_document',
            sys_id: docId,
            message: gr.getDisplayValue('u_document_type') + 'を削除しました。',
        }
    },

    /**
     * 必須書類の充足チェック。
     * 提出フラグではなく実ファイルの有無で判定する（フラグは表示用）。
     *
     * @return { ok, missing: [書類種別のラベル] }
     */
    checkComplete: function (requestId) {
        var missing = []
        if (!requestId) {
            return { ok: false, missing: missing }
        }

        var gr = new GlideRecord(ApplicationDocumentUtil.TABLE)
        gr.addQuery('u_request', requestId + '')
        gr.addQuery('u_required', true)
        gr.orderBy('u_order')
        gr.setLimit(ApplicationDocumentUtil.DOCUMENT_TYPES.length * 2)
        gr.query()

        while (gr.next()) {
            if (!this.hasFile(gr.getUniqueValue())) {
                missing.push(gr.getDisplayValue('u_document_type'))
            }
        }

        return { ok: missing.length === 0, missing: missing }
    },

    /** 添付済みの必須書類の件数と必須の総数（画面の進捗表示用） */
    countSubmitted: function (requestId) {
        var rows = this.list(requestId)
        var result = { total: rows.length, submitted: 0, required: 0, requiredSubmitted: 0 }
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].submitted) {
                result.submitted++
            }
            if (rows[i].required) {
                result.required++
                if (rows[i].submitted) {
                    result.requiredSubmitted++
                }
            }
        }
        return result
    },

    // -----------------------------------------------------------------------
    /** 必須区分の判定 */
    _isRequired: function (condition, organizationType, specialMeasure) {
        if (condition === 'always') {
            return true
        }
        if (condition === 'corporate') {
            return organizationType === 'corporate'
        }
        if (condition === 'special_measure') {
            return specialMeasure === true
        }
        return false
    },

    /** 提出書類の行を未提出へ戻す */
    _resetRow: function (gr) {
        gr.setValue('u_submitted', false)
        gr.setValue('u_file_name', '')
        gr.setValue('u_submitted_on', '')
        if (!gr.update()) {
            gs.error('[SKS] 提出書類の行のリセットに失敗しました。doc=' + gr.getUniqueValue())
        }
    },

    /** 提出書類の行に添付されたファイル（新しい順） */
    _findAttachments: function (docId) {
        var rows = []
        if (!docId) {
            return rows
        }

        var gr = new GlideRecord('sys_attachment')
        gr.addQuery('table_name', ApplicationDocumentUtil.TABLE)
        gr.addQuery('table_sys_id', docId + '')
        gr.orderByDesc('sys_created_on')
        // 差し替えで残った古いファイルを拾うため1件では足りない。
        // 1行が保持するのは最新1件のみのため、上限は小さくてよい（トンマナ 3.3.2）
        gr.setLimit(10)
        gr.query()

        while (gr.next()) {
            rows.push({
                sys_id: gr.getUniqueValue(),
                fileName: gr.getValue('file_name'),
                contentType: gr.getValue('content_type'),
                sizeBytes: parseInt(gr.getValue('size_bytes'), 10) || 0,
            })
        }

        return rows
    },

    /** 最新の添付ファイル1件。無ければ null */
    _findLatestAttachment: function (docId) {
        var rows = this._findAttachments(docId)
        return rows.length > 0 ? rows[0] : null
    },

    /** 選択肢のラベル（選択肢の定義を唯一の出典とするため一時レコードから引く） */
    _getTypeLabel: function (code) {
        var gr = new GlideRecord(ApplicationDocumentUtil.TABLE)
        gr.initialize()
        gr.setValue('u_document_type', code)
        return gr.getDisplayValue('u_document_type') || code
    },

    _formatSize: function (bytes) {
        var size = parseInt(bytes, 10) || 0
        if (size >= 1024 * 1024) {
            return Math.round((size / (1024 * 1024)) * 10) / 10 + ' MB'
        }
        if (size >= 1024) {
            return Math.round(size / 1024) + ' KB'
        }
        return size + ' B'
    },

    _trim: function (value) {
        return value === null || value === undefined ? '' : (value + '').trim()
    },

    type: 'ApplicationDocumentUtil',
}
