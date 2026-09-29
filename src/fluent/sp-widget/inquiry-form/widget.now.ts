import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * SC-10 問合せ一覧・作成
 * 左に問合せ履歴、右に新規問合せフォーム（行クリック時は問合せ詳細・返信内容）を表示する。
 */
export const inquiryFormWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_inquiry_form'],
    id: 'x_dent2_dentsusoke_inquiry_form',
    name: 'SKS 問合せ一覧・作成',
    description:
        'SC-10 問合せ一覧・作成画面。問合せの新規作成（処理No.46）と、自身が起票した問合せの履歴・回答状況を表示する。',
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    hasPreview: true,
    optionSchema: [
        {
            name: 'max_records',
            label: '履歴の表示件数',
            type: 'integer',
            section: 'Data',
            defaultValue: 30,
        },
        {
            // ⑤表示条件は「自身が起票した問合せのみ」。
            // TODO(Q05): 1事業者に複数ユーザーを認める場合の参照範囲が未確定のため切り替え可能にしている。
            name: 'scope',
            label: '参照範囲',
            type: 'choice',
            section: 'Data',
            defaultValue: 'self',
            choices: [
                { label: '自身が起票した問合せのみ', value: 'self' },
                { label: '同一事業者の問合せ（Q05 未決）', value: 'entity' },
            ],
        },
    ],
})
