import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * パスワードリセット処理（処理No.11）前半の再設定メール送信を起動するイベント。
 *
 * SC-04「再設定用リンクを送信」ボタンの処理が gs.eventQueue() で発火し、
 * イベント駆動の Email Notification（notifications/password-reset.now.ts）が受信する。
 *
 * event_name は最大40文字。'x_dent2_dentsusoke.password.reset' は33文字。
 */
export const passwordResetEvent = Record({
    $id: Now.ID['x_dent2_dentsusoke_password_reset_event'],
    table: 'sysevent_register',
    data: {
        suffix: 'password.reset',
        event_name: 'x_dent2_dentsusoke.password.reset',
        description: 'パスワード再設定のリクエスト時に再設定用リンクを含むメールを送信するために発火する（処理No.11 前半）',
        table: 'x_dent2_dentsusoke_user',
        fired_by: 'SPWidget: SKS パスワードリセットフォーム（サーバースクリプト）',
        priority: 100,
    },
})
