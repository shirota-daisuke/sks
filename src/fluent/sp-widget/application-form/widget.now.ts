import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * 申請入力：基本情報フォーム（ITCOM-01／処理No.16・No.17）
 *
 * ログイン済みの事業者ユーザ（applicant ロール）向け。
 * ページ側でロールを必須にしているため public は指定しない。
 *
 * 対象経費（ITCOM-02）・添付書類（ITCOM-03）・内容確認と提出（ITCOM-04）は
 * それぞれ別画面で行う。本画面は基本情報の入力と保存、次のステップへの導線を担う。
 */
export const applicationFormWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_application_form'],
    id: 'x_dent2_dentsusoke_application_form',
    name: 'SKS 申請入力フォーム',
    description:
        '申請の基本情報の入力・下書き保存（処理No.16）と補助金額自動判定の試算表示（処理No.17）。提出は内容確認・提出（ITCOM-04）で行う。',
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    hasPreview: true,
    optionSchema: [
        {
            name: 'applications_page',
            label: '申請状況画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_apps',
        },
        {
            name: 'expense_page',
            label: '対象経費の入力画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_apply_exp',
        },
        {
            name: 'document_page',
            label: '添付書類の提出画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_apply_doc',
        },
        {
            name: 'confirm_page',
            label: '内容確認・提出画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_apply_conf',
        },
        {
            name: 'note',
            label: '画面下部の注記',
            type: 'string',
            section: 'Behavior',
            defaultValue:
                '対象経費は「対象経費の入力」画面で明細として登録します。合計金額は明細から自動計算されます。添付書類は「添付書類の提出」画面で提出し、提出は「内容確認・提出」画面から行います。',
        },
    ],
})
