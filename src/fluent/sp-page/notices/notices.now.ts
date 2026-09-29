import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { noticeListWidget } from '../../sp-widget/notice-list/widget.now'
import { applicantRole, applicantAdminRole } from '../../roles/roles.now'

/**
 * SC-08 お知らせ一覧画面
 *
 * 画面設計書 ①レイアウト構成
 *   お知らせ一覧テーブル（状態／重要度／タイトル／公開日）を1画面に表示する
 * ④画面遷移  SC-05／SC-08 → SC-09
 * ⑤表示条件  自身の事業者区分に応じた公開範囲設定（処理No.40）に合致するお知らせのみ表示する
 *
 * 権限（権限設計書 5. 画面アクセス制御）
 *   アノニマス × ／ applicant ○ ／ applicant_admin ○ ／ 事務局系 ×
 *
 * ※ 本ページはトップタブの遷移先としてプレースホルダで作成していたものを実画面へ差し替えたもの。
 *   pageId とレイアウトのキーは変更していない（同一レコードを更新する）。
 */
export const noticesPage = SPPage({
    pageId: 'x_dent2_dentsusoke_notices',
    title: 'お知らせ',
    shortDescription: 'SC-08 お知らせ一覧画面。配信されたお知らせを一覧表示し、既読／未読状態を管理する。',
    category: 'custom',
    public: false,
    draft: false,
    roles: [applicantRole, applicantAdminRole],
    dynamicTitleStructure: 'お知らせ - ${portal.title}',
    containers: [
        {
            $id: Now.ID['notices_container'],
            name: 'お知らせ一覧',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['notices_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['notices_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['notices_inst'],
                                    widget: noticeListWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: 'D1 お知らせ一覧（状態／重要度／タイトル／公開日）',
                                    widgetParameters:
                                        '{"max_records":50,"sort":"publish_date","detail_page":"x_dent2_dentsusoke_notice"}',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
