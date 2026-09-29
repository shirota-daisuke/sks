import '@servicenow/sdk/global'
import { Record, UiAction } from '@servicenow/sdk/core'

/**
 * 一次審査 ③アクション定義（画面イメージ ITCOM-06／ITCOM-07）
 *
 * 事務局ワークスペースのレコードフォーム上のボタン（UI Action）として実装する。
 * SC-11 ユーザ登録審査の3アクションと同じ構成
 * （src/fluent/ui-actions/registration-review-actions.now.ts）。
 *
 *   ITCOM-06「自分が審査を担当する」… 担当者の割当と審査の開始
 *   ITCOM-07「一次審査を完了する」  … 一次審査完了（first_review_done）
 *   ITCOM-07「不備修正を依頼する」  … 不備確認依頼（defect_request）＋案内メール
 *   ITCOM-07「不採択にする」        … 不採択（rejected／終端状態）
 *
 * 判定の3アクションは「審査に着手している（一次審査中／再審査中）」かつ
 * 「担当が自分または未設定」の場合のみ表示する。
 * 受付済のまま判定できると、担当も期限も決まっていない申請が結論だけ出ることになる。
 *
 * 実行権限（トンマナ 2.1.1 最小権限の原則）
 *   SDK 4.10.1 は UiAction の roles プロパティを sys_ui_action.roles へ出力しないため、
 *   condition 内の gs.hasRole() でロール判定を行う。roles プロパティは意図の宣言として残す。
 *   staff_admin は containsRoles により staff を包含するため、staff の判定だけで両ロールを満たす。
 *
 * condition は文字列リテラルで指定する。文字列結合等の式を渡すと Fluent がビルド時に評価できず
 * 「Unsupported variable initializer」となるため、共通部分を定数化せず各行に展開している。
 */

/**
 * ③「自分が審査を担当する」
 *
 * 表示条件は「審査を引き受けると遷移が発生するステータス」に限る。
 * 一次審査中・再審査中は既に引き受け済みのため表示しない。
 * 担当が他の事務局ユーザに設定済みの申請では表示しない（二重の審査を避けるため）。
 */
export const reviewAssignToMeAction = UiAction({
    $id: Now.ID['ui_action_review_assign_to_me'],
    table: 'x_dent2_dentsusoke_request',
    name: '自分が審査を担当する',
    actionName: 'sks_review_assign_to_me',
    order: 100,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '審査担当者を自分に設定し、審査を開始します（受付済→一次審査中／不備修正回答あり→再審査中）。',
    condition:
        "gs.hasRole('x_dent2_dentsusoke.staff') && (current.u_application_status == 'accepted' || current.u_application_status == 'defect_answered') && (current.u_review_assigned_to.nil() || current.u_review_assigned_to == gs.getUserID())",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/review-assign-to-me.js'),
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

/** ITCOM-07 ③「一次審査を完了する」→ 一次審査完了（first_review_done） */
export const reviewCompleteAction = UiAction({
    $id: Now.ID['ui_action_review_complete'],
    table: 'x_dent2_dentsusoke_request',
    name: '一次審査を完了する',
    actionName: 'sks_review_complete',
    order: 200,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '一次審査を完了し、ステータスを「一次審査完了」に確定します。信用調査の要否判定へは自動遷移しません。',
    condition:
        "gs.hasRole('x_dent2_dentsusoke.staff') && (current.u_application_status == 'first_review' || current.u_application_status == 're_review') && (current.u_review_assigned_to.nil() || current.u_review_assigned_to == gs.getUserID())",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/review-complete.js'),
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

/** ITCOM-07 ③「不備修正を依頼する」→ 不備確認依頼（defect_request） */
export const reviewRequestDefectAction = UiAction({
    $id: Now.ID['ui_action_review_request_defect'],
    table: 'x_dent2_dentsusoke_request',
    name: '不備修正を依頼する',
    actionName: 'sks_review_request_defect',
    order: 300,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '「不備内容」に修正が必要な項目と理由を入力してから実行してください。入力した内容は申請者へのメールにそのまま記載されます。',
    condition:
        "gs.hasRole('x_dent2_dentsusoke.staff') && (current.u_application_status == 'first_review' || current.u_application_status == 're_review') && (current.u_review_assigned_to.nil() || current.u_review_assigned_to == gs.getUserID())",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/review-request-defect.js'),
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

/** ITCOM-07 ③「不採択にする」→ 不採択（rejected／終端状態） */
export const reviewRejectAction = UiAction({
    $id: Now.ID['ui_action_review_reject'],
    table: 'x_dent2_dentsusoke_request',
    name: '不採択にする',
    actionName: 'sks_review_reject',
    order: 400,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '「不採択理由区分」と「不採択理由・申請者への通知文」を入力してから実行してください。不採択は終端状態のため戻せません。',
    condition:
        "gs.hasRole('x_dent2_dentsusoke.staff') && (current.u_application_status == 'first_review' || current.u_application_status == 're_review') && (current.u_review_assigned_to.nil() || current.u_review_assigned_to == gs.getUserID())",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/review-reject.js'),
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

// ---------------------------------------------------------------------------
// ワークスペース連携レコード
//
// workspace.isConfigurableWorkspace: true を指定した UI Action は、
// sys_ux_form_action と sys_ux_form_action_layout_item の2レコードを作成しないと
// ワークスペースのレコードページにボタンが表示されない
// （registration-review-actions.now.ts のコメント参照）。
// ---------------------------------------------------------------------------

const assignToMeFormAction = Record({
    $id: Now.ID['form_action_review_assign_to_me'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_request',
        ui_action: reviewAssignToMeAction,
        action_type: 'ui_action',
        active: true,
        name: '自分が審査を担当する',
    },
})

Record({
    $id: Now.ID['form_action_item_review_assign_to_me'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_request',
        name: '自分が審査を担当する',
        label: '自分が審査を担当する',
        color: 'primary',
        overflow: false,
        order: 100,
        active: true,
        item_type: 'action',
        action: assignToMeFormAction,
    },
})

/** ITCOM-07 ③「一次審査を完了する」 */
const completeFormAction = Record({
    $id: Now.ID['form_action_review_complete'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_request',
        ui_action: reviewCompleteAction,
        action_type: 'ui_action',
        active: true,
        name: '一次審査を完了する',
    },
})

Record({
    $id: Now.ID['form_action_item_review_complete'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_request',
        name: '一次審査を完了する',
        label: '一次審査を完了する',
        color: 'primary',
        overflow: false,
        order: 200,
        active: true,
        item_type: 'action',
        action: completeFormAction,
    },
})

/** ITCOM-07 ③「不備修正を依頼する」 */
const requestDefectFormAction = Record({
    $id: Now.ID['form_action_review_request_defect'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_request',
        ui_action: reviewRequestDefectAction,
        action_type: 'ui_action',
        active: true,
        name: '不備修正を依頼する',
    },
})

Record({
    $id: Now.ID['form_action_item_review_request_defect'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_request',
        name: '不備修正を依頼する',
        label: '不備修正を依頼する',
        color: 'secondary',
        overflow: false,
        order: 300,
        active: true,
        item_type: 'action',
        action: requestDefectFormAction,
    },
})

/** ITCOM-07 ③「不採択にする」 */
const rejectFormAction = Record({
    $id: Now.ID['form_action_review_reject'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_request',
        ui_action: reviewRejectAction,
        action_type: 'ui_action',
        active: true,
        name: '不採択にする',
    },
})

Record({
    $id: Now.ID['form_action_item_review_reject'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_request',
        name: '不採択にする',
        label: '不採択にする',
        color: 'primary-negative',
        overflow: false,
        order: 400,
        active: true,
        item_type: 'action',
        action: rejectFormAction,
    },
})
