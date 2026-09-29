import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * SC-00 トップ（未ログイン）画面 ヒーローエリア
 * キャッチコピー＋「ログイン」「新規登録」ボタン。
 * 未ログインユーザ（guest）が描画するため public: true が必須。
 */
export const topHeroWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_top_hero'],
    id: 'x_dent2_dentsusoke_top_hero',
    name: 'SKS トップ ヒーローエリア',
    description: 'SC-00 トップ（未ログイン）画面。サービス概要とログイン／新規登録への入口を提示する。',
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    public: true,
    hasPreview: true,
    optionSchema: [
        {
            name: 'hero_title',
            label: 'キャッチコピー',
            type: 'string',
            section: 'Presentation',
            defaultValue: '成長加速支援補助金の申請はこちらから',
        },
        {
            name: 'hero_lead',
            label: 'サービス説明',
            type: 'string',
            section: 'Presentation',
            defaultValue:
                '中小企業・個人事業主の売上拡大と事業継続コストの軽減を支援する補助金です。本ポータルから電子申請を受け付けます。',
        },
        {
            // TODO: SC-01 ログイン画面の実装後、そのページIDへ差し替える（現状は OOTB ログイン画面）
            name: 'login_page',
            label: 'ログイン画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'login',
        },
        {
            name: 'register_page',
            label: '仮登録画面のページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_register',
        },
        {
            name: 'mypage_page',
            label: 'マイページのページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_mypage',
        },
    ],
})
