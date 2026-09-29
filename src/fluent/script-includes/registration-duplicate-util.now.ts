import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * 重複チェック（処理No.5）・前年登録判定（処理No.4）。
 *
 * SC-03 本登録（signup-form）と SC-07' 登録不備修正（defect-fix-form）の双方から呼ぶため、
 * ウィジェット内の関数から Script Include へ切り出している。
 * 未認証のウィジェットから呼ぶため accessibleFrom は 'public' とする。
 */
export const RegistrationDuplicateUtil = ScriptInclude({
    $id: Now.ID['RegistrationDuplicateUtil'],
    name: 'RegistrationDuplicateUtil',
    description:
        '事業者の重複チェック（処理No.5）と前年登録判定（処理No.4）。Q04「確定一致は登録不可、曖昧一致のみ事務局確認」に準拠する。',
    script: Now.include('../../server/script-includes/registration-duplicate-util.js'),
    accessibleFrom: 'public',
})
