import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * 不備確認依頼メール送信処理（処理No.45）を起動するイベント。
 *
 * 登録不備対応処理（処理No.7）の事務局側操作
 * （RegistrationReviewUtil.requestDefectFix／UI Action「不備修正を依頼」）が
 * gs.eventQueue() で発火し、イベント駆動の Email Notification
 * （notifications/registration-defect.now.ts）が受信する。
 *
 * event_name は最大40文字。'x_dent2_dentsusoke.' が19文字のため suffix は21文字以内に収める必要がある
 * （'registration.defect' は19文字＝合計38文字）。
 */
export const registrationDefectEvent = Record({
    $id: Now.ID['x_dent2_dentsusoke_registration_defect_event'],
    table: 'sysevent_register',
    data: {
        suffix: 'registration.defect',
        event_name: 'x_dent2_dentsusoke.registration.defect',
        description: '登録不備の修正を依頼した時点で申請者へ案内メールを送信するために発火する（処理No.7→処理No.45）',
        table: 'x_dent2_dentsusoke_user',
        fired_by: 'ScriptInclude: RegistrationReviewUtil.requestDefectFix',
        priority: 100,
    },
})
