import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * 補助率マスタの値の是正（冪等な是正スクリプト）
 *
 * 補助率マスタの全区分が 1/2 で同一になっており、小規模区分（個人事業主・5人以下）に
 * 適用すべき 2/3 が反映されていない状態を是正する。
 *
 * 原因は初期データの投入方式にある。アプリのインストールで行われるのは
 * 「レコードが存在しない場合の新規作成」のみで既存レコードは更新されないため、
 * 補助率を DecimalColumn から分子・分母へ作り替える前に投入された6行が
 * 列の既定値だった 1/2 のまま残っている
 * （経緯は src/fluent/master-data/subsidy-rate-master.now.ts のコメントを参照）。
 *
 * ■ Fluent に Fix Script の専用 API が無いため Record API で作成する
 * SDK 4.10.1 には sys_script_fix の Fluent API が無い。
 * SC-03／SC-04 の平文パスワード是正（invalidate-plaintext-passwords.now.ts）と同じ方針。
 *
 * ■ 実行タイミング
 * アプリに含まれる Fix Script は now-sdk install（アプリのインストール）時に自動実行される。
 * Studio からの手動実行は不要。
 * ただし「インストールのたびに必ず走る」かは確認できていないため、
 * 反映されない場合は Studio から手動実行する。
 *
 * ■ 実行後の確認
 * ATF テスト「SC-16 マスタメンテナンス：補助率マスタの値」が成功すれば是正完了。
 *
 * TODO(是正完了後): 全環境で値がそろったことを確認できたら本 Fix Script を削除する。
 *   削除は本ファイルと src/server/fix-scripts/align-subsidy-rate-master.js を削除して
 *   再デプロイすれば足りる（keys.ts が deleted として扱う）。
 */
Record({
    $id: Now.ID['fix_align_subsidy_rate_master'],
    table: 'sys_script_fix',
    data: {
        name: 'SKS 補助率マスタの値の是正',
        description:
            '補助率マスタの分子・分母を初期データ定義（小規模区分は 2/3、中小企業区分は 1/2）へそろえる。補助率を DecimalColumn から分子・分母へ作り替える前に投入された既存レコードが、列の既定値だった 1/2 のまま残っている状態を是正する。値が既に一致している行は更新せず、備考は空の場合のみ補うため複数回実行しても影響はない。',
        script: Now.include('../../server/fix-scripts/align-subsidy-rate-master.js'),
        // 値が一致している行は更新しないため冪等であり、再実行も可能
        unloadable: false,
        before: false,
    },
})
