import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * SC-08 お知らせ一覧
 * 公開中のお知らせを一覧表示し、行クリックで既読化（処理No.43）して SC-09 詳細へ遷移する。
 */
export const noticeListWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_notice_list'],
    id: 'x_dent2_dentsusoke_notice_list',
    name: 'SKS お知らせ一覧',
    description:
        'SC-08 お知らせ一覧画面。公開範囲・公開期間に合致するお知らせを一覧表示し、既読／未読状態を管理する。',
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
            defaultValue: 50,
        },
        {
            // TODO(SC-08 ⑥確認事項): 並び替え要件が未確定。既定は公開日の降順。
            name: 'sort',
            label: '並び順',
            type: 'choice',
            section: 'Data',
            defaultValue: 'publish_date',
            choices: [
                { label: '公開日（新しい順）', value: 'publish_date' },
                { label: '重要度（高い順）', value: 'priority' },
            ],
        },
        {
            name: 'detail_page',
            label: 'お知らせ詳細画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_notice',
        },
    ],
})
