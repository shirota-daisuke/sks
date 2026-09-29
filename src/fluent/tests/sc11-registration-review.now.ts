import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * SC-11 ユーザ登録審査画面（プロビジョニング）の単体テスト
 *
 * 対象のカスタムロジックは RegistrationReviewUtil（Script Include）。
 * 承認・却下・不備修正依頼の3操作と、それぞれのガード条件を検証する。
 *
 * ■ テスト方式
 * Script Include には UI が無いため atf.server.runServerSideScript で
 * クラスを直接インスタンス化して検証する（atf-guide.md「Testing a Script Include」）。
 *
 * 検証には Jasmine（describe／it／expect）を使わず assertEqual を使う。
 * runServerSideScript で Jasmine を実行すると期待値の不一致がステップの成否へ反映されず、
 * ログに「Test results :: (98/122) :: failed」と出ていてもステップが成功扱いになり、
 * テストが偽の成功を返していた（当インスタンスで確認）。
 *
 * assertEqual は最初の不一致でステップを終了する（fail-fast）。
 * そのため観点ごとにテストを分け、1件の失敗で他の観点の検証が止まらないようにしている。
 *
 * ■ UI Action の condition について
 * 3つの UI Action（承認／却下／不備修正を依頼）の condition は
 * 「ロール判定 ＋ ステータス判定 ＋ 重複チェック結果判定」であり、
 * 判定内容そのものは本テストで検証する isActionable／canApprove と同一の条件である。
 * ボタンの描画可否はワークスペースの UI 実行環境に依存するため、
 * 実行時の妥当性判定をサーバー側で確認する方針とする。
 *
 * ■ 実行ユーザ
 * ATF はテスト実行ユーザ（通常は admin）で動作する。
 * canReview() は gs.hasRole() で判定し admin は全ロールを満たすため、
 * 権限ガードの正常系は通過する。権限不足の異常系は
 * SC-16 の ACL テストでロール境界を検証している。
 */

/** 承認（処理No.6） */
Test(
    {
        $id: Now.ID['test_sc11_approve'],
        name: 'SC-11 ユーザ登録審査：承認',
        description:
            'RegistrationReviewUtil.approve を検証する。登録申請審査中かつ重複なしの事業者ユーザを承認して登録済へ遷移し承認者・承認日時が記録されること（正常系）と、重複あり（確定）・ステータス不正・対象なしで拒否されステータスが変わらないこと（異常系）を assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc11_step_approve'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var seq = 0

    function createEntity() {
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.initialize()
        gr.setValue('u_business_name', 'ATF SC-11 承認テスト事業者')
        gr.setValue('u_entity_type', 'corporate')
        gr.setValue('u_corporate_number', '9000000011001')
        gr.setValue('u_address', 'ATF テスト住所')
        gr.setValue('u_industry', 'service')
        gr.setValue('u_employee_count', 10)
        gr.setValue('u_capital', 5000)
        return gr.insert()
    }

    function createApplicantUser(entityId, status, duplicate) {
        seq++
        var login = 'atf.sc11a.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'SC11A-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', status)
        gr.setValue('u_duplicate_check_result', duplicate)
        gr.setValue('u_auth_method', 'standard')
        gr.setValue('u_registration_requested_on', new GlideDateTime().getValue())
        return gr.insert()
    }

    function reload(userId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.get(userId)
        return gr
    }

    function hasApplicantRole(userId) {
        var gr = new GlideRecord('sys_user_has_role')
        gr.addQuery('user', userId)
        gr.addQuery('role.name', 'x_dent2_dentsusoke.applicant')
        gr.setLimit(1)
        gr.query()
        return gr.hasNext()
    }

    var util = new x_dent2_dentsusoke.RegistrationReviewUtil()
    var entityId = createEntity()

    // 正常系：登録申請審査中かつ重複なし → 登録済
    var okId = createApplicantUser(entityId, 'review', 'no_duplicate')
    var okResult = util.approve(okId)
    check('承認が成功する', okResult.success, true)
    check('返却されるアクション', okResult.action, 'approve')

    var okGr = reload(okId)
    check('ステータスが登録済へ遷移する', okGr.getValue('u_registration_status'), 'registered')
    check('承認者が実行ユーザで記録される', okGr.getValue('u_approved_by'), gs.getUserID())
    check('承認日時が記録される', !!okGr.getValue('u_approved_on'), true)

    // applicant ロールの付与（付与に失敗した場合は警告を返す仕様）
    var granted = hasApplicantRole(okId)
    var warned = !!(okResult.warnings && okResult.warnings.length > 0)
    check('applicant ロールが付与される、または警告が返る', granted || warned, true)

    // 異常系：重複あり（確定）
    var dupId = createApplicantUser(entityId, 'review', 'duplicate_confirmed')
    var dupResult = util.approve(dupId)
    check('重複あり（確定）は承認できない', dupResult.success, false)
    check('重複あり（確定）でエラーが返る', dupResult.errors.length > 0, true)
    check('重複あり（確定）でステータスが変わらない', reload(dupId).getValue('u_registration_status'), 'review')

    // 異常系：ステータス不正
    var doneId = createApplicantUser(entityId, 'registered', 'no_duplicate')
    var doneResult = util.approve(doneId)
    check('登録済のユーザは承認できない', doneResult.success, false)
    check('ステータス不正でエラーが返る', doneResult.errors.length > 0, true)

    // 異常系：対象なし
    var missing = util.approve('00000000000000000000000000000000')
    check('対象が存在しない場合は承認できない', missing.success, false)

    stepResult.setOutputMessage('承認の正常系・異常系を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** 却下（処理No.6） */
Test(
    {
        $id: Now.ID['test_sc11_reject'],
        name: 'SC-11 ユーザ登録審査：却下',
        description:
            'RegistrationReviewUtil.reject を検証する。登録申請審査中の事業者ユーザを却下して登録不可へ遷移し applicant ロールが付与されないこと（正常系）と、登録申請審査中以外のステータスでは却下できないこと（異常系）を assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc11_step_reject'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var seq = 0

    function createEntity() {
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.initialize()
        gr.setValue('u_business_name', 'ATF SC-11 却下テスト事業者')
        gr.setValue('u_entity_type', 'corporate')
        gr.setValue('u_corporate_number', '9000000011002')
        gr.setValue('u_address', 'ATF テスト住所')
        gr.setValue('u_industry', 'service')
        gr.setValue('u_employee_count', 10)
        gr.setValue('u_capital', 5000)
        return gr.insert()
    }

    function createApplicantUser(entityId, status, duplicate) {
        seq++
        var login = 'atf.sc11r.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'SC11R-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', status)
        gr.setValue('u_duplicate_check_result', duplicate)
        gr.setValue('u_auth_method', 'standard')
        return gr.insert()
    }

    function reload(userId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.get(userId)
        return gr
    }

    function hasApplicantRole(userId) {
        var gr = new GlideRecord('sys_user_has_role')
        gr.addQuery('user', userId)
        gr.addQuery('role.name', 'x_dent2_dentsusoke.applicant')
        gr.setLimit(1)
        gr.query()
        return gr.hasNext()
    }

    var util = new x_dent2_dentsusoke.RegistrationReviewUtil()
    var entityId = createEntity()

    // 正常系
    var okId = createApplicantUser(entityId, 'review', 'duplicate_confirmed')
    var okResult = util.reject(okId)
    check('却下が成功する', okResult.success, true)
    check('返却されるアクション', okResult.action, 'reject')
    check('ステータスが登録不可へ遷移する', reload(okId).getValue('u_registration_status'), 'rejected')
    check('applicant ロールは付与されない', hasApplicantRole(okId), false)

    // 異常系：ステータス不正
    var ngId = createApplicantUser(entityId, 'defect_request', 'no_duplicate')
    var ngResult = util.reject(ngId)
    check('登録不備確認依頼のユーザは却下できない', ngResult.success, false)
    check('ステータス不正でステータスが変わらない', reload(ngId).getValue('u_registration_status'), 'defect_request')

    stepResult.setOutputMessage('却下の正常系・異常系を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** 不備修正を依頼（処理No.7） */
Test(
    {
        $id: Now.ID['test_sc11_request_defect'],
        name: 'SC-11 ユーザ登録審査：不備修正を依頼',
        description:
            'RegistrationReviewUtil.requestDefectFix を検証する。不備内容を入力して登録不備確認依頼へ遷移し内容が保持されること（正常系）と、不備内容が未入力・空白のみ・桁数上限超過の場合に拒否されステータスが変わらないこと（異常系）を assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc11_step_request_defect'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var seq = 0

    function createEntity() {
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.initialize()
        gr.setValue('u_business_name', 'ATF SC-11 不備テスト事業者')
        gr.setValue('u_entity_type', 'corporate')
        gr.setValue('u_corporate_number', '9000000011003')
        gr.setValue('u_address', 'ATF テスト住所')
        gr.setValue('u_industry', 'service')
        gr.setValue('u_employee_count', 10)
        gr.setValue('u_capital', 5000)
        return gr.insert()
    }

    function createApplicantUser(entityId) {
        seq++
        var login = 'atf.sc11d.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'SC11D-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'review')
        gr.setValue('u_duplicate_check_result', 'no_duplicate')
        gr.setValue('u_auth_method', 'standard')
        return gr.insert()
    }

    function reload(userId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.get(userId)
        return gr
    }

    var util = new x_dent2_dentsusoke.RegistrationReviewUtil()
    var entityId = createEntity()

    // 正常系
    var okId = createApplicantUser(entityId)
    var note = '法人番号の桁数が誤っています。'
    var okResult = util.requestDefectFix(okId, note)
    check('不備修正依頼が成功する', okResult.success, true)
    check('返却されるアクション', okResult.action, 'request_defect')

    var okGr = reload(okId)
    check('ステータスが登録不備確認依頼へ遷移する', okGr.getValue('u_registration_status'), 'defect_request')
    check('不備内容が保持される', okGr.getValue('u_registration_issue_note'), note)

    // 異常系：空白のみ
    var blankId = createApplicantUser(entityId)
    var blankResult = util.requestDefectFix(blankId, '   ')
    check('不備内容が空白のみなら拒否される', blankResult.success, false)
    check('空白のみでエラーが返る', blankResult.errors.length > 0, true)
    check('空白のみでステータスが変わらない', reload(blankId).getValue('u_registration_status'), 'review')

    // 異常系：未指定
    var nullId = createApplicantUser(entityId)
    check('不備内容が未指定なら拒否される', util.requestDefectFix(nullId, null).success, false)

    // 異常系：桁数上限超過（T02 u_registration_issue_note は2000文字）
    var longId = createApplicantUser(entityId)
    var tooLong = new Array(2002).join('a')
    check('検証用の文字列が上限を超えている', tooLong.length > 2000, true)
    check('桁数上限を超える不備内容は拒否される', util.requestDefectFix(longId, tooLong).success, false)

    stepResult.setOutputMessage('不備修正依頼の正常系・異常系を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** 判定メソッド（UI Action の condition と同じ条件）と表示区分 */
Test(
    {
        $id: Now.ID['test_sc11_guards'],
        name: 'SC-11 ユーザ登録審査：判定メソッドと表示区分',
        description:
            'RegistrationReviewUtil の判定メソッドを検証する。isActionable が登録申請審査中のみを操作可能と判定し、canApprove が重複あり（確定）のみを承認不可と判定すること（UI Action の condition と同じ条件）、getPendingStatuses が事務局の対応が必要な3ステータスを返すこと、ステータスと重複チェック結果に対応するラベルクラスを返すことを assertEqual で確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc11_step_guards'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var util = new x_dent2_dentsusoke.RegistrationReviewUtil()

    // isActionable：登録申請審査中のみ操作可能
    check('isActionable: review', util.isActionable('review'), true)
    check('isActionable: registered', util.isActionable('registered'), false)
    check('isActionable: defect_request', util.isActionable('defect_request'), false)
    check('isActionable: defect_fixing', util.isActionable('defect_fixing'), false)
    check('isActionable: rejected', util.isActionable('rejected'), false)
    check('isActionable: 空文字', util.isActionable(''), false)

    // canApprove：重複あり（確定）のみ承認不可
    check('canApprove: no_duplicate', util.canApprove('no_duplicate'), true)
    check('canApprove: duplicate_review', util.canApprove('duplicate_review'), true)
    check('canApprove: not_executed', util.canApprove('not_executed'), true)
    check('canApprove: duplicate_confirmed', util.canApprove('duplicate_confirmed'), false)

    // getPendingStatuses：事務局の対応が必要なステータス
    var pending = util.getPendingStatuses()
    check('対応が必要なステータス数', pending.length, 3)
    check('対応が必要: review', pending.indexOf('review') >= 0, true)
    check('対応が必要: defect_request', pending.indexOf('defect_request') >= 0, true)
    check('対応が必要: defect_fixing', pending.indexOf('defect_fixing') >= 0, true)

    // 表示区分（画面イメージ凡例の3区分）
    check('ラベルクラス: registered', util.getStatusLabelClass('registered'), 'label-success')
    check('ラベルクラス: review', util.getStatusLabelClass('review'), 'label-warning')
    check('ラベルクラス: rejected', util.getStatusLabelClass('rejected'), 'label-danger')
    check('ラベルクラス: defect_request', util.getStatusLabelClass('defect_request'), 'label-danger')
    check('ラベルクラス: unregistered', util.getStatusLabelClass('unregistered'), 'label-default')
    check('重複ラベルクラス: no_duplicate', util.getDuplicateLabelClass('no_duplicate'), 'label-success')
    check('重複ラベルクラス: duplicate_review', util.getDuplicateLabelClass('duplicate_review'), 'label-warning')
    check('重複ラベルクラス: duplicate_confirmed', util.getDuplicateLabelClass('duplicate_confirmed'), 'label-danger')
    check('重複ラベルクラス: not_executed', util.getDuplicateLabelClass('not_executed'), 'label-default')

    stepResult.setOutputMessage('判定メソッドと表示区分を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
