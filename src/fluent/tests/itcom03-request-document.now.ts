import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * 申請の添付書類（画面イメージ ITCOM-03）の単体テスト
 *
 * 対象のカスタムロジックは ApplicationDocumentUtil（Script Include）。
 *
 * ■ このテストで守りたいこと
 *   ・許可していない形式・サイズ超過のファイルを受け付けないこと
 *   ・必須区分が申請の内容（組織形態・特例措置）で決まること
 *   ・必須書類の充足チェックがフラグではなく実ファイルの有無で行われること
 *   ・同じ書類種別に2件目をアップロードしたとき古いファイルが残らないこと
 *   ・他の申請の提出書類を sys_id 指定で操作できないこと
 *
 * とくに充足チェックは、u_submitted フラグで判定する実装に戻すと、
 * 画面以外の経路でファイルを消された申請が「提出済み」と判定されてしまう。
 * また形式・サイズの検証はアップロード後が唯一の判定点であり、
 * ここが抜けると審査側に不正な形式のファイルが渡る。
 *
 * ■ テスト方式
 * Script Include には UI が無いため atf.server.runServerSideScript で
 * クラスを直接インスタンス化して検証する（他の SC テストと同じ方式）。
 * 実ファイルのアップロードは画面から添付 REST API へ直接送る仕組みだが、
 * テストでは GlideSysAttachment.write で同じ状態（sys_attachment のレコード）を作る。
 * 検証には Jasmine を使わず assertEqual を使う（理由は sc11-registration-review.now.ts のコメント参照）。
 */

/** 提出書類の定義とファイルの検証 */
Test(
    {
        $id: Now.ID['test_doc_validate'],
        name: '添付書類：定義とファイルの検証',
        description:
            'ApplicationDocumentUtil.canEdit／getDocumentTypes／getAllowedExtensions／getMaxFileSize／validateFile を検証する。添付を編集できるのが申請入力中と不備修正中に限られること、提出書類の定義が選択肢のラベルを引けること、許可していない拡張子・拡張子なし・サイズ超過・サイズ0のファイルを弾き、許可された形式は通ることを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_doc_step_validate'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var util = new x_dent2_dentsusoke.ApplicationDocumentUtil()

    // -----------------------------------------------------------------------
    // 編集できる申請ステータス
    //
    // 提出後に書類が差し替えられると審査の前提が崩れるため、受付済以降は編集させない。
    // -----------------------------------------------------------------------
    check('申請入力中は編集できる', util.canEdit('input'), true)
    check('不備修正中は編集できる', util.canEdit('defect_fixing'), true)
    check('受付済は編集できない', util.canEdit('accepted'), false)
    check('一次審査中は編集できない', util.canEdit('review'), false)
    check('未設定は編集できない', util.canEdit(''), false)

    // -----------------------------------------------------------------------
    // 提出書類の定義
    //
    // ラベルは選択肢の定義（u_document_type）を唯一の出典とする。
    // ラベルをコードへ書き写す実装に戻すと、選択肢を直したときに画面と食い違う。
    // -----------------------------------------------------------------------
    var types = util.getDocumentTypes()
    check('提出書類の定義がある', types.length > 0, true)

    var allLabeled = true
    var allOrdered = true
    var previousOrder = 0
    for (var i = 0; i < types.length; i++) {
        if (!types[i].label || types[i].label === types[i].code) {
            allLabeled = false
        }
        if (types[i].order <= previousOrder) {
            allOrdered = false
        }
        previousOrder = types[i].order
    }
    check('すべての書類種別にラベルがある', allLabeled, true)
    check('表示順が重複せず昇順になっている', allOrdered, true)

    // -----------------------------------------------------------------------
    // ファイルの条件（プロパティから取得する）
    // -----------------------------------------------------------------------
    var allowed = util.getAllowedExtensions()
    check('許可する拡張子が取得できる', allowed.length > 0, true)
    check('PDF は許可されている', allowed.indexOf('pdf') >= 0, true)
    check('拡張子は小文字で保持される', allowed.join('') === allowed.join('').toLowerCase(), true)

    var max = util.getMaxFileSize()
    check('サイズ上限が正の値', max > 0, true)

    // -----------------------------------------------------------------------
    // ファイルの検証
    // -----------------------------------------------------------------------
    check('許可された形式は通る', util.validateFile('決算書.pdf', 1024).length, 0)
    check('大文字の拡張子も通る', util.validateFile('決算書.PDF', 1024).length, 0)
    check('許可していない形式を弾く', util.validateFile('script.exe', 1024).length > 0, true)
    check('拡張子なしを弾く', util.validateFile('決算書', 1024).length > 0, true)
    check('ファイル名が空なら弾く', util.validateFile('', 1024).length > 0, true)
    check('サイズ0を弾く', util.validateFile('決算書.pdf', 0).length > 0, true)
    check('サイズが数値でない場合を弾く', util.validateFile('決算書.pdf', 'あ').length > 0, true)
    check('サイズ上限ちょうどは通る', util.validateFile('決算書.pdf', max).length, 0)
    check('サイズ上限超過を弾く', util.validateFile('決算書.pdf', max + 1).length > 0, true)

    stepResult.setOutputMessage('提出書類の定義とファイルの検証を確認しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** 行の整備・添付・充足チェック */
Test(
    {
        $id: Now.ID['test_doc_upload'],
        name: '添付書類：行の整備と充足チェック',
        description:
            'ApplicationDocumentUtil.ensureRows／list／syncRow／remove／checkComplete／countSubmitted を検証する。書類種別ごとの行が重複せず作成されること、必須区分が組織形態と特例措置で決まること、添付後に提出済みへ変わること、同じ書類種別へ2件目を添付すると古いファイルが削除されること、許可していない形式のファイルが削除されて未提出へ戻ること、必須書類がそろうまで充足チェックが通らないこと、他の申請の提出書類を操作できないことを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_doc_step_upload'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var seq = 0
    var RUN = ('' + new GlideDateTime().getNumericValue()).slice(-10)

    var submitUtil = new x_dent2_dentsusoke.ApplicationSubmitUtil()
    var util = new x_dent2_dentsusoke.ApplicationDocumentUtil()
    var TABLE = 'x_dent2_dentsusoke_req_doc'

    function createEntity() {
        seq++
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.initialize()
        gr.setValue('u_business_name', 'ATF 添付書類テスト事業者 ' + RUN + '-' + seq)
        gr.setValue('u_entity_type', 'corporate')
        gr.setValue('u_corporate_number', RUN + ('00' + seq).slice(-3))
        gr.setValue('u_address', 'ATF テスト住所')
        gr.setValue('u_industry', 'service')
        gr.setValue('u_employee_count', 10)
        gr.setValue('u_capital', 5000)
        return gr.insert()
    }

    function createUser(entityId) {
        seq++
        var login = 'atf.document.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'DOCUMENT-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'registered')
        gr.setValue('u_duplicate_check_result', 'no_duplicate')
        gr.setValue('u_auth_method', 'standard')
        return gr.insert()
    }

    /** 提出書類を紐づけるための下書きを1件用意する */
    function createDraft(organizationType, specialMeasure) {
        var entityId = createEntity()
        var userId = createUser(entityId)
        submitUtil.saveDraft(entityId, userId, {
            organization_type: organizationType,
            employee_category: 'le20',
            special_measure: specialMeasure
        })
        return submitUtil.getDraft(entityId).getUniqueValue()
    }

    /**
     * 実ファイルの登録。
     * 画面では添付 REST API から登録されるが、出来上がる状態（sys_attachment のレコード）は同じ。
     */
    function attach(docId, fileName, content) {
        var gr = new GlideRecord(TABLE)
        if (!gr.get(docId)) {
            return ''
        }
        return new GlideSysAttachment().write(gr, fileName, 'application/pdf', content) + ''
    }

    function countAttachments(docId) {
        var gr = new GlideRecord('sys_attachment')
        gr.addQuery('table_name', TABLE)
        gr.addQuery('table_sys_id', docId)
        gr.query()
        return gr.getRowCount()
    }

    function reloadDoc(docId) {
        var gr = new GlideRecord(TABLE)
        gr.get(docId)
        return gr
    }

    /** 書類種別から行を引く */
    function findRow(rows, documentType) {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].documentType === documentType) {
                return rows[i]
            }
        }
        return null
    }

    // -----------------------------------------------------------------------
    // 行の整備：重複して作らないこと
    // -----------------------------------------------------------------------
    var requestId = createDraft('corporate', false)
    check('検証用の下書きが作成できた', !!requestId, true)

    var typeCount = util.getDocumentTypes().length
    var created = util.ensureRows(requestId)
    check('書類種別のぶんだけ行が作られる', created, typeCount)
    check('一覧が書類種別のぶん返る', util.list(requestId).length, typeCount)

    // 2回目の呼び出しで行が増えないこと（画面を開くたびに呼ばれる）
    util.ensureRows(requestId)
    check('2回目の整備で行が増えない', util.list(requestId).length, typeCount)

    // -----------------------------------------------------------------------
    // 必須区分：申請の内容で決まること
    // -----------------------------------------------------------------------
    var rows = util.list(requestId)
    check('決算書は必須', findRow(rows, 'financial').required, true)
    check('見積書は必須', findRow(rows, 'quotation').required, true)
    check('その他は任意', findRow(rows, 'other').required, false)
    check('法人なら履歴事項全部証明書は必須', findRow(rows, 'registry').required, true)
    check('特例措置の対象外なら根拠書類は任意', findRow(rows, 'special').required, false)

    // 個人事業主では履歴事項全部証明書を必須にしない
    var soleRequestId = createDraft('sole_proprietor', false)
    util.ensureRows(soleRequestId)
    check('個人事業主なら履歴事項全部証明書は任意',
        findRow(util.list(soleRequestId), 'registry').required, false)

    // 特例措置の対象なら根拠書類を必須にする
    var specialRequestId = createDraft('corporate', true)
    util.ensureRows(specialRequestId)
    check('特例措置の対象なら根拠書類は必須',
        findRow(util.list(specialRequestId), 'special').required, true)

    /**
     * 申請の内容が変われば必須区分を評価し直すこと。
     * 作成時の値のまま固定する実装だと、法人へ変更しても必須書類が増えない。
     */
    var changeGr = new GlideRecord('x_dent2_dentsusoke_request')
    changeGr.get(soleRequestId)
    changeGr.setValue('u_organization_type', 'corporate')
    changeGr.update()
    util.ensureRows(soleRequestId)
    check('組織形態の変更で必須区分が変わる',
        findRow(util.list(soleRequestId), 'registry').required, true)

    // 提出時の入力値で評価できること（レコードへ書き込む前の判定に使う）
    util.ensureRows(soleRequestId, { organizationType: 'sole_proprietor' })
    check('入力値の指定で必須区分を評価できる',
        findRow(util.list(soleRequestId), 'registry').required, false)

    // -----------------------------------------------------------------------
    // 充足チェック：実ファイルの有無で判定すること
    // -----------------------------------------------------------------------
    var complete = util.checkComplete(requestId)
    check('未提出では充足しない', complete.ok, false)
    check('未提出の書類名が返る', complete.missing.length > 0, true)

    var financial = findRow(util.list(requestId), 'financial')

    /**
     * フラグだけ立てても充足しないこと。
     * u_submitted で判定する実装に戻ると、画面以外の経路でファイルを
     * 消された申請が「提出済み」と判定されてしまう。
     */
    var flagOnly = reloadDoc(financial.sys_id)
    flagOnly.setValue('u_submitted', true)
    flagOnly.setValue('u_file_name', 'ファイルは無い.pdf')
    flagOnly.update()
    check('フラグだけでは提出済みにならない', util.hasFile(financial.sys_id), false)
    check('一覧の提出状況も実ファイルに従う',
        findRow(util.list(requestId), 'financial').submitted, false)

    var stillMissing = util.checkComplete(requestId)
    check('フラグだけでは充足しない', stillMissing.ok, false)

    // -----------------------------------------------------------------------
    // 添付とアップロード後の後処理
    // -----------------------------------------------------------------------
    check('ファイルを登録できた', !!attach(financial.sys_id, '決算書.pdf', 'ATF テスト内容'), true)
    check('実ファイルが存在する', util.hasFile(financial.sys_id), true)

    var synced = util.syncRow(requestId, financial.sys_id)
    check('後処理が成功する', synced.success, true)
    check('返却されるアクション', synced.action, 'upload_document')
    check('ファイル名が返る', synced.fileName, '決算書.pdf')

    var afterSync = reloadDoc(financial.sys_id)
    check('提出済みフラグが立つ', afterSync.getValue('u_submitted'), '1')
    check('ファイル名が記録される', afterSync.getValue('u_file_name'), '決算書.pdf')
    check('提出日時が記録される', !!afterSync.getValue('u_submitted_on'), true)

    var syncedRow = findRow(util.list(requestId), 'financial')
    check('一覧で提出済みになる', syncedRow.submitted, true)
    check('一覧にファイル名が出る', syncedRow.fileName, '決算書.pdf')
    check('一覧にサイズが出る', syncedRow.sizeLabel !== '', true)
    check('ダウンロードのリンクが出る', syncedRow.downloadUrl !== '', true)

    // 差し替え：2件目を登録すると古いファイルは残らない
    attach(financial.sys_id, '決算書_修正版.pdf', 'ATF テスト内容2')
    check('差し替え直後は2件ある', countAttachments(financial.sys_id), 2)
    var replaced = util.syncRow(requestId, financial.sys_id)
    check('差し替えの後処理が成功する', replaced.success, true)
    check('古いファイルが削除される', countAttachments(financial.sys_id), 1)
    check('新しいファイル名になる', reloadDoc(financial.sys_id).getValue('u_file_name'), '決算書_修正版.pdf')

    /**
     * 許可していない形式のファイルは削除して未提出へ戻すこと。
     * アップロードは画面から添付 REST API へ直接送られるため、
     * ここが形式・サイズの唯一の判定点になる。
     */
    var quotation = findRow(util.list(requestId), 'quotation')
    attach(quotation.sys_id, 'あやしいファイル.exe', 'ATF テスト内容')
    var rejected = util.syncRow(requestId, quotation.sys_id)
    check('許可していない形式は後処理で失敗する', rejected.success, false)
    check('不適合のファイルは削除される', countAttachments(quotation.sys_id), 0)
    check('行は未提出のまま', reloadDoc(quotation.sys_id).getValue('u_submitted'), '0')

    // ファイルが無い状態での後処理
    check('ファイルが無ければ後処理は失敗する', util.syncRow(requestId, quotation.sys_id).success, false)

    // -----------------------------------------------------------------------
    // 他の申請の提出書類は操作できないこと
    //
    // 画面から sys_id を差し替えて送られても、u_request の紐付きで拒否する。
    // -----------------------------------------------------------------------
    var otherRequestId = createDraft('corporate', false)
    util.ensureRows(otherRequestId)
    check('別の申請からは後処理できない',
        util.syncRow(otherRequestId, financial.sys_id).success, false)
    check('別の申請からは削除できない',
        util.remove(otherRequestId, financial.sys_id).success, false)
    check('ファイルは残っている', util.hasFile(financial.sys_id), true)
    check('存在しない行は操作できない',
        util.syncRow(requestId, '00000000000000000000000000000000').success, false)
    check('未指定では操作できない', util.remove(requestId, '').success, false)

    // -----------------------------------------------------------------------
    // 必須書類がそろえば充足すること
    // -----------------------------------------------------------------------
    var progressBefore = util.countSubmitted(requestId)
    check('提出済みは1件', progressBefore.submitted, 1)
    check('必須の総数が数えられる', progressBefore.required > 0, true)
    check('必須の提出済みは1件', progressBefore.requiredSubmitted, 1)

    var allRows = util.list(requestId)
    for (var j = 0; j < allRows.length; j++) {
        if (allRows[j].required && !allRows[j].submitted) {
            attach(allRows[j].sys_id, allRows[j].documentType + '.pdf', 'ATF テスト内容')
            check('必須書類の後処理が成功する（' + allRows[j].documentTypeLabel + '）',
                util.syncRow(requestId, allRows[j].sys_id).success, true)
        }
    }

    var filled = util.checkComplete(requestId)
    check('必須書類がそろえば充足する', filled.ok, true)
    check('未提出の書類は無い', filled.missing.length, 0)

    var progressAfter = util.countSubmitted(requestId)
    check('必須の提出済みが必須の総数と一致する',
        progressAfter.requiredSubmitted, progressAfter.required)

    // -----------------------------------------------------------------------
    // 削除：未提出へ戻ること
    // -----------------------------------------------------------------------
    var removed = util.remove(requestId, financial.sys_id)
    check('削除が成功する', removed.success, true)
    check('返却されるアクション', removed.action, 'remove_document')
    check('実ファイルが無くなる', countAttachments(financial.sys_id), 0)

    var afterRemove = reloadDoc(financial.sys_id)
    check('提出済みフラグが下がる', afterRemove.getValue('u_submitted'), '0')
    check('ファイル名が消える', afterRemove.getValue('u_file_name'), '')
    check('削除すると充足しなくなる', util.checkComplete(requestId).ok, false)

    stepResult.setOutputMessage('提出書類の整備・添付・充足チェックを検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
