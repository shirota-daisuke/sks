import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { defectFixFormWidget } from '../../sp-widget/defect-fix-form/widget.now'

/**
 * 登録不備修正画面（処理No.7 の事業者側）
 *
 * ①レイアウト構成
 *   中央配置のカード（事務局からの確認事項、事業者名、事業者区分、法人番号／本人識別情報、
 *   修正内容を提出するボタン）
 * ④画面遷移  SC-11（事務局が不備修正を依頼）→ 不備確認依頼メール → 本画面 → SC-11（再審査）へ
 *
 * 権限
 *   不備確認依頼の段階では applicant ロールを付与していない（権限設計書 2章：ロールは承認時に付与）。
 *   案内メールのリンクに含まれる一時トークンでアクセスするため public: true とし、roles は指定しない。
 *   トークン検証はウィジェット側（RegistrationDefectUtil）で行う。
 *   SC-03 本登録画面と同じ構成である。
 *
 * ※ 画面設計書に対応する画面番号が無い（SC-07 は申請の不備対応で別物）。
 *   画面一覧への追加が必要なため、確定後に本コメントと pageId を見直す。
 *   TODO(要レビュー): 画面設計書への画面追加（登録不備修正画面）。
 */
export const defectFixPage = SPPage({
    pageId: 'x_dent2_dentsusoke_defect_fix',
    title: 'ご登録内容の修正',
    shortDescription:
        '登録不備修正画面。不備確認依頼メールのリンクから、事務局が指摘した内容を確認して登録内容を修正・再提出する（処理No.7）。',
    category: 'custom',
    public: true,
    draft: false,
    dynamicTitleStructure: 'ご登録内容の修正 - ${portal.title}',
    containers: [
        {
            $id: Now.ID['defect_fix_container'],
            name: '登録不備修正',
            width: 'container',
            semanticTag: 'main',
            order: 100,
            rows: [
                {
                    $id: Now.ID['defect_fix_row'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['defect_fix_col'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['defect_fix_inst'],
                                    widget: defectFixFormWidget,
                                    order: 100,
                                    active: true,
                                    shortDescription: '不備内容の提示＋修正内容の再提出（処理No.7）',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})
