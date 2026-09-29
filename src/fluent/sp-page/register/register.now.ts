import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { registerFormWidget } from '../../sp-widget/register-form/widget.now'

/**
 * SC-02 仮登録画面
 *
 * 画面設計書 ①レイアウト構成
 *   中央配置の仮登録カード（ログインID／メールアドレス入力、仮登録ボタン、補足メッセージ）
 * ④画面遷移  SC-00 → SC-02 →（案内メール受信）→ SC-03
 *
 * 権限（権限設計書 5. 画面アクセス制御）：アノニマス ○ ／ その他ロール ×
 * → public: true とし、roles は指定しない。
 *
 * ※ 本ページは SC-00 の「新規登録」ボタンの遷移先として先にプレースホルダで作成していたものを
 *   実画面へ差し替えたもの。pageId とレイアウトのキーは変更していない（同一レコードを更新する）。
 */
export const registerPage = SPPage({
    pageId: 'x_dent2_dentsusoke_register',
    title: '新規登録',
    shortDescription: 'SC-02 仮登録画面。未登録の事業者がログインID・メールアドレスを入力し仮登録を行う。',
    category: 'custom',
    public: true,
    draft: false,
    dynamicTitleStructure: '仮登録 - ${portal.title}',
    containers: [
        {
            $id: Now.ID['register_container'],
            name: '仮登録',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['register_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['register_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['register_inst'],
                                    widget: registerFormWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: 'ログインID／メールアドレス入力＋仮登録ボタン',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
