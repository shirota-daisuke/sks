import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * SC-13 お知らせ作成・編集（事務局）のサーバー側処理。
 * 保存時の入力検証（公開範囲設定：処理No.40／公開期間設定：処理No.41）と公開／非公開の切替を担当する。
 *
 * 事業者向けの公開範囲判定・既読管理は NoticeUtil が担当する（役割の重複はない）。
 */
export const NoticeAdminUtil = ScriptInclude({
    $id: Now.ID['NoticeAdminUtil'],
    name: 'NoticeAdminUtil',
    description: 'お知らせの登録・更新時の入力検証と公開／非公開の切替（処理No.40／41、SC-13）',
    script: Now.include('../../server/script-includes/notice-admin-util.js'),
    accessibleFrom: 'public',
})
