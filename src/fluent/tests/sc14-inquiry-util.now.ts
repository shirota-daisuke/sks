import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * SC-14 問合せ管理・返信画面：InquiryAdminUtil の単体テスト
 *
 * ビジネスルールのテストは sc14-inquiry.now.ts にある。
 * 本ファイルは Script Include（回答本文の検証・返信・対応者割当・差し戻し）を対象とする。
 *
 * 検証には Jasmine を使わず assertEqual を使う（理由は sc11-registration-review.now.ts のコメント参照）。
 * assertEqual は最初の不一致でステップを終了するため、観点ごとにテストを分けている。
 */

/** 回答本文の検証 */
Test(
    {
        $id: Now.ID['test_sc14_validate_reply'],
        name: 'SC-14 問合せ：回答本文の検証',
        description:
            'InquiryAdminUtil.validateReply を検証する。回答本文が入力されていれば検証を通ること（正常系）と、空文字・空白のみ・null・undefined・桁数上限超過で検証エラーになること（異常系）を確認する。桁数上限ちょうど（2000文字）の境界値も併せて確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc14_step_validate_reply'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var util = new x_dent2_dentsusoke.InquiryAdminUtil()

    // 正常系
    var ok = util.validateReply('回答内容です。')
    check('回答本文が入力されていれば検証を通る', ok.valid, true)
    check('正常系ではエラーが無い', ok.errors.length, 0)

    // 境界値：桁数上限ちょうど
    var exact = new Array(2001).join('a')
    check('検証用の文字列が上限ちょうど', exact.length, 2000)
    check('桁数上限ちょうどなら検証を通る', util.validateReply(exact).valid, true)

    // 異常系：未入力
    check('空文字は検証エラー', util.validateReply('').valid, false)
    check('空白のみは検証エラー', util.validateReply('   ').valid, false)
    check('null は検証エラー', util.validateReply(null).valid, false)
    check('undefined は検証エラー', util.validateReply(undefined).valid, false)

    // 異常系：桁数上限超過
    var tooLong = new Array(2002).join('a')
    check('検証用の文字列が上限を超えている', tooLong.length > 2000, true)
    check('桁数上限を超える回答本文は検証エラー', util.validateReply(tooLong).valid, false)

    stepResult.setOutputMessage('回答本文の検証を確認しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** 返信（問合せ返信処理：処理No.47） */
Test(
    {
        $id: Now.ID['test_sc14_reply'],
        name: 'SC-14 問合せ：返信',
        description:
            'InquiryAdminUtil.reply を検証する。未回答の問合せへ回答して回答済へ遷移し回答本文・回答日時・対応者が記録されること（正常系）と、回答本文未入力・回答済みへの再返信・対象なしで拒否されること（異常系）を確認する。対応者未指定なら実行ユーザ、指定ありならその値が記録されること、メール未送信の警告を必ず返すことも確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc14_step_reply'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var seq = 0

    function createEntity() {
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.initialize()
        gr.setValue('u_business_name', 'ATF SC-14 返信テスト事業者')
        gr.setValue('u_entity_type', 'sole_proprietor')
        gr.setValue('u_corporate_number', '9000000014001')
        gr.setValue('u_address', 'ATF テスト住所')
        gr.setValue('u_industry', 'retail')
        gr.setValue('u_employee_count', 3)
        gr.setValue('u_capital', 1000)
        return gr.insert()
    }

    function createApplicantUser(entityId) {
        seq++
        var login = 'atf.sc14rp.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'SC14RP-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'registered')
        gr.setValue('u_duplicate_check_result', 'no_duplicate')
        gr.setValue('u_auth_method', 'standard')
        return gr.insert()
    }

    function createInquiry(entityId, applicantId, state, overrides) {
        seq++
        var gr = new GlideRecord('x_dent2_dentsusoke_inquiry')
        gr.initialize()
        gr.setValue('u_subject', 'ATF SC-14 返信テスト問合せ ' + seq)
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_created_by_applicant', applicantId)
        gr.setValue('u_description', 'ATF テスト問合せ本文')
        gr.setValue('u_state', state)
        gr.setValue('u_received_on', new GlideDateTime().getValue())
        if (state === 'answered') {
            // 状態＝回答済はビジネスルールが回答本文を要求するため必ず設定する
            gr.setValue('u_reply_body', 'ATF 既存の回答本文')
            gr.setValue('u_replied_on', new GlideDateTime().getValue())
        }
        for (var key in overrides) {
            gr.setValue(key, overrides[key])
        }
        return gr.insert()
    }

    function reload(inquiryId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_inquiry')
        gr.get(inquiryId)
        return gr
    }

    var util = new x_dent2_dentsusoke.InquiryAdminUtil()
    var entityId = createEntity()
    var applicantId = createApplicantUser(entityId)

    // 正常系：対応者未指定
    var okId = createInquiry(entityId, applicantId, 'open', {})
    var okResult = util.reply(okId, 'ATF からの回答です。', '')
    check('返信が成功する', okResult.success, true)
    check('返却されるアクション', okResult.action, 'reply')
    check('メール未送信の警告を返す', okResult.warnings.length > 0, true)

    var okGr = reload(okId)
    check('状態が回答済へ遷移する', okGr.getValue('u_state'), 'answered')
    check('回答本文が保持される', okGr.getValue('u_reply_body'), 'ATF からの回答です。')
    check('回答日時が記録される', !!okGr.getValue('u_replied_on'), true)
    check('対応者未指定なら実行ユーザが記録される', okGr.getValue('u_assigned_staff'), gs.getUserID())

    // 正常系：対応者を指定
    var assignedId = createInquiry(entityId, applicantId, 'open', {})
    var assignedResult = util.reply(assignedId, 'ATF からの回答です。', gs.getUserID())
    check('対応者指定でも返信が成功する', assignedResult.success, true)
    check('指定した対応者が記録される', reload(assignedId).getValue('u_assigned_staff'), gs.getUserID())

    // 異常系：回答本文が未入力
    var blankId = createInquiry(entityId, applicantId, 'open', {})
    var blankResult = util.reply(blankId, '   ', '')
    check('回答本文が未入力なら拒否される', blankResult.success, false)
    check('未入力でエラーが返る', blankResult.errors.length > 0, true)
    check('未入力で状態が変わらない', reload(blankId).getValue('u_state'), 'open')

    // 異常系：回答済みへの再返信（単一回答モデル）
    var answeredId = createInquiry(entityId, applicantId, 'answered', {})
    var answeredResult = util.reply(answeredId, 'ATF からの2回目の回答です。', '')
    check('回答済みへは重ねて返信できない', answeredResult.success, false)
    check('回答済みへの再返信で回答本文が変わらない', reload(answeredId).getValue('u_reply_body'), 'ATF 既存の回答本文')

    // 異常系：対象なし
    check('対象が存在しない場合は返信できない', util.reply('00000000000000000000000000000000', 'ATF', '').success, false)

    stepResult.setOutputMessage('返信の正常系・異常系を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** 対応者割当と差し戻し */
Test(
    {
        $id: Now.ID['test_sc14_assign_reopen'],
        name: 'SC-14 問合せ：対応者割当と差し戻し',
        description:
            'InquiryAdminUtil.assignToMe／reopen を検証する。対応者未設定の問合せへ自分を設定できること、回答済みを未回答へ戻して回答日時をクリアし回答本文を訂正用に残すこと（正常系）と、既に自分が対応者・未回答の差し戻しが拒否されること（異常系）を確認する。差し戻し後に再度返信できる一連の流れも確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc14_step_assign_reopen'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var seq = 0

    function createEntity() {
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.initialize()
        gr.setValue('u_business_name', 'ATF SC-14 差し戻しテスト事業者')
        gr.setValue('u_entity_type', 'sole_proprietor')
        gr.setValue('u_corporate_number', '9000000014002')
        gr.setValue('u_address', 'ATF テスト住所')
        gr.setValue('u_industry', 'retail')
        gr.setValue('u_employee_count', 3)
        gr.setValue('u_capital', 1000)
        return gr.insert()
    }

    function createApplicantUser(entityId) {
        seq++
        var login = 'atf.sc14ar.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'SC14AR-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'registered')
        gr.setValue('u_duplicate_check_result', 'no_duplicate')
        gr.setValue('u_auth_method', 'standard')
        return gr.insert()
    }

    function createInquiry(entityId, applicantId, state, overrides) {
        seq++
        var gr = new GlideRecord('x_dent2_dentsusoke_inquiry')
        gr.initialize()
        gr.setValue('u_subject', 'ATF SC-14 差し戻しテスト問合せ ' + seq)
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_created_by_applicant', applicantId)
        gr.setValue('u_description', 'ATF テスト問合せ本文')
        gr.setValue('u_state', state)
        gr.setValue('u_received_on', new GlideDateTime().getValue())
        if (state === 'answered') {
            gr.setValue('u_reply_body', 'ATF 既存の回答本文')
            gr.setValue('u_replied_on', new GlideDateTime().getValue())
        }
        for (var key in overrides) {
            gr.setValue(key, overrides[key])
        }
        return gr.insert()
    }

    function reload(inquiryId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_inquiry')
        gr.get(inquiryId)
        return gr
    }

    var util = new x_dent2_dentsusoke.InquiryAdminUtil()
    var entityId = createEntity()
    var applicantId = createApplicantUser(entityId)

    // 正常系：対応者割当
    var assignId = createInquiry(entityId, applicantId, 'open', {})
    var assignResult = util.assignToMe(assignId)
    check('対応者割当が成功する', assignResult.success, true)
    check('返却されるアクション', assignResult.action, 'assign')
    check('対応者に実行ユーザが設定される', reload(assignId).getValue('u_assigned_staff'), gs.getUserID())

    // 異常系：既に自分が対応者
    var alreadyId = createInquiry(entityId, applicantId, 'open', { u_assigned_staff: gs.getUserID() })
    var alreadyResult = util.assignToMe(alreadyId)
    check('既に自分が対応者なら拒否される', alreadyResult.success, false)
    check('既に自分が対応者でエラーが返る', alreadyResult.errors.length > 0, true)

    // 正常系：差し戻し
    var reopenId = createInquiry(entityId, applicantId, 'answered', {})
    var reopenResult = util.reopen(reopenId)
    check('差し戻しが成功する', reopenResult.success, true)
    check('返却されるアクション', reopenResult.action, 'reopen')

    var reopenGr = reload(reopenId)
    check('状態が未回答へ戻る', reopenGr.getValue('u_state'), 'open')
    check('回答日時がクリアされる', !reopenGr.getValue('u_replied_on'), true)
    // 訂正の下書きとして回答本文は残す仕様
    check('回答本文は訂正用に残る', reopenGr.getValue('u_reply_body'), 'ATF 既存の回答本文')

    // 異常系：未回答の差し戻し
    var openId = createInquiry(entityId, applicantId, 'open', {})
    check('未回答の問合せは差し戻せない', util.reopen(openId).success, false)

    // 正常系：差し戻し後に再返信できる（訂正の一連の流れ）
    var flowId = createInquiry(entityId, applicantId, 'answered', {})
    check('差し戻しが成功する（流れの確認）', util.reopen(flowId).success, true)
    var reReply = util.reply(flowId, 'ATF 訂正後の回答です。', '')
    check('差し戻し後に再返信できる', reReply.success, true)

    var flowGr = reload(flowId)
    check('再返信で状態が回答済へ戻る', flowGr.getValue('u_state'), 'answered')
    check('再返信で回答本文が更新される', flowGr.getValue('u_reply_body'), 'ATF 訂正後の回答です。')

    // 表示区分（SC-10 のウィジェットと同じ区分）
    check('ラベルクラス: open', util.getStateLabelClass('open'), 'label-warning')
    check('ラベルクラス: answered', util.getStateLabelClass('answered'), 'label-success')
    check('ラベルクラス: 空文字', util.getStateLabelClass(''), 'label-default')

    stepResult.setOutputMessage('対応者割当と差し戻しを検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
