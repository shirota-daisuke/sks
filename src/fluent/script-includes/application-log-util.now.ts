import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * 申請の処理履歴の記録・取得（ITCOM-05／07／08／09 のタイムライン）。
 *
 * 事業者向け画面（未認証のトークンアクセスを含む）からも呼ぶため
 * accessibleFrom は 'public' とする。
 */
export const ApplicationLogUtil = ScriptInclude({
    $id: Now.ID['ApplicationLogUtil'],
    name: 'ApplicationLogUtil',
    description:
        '申請の業務イベントを処理履歴テーブルへ記録し、画面表示用に取得する。sys_audit では業務単位で並べられないため専用テーブルを持つ。記録の失敗は業務処理を止めない。',
    script: Now.include('../../server/script-includes/application-log-util.js'),
    accessibleFrom: 'public',
})
