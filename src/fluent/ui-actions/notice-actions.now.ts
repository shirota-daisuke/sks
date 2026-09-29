import '@servicenow/sdk/global'
import { Record, UiAction } from '@servicenow/sdk/core'

/**
 * SC-13 お知らせ作成・編集 ③アクション定義（公開する／非公開にする）
 *
 * 作成（＋新規）・保存・削除はワークスペース標準のボタンで実現できるが、
 * 「公開状態の確定」は公開期間・本文の妥当性検証を伴う操作であり、
 * 選択リストを直接編集させるのではなく専用のボタンとして提供する。
 * これにより公開のタイミングが監査ログ（sys_audit：T10 は audit: true）に操作として残る。
 *
 * 表示条件は現在の公開状態で切り替える（公開中は「非公開にする」のみ、非公開中は「公開する」のみ）。
 * 実行時の妥当性判定は NoticeAdminUtil（サーバー側）でも再検証する。
 *
 * 実行権限（トンマナ 2.1.1 最小権限の原則）
 *   SDK 4.10.1 は UiAction の roles プロパティを sys_ui_action.roles へ出力しないため、
 *   condition 内の gs.hasRole() でロール判定を行う。roles プロパティは意図の宣言として残す。
 *   staff_admin は containsRoles により staff を包含するため、staff の判定だけで両ロールを満たす。
 *
 * condition は文字列リテラルで指定する。文字列結合等の式を渡すと Fluent がビルド時に評価できず
 * 「Unsupported variable initializer」となるため、共通部分を定数化せず各行に展開している。
 */

/** ③No.1「公開する」→ 公開状態＝公開（処理No.41 公開期間設定の確定操作） */
export const noticePublishAction = UiAction({
    $id: Now.ID['ui_action_notice_publish'],
    table: 'x_dent2_dentsusoke_notice',
    name: '公開する',
    actionName: 'sks_notice_publish',
    order: 100,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: 'このお知らせの公開状態を「公開」にします。事業者への表示は公開期間・公開範囲に従います。',
    condition: "gs.hasRole('x_dent2_dentsusoke.staff') && current.u_publish_status == 'private'",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/notice-publish.js'),
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

/** ③No.2「非公開にする」→ 公開状態＝非公開（掲載の取り下げ） */
export const noticeUnpublishAction = UiAction({
    $id: Now.ID['ui_action_notice_unpublish'],
    table: 'x_dent2_dentsusoke_notice',
    name: '非公開にする',
    actionName: 'sks_notice_unpublish',
    order: 200,
    active: true,
    showUpdate: true,
    showInsert: false,
    hint: 'このお知らせの公開状態を「非公開」に戻し、事業者ポータルから掲載を取り下げます。',
    condition: "gs.hasRole('x_dent2_dentsusoke.staff') && current.u_publish_status == 'published'",
    roles: ['x_dent2_dentsusoke.staff', 'x_dent2_dentsusoke.staff_admin'],
    script: Now.include('../../server/ui-actions/notice-unpublish.js'),
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
// 専用の Fluent API がないため Record API で作成する（SC-11 の登録審査アクションと同じ構成）。
//
// color は UI Action の form_style からのマッピング（同ガイド L138-143）
//   primary → primary ／ unstyled → secondary
// ---------------------------------------------------------------------------

/** ③No.1「公開する」 */
const noticePublishFormAction = Record({
    $id: Now.ID['form_action_notice_publish'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_notice',
        ui_action: noticePublishAction,
        action_type: 'ui_action',
        active: true,
        name: '公開する',
    },
})

Record({
    $id: Now.ID['form_action_item_notice_publish'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_notice',
        name: '公開する',
        label: '公開する',
        color: 'primary',
        overflow: false,
        order: 100,
        active: true,
        item_type: 'action',
        action: noticePublishFormAction,
    },
})

/** ③No.2「非公開にする」 */
const noticeUnpublishFormAction = Record({
    $id: Now.ID['form_action_notice_unpublish'],
    table: 'sys_ux_form_action',
    data: {
        table: 'x_dent2_dentsusoke_notice',
        ui_action: noticeUnpublishAction,
        action_type: 'ui_action',
        active: true,
        name: '非公開にする',
    },
})

Record({
    $id: Now.ID['form_action_item_notice_unpublish'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: 'x_dent2_dentsusoke_notice',
        name: '非公開にする',
        label: '非公開にする',
        color: 'secondary',
        overflow: false,
        order: 200,
        active: true,
        item_type: 'action',
        action: noticeUnpublishFormAction,
    },
})
