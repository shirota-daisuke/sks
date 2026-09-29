import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * SC-11 ユーザ登録審査 一覧のフィールドスタイル（色分け）
 *
 * 画面イメージ凡例（成果物No.5）の3区分を一覧の値にも反映し、
 * 「要対応（登録申請審査中）」「不備（登録不備確認依頼・修正中・登録不可）」を
 * 一覧のまま識別できるようにする。
 *
 * ■ 実装方式
 * SDK 4.10.1 にフィールドスタイル専用の API は無いため Record API で sys_ui_style を作成する。
 * sys_ui_style は sys_metadata を継承するアプリケーションファイルであり、
 * 自スコープのテーブルに対するスタイルは本アプリの成果物として管理できる。
 *   name    … 対象テーブル
 *   element … 対象フィールド
 *   value   … 選択リストの保存値（表示値ではない）
 *   style   … 適用する CSS
 *
 * ■ 配色
 * ポータル側（Service Portal）は Bootstrap3 のラベルクラスで色分けしており
 * （RegistrationReviewUtil.TONE_LABEL_CLASSES）、事務局ワークスペースと配色が食い違うと
 * 同じステータスが別の色で見えてしまう。そのため Bootstrap3 のラベル色と同じ値を指定して
 * 表示区分（tone）と色の対応を1つに保つ。
 *   done（登録済・重複なし）           #5cb85c  label-success 相当
 *   progress（審査中・重複あり要確認） #f0ad4e  label-warning 相当
 *   error（不備・登録不可・重複確定）  #d9534f  label-danger 相当
 *   neutral（未登録・登録中・未実施）  スタイルを定義せず既定の表示にする
 *
 * ■ ダークテーマ
 * sys_ui_style には Next Experience 用の themed_style もあるが、
 * 指定するデザイントークン名が未確認のため設定しない（空の場合は style が使われる）。
 * TODO(要確認): ダークテーマでのコントラストを実機で確認し、必要なら themed_style を追加する。
 */

/** 表示区分（tone）ごとの CSS。文字色は白地・色地のいずれでも読める組み合わせにする。 */
const DONE_STYLE = 'background-color: #5cb85c; color: #ffffff'
const PROGRESS_STYLE = 'background-color: #f0ad4e; color: #ffffff'
const ERROR_STYLE = 'background-color: #d9534f; color: #ffffff'

// ---------------------------------------------------------------------------
// ユーザ登録ステータス（u_registration_status）
// 業務フロー「ユーザー登録ステータス一覧」の事務局用ステータスに対応する。
// 未登録・登録中（発行前）は色を付けず、事務局の関心対象のみを着色する。
// ---------------------------------------------------------------------------

Record({
    $id: Now.ID['style_registration_status_review'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_user',
        element: 'u_registration_status',
        value: 'review',
        style: PROGRESS_STYLE,
    },
})

Record({
    $id: Now.ID['style_registration_status_defect_request'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_user',
        element: 'u_registration_status',
        value: 'defect_request',
        style: ERROR_STYLE,
    },
})

Record({
    $id: Now.ID['style_registration_status_defect_fixing'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_user',
        element: 'u_registration_status',
        value: 'defect_fixing',
        style: ERROR_STYLE,
    },
})

Record({
    $id: Now.ID['style_registration_status_registered'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_user',
        element: 'u_registration_status',
        value: 'registered',
        style: DONE_STYLE,
    },
})

Record({
    $id: Now.ID['style_registration_status_rejected'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_user',
        element: 'u_registration_status',
        value: 'rejected',
        style: ERROR_STYLE,
    },
})

// ---------------------------------------------------------------------------
// 重複チェック結果（u_duplicate_check_result）
// Q04（決定済）「確定一致は登録不可、曖昧一致のみ事務局確認」に対応し、
// 承認できない「重複あり（確定）」と、確認が必要な「重複あり（要確認）」を区別する。
// 未実施は色を付けない。
// ---------------------------------------------------------------------------

Record({
    $id: Now.ID['style_duplicate_no_duplicate'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_user',
        element: 'u_duplicate_check_result',
        value: 'no_duplicate',
        style: DONE_STYLE,
    },
})

Record({
    $id: Now.ID['style_duplicate_review'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_user',
        element: 'u_duplicate_check_result',
        value: 'duplicate_review',
        style: PROGRESS_STYLE,
    },
})

Record({
    $id: Now.ID['style_duplicate_confirmed'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_user',
        element: 'u_duplicate_check_result',
        value: 'duplicate_confirmed',
        style: ERROR_STYLE,
    },
})
