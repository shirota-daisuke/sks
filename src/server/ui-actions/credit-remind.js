/**
 * 信用調査 ③アクション「調査を督促する」（画面イメージ ITCOM-08）
 *
 * 申請を外部信用調査中 → 調査結果取込待ち（result_waiting）へ遷移させ、
 * 督促した事実を処理履歴へ残す。
 * 調査レコードの状態は依頼済（調査中）のまま変えない（調査は継続しているため）。
 *
 * 督促の連絡そのものはシステム外で行う。
 * TODO(要確認): 督促の運用（タイミング・手段）が未確定。自動督促は実装していない。
 */
;(function () {
    var result = new x_dent2_dentsusoke.ApplicationCreditUtil().remind(
        current.getUniqueValue(),
        gs.getUserID(),
    )

    if (!result.success) {
        gs.addErrorMessage(result.errors.join(' '))
        action.setRedirectURL(current)
        return
    }

    gs.addInfoMessage(result.message)
    for (var i = 0; i < result.warnings.length; i++) {
        gs.addInfoMessage(result.warnings[i])
    }

    // 更新後の値を表示するためレコードを開き直す
    action.setRedirectURL(current)
})()
