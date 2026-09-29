import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * SC-02 仮登録画面 フォーム
 * 未ログインの事業者が入力するため public: true が必須。
 */
export const registerFormWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_register_form'],
    id: 'x_dent2_dentsusoke_register_form',
    name: 'SKS 仮登録フォーム',
    description:
        'SC-02 仮登録画面。ログインID・メールアドレスを受け付け、仮登録受付処理（処理No.1）と本登録案内メール送信処理（処理No.2）を実行する。',
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    public: true,
    hasPreview: true,
    optionSchema: [
        {
            name: 'notice_message',
            label: '補足メッセージ',
            type: 'string',
            section: 'Presentation',
            defaultValue: 'ご入力のメールアドレス宛に、本登録用のご案内をお送りします。',
        },
        {
            // TODO: 有効期限は未確定。SC-04 の再設定用リンク有効期限とあわせて確定する。
            name: 'token_valid_days',
            label: '仮登録トークン有効日数',
            type: 'integer',
            section: 'Behavior',
            defaultValue: 7,
        },
    ],
})
