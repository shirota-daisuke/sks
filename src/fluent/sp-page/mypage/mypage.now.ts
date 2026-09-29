import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { mypageSummaryWidget } from '../../sp-widget/mypage-summary/widget.now'
import { mypageNoticesWidget } from '../../sp-widget/mypage-notices/widget.now'
import { mypageApplicationsWidget } from '../../sp-widget/mypage-applications/widget.now'
import { applicantRole, applicantAdminRole } from '../../roles/roles.now'

/**
 * SC-05 マイページ（ポータルトップ）
 *
 * 画面設計書 ①画面イメージ「レイアウト構成」
 *   ヘッダー＋トップタブ（マイページ／申請／お知らせ／問合せ／自分の情報）の下に、
 *   サマリカード×3、最近のお知らせテーブル、申請状況テーブルを配置する。
 * トップタブはポータル共通メニュー（sp-instance-menu/menu.now.ts）で実装する。
 *
 * 権限（権限設計書 5. 画面アクセス制御）
 *   アノニマス × ／ applicant ○ ／ applicant_admin ○ ／ staff × ／ staff_admin × ／ system_admin ×
 */
export const mypage = SPPage({
    pageId: 'x_dent2_dentsusoke_mypage',
    title: 'マイページ',
    shortDescription: 'SC-05 マイページ（ポータルトップ）。お知らせ・申請状況・問合せ状況のサマリを表示する。',
    category: 'custom',
    public: false,
    draft: false,
    roles: [applicantRole, applicantAdminRole],
    dynamicTitleStructure: 'マイページ - ${portal.title}',
    containers: [
        {
            $id: Now.ID['mypage_container_main'],
            name: 'マイページ メイン',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                // 1段目：サマリカード×3
                {
                    $id: Now.ID['mypage_row_summary'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['mypage_col_summary'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['mypage_inst_summary'],
                                    widget: mypageSummaryWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: 'D1 申請ステータス／D2 未読のお知らせ／D3 未対応の問合せ',
                                    widgetParameters:
                                        '{"application_page":"x_dent2_dentsusoke_apps","notice_page":"x_dent2_dentsusoke_notices","inquiry_page":"x_dent2_dentsusoke_inquiries"}',
                                },
                            ],
                        },
                    ],
                },
                // 2段目：最近のお知らせ／申請状況
                {
                    $id: Now.ID['mypage_row_lists'],
                    order: 200,
                    columns: [
                        {
                            $id: Now.ID['mypage_col_notices'],
                            size: 6,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['mypage_inst_notices'],
                                    widget: mypageNoticesWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: 'D4 最近のお知らせ（最大3件）',
                                    widgetParameters:
                                        '{"max_records":3,"notice_page":"x_dent2_dentsusoke_notices","detail_page":"x_dent2_dentsusoke_notice"}',
                                },
                            ],
                        },
                        {
                            $id: Now.ID['mypage_col_apps'],
                            size: 6,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 200,
                            instances: [
                                {
                                    $id: Now.ID['mypage_inst_apps'],
                                    widget: mypageApplicationsWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: 'D5 申請状況',
                                    widgetParameters: '{"max_records":5,"application_page":"x_dent2_dentsusoke_apps"}',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
