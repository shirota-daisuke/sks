import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * 申請の内容確認・提出フォーム（ITCOM-04）
 *
 * ログイン済みの事業者ユーザ（applicant ロール）向け。
 * ページ側でロールを必須にしているため public は指定しない。
 *
 * 基本情報（ITCOM-01）・対象経費（ITCOM-02）・添付書類（ITCOM-03）で入力した内容を
 * ひとまとめに表示し、本画面でのみ提出できる。
 * 提出の処理は ApplicationSubmitUtil.submit()（申請番号の採番・金額判定・
 * 申請入力中から受付済への遷移）を使用する。
 */
export const applicationConfirmFormWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_confirm_form'],
    id: 'x_dent2_dentsusoke_confirm_form',
    name: 'SKS 申請内容確認・提出フォーム',
    description:
        '申請の内容確認・提出（ITCOM-04）。基本情報・対象経費・添付書類をひとまとめに表示し、不足項目を示した上で提出する。提出時に申請番号を採番し、申請入力中から受付済へ遷移させる。',
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
            name: 'profile_page',
            label: '自分の情報画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_profile',
        },
        /**
         * 同意事項の文面は未確定（公募要領の遵守・虚偽申請時の取消等）。
         * 確定後にコードを修正せず差し替えられるようオプションで持つ。
         */
        {
            name: 'consent_1',
            label: '同意事項1',
            type: 'string',
            section: 'Behavior',
            defaultValue: '記載内容および提出書類に虚偽がないことを確認しました。',
        },
        {
            name: 'consent_2',
            label: '同意事項2',
            type: 'string',
            section: 'Behavior',
            defaultValue: '公募要領の内容を確認し、これに従うことに同意します。',
        },
        {
            name: 'note',
            label: '画面下部の注記',
            type: 'string',
            section: 'Behavior',
            defaultValue:
                '受付内容のメール通知は要否が未確定のため送信していません（IF-07）。審査状況は「申請」画面でご確認いただけます。',
        },
    ],
})
