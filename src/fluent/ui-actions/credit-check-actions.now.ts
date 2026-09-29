import '@servicenow/sdk/global'
import { Record, UiAction } from '@servicenow/sdk/core'

/**
 * 信用調査 ③アクション定義（画面イメージ ITCOM-08）
 *
 * 事務局ワークスペースのレコードフォーム上のボタン（UI Action）として実装する。
 * SC-11 ユーザ登録審査の3アクションと同じ構成
 * （src/fluent/ui-actions/registration-review-actions.now.ts）。
 *
 * ■ 2つのテーブルに分けている理由
 * 画面イメージは①要否判定〜③結果取込を1画面に並べているが、
 * 調査の依頼内容・結果は再調査の履歴を残すため申請の子テーブルへ1対多で保持している。
 * UI Action はフォームの入力値を読むため、入力欄があるテーブル側へ置く必要がある。
 *   申請（T03）             … ①要否判定（入力なし。ボタンのみ）
 *   信用調査（credit）      … ②依頼・督促・③結果取込・取消（入力あり）
 *
 * 実行権限（トンマナ 2.1.1 最小権限の原則）
 *   SDK 4.10.1 は UiAction の roles プロパティを sys_ui_action.roles へ出力しないため、
 *   condition 内の gs.hasRole() でロール判定を行う。roles プロパティは意図の宣言として残す。
 *   staff_admin は containsRoles により staff を包含するため、staff の判定だけで両ロールを満たす。
 *
 * condition は文字列リテラルで指定する。文字列結合等の式を渡すと Fluent がビルド時に評価できず
 * 「Unsupported variable initializer」となるため、共通部分を定数化せず各行に展開している。
 */

// ---------------------------------------------------------------------------
// ①要否判定（申請のフォーム）
// ---------------------------------------------------------------------------

/** ITCOM-08 ①「信用調査を実施する」→ 外部調査準備中（ext_preparing）＋調査レコード作成 */
export const creditJudgeRequiredAction = UiAction({
    $id: Now.ID['ui_action_credit_judge_required'],
    table: 'x_dent2_dentsusoke_request',
    name: '信用調査を実施する',
    actionName: 'sks_credit_judge_required',
    order: 500,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '信用調査を実施します。調査レコードを作成し、ステータスを「外部調査準備中」にします。',
    condition:
        "gs.hasRole('x_dent2_dentsusoke.staff') && (current.u_application_status == 'first_review_done' || current.u_application_status == 'credit_judging')",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/credit-judge-required.js'),
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

/** ITCOM-08 ①「信用調査を免除する」→ 信用調査免除（credit_exempt） */
export const creditJudgeExemptAction = UiAction({
    $id: Now.ID['ui_action_credit_judge_exempt'],
    table: 'x_dent2_dentsusoke_request',
    name: '信用調査を免除する',
    actionName: 'sks_credit_judge_exempt',
    order: 600,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '信用調査を行わず、ステータスを「信用調査免除」にします。採択判定へ進めます。',
    condition:
        "gs.hasRole('x_dent2_dentsusoke.staff') && (current.u_application_status == 'first_review_done' || current.u_application_status == 'credit_judging')",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/credit-judge-exempt.js'),
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
// ②依頼・督促／③結果取込・取消（信用調査のフォーム）
// ---------------------------------------------------------------------------

/** ITCOM-08 ②「外部機関へ依頼する」→ 依頼済（調査中）／外部信用調査中 */
export const creditRequestAction = UiAction({
    $id: Now.ID['ui_action_credit_request'],
    table: 'x_dent2_dentsusoke_credit',
    name: '外部機関へ依頼する',
    actionName: 'sks_credit_request',
    order: 100,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '「調査機関」を入力してから実行してください。依頼書ファイルは本レコードへ添付してください。',
    condition: "gs.hasRole('x_dent2_dentsusoke.staff') && current.u_state == 'preparing'",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/credit-request.js'),
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

/** ITCOM-08 ③「調査結果を取り込む」→ 結果受領／信用調査結果確認中 */
export const creditReceiveAction = UiAction({
    $id: Now.ID['ui_action_credit_receive'],
    table: 'x_dent2_dentsusoke_credit',
    name: '調査結果を取り込む',
    actionName: 'sks_credit_receive',
    order: 200,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '「調査結果」を選択してから実行してください。受領した結果ファイルは本レコードへ添付してください。',
    condition: "gs.hasRole('x_dent2_dentsusoke.staff') && current.u_state == 'requested'",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/credit-receive.js'),
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

/** ITCOM-08「調査を督促する」→ 調査結果取込待ち（申請ステータスのみ遷移） */
export const creditRemindAction = UiAction({
    $id: Now.ID['ui_action_credit_remind'],
    table: 'x_dent2_dentsusoke_credit',
    name: '調査を督促する',
    actionName: 'sks_credit_remind',
    order: 300,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '督促した記録を残し、申請のステータスを「調査結果取込待ち」にします。督促の連絡はシステム外で行います。',
    condition: "gs.hasRole('x_dent2_dentsusoke.staff') && current.u_state == 'requested'",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/credit-remind.js'),
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

/** ITCOM-08「調査を取り消す」→ 取消／信用調査要否判定中へ戻す */
export const creditCancelAction = UiAction({
    $id: Now.ID['ui_action_credit_cancel'],
    table: 'x_dent2_dentsusoke_credit',
    name: '調査を取り消す',
    actionName: 'sks_credit_cancel',
    order: 400,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: '「事務局メモ」に取消の理由を入力してから実行してください。申請は要否判定へ戻ります。結果を取り込んだ調査は取消できません。',
    condition:
        "gs.hasRole('x_dent2_dentsusoke.staff') && (current.u_state == 'preparing' || current.u_state == 'requested')",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/credit-cancel.js'),
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

/** ①「信用調査を実施する」 */
const judgeRequiredFormAction = Record({
    $id: Now.ID['form_action_credit_judge_required'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_request',
        ui_action: creditJudgeRequiredAction,
        action_type: 'ui_action',
        active: true,
        name: '信用調査を実施する',
    },
})

Record({
    $id: Now.ID['form_action_item_credit_judge_required'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_request',
        name: '信用調査を実施する',
        label: '信用調査を実施する',
        color: 'primary',
        overflow: false,
        order: 500,
        active: true,
        item_type: 'action',
        action: judgeRequiredFormAction,
    },
})

/** ①「信用調査を免除する」 */
const judgeExemptFormAction = Record({
    $id: Now.ID['form_action_credit_judge_exempt'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_request',
        ui_action: creditJudgeExemptAction,
        action_type: 'ui_action',
        active: true,
        name: '信用調査を免除する',
    },
})

Record({
    $id: Now.ID['form_action_item_credit_judge_exempt'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_request',
        name: '信用調査を免除する',
        label: '信用調査を免除する',
        color: 'secondary',
        overflow: false,
        order: 600,
        active: true,
        item_type: 'action',
        action: judgeExemptFormAction,
    },
})

/** ②「外部機関へ依頼する」 */
const creditRequestFormAction = Record({
    $id: Now.ID['form_action_credit_request'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_credit',
        ui_action: creditRequestAction,
        action_type: 'ui_action',
        active: true,
        name: '外部機関へ依頼する',
    },
})

Record({
    $id: Now.ID['form_action_item_credit_request'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_credit',
        name: '外部機関へ依頼する',
        label: '外部機関へ依頼する',
        color: 'primary',
        overflow: false,
        order: 100,
        active: true,
        item_type: 'action',
        action: creditRequestFormAction,
    },
})

/** ③「調査結果を取り込む」 */
const creditReceiveFormAction = Record({
    $id: Now.ID['form_action_credit_receive'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_credit',
        ui_action: creditReceiveAction,
        action_type: 'ui_action',
        active: true,
        name: '調査結果を取り込む',
    },
})

Record({
    $id: Now.ID['form_action_item_credit_receive'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_credit',
        name: '調査結果を取り込む',
        label: '調査結果を取り込む',
        color: 'primary',
        overflow: false,
        order: 200,
        active: true,
        item_type: 'action',
        action: creditReceiveFormAction,
    },
})

/** 「調査を督促する」 */
const creditRemindFormAction = Record({
    $id: Now.ID['form_action_credit_remind'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_credit',
        ui_action: creditRemindAction,
        action_type: 'ui_action',
        active: true,
        name: '調査を督促する',
    },
})

Record({
    $id: Now.ID['form_action_item_credit_remind'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_credit',
        name: '調査を督促する',
        label: '調査を督促する',
        color: 'secondary',
        overflow: false,
        order: 300,
        active: true,
        item_type: 'action',
        action: creditRemindFormAction,
    },
})

/** 「調査を取り消す」 */
const creditCancelFormAction = Record({
    $id: Now.ID['form_action_credit_cancel'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_credit',
        ui_action: creditCancelAction,
        action_type: 'ui_action',
        active: true,
        name: '調査を取り消す',
    },
})

Record({
    $id: Now.ID['form_action_item_credit_cancel'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_credit',
        name: '調査を取り消す',
        label: '調査を取り消す',
        color: 'primary-negative',
        overflow: false,
        order: 400,
        active: true,
        item_type: 'action',
        action: creditCancelFormAction,
    },
})
