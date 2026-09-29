/**
 * マスタテーブルの ACL 定義（SC-16 マスタメンテナンス）
 *
 * 対象は次の5マスタ。
 *   T15 業種別基準マスタ           x_dent2_dentsusoke_industry
 *   補助上限額マスタ               x_dent2_dentsusoke_cap
 *   補助率マスタ                   x_dent2_dentsusoke_rate
 *   対象経費区分マスタ             x_dent2_dentsusoke_expense
 *   専門家経費日額上限マスタ       x_dent2_dentsusoke_expert_fee
 *
 * 権限設計書 2章のロール定義でマスタメンテナンスはシステム管理者の担当とされているため
 * （roles.now.ts systemAdminRole「マスタメンテナンス、事務局ユーザのロール割当、外部連携設定」）、
 * 更新系はシステム管理者のみに許可する。
 *
 * 参照は事務局ユーザ・事業者ユーザの双方へ許可する。
 *   ・事務局ユーザ … SC-16 の一覧・審査時の基準確認
 *   ・事業者ユーザ … SC-02／SC-03／SC-06 の業種選択（T01 u_industry を参照型へ移行した後に必要）
 * 現時点のポータル画面は sys_choice から選択肢を取得しており本テーブルを参照していないが、
 * 移行時に権限不足で選択肢が空になる事故を避けるため、参照権限は先に付与しておく。
 *
 * 削除は付与しない。過去の申請・事業者が参照している可能性があるため、
 * 不要になった業種は u_active（有効）を false にして運用する（テーブル定義の方針と同じ）。
 */
import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { applicantRole, staffRole, systemAdminRole } from '../roles/roles.now'

// ---------------------------------------------------------------------------
// T15 業種別基準マスタ
// ---------------------------------------------------------------------------
Acl({
    $id: Now.ID['acl_industry_read_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_industry',
    operation: 'read',
    decisionType: 'allow',
    roles: [staffRole],
    description: '事務局ユーザは業種別基準マスタを参照可（SC-16／審査時の基準確認）',
})

Acl({
    $id: Now.ID['acl_industry_read_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_industry',
    operation: 'read',
    decisionType: 'allow',
    roles: [applicantRole],
    description: '事業者ユーザは業種別基準マスタを参照可（業種選択の選択肢取得）',
})

Acl({
    $id: Now.ID['acl_industry_read_system_admin'],
    type: 'record',
    table: 'x_dent2_dentsusoke_industry',
    operation: 'read',
    decisionType: 'allow',
    roles: [systemAdminRole],
    description: 'システム管理者は業種別基準マスタを参照可（SC-16 マスタメンテナンス）',
})

Acl({
    $id: Now.ID['acl_industry_create_system_admin'],
    type: 'record',
    table: 'x_dent2_dentsusoke_industry',
    operation: 'create',
    decisionType: 'allow',
    roles: [systemAdminRole],
    description: '業種の追加はシステム管理者のみ（権限設計書 2章 マスタメンテナンス）',
})

Acl({
    $id: Now.ID['acl_industry_write_system_admin'],
    type: 'record',
    table: 'x_dent2_dentsusoke_industry',
    operation: 'write',
    decisionType: 'allow',
    roles: [systemAdminRole],
    description: '業種・基準値の変更はシステム管理者のみ（権限設計書 2章 マスタメンテナンス）',
})

// ---------------------------------------------------------------------------
// 補助上限額マスタ／補助率マスタ／対象経費区分マスタ／専門家経費日額上限マスタ
//
// 参照は3ロールを1レコードにまとめる（T15 は先に3レコードへ分けて作成済みだが、
// 同一テーブル・同一操作の ACL は OR 評価されるため、まとめた形と挙動は同じ）。
//
// 補助上限額・補助率は補助金額自動判定処理（処理No.17）、
// 対象経費区分・専門家経費日額上限は対象経費登録処理（処理No.18）が参照する。
// いずれも事業者ユーザの画面（申請入力・申請状況）で表示・判定に使うため参照を許可する。
// ---------------------------------------------------------------------------

Acl({
    $id: Now.ID['acl_cap_read'],
    type: 'record',
    table: 'x_dent2_dentsusoke_cap',
    operation: 'read',
    decisionType: 'allow',
    roles: [applicantRole, staffRole, systemAdminRole],
    description: '補助上限額マスタの参照（補助金額自動判定処理：処理No.17）',
})

Acl({
    $id: Now.ID['acl_cap_create_system_admin'],
    type: 'record',
    table: 'x_dent2_dentsusoke_cap',
    operation: 'create',
    decisionType: 'allow',
    roles: [systemAdminRole],
    description: '補助上限額の追加はシステム管理者のみ（権限設計書 2章 マスタメンテナンス）',
})

Acl({
    $id: Now.ID['acl_cap_write_system_admin'],
    type: 'record',
    table: 'x_dent2_dentsusoke_cap',
    operation: 'write',
    decisionType: 'allow',
    roles: [systemAdminRole],
    description: '補助上限額の変更はシステム管理者のみ（権限設計書 2章 マスタメンテナンス）',
})

Acl({
    $id: Now.ID['acl_rate_read'],
    type: 'record',
    table: 'x_dent2_dentsusoke_rate',
    operation: 'read',
    decisionType: 'allow',
    roles: [applicantRole, staffRole, systemAdminRole],
    description: '補助率マスタの参照（補助金額自動判定処理：処理No.17）',
})

Acl({
    $id: Now.ID['acl_rate_create_system_admin'],
    type: 'record',
    table: 'x_dent2_dentsusoke_rate',
    operation: 'create',
    decisionType: 'allow',
    roles: [systemAdminRole],
    description: '補助率の追加はシステム管理者のみ（権限設計書 2章 マスタメンテナンス）',
})

Acl({
    $id: Now.ID['acl_rate_write_system_admin'],
    type: 'record',
    table: 'x_dent2_dentsusoke_rate',
    operation: 'write',
    decisionType: 'allow',
    roles: [systemAdminRole],
    description: '補助率の変更はシステム管理者のみ（権限設計書 2章 マスタメンテナンス）',
})

Acl({
    $id: Now.ID['acl_expense_read'],
    type: 'record',
    table: 'x_dent2_dentsusoke_expense',
    operation: 'read',
    decisionType: 'allow',
    roles: [applicantRole, staffRole, systemAdminRole],
    description: '対象経費区分マスタの参照（対象経費登録処理：処理No.18）',
})

Acl({
    $id: Now.ID['acl_expense_create_system_admin'],
    type: 'record',
    table: 'x_dent2_dentsusoke_expense',
    operation: 'create',
    decisionType: 'allow',
    roles: [systemAdminRole],
    description: '経費区分の追加はシステム管理者のみ（権限設計書 2章 マスタメンテナンス）',
})

Acl({
    $id: Now.ID['acl_expense_write_system_admin'],
    type: 'record',
    table: 'x_dent2_dentsusoke_expense',
    operation: 'write',
    decisionType: 'allow',
    roles: [systemAdminRole],
    description: '経費区分・対象範囲の変更はシステム管理者のみ（権限設計書 2章 マスタメンテナンス）',
})

Acl({
    $id: Now.ID['acl_expert_fee_read'],
    type: 'record',
    table: 'x_dent2_dentsusoke_expert_fee',
    operation: 'read',
    decisionType: 'allow',
    roles: [applicantRole, staffRole, systemAdminRole],
    description: '専門家経費日額上限マスタの参照（対象経費登録処理：処理No.18）',
})

Acl({
    $id: Now.ID['acl_expert_fee_create_system_admin'],
    type: 'record',
    table: 'x_dent2_dentsusoke_expert_fee',
    operation: 'create',
    decisionType: 'allow',
    roles: [systemAdminRole],
    description: '専門家区分の追加はシステム管理者のみ（権限設計書 2章 マスタメンテナンス）',
})

Acl({
    $id: Now.ID['acl_expert_fee_write_system_admin'],
    type: 'record',
    table: 'x_dent2_dentsusoke_expert_fee',
    operation: 'write',
    decisionType: 'allow',
    roles: [systemAdminRole],
    description: '専門家区分・日額上限の変更はシステム管理者のみ（権限設計書 2章 マスタメンテナンス）',
})
