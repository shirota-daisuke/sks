import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * 申請の不備確認依頼メールを起動するイベント（ITCOM-07）。
 *
 * 一次審査の「不備修正を依頼する」（ApplicationReviewUtil.requestDefect／
 * UI Action sks_review_request_defect）が gs.eventQueue() で発火し、
 * イベント駆動の Email Notification（notifications/request-defect.now.ts）が受信する。
 *
 * ユーザ登録の不備確認依頼（x_dent2_dentsusoke.registration.defect）とは
 * 対象テーブルもリンク先の画面も異なるため、別のイベントとして持つ。
 *
 * event_name は最大40文字。'x_dent2_dentsusoke.' が19文字のため suffix は21文字以内に収める必要がある
 * （'request.defect' は14文字＝合計33文字）。
 */
export const requestDefectEvent = Record({
    $id: Now.ID['x_dent2_dentsusoke_request_defect_event'],
    table: 'sysevent_register',
    data: {
        suffix: 'request.defect',
        event_name: 'x_dent2_dentsusoke.request.defect',
        description:
            '一次審査で不備確認を依頼した時点で申請者へ案内メールを送信するために発火する（ITCOM-07→ITCOM-05）',
        table: 'x_dent2_dentsusoke_request',
        fired_by: 'ScriptInclude: ApplicationReviewUtil.requestDefect',
        priority: 100,
    },
})
