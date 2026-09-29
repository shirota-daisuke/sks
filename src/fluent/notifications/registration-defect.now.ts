import '@servicenow/sdk/global'
import { EmailNotification, Record } from '@servicenow/sdk/core'

/**
 * 処理No.45 不備確認依頼メール送信処理（IF-07 メール配信基盤連携）
 *
 * 登録不備対応処理（処理No.7）の事務局側操作が発火するイベント
 * x_dent2_dentsusoke.registration.defect を受信し、
 * 申請者へ不備内容と修正画面へのリンクを含む案内メールを送信する。
 *
 * この時点の申請者には applicant ロールが無くポータルへログインできないため、
 * 本メールのリンクが不備内容を伝える唯一の経路である。
 *
 * 宛先は eventParm1WithRecipient により、イベントの parm1（対象の事業者ユーザの sys_id）から解決する。
 *
 * 不備内容（u_registration_issue_note）は事務局の自由記述であり改行を含むため、
 * 本文では <pre> で囲んで改行を保持する。
 *
 * TODO(Q13・A21／IF-07 確認事項): 通知テンプレートの文言・送信元アドレスが未確定。
 *   from は指定せず、インスタンスの既定送信元（glide.email.smtp 設定）を使用する。
 */

/** 修正画面リンクを動的生成する Email Script（本文の mail_script 参照から呼ばれる） */
Record({
    $id: Now.ID['x_dent2_dentsusoke_defect_fix_link_script'],
    table: 'sys_script_email',
    data: {
        name: 'SKS Defect Fix Link',
        new_lines_to_html: false,
        script: Now.include('../../server/mail-scripts/defect-fix-link.js'),
    },
})

export const registrationDefectNotification = EmailNotification({
    $id: Now.ID['x_dent2_dentsusoke_registration_defect_mail'],
    table: 'x_dent2_dentsusoke_user',
    name: 'SKS 登録不備確認依頼メール',
    active: true,
    triggerConditions: {
        generationType: 'event',
        eventName: 'x_dent2_dentsusoke.registration.defect',
    },
    recipientDetails: {
        // イベント parm1 に渡した事業者ユーザの sys_id を宛先として解決する
        eventParm1WithRecipient: true,
    },
    emailContent: {
        subject: '【成長加速支援補助金 申請ポータル】ご登録内容の確認のお願い',
        messageHtml: `<p>\${user_name} 様</p>
<p>成長加速支援補助金 申請ポータルへご登録いただいた内容について、確認させていただきたい点がございます。</p>
<p>下記の内容をご確認のうえ、リンクから修正内容のご提出をお願いします。</p>
<p><strong>確認をお願いする内容</strong></p>
<pre>\${u_registration_issue_note}</pre>
<p><a href="\${mail_script:SKS Defect Fix Link}">登録内容を修正する</a></p>
<p>※修正内容をご提出いただいた後、事務局にて改めて審査いたします。</p>
<p>※本リンクの有効期限は発行から14日間です。期限を過ぎた場合は事務局へお問い合わせください。</p>
<p>※本メールに心当たりがない場合は、お手数ですが事務局へご連絡ください。</p>`,
    },
})
