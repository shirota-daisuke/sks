import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { inquiryFormWidget } from '../../sp-widget/inquiry-form/widget.now'
import { applicantRole, applicantAdminRole } from '../../roles/roles.now'

/**
 * SC-10 問合せ一覧・作成画面
 *
 * 画面設計書 ①レイアウト構成
 *   左側に問合せ履歴テーブル、右側に新規問合せ入力フォーム（件名・本文・送信ボタン）を配置する
 * ④画面遷移  SC-05 → SC-10
 * ⑤表示条件  自身が起票した問合せのみを一覧表示する
 *
 * 権限（権限設計書 5. 画面アクセス制御）
 *   アノニマス × ／ applicant ○ ／ applicant_admin ○ ／ 事務局系 ×
 *
 * ※ 本ページはトップタブの遷移先としてプレースホルダで作成していたものを実画面へ差し替えたもの。
 *   pageId とレイアウトのキーは変更していない（同一レコードを更新する）。
 */
export const inquiriesPage = SPPage({
    pageId: 'x_dent2_dentsusoke_inquiries',
    title: '問合せ',
    shortDescription: 'SC-10 問合せ一覧・作成画面。問合せの新規作成と、自身の問合せ履歴・回答状況を確認する。',
    category: 'custom',
    public: false,
    draft: false,
    roles: [applicantRole, applicantAdminRole],
    dynamicTitleStructure: '問合せ - ${portal.title}',
    containers: [
        {
            $id: Now.ID['inquiries_container'],
            name: '問合せ',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['inquiries_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['inquiries_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['inquiries_inst'],
                                    widget: inquiryFormWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: '問合せ履歴／新規問合せ（処理No.46）／問合せ詳細・返信内容',
                                    widgetParameters: '{"max_records":30,"scope":"self"}',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
