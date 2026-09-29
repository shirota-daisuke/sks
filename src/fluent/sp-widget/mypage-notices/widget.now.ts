import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * SC-05 マイページ「最近のお知らせ」
 * 表示項目 D4（重要度／タイトル／公開日、最大3件）＋ 行クリックでの既読化（処理No.43）
 */
export const mypageNoticesWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_mypage_notices'],
    id: 'x_dent2_dentsusoke_mypage_notices',
    name: 'SKS マイページ 最近のお知らせ',
    description: 'SC-05 マイページ。公開中のお知らせを新しい順に表示し、クリックで既読化して詳細へ遷移する。',
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
            defaultValue: 3,
        },
        {
            name: 'notice_page',
            label: 'お知らせ一覧ページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_notices',
        },
        {
            name: 'detail_page',
            label: 'お知らせ詳細ページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_notice',
        },
    ],
})
