import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * 申請の不備修正（事業者側／画面イメージ ITCOM-05）。
 *
 * 不備確認依頼（defect_request）→ 不備修正中（defect_fixing）
 * → 不備修正回答あり（defect_answered）の遷移と、回答の保存・再提出を担当する。
 *
 * ユーザ登録の不備対応（処理No.7／RegistrationDefectUtil）とは対象が異なる別物。
 * 申請の不備修正は事業者がログインした状態で行うため、トークンは使わず ACL で範囲を担保する。
 *
 * ポータルのウィジェットから呼ぶため accessibleFrom は 'public' とする。
 */
export const ApplicationDefectUtil = ScriptInclude({
    $id: Now.ID['ApplicationDefectUtil'],
    name: 'ApplicationDefectUtil',
    description:
        '申請の不備修正（ITCOM-05）。不備確認依頼から不備修正中への遷移、回答の一時保存、対象経費・添付書類の充足確認と再提出（不備修正回答あり）を担当する。',
    script: Now.include('../../server/script-includes/application-defect-util.js'),
    accessibleFrom: 'public',
})
