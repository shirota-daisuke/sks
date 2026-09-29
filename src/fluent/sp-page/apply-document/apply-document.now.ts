import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { applicationDocumentFormWidget } from '../../sp-widget/application-document-form/widget.now'
import { applicantRole, applicantAdminRole } from '../../roles/roles.now'

/**
 * 添付書類の提出画面（画面イメージ ITCOM-03）
 *
 * ①レイアウト構成
 *   左に書類種別ごとの提出状況の一覧、右に必須書類の充足状況とファイルの条件。
 * ③アクション  ファイルを選択／差し替え／削除
 * ④画面遷移    対象経費の入力（x_dent2_dentsusoke_apply_exp）→ 本画面 → 申請の入力（提出）
 *
 * 権限
 *   applicant ○ ／ applicant_admin ○ ／ 未認証・事務局系 ×
 *   提出書類の行の ACL は自社かつ申請入力中／不備修正中に限定している
 *   （src/fluent/acls/application-acls.now.ts）。
 *   添付ファイル（sys_attachment）の権限は添付先レコードの参照／更新権限に従う。
 *
 * ■ スコープについて
 * 申請機能は ITCOM 主担当の範囲であり、本アプリの設計対象外。
 * 画面イメージ ITCOM-03 の実装として追加している。
 *
 * TODO(要レビュー): 画面設計書に対応する画面番号が無い。ITCOM-01〜09 とあわせて追番が必要。
 * TODO(要確認): 提出書類の種類と必須区分は公募要領の提出書類一覧との突合が必要（暫定値）。
 */
export const applyDocumentPage = SPPage({
    pageId: 'x_dent2_dentsusoke_apply_doc',
    title: '添付書類の提出',
    shortDescription:
        '添付書類の提出画面（ITCOM-03）。書類種別ごとにファイルを添付し、形式・サイズの検証と必須書類の充足チェックを行う。',
    category: 'custom',
    public: false,
    draft: false,
    roles: [applicantRole, applicantAdminRole],
    dynamicTitleStructure: '添付書類の提出 - ${portal.title}',
    containers: [
        {
            $id: Now.ID['apply_doc_container'],
            name: '添付書類の提出',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['apply_doc_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['apply_doc_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['apply_doc_inst'],
                                    widget: applicationDocumentFormWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: '提出書類のアップロードと必須書類の充足チェック（ITCOM-03）',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
