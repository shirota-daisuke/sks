import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * 本登録案内メール送信処理（処理No.2）を起動するイベント。
 *
 * 仮登録受付処理（処理No.1）が gs.eventQueue() で発火し、
 * イベント駆動の Email Notification（notifications/registration-invite.now.ts）が受信する。
 *
 * event_name は最大40文字。'x_dent2_dentsusoke.' が19文字のため suffix は21文字以内に収める必要がある
 * （'registration.invite' は19文字＝合計38文字）。
 */
export const registrationInviteEvent = Record({
    $id: Now.ID['x_dent2_dentsusoke_registration_invite_event'],
    table: 'sysevent_register',
    data: {
        suffix: 'registration.invite',
        event_name: 'x_dent2_dentsusoke.registration.invite',
        description: '仮登録受付時に本登録案内メールを送信するために発火する（処理No.1→処理No.2）',
        table: 'x_dent2_dentsusoke_user',
        fired_by: 'SPWidget: SKS 仮登録フォーム（サーバースクリプト）',
        priority: 100,
    },
})
