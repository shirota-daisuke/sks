import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * 添付書類の提出フォーム（ITCOM-03）
 *
 * ログイン済みの事業者ユーザ（applicant ロール）向け。
 * ページ側でロールを必須にしているため public は指定しない。
 *
 * 書類種別ごとの行（x_dent2_dentsusoke_req_doc）へ実ファイルを添付し、
 * 形式・サイズの検証と必須書類の充足チェックは
 * ApplicationDocumentUtil が担当する。
 */
export const applicationDocumentFormWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_document_form'],
    id: 'x_dent2_dentsusoke_document_form',
    name: 'SKS 添付書類提出フォーム',
    description:
        '申請の添付書類（ITCOM-03）。書類種別ごとにファイルをアップロード・差し替え・削除し、形式とサイズを検証して必須書類の充足状況を表示する。',
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    hasPreview: true,
    optionSchema: [
        {
            name: 'apply_page',
            label: '申請の入力画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_apply',
        },
        {
            name: 'expense_page',
            label: '対象経費の入力画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_apply_exp',
        },
        {
            name: 'confirm_page',
            label: '内容確認・提出画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_apply_conf',
        },
        {
            name: 'applications_page',
            label: '申請状況画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_apps',
        },
        {
            name: 'note',
            label: '画面下部の注記',
            type: 'string',
            section: 'Behavior',
            defaultValue: '必須書類がそろったら「内容確認・提出」へ進み、内容を確認して提出してください。',
        },
    ],
})
