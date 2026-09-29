/**
 * T02 事業者ユーザ（テーブル定義書 成果物No.9）
 *
 * 設計書物理名 x_gap_applicant_user → 本スコープ x_dent2_dentsusoke_user
 * 認証情報は sys_user を継承し、登録ステータス・重複チェック結果等を拡張フィールドで保持する。
 */
import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, BooleanColumn, DateTimeColumn, ReferenceColumn, MultiLineTextColumn } from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_user = Table({
    name: 'x_dent2_dentsusoke_user',
    label: '事業者ユーザ',
    extends: 'sys_user',
    audit: true,
    schema: {
        u_business_entity: ReferenceColumn({
            label: '事業者',
            referenceTable: 'x_dent2_dentsusoke_entity',
            // テーブル定義書では必須（○）だが、仮登録（SC-02／処理No.1）の時点では
            // 事業者名・法人番号を未入力のため事業者レコードが存在しない（本登録 SC-03 で確定する）。
            // 必須制約は「登録済へ遷移する時点」の業務ルールであり、Data Policy／Business Rule で担保する方針とし、
            // 列レベルでは任意とする。
            // TODO(要レビュー): テーブル定義書 T02 の必須指定と業務フローの状態遷移（未登録→登録中）の整合。
            mandatory: false,
        }),
        u_user_type: ChoiceColumn({
            label: 'ユーザ区分',
            dropdown: 'dropdown_without_none',
            default: 'member',
            // TODO(Q05): 1事業者に複数ユーザーを認めるかが未確定。
            // 暫定案「管理者＋担当者」に対応する選択肢で実装する。
            choices: {
                manager: '管理者',
                member: '担当者',
            },
        }),
        u_registration_status: ChoiceColumn({
            label: 'ユーザ登録ステータス',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            default: 'unregistered',
            // 業務フロー「ユーザー登録ステータス一覧」の事務局用ステータスに準拠
            choices: {
                unregistered: '未登録',
                registering: '登録中',
                review: '登録申請審査中',
                defect_request: '登録不備確認依頼',
                defect_fixing: '登録不備修正中',
                registered: '登録済',
                rejected: '登録不可',
            },
        }),
        u_duplicate_check_result: ChoiceColumn({
            label: '重複チェック結果',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            default: 'not_executed',
            choices: {
                not_executed: '未実施',
                no_duplicate: '重複なし',
                duplicate_review: '重複あり（要確認）',
                duplicate_confirmed: '重複あり（確定）',
            },
        }),
        u_auth_method: ChoiceColumn({
            label: '認証方式',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            default: 'standard',
            choices: {
                standard: '通常認証',
                sso: 'SSO',
            },
        }),
        u_mfa_enabled: BooleanColumn({
            label: 'MFA設定有無',
            default: false,
        }),
        u_sso_external_id: StringColumn({
            label: 'SSO連携ID',
            maxLength: 100,
            // TODO(IF-01): SAML／OIDC いずれを採用するか未確定。
            // 暫定案は SAML2.0（ServiceNow Multi-Provider SSO）で、NameID をこの項目に格納する。
        }),
        u_registration_issue_note: MultiLineTextColumn({
            label: '登録不備内容',
            maxLength: 2000,
        }),
        u_registration_requested_on: DateTimeColumn({
            label: '登録申請日時',
        }),
        /**
         * 以下2項目はテーブル定義書に未定義の追加項目。
         * 権限設計書 SC-03「本登録を完了する」の整理後ロールが「（未認証／仮登録トークン）」であり、
         * 仮登録案内メール（処理No.2）のリンクに含む一時トークンでのアクセスが設計前提となっているため、
         * 仮登録受付処理（処理No.1）でトークンを発行・保持する。
         * TODO(要レビュー): テーブル定義書 T02 への項目追加を提案する。
         * TODO: トークンの有効期限（暫定7日）が未確定。SC-04 の再設定用リンク有効期限とあわせて確定する。
         * TODO: 本番相当の実装ではトークンを平文保持せずハッシュ化する（本検証はプロトタイプのため平文）。
         */
        u_registration_token: StringColumn({
            label: '仮登録トークン',
            maxLength: 64,
        }),
        u_registration_token_expires_on: DateTimeColumn({
            label: '仮登録トークン有効期限',
        }),
        /**
         * 以下2項目もテーブル定義書に未定義の追加項目。
         * 権限設計書 SC-04「パスワードを更新」の整理後ロールが「（未認証／一時トークン）」であり、
         * パスワードリセット処理（処理No.11）の再設定用リンクに含む一時トークンでのアクセスが設計前提のため、
         * 仮登録トークンとは別に保持する（用途が異なるトークンを兼用しない）。
         * TODO(要レビュー): テーブル定義書 T02 への項目追加を提案する。
         * TODO(SC-04 確認事項): 再設定用リンクの有効期限が未確定。暫定24時間としている。
         */
        u_password_reset_token: StringColumn({
            label: 'パスワード再設定トークン',
            maxLength: 64,
        }),
        u_password_reset_expires_on: DateTimeColumn({
            label: 'パスワード再設定トークン有効期限',
        }),
        /**
         * 以下2項目もテーブル定義書に未定義の追加項目。
         * 登録不備対応（処理No.7）の事業者側の経路に使用する。
         *
         * 事務局が「不備修正を依頼」を実行した時点では applicant ロールを付与していない
         * （権限設計書 2章：ロールは承認時に付与する）ため、申請者はポータルへログインできない。
         * そのため SC-03 本登録と同じく、案内メールのリンクに含む一時トークンでアクセスさせる。
         *
         * 仮登録トークン・パスワード再設定トークンとは用途が異なるため兼用しない
         * （u_password_reset_token を追加したときと同じ判断）。
         *
         * TODO(Q12): 依頼回数の上限・回答期限が未確定。暫定で有効期限14日としている。
         * TODO: 本番相当の実装ではトークンを平文保持せずハッシュ化する（本検証はプロトタイプのため平文）。
         */
        u_defect_fix_token: StringColumn({
            label: '登録不備修正トークン',
            maxLength: 64,
        }),
        u_defect_fix_expires_on: DateTimeColumn({
            label: '登録不備修正トークン有効期限',
        }),
        u_approved_on: DateTimeColumn({
            label: '承認日時',
        }),
        u_approved_by: ReferenceColumn({
            label: '承認者',
            referenceTable: 'sys_user',
        }),
    },
})
