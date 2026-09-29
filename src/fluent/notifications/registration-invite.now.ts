import '@servicenow/sdk/global'
import { EmailNotification, Record } from '@servicenow/sdk/core'

/**
 * 処理No.2 本登録案内メール送信処理（IF-07 メール配信基盤連携）
 *
 * 仮登録受付処理（処理No.1）が発火するイベント x_dent2_dentsusoke.registration.invite を受信し、
 * 仮登録時に入力されたメールアドレス宛に本登録用リンクを含む案内メールを送信する。
 *
 * 宛先は eventParm1WithRecipient により、イベントの parm1（仮登録した事業者ユーザの sys_id）から解決する。
 *
 * TODO(Q13・A21／IF-07 確認事項): 通知テンプレートの文言・送信元アドレスが未確定。
 *   from は指定せず、インスタンスの既定送信元（glide.email.smtp 設定）を使用する。
 */

/** 本登録リンクを動的生成する Email Script（本文から ${mail_script:SKS Registration Link} で参照する） */
Record({
    $id: Now.ID['x_dent2_dentsusoke_registration_link_script'],
    table: 'sys_script_email',
    data: {
        name: 'SKS Registration Link',
        new_lines_to_html: false,
        script: Now.include('../../server/mail-scripts/registration-link.js'),
    },
})

export const registrationInviteNotification = EmailNotification({
    $id: Now.ID['x_dent2_dentsusoke_registration_invite_mail'],
    table: 'x_dent2_dentsusoke_user',
    name: 'SKS 本登録案内メール',
    active: true,
    triggerConditions: {
        generationType: 'event',
        eventName: 'x_dent2_dentsusoke.registration.invite',
    },
    recipientDetails: {
        // イベント parm1 に渡した事業者ユーザの sys_id を宛先として解決する
        eventParm1WithRecipient: true,
    },
    emailContent: {
        subject: '【成長加速支援補助金 申請ポータル】本登録のご案内',
        messageHtml: `<p>\${user_name} 様</p>
<p>成長加速支援補助金 申請ポータルの仮登録を受け付けました。</p>
<p>下記のリンクから本登録（事業者情報・パスワードの登録）にお進みください。</p>
<p><a href="\${mail_script:SKS Registration Link}">本登録を行う</a></p>
<p>※本リンクの有効期限は発行から7日間です。期限を過ぎた場合は、お手数ですが再度仮登録を行ってください。</p>
<p>※本メールに心当たりがない場合は、お手数ですが破棄してください。</p>`,
    },
})
