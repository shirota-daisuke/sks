import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * SC-14 問合せ管理・返信画面（事務局）の単体テスト — ビジネスルール
 *
 * 対象のカスタムロジック
 *   1. ビジネスルール「SKS 問合せ 保存時整合性チェック」（before insert／update）
 *   2. 辞書の既定値 u_received_on
 *      … 当初 javascript:gs.nowDateTime() を指定していたが、スコープアプリでは
 *        この関数が使用できず登録時に評価が失敗していた（本テストで検出）。
 *        javascript:new GlideDateTime().getDisplayValue() へ修正済み。
 *
 * ビジネスルールは insert と update の両方で発火するため、それぞれ独立したテストで検証する。
 *
 * InquiryAdminUtil（Script Include）のテストは sc14-inquiry-util.now.ts にある。
 */


/**
 * ビジネスルール「SKS 問合せ 保存時整合性チェック」— insert 経路
 *
 * 状態＝回答済かつ回答本文が空の新規登録が中止されることを確認する（条件が成立する側）。
 */
Test(
    {
        $id: Now.ID['test_sc14_br_insert_invalid'],
        name: 'SC-14 問合せ：保存時整合性チェック（新規・回答済で回答本文なし）',
        description:
            'ビジネスルール「SKS 問合せ 保存時整合性チェック」の insert 経路を検証する。状態＝回答済かつ回答本文が空の問合せを新規登録し、setAbortAction により登録が中止されること（条件が成立する側）を record_not_inserted で確認する。',
        active: true,
        failOnServerError: false,
    },
    (atf) => {
        const entity = atf.server.recordInsert({
            $id: Now.ID['test_sc14_br_insert_entity'],
            table: 'x_dent2_dentsusoke_entity',
            assert: 'record_successfully_inserted',
            fieldValues: {
                u_business_name: 'ATF SC-14 BR テスト事業者',
                u_entity_type: 'corporate',
                u_corporate_number: '9000000000141',
                u_address: 'ATF テスト住所',
                u_industry: 'service',
                u_employee_count: 5,
                u_capital: 3000,
            },
        })

        const applicant = atf.server.recordInsert({
            $id: Now.ID['test_sc14_br_insert_user'],
            table: 'x_dent2_dentsusoke_user',
            assert: 'record_successfully_inserted',
            fieldValues: {
                user_name: 'atf.sc14.br.invalid',
                first_name: 'ATF',
                last_name: 'SC14-BR',
                email: 'atf.sc14.br.invalid@example.invalid',
                u_business_entity: entity.record_id,
                u_registration_status: 'registered',
                u_duplicate_check_result: 'no_duplicate',
                u_auth_method: 'standard',
            },
        })

        atf.server.recordInsert({
            $id: Now.ID['test_sc14_br_insert_invalid_step'],
            table: 'x_dent2_dentsusoke_inquiry',
            assert: 'record_not_inserted',
            fieldValues: {
                u_subject: 'ATF SC-14 回答済で回答本文なし（登録されないこと）',
                u_business_entity: entity.record_id,
                u_created_by_applicant: applicant.record_id,
                u_description: 'ATF テスト問合せ本文',
                u_state: 'answered',
            },
        })
    },
)

/**
 * ビジネスルール「SKS 問合せ 保存時整合性チェック」— update 経路
 *
 * 未回答の問合せを回答本文なしで回答済へ更新した場合に中止されることを確認する。
 * あわせて受付日時の補完（辞書の既定値およびビジネスルールの保険）を確認する。
 */
Test(
    {
        $id: Now.ID['test_sc14_br_update_invalid'],
        name: 'SC-14 問合せ：保存時整合性チェック（更新・回答本文なしで回答済へ）',
        description:
            'ビジネスルール「SKS 問合せ 保存時整合性チェック」の update 経路を検証する。未回答で登録した問合せを回答本文を入れずに状態＝回答済へ更新し、更新が中止されること（record_not_updated）と状態が未回答のまま保持されることを確認する。登録時に受付日時が補完されることも併せて検証する。',
        active: true,
        failOnServerError: false,
    },
    (atf) => {
        const entity = atf.server.recordInsert({
            $id: Now.ID['test_sc14_br_update_entity'],
            table: 'x_dent2_dentsusoke_entity',
            assert: 'record_successfully_inserted',
            fieldValues: {
                u_business_name: 'ATF SC-14 BR 更新テスト事業者',
                u_entity_type: 'corporate',
                u_corporate_number: '9000000000142',
                u_address: 'ATF テスト住所',
                u_industry: 'service',
                u_employee_count: 5,
                u_capital: 3000,
            },
        })

        const applicant = atf.server.recordInsert({
            $id: Now.ID['test_sc14_br_update_user'],
            table: 'x_dent2_dentsusoke_user',
            assert: 'record_successfully_inserted',
            fieldValues: {
                user_name: 'atf.sc14.br.update',
                first_name: 'ATF',
                last_name: 'SC14-BRU',
                email: 'atf.sc14.br.update@example.invalid',
                u_business_entity: entity.record_id,
                u_registration_status: 'registered',
                u_duplicate_check_result: 'no_duplicate',
                u_auth_method: 'standard',
            },
        })

        // 受付日時を指定せずに登録する（辞書の既定値／ビジネスルールで補完されること）
        const inquiry = atf.server.recordInsert({
            $id: Now.ID['test_sc14_br_update_seed'],
            table: 'x_dent2_dentsusoke_inquiry',
            assert: 'record_successfully_inserted',
            fieldValues: {
                u_subject: 'ATF SC-14 更新テスト用',
                u_business_entity: entity.record_id,
                u_created_by_applicant: applicant.record_id,
                u_description: 'ATF テスト問合せ本文',
                u_state: 'open',
            },
        })

        atf.server.recordValidation({
            $id: Now.ID['test_sc14_br_update_received_on'],
            table: 'x_dent2_dentsusoke_inquiry',
            recordId: inquiry.record_id,
            fieldValues: 'u_received_onISNOTEMPTY^u_state=open^EQ',
            assert: 'record_validated',
        })

        atf.server.recordUpdate({
            $id: Now.ID['test_sc14_br_update_invalid_step'],
            table: 'x_dent2_dentsusoke_inquiry',
            recordId: inquiry.record_id,
            assert: 'record_not_updated',
            fieldValues: {
                u_state: 'answered',
            },
        })

        atf.server.recordValidation({
            $id: Now.ID['test_sc14_br_update_invalid_validate'],
            table: 'x_dent2_dentsusoke_inquiry',
            recordId: inquiry.record_id,
            fieldValues: 'u_state=open^u_replied_onISEMPTY^EQ',
            assert: 'record_validated',
        })
    },
)

/**
 * ビジネスルール「SKS 問合せ 保存時整合性チェック」— update 経路（正常系）
 *
 * 回答本文を伴って回答済へ更新した場合は成功し、回答日時が補完されることを確認する
 * （条件が成立しない側 ＋ 回答日時の補完）。
 */
Test(
    {
        $id: Now.ID['test_sc14_br_update_valid'],
        name: 'SC-14 問合せ：保存時整合性チェック（更新・回答本文ありで回答済へ）',
        description:
            'ビジネスルール「SKS 問合せ 保存時整合性チェック」の update 経路の正常系を検証する。回答本文を設定して状態＝回答済へ更新し、更新が成功すること（条件が成立しない側）と、回答日時を指定しなくてもビジネスルールが補完することを recordValidation で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        const entity = atf.server.recordInsert({
            $id: Now.ID['test_sc14_br_valid_entity'],
            table: 'x_dent2_dentsusoke_entity',
            assert: 'record_successfully_inserted',
            fieldValues: {
                u_business_name: 'ATF SC-14 BR 正常系テスト事業者',
                u_entity_type: 'corporate',
                u_corporate_number: '9000000000143',
                u_address: 'ATF テスト住所',
                u_industry: 'service',
                u_employee_count: 5,
                u_capital: 3000,
            },
        })

        const applicant = atf.server.recordInsert({
            $id: Now.ID['test_sc14_br_valid_user'],
            table: 'x_dent2_dentsusoke_user',
            assert: 'record_successfully_inserted',
            fieldValues: {
                user_name: 'atf.sc14.br.valid',
                first_name: 'ATF',
                last_name: 'SC14-BRV',
                email: 'atf.sc14.br.valid@example.invalid',
                u_business_entity: entity.record_id,
                u_registration_status: 'registered',
                u_duplicate_check_result: 'no_duplicate',
                u_auth_method: 'standard',
            },
        })

        const inquiry = atf.server.recordInsert({
            $id: Now.ID['test_sc14_br_valid_seed'],
            table: 'x_dent2_dentsusoke_inquiry',
            assert: 'record_successfully_inserted',
            fieldValues: {
                u_subject: 'ATF SC-14 正常系更新テスト用',
                u_business_entity: entity.record_id,
                u_created_by_applicant: applicant.record_id,
                u_description: 'ATF テスト問合せ本文',
                u_state: 'open',
            },
        })

        // 回答日時は指定しない（ビジネスルールが補完すること）
        atf.server.recordUpdate({
            $id: Now.ID['test_sc14_br_update_valid_step'],
            table: 'x_dent2_dentsusoke_inquiry',
            recordId: inquiry.record_id,
            assert: 'record_successfully_updated',
            fieldValues: {
                u_state: 'answered',
                u_reply_body: 'ATF からの回答本文です。',
            },
        })

        atf.server.recordValidation({
            $id: Now.ID['test_sc14_br_update_valid_validate'],
            table: 'x_dent2_dentsusoke_inquiry',
            recordId: inquiry.record_id,
            fieldValues: 'u_state=answered^u_replied_onISNOTEMPTY^EQ',
            assert: 'record_validated',
        })
    },
)
