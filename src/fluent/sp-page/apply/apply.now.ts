import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { applicationFormWidget } from '../../sp-widget/application-form/widget.now'
import { applicantRole, applicantAdminRole } from '../../roles/roles.now'

/**
 * 申請入力・提出画面
 *
 * ①レイアウト構成
 *   左に入力フォーム（組織形態・従業員数区分・売上増加率対象月・売上増加率・
 *   特例措置・対象経費合計金額）、右に補助金額の試算パネルを配置する。
 * ③アクション  入力内容を保存／補助金額を試算／申請を提出
 * ④画面遷移    マイページ → 本画面 → SC-07 申請状況一覧
 *
 * 権限
 *   applicant ○ ／ applicant_admin ○ ／ 未認証・事務局系 ×
 *   ACL 側でも自社かつ申請入力中の申請のみ作成・更新できるよう制限している
 *   （src/fluent/acls/portal-acls.now.ts の acl_request_create_applicant／acl_request_write_applicant）。
 *
 * ■ スコープについて
 * 申請機能（申請情報入力：処理No.16／補助金額自動判定：処理No.17）は ITCOM 主担当の範囲であり、
 * 本アプリは T03 申請を参照するだけの想定だった。
 * 事業者が申請を提出する経路が存在しなかったため、依頼により最小限の画面として追加している。
 *
 * TODO(要レビュー): 画面設計書に対応する画面番号が無い（SC-07 は申請状況の参照）。
 *   ITCOM 側の申請入力機能が確定した時点で、本画面を置き換えるか項目構成をそろえる必要がある。
 * TODO(要確認): 経費明細の登録（処理No.18）は T03 に明細テーブルが無いため実装していない。
 *   対象経費は合計金額のみを受け取っている。
 */
export const applyPage = SPPage({
    pageId: 'x_dent2_dentsusoke_apply',
    title: '申請の入力',
    shortDescription:
        '申請入力・提出画面。申請内容を入力して補助金額を試算し、申請を提出する（処理No.16／No.17）。',
    category: 'custom',
    public: false,
    draft: false,
    roles: [applicantRole, applicantAdminRole],
    dynamicTitleStructure: '申請の入力 - ${portal.title}',
    containers: [
        {
            $id: Now.ID['apply_container'],
            name: '申請の入力',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['apply_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['apply_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['apply_inst'],
                                    widget: applicationFormWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: '申請入力フォーム＋補助金額の試算（処理No.16／No.17）',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
