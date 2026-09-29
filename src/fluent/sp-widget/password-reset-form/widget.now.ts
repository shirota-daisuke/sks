import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * SC-04 パスワードリセット画面 フォーム
 * 未ログイン（パスワードを忘れた状態）でアクセスするため public: true が必須。
 */
export const passwordResetFormWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_reset_form'],
    id: 'x_dent2_dentsusoke_reset_form',
    name: 'SKS パスワードリセットフォーム',
    description:
        'SC-04 パスワードリセット画面。STEP1 で再設定メールを送信し、STEP2 でトークン検証のうえ新パスワードを設定する（処理No.11）。',
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    public: true,
    hasPreview: true,
    optionSchema: [
        {
            // TODO: SC-01 ログイン画面の実装後、そのページIDへ差し替える（現状は OOTB ログイン画面）
            name: 'login_page',
            label: 'ログイン画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'login',
        },
        {
            // TODO(SC-04 確認事項): 再設定用リンクの有効期限が未確定。暫定24時間。
            name: 'token_valid_hours',
            label: '再設定用リンク有効時間（時間）',
            type: 'integer',
            section: 'Behavior',
            defaultValue: 24,
        },
    ],
})
