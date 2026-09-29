import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'
import { applicantRole, staffRole } from '../roles/roles.now'

/**
 * マイページ（SC-05）動作確認用のデモデータ。
 * すべて $meta.installMethod: 'demo' を指定しているため、デモデータを取り込まない環境には投入されない。
 *
 * 内容は画面イメージ（成果物No.5）SC-05 のモックに合わせている。
 * 確認手順：admin で demo ユーザ（sks.demo）を impersonate し、ポータルのマイページを開く。
 *   ※ ロール付与（x_dent2_dentsusoke.applicant）は下部の sys_user_has_role で行っている。
 */

/**
 * 事務局ユーザ（お知らせの作成者 u_created_by_staff の参照先）
 *
 * トンマナ 3.4.1「sys_id のハードコード禁止」に対応し、OOTB の admin ユーザの sys_id を直接記述する
 * 代わりにデモ用の事務局ユーザを定義して参照する。事務局ユーザは事業者ユーザ拡張テーブルではなく
 * 標準の sys_user をそのまま利用する（テーブル定義書 T02 の sys_user 活用方針）。
 *
 * パスワードは設定しないため直接ログインはできない。画面確認は admin からの impersonate で行う。
 */
export const demoStaffUser = Record({
    $id: Now.ID['demo_user_staff'],
    $meta: { installMethod: 'demo' },
    table: 'sys_user',
    data: {
        user_name: 'sks.staff',
        first_name: '花子',
        last_name: '事務局',
        email: 'sks.staff@example.co.jp',
        active: true,
    },
})

/** T01 事業者 */
export const demoEntity = Record({
    $id: Now.ID['demo_entity_sample'],
    $meta: { installMethod: 'demo' },
    table: 'x_dent2_dentsusoke_entity',
    data: {
        u_business_name: '株式会社サンプル',
        u_entity_type: 'corporate',
        u_corporate_number: '1234567890123',
        u_address: '東京都千代田区丸の内1-2-3',
        u_industry: 'service',
        u_employee_count: 12,
        u_capital: 5000,
        u_prior_year_awarded_flag: false,
    },
})

/** T02 事業者ユーザ（sys_user 拡張） */
export const demoApplicantUser = Record({
    $id: Now.ID['demo_user_applicant'],
    $meta: { installMethod: 'demo' },
    table: 'x_dent2_dentsusoke_user',
    data: {
        user_name: 'sks.demo',
        first_name: '太郎',
        last_name: '事業',
        email: 'sks.demo@example.co.jp',
        active: true,
        u_business_entity: demoEntity,
        u_user_type: 'manager',
        u_registration_status: 'registered',
        u_duplicate_check_result: 'no_duplicate',
        u_auth_method: 'standard',
        u_mfa_enabled: false,
    },
})

/** T10 お知らせ（公開中3件） */
export const demoNoticeFirstReview = Record({
    $id: Now.ID['demo_notice_first_review'],
    $meta: { installMethod: 'demo' },
    table: 'x_dent2_dentsusoke_notice',
    data: {
        u_title: '一次審査の開始について',
        u_body: '<p>一次審査を開始しました。審査状況はマイページの申請状況からご確認ください。</p>',
        u_visibility_scope: 'all',
        u_publish_start_date: '2026-08-10',
        u_publish_end_date: '2026-12-31',
        u_priority: 'high',
        u_email_notify_flag: true,
        u_publish_status: 'published',
        u_created_by_staff: demoStaffUser,
    },
})

export const demoNoticeDocumentFormat = Record({
    $id: Now.ID['demo_notice_document_format'],
    $meta: { installMethod: 'demo' },
    table: 'x_dent2_dentsusoke_notice',
    data: {
        u_title: '提出書類フォーマット変更のご案内',
        u_body: '<p>経費明細書のフォーマットを変更しました。最新版をご利用ください。</p>',
        u_visibility_scope: 'all',
        u_publish_start_date: '2026-08-05',
        u_publish_end_date: '2026-12-31',
        u_priority: 'middle',
        u_email_notify_flag: true,
        u_publish_status: 'published',
        u_created_by_staff: demoStaffUser,
    },
})

export const demoNoticeMaintenance = Record({
    $id: Now.ID['demo_notice_maintenance'],
    $meta: { installMethod: 'demo' },
    table: 'x_dent2_dentsusoke_notice',
    data: {
        u_title: 'システムメンテナンスのお知らせ',
        u_body: '<p>下記の時間帯は申請ポータルを停止します。</p>',
        u_visibility_scope: 'all',
        u_publish_start_date: '2026-08-01',
        u_publish_end_date: '2026-12-31',
        u_priority: 'low',
        u_email_notify_flag: false,
        u_publish_status: 'published',
        u_created_by_staff: demoStaffUser,
    },
})

/**
 * T03 申請のデモデータ（APP-2026-00123）は削除した。
 *
 * 申請の入力から提出までの画面（ITCOM-01〜03）が実装され、
 * 事業者が自分で申請を作れるようになったため、
 * 補助金額の算出を経ていない手置きのデモ申請を残す必要がなくなった。
 * 手置きのデータは対象経費明細（x_dent2_dentsusoke_exp_item）も
 * 提出書類（x_dent2_dentsusoke_req_doc）も持たないため、
 * かえって画面の動作確認の妨げになる。
 *
 * インスタンスに投入済みのレコードはインストールでは削除されないため、
 * src/server/fix-scripts/remove-demo-request.js で削除している。
 *
 * ■ マスタデータのコメントについて
 * 補助上限額マスタ・補助率マスタのコメントは
 * 「デモ申請データ（APP-2026-00123）で確定している値」と本レコードを根拠に挙げているが、
 * 値自体は画面イメージ SC-07 のモックで確定しているものであり、
 * 本レコードの削除によって変わらない。
 */

/** T12 問合せ（未回答1件） */
export const demoInquiry = Record({
    $id: Now.ID['demo_inquiry_expense'],
    $meta: { installMethod: 'demo' },
    table: 'x_dent2_dentsusoke_inquiry',
    data: {
        u_subject: '経費区分の判定について',
        u_business_entity: demoEntity,
        u_created_by_applicant: demoApplicantUser,
        u_description: 'クラウドサービス利用費の対象範囲について確認させてください。',
        u_state: 'open',
        u_received_on: '2026-08-09 14:30:00',
    },
})

/**
 * デモユーザへの applicant ロール付与（ポータルへのログイン・impersonate で画面確認するために必要）
 *
 * state は必ず 'active' を明示する。Record API はプラットフォームの既定値を補完しないため、
 * 省略すると state が空のまま投入され、ロールが有効にならない
 * （＝ロール必須ページの SC-05 マイページを開くと Service Portal が 404 ページへ遷移する）。
 */
Record({
    $id: Now.ID['demo_user_role_applicant'],
    $meta: { installMethod: 'demo' },
    table: 'sys_user_has_role',
    data: {
        user: demoApplicantUser,
        role: applicantRole,
        state: 'active',
    },
})

/** デモ事務局ユーザへの staff ロール付与（お知らせ作成者としての権限確認用） */
Record({
    $id: Now.ID['demo_user_role_staff'],
    $meta: { installMethod: 'demo' },
    table: 'sys_user_has_role',
    data: {
        user: demoStaffUser,
        role: staffRole,
        state: 'active',
    },
})
