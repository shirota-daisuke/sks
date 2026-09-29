import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * SC-06 自分の情報参照・変更画面 フォーム
 * 事業者情報（処理No.14）とアカウント情報（処理No.15）をカード単位で参照／編集する。
 */
export const profileFormWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_profile_form'],
    id: 'x_dent2_dentsusoke_profile_form',
    name: 'SKS 自分の情報',
    description:
        'SC-06 自分の情報参照・変更画面。事業者情報（事業者名・所在地・業種・従業員数）とアカウント情報（メールアドレス・ユーザID）を参照・変更する。',
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    hasPreview: true,
})
