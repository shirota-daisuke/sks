import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * ログイン中の事業者ユーザのコンテキスト（所属事業者・事業者区分）を解決する。
 * ACL 条件スクリプトからも評価されるため accessibleFrom は 'public' とする。
 */
export const PortalContextUtil = ScriptInclude({
    $id: Now.ID['PortalContextUtil'],
    name: 'PortalContextUtil',
    description: 'ログイン中の事業者ユーザの所属事業者・事業者区分を解決する（権限設計書 3. データスコープ制御方針）',
    script: Now.include('../../server/script-includes/portal-context-util.js'),
    accessibleFrom: 'public',
})
