import '@servicenow/sdk/global'
import { Applicability, UxListMenuConfig } from '@servicenow/sdk/core'
import { staffRole, staffAdminRole, systemAdminRole } from '../../roles/roles.now'

/**
 * 事務局ワークスペースのナビゲーション（リスト）定義
 *
 * SC-11 ユーザ登録審査画面（プロビジョニング）を、ワークスペースの
 * 「ユーザ管理」カテゴリのリストとして提供する。
 *
 * 画面設計書 SC-11 ②表示項目一覧 D1（事業者名／法人番号／重複チェック結果／ステータス／操作）に対応する。
 *   ・事業者名   … u_business_entity（T01 の表示項目 u_business_name）
 *   ・法人番号   … u_business_entity.u_corporate_number（参照先のドットウォーク）
 *   ・ステータス … u_registration_status（業務フロー「ユーザー登録ステータス一覧」の事務局用ステータス）
 *   ・操作       … 承認／却下／不備修正を依頼は UI Action としてレコードフォームに表示する
 *                  （src/fluent/ui-actions/registration-review-actions.now.ts）
 */

/** ワークスペースの対象利用者（権限設計書 5章：SC-11 は staff ○／staff_admin ○） */
export const staffApplicability = Applicability({
    $id: Now.ID['sks_staff_applicability'],
    name: 'SKS 事務局ユーザ',
    roles: [staffRole, staffAdminRole],
})

/** SC-12 の閲覧範囲（権限設計書 5章：SC-12 は staff × ／staff_admin ○／system_admin ○） */
export const staffAdminApplicability = Applicability({
    $id: Now.ID['sks_staff_admin_applicability'],
    name: 'SKS 事務局管理者・システム管理者',
    roles: [staffAdminRole, systemAdminRole],
})

/**
 * ロール割当の操作範囲（権限設計書 6章：SC-12「ロール変更」は system_admin）
 *
 * 権限設計書 7章では staff_admin を「新規追加のみ可・ロール変更は system_admin」としているが、
 * プラットフォームの OOTB ロール user_admin は「ユーザー管理」を一括で許可するため、
 * 新規追加だけを許可してロール変更のみ除外することができない。
 * そのため本実装では新規追加・ロール変更をいずれも system_admin に限定し、
 * staff_admin は一覧の参照のみとする。
 * TODO(A20): 事務局内の役割分離の権限粒度が未確定。確定後に本切り分けを見直す。
 */
export const systemAdminApplicability = Applicability({
    $id: Now.ID['sks_system_admin_applicability'],
    name: 'SKS システム管理者',
    roles: [systemAdminRole],
})

/** 一覧の表示列（D1）。事業者名は参照フィールドの表示値、法人番号はドットウォークで取得する。 */
const REVIEW_COLUMNS =
    'user_name,u_business_entity,u_business_entity.u_corporate_number,u_duplicate_check_result,u_registration_status,u_registration_requested_on'

/** SC-13 お知らせ一覧の表示列（T10 の主要項目。作成者・更新日時は編集の追跡用） */
const NOTICE_COLUMNS =
    'u_title,u_visibility_scope,u_priority,u_publish_start_date,u_publish_end_date,u_publish_status,u_email_notify_flag,u_created_by_staff,sys_updated_on'

/** SC-14 問合せ一覧の表示列（T12 の主要項目。本文・回答本文は詳細フォームで確認する） */
const INQUIRY_COLUMNS =
    'u_subject,u_business_entity,u_created_by_applicant,u_state,u_assigned_staff,u_received_on,u_replied_on'

/** SC-16 業種別基準マスタの表示列（T15 の全項目） */
const INDUSTRY_COLUMNS = 'u_order,u_code,u_name,u_capital_limit,u_employee_limit,u_active'

/** SC-16 補助上限額マスタの表示列 */
const CAP_COLUMNS = 'u_order,u_code,u_employee_count_category,u_special_measure_flag,u_cap_amount,u_active'

/** SC-16 補助率マスタの表示列（補助率は分子・分母の整数で保持する） */
const RATE_COLUMNS =
    'u_order,u_code,u_employee_count_category,u_rate_numerator,u_rate_denominator,u_active,u_note'

/** SC-16 対象経費区分マスタの表示列（対象範囲は本文が長いため詳細フォームで確認する） */
const EXPENSE_COLUMNS = 'u_order,u_code,u_name,u_has_daily_cap,u_active'

/** SC-16 専門家経費日額上限マスタの表示列 */
const EXPERT_FEE_COLUMNS = 'u_order,u_code,u_name,u_daily_cap_amount,u_active'

/**
 * SC-17 申請帳票の掲載項目（T03 の識別・規模・審査状況・金額）。
 * レポート定義（src/fluent/reports/staff-reports.now.ts）の field_list と同じ並びにそろえ、
 * 一覧からのエクスポートとレポート出力で同じ帳票になるようにする。
 */
const REQUEST_COLUMNS =
    'u_application_number,u_business_entity,u_applicant_user,u_organization_type,u_employee_count_category,u_application_status,u_submitted_on,u_subsidy_cap_amount,u_subsidy_rate,u_total_expense_amount'

/** SC-17 事業者帳票の掲載項目（T01 の登録内容。中小企業判定に使う資本金・従業員数を含む） */
const ENTITY_REPORT_COLUMNS =
    'u_business_name,u_entity_type,u_corporate_number,u_address,u_industry,u_employee_count,u_capital,u_prior_year_awarded_flag'

/**
 * ITCOM-06 一次審査の対象一覧の表示列。
 *
 * 画面イメージの列（申請番号／事業者／従業員数区分／対象経費／補助金額／ステータス／
 * 提出日／経過／担当者）に対応する。
 *
 * 「経過」は一覧で算出できないため、審査期限（u_review_due_on）を出して
 * 期限超過は別の一覧で絞り込む。
 * 「補助金額」は u_subsidy_amount として保持しているため一覧に出せる
 * （画面イメージの時点では保存列が無く「一覧では表示できない」と注記されていた）。
 */
const REVIEW_TARGET_COLUMNS =
    'u_application_number,u_business_entity,u_employee_count_category,u_total_expense_amount,u_subsidy_amount,u_application_status,u_submitted_on,u_review_due_on,u_review_assigned_to'

/**
 * ITCOM-08 信用調査の一覧の表示列。
 *
 * 申請番号・事業者は調査レコードからドットウォークで取得する
 * （どの申請の調査かが一覧で分からないと督促の対象を特定できない）。
 * 回次は再調査を区別するために表示する。
 */
const CREDIT_COLUMNS =
    'u_request.u_application_number,u_request.u_business_entity,u_sequence,u_agency,u_state,u_requested_on,u_due_on,u_result,u_received_on'

export const staffListConfig = UxListMenuConfig({
    $id: Now.ID['sks_staff_list_config'],
    name: 'SKS 事務局ワークスペース リスト設定',
    description:
        'SC-11 ユーザ登録審査／SC-12 事務局ユーザ管理／SC-13 お知らせ作成・編集／SC-14 問合せ管理・返信／SC-16 マスタメンテナンス／SC-17 帳票・レポート出力のリスト定義',
    categories: [
        {
            $id: Now.ID['sks_category_user_admin'],
            title: 'ユーザ管理',
            order: 100,
            lists: [
                {
                    // 事務局の対応が必要なもの（既定で最初に表示される）
                    $id: Now.ID['sks_list_review_pending'],
                    title: '登録審査：要対応',
                    order: 100,
                    table: 'x_dent2_dentsusoke_user',
                    condition: 'u_registration_statusINreview,defect_request,defect_fixing^EQ',
                    columns: REVIEW_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_review_pending_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 承認・却下・不備修正の依頼を実行できるステータス
                    $id: Now.ID['sks_list_review_waiting'],
                    title: '登録申請審査中',
                    order: 200,
                    table: 'x_dent2_dentsusoke_user',
                    condition: 'u_registration_status=review^EQ',
                    columns: REVIEW_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_review_waiting_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // Q04（決定済）「曖昧一致のみ事務局確認」に該当するもの
                    $id: Now.ID['sks_list_review_duplicate'],
                    title: '重複あり（要確認）',
                    order: 300,
                    table: 'x_dent2_dentsusoke_user',
                    condition: 'u_duplicate_check_result=duplicate_review^u_registration_status=review^EQ',
                    columns: REVIEW_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_review_duplicate_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 未登録（ユーザ発行前）は画面にステータスを表示しない運用のため対象外とする
                    $id: Now.ID['sks_list_users_all'],
                    title: '事業者ユーザ（すべて）',
                    order: 400,
                    table: 'x_dent2_dentsusoke_user',
                    condition: 'u_registration_status!=unregistered^EQ',
                    columns: REVIEW_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_users_all_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 審査時に法人番号・所在地等を突合するための参照用リスト
                    $id: Now.ID['sks_list_entities'],
                    title: '事業者',
                    order: 500,
                    table: 'x_dent2_dentsusoke_entity',
                    condition: '',
                    columns:
                        'u_business_name,u_entity_type,u_corporate_number,u_industry,u_employee_count,u_prior_year_awarded_flag',
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_entities_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
            ],
        },
        // -------------------------------------------------------------------
        // SC-12 事務局ユーザ管理画面（ロール別権限管理処理：処理No.51）
        //
        // 画面設計書 SC-12 ①レイアウト構成
        //   サイドナビ＋事務局ユーザ一覧テーブル（氏名／メールアドレス／ロール／状態）、
        //   右上に「＋新規ユーザ追加」ボタン。
        //
        // 事務局ユーザは標準の sys_user をそのまま利用し（テーブル定義書 sys_user 活用方針）、
        // ロールは sys_user_has_role で管理する。したがって一覧は2本に分ける。
        //   ・ロール割当（sys_user_has_role）… 画面イメージの4列に対応。③No.2「ロール変更」の操作対象
        //   ・ユーザーアカウント（sys_user）  … ③No.1「＋新規ユーザ追加」の操作対象
        //
        // ③アクションは専用ボタンを設けず、ワークスペース標準の「新規」とレコードフォームの
        // 編集で実現する（処理No.51 はロード時のアクセス制御適用であり、独自の遷移処理を持たない）。
        // -------------------------------------------------------------------
        {
            $id: Now.ID['sks_category_staff_admin'],
            title: '事務局ユーザ管理',
            order: 200,
            lists: [
                {
                    // 画面イメージの一覧に対応：氏名（user）／メールアドレス（user.email）／ロール（role）／状態（state）
                    $id: Now.ID['sks_list_role_assignments'],
                    title: '事務局ユーザ（ロール割当）',
                    order: 100,
                    table: 'sys_user_has_role',
                    condition: 'role.nameSTARTSWITHx_dent2_dentsusoke^ORDERBYuser.name^EQ',
                    columns: 'user,user.email,role,state,user.active',
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_role_assignments_app'],
                            applicability: systemAdminApplicability,
                        },
                        {
                            $id: Now.ID['sks_list_role_assignments_app_staff'],
                            applicability: staffAdminApplicability,
                        },
                    ],
                },
                {
                    /**
                     * ③No.1「＋新規ユーザ追加」の操作対象。
                     *
                     * TODO(要確認): sys_user には事務局ユーザを識別する項目がないため
                     * （事務局ユーザは標準の sys_user をそのまま利用する方針）、
                     * 事務局ユーザのみへの絞り込みができない。本リストは
                     * 事業者ユーザ（sys_class_name=x_dent2_dentsusoke_user）を除いた
                     * 有効なユーザーアカウント全件を表示する。
                     * 絞り込みが必要な場合は、識別用のグループ（sys_user_group）を設けて
                     * 所属で絞る方式などを別途検討する。
                     */
                    $id: Now.ID['sks_list_user_accounts'],
                    title: 'ユーザーアカウント（新規追加）',
                    order: 200,
                    table: 'sys_user',
                    condition: 'sys_class_name=sys_user^active=true^ORDERBYname^EQ',
                    columns: 'name,user_name,email,title,active',
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_user_accounts_app'],
                            applicability: systemAdminApplicability,
                        },
                        {
                            $id: Now.ID['sks_list_user_accounts_app_staff'],
                            applicability: staffAdminApplicability,
                        },
                    ],
                },
                {
                    // 付与できるロールの確認用（権限設計書 2章のロール定義）
                    $id: Now.ID['sks_list_roles'],
                    title: 'ロール定義',
                    order: 300,
                    table: 'sys_user_role',
                    condition: 'nameSTARTSWITHx_dent2_dentsusoke^ORDERBYname^EQ',
                    columns: 'name,description,sys_scope',
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_roles_app'],
                            applicability: systemAdminApplicability,
                        },
                        {
                            $id: Now.ID['sks_list_roles_app_staff'],
                            applicability: staffAdminApplicability,
                        },
                    ],
                },
            ],
        },
        // -------------------------------------------------------------------
        // SC-13 お知らせ作成・編集画面（事務局）
        //   公開範囲設定処理（処理No.40）／公開期間設定処理（処理No.41）
        //
        // ①レイアウト構成
        //   サイドナビ＋お知らせ一覧テーブル、右上に「＋新規」（ワークスペース標準）。
        //   作成・編集フォームの項目構成は src/fluent/forms/notice-form.now.ts で定義する。
        //
        // ③アクション
        //   ・作成／保存／削除 … ワークスペース標準のボタン（削除は ACL により staff_admin のみ）
        //   ・公開する／非公開にする … src/fluent/ui-actions/notice-actions.now.ts
        //
        // 一覧の絞込は公開状態（u_publish_status）のみで行い、公開期間との突合は行わない。
        // 日付項目（yyyy-mm-dd）に対する javascript:gs.beginningOfToday() 等の相対日付は
        // 日時形式の値との比較となり境界日の判定が保証されないため、
        // 公開期間の評価は事業者ポータル側の NoticeUtil.applyVisibilityQuery に集約する。
        // -------------------------------------------------------------------
        {
            $id: Now.ID['sks_category_notice_admin'],
            title: 'お知らせ管理',
            order: 300,
            lists: [
                {
                    // 掲載中のお知らせ（公開期間内かどうかは公開開始日・公開終了日の列で確認する）
                    $id: Now.ID['sks_list_notices_published'],
                    title: 'お知らせ（公開）',
                    order: 100,
                    table: 'x_dent2_dentsusoke_notice',
                    condition: 'u_publish_status=published^ORDERBYDESCu_publish_start_date^EQ',
                    columns: NOTICE_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_notices_published_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 作成途中・公開前および取り下げ済み（公開待ちの作業対象）
                    $id: Now.ID['sks_list_notices_private'],
                    title: 'お知らせ（非公開）',
                    order: 200,
                    table: 'x_dent2_dentsusoke_notice',
                    condition: 'u_publish_status=private^ORDERBYDESCsys_updated_on^EQ',
                    columns: NOTICE_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_notices_private_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    $id: Now.ID['sks_list_notices_all'],
                    title: 'お知らせ（すべて）',
                    order: 300,
                    table: 'x_dent2_dentsusoke_notice',
                    condition: 'ORDERBYDESCsys_updated_on^EQ',
                    columns: NOTICE_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_notices_all_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
            ],
        },
        // -------------------------------------------------------------------
        // SC-14 問合せ管理・返信画面（事務局）
        //   問合せ返信処理（処理No.47）
        //
        // ①レイアウト構成
        //   サイドナビ＋問合せ一覧テーブル（件名／事業者／起票者／状態／対応者／受付日時）。
        //   詳細・返信フォームの項目構成は src/fluent/forms/inquiry-form.now.ts で定義する。
        //
        // ③アクション
        //   ・返信する／自分が対応する／未回答に戻す … src/fluent/ui-actions/inquiry-actions.now.ts
        //   ・削除は ACL を付与していないため実行できない（問合せは物理削除しない方針）
        //
        // 未回答は受付日時の昇順（古い順）で並べ、滞留している問合せが先頭に来るようにする。
        // -------------------------------------------------------------------
        {
            $id: Now.ID['sks_category_inquiry_admin'],
            title: '問合せ管理',
            order: 400,
            lists: [
                {
                    // 事務局の対応が必要なもの（受付が古い順＝滞留しているものから対応する）
                    $id: Now.ID['sks_list_inquiries_open'],
                    title: '問合せ（未回答）',
                    order: 100,
                    table: 'x_dent2_dentsusoke_inquiry',
                    condition: 'u_state=open^ORDERBYu_received_on^EQ',
                    columns: INQUIRY_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_inquiries_open_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 「自分が対応する」で対応者に設定した問合せ（未回答を先に表示する）
                    $id: Now.ID['sks_list_inquiries_mine'],
                    title: '問合せ（自分の担当）',
                    order: 200,
                    table: 'x_dent2_dentsusoke_inquiry',
                    condition: 'u_assigned_staff=javascript:gs.getUserID()^ORDERBYu_state^ORDERBYu_received_on^EQ',
                    columns: INQUIRY_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_inquiries_mine_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    $id: Now.ID['sks_list_inquiries_answered'],
                    title: '問合せ（回答済）',
                    order: 300,
                    table: 'x_dent2_dentsusoke_inquiry',
                    condition: 'u_state=answered^ORDERBYDESCu_replied_on^EQ',
                    columns: INQUIRY_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_inquiries_answered_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    $id: Now.ID['sks_list_inquiries_all'],
                    title: '問合せ（すべて）',
                    order: 400,
                    table: 'x_dent2_dentsusoke_inquiry',
                    condition: 'ORDERBYDESCsys_updated_on^EQ',
                    columns: INQUIRY_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_inquiries_all_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
            ],
        },
        // -------------------------------------------------------------------
        // ITCOM-06 一次審査：対象一覧（事務局）
        //
        // ①レイアウト構成
        //   サイドナビ＋一次審査の対象一覧。画面イメージ ITCOM-06 に対応する。
        //
        // ②絞込
        //   u_application_status IN accepted,first_review,defect_answered,re_review
        //   受付済・一次審査中・不備修正回答あり・再審査中が事務局の対応対象。
        //
        // ③アクション
        //   「自分が審査を担当する」… src/fluent/ui-actions/application-review-actions.now.ts
        //   判定（一次審査完了／不備確認依頼／不採択）は ITCOM-07 の範囲。
        //
        // ■ 「経過」列について
        // 画面イメージは提出日からの経過日数を表示し、審査期限（仮30日）超過を赤字にしている。
        // 一覧は列の値しか表示できず経過日数を算出できないため、提出時に審査期限
        // （u_review_due_on＝提出日＋SLA日数）を確定させ、期限超過は別の一覧で絞り込む方式にした。
        // 色分けは u_application_status の sys_ui_style で行う
        // （src/fluent/styles/application-review-styles.now.ts）。
        //
        // ■ 信用調査（ITCOM-08）・採択判定（ITCOM-09）の一覧
        // 画面イメージのサイドナビには並んでいるが、それぞれの画面の実装時に追加する。
        // 遷移させる処理が無い状態で一覧だけを置くと、常に0件の一覧が並ぶことになる。
        // -------------------------------------------------------------------
        {
            $id: Now.ID['sks_category_review'],
            title: '申請審査',
            order: 450,
            lists: [
                {
                    /**
                     * 事務局の対応が必要な申請（既定で最初に表示される）。
                     * 審査期限の近いものから対応できるよう期限の昇順で並べる。
                     * 期限が未設定の申請（提出時に期限を設定する前のデータ）は先頭に並ぶ。
                     */
                    $id: Now.ID['sks_list_review_targets'],
                    title: '一次審査：要対応',
                    order: 100,
                    table: 'x_dent2_dentsusoke_request',
                    condition:
                        'u_application_statusINaccepted,first_review,defect_answered,re_review^ORDERBYu_review_due_on^EQ',
                    columns: REVIEW_TARGET_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_review_targets_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    /**
                     * 担当が未設定のもの。着手されずに滞留している申請を拾う。
                     * 「自分が審査を担当する」の操作対象。
                     */
                    $id: Now.ID['sks_list_review_unassigned'],
                    title: '一次審査：担当未割当',
                    order: 200,
                    table: 'x_dent2_dentsusoke_request',
                    condition:
                        'u_application_statusINaccepted,defect_answered^u_review_assigned_toISEMPTY^ORDERBYu_submitted_on^EQ',
                    columns: REVIEW_TARGET_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_review_unassigned_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 自分が引き受けた申請（審査中のものを先に表示する）
                    $id: Now.ID['sks_list_review_mine'],
                    title: '一次審査：自分の担当',
                    order: 300,
                    table: 'x_dent2_dentsusoke_request',
                    condition:
                        'u_review_assigned_to=javascript:gs.getUserID()^u_application_statusINaccepted,first_review,defect_answered,re_review^ORDERBYu_review_due_on^EQ',
                    columns: REVIEW_TARGET_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_review_mine_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    /**
                     * 審査期限を過ぎた申請（画面イメージの「経過」の赤字に相当）。
                     *
                     * u_review_due_on は日付型（yyyy-MM-dd）のため、
                     * 日時形式を返す gs.beginningOfToday() との比較は境界日の判定が保証されない。
                     * そのため日付を返す gs.daysAgo(0)（当日の日付）と比較する。
                     * 当日は超過扱いにしない（期限日中の審査を認める）。
                     */
                    $id: Now.ID['sks_list_review_overdue'],
                    title: '一次審査：期限超過',
                    order: 400,
                    table: 'x_dent2_dentsusoke_request',
                    condition:
                        'u_application_statusINaccepted,first_review,defect_answered,re_review^u_review_due_on<javascript:gs.daysAgo(0)^ORDERBYu_review_due_on^EQ',
                    columns: REVIEW_TARGET_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_review_overdue_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                /**
                 * ITCOM-08 信用調査の一覧。
                 *
                 * 要否判定は申請（T03）側の操作、依頼・結果取込は調査レコード側の操作のため
                 * 一覧を分けている（UI Action はフォームの入力値を読むため、
                 * 入力欄があるテーブルのレコードを開く必要がある）。
                 */
                {
                    // 一次審査が完了し、信用調査の要否を判定する対象
                    $id: Now.ID['sks_list_credit_judging'],
                    title: '信用調査：要否判定',
                    order: 500,
                    table: 'x_dent2_dentsusoke_request',
                    condition:
                        'u_application_statusINfirst_review_done,credit_judging^ORDERBYu_reviewed_on^EQ',
                    columns: REVIEW_TARGET_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_credit_judging_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 依頼前・依頼中・結果受領の調査（事務局の対応対象）
                    $id: Now.ID['sks_list_credit_open'],
                    title: '信用調査：対応中',
                    order: 600,
                    table: 'x_dent2_dentsusoke_credit',
                    condition: 'u_stateINpreparing,requested,received^ORDERBYu_due_on^EQ',
                    columns: CREDIT_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_credit_open_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    /**
                     * 回答予定日を過ぎても結果が届いていない調査（督促の対象）。
                     *
                     * u_due_on は日付型（yyyy-MM-dd）のため、日時形式を返す
                     * gs.beginningOfToday() との比較は境界日の判定が保証されない。
                     * そのため日付を返す gs.daysAgo(0)（当日の日付）と比較する。
                     */
                    $id: Now.ID['sks_list_credit_overdue'],
                    title: '信用調査：回答予定日超過',
                    order: 700,
                    table: 'x_dent2_dentsusoke_credit',
                    condition: 'u_state=requested^u_due_on<javascript:gs.daysAgo(0)^ORDERBYu_due_on^EQ',
                    columns: CREDIT_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_credit_overdue_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                /**
                 * ITCOM-09 採択判定の対象。
                 * 信用調査が済んだ申請（結果確認中）と免除された申請が対象になる。
                 * 確定操作は事務局管理者のみ実行できるが（権限設計書 A20）、
                 * 状況の把握は事務局ユーザにも必要なため一覧は staff へ表示する。
                 */
                {
                    $id: Now.ID['sks_list_award_pending'],
                    title: '採択判定：要対応',
                    order: 750,
                    table: 'x_dent2_dentsusoke_request',
                    condition:
                        'u_application_statusINresult_checking,credit_exempt^ORDERBYu_credit_judged_on^EQ',
                    columns: REVIEW_TARGET_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_award_pending_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 取消を含む全件（再調査の履歴を追う）
                    $id: Now.ID['sks_list_credit_all'],
                    title: '信用調査（すべて）',
                    order: 800,
                    table: 'x_dent2_dentsusoke_credit',
                    condition: 'ORDERBYDESCsys_updated_on^EQ',
                    columns: CREDIT_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_credit_all_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 事務局へ到達した申請の全件（申請入力中は事務局へ未到達のため除外）
                    $id: Now.ID['sks_list_review_all'],
                    title: '申請（すべて）',
                    order: 900,
                    table: 'x_dent2_dentsusoke_request',
                    condition: 'u_application_status!=input^ORDERBYDESCu_submitted_on^EQ',
                    columns: REVIEW_TARGET_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_review_all_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
            ],
        },
        // -------------------------------------------------------------------
        // SC-16 マスタメンテナンス画面（事務局）
        //
        // ①レイアウト構成
        //   サイドナビ＋マスタ一覧テーブル、右上に「＋新規」（ワークスペース標準）。
        //   追加・編集フォームの項目構成は src/fluent/forms/industry-form.now.ts で定義する。
        //
        // ②対象マスタ（5マスタ）
        //   T15 業種別基準マスタ       … T01 事業者の業種の参照先
        //   補助上限額マスタ           … 補助金額自動判定処理（処理No.17）
        //   補助率マスタ               … 補助金額自動判定処理（処理No.17）
        //   対象経費区分マスタ         … 対象経費登録処理（処理No.18）
        //   専門家経費日額上限マスタ   … 対象経費区分「専門家経費」に適用
        //
        //   T15 以外の4マスタはテーブル定義書に定義が無く、T03 申請の項目
        //   （u_employee_count_category／u_special_measure_flag／u_subsidy_cap_amount／
        //   u_subsidy_rate／u_total_expense_amount）と処理No.17／18 から構成を組み立てている。
        //   基準値は各マスタの初期データ（src/fluent/master-data/）の TODO を参照。
        //
        //   これらのマスタを参照して金額を判定する処理（処理No.17／18）は
        //   ITCOM 主担当の申請機能側の範囲であり、本スライスではマスタの保守画面のみを提供する。
        //
        // ③権限
        //   権限設計書 2章でマスタメンテナンス（追加・変更）はシステム管理者の担当だが、
        //   参照は事務局ユーザにも必要である（審査時の基準確認。
        //   src/fluent/acls/master-acls.now.ts で staff に read を付与している）。
        //
        //   当初は一覧の表示対象を systemAdminApplicability のみとし、事務局ユーザは
        //   「事業者レコードの業種から辿る運用」としていたが、補助上限額・補助率・対象経費区分・
        //   専門家経費日額上限は事業者レコードから辿れないため、参照する手段が無かった。
        //   そのため各一覧に staffApplicability を追加する。
        //
        //   一覧を分けずに表示対象だけを広げるのは、追加・変更の抑止を ACL に一元化するため。
        //   ワークスペースの一覧は create／write の ACL に従って「＋新規」ボタンと
        //   インライン編集を制御するため、事務局ユーザには参照専用として表示される。
        // -------------------------------------------------------------------
        {
            $id: Now.ID['sks_category_master_admin'],
            title: 'マスタメンテナンス',
            order: 500,
            lists: [
                {
                    // 運用中の業種（ポータルの業種選択に表示される対象）
                    $id: Now.ID['sks_list_industries_active'],
                    title: '業種別基準マスタ（有効）',
                    order: 100,
                    table: 'x_dent2_dentsusoke_industry',
                    condition: 'u_active=true^ORDERBYu_order^EQ',
                    columns: INDUSTRY_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_industries_active_app'],
                            applicability: systemAdminApplicability,
                        },
                        {
                            $id: Now.ID['sks_list_industries_active_app_staff'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 無効化した業種を含む全件（過去データが参照している業種の確認用）
                    $id: Now.ID['sks_list_industries_all'],
                    title: '業種別基準マスタ（すべて）',
                    order: 200,
                    table: 'x_dent2_dentsusoke_industry',
                    condition: 'ORDERBYu_order^EQ',
                    columns: INDUSTRY_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_industries_all_app'],
                            applicability: systemAdminApplicability,
                        },
                        {
                            $id: Now.ID['sks_list_industries_all_app_staff'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    /**
                     * 補助上限額マスタ（補助金額自動判定処理：処理No.17）。
                     * 従業員数区分 × 特例措置の12件を一覧で見比べられるよう、
                     * 特例措置の有無・従業員数区分の順で並べる。
                     */
                    $id: Now.ID['sks_list_caps'],
                    title: '補助上限額マスタ',
                    order: 300,
                    table: 'x_dent2_dentsusoke_cap',
                    condition: 'ORDERBYu_order^EQ',
                    columns: CAP_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_caps_app'],
                            applicability: systemAdminApplicability,
                        },
                        {
                            $id: Now.ID['sks_list_caps_app_staff'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 補助率マスタ（補助金額自動判定処理：処理No.17）
                    $id: Now.ID['sks_list_rates'],
                    title: '補助率マスタ',
                    order: 400,
                    table: 'x_dent2_dentsusoke_rate',
                    condition: 'ORDERBYu_order^EQ',
                    columns: RATE_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_rates_app'],
                            applicability: systemAdminApplicability,
                        },
                        {
                            $id: Now.ID['sks_list_rates_app_staff'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 対象経費区分マスタ（対象経費登録処理：処理No.18）
                    $id: Now.ID['sks_list_expenses'],
                    title: '対象経費区分マスタ',
                    order: 500,
                    table: 'x_dent2_dentsusoke_expense',
                    condition: 'ORDERBYu_order^EQ',
                    columns: EXPENSE_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_expenses_app'],
                            applicability: systemAdminApplicability,
                        },
                        {
                            $id: Now.ID['sks_list_expenses_app_staff'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 専門家経費日額上限マスタ（対象経費区分「専門家経費」に適用される）
                    $id: Now.ID['sks_list_expert_fees'],
                    title: '専門家経費日額上限マスタ',
                    order: 600,
                    table: 'x_dent2_dentsusoke_expert_fee',
                    condition: 'ORDERBYu_order^EQ',
                    columns: EXPERT_FEE_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_expert_fees_app'],
                            applicability: systemAdminApplicability,
                        },
                        {
                            $id: Now.ID['sks_list_expert_fees_app_staff'],
                            applicability: staffApplicability,
                        },
                    ],
                },
            ],
        },
        // -------------------------------------------------------------------
        // SC-17 帳票／レポート出力画面（事務局）
        //
        // ①レイアウト構成
        //   サイドナビ＋帳票の一覧テーブル。一覧の右上メニューから
        //   Excel／CSV／PDF へエクスポートして出力する（プラットフォーム標準機能）。
        //   画面上で条件を絞ってからそのまま出力できるため、日常の出力はこの経路を使う。
        //
        // ②本カテゴリに置く一覧
        //   申請系の帳票と事業者一覧を置く。
        //   ユーザ登録審査状況・問合せ・お知らせは他カテゴリの一覧から同じ操作で出力できるため、
        //   同じ一覧を重複して置かない（レポート定義側には帳票として用意している）。
        //
        //   掲載項目はレポート定義（src/fluent/reports/staff-reports.now.ts）の field_list と
        //   同じ並びにそろえ、どちらの経路でも同じ帳票になるようにしている。
        //
        // ③出力条件を保存して繰り返し使う場合
        //   レポート定義（sys_report）を使う。PDF／Excel への出力、定期実行してのメール送付、
        //   ダッシュボードへの掲載に再利用できる。
        //
        // 申請（T03）は SC-11〜SC-16 のいずれの画面でも扱っていなかったため、
        // 本カテゴリの追加に合わせてワークスペースの対象テーブルへ追加している
        // （workspace.now.ts の tables）。事務局は参照のみ可（ACL に write を付与していない）。
        // -------------------------------------------------------------------
        {
            $id: Now.ID['sks_category_reports'],
            title: '帳票／レポート',
            order: 600,
            lists: [
                {
                    // 事務局へ到達した申請の全件（申請入力中は事務局へ未到達のため除外）
                    $id: Now.ID['sks_list_report_requests'],
                    title: '申請一覧（受付済）',
                    order: 100,
                    table: 'x_dent2_dentsusoke_request',
                    condition: 'u_application_status!=input^ORDERBYu_application_number^EQ',
                    columns: REQUEST_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_report_requests_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 採択結果の公表・報告に使う
                    $id: Now.ID['sks_list_report_awarded'],
                    title: '採択者一覧（申請審査完了）',
                    order: 200,
                    table: 'x_dent2_dentsusoke_request',
                    condition: 'u_application_status=review_done^ORDERBYu_application_number^EQ',
                    columns: REQUEST_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_report_awarded_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    // 終端状態のうち採択に至らなかったもの
                    $id: Now.ID['sks_list_report_rejected'],
                    title: '不採択・取下げ一覧',
                    order: 300,
                    table: 'x_dent2_dentsusoke_request',
                    condition: 'u_application_statusINrejected,withdrawn^ORDERBYu_application_number^EQ',
                    columns: REQUEST_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_report_rejected_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
                {
                    /**
                     * 事業者一覧（帳票用）。
                     * 「ユーザ管理」カテゴリの「事業者」一覧は審査時の突合用に法人番号・所在地を
                     * 中心に並べているが、こちらは帳票として資本金・前年度採択情報まで含める。
                     */
                    $id: Now.ID['sks_list_report_entities'],
                    title: '事業者一覧',
                    order: 400,
                    table: 'x_dent2_dentsusoke_entity',
                    condition: 'ORDERBYu_business_name^EQ',
                    columns: ENTITY_REPORT_COLUMNS,
                    applicabilities: [
                        {
                            $id: Now.ID['sks_list_report_entities_app'],
                            applicability: staffApplicability,
                        },
                    ],
                },
            ],
        },
    ],
})
