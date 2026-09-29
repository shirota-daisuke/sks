import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

/**
 * SC-13 お知らせ作成・編集画面：NoticeAdminUtil の単体テスト
 *
 * ビジネスルールのテストは sc13-notice.now.ts にある。
 * 本ファイルは Script Include（入力検証・公開／非公開の切替）を対象とする。
 *
 * 検証には Jasmine を使わず assertEqual を使う（理由は sc11-registration-review.now.ts のコメント参照）。
 * assertEqual は最初の不一致でステップを終了するため、観点ごとにテストを分けている。
 */

/** 入力検証（公開範囲設定：処理No.40／公開期間設定：処理No.41） */
Test(
    {
        $id: Now.ID['test_sc13_validate'],
        name: 'SC-13 お知らせ：入力検証',
        description:
            'NoticeAdminUtil.validate を検証する。妥当な内容が検証を通ること（正常系）と、公開終了日が公開開始日より前・本文が空タグのみ・タイトル未入力・タイトル桁数超過・公開日未入力・対象未指定で検証エラーになること（異常系）を assertEqual で確認する。公開開始日と公開終了日が同日の境界値も併せて確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc13_step_validate'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    /** validate へ渡すための、未保存の GlideRecord を組み立てる */
    function buildUnsaved(overrides) {
        var gr = new GlideRecord('x_dent2_dentsusoke_notice')
        gr.initialize()
        gr.setValue('u_title', 'ATF 検証用タイトル')
        gr.setValue('u_body', '<p>ATF 検証用本文</p>')
        gr.setValue('u_visibility_scope', 'all')
        gr.setValue('u_publish_start_date', '2026-01-01')
        gr.setValue('u_publish_end_date', '2026-12-31')
        gr.setValue('u_priority', 'middle')
        gr.setValue('u_publish_status', 'private')
        for (var key in overrides) {
            gr.setValue(key, overrides[key])
        }
        return gr
    }

    var util = new x_dent2_dentsusoke.NoticeAdminUtil()

    // 正常系
    var ok = util.validate(buildUnsaved({}))
    check('妥当な内容は検証を通る', ok.valid, true)
    check('妥当な内容ではエラーが無い', ok.errors.length, 0)

    // 境界値：公開開始日と公開終了日が同日
    var sameDay = util.validate(
        buildUnsaved({ u_publish_start_date: '2026-06-01', u_publish_end_date: '2026-06-01' }),
    )
    check('公開開始日と公開終了日が同日なら検証を通る', sameDay.valid, true)

    // 異常系：公開期間の前後関係
    var reversed = util.validate(
        buildUnsaved({ u_publish_start_date: '2026-12-31', u_publish_end_date: '2026-01-01' }),
    )
    check('公開終了日が公開開始日より前なら検証エラー', reversed.valid, false)
    check('公開期間の逆転でエラーが返る', reversed.errors.length > 0, true)

    // 異常系：本文が実質未入力
    check('本文が空の段落タグのみなら検証エラー', util.validate(buildUnsaved({ u_body: '<p></p>' })).valid, false)
    check(
        '本文が空白文字のみのタグなら検証エラー',
        util.validate(buildUnsaved({ u_body: '<p>&nbsp;</p>' })).valid,
        false,
    )
    check('本文が未入力なら検証エラー', util.validate(buildUnsaved({ u_body: '' })).valid, false)

    // 異常系：タイトル
    check('タイトルが空白のみなら検証エラー', util.validate(buildUnsaved({ u_title: '   ' })).valid, false)
    var tooLongTitle = new Array(102).join('a')
    check('検証用タイトルが上限を超えている', tooLongTitle.length > 100, true)
    check(
        'タイトルが桁数上限を超えるなら検証エラー',
        util.validate(buildUnsaved({ u_title: tooLongTitle })).valid,
        false,
    )

    // 異常系：公開日未入力
    var noDates = util.validate(buildUnsaved({ u_publish_start_date: '', u_publish_end_date: '' }))
    check('公開開始日・公開終了日が未入力なら検証エラー', noDates.valid, false)
    check('公開日2件分のエラーが返る', noDates.errors.length > 1, true)

    // 異常系：公開範囲・重要度の未選択
    check('公開範囲が未選択なら検証エラー', util.validate(buildUnsaved({ u_visibility_scope: '' })).valid, false)
    check('重要度が未選択なら検証エラー', util.validate(buildUnsaved({ u_priority: '' })).valid, false)

    // 異常系：対象未指定
    check('対象未指定なら検証エラー', util.validate(null).valid, false)

    stepResult.setOutputMessage('入力検証の正常系・異常系を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)

/** 公開／非公開の切替 */
Test(
    {
        $id: Now.ID['test_sc13_publish'],
        name: 'SC-13 お知らせ：公開・非公開の切替',
        description:
            'NoticeAdminUtil.publish／unpublish を検証する。非公開のお知らせを公開状態へ確定し、公開中のお知らせを非公開へ戻せること（正常系）と、公開済みへの再公開・非公開への非公開化・対象なしが拒否されること（異常系）を確認する。メール通知有無が「あり」のときのみ未送信の警告を返すことも併せて確認する。',
        active: true,
        failOnServerError: true,
    },
    (atf) => {
        atf.server.runServerSideScript({
            $id: Now.ID['test_sc13_step_publish'],
            script: `
(function (outputs, steps, params, stepResult, assertEqual) {
    function check(name, value, shouldbe) {
        assertEqual({ name: name, shouldbe: shouldbe, value: value })
    }

    var seq = 0

    /** 検証用のお知らせを1件作成する（ビジネスルールを通るため妥当な値で作る） */
    function createNotice(status, overrides) {
        seq++
        var gr = new GlideRecord('x_dent2_dentsusoke_notice')
        gr.initialize()
        gr.setValue('u_title', 'ATF SC-13 公開切替テスト ' + seq)
        gr.setValue('u_body', '<p>ATF テスト本文</p>')
        gr.setValue('u_visibility_scope', 'all')
        gr.setValue('u_publish_start_date', '2026-01-01')
        gr.setValue('u_publish_end_date', '2026-12-31')
        gr.setValue('u_priority', 'middle')
        gr.setValue('u_publish_status', status)
        gr.setValue('u_email_notify_flag', false)
        gr.setValue('u_created_by_staff', gs.getUserID())
        for (var key in overrides) {
            gr.setValue(key, overrides[key])
        }
        return gr.insert()
    }

    function reload(noticeId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_notice')
        gr.get(noticeId)
        return gr
    }

    var util = new x_dent2_dentsusoke.NoticeAdminUtil()

    // 正常系：公開
    var publishId = createNotice('private', {})
    var publishResult = util.publish(publishId)
    check('公開が成功する', publishResult.success, true)
    check('返却されるアクション', publishResult.action, 'publish')
    check('公開状態が公開へ確定する', reload(publishId).getValue('u_publish_status'), 'published')
    check('メール通知なしでは警告を返さない', publishResult.warnings.length, 0)

    // 正常系：メール通知ありのとき未送信の警告
    var notifyId = createNotice('private', { u_email_notify_flag: true })
    var notifyResult = util.publish(notifyId)
    check('メール通知ありでも公開は成功する', notifyResult.success, true)
    check('メール通知ありでは未送信の警告を返す', notifyResult.warnings.length > 0, true)

    // 異常系：既に公開済み
    var alreadyId = createNotice('published', {})
    var alreadyResult = util.publish(alreadyId)
    check('公開済みのお知らせは公開できない', alreadyResult.success, false)
    check('公開済みへの公開でエラーが返る', alreadyResult.errors.length > 0, true)

    // 異常系：対象なし
    check('対象が存在しない場合は公開できない', util.publish('00000000000000000000000000000000').success, false)

    // 正常系：非公開
    var unpublishId = createNotice('published', {})
    var unpublishResult = util.unpublish(unpublishId)
    check('非公開化が成功する', unpublishResult.success, true)
    check('返却されるアクション', unpublishResult.action, 'unpublish')
    check('公開状態が非公開へ戻る', reload(unpublishId).getValue('u_publish_status'), 'private')

    // 異常系：既に非公開
    var privateId = createNotice('private', {})
    check('非公開のお知らせは非公開にできない', util.unpublish(privateId).success, false)

    stepResult.setOutputMessage('公開・非公開の切替を検証しました')
})(outputs, steps, params, stepResult, assertEqual)
`,
        })
    },
)
