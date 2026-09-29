import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * デモ申請データ（APP-2026-00123）の削除（冪等な是正スクリプト）
 *
 * 申請の入力から提出までの画面（ITCOM-01〜03）が実装され、事業者が自分で申請を
 * 作成できるようになったため、手置きのデモ申請を残す必要がなくなった。
 * デモデータの定義は src/fluent/demo-data/mypage-demo.now.ts から削除しているが、
 * アプリのインストールで行われるのは「レコードが存在しない場合の新規作成」であり、
 * 既にインスタンスへ投入されたレコードは残るため削除処理が必要になる。
 *
 * ■ Fluent に Fix Script の専用 API が無いため Record API で作成する
 * SDK 4.10.1 には sys_script_fix の Fluent API が無い。
 * 補助率マスタの是正（align-subsidy-rate-master.now.ts）と同じ方針。
 *
 * ■ 実行タイミング
 * アプリに含まれる Fix Script は now-sdk install（アプリのインストール）時に自動実行される。
 * 反映されない場合は Studio から手動実行する。
 *
 * ■ 実行後の確認
 * 申請テーブルを申請番号 APP-2026-00123 で検索して0件であれば削除完了。
 * システムログに「[SKS] デモ申請データを削除しました。」または
 * 「[SKS] デモ申請データ（APP-2026-00123）は存在しません。」が出力される。
 *
 * ■ 副作用
 * デモユーザ（sks.demo）のマイページ（SC-05）と申請状況（SC-07）の申請件数が0件になる。
 * 画面の動作確認は、申請の入力（ITCOM-01）→ 対象経費（ITCOM-02）→ 添付書類（ITCOM-03）
 * の順に申請を作成して行う。
 *
 * TODO(削除完了後): 全環境で削除を確認できたら本 Fix Script を削除する。
 */
Record({
    $id: Now.ID['fix_remove_demo_request'],
    table: 'sys_script_fix',
    data: {
        name: 'SKS デモ申請データ（APP-2026-00123）の削除',
        description:
            '手置きのデモ申請データ（申請番号 APP-2026-00123）とその子レコード（対象経費明細・提出書類・処理履歴・信用調査）および添付ファイルを削除する。対象は申請番号で特定し、存在しない場合は何もしないため複数回実行しても影響はない。',
        script: Now.include('../../server/fix-scripts/remove-demo-request.js'),
        // 対象が存在しない場合は何もしないため冪等であり、再実行も可能
        unloadable: false,
        before: false,
    },
})
