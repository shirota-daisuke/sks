/**
 * 登録不備修正画面 — サーバースクリプト（処理No.7 の事業者側）
 *
 * ③アクション定義
 *   No.1「修正内容を提出する」ボタン → 事業者情報を更新し、ステータスを 登録不備修正中 → 登録申請審査中 へ遷移
 *
 * ⑤表示条件
 *   不備確認依頼メールのリンクに含まれる一時トークンでアクセスした場合のみ表示する。
 *
 * アクセス制御
 *   この時点の申請者には applicant ロールが無い（権限設計書 2章：ロールは承認時に付与）ため、
 *   未認証でアクセスできる必要がある。対象の限定はトークンの一致・有効期限・ステータスで行う。
 *   判定とステータス遷移は RegistrationDefectUtil に集約している。
 */
;(function () {
    data.state = 'invalid' // 'form' | 'done' | 'expired' | 'invalid' | 'resubmitted'
    data.result = null
    data.token = ''
    data.context = null
    data.topUrl = '?id=' + (options.top_page || 'x_dent2_dentsusoke_top')
    data.inquiryNote =
        options.inquiry_note ||
        'ご不明な点がある場合は、お手数ですが事務局へお問い合わせください（ログイン後の問合せ画面はご利用いただけません）。'

    // 初回表示は URL パラメータ、更新時（c.server.update）はクライアントが保持している値を使う
    var token = ''
    if (input && input.token) {
        token = input.token + ''
    } else {
        token = ($sp.getParameter('token') || '') + ''
    }

    var defectUtil = new x_dent2_dentsusoke.RegistrationDefectUtil()

    // 再提出は先に実行する（成功した場合は完了画面のみを表示する）
    if (input && input.action === 'submit_fix') {
        data.result = defectUtil.submitFix(token, input)
        if (data.result.success) {
            data.state = 'done'
            return
        }
    }

    var found = defectUtil.findByToken(token)
    if (!found) {
        return
    }
    if (found.state === 'expired') {
        data.state = 'expired'
        return
    }
    if (found.state === 'done') {
        // 再提出済み・審査済みのリンクを再度開いた場合
        data.state = 'resubmitted'
        return
    }

    // 登録不備確認依頼 → 登録不備修正中（事務局の一覧で着手済みを判別できるようにする）
    defectUtil.startFixing(found.gr)

    data.state = 'form'
    data.token = token
    data.context = defectUtil.buildContext(found.gr)
})()
