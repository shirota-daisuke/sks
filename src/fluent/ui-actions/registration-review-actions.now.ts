import '@servicenow/sdk/global'
import { Record, UiAction } from '@servicenow/sdk/core'

/**
 * SC-11 ユーザ登録審査 ③アクション定義（承認／却下／不備修正を依頼）
 *
 * 画面設計書 SC-11 ③では3ボタンを個別に配置すると定義されており、
 * ワークスペース（Next Experience）のレコードフォーム上のボタン（UI Action）として実装する。
 *
 * 表示条件（③「ステータス＝登録申請審査中の場合のみ有効」）は condition で宣言的に制御し、
 * 実行時の妥当性判定は RegistrationReviewUtil（サーバー側）でも再検証する。
 * 承認のみ Q04（決定済）「確定一致は登録不可、曖昧一致のみ事務局確認」に従い、
 * 重複あり（確定）の場合はボタンを表示しない。
 *
 * 実行権限（トンマナ 2.1.1 最小権限の原則）
 *   SDK 4.10.1 は UiAction の roles プロパティを sys_ui_action.roles へ出力しないため、
 *   condition 内の gs.hasRole() でロール判定を行う。roles プロパティは意図の宣言として残す。
 *   staff_admin は containsRoles により staff を包含するため、staff の判定だけで両ロールを満たす。
 *
 * condition は文字列リテラルで指定する。文字列結合等の式を渡すと Fluent がビルド時に評価できず
 * 「Unsupported variable initializer」となるため、共通部分を定数化せず各行に展開している。
 */

/** ③No.1「承認」→ 登録済（処理No.6） */
export const approveAction = UiAction({
    $id: Now.ID['ui_action_registration_approve'],
    table: 'x_dent2_dentsusoke_user',
    name: '承認',
    actionName: 'sks_registration_approve',
    order: 100,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '登録申請を承認し、ステータスを「登録済」に確定して申請者ロールを付与します。',
    condition:
        "gs.hasRole('x_dent2_dentsusoke.staff') && current.u_registration_status == 'review' && current.u_duplicate_check_result != 'duplicate_confirmed'",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/registration-approve.js'),
    form: {
        showButton: true,
        showContextMenu: false,
        style: 'primary',
    },
    workspace: {
        isConfigurableWorkspace: true,
        showFormButtonV2: true,
    },
})

/** ③No.2「却下」→ 登録不可（処理No.6） */
export const rejectAction = UiAction({
    $id: Now.ID['ui_action_registration_reject'],
    table: 'x_dent2_dentsusoke_user',
    name: '却下',
    actionName: 'sks_registration_reject',
    order: 200,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '登録申請を却下し、ステータスを「登録不可」に確定します（終端状態）。',
    condition: "gs.hasRole('x_dent2_dentsusoke.staff') && current.u_registration_status == 'review'",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/registration-reject.js'),
    form: {
        showButton: true,
        showContextMenu: false,
        style: 'destructive',
    },
    workspace: {
        isConfigurableWorkspace: true,
        showFormButtonV2: true,
    },
})

/** ③No.3「不備修正を依頼」→ 登録不備確認依頼（処理No.7） */
export const requestDefectAction = UiAction({
    $id: Now.ID['ui_action_registration_request_defect'],
    table: 'x_dent2_dentsusoke_user',
    name: '不備修正を依頼',
    actionName: 'sks_registration_request_defect',
    order: 300,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '「登録不備内容」に修正が必要な項目と理由を入力してから実行してください。',
    condition: "gs.hasRole('x_dent2_dentsusoke.staff') && current.u_registration_status == 'review'",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/registration-request-defect.js'),
    form: {
        showButton: true,
        showContextMenu: false,
        style: 'unstyled',
    },
    workspace: {
        isConfigurableWorkspace: true,
        showFormButtonV2: true,
    },
})

// ---------------------------------------------------------------------------
// ワークスペース連携レコード
//
// workspace.isConfigurableWorkspace: true を指定した UI Action は、
// sys_ux_form_action と sys_ux_form_action_layout_item の2レコードを作成しないと
// ワークスペースのレコードページにボタンが表示されない
// （ui-action-guide.md L106「Button in workspace will not be visible unless these records are created」）。
// 専用の Fluent API がないため Record API で作成する。
//
// color は UI Action の form_style からのマッピング（同ガイド L138-143）
//   primary → primary ／ destructive → primary-negative ／ unstyled → secondary
// overflow は showFormMenuButtonV2（いずれも false＝メニューに入れずボタンとして表示）
// order は UI Action の order と揃える
//
// 作成前にインスタンスを照会し、当テーブルの既存レコードが0件であることを確認済み。
// ---------------------------------------------------------------------------

/** ③No.1「承認」 */
const approveFormAction = Record({
    $id: Now.ID['form_action_registration_approve'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_user',
        ui_action: approveAction,
        action_type: 'ui_action',
        active: true,
        name: '承認',
    },
})

Record({
    $id: Now.ID['form_action_item_registration_approve'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_user',
        name: '承認',
        label: '承認',
        color: 'primary',
        overflow: false,
        order: 100,
        active: true,
        item_type: 'action',
        action: approveFormAction,
    },
})

/** ③No.2「却下」 */
const rejectFormAction = Record({
    $id: Now.ID['form_action_registration_reject'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_user',
        ui_action: rejectAction,
        action_type: 'ui_action',
        active: true,
        name: '却下',
    },
})

Record({
    $id: Now.ID['form_action_item_registration_reject'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_user',
        name: '却下',
        label: '却下',
        color: 'primary-negative',
        overflow: false,
        order: 200,
        active: true,
        item_type: 'action',
        action: rejectFormAction,
    },
})

/** ③No.3「不備修正を依頼」 */
const requestDefectFormAction = Record({
    $id: Now.ID['form_action_registration_request_defect'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_user',
        ui_action: requestDefectAction,
        action_type: 'ui_action',
        active: true,
        name: '不備修正を依頼',
    },
})

Record({
    $id: Now.ID['form_action_item_registration_request_defect'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_user',
        name: '不備修正を依頼',
        label: '不備修正を依頼',
        color: 'secondary',
        overflow: false,
        order: 300,
        active: true,
        item_type: 'action',
        action: requestDefectFormAction,
    },
})
