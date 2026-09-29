import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * SC-00 トップ（未ログイン）画面 案内カード×3（対象者／申請方法／審査の流れ）
 * 未ログインユーザ（guest）が描画するため public: true が必須。
 */
export const topInfoCardsWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_top_cards'],
    id: 'x_dent2_dentsusoke_top_cards',
    name: 'SKS トップ 案内カード',
    description: 'SC-00 トップ（未ログイン）画面。対象者・申請方法・審査の流れを3枚のカードで案内する。',
    htmlTemplate: Now.include('./template.html'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    public: true,
    hasPreview: true,
    optionSchema: [
        { name: 'card1_title', label: 'カード1 見出し', type: 'string', section: 'Presentation', defaultValue: '対象者' },
        {
            name: 'card1_body',
            label: 'カード1 本文',
            type: 'string',
            section: 'Presentation',
            defaultValue: '前年度登録済／未登録いずれの事業者も申請可能',
        },
        { name: 'card2_title', label: 'カード2 見出し', type: 'string', section: 'Presentation', defaultValue: '申請方法' },
        {
            name: 'card2_body',
            label: 'カード2 本文',
            type: 'string',
            section: 'Presentation',
            defaultValue: '電子申請（本ポータルより申請）',
        },
        {
            name: 'card3_title',
            label: 'カード3 見出し',
            type: 'string',
            section: 'Presentation',
            defaultValue: '審査の流れ',
        },
        {
            name: 'card3_body',
            label: 'カード3 本文',
            type: 'string',
            section: 'Presentation',
            defaultValue: '事務局1次審査 → 外部審査員による信用調査',
        },
    ],
})
