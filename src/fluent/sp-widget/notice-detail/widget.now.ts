import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * SC-09 お知らせ詳細
 * URL パラメータ sys_id のお知らせについて、タイトル・重要度・公開日・本文を表示する。
 */
export const noticeDetailWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_notice_detail'],
    id: 'x_dent2_dentsusoke_notice_detail',
    name: 'SKS お知らせ詳細',
    description:
        'SC-09 お知らせ詳細画面。公開範囲・公開期間に合致するお知らせの本文・重要度・公開期間を表示する。',
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    hasPreview: true,
    optionSchema: [
        {
            name: 'list_page',
            label: 'お知らせ一覧ページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_notices',
        },
        {
            // TODO(SC-09 ⑥確認事項): 既読化のタイミングが未確定。
            // 既定は無効（SC-08 一覧のクリック時に既読化する現行方針）。
            name: 'mark_read_on_view',
            label: '詳細画面の表示時に既読化する（⑥未確定）',
            type: 'boolean',
            section: 'Behavior',
            defaultValue: 'false',
        },
        {
            // 画面イメージ SC-09 では重要度「高」を「重要」と表記している
            name: 'high_priority_label',
            label: '重要度「高」の表記',
            type: 'string',
            section: 'Presentation',
            defaultValue: '重要',
        },
    ],
})
