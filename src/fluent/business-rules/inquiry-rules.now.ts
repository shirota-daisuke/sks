import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

/**
 * SC-14 問合せ管理・返信（事務局）の保存時処理
 *
 * 必須・桁数はテーブル定義（T12）で宣言的に担保できるが、
 * 「状態＝回答済のときは回答本文が必須／回答日時を記録する」という状態と他項目の関係は
 * 宣言的に表現できないため before insert／update のビジネスルールで担保する。
 *
 * 状態遷移そのもの（返信・差し戻し・対応者割当）はビジネスルールではなく UI Action として
 * 実装している（src/fluent/ui-actions/inquiry-actions.now.ts）。
 * 本ルールは保存時の整合性確保のみを担当し、状態を勝手に進めることはしない。
 *
 * script は文字列リテラルを渡せる Now.include を使用する（既存の UI Action と同じ非モジュール形式）。
 */
BusinessRule({
    $id: Now.ID['br_inquiry_before_save'],
    name: 'SKS 問合せ 保存時整合性チェック',
    table: 'x_dent2_dentsusoke_inquiry',
    when: 'before',
    action: ['insert', 'update'],
    order: 100,
    active: true,
    description:
        '状態＝回答済の問合せに回答本文があることを検証し、回答日時・受付日時を補完する（SC-14／処理No.47）。回答本文が無い場合は保存を中止する。',
    script: Now.include('../../server/business-rules/inquiry-before-save.js'),
})
