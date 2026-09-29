import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * 申請の添付書類（画面イメージ ITCOM-03）。
 *
 * 提出書類の行（x_dent2_dentsusoke_req_doc）の整備、実ファイル（sys_attachment）との
 * 突き合わせ、ファイル形式・サイズの検証、必須書類の充足チェックを担当する。
 *
 * ファイルのアップロードは画面から添付 REST API へ直接送るため、
 * 形式・サイズの検証はアップロード後に本クラスで行う（画面側の検証は入力補助）。
 *
 * ポータルのウィジェットから呼ぶため accessibleFrom は 'public' とする。
 */
export const ApplicationDocumentUtil = ScriptInclude({
    $id: Now.ID['ApplicationDocumentUtil'],
    name: 'ApplicationDocumentUtil',
    description:
        '申請の提出書類（ITCOM-03）。書類種別ごとの行の整備、添付ファイルの形式・サイズ検証と差し替え、必須書類の充足チェックを担当する。',
    script: Now.include('../../server/script-includes/application-document-util.js'),
    accessibleFrom: 'public',
})
