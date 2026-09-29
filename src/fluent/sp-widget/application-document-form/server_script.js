/**
 * 添付書類の提出（ITCOM-03）— サーバースクリプト
 *
 * ③アクション定義
 *   No.1「ファイルを選択」→ 画面から添付 REST API へ直接アップロードし、
 *                            完了後に sync_document で形式・サイズを検証する
 *   No.2「削除」          → 添付ファイルを削除し、提出書類の行を未提出へ戻す
 *
 * ⑤表示条件
 *   自社の「申請入力中」または「不備修正中」の申請が対象。
 *   提出書類の行は申請レコードへ紐づくため、先に下書き（申請の入力）が必要。
 *
 * ■ アップロードをサーバースクリプトで受けない理由
 * Service Portal のウィジェットのデータ往復（c.server.update）に
 * ファイルの中身を載せるとサイズが現実的でない。
 * そのため画面から添付 REST API（/api/now/attachment/file）へ直接送り、
 * 登録後に本画面がサーバーへ検証を依頼する形にしている。
 * 検証はアップロード後に行うため、不適合なファイルは
 * ApplicationDocumentUtil.syncRow が削除して未提出へ戻す。
 *
 * ■ 権限
 * 添付の権限は「添付先レコードを参照／更新できるか」に従う。
 * 事業者は自社かつ編集可能な申請の提出書類のみ write を持つ
 * （src/fluent/acls/application-acls.now.ts）。
 */
;(function () {
    data.isApplicant = false
    data.message = ''
    data.state = 'form' // 'form' | 'no_draft' | 'locked'
    data.entityName = ''
    data.request = null
    data.documents = []
    data.progress = { total: 0, submitted: 0, required: 0, requiredSubmitted: 0 }
    data.complete = { ok: false, missing: [] }
    data.saveResult = null
    data.applyUrl = '?id=' + (options.apply_page || 'x_dent2_dentsusoke_apply')
    data.expenseUrl = '?id=' + (options.expense_page || 'x_dent2_dentsusoke_apply_exp')
    data.confirmUrl = '?id=' + (options.confirm_page || 'x_dent2_dentsusoke_apply_conf')
    data.applicationsUrl = '?id=' + (options.applications_page || 'x_dent2_dentsusoke_apps')
    data.note =
        options.note ||
        '必須書類がそろったら「内容確認・提出」へ進み、内容を確認して提出してください。'

    var docUtil = new x_dent2_dentsusoke.ApplicationDocumentUtil()

    // アップロード先の情報は画面へ渡す（クライアントにテーブル名を埋め込まない）
    data.attachmentTable = 'x_dent2_dentsusoke_req_doc'
    data.maxFileSize = docUtil.getMaxFileSize()
    data.maxFileSizeLabel = formatSize(data.maxFileSize)
    data.allowedExtensions = docUtil.getAllowedExtensions()
    data.allowedExtensionsLabel = data.allowedExtensions.join('／')
    // <input type="file" accept="..."> へ渡す形（.pdf,.jpg,…）
    data.acceptAttribute = '.' + data.allowedExtensions.join(',.')

    var ctx = new x_dent2_dentsusoke.PortalContextUtil()
    var entityId = ctx.getMyEntityId()
    if (!entityId) {
        data.message = 'このページは事業者ユーザ向けです。事業者情報が紐づいたアカウントでログインしてください。'
        return
    }
    data.isApplicant = true
    data.entityName = getEntityName(entityId)

    var requestGr = loadEditableRequest(entityId)
    if (!requestGr) {
        return
    }
    var requestId = requestGr.getUniqueValue()

    data.request = {
        sys_id: requestId,
        applicationNumber: requestGr.getValue('u_application_number') || '',
        status: requestGr.getValue('u_application_status'),
        statusLabel: new x_dent2_dentsusoke.ApplicationStatusUtil().getApplicantLabel(
            requestGr.getValue('u_application_status'),
        ),
        organizationType: requestGr.getValue('u_organization_type'),
        organizationTypeLabel: requestGr.getDisplayValue('u_organization_type'),
        specialMeasure: requestGr.getValue('u_special_measure_flag') === '1',
        updatedOn: requestGr.getDisplayValue('sys_updated_on'),
    }

    // ③アクション -----------------------------------------------------------
    if (input && input.action === 'sync_document') {
        data.saveResult = docUtil.syncRow(requestId, input.doc_id)
    } else if (input && input.action === 'remove_document') {
        data.saveResult = docUtil.remove(requestId, input.doc_id)
    }

    /**
     * 提出書類の行を整える。
     * 組織形態・特例措置の有無によって必須区分が変わるため、
     * 画面を開くたびに評価し直す（編集できるステータスのうちのみ）。
     */
    docUtil.ensureRows(requestId)

    data.documents = docUtil.list(requestId)
    data.progress = docUtil.countSubmitted(requestId)
    data.complete = docUtil.checkComplete(requestId)

    // -----------------------------------------------------------------------
    /**
     * 編集対象の申請を取得する。
     * 申請入力中を優先し、無ければ不備修正中を探す（ITCOM-05 で使用する経路）。
     */
    function loadEditableRequest(entityId) {
        // 自社かつ編集可能なステータスの単一レコード取得。
        // get() では自社以外を除外する条件が適用されないためクエリ側で担保する（トンマナ 3.2.3 の例外）
        var gr = new GlideRecord('x_dent2_dentsusoke_request')
        gr.addQuery('u_business_entity', entityId)
        gr.addQuery('u_application_status', 'IN', 'input,defect_fixing')
        gr.orderByDesc('sys_updated_on')
        gr.setLimit(1)
        gr.query()

        if (gr.next()) {
            return gr
        }

        // 編集できる申請が無い場合、理由を切り分けて案内する
        var submitted = new GlideRecord('x_dent2_dentsusoke_request')
        submitted.addQuery('u_business_entity', entityId)
        submitted.addQuery('u_application_status', '!=', 'input')
        submitted.orderByDesc('sys_updated_on')
        submitted.setLimit(1)
        submitted.query()

        if (submitted.next()) {
            data.state = 'locked'
            data.message =
                '申請は提出済みのため添付書類を変更できません（申請番号 ' +
                submitted.getValue('u_application_number') +
                '）。変更が必要な場合は事務局へお問い合わせください。'
        } else {
            data.state = 'no_draft'
            data.message =
                '添付書類を提出する前に「申請の入力」で基本情報を保存してください。書類は申請に紐づけて保存されます。'
        }
        return null
    }

    /** 自社の事業者名。対象は u_business_entity で確定しているため get() を使用する */
    function getEntityName(entityId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        if (!gr.get(entityId)) {
            return ''
        }
        return gr.getValue('u_business_name') || ''
    }

    function formatSize(bytes) {
        var size = parseInt(bytes, 10) || 0
        if (size >= 1024 * 1024) {
            return Math.round((size / (1024 * 1024)) * 10) / 10 + ' MB'
        }
        if (size >= 1024) {
            return Math.round(size / 1024) + ' KB'
        }
        return size + ' B'
    }
})()
