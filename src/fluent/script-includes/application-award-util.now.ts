import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * 採択・不採択の確定（事務局側／画面イメージ ITCOM-09）。
 *
 * 審査結果の集約、交付決定額の算定、採択番号の採番、
 * 採択（申請審査完了）・不採択の確定と一次審査への差し戻しを担当する。
 *
 * 申請審査完了（review_done）への遷移が無かったため動いていなかった
 * SC-17 採択者一覧帳票・SC-15 ダッシュボード・RPA の添付転送が、
 * 本クラスの確定処理により起動する。
 *
 * 確定操作は staff_admin に限定する（権限設計書 A20）。
 *
 * 事務局ワークスペースの UI Action から呼ぶため accessibleFrom は 'public' とする。
 */
export const ApplicationAwardUtil = ScriptInclude({
    $id: Now.ID['ApplicationAwardUtil'],
    name: 'ApplicationAwardUtil',
    description:
        '採択・不採択の確定（ITCOM-09）。審査結果の集約、交付決定額の算定、採択番号の採番、確定と一次審査への差し戻しを担当する。確定は事務局管理者のみ実行できる。',
    script: Now.include('../../server/script-includes/application-award-util.js'),
    accessibleFrom: 'public',
})
