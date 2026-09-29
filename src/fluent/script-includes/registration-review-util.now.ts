import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * ユーザ登録審査（SC-11）のステータス遷移。
 * 登録審査（処理No.6）・登録不備対応（処理No.7）・ステータス表示区分（処理No.8）を担当する。
 */
export const RegistrationReviewUtil = ScriptInclude({
    $id: Now.ID['RegistrationReviewUtil'],
    name: 'RegistrationReviewUtil',
    description:
        'ユーザ登録審査の承認・却下・不備修正依頼とステータス表示区分の判定（業務フロー ユーザー登録アクション・権限マトリクスに準拠）',
    script: Now.include('../../server/script-includes/registration-review-util.js'),
    accessibleFrom: 'public',
})
