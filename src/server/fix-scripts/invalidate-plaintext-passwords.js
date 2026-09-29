/**
 * SKS 平文パスワードの無効化（一度だけ実行する是正スクリプト）
 *
 * ■ 背景
 * SC-03 本登録・SC-04 パスワードリセットで user_password を setValue() で書き込んでいたため、
 * 一方向ハッシュ化されず平文がそのまま保存されていた。
 * コード側は項目の setDisplayValue() を使う形へ修正済みだが、
 * 修正前に登録された既存ユーザには平文が残っている。
 *
 * ■ このスクリプトが行うこと
 *   1. user_password が一方向ハッシュ形式（$s$ で始まる）でないユーザのパスワードをクリアする
 *   2. password_needs_reset を立て、次回ログイン時にパスワード再設定を要求する
 *   3. ログイン失敗の蓄積でロックされたアカウントを解除する（失敗回数もリセットする）
 *
 * パスワードをクリアするため、対象ユーザは SC-04 パスワードリセットから
 * 再設定して初めてログインできる状態になる。
 * 平文をハッシュへ変換するのではなくクリアするのは、
 * 平文が漏えいしている可能性のある値をそのまま有効なパスワードとして残さないため。
 *
 * ■ 実行後の確認
 * ATF テスト「SC-03／SC-04 パスワード：平文の残存確認」が成功すれば是正完了。
 *
 * ■ 冪等性
 * ハッシュ形式のユーザは対象外にしているため、複数回実行しても影響はない。
 */
;(function invalidatePlaintextPasswords() {
    // 文字列リテラルとして直接書くと環境によって置換されうるため組み立てる
    var HASH_PREFIX = '$' + 's' + '$'

    var cleared = []
    var unlocked = []
    var skippedHashed = 0
    var skippedEmpty = 0

    var gr = new GlideRecord('x_dent2_dentsusoke_user')
    gr.orderBy('user_name')
    gr.query()

    while (gr.next()) {
        var login = gr.getValue('user_name')
        var password = gr.getValue('user_password') || ''
        var isLocked = gr.getValue('locked_out') === '1'
        var failedAttempts = parseInt(gr.getValue('failed_attempts'), 10) || 0
        var changed = false

        if (!password) {
            skippedEmpty++
        } else if (password.indexOf(HASH_PREFIX) === 0) {
            skippedHashed++
        } else {
            // 平文のパスワードをクリアし、再設定を要求する
            gr.setValue('user_password', '')
            gr.setValue('password_needs_reset', true)
            cleared.push(login)
            changed = true
        }

        // ログイン失敗の蓄積による影響を取り除く（平文保存が原因で全員ログインできなかったため）
        if (isLocked || failedAttempts > 0) {
            gr.setValue('locked_out', false)
            gr.setValue('failed_attempts', 0)
            unlocked.push(login + (isLocked ? '（ロック解除）' : '（失敗回数リセット）'))
            changed = true
        }

        if (changed && !gr.update()) {
            gs.error('[SKS] 平文パスワードの無効化に失敗しました。user=' + login)
        }
    }

    gs.info(
        '[SKS] 平文パスワードの無効化を実行しました。' +
            'クリア=' + cleared.length + '件' +
            ' / ロック解除・失敗回数リセット=' + unlocked.length + '件' +
            ' / ハッシュ済みのため対象外=' + skippedHashed + '件' +
            ' / 未設定のため対象外=' + skippedEmpty + '件',
    )
    if (cleared.length > 0) {
        gs.info('[SKS] パスワードをクリアしたユーザ: ' + cleared.join(', '))
    }
    if (unlocked.length > 0) {
        gs.info('[SKS] ロック解除・失敗回数をリセットしたユーザ: ' + unlocked.join(', '))
    }
})()
