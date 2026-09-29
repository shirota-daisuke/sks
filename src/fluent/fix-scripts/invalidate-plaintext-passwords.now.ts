import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * 平文パスワードの無効化（一度だけ実行する是正スクリプト）
 *
 * SC-03 本登録・SC-04 パスワードリセットで user_password が平文保存されていた不具合の
 * 既存データ是正用。コード側の修正だけでは既存レコードの平文は消えないため、
 * Fix Script として用意する。
 *
 * ■ 実行タイミング（重要）
 * アプリに含まれる Fix Script は now-sdk install（アプリのインストール）時に
 * 自動実行される。当初「デプロイ後に手動実行する」想定でコメントしていたが、
 * 実際には初回デプロイ時点で自動実行されていた
 * （syslog: 2026-09-09 07:01:23「クリア=11件 / ロック解除・失敗回数リセット=4件」）。
 *
 * したがって Studio からの手動実行は不要。
 *
 * なお、本スクリプトを追加したデプロイでは実行されたが、
 * その後スクリプト内容を変更せずに再デプロイした際は再実行されなかった。
 * 「インストールのたびに必ず走る」かどうかは確認できていない。
 * いずれにせよ本スクリプトはハッシュ形式のパスワードを対象外にしているため冪等であり、
 * 再実行されても対象0件となり影響はない。
 *
 * TODO(是正完了後): 平文が残っていないことを確認できたら、本 Fix Script を削除する
 *   （ATF テスト「SC-03／SC-04 パスワード：平文の残存確認」が成功する状態を維持できていれば不要）。
 *   削除は本ファイルを削除して再デプロイすれば足りる（keys.ts が deleted として扱う）。
 *
 * ■ Fluent に Fix Script の専用 API が無いため Record API で作成する
 * SDK 4.10.1 には sys_script_fix の Fluent API が無い（docs/api 配下に存在しない）。
 * SC-11 の sys_ux_form_action や SC-17 の sys_report と同じ方針で汎用の Record API を用いる。
 *
 * ■ 実行後の確認
 * ATF テスト「SC-03／SC-04 パスワード：平文の残存確認」が成功すれば是正完了。
 */
Record({
    $id: Now.ID['fix_invalidate_plaintext_passwords'],
    table: 'sys_script_fix',
    data: {
        name: 'SKS 平文パスワードの無効化',
        description:
            'SC-03／SC-04 で user_password が平文保存されていた不具合の是正。ハッシュ形式でないパスワードをクリアし、password_needs_reset を立てて再設定を要求する。あわせてログイン失敗の蓄積によるロックを解除する。ハッシュ済みのユーザは対象外のため複数回実行しても影響はない。',
        script: Now.include('../../server/fix-scripts/invalidate-plaintext-passwords.js'),
        // 一度だけ実行する想定だが、冪等なため再実行も可能
        unloadable: false,
        before: false,
    },
})
