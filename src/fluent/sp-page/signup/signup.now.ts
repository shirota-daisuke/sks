import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { signupFormWidget } from '../../sp-widget/signup-form/widget.now'

/**
 * SC-03 本登録画面
 *
 * 画面設計書 ①レイアウト構成
 *   中央配置の本登録カード（事業者名、パスワード、パスワード確認、法人番号／本人識別情報、
 *   利用規約同意チェック、本登録完了ボタン）
 * ④画面遷移  SC-02（メール受信）→ SC-03 → 事務局審査（SC-11）へ
 *
 * 権限（権限設計書 6. アクション実行権限 SC-03）
 *   整理後ロールは「（未認証／仮登録トークン）」。仮登録案内メールのリンクに含まれる一時トークンで
 *   アクセスするため public: true とし、roles は指定しない。トークン検証はウィジェット側で行う。
 *
 * ※ 本ページは仮登録（SC-02）の案内メールのリンク先としてプレースホルダで作成していたものを
 *   実画面へ差し替えたもの。pageId とレイアウトのキーは変更していない（同一レコードを更新する）。
 */
export const signupPage = SPPage({
    pageId: 'x_dent2_dentsusoke_signup',
    title: '本登録',
    shortDescription: 'SC-03 本登録画面。仮登録案内メールのリンクから本登録情報を入力・確定する。',
    category: 'custom',
    public: true,
    draft: false,
    dynamicTitleStructure: '本登録 - ${portal.title}',
    containers: [
        {
            $id: Now.ID['signup_container'],
            name: '本登録',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['signup_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['signup_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['signup_inst'],
                                    widget: signupFormWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: '本登録情報入力＋本登録完了ボタン（処理No.3／No.4／No.5）',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
