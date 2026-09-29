/**
 * 申請機能・審査プロセス（ITCOM-01〜09）で追加したテーブルの ACL
 *
 * 既存の portal-acls.now.ts と同じ方針。
 * ・自社判定は PortalContextUtil に集約する（条件スクリプトを各 ACL に散らさない）
 * ・同一テーブル・同一操作の ACL は OR 評価されるため、事業者向けと事務局向けを別レコードにする
 * ・staff_admin は containsRoles により staff を包含するため staff 指定で足りる
 *
 * ■ 子テーブルの自社判定
 * 明細・提出書類・信用調査・処理履歴はいずれも T03 申請への参照（u_request）を持つ。
 * 自社かどうかは「親の申請の事業者が自分の所属事業者か」で判定するため、
 * PortalContextUtil.isMyRecord は使えない（u_business_entity を直接持たない）。
 * 親を1段辿る判定を条件スクリプトで行う。
 *
 * ■ Delete の方針
 * 既存方針（portal-acls.now.ts）は「物理削除は行わない」だが、
 * 対象経費明細は申請入力中の下書きデータであり、行の削除ができないと入力をやり直せない。
 * そのため明細に限り、自社かつ編集可能なステータスの場合に delete を許可する。
 * 提出後（受付済以降）は削除できない。
 */
import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { applicantRole, staffRole } from '../roles/roles.now'

/**
 * 子テーブルの自社判定。
 *
 * script には必ず単一の文字列リテラルを渡す。配列＋join('\n') のような式を渡すと
 * Fluent がビルド時に評価できず、sys_security_acl.script へ
 * "Symbol(CallExpressionShape)" という文字列が入り条件が常に不成立になる
 * （portal-acls.now.ts のコメントに記録された既知のNG）。
 */
const OWN_REQUEST_SCRIPT =
    'var requestId = current.getValue("u_request");\nvar answer = false;\nif (requestId) {\n  var req = new GlideRecord("x_dent2_dentsusoke_request");\n  if (req.get(requestId)) {\n    answer = req.getValue("u_business_entity") === new x_dent2_dentsusoke.PortalContextUtil().getMyEntityId();\n  }\n}\nanswer = answer;'

/** 自社かつ明細を編集できるステータス（申請入力中／不備修正中）であること */
const OWN_REQUEST_EDITABLE_SCRIPT =
    'var requestId = current.getValue("u_request");\nvar answer = false;\nif (requestId) {\n  var req = new GlideRecord("x_dent2_dentsusoke_request");\n  if (req.get(requestId)) {\n    var mine = req.getValue("u_business_entity") === new x_dent2_dentsusoke.PortalContextUtil().getMyEntityId();\n    var status = req.getValue("u_application_status");\n    answer = mine && (status === "input" || status === "defect_fixing");\n  }\n}\nanswer = answer;'

// ---------------------------------------------------------------------------
// 対象経費明細（ITCOM-02）
// ---------------------------------------------------------------------------
Acl({
    $id: Now.ID['acl_exp_item_read_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_exp_item',
    operation: 'read',
    decisionType: 'allow',
    roles: [applicantRole],
    script: OWN_REQUEST_SCRIPT,
    description: '事業者ユーザは自社の申請の対象経費明細のみ参照可（ITCOM-02）',
})

Acl({
    $id: Now.ID['acl_exp_item_read_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_exp_item',
    operation: 'read',
    decisionType: 'allow',
    roles: [staffRole],
    description: '事務局ユーザは全申請の対象経費明細を参照可（審査時の突合）',
})

Acl({
    $id: Now.ID['acl_exp_item_create_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_exp_item',
    operation: 'create',
    decisionType: 'allow',
    roles: [applicantRole],
    script: OWN_REQUEST_EDITABLE_SCRIPT,
    description: '事業者ユーザは自社かつ申請入力中／不備修正中の申請へ明細を追加可（処理No.18）',
})

Acl({
    $id: Now.ID['acl_exp_item_write_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_exp_item',
    operation: 'write',
    decisionType: 'allow',
    roles: [applicantRole],
    script: OWN_REQUEST_EDITABLE_SCRIPT,
    description: '事業者ユーザは自社かつ申請入力中／不備修正中の明細のみ更新可（提出後は変更不可）',
})

/**
 * 明細の削除。
 * 既存方針では delete を付与しないが、入力中の明細は行を削除できないと
 * 入力のやり直しができないため例外的に許可する（提出後は不可）。
 */
Acl({
    $id: Now.ID['acl_exp_item_delete_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_exp_item',
    operation: 'delete',
    decisionType: 'allow',
    roles: [applicantRole],
    script: OWN_REQUEST_EDITABLE_SCRIPT,
    description: '事業者ユーザは自社かつ申請入力中／不備修正中の明細のみ削除可（入力のやり直しのため）',
})

// ---------------------------------------------------------------------------
// 申請の提出書類（ITCOM-03）
//
// ■ sys_attachment の権限について
// 添付ファイル自体は sys_attachment（global スコープ）に保存される。
// スコープアプリから global テーブルの ACL は作成できないため、本ファイルでは扱わない。
// ServiceNow の添付の権限は「添付先レコードを参照／更新できるか」に従うため、
// 本テーブルの read／write を事業者へ付与することで、
// 自社の提出書類へのアップロードとダウンロードが許可される。
//
// TODO(要確認): インスタンスで glide.attachment.role が設定されている場合、
//   そのロールを applicant にも付与しないとアップロードできない（既定は未設定）。
//   インフラ担当への確認事項として残す。
// TODO(要確認): 添付できる拡張子はインスタンス全体のプロパティ
//   （glide.attachment.extensions／glide.attachment.blocked_extensions）でも制限される。
//   本アプリ側の許可拡張子（x_dent2_dentsusoke.document.allowed_extensions）と
//   矛盾しないよう突合が必要。
// ---------------------------------------------------------------------------
Acl({
    $id: Now.ID['acl_req_doc_read_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_req_doc',
    operation: 'read',
    decisionType: 'allow',
    roles: [applicantRole],
    script: OWN_REQUEST_SCRIPT,
    description:
        '事業者ユーザは自社の申請の提出書類のみ参照可（ITCOM-03）。添付ファイルのダウンロード権限もこれに従う',
})

Acl({
    $id: Now.ID['acl_req_doc_read_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_req_doc',
    operation: 'read',
    decisionType: 'allow',
    roles: [staffRole],
    description: '事務局ユーザは全申請の提出書類を参照可（審査時の書類確認）',
})

/**
 * 提出書類の行は ApplicationDocumentUtil.ensureRows が作成する。
 * 事業者が任意の書類種別の行を増やせる必要はないが、
 * 行の作成はウィジェットのサーバースクリプト（ACL 非適用）で行われるため、
 * ここでは create を付与しない（最小権限：トンマナ 2.1.1）。
 */
// ---------------------------------------------------------------------------
// 信用調査（ITCOM-08）
//
// 調査結果には事業者の信用に関する機微情報が含まれるため、
// 事業者ユーザには参照権限を付与しない（トンマナ 2.1.1 最小権限の原則）。
// 事業者へ伝えるのは最終的な採択・不採択の結果のみとする。
//
// Delete は付与しない（調査の履歴は取消状態として残す方針）。
// TODO(要確認): 調査結果の記録範囲と保存期間の方針が未確定。
// ---------------------------------------------------------------------------
Acl({
    $id: Now.ID['acl_credit_read_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_credit',
    operation: 'read',
    decisionType: 'allow',
    roles: [staffRole],
    description: '事務局ユーザは信用調査を参照可（ITCOM-08）。事業者ユーザには付与しない（機微情報）',
})

Acl({
    $id: Now.ID['acl_credit_create_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_credit',
    operation: 'create',
    decisionType: 'allow',
    roles: [staffRole],
    description: '事務局ユーザは信用調査を作成可（要否判定で「実施」を選択した場合に作成される）',
})

Acl({
    $id: Now.ID['acl_credit_write_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_credit',
    operation: 'write',
    decisionType: 'allow',
    roles: [staffRole],
    description:
        '事務局ユーザは信用調査を更新可（依頼・督促・結果取込・取消）。依頼書・結果ファイルの添付権限もこれに従う',
})

// ---------------------------------------------------------------------------
// 処理履歴（ITCOM-05／07 のタイムライン）
//
// 記録は ApplicationLogUtil（ウィジェット・UI Action のサーバースクリプト）が行い、
// ACL を経由しないため create／write は付与しない。
// 履歴は後から書き換えられないことに意味があるため、参照のみとする。
// ---------------------------------------------------------------------------
Acl({
    $id: Now.ID['acl_req_log_read_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_req_log',
    operation: 'read',
    decisionType: 'allow',
    roles: [applicantRole],
    script:
        'var requestId = current.getValue("u_request");\nvar answer = false;\nif (requestId && current.getValue("u_visible_to_applicant") === "1") {\n  var req = new GlideRecord("x_dent2_dentsusoke_request");\n  if (req.get(requestId)) {\n    answer = req.getValue("u_business_entity") === new x_dent2_dentsusoke.PortalContextUtil().getMyEntityId();\n  }\n}\nanswer = answer;',
    description:
        '事業者ユーザは自社の申請の処理履歴のうち事業者へ表示してよい行のみ参照可（事務局の内部作業は除く）',
})

Acl({
    $id: Now.ID['acl_req_log_read_staff'],
    type: 'record',
    table: 'x_dent2_dentsusoke_req_log',
    operation: 'read',
    decisionType: 'allow',
    roles: [staffRole],
    description: '事務局ユーザは全申請の処理履歴を参照可（ITCOM-07 の処理履歴）',
})

Acl({
    $id: Now.ID['acl_req_doc_write_applicant'],
    type: 'record',
    table: 'x_dent2_dentsusoke_req_doc',
    operation: 'write',
    decisionType: 'allow',
    roles: [applicantRole],
    script: OWN_REQUEST_EDITABLE_SCRIPT,
    description:
        '事業者ユーザは自社かつ申請入力中／不備修正中の提出書類のみ更新可（ITCOM-03）。添付ファイルのアップロード・削除権限もこれに従う',
})
