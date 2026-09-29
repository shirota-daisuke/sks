import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { noticeDetailWidget } from '../../sp-widget/notice-detail/widget.now'
import { applicantRole, applicantAdminRole } from '../../roles/roles.now'

/**
 * SC-09 お知らせ詳細画面
 *
 * 画面設計書 ①レイアウト構成
 *   タイトル、重要度チップ、公開日、本文カード、「一覧へ戻る」ボタンを縦に配置する
 * ④画面遷移  SC-08 ⇄ SC-09（マイページ SC-05 からも遷移する）
 *
 * 権限（権限設計書 5. 画面アクセス制御）
 *   アノニマス × ／ applicant ○ ／ applicant_admin ○ ／ 事務局系 ×
 *
 * ※ 本ページは SC-08 の遷移先としてプレースホルダで作成していたものを実画面へ差し替えたもの。
 *   pageId とレイアウトのキーは変更していない（同一レコードを更新する）。
 */
export const noticeDetailPage = SPPage({
    pageId: 'x_dent2_dentsusoke_notice',
    title: 'お知らせ詳細',
    shortDescription: 'SC-09 お知らせ詳細画面。お知らせの本文・重要度・公開期間等の詳細を表示する。',
    category: 'custom',
    public: false,
    draft: false,
    roles: [applicantRole, applicantAdminRole],
    dynamicTitleStructure: 'お知らせ - ${portal.title}',
    containers: [
        {
            $id: Now.ID['notice_detail_container'],
            name: 'お知らせ詳細',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['notice_detail_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['notice_detail_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['notice_detail_inst'],
                                    widget: noticeDetailWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: 'D1 タイトル／重要度／公開日、D2 本文',
                                    widgetParameters:
                                        '{"list_page":"x_dent2_dentsusoke_notices","mark_read_on_view":"false"}',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
