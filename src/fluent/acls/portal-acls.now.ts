/**
 * ACL 定義（権限設計書 成果物No.12 第4章）
 *
 * 本ファイルはマイページ（SC-05）が参照するテーブルを対象に、
 *   G1 事業者所有データ（T01 事業者／T02 事業者ユーザ／T03 申請／T11 お知らせ既読状況／T12 問合せ）
 *   G4 お知らせ（T10）
 * の CRUD ACL を定義する。
 *
 * 設計方針
 * ・同一テーブル・同一操作の ACL は OR 評価されるため、「事業者ユーザ（自社データのみ）」と
 *   「事務局ユーザ（全件）」を別レコードとして定義する。
 * ・自社判定は PortalContextUtil に集約する（条件スクリプトを各 ACL に散らさない）。
 * ・Delete は設計書どおり付与しない（論理的な取消・却下ステータスへの更新のみとし、物理削除は行わない）。
 * ・staff_admin は containsRoles により staff を包含するため、staff 指定の ACL で足りる。
 */
import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { applicantRole, staffRole, staffAdminRole } from '../roles/roles.now'

/** 自社データ判定（G1 スコープ条件）。PortalContextUtil に判定ロジックを集約する。 */
const OWN_ENTITY_SCRIPT =
    "answer = new x_dent2_dentsusoke.PortalContextUtil().isMyRecord(current, 'u_business_entity');"

/** 自身が所有する行の判定（お知らせ既読状況は事業者単位ではなくユーザ単位） */
const OWN_APPLICANT_USER_SCRIPT = "answer = current.getValue('u_applicant_user') === gs.getUserID();"

/**
 * G4 お知らせのスコープ条件（公開状態＝公開 かつ 公開範囲が自社の事業者区分または全体と一致）。
 *
 * script には必ず単一の文字列リテラルを渡す。配列＋join('\n') のような式を渡すと Fluent が
 * ビルド時に式を評価できず、sys_security_acl.script へ "Symbol(CallExpressionShape)" という
 * 文字列がそのまま配置され、条件が常に不成立となる（単体テストで検出したNG）。
 */
const NOTICE_VISIBLE_SCRIPT =
    'var scope = current.getValue("u_visibility_scope");\nvar entityType = new x_dent2_dentsusoke.PortalContextUtil().getMyEntityType();\nanswer = current.getValue("u_publish_status") === "published" && (scope === "all" || scope === entityType);'

// ---------------------------------------------------------------------------
// T01 事業者
// ---------------------------------------------------------------------------
Acl({
    $id: Now.ID['acl_entity_read_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_entity',
    operation: 'read',
    decisionType: 'allow',
    roles: [applicantRole],
    script: 'answer = current.getUniqueValue() === new x_dent2_dentsusoke.PortalContextUtil().getMyEntityId();',
    description: '事業者ユーザは自社の事業者レコードのみ参照可',
})

Acl({
    $id: Now.ID['acl_entity_read_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_entity',
    operation: 'read',
    decisionType: 'allow',
    roles: [staffRole],
    description: '事務局ユーザは全事業者を参照可',
})

// ---------------------------------------------------------------------------
// T02 事業者ユーザ
// ---------------------------------------------------------------------------
Acl({
    $id: Now.ID['acl_user_read_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_user',
    operation: 'read',
    decisionType: 'allow',
    roles: [applicantRole],
    script: OWN_ENTITY_SCRIPT,
    description: '事業者ユーザは同一事業者に所属するユーザのみ参照可（Q05 複数ユーザー許容案に対応）',
})

Acl({
    $id: Now.ID['acl_user_read_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_user',
    operation: 'read',
    decisionType: 'allow',
    roles: [staffRole],
    description: '事務局ユーザは全事業者ユーザを参照可（SC-11 ユーザ登録審査）',
})

// ---------------------------------------------------------------------------
// SC-06 自分の情報参照・変更 で必要な書き込み権限
//
// 事業者ユーザに更新を許可するのは SC-06 の編集対象項目に限る（トンマナ 2.1.1 最小権限の原則）。
// ServiceNow の項目アクセス判定は「項目個別 ACL → field='*' ACL → テーブルACL」の順に評価されるため、
//   ・レコードレベル write（自社／自分のみ）
//   ・field='*' write は事務局のみ
//   ・編集対象項目のみ個別に事業者ユーザへ許可
// の3層で構成し、対象外項目（法人番号・登録ステータス等）への更新は拒否する。
// ---------------------------------------------------------------------------
Acl({
    $id: Now.ID['acl_entity_write_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_entity',
    operation: 'write',
    decisionType: 'allow',
    roles: [applicantRole],
    script: 'answer = current.getUniqueValue() === new x_dent2_dentsusoke.PortalContextUtil().getMyEntityId();',
    description: '事業者ユーザは自社の事業者レコードのみ更新可（SC-06／処理No.14）',
})

Acl({
    $id: Now.ID['acl_entity_write_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_entity',
    operation: 'write',
    decisionType: 'allow',
    roles: [staffRole],
    description: '事務局ユーザは全事業者を更新可',
})

Acl({
    $id: Now.ID['acl_entity_write_all_fields_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_entity',
    field: '*',
    operation: 'write',
    decisionType: 'allow',
    roles: [staffRole],
    description: '個別許可のない項目の更新は事務局ユーザのみ（法人番号・前年度採択情報等）',
})

// SC-06 ②F1〜F4：事業者ユーザに編集を許可する項目
Acl({
    $id: Now.ID['acl_entity_write_business_name_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_entity',
    field: 'u_business_name',
    operation: 'write',
    decisionType: 'allow',
    roles: [applicantRole, staffRole],
    description: 'SC-06 F1 事業者名（法人名／屋号）',
})

Acl({
    $id: Now.ID['acl_entity_write_address_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_entity',
    field: 'u_address',
    operation: 'write',
    decisionType: 'allow',
    roles: [applicantRole, staffRole],
    description: 'SC-06 F2 所在地',
})

Acl({
    $id: Now.ID['acl_entity_write_industry_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_entity',
    field: 'u_industry',
    operation: 'write',
    decisionType: 'allow',
    roles: [applicantRole, staffRole],
    description: 'SC-06 F3 業種',
})

Acl({
    $id: Now.ID['acl_entity_write_employee_count_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_entity',
    field: 'u_employee_count',
    operation: 'write',
    decisionType: 'allow',
    roles: [applicantRole, staffRole],
    description: 'SC-06 F4 従業員数',
})

Acl({
    $id: Now.ID['acl_user_write_self'],
    type: 'record',
    table: 'x_dent2_dentsusoke_user',
    operation: 'write',
    decisionType: 'allow',
    roles: [applicantRole],
    script: 'answer = current.getUniqueValue() === gs.getUserID();',
    description: '事業者ユーザは自身のアカウントのみ更新可（SC-06／処理No.15）',
})

Acl({
    $id: Now.ID['acl_user_write_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_user',
    operation: 'write',
    decisionType: 'allow',
    roles: [staffRole],
    description: '事務局ユーザは全事業者ユーザを更新可（SC-11 登録審査）',
})

Acl({
    $id: Now.ID['acl_user_write_all_fields_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_user',
    field: '*',
    operation: 'write',
    decisionType: 'allow',
    roles: [staffRole],
    description: '個別許可のない項目の更新は事務局ユーザのみ（登録ステータス・重複チェック結果等）',
})

Acl({
    $id: Now.ID['acl_user_write_email_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_user',
    field: 'email',
    operation: 'write',
    decisionType: 'allow',
    roles: [applicantRole, staffRole],
    description: 'SC-06 F5 メールアドレス（F6 ユーザIDは変更不可のため許可しない）',
})

// ---------------------------------------------------------------------------
// T03 申請
// ---------------------------------------------------------------------------
Acl({
    $id: Now.ID['acl_request_read_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_request',
    operation: 'read',
    decisionType: 'allow',
    roles: [applicantRole],
    script: OWN_ENTITY_SCRIPT,
    description: '事業者ユーザは自社の申請のみ参照可（SC-05／SC-07）',
})

Acl({
    $id: Now.ID['acl_request_read_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_request',
    operation: 'read',
    decisionType: 'allow',
    roles: [staffRole],
    description: '事務局ユーザは全申請を参照可',
})

/**
 * 申請の作成・更新（申請入力・提出）
 *
 * 申請機能は ITCOM 主担当の範囲であり、当初は参照（read）のみを付与していた。
 * 事業者が申請を提出する画面を追加したため、自社の申請に限って作成・更新を許可する。
 *
 * 更新は「申請入力中」と「不備修正中」に限定する。
 * 提出後に事業者が金額や区分を書き換えられると審査の前提が崩れるため、
 * 審査中の申請は事業者側から変更できないようにする。
 * ただし事務局が不備確認を依頼した申請（不備修正中）は、事業者が修正して
 * 再提出する必要があるため更新を許可する（ITCOM-05）。
 * 不備確認依頼（defect_request）から不備修正中への遷移も事業者側の操作で行うため、
 * このステータスも更新できる必要がある。
 *
 * Delete は付与しない（論理的な取消・却下ステータスへの更新のみとする方針）。
 */
Acl({
    $id: Now.ID['acl_request_create_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_request',
    operation: 'create',
    decisionType: 'allow',
    roles: [applicantRole],
    script: OWN_ENTITY_SCRIPT,
    description: '事業者ユーザは自社の申請を作成可（申請入力：処理No.16）',
})

Acl({
    $id: Now.ID['acl_request_write_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_request',
    operation: 'write',
    decisionType: 'allow',
    roles: [applicantRole],
    script:
        "var status = current.getValue('u_application_status');\nanswer = new x_dent2_dentsusoke.PortalContextUtil().isMyRecord(current, 'u_business_entity') && (status === 'input' || status === 'defect_request' || status === 'defect_fixing');",
    description:
        '事業者ユーザは自社かつ申請入力中／不備確認依頼／不備修正中の申請のみ更新可（それ以外の審査中は変更不可）',
})

/**
 * 申請の更新（事務局の審査）
 *
 * 当初は帳票としての参照のみを付与していたが、一次審査（ITCOM-06／07）で
 * 審査担当者・判定・不備内容を記録するため更新が必要になった。
 *
 * 申請入力中（input）は事業者が入力している下書きであり、事務局が触る場面が無いため除外する。
 * 事業者が提出していない内容を事務局が書き換えられると、どちらの入力か追えなくなる。
 *
 * Create／Delete は付与しない（申請は事業者が作成し、物理削除は行わない方針）。
 */
Acl({
    $id: Now.ID['acl_request_write_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_request',
    operation: 'write',
    decisionType: 'allow',
    roles: [staffRole],
    script: "answer = current.getValue('u_application_status') !== 'input';",
    description: '事務局ユーザは申請入力中以外の申請を更新可（審査結果の記録：ITCOM-06／07）',
})

// ---------------------------------------------------------------------------
// T10 お知らせ
// ---------------------------------------------------------------------------
Acl({
    $id: Now.ID['acl_notice_read_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_notice',
    operation: 'read',
    decisionType: 'allow',
    roles: [applicantRole],
    // G4 スコープ条件：公開状態＝公開 かつ 公開範囲が自社の事業者区分または全体と一致
    script: NOTICE_VISIBLE_SCRIPT,
    description: '事業者ユーザは公開中かつ公開範囲が合致するお知らせのみ参照可',
})

Acl({
    $id: Now.ID['acl_notice_read_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_notice',
    operation: 'read',
    decisionType: 'allow',
    roles: [staffRole],
    description: '事務局ユーザは全お知らせを参照可（非公開含む）',
})

Acl({
    $id: Now.ID['acl_notice_create_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_notice',
    operation: 'create',
    decisionType: 'allow',
    roles: [staffRole],
    description: 'お知らせ作成は事務局ユーザのみ（SC-13）',
})

Acl({
    $id: Now.ID['acl_notice_write_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_notice',
    operation: 'write',
    decisionType: 'allow',
    roles: [staffRole],
    description: 'お知らせ編集は事務局ユーザのみ（SC-13）',
})

Acl({
    $id: Now.ID['acl_notice_delete_staff_admin'],
    type: 'record',
    table: 'x_dent2_dentsusoke_notice',
    operation: 'delete',
    decisionType: 'allow',
    roles: [staffAdminRole],
    description: 'お知らせ削除は事務局管理者のみ（権限設計書 G4）',
})

// ---------------------------------------------------------------------------
// T11 お知らせ既読状況
// ---------------------------------------------------------------------------
Acl({
    $id: Now.ID['acl_read_read_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_read',
    operation: 'read',
    decisionType: 'allow',
    roles: [applicantRole],
    script: OWN_APPLICANT_USER_SCRIPT,
    description: '事業者ユーザは自身の既読状況のみ参照可',
})

Acl({
    $id: Now.ID['acl_read_create_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_read',
    operation: 'create',
    decisionType: 'allow',
    roles: [applicantRole],
    description: '既読／未読情報取得処理（処理No.43）で自身の既読行を作成する',
})

Acl({
    $id: Now.ID['acl_read_write_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_read',
    operation: 'write',
    decisionType: 'allow',
    roles: [applicantRole],
    script: OWN_APPLICANT_USER_SCRIPT,
    description: '事業者ユーザは自身の既読状況のみ更新可',
})

Acl({
    $id: Now.ID['acl_read_read_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_read',
    operation: 'read',
    decisionType: 'allow',
    roles: [staffRole],
    description: '事務局ユーザは全既読状況を参照可',
})

// ---------------------------------------------------------------------------
// T12 問合せ
// ---------------------------------------------------------------------------
Acl({
    $id: Now.ID['acl_inquiry_read_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_inquiry',
    operation: 'read',
    decisionType: 'allow',
    roles: [applicantRole],
    script: OWN_ENTITY_SCRIPT,
    description: '事業者ユーザは自社の問合せのみ参照可（SC-10）',
})

Acl({
    $id: Now.ID['acl_inquiry_create_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_inquiry',
    operation: 'create',
    decisionType: 'allow',
    roles: [applicantRole],
    description: '問合せ作成処理（処理No.46）',
})

Acl({
    $id: Now.ID['acl_inquiry_read_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_inquiry',
    operation: 'read',
    decisionType: 'allow',
    roles: [staffRole],
    description: '事務局ユーザは全問合せを参照可（SC-14）',
})

Acl({
    $id: Now.ID['acl_inquiry_write_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_inquiry',
    operation: 'write',
    decisionType: 'allow',
    roles: [staffRole],
    description: '問合せ返信処理（処理No.47）',
})

// ---------------------------------------------------------------------------
// SC-14 問合せ管理・返信 で必要な項目レベルの権限
//
// 事務局ユーザが更新するのは返信に関わる項目に限る（トンマナ 2.1.1 最小権限の原則）。
// 事業者が起票した内容（件名・本文・事業者・起票者・受付日時）は問合せの記録そのものであり、
// 事務局が返信の操作中に書き換えられる状態にしない。
// T01／T02 と同じ3層構成とし、記録の訂正が必要な場合は事務局管理者が行う。
//   ・レコードレベル write は事務局（上の acl_inquiry_write_staff）
//   ・field='*' write は事務局管理者のみ
//   ・返信で更新する項目のみ個別に事務局ユーザへ許可
//
// UI Action・ビジネスルールの GlideRecord は ACL 非適用のため、
// 本切り分けはレコードフォーム・リストからの直接編集に対して効く。
// ---------------------------------------------------------------------------
Acl({
    $id: Now.ID['acl_inquiry_write_all_fields_staff_admin'],
    type: 'record',
    table: 'x_dent2_dentsusoke_inquiry',
    field: '*',
    operation: 'write',
    decisionType: 'allow',
    roles: [staffAdminRole],
    description: '個別許可のない項目（件名・本文・事業者・起票者・受付日時）の更新は事務局管理者のみ',
})

Acl({
    $id: Now.ID['acl_inquiry_write_reply_body_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_inquiry',
    field: 'u_reply_body',
    operation: 'write',
    decisionType: 'allow',
    roles: [staffRole],
    description: 'SC-14 回答本文（処理No.47）',
})

Acl({
    $id: Now.ID['acl_inquiry_write_state_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_inquiry',
    field: 'u_state',
    operation: 'write',
    decisionType: 'allow',
    roles: [staffRole],
    description: 'SC-14 状態（未回答／回答済）',
})

Acl({
    $id: Now.ID['acl_inquiry_write_assigned_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_inquiry',
    field: 'u_assigned_staff',
    operation: 'write',
    decisionType: 'allow',
    roles: [staffRole],
    description: 'SC-14 対応者（自分が対応する）',
})

Acl({
    $id: Now.ID['acl_inquiry_write_replied_on_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_inquiry',
    field: 'u_replied_on',
    operation: 'write',
    decisionType: 'allow',
    roles: [staffRole],
    description: 'SC-14 回答日時（返信時に自動設定）',
})
