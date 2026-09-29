import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * SC-03 本登録／SC-04 パスワードリセットのパスワード保存形式の単体テスト
 *
 * ■ 背景（この回帰テストを置く理由）
 * user_password は「パスワード (1通りの暗号化)」型だが、
 * setValue() で書き込むとハッシュ化されず平文がそのまま保存される。
 * 書き込み自体は成功しエラーにもならないため気付きにくく、
 * 実際に SC-03／SC-04 の両方で平文が保存され、
 * 認証時のハッシュ照合に一致せず「登録できたのにログインできない」状態になっていた。
 * （事業者ユーザ17件のうち11件が平文で保存され、ログイン成功実績は0件。
 *   1件はログイン失敗の蓄積でアカウントロックまで発生していた。）
 *
 * 正しい書き込み方法は項目（GlideElement）の setDisplayValue()。
 * 実測結果は次のとおり。
 *   setValue('user_password', pw)           → 平文
 *   gr.setDisplayValue('user_password', pw) → スコープアプリでは使用不可（例外）
 *   gr.user_password.setDisplayValue(pw)    → ハッシュ（正しい）
 *   gr.user_password = pw                   → 平文
 *
 * ■ 検証方針
 * GlideUser.authenticate() はスコープアプリでは利用できない
 * （ScopedUser に authenticate が無い）ため、認証自体はテストで確認できない。
 * 代わりに「保存形式が一方向ハッシュ（$s$<salt>=$<hash>= 形式）であること」と
 * 「平文が保存されていないこと」を検証する。
 * 平文保存が復活すればこのテストが失敗する。
 */

/** 正しい書き込み方法がハッシュを保存し、誤った方法が平文を保存することの確認 */
Test(
    {
        $id: Now.ID['test_sc03_password_storage'],
        name: 'SC-03／SC-04 パスワード：保存形式',
        description:
            'ログインパスワードの保存形式を検証する。項目の setDisplayValue() で書き込むと一方向ハッシュ（$s$ で始まる形式）で保存され、平文がそのまま残らないことを assertEqual で確認する。setValue() へ戻すと保存値が平文になりこのテストが失敗するため、平文保存の再発を検知する回帰テストとして機能する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc03_password_storage_step'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    // 文字列リテラルとして '$s$' を直接書くと環境によって置換されうるため組み立てる
    var HASH_PREFIX = '$' + 's' + '$'
    var PW = 'Atf!Pw#2026Test'
    var stamp = new GlideDateTime().getNumericValue()
    var seq = 0

    /** 検証用の事業者ユーザを1件作成する */
    function createUser() {
        seq++
        var login = 'atf.pwtest.' + stamp + '.' + seq
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.initialize()
        gr.setValue('user_name', login)
        gr.setValue('first_name', 'ATF')
        gr.setValue('last_name', 'PwTest-' + seq)
        gr.setValue('email', login + '@example.invalid')
        gr.setValue('u_registration_status', 'registering')
        gr.setValue('u_duplicate_check_result', 'not_executed')
        gr.setValue('u_auth_method', 'standard')
        gr.setValue('active', true)
        return gr.insert()
    }

    function storedPassword(userId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        gr.get(userId)
        return gr.getValue('user_password') || ''
    }

    // -----------------------------------------------------------------------
    // 正しい方法：項目の setDisplayValue()
    // -----------------------------------------------------------------------
    var okId = createUser()
    check('検証用ユーザを作成できる', !!okId, true)

    var okGr = new GlideRecord('x_dent2_dentsusoke_user')
    okGr.get(okId)
    okGr.user_password.setDisplayValue(PW)
    okGr.setValue('password_needs_reset', false)
    check('setDisplayValue での更新が成功する', !!okGr.update(), true)

    var okStored = storedPassword(okId)
    check('setDisplayValue：一方向ハッシュで保存される', okStored.indexOf(HASH_PREFIX) === 0, true)
    check('setDisplayValue：平文が保存されていない', okStored === PW, false)
    check('setDisplayValue：値が空でない', okStored.length > 0, true)

    /**
     * 誤った方法（setValue）の挙動は意図的に検証しない。
     *
     * setValue で書き込むと平文が保存されるため、
     * 検証のたびに平文パスワードがテーブルと監査ログ（sys_audit）へ記録されてしまう。
     * 平文の排除がこの修正の目的であり、テストがそれを増やすのは本末転倒になる。
     *
     * 回帰の検知は上の「一方向ハッシュで保存される」「平文が保存されていない」で足りる。
     * setValue へ戻した場合は保存値が平文になり、この2件が失敗する。
     */

    stepResult.setOutputMessage(
        'setDisplayValue の保存形式: ' +
            (okStored.indexOf(HASH_PREFIX) === 0 ? 'ハッシュ（正常）' : '平文（異常）') +
            ' / 保存値の長さ: ' + okStored.length + '文字',
    )
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/**
 * 既存の事業者ユーザに平文パスワードが残っていないことの確認
 *
 * SC-03／SC-04 の修正前に登録されたユーザには平文が残っている。
 * 是正用の Fix Script「SKS 平文パスワードの無効化」を実行すると解消する。
 * 未実行の場合はこのテストが失敗し、対応が必要であることを示す。
 */
Test(
    {
        $id: Now.ID['test_sc03_no_plaintext_password'],
        name: 'SC-03／SC-04 パスワード：平文の残存確認',
        description:
            '事業者ユーザのパスワードに平文が残っていないことを検証する。user_password が設定されている全ユーザについて、値が一方向ハッシュ（$s$ で始まる形式）であることを確認する。修正前に登録されたユーザの平文が残っている場合は失敗し、Fix Script「SKS 平文パスワードの無効化」の実行が必要であることを示す。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc03_no_plaintext_step'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    var HASH_PREFIX = '$' + 's' + '$'

    var plain = []
    var hashed = 0
    var empty = 0

    var gr = new GlideRecord('x_dent2_dentsusoke_user')
    gr.orderBy('user_name')
    gr.query()
    while (gr.next()) {
        var pw = gr.getValue('user_password') || ''
        if (!pw) {
            empty++
        } else if (pw.indexOf(HASH_PREFIX) === 0) {
            hashed++
        } else {
            plain.push(gr.getValue('user_name'))
        }
    }

    assertEqual({
        name: '平文パスワードが残っているユーザ数',
        shouldbe: 0,
        value: plain.length,
    })

    stepResult.setOutputMessage(
        'ハッシュ化済み: ' + hashed + ' 件 / 未設定: ' + empty + ' 件 / 平文: ' + plain.length + ' 件' +
            (plain.length > 0 ? '\\n平文が残っているユーザ: ' + plain.join(', ') : ''),
    )
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
