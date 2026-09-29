import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { passwordResetFormWidget } from '../../sp-widget/password-reset-form/widget.now'

/**
 * SC-04 パスワードリセット画面
 *
 * 画面設計書 ①レイアウト構成
 *   STEP1（メールアドレス入力・送信）と STEP2（新パスワード設定）を1カード内に区切り線で分けて配置する
 * ④画面遷移  SC-01 → SC-04(STEP1) →（メール受信）→ SC-04(STEP2) → SC-01
 * ⑤表示条件  STEP2 はメール内の再設定用リンクを経由してアクセスした場合のみ表示する
 *
 * 権限（権限設計書 5. 画面アクセス制御）
 *   アノニマス ○（未認証／トークン）／applicant ○／applicant_admin ○／事務局系 ×
 *   → パスワードを忘れた未ログイン状態で利用するため public: true とし、roles は指定しない。
 *
 * 本画面への入口（「パスワードをお忘れですか？」リンク）は SC-01 ログイン画面にある
 * （sp-widget/login-links）。
 */
export const resetPage = SPPage({
    pageId: 'x_dent2_dentsusoke_reset',
    title: 'パスワードリセット',
    shortDescription: 'SC-04 パスワードリセット画面。再設定メールの送信と新パスワードの設定を行う。',
    category: 'custom',
    public: true,
    draft: false,
    dynamicTitleStructure: 'パスワードリセット - ${portal.title}',
    containers: [
        {
            $id: Now.ID['reset_container'],
            name: 'パスワードリセット',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['reset_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['reset_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['reset_inst'],
                                    widget: passwordResetFormWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: 'STEP1 再設定メール送信／STEP2 新パスワード設定（処理No.11）',
                                    // ④画面遷移：パスワード更新後は SC-01 ログイン画面へ遷移する
                                    widgetParameters: '{"login_page":"x_dent2_dentsusoke_login"}',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
