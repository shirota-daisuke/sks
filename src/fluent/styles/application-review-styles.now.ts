import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * 申請審査の一覧のフィールドスタイル（色分け／ITCOM-06）
 *
 * 事務局ワークスペースの一次審査の対象一覧で、申請ステータスを値のまま識別できるようにする。
 * 画面イメージ ITCOM-06 はステータスをラベル色で塗り分けているが、
 * Next Experience の一覧は Bootstrap のラベルクラスを使えないため sys_ui_style で指定する。
 *
 * ■ 実装方式
 * SDK 4.10.1 にフィールドスタイル専用の API は無いため Record API で sys_ui_style を作成する。
 * SC-11 のユーザ登録審査の色分け（registration-review-styles.now.ts）と同じ方式。
 *   name    … 対象テーブル
 *   element … 対象フィールド
 *   value   … 選択リストの保存値（表示値ではない）
 *   style   … 適用する CSS
 *
 * ■ 配色
 * ポータル側（Service Portal）は ApplicationStatusUtil.STATUS_TONES の表示区分を
 * Bootstrap3 のラベルクラスへ対応させて色分けしている。
 * 事務局ワークスペースと配色が食い違うと同じステータスが別の色で見えるため、
 * Bootstrap3 のラベル色と同じ値を指定して表示区分（tone）と色の対応を1つに保つ。
 *   done（一次審査完了・信用調査免除・審査完了）  #5cb85c  label-success 相当
 *   progress（審査中・信用調査中）                #f0ad4e  label-warning 相当
 *   error（不備・不採択・取下げ）                 #d9534f  label-danger 相当
 *   neutral（申請入力中）                         スタイルを定義せず既定の表示にする
 *
 * ■ ダークテーマ
 * sys_ui_style には Next Experience 用の themed_style もあるが、
 * 指定するデザイントークン名が未確認のため設定しない（空の場合は style が使われる）。
 * TODO(要確認): ダークテーマでのコントラストを実機で確認し、必要なら themed_style を追加する。
 *
 * ■ 値の網羅について
 * ApplicationStatusUtil.STATUS_TONES の16値のうち、neutral の申請入力中を除く15値を定義する。
 * ステータスを追加した場合は STATUS_TONES と本ファイルの両方へ追加する
 * （片方だけの追加では、ポータルと事務局画面で色が食い違う）。
 */

/** 表示区分（tone）ごとの CSS。文字色は白地・色地のいずれでも読める組み合わせにする。 */
const DONE_STYLE = 'background-color: #5cb85c; color: #ffffff'
const PROGRESS_STYLE = 'background-color: #f0ad4e; color: #ffffff'
const ERROR_STYLE = 'background-color: #d9534f; color: #ffffff'

// ---------------------------------------------------------------------------
// 申請ステータス（u_application_status）
// 業務フロー「申請ステータス一覧」の事務局用ステータスに対応する。
// 申請入力中（input）は事業者の下書きであり事務局の関心対象ではないため色を付けない。
// ---------------------------------------------------------------------------

/** 受付済：一次審査の着手待ち */
Record({
    $id: Now.ID['style_application_status_accepted'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'accepted',
        style: PROGRESS_STYLE,
    },
})

/** 一次審査中 */
Record({
    $id: Now.ID['style_application_status_first_review'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'first_review',
        style: PROGRESS_STYLE,
    },
})

/** 不備確認依頼：事業者の対応待ち */
Record({
    $id: Now.ID['style_application_status_defect_request'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'defect_request',
        style: ERROR_STYLE,
    },
})

/** 不備修正中：事業者が修正に着手した状態 */
Record({
    $id: Now.ID['style_application_status_defect_fixing'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'defect_fixing',
        style: ERROR_STYLE,
    },
})

/** 不備修正回答あり：事務局の再審査待ち */
Record({
    $id: Now.ID['style_application_status_defect_answered'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'defect_answered',
        style: PROGRESS_STYLE,
    },
})

/** 再審査中 */
Record({
    $id: Now.ID['style_application_status_re_review'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 're_review',
        style: PROGRESS_STYLE,
    },
})

/** 一次審査完了 */
Record({
    $id: Now.ID['style_application_status_first_review_done'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'first_review_done',
        style: DONE_STYLE,
    },
})

/** 信用調査要否判定中 */
Record({
    $id: Now.ID['style_application_status_credit_judging'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'credit_judging',
        style: PROGRESS_STYLE,
    },
})

/** 信用調査免除 */
Record({
    $id: Now.ID['style_application_status_credit_exempt'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'credit_exempt',
        style: DONE_STYLE,
    },
})

/** 外部調査準備中 */
Record({
    $id: Now.ID['style_application_status_ext_preparing'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'ext_preparing',
        style: PROGRESS_STYLE,
    },
})

/** 外部信用調査中 */
Record({
    $id: Now.ID['style_application_status_ext_reviewing'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'ext_reviewing',
        style: PROGRESS_STYLE,
    },
})

/** 調査結果取込待ち */
Record({
    $id: Now.ID['style_application_status_result_waiting'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'result_waiting',
        style: PROGRESS_STYLE,
    },
})

/** 信用調査結果確認中 */
Record({
    $id: Now.ID['style_application_status_result_checking'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'result_checking',
        style: PROGRESS_STYLE,
    },
})

/** 申請審査完了（採択） */
Record({
    $id: Now.ID['style_application_status_review_done'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'review_done',
        style: DONE_STYLE,
    },
})

/** 不採択（終端状態） */
Record({
    $id: Now.ID['style_application_status_rejected'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'rejected',
        style: ERROR_STYLE,
    },
})

/** 取下げ（終端状態） */
Record({
    $id: Now.ID['style_application_status_withdrawn'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_request',
        element: 'u_application_status',
        value: 'withdrawn',
        style: ERROR_STYLE,
    },
})

// ---------------------------------------------------------------------------
// 信用調査の結果（u_result／ITCOM-08）
//
// 「問題あり」を一覧で見落とすと、採択判定で見直しの機会を失う。
// 結果が未取込（空）の場合は色を付けない。
// TODO(要確認): 結果の区分が未確定（暫定3値）。区分を変更した場合は本ファイルも合わせて修正する。
// ---------------------------------------------------------------------------

/** 問題なし */
Record({
    $id: Now.ID['style_credit_result_ok'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_credit',
        element: 'u_result',
        value: 'ok',
        style: DONE_STYLE,
    },
})

/** 条件付き（要確認事項あり） */
Record({
    $id: Now.ID['style_credit_result_conditional'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_credit',
        element: 'u_result',
        value: 'conditional',
        style: PROGRESS_STYLE,
    },
})

/** 問題あり */
Record({
    $id: Now.ID['style_credit_result_ng'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_credit',
        element: 'u_result',
        value: 'ng',
        style: ERROR_STYLE,
    },
})

// ---------------------------------------------------------------------------
// 信用調査の状態（u_state／ITCOM-08）
// 依頼済（調査中）は外部機関の回答待ちであり、事務局の対応が必要な段階として着色する。
// 準備中・結果確認済・取消は既定の表示にする。
// ---------------------------------------------------------------------------

/** 依頼済（調査中）：外部機関の回答待ち */
Record({
    $id: Now.ID['style_credit_state_requested'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_credit',
        element: 'u_state',
        value: 'requested',
        style: PROGRESS_STYLE,
    },
})

/** 結果受領：事務局の確認待ち */
Record({
    $id: Now.ID['style_credit_state_received'],
    table: 'sys_ui_style',
    data: {
        name: 'x_dent2_dentsusoke_credit',
        element: 'u_state',
        value: 'received',
        style: DONE_STYLE,
    },
})
