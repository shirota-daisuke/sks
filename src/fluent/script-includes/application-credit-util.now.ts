import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * 信用調査（事務局側／画面イメージ ITCOM-08）。
 *
 * 要否判定（一次審査完了→外部調査準備中／信用調査免除）、外部機関への依頼、
 * 督促、結果の取込、調査の取消を担当する。
 *
 * 1申請に再調査がありうるため、調査の記録は子テーブル
 * （x_dent2_dentsusoke_credit）へ1対多で持つ。
 *
 * 事務局ワークスペースの UI Action から呼ぶため accessibleFrom は 'public' とする。
 */
export const ApplicationCreditUtil = ScriptInclude({
    $id: Now.ID['ApplicationCreditUtil'],
    name: 'ApplicationCreditUtil',
    description:
        '信用調査（ITCOM-08）。要否判定の材料提示と判定、外部機関への依頼、督促、結果の取込、調査の取消を担当する。',
    script: Now.include('../../server/script-includes/application-credit-util.js'),
    accessibleFrom: 'public',
})
