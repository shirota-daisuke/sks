import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * SC-05 マイページ サマリカード
 * 表示項目 D1 申請ステータス／D2 未読のお知らせ件数／D3 未対応の問合せ件数
 */
export const mypageSummaryWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_mypage_summary'],
    id: 'x_dent2_dentsusoke_mypage_summary',
    name: 'SKS マイページ サマリカード',
    description: 'SC-05 マイページ。申請ステータス・未読のお知らせ件数・未対応の問合せ件数を表示する。',
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    hasPreview: true,
    optionSchema: [
        {
            name: 'application_page',
            label: '申請状況ページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_apps',
        },
        {
            name: 'notice_page',
            label: 'お知らせページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_notices',
        },
        {
            name: 'inquiry_page',
            label: '問合せページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_inquiries',
        },
    ],
})
