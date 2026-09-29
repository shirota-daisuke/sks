import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { applicationListWidget } from '../../sp-widget/application-list/widget.now'
import { applicantRole, applicantAdminRole } from '../../roles/roles.now'

/**
 * SC-07 申請状況一覧・詳細画面
 *
 * 画面設計書 ①レイアウト構成
 *   上段に申請状況一覧テーブル、下段に選択した申請の詳細パネル
 *   （ステータスチップ・金額情報・注記）を配置する
 * ④画面遷移  SC-05 → SC-07
 * ⑤表示条件  自身が申請した申請のみを一覧表示する
 *
 * 権限（権限設計書 5. 画面アクセス制御）
 *   アノニマス × ／ applicant ○ ／ applicant_admin ○ ／ 事務局系 ×
 *
 * 申請入力フォーム自体は ITCOM 主担当（申請機能）の設計範囲であり、本画面は状況参照が中心。
 *
 * ※ 本ページはトップタブの遷移先としてプレースホルダで作成していたものを実画面へ差し替えたもの。
 *   pageId とレイアウトのキーは変更していない（同一レコードを更新する）。
 */
export const applicationsPage = SPPage({
    pageId: 'x_dent2_dentsusoke_apps',
    title: '申請',
    shortDescription: 'SC-07 申請状況一覧・詳細画面。自身の申請ステータスを一覧・詳細で確認する。',
    category: 'custom',
    public: false,
    draft: false,
    roles: [applicantRole, applicantAdminRole],
    dynamicTitleStructure: '申請状況 - ${portal.title}',
    containers: [
        {
            $id: Now.ID['apps_container'],
            name: '申請状況',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['apps_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['apps_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['apps_inst'],
                                    widget: applicationListWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: 'D1 申請状況一覧／D2 ステータスチップ／D3 金額情報',
                                    widgetParameters: '{"max_records":20,"show_withdraw":"false"}',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
