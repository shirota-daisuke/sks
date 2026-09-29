import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * 一次審査（事務局側／画面イメージ ITCOM-06）。
 *
 * 審査対象の抽出条件、審査期限（提出日＋SLA日数）の算出、
 * 審査担当者の割当と審査の開始（受付済→一次審査中、不備修正回答あり→再審査中）を担当する。
 *
 * 判定（一次審査完了／不備確認依頼／不採択）は ITCOM-07 の範囲であり含めない。
 *
 * 事務局ワークスペースの UI Action から呼ぶため accessibleFrom は 'public' とする。
 */
export const ApplicationReviewUtil = ScriptInclude({
    $id: Now.ID['ApplicationReviewUtil'],
    name: 'ApplicationReviewUtil',
    description:
        '一次審査（ITCOM-06）。審査対象の判定、審査期限の算出、審査担当者の割当と審査の開始を担当する。',
    script: Now.include('../../server/script-includes/application-review-util.js'),
    accessibleFrom: 'public',
})
