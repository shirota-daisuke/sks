import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * 申請ステータスの事務局用 → 事業者用表記変換（処理No.22 の表示ラベル切替部分）。
 */
export const ApplicationStatusUtil = ScriptInclude({
    $id: Now.ID['ApplicationStatusUtil'],
    name: 'ApplicationStatusUtil',
    description: '申請ステータスを事業者用表記・表示区分へ変換する（業務フロー 申請ステータス一覧に準拠）',
    script: Now.include('../../server/script-includes/application-status-util.js'),
    accessibleFrom: 'public',
})
