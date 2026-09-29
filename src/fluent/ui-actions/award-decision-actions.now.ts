import '@servicenow/sdk/global'
import { Record, UiAction } from '@servicenow/sdk/core'

/**
 * 採択判定 ③アクション定義（画面イメージ ITCOM-09）
 *
 * 事務局ワークスペースのレコードフォーム上のボタン（UI Action）として実装する。
 * SC-11 ユーザ登録審査の3アクションと同じ構成
 * （src/fluent/ui-actions/registration-review-actions.now.ts）。
 *
 *   「採択として確定する」    … 申請審査完了（review_done）＋採択番号の採番＋交付決定額の確定
 *   「不採択として確定する」  … 不採択（rejected／終端状態）
 *   「一次審査へ差し戻す」    … 一次審査中（first_review）へ戻す
 *
 * ■ 実行権限（権限設計書 A20「不採択確定等の最終確定操作」）
 * 確定操作は staff_admin（事務局管理者）に限定する。
 * 一次審査（ITCOM-06／07）・信用調査（ITCOM-08）は staff が実施できる。
 *
 * SDK 4.10.1 は UiAction の roles プロパティを sys_ui_action.roles へ出力しないため、
 * condition 内の gs.hasRole() でロール判定を行う。roles プロパティは意図の宣言として残す。
 * condition は表示制御でしかないため ApplicationAwardUtil 側でもロールを検証している。
 *
 * condition は文字列リテラルで指定する。文字列結合等の式を渡すと Fluent がビルド時に評価できず
 * 「Unsupported variable initializer」となるため、共通部分を定数化せず各行に展開している。
 */

/** ITCOM-09「採択として確定する」→ 申請審査完了（review_done） */
export const awardApproveAction = UiAction({
    $id: Now.ID['ui_action_award_approve'],
    table: 'x_dent2_dentsusoke_request',
    name: '採択として確定する',
    actionName: 'sks_award_approve',
    order: 700,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '採択番号を採番し、交付決定額を確定してステータスを「申請審査完了」にします。査定による減額がある場合は「査定後の対象経費」を入力してから実行してください。',
    condition:
        "gs.hasRole('x_dent2_dentsusoke.staff_admin') && (current.u_application_status == 'result_checking' || current.u_application_status == 'credit_exempt')",
    roles: ['x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/award-approve.js'),
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

/** ITCOM-09「不採択として確定する」→ 不採択（rejected／終端状態） */
export const awardRejectAction = UiAction({
    $id: Now.ID['ui_action_award_reject'],
    table: 'x_dent2_dentsusoke_request',
    name: '不採択として確定する',
    actionName: 'sks_award_reject',
    order: 800,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '「不採択理由区分」と「不採択理由・申請者への通知文」を入力してから実行してください。不採択は終端状態のため戻せません。',
    condition:
        "gs.hasRole('x_dent2_dentsusoke.staff_admin') && (current.u_application_status == 'result_checking' || current.u_application_status == 'credit_exempt')",
    roles: ['x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/award-reject.js'),
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

/** ITCOM-09「一次審査へ差し戻す」→ 一次審査中（first_review） */
export const awardReturnAction = UiAction({
    $id: Now.ID['ui_action_award_return'],
    table: 'x_dent2_dentsusoke_request',
    name: '一次審査へ差し戻す',
    actionName: 'sks_award_return',
    order: 900,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '「採択判定の理由・特記事項」に差し戻しの理由を入力してから実行してください。一次審査の判定は消去され、審査担当者が判定をやり直せます。',
    condition:
        "gs.hasRole('x_dent2_dentsusoke.staff_admin') && (current.u_application_status == 'result_checking' || current.u_application_status == 'credit_exempt')",
    roles: ['x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/award-return.js'),
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
// （registration-review-actions.now.ts のコメント参照）。
// ---------------------------------------------------------------------------

/** 「採択として確定する」 */
const awardApproveFormAction = Record({
    $id: Now.ID['form_action_award_approve'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_request',
        ui_action: awardApproveAction,
        action_type: 'ui_action',
        active: true,
        name: '採択として確定する',
    },
})

Record({
    $id: Now.ID['form_action_item_award_approve'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_request',
        name: '採択として確定する',
        label: '採択として確定する',
        color: 'primary',
        overflow: false,
        order: 700,
        active: true,
        item_type: 'action',
        action: awardApproveFormAction,
    },
})

/** 「不採択として確定する」 */
const awardRejectFormAction = Record({
    $id: Now.ID['form_action_award_reject'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_request',
        ui_action: awardRejectAction,
        action_type: 'ui_action',
        active: true,
        name: '不採択として確定する',
    },
})

Record({
    $id: Now.ID['form_action_item_award_reject'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_request',
        name: '不採択として確定する',
        label: '不採択として確定する',
        color: 'primary-negative',
        overflow: false,
        order: 800,
        active: true,
        item_type: 'action',
        action: awardRejectFormAction,
    },
})

/** 「一次審査へ差し戻す」 */
const awardReturnFormAction = Record({
    $id: Now.ID['form_action_award_return'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_request',
        ui_action: awardReturnAction,
        action_type: 'ui_action',
        active: true,
        name: '一次審査へ差し戻す',
    },
})

Record({
    $id: Now.ID['form_action_item_award_return'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_request',
        name: '一次審査へ差し戻す',
        label: '一次審査へ差し戻す',
        color: 'secondary',
        overflow: false,
        order: 900,
        active: true,
        item_type: 'action',
        action: awardReturnFormAction,
    },
})
