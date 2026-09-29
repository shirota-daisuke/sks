import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { applicationConfirmFormWidget } from '../../sp-widget/application-confirm-form/widget.now'
import { applicantRole, applicantAdminRole } from '../../roles/roles.now'

/**
 * 申請の内容確認・提出画面（画面イメージ ITCOM-04）
 *
 * ①レイアウト構成
 *   左に確認内容（事業者情報・申請区分・対象経費・添付書類・同意事項）、
 *   右に補助金額の試算と提出後の流れ。提出成功後は完了表示へ切り替える。
 * ③アクション  申請を提出する
 * ④画面遷移    添付書類（x_dent2_dentsusoke_apply_doc）→ 本画面 → 申請状況（x_dent2_dentsusoke_apps）
 * ⑥ステータス  申請入力中（input）→ 受付済（accepted）
 *
 * 権限
 *   applicant ○ ／ applicant_admin ○ ／ 未認証・事務局系 ×
 *
 * ■ 提出の入口は本画面に限る
 * 提出のボタンを各入力画面に置くと、未入力のまま提出される経路が複数できてしまう。
 * 基本情報（ITCOM-01）からは本画面へ進む導線のみを置いている。
 *
 * ■ スコープについて
 * 申請機能は ITCOM 主担当の範囲であり、本アプリの設計対象外。
 * 画面イメージ ITCOM-04 の実装として追加している。
 *
 * TODO(要レビュー): 画面設計書に対応する画面番号が無い。ITCOM-01〜09 とあわせて追番が必要。
 * TODO(要確認): 同意事項の文面が未確定。ウィジェットのオプションで差し替えられるようにしている。
 * TODO(IF-07): 申請受付メールの要否・テンプレートが未確定のため送信していない。
 */
export const applyConfirmPage = SPPage({
    pageId: 'x_dent2_dentsusoke_apply_conf',
    title: '申請内容の確認・提出',
    shortDescription:
        '申請の内容確認・提出画面（ITCOM-04）。入力内容をひとまとめに確認し、同意のうえ提出して申請番号を採番する。',
    category: 'custom',
    public: false,
    draft: false,
    roles: [applicantRole, applicantAdminRole],
    dynamicTitleStructure: '申請内容の確認・提出 - ${portal.title}',
    containers: [
        {
            $id: Now.ID['apply_conf_container'],
            name: '申請内容の確認・提出',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['apply_conf_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['apply_conf_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['apply_conf_inst'],
                                    widget: applicationConfirmFormWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: '申請内容の確認と提出（ITCOM-04）',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
