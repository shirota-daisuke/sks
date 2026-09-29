import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * お知らせの公開範囲判定（処理No.40／41）と既読／未読管理（処理No.43）。
 * SC-05 マイページと SC-08 お知らせ一覧で共通利用する。
 */
export const NoticeUtil = ScriptInclude({
    $id: Now.ID['NoticeUtil'],
    name: 'NoticeUtil',
    description: 'お知らせの公開範囲判定と既読／未読管理（処理No.40／41／43）',
    script: Now.include('../../server/script-includes/notice-util.js'),
    accessibleFrom: 'public',
})
