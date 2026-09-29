import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * SC-17 帳票／レポート出力画面（事務局）
 *
 * 題材システム構成図（研究開発計画書 p2／p4）で事務局ユーザの入口に置かれている
 * 「帳票／レポート」に対応する。
 *
 * ■ 出力方式の考え方
 * ServiceNow で帳票・レポートを出力する標準の仕組みは次の2つで、SC-17 は両方を用意する。
 *   1. リストのエクスポート（Excel／CSV／PDF）
 *      … 事務局ワークスペースのカテゴリ「帳票／レポート」の一覧から出力する
 *        （src/fluent/workspaces/staff-workspace/list-menu.now.ts）。
 *          画面上で条件を絞ってからそのまま出力できるため、日常の出力はこちらを使う。
 *   2. レポート定義（sys_report）
 *      … 本ファイルで定義する。出力条件・列・集計方法を定義として保存したもので、
 *        PDF／Excel への出力、定期実行してメール送付（sysauto_report）、
 *        ダッシュボードへの掲載に再利用できる。
 *
 * 事務局ユーザは、プラットフォームの「レポート」から本ファイルの定義を開いて出力する。
 * 参照可能なロールを事務局ユーザに限定しているため事業者ユーザには表示されない
 * （staff_admin は containsRoles により staff を包含する）。
 *
 * ■ Fluent に sys_report 専用の API が無いため Record API で作成する
 * SDK 4.10.1 には Report の Fluent API が無い（docs/api 配下に該当の API が存在しない）。
 * SC-11 の sys_ux_form_action と同じ方針で、汎用の Record API を用いる。
 *
 * ■ 帳票の選定根拠（要レビュー）
 * 帳票レイアウト設計書が手元にないため、テーブル定義書の項目と業務フローのステータスから
 * 「事務局が外部へ提出・共有する単位」として想定される一覧を用意した。
 * TODO(要確認): 帳票の種類・掲載項目・並び順・出力形式が未確定。
 *   帳票レイアウト設計書の確定後に、種類の追加・削除と列の並びを見直す。
 * TODO(要確認): 罫線・表題・押印欄を持つ定型帳票（様式が定められた提出書類）が必要な場合、
 *   リストのエクスポートやレポートのPDF出力では様式を再現できない。
 *   その場合は PDF テンプレート（Document Template）または帳票生成の作り込みが必要になり、
 *   様式そのものの提供が前提となる。
 * TODO(要確認): 定期実行してメール送付する要件（月次報告等）がある場合は
 *   sysauto_report を追加する。送信先・頻度・送信元アドレスが未確定のため本スライスでは作成しない。
 *
 * ■ user／roles の指定
 *   user  = 'GLOBAL' … 特定ユーザの個人レポートではなく共有レポートとする
 *   roles = 事務局ユーザのみ参照可
 *
 * roles は配列で指定する（文字列を直接渡すとビルドエラー TS2322）。
 * 配列の要素は Role オブジェクトではなくロール名の文字列にする。
 * sys_report.roles は参照列ではなくロール名を保持する文字列列であり、
 * Role オブジェクトを渡すと "[object Object]" が出力される（ビルド結果で確認済み）。
 *
 * ■ 集計項目は field で指定する（group_by ではない）
 * sys_report の集計軸（グループ化する項目）は field 列に入る。
 * group_by という列は存在せず、指定するとビルドエラーになる
 * （TS2353「'group_by' does not exist in type 'Data<"sys_report">'」）。
 * インスタンスの稼働中レポート（type=bar／pie）がいずれも field に項目名を持つことを確認済み。
 */

/**
 * 帳票・レポートの参照を許可するロール（事務局ユーザ）。
 * staff_admin は containsRoles により staff を包含するため、staff の指定で両ロールを満たす。
 * roles は文字列列のためロール名で指定する（roles.now.ts の staffRole.name と一致させる）。
 */
const STAFF_ROLE_NAME = 'x_dent2_dentsusoke.staff'

/** T03 申請の帳票掲載項目（申請の識別・規模・審査状況・金額） */
const REQUEST_FIELDS =
    'u_application_number,u_business_entity,u_applicant_user,u_organization_type,u_employee_count_category,u_application_status,u_submitted_on,u_subsidy_cap_amount,u_subsidy_rate,u_total_expense_amount'

// ---------------------------------------------------------------------------
// 帳票（一覧形式）— 出力してそのまま共有・提出に使う
// ---------------------------------------------------------------------------

/**
 * 申請一覧（受付済）
 * 「申請入力中」は事業者が作成中で事務局へ到達していないため除外する
 * （SC-15 ダッシュボードの件数と同じ絞り込み）。
 */
Record({
    $id: Now.ID['report_requests_accepted'],
    table: 'sys_report',
    data: {
        title: 'SKS 申請一覧（受付済）',
        table: 'x_dent2_dentsusoke_request',
        type: 'list',
        filter: 'u_application_status!=input^ORDERBYu_application_number',
        field_list: REQUEST_FIELDS,
        user: 'GLOBAL',
        roles: [STAFF_ROLE_NAME],
        is_published: false,
    },
})

/** 採択者一覧（申請審査完了）— 採択結果の公表・報告に使う */
Record({
    $id: Now.ID['report_requests_awarded'],
    table: 'sys_report',
    data: {
        title: 'SKS 採択者一覧（申請審査完了）',
        table: 'x_dent2_dentsusoke_request',
        type: 'list',
        filter: 'u_application_status=review_done^ORDERBYu_application_number',
        field_list: REQUEST_FIELDS,
        user: 'GLOBAL',
        roles: [STAFF_ROLE_NAME],
        is_published: false,
    },
})

/** 不採択・取下げ一覧（終端状態のうち採択に至らなかったもの） */
Record({
    $id: Now.ID['report_requests_rejected'],
    table: 'sys_report',
    data: {
        title: 'SKS 不採択・取下げ一覧',
        table: 'x_dent2_dentsusoke_request',
        type: 'list',
        filter: 'u_application_statusINrejected,withdrawn^ORDERBYu_application_number',
        field_list: REQUEST_FIELDS,
        user: 'GLOBAL',
        roles: [STAFF_ROLE_NAME],
        is_published: false,
    },
})

/**
 * 事業者ユーザ登録審査状況一覧（SC-11 の審査実績）
 * 「未登録」はユーザ発行前でステータスを表示しない運用のため除外する。
 */
Record({
    $id: Now.ID['report_users_review'],
    table: 'sys_report',
    data: {
        title: 'SKS 事業者ユーザ登録審査状況一覧',
        table: 'x_dent2_dentsusoke_user',
        type: 'list',
        filter: 'u_registration_status!=unregistered^ORDERBYu_registration_requested_on',
        field_list:
            'user_name,name,email,u_business_entity,u_registration_status,u_duplicate_check_result,u_registration_requested_on,u_approved_on,u_approved_by',
        user: 'GLOBAL',
        roles: [STAFF_ROLE_NAME],
        is_published: false,
    },
})

/** 事業者一覧（T01 の登録内容。中小企業判定に使う資本金・従業員数を含む） */
Record({
    $id: Now.ID['report_entities'],
    table: 'sys_report',
    data: {
        title: 'SKS 事業者一覧',
        table: 'x_dent2_dentsusoke_entity',
        type: 'list',
        filter: 'ORDERBYu_business_name',
        field_list:
            'u_business_name,u_entity_type,u_corporate_number,u_address,u_industry,u_employee_count,u_capital,u_prior_year_awarded_flag',
        user: 'GLOBAL',
        roles: [STAFF_ROLE_NAME],
        is_published: false,
    },
})

/** 問合せ対応状況一覧（SC-14 の対応実績。未回答の滞留確認にも使う） */
Record({
    $id: Now.ID['report_inquiries'],
    table: 'sys_report',
    data: {
        title: 'SKS 問合せ対応状況一覧',
        table: 'x_dent2_dentsusoke_inquiry',
        type: 'list',
        filter: 'ORDERBYu_received_on',
        field_list:
            'u_subject,u_business_entity,u_created_by_applicant,u_state,u_assigned_staff,u_received_on,u_replied_on',
        user: 'GLOBAL',
        roles: [STAFF_ROLE_NAME],
        is_published: false,
    },
})

/** お知らせ掲載一覧（SC-13 の掲載実績。公開期間・公開範囲の記録） */
Record({
    $id: Now.ID['report_notices'],
    table: 'sys_report',
    data: {
        title: 'SKS お知らせ掲載一覧',
        table: 'x_dent2_dentsusoke_notice',
        type: 'list',
        filter: 'ORDERBYDESCu_publish_start_date',
        field_list:
            'u_title,u_visibility_scope,u_priority,u_publish_start_date,u_publish_end_date,u_publish_status,u_email_notify_flag,u_created_by_staff',
        user: 'GLOBAL',
        roles: [STAFF_ROLE_NAME],
        is_published: false,
    },
})

// ---------------------------------------------------------------------------
// レポート（集計）— 報告資料に貼る件数・構成比
//
// SC-15 ダッシュボードでも同じ切り口を可視化しているが、
// ダッシュボードは画面上での把握、本レポートは資料への出力を目的とする
// （レポートは PDF／Excel へ出力でき、定期実行してメール送付もできる）。
// ---------------------------------------------------------------------------

/** 申請ステータス別件数（審査進捗の報告） */
Record({
    $id: Now.ID['report_requests_by_status'],
    table: 'sys_report',
    data: {
        title: 'SKS 申請ステータス別件数',
        table: 'x_dent2_dentsusoke_request',
        type: 'bar',
        filter: 'u_application_status!=input',
        field: 'u_application_status',
        aggregate: 'COUNT',
        user: 'GLOBAL',
        roles: [STAFF_ROLE_NAME],
        is_published: false,
    },
})

/** 従業員数区分別件数（補助上限額の内訳。公募要領の補助上限表の6区分） */
Record({
    $id: Now.ID['report_requests_by_employee'],
    table: 'sys_report',
    data: {
        title: 'SKS 申請 従業員数区分別件数',
        table: 'x_dent2_dentsusoke_request',
        type: 'pie',
        filter: 'u_application_status!=input',
        field: 'u_employee_count_category',
        aggregate: 'COUNT',
        user: 'GLOBAL',
        roles: [STAFF_ROLE_NAME],
        is_published: false,
    },
})

/** 業種別事業者数（T15 業種別基準マスタの区分ごとの分布） */
Record({
    $id: Now.ID['report_entities_by_industry'],
    table: 'sys_report',
    data: {
        title: 'SKS 事業者 業種別件数',
        table: 'x_dent2_dentsusoke_entity',
        type: 'bar',
        filter: '',
        field: 'u_industry',
        aggregate: 'COUNT',
        user: 'GLOBAL',
        roles: [STAFF_ROLE_NAME],
        is_published: false,
    },
})
