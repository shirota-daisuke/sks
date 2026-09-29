import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * SC-01 ログイン画面 補足リンク・注記
 * 未ログインで表示するため public: true が必須。
 */
export const loginLinksWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_login_links'],
    id: 'x_dent2_dentsusoke_login_links',
    name: 'SKS ログイン画面 補足リンク',
    description:
        'SC-01 ログイン画面。OOTB ログインウィジェットが持たない SC-04 パスワードリセットへのリンク・SC-02 新規登録への導線・注記を補う。',
    htmlTemplate: Now.include('./template.html'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    public: true,
    hasPreview: false,
    optionSchema: [
        {
            name: 'reset_page',
            label: 'パスワードリセット画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_reset',
        },
        {
            name: 'register_page',
            label: '仮登録画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_register',
        },
        {
            name: 'note',
            label: '注記',
            type: 'string',
            section: 'Presentation',
            defaultValue:
                '※SSOでのログインは前年度登録済み事業者が対象です。多要素認証（MFA）が設定されている場合は追加認証を求めます。',
        },
        {
            name: 'show_sso_note',
            label: 'SSO未設定時の案内を表示する',
            type: 'boolean',
            section: 'Presentation',
            defaultValue: 'true',
        },
        {
            name: 'sso_note',
            label: 'SSO未設定時の案内文',
            type: 'string',
            section: 'Presentation',
            defaultValue:
                'SSOログイン（Salesforce）は現在未設定です。Multi-Provider SSO に Salesforce を IdP として登録すると、ログインフォームに SSO ログインボタンが表示されます。',
        },
    ],
})
