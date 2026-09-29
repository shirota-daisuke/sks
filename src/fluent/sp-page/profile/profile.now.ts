import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { profileFormWidget } from '../../sp-widget/profile-form/widget.now'
import { applicantRole, applicantAdminRole } from '../../roles/roles.now'

/**
 * SC-06 自分の情報参照・変更画面
 *
 * 画面設計書 ①レイアウト構成
 *   「事業者情報」カードと「アカウント情報」カードを左右に並べ、
 *   各カードに参照用フィールドと「編集する」ボタンを配置する
 * ④画面遷移  SC-05 ⇄ SC-06（トップタブで遷移）
 *
 * 権限（権限設計書 5. 画面アクセス制御）
 *   アノニマス × ／ applicant ○ ／ applicant_admin ○ ／ 事務局系 ×
 *
 * ※ 本ページはトップタブの遷移先としてプレースホルダで作成していたものを実画面へ差し替えたもの。
 *   pageId とレイアウトのキーは変更していない（同一レコードを更新する）。
 */
export const profilePage = SPPage({
    pageId: 'x_dent2_dentsusoke_profile',
    title: '自分の情報',
    shortDescription: 'SC-06 自分の情報参照・変更画面。事業者情報とアカウント情報の確認・変更を行う。',
    category: 'custom',
    public: false,
    draft: false,
    roles: [applicantRole, applicantAdminRole],
    dynamicTitleStructure: '自分の情報 - ${portal.title}',
    containers: [
        {
            $id: Now.ID['profile_container'],
            name: '自分の情報',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['profile_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['profile_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['profile_inst'],
                                    widget: profileFormWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: '事業者情報（処理No.14）／アカウント情報（処理No.15）の参照・編集',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
