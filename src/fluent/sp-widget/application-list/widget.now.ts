import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * SC-07 申請状況一覧・詳細
 * 上段に申請状況一覧（D1）、下段に選択した申請の詳細パネル（D2 ステータスチップ／D3 金額情報）を表示する。
 */
export const applicationListWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_app_list'],
    id: 'x_dent2_dentsusoke_app_list',
    name: 'SKS 申請状況一覧・詳細',
    description:
        'SC-07 申請状況一覧・詳細画面。自社の申請を一覧表示し、選択した申請のステータス（事業者用表記）と金額情報を表示する。',
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    hasPreview: true,
    optionSchema: [
        {
            name: 'max_records',
            label: '一覧の表示件数',
            type: 'integer',
            section: 'Data',
            defaultValue: 20,
        },
        {
            // 既定は申請の不備修正画面（ITCOM-05）。
            // URL に {sys_id} を含めると申請の sys_id に差し替える。
            // 空にするとボタンを出さず案内のみ表示する（ITCOM 側の画面へ差し替える場合に使う）。
            name: 'application_form_url',
            label: '不備修正画面のURL（{sys_id} を差し替え）',
            type: 'string',
            section: 'Behavior',
            defaultValue: '?id=x_dent2_dentsusoke_app_fix&sys_id={sys_id}',
        },
        {
            // TODO(A02): 取下げの実施可否・ボタン表示要否が未確定。既定は非表示。
            name: 'show_withdraw',
            label: '「取下げる」ボタンを表示する（A02 未決）',
            type: 'boolean',
            section: 'Behavior',
            defaultValue: 'false',
        },
        {
            name: 'note',
            label: '注記',
            type: 'string',
            section: 'Presentation',
            defaultValue:
                '※申請項目の内容・入力編集画面は「申請」機能（ITCOM主担当）側の画面設計書を参照してください。本画面は状況参照が中心です。',
        },
    ],
})
