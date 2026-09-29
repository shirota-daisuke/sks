import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * SC-03 本登録画面 フォーム
 * 仮登録案内メールのトークン付きリンクから未ログイン状態で開くため public: true が必須。
 */
export const signupFormWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_signup_form'],
    id: 'x_dent2_dentsusoke_signup_form',
    name: 'SKS 本登録フォーム',
    description:
        'SC-03 本登録画面。仮登録トークンを検証し、本登録処理（処理No.3）・前年登録判定（処理No.4）・重複チェック（処理No.5）を実行してステータスを登録申請審査中へ遷移させる。',
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    public: true,
    hasPreview: true,
    optionSchema: [
        {
            name: 'top_page',
            label: 'トップ画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_top',
        },
        {
            name: 'register_page',
            label: '仮登録画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_register',
        },
    ],
})
