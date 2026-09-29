import '@servicenow/sdk/global'
import { EmailNotification, Record } from '@servicenow/sdk/core'

/**
 * 申請の不備確認依頼メール（ITCOM-07 → ITCOM-05／IF-07 メール配信基盤連携）
 *
 * 一次審査の「不備修正を依頼する」が発火するイベント
 * x_dent2_dentsusoke.request.defect を受信し、
 * 申請者へ不備内容と修正画面へのリンクを含む案内メールを送信する。
 *
 * 画面イメージ ITCOM-07 の注記
 * 「入力した内容は申請者へのメールにそのまま記載され、修正画面（ITCOM-05）への
 *   リンクが送られます」に対応する。
 *
 * ユーザ登録の不備確認依頼メール（registration-defect.now.ts）とは
 * 対象テーブル・リンク先の画面・トークンの有無が異なるため別の通知として持つ。
 *
 * 宛先は eventParm1WithRecipient により、イベントの parm1（申請者ユーザの sys_id）から解決する。
 *
 * 不備内容（u_defect_note）は事務局の自由記述であり改行を含むため、
 * 本文では <pre> で囲んで改行を保持する。
 *
 * TODO(IF-07 確認事項): 通知テンプレートの文言・送信元アドレスが未確定。
 *   from は指定せず、インスタンスの既定送信元（glide.email.smtp 設定）を使用する。
 */

/** 修正画面リンクを動的生成する Email Script（本文の mail_script 参照から呼ばれる） */
Record({
    $id: Now.ID['x_dent2_dentsusoke_app_defect_fix_link_script'],
    table: 'sys_script_email',
    data: {
        name: 'SKS App Defect Fix Link',
        new_lines_to_html: false,
        script: Now.include('../../server/mail-scripts/app-defect-fix-link.js'),
    },
})

export const requestDefectNotification = EmailNotification({
    $id: Now.ID['x_dent2_dentsusoke_request_defect_mail'],
    table: 'x_dent2_dentsusoke_request',
    name: 'SKS 申請不備確認依頼メール',
    active: true,
    triggerConditions: {
        generationType: 'event',
        eventName: 'x_dent2_dentsusoke.request.defect',
    },
    recipientDetails: {
        // イベント parm1 に渡した申請者ユーザの sys_id を宛先として解決する
        eventParm1WithRecipient: true,
    },
    emailContent: {
        subject: '【成長加速支援補助金 申請ポータル】申請内容の確認のお願い',
        messageHtml: `<p>\${u_applicant_user} 様</p>
<p>ご提出いただいた申請（申請番号 \${u_application_number}）について、確認させていただきたい点がございます。</p>
<p>下記の内容をご確認のうえ、リンクから修正内容のご提出をお願いします。</p>
<p><strong>確認をお願いする内容</strong></p>
<pre>\${u_defect_note}</pre>
<p><strong>回答期限</strong>：\${u_defect_due_on}</p>
<p><a href="\${mail_script:SKS App Defect Fix Link}">申請内容を修正する</a></p>
<p>※対象経費・添付書類の修正は、リンク先の画面から各入力画面へ進んでいただけます。</p>
<p>※修正内容をご提出いただいた後、事務局にて改めて審査いたします。</p>
<p>※本メールに心当たりがない場合は、お手数ですが事務局へご連絡ください。</p>`,
    },
})
