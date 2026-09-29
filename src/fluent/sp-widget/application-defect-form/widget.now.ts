import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * 申請の不備修正フォーム（ITCOM-05）
 *
 * ログイン済みの事業者ユーザ（applicant ロール）向け。
 * ページ側でロールを必須にしているため public は指定しない。
 *
 * ユーザ登録の不備修正（SC-11 の事業者側／defect-fix-form）とは別物。
 * こちらは申請（T03 の u_application_status）を対象とし、
 * 事業者がログインした状態で行うためトークンは使わない。
 */
export const applicationDefectFormWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_app_defect_form'],
    id: 'x_dent2_dentsusoke_app_defect_form',
    name: 'SKS 申請不備修正フォーム',
    description:
        '申請の不備修正（ITCOM-05）。事務局の指摘内容と回答期限を表示し、対象経費・添付書類の修正状況を確認して、修正内容の説明とともに再提出する（不備修正回答あり）。',
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    hasPreview: true,
    optionSchema: [
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
            name: 'applications_page',
            label: '申請状況画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_apps',
        },
        {
            name: 'inquiries_page',
            label: '問合せ画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_inquiries',
        },
        {
            name: 'note',
            label: '画面下部の注記',
            type: 'string',
            section: 'Behavior',
            defaultValue:
                '基本情報（組織形態・従業員数区分・売上増加率）は本画面では変更できません。変更が必要な場合は事務局へお問い合わせください。',
        },
    ],
})
