/**
 * デモ申請データ（APP-2026-00123）の削除（冪等）
 *
 * 申請の入力から提出までの画面（ITCOM-01〜03）が実装され、事業者が自分で申請を
 * 作成できるようになったため、手置きのデモ申請を残す必要がなくなった。
 * 手置きのデータは対象経費明細も提出書類も持たないため、画面の動作確認の妨げになる。
 *
 * ■ なぜ Fix Script が必要か
 * アプリのインストールで行われるのは「レコードが存在しない場合の新規作成」であり、
 * 定義（src/fluent/demo-data/mypage-demo.now.ts）から削除しても
 * 既にインスタンスへ投入されたレコードは残る。
 * 補助率マスタの是正（align-subsidy-rate-master.js）と同じ理由で削除処理が必要になる。
 *
 * ■ 対象の特定
 * トンマナ 3.4.1「sys_id のハードコード禁止」に従い、申請番号で特定する。
 * 申請番号は APP-<西暦>-<5桁連番> で採番され、既存の最大連番＋1 が払い出されるため、
 * デモデータが占めている 00123 が実データと衝突することはない。
 *
 * ■ 子レコードも削除する
 * 申請を参照する子テーブル（対象経費明細・提出書類・処理履歴・信用調査）に
 * 行が残ると、参照先が存在しない孤立データになる。
 * デモデータにはいずれも存在しないが、手作業で追加されている可能性があるため
 * 併せて削除する。提出書類は実ファイル（sys_attachment）も削除する。
 *
 * TODO(削除完了後): 全環境で削除を確認できたら本 Fix Script を削除する。
 *   削除は本ファイルと src/fluent/fix-scripts/remove-demo-request.now.ts を削除して
 *   再デプロイすれば足りる。
 */
;(function () {
    var TARGET_NUMBER = 'APP-2026-00123'

    /** 申請を参照する子テーブル（参照列はいずれも u_request） */
    var CHILD_TABLES = [
        'x_dent2_dentsusoke_exp_item',
        'x_dent2_dentsusoke_req_doc',
        'x_dent2_dentsusoke_req_log',
        'x_dent2_dentsusoke_credit',
    ]

    var request = new GlideRecord('x_dent2_dentsusoke_request')
    request.addQuery('u_application_number', TARGET_NUMBER)
    // デモデータは1件だが、万一重複していても取りこぼさないよう上限を明示する（トンマナ 3.3.2）
    request.setLimit(10)
    request.query()

    if (!request.hasNext()) {
        gs.info('[SKS] デモ申請データ（' + TARGET_NUMBER + '）は存在しません。削除は不要です。')
        return
    }

    var deletedRequests = 0
    var deletedChildren = 0
    var deletedAttachments = 0

    while (request.next()) {
        var requestId = request.getUniqueValue()
        var entityName = request.getDisplayValue('u_business_entity')

        // 子レコードを先に削除する（申請を先に消すと参照先を辿れなくなる）
        for (var i = 0; i < CHILD_TABLES.length; i++) {
            var child = new GlideRecord(CHILD_TABLES[i])
            child.addQuery('u_request', requestId)
            child.setLimit(100)
            child.query()

            while (child.next()) {
                var childId = child.getUniqueValue()
                deletedAttachments += removeAttachments(CHILD_TABLES[i], childId)

                if (child.deleteRecord()) {
                    deletedChildren++
                } else {
                    gs.error(
                        '[SKS] デモ申請データの子レコードの削除に失敗しました。table=' +
                            CHILD_TABLES[i] +
                            ' sys_id=' +
                            childId,
                    )
                }
            }
        }

        // 申請レコード自身に直接添付されたファイルも削除する
        deletedAttachments += removeAttachments('x_dent2_dentsusoke_request', requestId)

        if (request.deleteRecord()) {
            deletedRequests++
            gs.info(
                '[SKS] デモ申請データを削除しました。number=' +
                    TARGET_NUMBER +
                    ' entity=' +
                    entityName +
                    ' sys_id=' +
                    requestId,
            )
        } else {
            gs.error('[SKS] デモ申請データの削除に失敗しました。sys_id=' + requestId)
        }
    }

    gs.info(
        '[SKS] デモ申請データの削除が完了しました。申請=' +
            deletedRequests +
            '件 子レコード=' +
            deletedChildren +
            '件 添付=' +
            deletedAttachments +
            '件',
    )

    /** 指定レコードの添付ファイルを削除し、削除件数を返す */
    function removeAttachments(tableName, recordId) {
        var count = 0
        var gr = new GlideRecord('sys_attachment')
        gr.addQuery('table_name', tableName)
        gr.addQuery('table_sys_id', recordId)
        gr.setLimit(100)
        gr.query()

        var sysAttachment = new GlideSysAttachment()
        while (gr.next()) {
            sysAttachment.deleteAttachment(gr.getUniqueValue())
            count++
        }
        return count
    }
})()
