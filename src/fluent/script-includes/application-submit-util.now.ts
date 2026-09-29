import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * 申請の入力・提出（処理No.16／No.17）。
 *
 * 申請機能は ITCOM 主担当の範囲であり本アプリの設計対象外だが、
 * 事業者が申請を提出できる経路が存在しなかったため最小限の実装を用意している。
 * T03 のテーブル定義には項目を追加せず、既存の列のみで完結させている。
 *
 * ポータルのウィジェット（application-form）から呼ぶため accessibleFrom は 'public' とする。
 */
export const ApplicationSubmitUtil = ScriptInclude({
    $id: Now.ID['ApplicationSubmitUtil'],
    name: 'ApplicationSubmitUtil',
    description:
        '申請の下書き保存・提出と補助金額自動判定（処理No.16／No.17）。補助上限額マスタ・補助率マスタから基準を引き当て、補助率は分数で計算して丸め誤差を避ける。',
    script: Now.include('../../server/script-includes/application-submit-util.js'),
    accessibleFrom: 'public',
})
