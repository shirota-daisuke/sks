import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * 登録不備修正フォーム（処理No.7 の事業者側）
 *
 * 不備確認依頼メールのトークン付きリンクから未ログイン状態で開くため public: true が必須。
 * この段階の申請者には applicant ロールが付与されていない（権限設計書 2章）。
 */
export const defectFixFormWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_defect_fix_form'],
    id: 'x_dent2_dentsusoke_defect_fix_form',
    name: 'SKS 登録不備修正フォーム',
    description:
        '登録不備対応（処理No.7）の申請者側。不備修正トークンを検証し、事務局が記載した不備内容を提示して修正内容を再提出させ、ステータスを登録不備修正中→登録申請審査中へ遷移させる。',
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
            name: 'inquiry_note',
            label: '問合せ先の案内文',
            type: 'string',
            section: 'Behavior',
            defaultValue:
                'ご不明な点がある場合は、お手数ですが事務局へお問い合わせください（ログイン後の問合せ画面はご利用いただけません）。',
        },
    ],
})
