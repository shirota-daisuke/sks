import '@servicenow/sdk/global'
import { Record, UiAction } from '@servicenow/sdk/core'

/**
 * SC-14 問合せ管理・返信 ③アクション定義（返信する／自分が対応する／未回答に戻す）
 *
 * 問合せ返信処理（処理No.47）は「回答本文の保存」「状態の確定」「回答日時の記録」
 * 「対応者の記録」を一括で行う操作であり、選択リストを直接編集させるのではなく
 * 専用のボタンとして提供する。これにより回答のタイミングと回答者が
 * 監査ログ（sys_audit：T12 は audit: true）に操作として残る。
 *
 * 表示条件は現在の状態で切り替える（未回答は「返信する」、回答済は「未回答に戻す」）。
 * 実行時の妥当性判定は InquiryAdminUtil（サーバー側）でも再検証する。
 *
 * 実行権限（トンマナ 2.1.1 最小権限の原則）
 *   SDK 4.10.1 は UiAction の roles プロパティを sys_ui_action.roles へ出力しないため、
 *   condition 内の gs.hasRole() でロール判定を行う。roles プロパティは意図の宣言として残す。
 *   staff_admin は containsRoles により staff を包含するため、staff の判定だけで両ロールを満たす。
 *
 * condition は文字列リテラルで指定する。文字列結合等の式を渡すと Fluent がビルド時に評価できず
 * 「Unsupported variable initializer」となるため、共通部分を定数化せず各行に展開している。
 */

/** ③No.1「返信する」→ 状態＝回答済（問合せ返信処理：処理No.47） */
export const inquiryReplyAction = UiAction({
    $id: Now.ID['ui_action_inquiry_reply'],
    table: 'x_dent2_dentsusoke_inquiry',
    name: '返信する',
    actionName: 'sks_inquiry_reply',
    order: 100,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '「回答本文」を入力してから実行してください。状態が「回答済」になり、回答日時と対応者が記録されます。',
    condition: "gs.hasRole('x_dent2_dentsusoke.staff') && current.u_state == 'open'",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/inquiry-reply.js'),
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

/** ③No.2「自分が対応する」→ 対応者＝実行者（対応の重複を避けるための取得操作） */
export const inquiryAssignToMeAction = UiAction({
    $id: Now.ID['ui_action_inquiry_assign_to_me'],
    table: 'x_dent2_dentsusoke_inquiry',
    name: '自分が対応する',
    actionName: 'sks_inquiry_assign_to_me',
    order: 200,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: 'この問合せの対応者にご自身を設定します。「問合せ（自分の担当）」の一覧に表示されます。',
    condition: "gs.hasRole('x_dent2_dentsusoke.staff') && current.u_state == 'open'",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/inquiry-assign-to-me.js'),
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

/**
 * ③No.3「未回答に戻す」→ 状態＝未回答（回答内容の訂正）
 *
 * TODO(SC-10 ⑥／SC-14 確認事項): 問合せへの追記（やり取りの継続）の可否が未確定。
 *   単一回答モデルでは回答の訂正手段が他にないため本操作を用意している。
 *   複数往復を認める方針が確定した場合は、差し戻しではなく追記として実装し直す。
 */
export const inquiryReopenAction = UiAction({
    $id: Now.ID['ui_action_inquiry_reopen'],
    table: 'x_dent2_dentsusoke_inquiry',
    name: '未回答に戻す',
    actionName: 'sks_inquiry_reopen',
    order: 300,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '回答内容を訂正するため状態を「未回答」に戻します。回答本文は訂正用に残ります。',
    condition: "gs.hasRole('x_dent2_dentsusoke.staff') && current.u_state == 'answered'",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/inquiry-reopen.js'),
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
// 専用の Fluent API がないため Record API で作成する（SC-11／SC-13 と同じ構成）。
//
// color は UI Action の form_style からのマッピング（同ガイド L138-143）
//   primary → primary ／ unstyled → secondary
// ---------------------------------------------------------------------------

/** ③No.1「返信する」 */
const inquiryReplyFormAction = Record({
    $id: Now.ID['form_action_inquiry_reply'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_inquiry',
        ui_action: inquiryReplyAction,
        action_type: 'ui_action',
        active: true,
        name: '返信する',
    },
})

Record({
    $id: Now.ID['form_action_item_inquiry_reply'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_inquiry',
        name: '返信する',
        label: '返信する',
        color: 'primary',
        overflow: false,
        order: 100,
        active: true,
        item_type: 'action',
        action: inquiryReplyFormAction,
    },
})

/** ③No.2「自分が対応する」 */
const inquiryAssignToMeFormAction = Record({
    $id: Now.ID['form_action_inquiry_assign_to_me'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_inquiry',
        ui_action: inquiryAssignToMeAction,
        action_type: 'ui_action',
        active: true,
        name: '自分が対応する',
    },
})

Record({
    $id: Now.ID['form_action_item_inquiry_assign_to_me'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_inquiry',
        name: '自分が対応する',
        label: '自分が対応する',
        color: 'secondary',
        overflow: false,
        order: 200,
        active: true,
        item_type: 'action',
        action: inquiryAssignToMeFormAction,
    },
})

/** ③No.3「未回答に戻す」 */
const inquiryReopenFormAction = Record({
    $id: Now.ID['form_action_inquiry_reopen'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_inquiry',
        ui_action: inquiryReopenAction,
        action_type: 'ui_action',
        active: true,
        name: '未回答に戻す',
    },
})

Record({
    $id: Now.ID['form_action_item_inquiry_reopen'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_inquiry',
        name: '未回答に戻す',
        label: '未回答に戻す',
        color: 'secondary',
        overflow: false,
        order: 300,
        active: true,
        item_type: 'action',
        action: inquiryReopenFormAction,
    },
})
