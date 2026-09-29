import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { applicationExpenseFormWidget } from '../../sp-widget/application-expense-form/widget.now'
import { applicantRole, applicantAdminRole } from '../../roles/roles.now'

/**
 * 対象経費の入力画面（画面イメージ ITCOM-02）
 *
 * ①レイアウト構成
 *   左に明細一覧＋1行ぶんの入力フォーム、右に補助金額の試算パネルと日額上限の一覧。
 * ③アクション  明細を追加／明細を更新／削除
 * ④画面遷移    申請の入力（x_dent2_dentsusoke_apply）→ 本画面 → 申請の入力（提出）
 *
 * 権限
 *   applicant ○ ／ applicant_admin ○ ／ 未認証・事務局系 ×
 *   明細の ACL は自社かつ申請入力中／不備修正中に限定している
 *   （src/fluent/acls/application-acls.now.ts）。
 *
 * ■ スコープについて
 * 申請機能（処理No.18 対象経費登録）は ITCOM 主担当の範囲であり、本アプリの設計対象外。
 * 画面イメージ ITCOM-02 の実装として追加している。
 *
 * TODO(要レビュー): 画面設計書に対応する画面番号が無い。ITCOM-01〜09 とあわせて追番が必要。
 * TODO(要確認): 画面イメージは4ステップ構成だが、添付書類（ITCOM-03）と
 *   内容確認・提出（ITCOM-04）は未実装のため、ステップ表示は2つに限っている。
 */
export const applyExpensePage = SPPage({
    pageId: 'x_dent2_dentsusoke_apply_exp',
    title: '対象経費の入力',
    shortDescription:
        '対象経費の入力画面（ITCOM-02）。経費明細を区分ごとに登録し、日額上限を検証して補助金額を試算する（処理No.18／No.17）。',
    category: 'custom',
    public: false,
    draft: false,
    roles: [applicantRole, applicantAdminRole],
    dynamicTitleStructure: '対象経費の入力 - ${portal.title}',
    containers: [
        {
            $id: Now.ID['apply_exp_container'],
            name: '対象経費の入力',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['apply_exp_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['apply_exp_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['apply_exp_inst'],
                                    widget: applicationExpenseFormWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: '対象経費明細の登録＋補助金額の試算（処理No.18／No.17）',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
