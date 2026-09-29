import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'
import { demoEntity } from './mypage-demo.now'

/**
 * SC-11 ユーザ登録審査（プロビジョニング）動作確認用のデモデータ。
 * すべて $meta.installMethod: 'demo' を指定しているため、デモデータを取り込まない環境には投入されない。
 *
 * 内容は画面イメージ（成果物No.5）SC-11 の3行に合わせ、あわせて
 * 業務フロー確認事項 Q04（決定済）「確定一致は登録不可、曖昧一致のみ事務局確認」の
 * 判定パターンを網羅する。
 *
 *   | ログインID   | 事業者名             | 重複チェック     | ステータス         | 確認できること                     |
 *   | sks.review1  | 株式会社サンプル     | 重複なし         | 登録申請審査中     | 承認／却下／不備修正を依頼の3ボタン |
 *   | sks.review2  | 有限会社テスト       | 重複あり（要確認）| 登録申請審査中     | 曖昧一致でも承認できる（Q04）       |
 *   | sks.review3  | 株式会社サンプル分室 | 重複あり（確定）  | 登録申請審査中     | 承認ボタンが表示されない（Q04）     |
 *   | sks.defect1  | 山田商店             | 重複なし         | 登録不備確認依頼   | ボタン非表示。要対応リストに表示    |
 *
 * 確認手順：admin で sks.staff を impersonate し、/x/dent2/sks-staff/home を開く。
 *   → 左ナビ「ユーザ管理」→「登録審査：要対応」→ 行をクリックしてレコードページを開く。
 *
 * いずれも登録済ではないため applicant ロールは付与しない（権限設計書 2章 ロール付与ルール）。
 * パスワードも設定しないため、これらのアカウントで直接ログインすることはできない。
 */

/** T01 事業者：重複あり（要確認）の対象。事業者名が「株式会社サンプル」と正規化一致する。 */
export const demoEntityTest = Record({
    $id: Now.ID['demo_entity_test'],
    $meta: { installMethod: 'demo' },
    table: 'x_dent2_dentsusoke_entity',
    data: {
        u_business_name: '有限会社テスト',
        u_entity_type: 'corporate',
        u_corporate_number: '9876543210987',
        u_address: '大阪府大阪市北区梅田2-3-4',
        u_industry: 'wholesale',
        u_employee_count: 8,
        u_capital: 3000,
        u_prior_year_awarded_flag: false,
    },
})

/**
 * T01 事業者：重複あり（確定）の対象。
 * 法人番号を「株式会社サンプル」（demoEntity）と同一にしているため、
 * 重複チェック処理（処理No.5）では法人番号の完全一致＝確定一致となる。
 */
export const demoEntityBranch = Record({
    $id: Now.ID['demo_entity_branch'],
    $meta: { installMethod: 'demo' },
    table: 'x_dent2_dentsusoke_entity',
    data: {
        u_business_name: '株式会社サンプル分室',
        u_entity_type: 'corporate',
        u_corporate_number: '1234567890123',
        u_address: '東京都千代田区丸の内1-2-4',
        u_industry: 'service',
        u_employee_count: 5,
        u_capital: 1000,
        u_prior_year_awarded_flag: false,
    },
})

/** T01 事業者：個人事業主。法人番号欄は本人識別情報（半角英数13桁以内）を保持する。 */
export const demoEntityYamada = Record({
    $id: Now.ID['demo_entity_yamada'],
    $meta: { installMethod: 'demo' },
    table: 'x_dent2_dentsusoke_entity',
    data: {
        u_business_name: '山田商店',
        u_entity_type: 'sole_proprietor',
        u_corporate_number: 'YAMADA0001',
        u_address: '愛知県名古屋市中区栄3-4-5',
        u_industry: 'retail',
        u_employee_count: 2,
        u_capital: 500,
        u_prior_year_awarded_flag: false,
    },
})

/**
 * 登録申請審査中／重複なし。
 * 既存の「株式会社サンプル」（demoEntity）の2人目のユーザとして登録申請している状態で、
 * 業務フロー確認事項 Q05 の暫定案「管理者＋担当者の複数ユーザー許容」にも対応する。
 */
Record({
    $id: Now.ID['demo_user_review1'],
    $meta: { installMethod: 'demo' },
    table: 'x_dent2_dentsusoke_user',
    data: {
        user_name: 'sks.review1',
        first_name: '一郎',
        last_name: '審査',
        email: 'sks.review1@example.co.jp',
        active: true,
        u_business_entity: demoEntity,
        u_user_type: 'member',
        u_registration_status: 'review',
        u_duplicate_check_result: 'no_duplicate',
        u_auth_method: 'standard',
        u_mfa_enabled: false,
        u_registration_requested_on: '2026-09-01 10:15:00',
    },
})

/** 登録申請審査中／重複あり（要確認）。事業者名の正規化一致による曖昧一致。承認は事務局判断で可能。 */
Record({
    $id: Now.ID['demo_user_review2'],
    $meta: { installMethod: 'demo' },
    table: 'x_dent2_dentsusoke_user',
    data: {
        user_name: 'sks.review2',
        first_name: '二郎',
        last_name: '審査',
        email: 'sks.review2@example.co.jp',
        active: true,
        u_business_entity: demoEntityTest,
        u_user_type: 'manager',
        u_registration_status: 'review',
        u_duplicate_check_result: 'duplicate_review',
        u_auth_method: 'standard',
        u_mfa_enabled: false,
        u_registration_requested_on: '2026-09-02 14:30:00',
    },
})

/**
 * 登録申請審査中／重複あり（確定）。
 * Q04（決定済）に従い承認ボタンは表示されず、却下または不備修正の依頼のみ実行できる。
 */
Record({
    $id: Now.ID['demo_user_review3'],
    $meta: { installMethod: 'demo' },
    table: 'x_dent2_dentsusoke_user',
    data: {
        user_name: 'sks.review3',
        first_name: '三郎',
        last_name: '審査',
        email: 'sks.review3@example.co.jp',
        active: true,
        u_business_entity: demoEntityBranch,
        u_user_type: 'manager',
        u_registration_status: 'review',
        u_duplicate_check_result: 'duplicate_confirmed',
        u_auth_method: 'standard',
        u_mfa_enabled: false,
        u_registration_requested_on: '2026-09-03 09:05:00',
    },
})

/**
 * 登録不備確認依頼。事務局が不備内容を通知した直後の状態。
 * 3ボタンは表示されず（登録申請審査中でないため）、「登録審査：要対応」リストには表示される。
 */
Record({
    $id: Now.ID['demo_user_defect1'],
    $meta: { installMethod: 'demo' },
    table: 'x_dent2_dentsusoke_user',
    data: {
        user_name: 'sks.defect1',
        first_name: '花子',
        last_name: '山田',
        email: 'sks.defect1@example.co.jp',
        active: true,
        u_business_entity: demoEntityYamada,
        u_user_type: 'manager',
        u_registration_status: 'defect_request',
        u_duplicate_check_result: 'no_duplicate',
        u_auth_method: 'standard',
        u_mfa_enabled: false,
        u_registration_requested_on: '2026-08-28 11:40:00',
        u_registration_issue_note:
            '本人識別情報の桁数をご確認ください。開業届に記載の番号と一致しないため、確定申告書の控えとあわせて再提出をお願いします。',
    },
})
