import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

/**
 * SC-13 お知らせ作成・編集（事務局）の保存時処理
 *
 * 画面設計書の入力チェックのうち、必須・桁数はテーブル定義（T10）で宣言的に担保できるが、
 * 「公開終了日は公開開始日以降」という項目間の関係は宣言的に表現できないため
 * before insert／update のビジネスルールで判定し、不正な場合は保存を中止する。
 *
 * ステータス遷移（公開状態の切替）はビジネスルールではなく UI Action として実装している
 * （src/fluent/ui-actions/notice-actions.now.ts）。本ルールは保存時の検証のみを担当し、
 * 公開状態そのものを書き換えることはしない。
 *
 * script は文字列リテラルを渡せる Now.include を使用する（既存の UI Action と同じ非モジュール形式）。
 */
BusinessRule({
    $id: Now.ID['br_notice_before_save'],
    name: 'SKS お知らせ 保存時検証',
    table: 'x_dent2_dentsusoke_notice',
    when: 'before',
    action: ['insert', 'update'],
    order: 100,
    active: true,
    description:
        'お知らせの公開期間の前後関係・本文の未入力を検証し、作成者を補完する（SC-13／処理No.40・41）。不正な場合は保存を中止する。',
    script: Now.include('../../server/business-rules/notice-before-save.js'),
})
