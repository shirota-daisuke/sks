import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * 未実装画面（SC-06／SC-07／SC-08／SC-10）のプレースホルダ。
 * マイページのトップタブからの遷移先を成立させるために配置する。
 */
export const comingSoonWidget = SPWidget({
    $id: Now.ID['x_dent2_dentsusoke_coming_soon'],
    id: 'x_dent2_dentsusoke_coming_soon',
    name: 'SKS 準備中プレースホルダ',
    description: 'マイページのトップタブ遷移先のうち、本スライスで未実装の画面に配置するプレースホルダ。',
    htmlTemplate: Now.include('./template.html'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.scss'),
    // SC-02 仮登録画面のプレースホルダは未ログインで表示されるため public: true が必須
    public: true,
    hasPreview: false,
    optionSchema: [
        { name: 'screen_id', label: '画面ID', type: 'string', section: 'Presentation', defaultValue: '' },
        { name: 'screen_name', label: '画面名', type: 'string', section: 'Presentation', defaultValue: '画面' },
        { name: 'note', label: '補足', type: 'string', section: 'Presentation', defaultValue: '' },
        {
            name: 'home_page',
            label: 'マイページのページID',
            type: 'string',
            section: 'Behavior',
            defaultValue: 'x_dent2_dentsusoke_mypage',
        },
    ],
})
