/**
 * ロール定義（権限設計書 成果物No.12 第2章）
 *
 * 設計書のロール物理名 x_gap_* → 本スコープでは <scope>.<name> 形式が必須のため
 * x_dent2_dentsusoke.applicant … の形で定義する。
 *
 * 外部審査員（第三者機関）には ServiceNow のロール・アカウントを付与しない方針（A17）のため、
 * x_gap_external_reviewer に相当するロールは定義しない。
 */
import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

/** 事業者ユーザ（申請者）— 本登録済み事業者ユーザに付与する基本ロール */
export const applicantRole = Role({
    name: 'x_dent2_dentsusoke.applicant',
    description: '事業者ユーザ（申請者）。自社の事業者情報・申請・お知らせ・問合せへアクセスする。',
})

/** 事業者ユーザ（管理者）— 事業者内で複数ユーザーを許容する場合の管理者ロール（Q05 暫定案） */
export const applicantAdminRole = Role({
    name: 'x_dent2_dentsusoke.applicant_admin',
    description: '事業者ユーザ（管理者）。applicant の権限に加え、事業者内の担当者アカウント管理を行う。',
    containsRoles: [applicantRole],
})

/**
 * 事務局ユーザ（審査担当）
 *
 * 事務局向け画面はワークスペース（Next Experience）で提供するため、
 * ワークスペースの利用に必要な OOTB ロール canvas_user を包含する。
 * OOTB ロールは sys_id ではなくロール名文字列で参照する（SDK 公式ドキュメント securityguide.md L45）。
 */
export const staffRole = Role({
    name: 'x_dent2_dentsusoke.staff',
    description: '事務局ユーザ（審査担当）。ユーザ登録審査、一次審査、お知らせ作成、問合せ対応を行う。',
    containsRoles: ['canvas_user'],
})

/** 事務局ユーザ（管理者）— 不採択確定等の最終確定操作（A20 暫定案） */
export const staffAdminRole = Role({
    name: 'x_dent2_dentsusoke.staff_admin',
    description: '事務局ユーザ（管理者）。staff の権限に加え、確定・取消等の最終確定操作を行う。',
    containsRoles: [staffRole],
})

/**
 * システム管理者 — マスタメンテナンス、事務局ユーザのロール割当、外部連携設定
 *
 * SC-12 事務局ユーザ管理画面（ロール別権限管理処理：処理No.51）で
 * sys_user・sys_user_has_role を操作するため、OOTB ロールを2つ包含する。
 *   canvas_user … ワークスペース（Next Experience）の利用
 *   user_admin  … ユーザ・ロール割当の管理（sys_user／sys_user_has_role への書き込み）
 * 事務局ユーザは標準の sys_user をそのまま利用する方針（テーブル定義書 sys_user 活用方針）であり、
 * これらはプラットフォーム側の OOTB ACL が要求する権限のため、カスタムロール単独では代替できない。
 */
export const systemAdminRole = Role({
    name: 'x_dent2_dentsusoke.system_admin',
    description: 'システム管理者。マスタメンテナンス、事務局ユーザのロール割当、外部連携設定を行う。',
    containsRoles: ['canvas_user', 'user_admin'],
})
