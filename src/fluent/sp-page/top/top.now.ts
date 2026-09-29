import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { topHeroWidget } from '../../sp-widget/top-hero/widget.now'
import { topInfoCardsWidget } from '../../sp-widget/top-info-cards/widget.now'

/**
 * SC-00 トップ（未ログイン）画面
 *
 * 画面設計書 ①画面イメージ「レイアウト構成」
 *   ヘッダー（システム名・「ログイン」リンク）… ポータル共通ヘッダー（OOTB Stock Header）が担当
 *   ヒーローエリア（キャッチコピー＋「ログイン」「新規登録」ボタン）
 *   案内カード×3（対象者／申請方法／審査の流れ）
 *
 * ④画面遷移  SC-00 → SC-01（ログイン）／ SC-00 → SC-02（新規登録）
 * ⑤表示条件  ログイン済み（事業者ユーザ）でアクセスした場合は SC-05 マイページへ自動遷移（ヒーローウィジェットで実装）
 *
 * 権限（権限設計書 5. 画面アクセス制御）：アノニマス ○ ／ その他ロール ×
 * → public: true とし、roles は指定しない（未認証でアクセスできる必要がある）
 */
export const topPage = SPPage({
    pageId: 'x_dent2_dentsusoke_top',
    title: 'トップ',
    shortDescription: 'SC-00 トップ（未ログイン）画面。サービス概要とログイン／新規登録への入口を提示する。',
    category: 'custom',
    public: true,
    draft: false,
    dynamicTitleStructure: '${portal.title}',
    containers: [
        {
            $id: Now.ID['top_container_main'],
            name: 'トップ メイン',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                // 1段目：ヒーローエリア
                {
                    $id: Now.ID['top_row_hero'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['top_col_hero'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['top_inst_hero'],
                                    widget: topHeroWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: 'キャッチコピー＋ログイン／新規登録ボタン',
                                    widgetParameters:
                                        '{"login_page":"x_dent2_dentsusoke_login","register_page":"x_dent2_dentsusoke_register","mypage_page":"x_dent2_dentsusoke_mypage"}',
                                },
                            ],
                        },
                    ],
                },
                // 2段目：案内カード×3
                {
                    $id: Now.ID['top_row_cards'],
                    order: 200,
                    columns: [
                        {
                            $id: Now.ID['top_col_cards'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['top_inst_cards'],
                                    widget: topInfoCardsWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: '対象者／申請方法／審査の流れ',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
