import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * 対象経費明細（処理No.18 対象経費登録／ITCOM-02）。
 *
 * 明細の登録・更新・削除、合計金額の再計算、専門家経費の日額上限検証を担当する。
 * 合計は T03 の u_total_expense_amount へ書き戻し、あわせて補助金額も再判定する
 * （対象経費が変わったのに補助金額が古いまま残るのを防ぐ）。
 *
 * ポータルのウィジェットから呼ぶため accessibleFrom は 'public' とする。
 */
export const ApplicationExpenseUtil = ScriptInclude({
    $id: Now.ID['ApplicationExpenseUtil'],
    name: 'ApplicationExpenseUtil',
    description:
        '対象経費明細の登録・更新・削除と合計金額の再計算、専門家経費日額上限マスタによる日額上限の検証（処理No.18）。',
    script: Now.include('../../server/script-includes/application-expense-util.js'),
    accessibleFrom: 'public',
})
