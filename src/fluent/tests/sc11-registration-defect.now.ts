import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * 登録不備対応（処理No.7）の事業者側の単体テスト
 *
 * 対象のカスタムロジックは RegistrationDefectUtil（Script Include）。
 * 事務局の依頼（RegistrationReviewUtil.requestDefectFix）でトークンが発行されること、
 * 申請者がそのトークンで修正画面を開けること、再提出でステータスが戻ることを検証する。
 *
 * ■ テスト方式
 * Script Include には UI が無いため atf.server.runServerSideScript で
 * クラスを直接インスタンス化して検証する（SC-11 の既存テストと同じ方式）。
 * 検証には Jasmine を使わず assertEqual を使う（理由は sc11-registration-review.now.ts のコメント参照）。
 * assertEqual は最初の不一致でステップを終了する（fail-fast）ため、観点ごとにテストを分けている。
 *
 * ■ このテストで守りたいこと
 * 事務局が不備修正を依頼しても申請者へ届かない状態（トークン未発行・ステータスが進まない）に
 * 戻っていないことを検知する。とくに次の2点は回帰しやすい。
 *   ・defect_fixing への遷移が行われること（この値を書き込むのは本ユーティリティのみ）
 *   ・再提出時に重複チェックを再判定すること（古い duplicate_confirmed が残ると事務局が承認できない）
 */

/** 依頼 → トークン発行 → 修正画面の表示 */
Test(
    {
        $id: Now.ID['test_sc11d_request_and_open'],
        name: 'SC-11 登録不備対応：依頼とトークン検証',
        description:
            'RegistrationReviewUtil.requestDefectFix が不備修正トークンと有効期限を発行すること、RegistrationDefectUtil.findByToken がそのトークンを valid と判定すること、buildContext が事務局の記載した不備内容と事業者の現在値を返すこと、startFixing が登録不備確認依頼から登録不備修正中へ1回だけ遷移することを assertEqual で確認する。短いトークン・存在しないトークンが拒否されることも確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc11d_step_request_and_open'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var seq = 0

    function createEntity(corporateNumber) {
        seq++
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.initialize()
        gr.setValue('u_business_name', 'ATF 不備対応テスト事業者' + seq)
        gr.setValue('u_entity_type', 'corporate')
        gr.setValue('u_corporate_number', corporateNumber)
        gr.setValue('u_address', 'ATF テスト住所')
        gr.setValue('u_industry', 'service')
        gr.setValue('u_employee_count', 10)
        gr.setValue('u_capital', 5000)
        return gr.insert()
    }

    function createApplicantUser(entityId, status, duplicate) {
        seq++
        var login = 'atf.sc11d.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'SC11D-' + seq)
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

    var reviewUtil = new x_dent2_dentsusoke.RegistrationReviewUtil()
    var defectUtil = new x_dent2_dentsusoke.RegistrationDefectUtil()

    // 事務局が不備修正を依頼する（登録申請審査中 → 登録不備確認依頼）
    var entityId = createEntity('9000000021001')
    var userId = createApplicantUser(entityId, 'review', 'no_duplicate')
    var note = 'ATF 本人識別情報の桁数をご確認ください。'
    var requested = reviewUtil.requestDefectFix(userId, note)

    check('不備修正の依頼が成功する', requested.success, true)
    check('返却されるアクション', requested.action, 'request_defect')

    var gr = reload(userId)
    check('ステータスが登録不備確認依頼へ遷移する', gr.getValue('u_registration_status'), 'defect_request')
    check('不備内容が保持される', gr.getValue('u_registration_issue_note'), note)

    // トークンと有効期限が発行されている
    var token = gr.getValue('u_defect_fix_token')
    check('トークンが発行される', token.length >= 32, true)
    check('有効期限が設定される', !!gr.getValue('u_defect_fix_expires_on'), true)
    check('有効期限が未来である',
        new GlideDateTime(gr.getValue('u_defect_fix_expires_on')).compareTo(new GlideDateTime()) > 0, true)

    // トークンの検証
    var found = defectUtil.findByToken(token)
    check('トークンが有効と判定される', found.state, 'valid')
    check('短いトークンは拒否される', defectUtil.findByToken('abc'), null)
    check('空のトークンは拒否される', defectUtil.findByToken(''), null)
    check('存在しないトークンは拒否される',
        defectUtil.findByToken('00000000000000000000000000000000000000'), null)

    // 表示内容
    var context = defectUtil.buildContext(found.gr)
    check('不備内容が表示対象に含まれる', context.issueNote, note)
    check('ログインIDが表示対象に含まれる', context.loginId, gr.getValue('user_name'))
    check('事業者名が表示対象に含まれる', context.businessName.indexOf('ATF 不備対応テスト事業者') === 0, true)
    check('法人番号が表示対象に含まれる', context.corporateNumber, '9000000021001')
    check('事業者区分が表示対象に含まれる', context.entityType, 'corporate')

    // 修正画面を開く（登録不備確認依頼 → 登録不備修正中）
    var started = defectUtil.startFixing(found.gr)
    check('修正開始が成功する', started.success, true)
    check('ステータスが遷移する', started.changed, true)
    check('ステータスが登録不備修正中になる', reload(userId).getValue('u_registration_status'), 'defect_fixing')

    // 2回目は遷移しない（リンクを何度開いても1回だけ）
    var again = defectUtil.startFixing(reload(userId))
    check('2回目は遷移しない', again.changed, false)
    check('ステータスは登録不備修正中のまま', reload(userId).getValue('u_registration_status'), 'defect_fixing')

    // 修正中でもトークンは有効（作業を中断して開き直せる）
    check('修正中もトークンは有効', defectUtil.findByToken(token).state, 'valid')

    stepResult.setOutputMessage('不備修正の依頼とトークン検証を確認しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** 再提出とステータスの復帰 */
Test(
    {
        $id: Now.ID['test_sc11d_submit_fix'],
        name: 'SC-11 登録不備対応：修正内容の再提出',
        description:
            'RegistrationDefectUtil.submitFix を検証する。修正内容で事業者情報が更新されステータスが登録申請審査中へ戻ること、重複チェックが再判定され自社レコードが判定対象から除外されること（重複あり（確定）のままにならないこと）、トークンが使い切りで無効化されること、入力不正・二重提出が拒否されることを assertEqual で確認する。再提出後に事務局が承認できる状態（canApprove／isActionable が true）になることも確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc11d_step_submit_fix'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var seq = 0

    /**
     * 本テストは重複チェックの再判定を検証するため、実行ごとに一意な法人番号・事業者名を使う。
     * 固定値にすると前回実行で作成したレコードと一致し、2回目以降の実行で
     * no_duplicate を期待している検証が duplicate になって失敗する。
     *
     * 法人番号は13桁の数字（Q01 暫定仕様）。エポックミリ秒の下10桁＋連番3桁で構成する。
     */
    var RUN = ('' + new GlideDateTime().getNumericValue()).slice(-10)

    /** 実行内で一意な13桁の法人番号 */
    function corporateNumber(index) {
        return RUN + ('00' + index).slice(-3)
    }

    /** 実行内で一意な事業者名（正規化一致による曖昧判定を避けるため） */
    function businessName(label) {
        return 'ATF ' + RUN + ' ' + label
    }

    // 引数名は helper（corporateNumber／businessName）を隠さないようにする
    function createEntity(number, name) {
        seq++
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.initialize()
        gr.setValue('u_business_name', name || businessName('再提出テスト事業者' + seq))
        gr.setValue('u_entity_type', 'corporate')
        gr.setValue('u_corporate_number', number)
        gr.setValue('u_address', 'ATF テスト住所')
        gr.setValue('u_industry', 'service')
        gr.setValue('u_employee_count', 10)
        gr.setValue('u_capital', 5000)
        return gr.insert()
    }

    function createApplicantUser(entityId, duplicate) {
        seq++
        var login = 'atf.sc11e.' + new GlideDateTime().getNumericValue() + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'SC11E-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_business_entity', entityId)
        gr.setValue('u_registration_status', 'review')
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

    function loadEntity(entityId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.get(entityId)
        return gr
    }

    /** 依頼まで実行してトークンを返す */
    function requestFix(userId) {
        new x_dent2_dentsusoke.RegistrationReviewUtil().requestDefectFix(userId, 'ATF 不備内容')
        return reload(userId).getValue('u_defect_fix_token')
    }

    var defectUtil = new x_dent2_dentsusoke.RegistrationDefectUtil()
    var reviewUtil = new x_dent2_dentsusoke.RegistrationReviewUtil()

    // -----------------------------------------------------------------------
    // 正常系：修正して再提出する
    // -----------------------------------------------------------------------
    var fixedName = businessName('修正後の事業者名')
    var entityId = createEntity(corporateNumber(1))
    var userId = createApplicantUser(entityId, 'no_duplicate')
    var token = requestFix(userId)

    var result = defectUtil.submitFix(token, {
        business_name: fixedName,
        entity_type: 'corporate',
        corporate_number: corporateNumber(2),
    })
    check('再提出が成功する', result.success, true)
    check('返却される事業者名', result.businessName, fixedName)

    var entityGr = loadEntity(entityId)
    check('事業者名が更新される', entityGr.getValue('u_business_name'), fixedName)
    check('法人番号が更新される', entityGr.getValue('u_corporate_number'), corporateNumber(2))

    var userGr = reload(userId)
    check('ステータスが登録申請審査中へ戻る', userGr.getValue('u_registration_status'), 'review')
    check('トークンが無効化される', userGr.getValue('u_defect_fix_token'), '')
    check('有効期限がクリアされる', userGr.getValue('u_defect_fix_expires_on'), '')
    // 指摘内容は再審査する事務局が参照するため残す
    check('不備内容は残る', userGr.getValue('u_registration_issue_note'), 'ATF 不備内容')

    // 再提出後は事務局が再度操作できる
    check('事務局が操作できる状態になる', reviewUtil.isActionable(userGr.getValue('u_registration_status')), true)

    // 二重提出は拒否される（トークンは使い切り）
    var twice = defectUtil.submitFix(token, {
        business_name: businessName('二重提出'),
        entity_type: 'corporate',
        corporate_number: corporateNumber(3),
    })
    check('二重提出は拒否される', twice.success, false)

    // -----------------------------------------------------------------------
    // 重複チェックの再判定：自社レコードを除外する
    // 除外しないと自分自身と法人番号が一致し、必ず duplicate_confirmed になって
    // 事務局が承認できない（canApprove が false のまま固まる）
    // -----------------------------------------------------------------------
    var dupCorporateNumber = corporateNumber(11)
    var dupEntityId = createEntity(dupCorporateNumber)
    var dupUserId = createApplicantUser(dupEntityId, 'duplicate_confirmed')
    var dupToken = requestFix(dupUserId)

    // 法人番号を変えずに再提出する（自社レコードとの一致は重複と見なさない）
    var sameResult = defectUtil.submitFix(dupToken, {
        business_name: businessName('自社のみ'),
        entity_type: 'corporate',
        corporate_number: dupCorporateNumber,
    })
    check('法人番号が同じでも再提出できる', sameResult.success, true)
    check('自社レコードは重複と判定されない', sameResult.duplicateResult, 'no_duplicate')
    check('重複チェック結果が更新される',
        reload(dupUserId).getValue('u_duplicate_check_result'), 'no_duplicate')
    check('承認できる状態になる', reviewUtil.canApprove(reload(dupUserId).getValue('u_duplicate_check_result')), true)

    // -----------------------------------------------------------------------
    // 重複チェックの再判定：他社と一致する場合は確定一致のまま
    // -----------------------------------------------------------------------
    var otherCorporateNumber = corporateNumber(21)
    createEntity(otherCorporateNumber, businessName('他社事業者'))
    var conflictEntityId = createEntity(corporateNumber(22))
    var conflictUserId = createApplicantUser(conflictEntityId, 'no_duplicate')
    var conflictToken = requestFix(conflictUserId)

    var conflictResult = defectUtil.submitFix(conflictToken, {
        business_name: businessName('他社と衝突'),
        entity_type: 'corporate',
        corporate_number: otherCorporateNumber,
    })
    check('他社と一致する場合も再提出はできる', conflictResult.success, true)
    check('他社との一致は確定一致と判定される', conflictResult.duplicateResult, 'duplicate_confirmed')
    check('承認できない状態になる',
        reviewUtil.canApprove(reload(conflictUserId).getValue('u_duplicate_check_result')), false)

    // -----------------------------------------------------------------------
    // 異常系：入力不正
    // -----------------------------------------------------------------------
    var ngCorporateNumber = corporateNumber(31)
    var ngEntityId = createEntity(ngCorporateNumber)
    var ngUserId = createApplicantUser(ngEntityId, 'no_duplicate')
    var ngToken = requestFix(ngUserId)

    check('事業者名が空だと拒否される', defectUtil.submitFix(ngToken, {
        business_name: '',
        entity_type: 'corporate',
        corporate_number: ngCorporateNumber,
    }).success, false)

    check('法人番号が13桁でないと拒否される', defectUtil.submitFix(ngToken, {
        business_name: businessName('桁数不正'),
        entity_type: 'corporate',
        corporate_number: '123',
    }).success, false)

    check('事業者区分が不正だと拒否される', defectUtil.submitFix(ngToken, {
        business_name: businessName('区分不正'),
        entity_type: 'invalid_type',
        corporate_number: ngCorporateNumber,
    }).success, false)

    // 入力不正ではステータスもトークンも変わらない
    var ngGr = reload(ngUserId)
    check('入力不正でステータスが変わらない', ngGr.getValue('u_registration_status'), 'defect_request')
    check('入力不正でトークンが残る', ngGr.getValue('u_defect_fix_token'), ngToken)

    // 無効なトークンでの再提出
    check('無効なトークンでは再提出できない', defectUtil.submitFix('abc', {
        business_name: businessName('トークン不正'),
        entity_type: 'corporate',
        corporate_number: ngCorporateNumber,
    }).success, false)

    stepResult.setOutputMessage('修正内容の再提出とステータス復帰を確認しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
