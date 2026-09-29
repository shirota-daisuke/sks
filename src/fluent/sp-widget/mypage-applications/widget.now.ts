import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * SC-05 マイページ「申請状況」
 * 表示項目 D5（申請ID／現在のステータス（事業者用表記）／最終更新日）
 */
export const mypageApplicationsWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_mypage_apps'],
    id: 'x_dent2_dentsusoke_mypage_apps',
    name: 'SKS マイページ 申請状況',
    description: 'SC-05 マイページ。自社の申請を最終更新日の新しい順に表示する（事業者用ステータス表記）。',
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    hasPreview: true,
    optionSchema: [
        {
            name: 'max_records',
            label: '表示件数',
            type: 'integer',
            section: 'Data',
            defaultValue: 5,
        },
        {
            name: 'application_page',
            label: '申請状況一覧ページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_apps',
        },
    ],
})
