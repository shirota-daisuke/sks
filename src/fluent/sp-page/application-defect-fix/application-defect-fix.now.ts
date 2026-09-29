import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { applicationDefectFormWidget } from '../../sp-widget/application-defect-form/widget.now'
import { applicantRole, applicantAdminRole } from '../../roles/roles.now'

/**
 * 申請の不備修正画面（画面イメージ ITCOM-05）
 *
 * ①レイアウト構成
 *   左に事務局の指摘・対象経費・添付書類・回答の入力、
 *   右に補助金額の試算とこれまでの経過。再提出後は完了表示へ切り替える。
 * ③アクション  一時保存／修正内容を提出する
 * ④画面遷移    申請状況（SC-07）の「不備を修正する」→ 本画面
 *               → 対象経費（ITCOM-02）／添付書類（ITCOM-03）で修正 → 本画面で再提出
 * ⑥ステータス  不備確認依頼（defect_request）→ 不備修正中（defect_fixing）
 *               → 不備修正回答あり（defect_answered）
 *
 * 権限
 *   applicant ○ ／ applicant_admin ○ ／ 未認証・事務局系 ×
 *   対象は自社かつ不備対応中の申請に限る（ApplicationDefectUtil.find）。
 *   申請の更新は ACL で自社かつ申請入力中／不備確認依頼／不備修正中に限定している
 *   （src/fluent/acls/portal-acls.now.ts）。
 *
 * ■ ユーザ登録の不備修正（x_dent2_dentsusoke_defect_fix）とは別画面
 * ユーザ登録の不備対応は本登録前でロールが無いためトークン付きリンクで開く public ページ。
 * 本画面は申請の不備対応であり、事業者はログインできるため通常のページとする。
 *
 * ■ スコープについて
 * 申請機能は ITCOM 主担当の範囲であり、本アプリの設計対象外。
 * 画面イメージ ITCOM-05 の実装として追加している。
 *
 * TODO(要レビュー): 画面設計書に対応する画面番号が無い。ITCOM-01〜09 とあわせて追番が必要。
 * TODO(要確認): 指摘の単位（自由記述か項目単位か）と修正できる範囲が未確定。
 * TODO(要確認): 回答期限の超過時の扱いが未確定。現状は警告のみで再提出を受け付ける。
 */
export const applicationDefectFixPage = SPPage({
    pageId: 'x_dent2_dentsusoke_app_fix',
    title: '申請の不備修正',
    shortDescription:
        '申請の不備修正画面（ITCOM-05）。事務局の指摘に対して対象経費・添付書類を修正し、修正内容の説明とともに再提出する。',
    category: 'custom',
    public: false,
    draft: false,
    roles: [applicantRole, applicantAdminRole],
    dynamicTitleStructure: '申請の不備修正 - ${portal.title}',
    containers: [
        {
            $id: Now.ID['app_fix_container'],
            name: '申請の不備修正',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['app_fix_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['app_fix_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['app_fix_inst'],
                                    widget: applicationDefectFormWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: '申請の不備修正と再提出（ITCOM-05）',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
