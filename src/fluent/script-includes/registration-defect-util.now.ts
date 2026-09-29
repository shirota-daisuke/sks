import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * 登録不備対応処理（処理No.7）の事業者（申請者）側。
 *
 * 不備修正トークンの検証、登録不備修正中への遷移、修正内容の再提出を担当する。
 * 事務局側の操作（不備修正の依頼）は RegistrationReviewUtil が担当する。
 *
 * 未認証のウィジェット（defect-fix-form）から呼ぶため accessibleFrom は 'public' とする。
 */
export const RegistrationDefectUtil = ScriptInclude({
    $id: Now.ID['RegistrationDefectUtil'],
    name: 'RegistrationDefectUtil',
    description:
        '登録不備対応（処理No.7）の申請者側。不備修正トークンの検証、登録不備修正中への遷移、修正内容の再提出（重複チェック・前年登録判定の再実行を含む）を行う。',
    script: Now.include('../../server/script-includes/registration-defect-util.js'),
    accessibleFrom: 'public',
})
