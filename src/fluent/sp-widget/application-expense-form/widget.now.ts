import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * 対象経費の入力フォーム（ITCOM-02／処理No.18 対象経費登録）
 *
 * ログイン済みの事業者ユーザ（applicant ロール）向け。
 * ページ側でロールを必須にしているため public は指定しない。
 *
 * 明細は T03 申請の子（x_dent2_dentsusoke_exp_item）として保存し、
 * 合計は ApplicationExpenseUtil.recalcTotal が T03 の
 * u_total_expense_amount へ書き戻す（既存の画面・帳票が参照しているため）。
 */
export const applicationExpenseFormWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_expense_form'],
    id: 'x_dent2_dentsusoke_expense_form',
    name: 'SKS 対象経費入力フォーム',
    description:
        '対象経費明細の登録・更新・削除（処理No.18）と補助金額の試算表示（処理No.17）。専門家経費は専門家経費日額上限マスタで日額上限を検証する。合計は申請の対象経費合計金額へ書き戻す。',
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
            defaultValue: '対象経費の登録が終わったら「添付書類」へ進み、「内容確認・提出」で提出してください。',
        },
    ],
})
