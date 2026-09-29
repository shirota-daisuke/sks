import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * SC-14 問合せ管理・返信（事務局）のサーバー側処理。
 * 問合せ返信処理（処理No.47）と対応者の割当を担当する。
 *
 * 事業者側の起票・履歴表示は SC-10 のウィジェット（処理No.46）が担当する（役割の重複はない）。
 */
export const InquiryAdminUtil = ScriptInclude({
    $id: Now.ID['InquiryAdminUtil'],
    name: 'InquiryAdminUtil',
    description: '問合せの返信・対応者割当・差し戻しと回答本文の検証（処理No.47、SC-14）',
    script: Now.include('../../server/script-includes/inquiry-admin-util.js'),
    accessibleFrom: 'public',
})
