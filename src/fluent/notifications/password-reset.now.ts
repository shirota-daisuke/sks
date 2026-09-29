import '@servicenow/sdk/global'
import { EmailNotification, Record } from '@servicenow/sdk/core'

/**
 * パスワードリセット処理（処理No.11）前半：再設定メール送信（IF-07 メール配信基盤連携）
 *
 * SC-04「再設定用リンクを送信」ボタンが発火するイベント x_dent2_dentsusoke.password.reset を受信し、
 * 登録済みメールアドレス宛に再設定用リンクを含むメールを送信する。
 *
 * 宛先は eventParm1WithRecipient により、イベントの parm1（対象の事業者ユーザの sys_id）から解決する。
 *
 * TODO(Q13・A21／IF-07 確認事項): 通知テンプレートの文言・送信元アドレスが未確定。
 */

/** 再設定用リンクを動的生成する Email Script（本文から ${mail_script:SKS Password Reset Link} で参照する） */
Record({
    $id: Now.ID['x_dent2_dentsusoke_password_reset_link_script'],
    table: 'sys_script_email',
    data: {
        name: 'SKS Password Reset Link',
        new_lines_to_html: false,
        script: Now.include('../../server/mail-scripts/password-reset-link.js'),
    },
})

export const passwordResetNotification = EmailNotification({
    $id: Now.ID['x_dent2_dentsusoke_password_reset_mail'],
    table: 'x_dent2_dentsusoke_user',
    name: 'SKS パスワード再設定メール',
    active: true,
    triggerConditions: {
        generationType: 'event',
        eventName: 'x_dent2_dentsusoke.password.reset',
    },
    recipientDetails: {
        eventParm1WithRecipient: true,
    },
    emailContent: {
        subject: '【成長加速支援補助金 申請ポータル】パスワード再設定のご案内',
        messageHtml: `<p>\${user_name} 様</p>
<p>パスワード再設定のリクエストを受け付けました。</p>
<p>下記のリンクから新しいパスワードを設定してください。</p>
<p><a href="\${mail_script:SKS Password Reset Link}">パスワードを再設定する</a></p>
<p>※本リンクの有効期限は発行から24時間です。期限を過ぎた場合は、お手数ですが再度お手続きをお願いします。</p>
<p>※パスワード再設定を依頼していない場合は、本メールを破棄してください。パスワードは変更されません。</p>`,
    },
})
