/**
 * OOTB（ServiceNow 標準）レコードの参照定義
 *
 * ■ トンマナ 3.4.1「sys_id のハードコード禁止」に対する扱い
 * Service Portal のテーマ・404画面・メニュー描画ウィジェットは OOTB レコードであり、
 * Fluent には名前で解決する手段がないため sys_id での指定が SDK 公式ドキュメントで必須とされている。
 *   node_modules/@servicenow/sdk/docs/guides/service-portal-advanced-guide.md L163
 *     "You MUST reference OOTB pages by sys_id (e.g. `loginPage`, `notFoundPage` on `ServicePortal`).
 *      MUST NOT create SPPage wrappers for OOTB pages."
 *   同 L269 "OOTB components referenced by sys_id (e.g., `theme: '281507c44317d210ca4c1f425db8f2fd'`)"
 *
 * したがって sys_id の使用自体は回避できないため、3.4.1 の理由（環境ごとに異なる可能性がある）に対しては
 * 「値を本ファイル1か所へ集約し、環境差異が生じた場合の改修範囲を1ファイルに限定する」ことで対応する。
 * 各値は SDK 公式ドキュメントに記載されている OOTB レコードの sys_id で、対象インスタンスでも照会済み。
 *
 * ■ 値の確認方法（環境追加時はこのコマンドで一致を確認する）
 *   now-sdk query sp_theme  -q 'sys_id=281507c44317d210ca4c1f425db8f2fd' -f 'sys_id,name' --limit 1 -o json
 *   now-sdk query sp_page   -q 'sys_id=3c2c9063cb11020000f8d856634c9c1f' -f 'sys_id,id'   --limit 1 -o json
 *   now-sdk query sp_widget -q 'name=Header Menu'                        -f 'sys_id,name,id' -o json
 */

/** OOTB テーマ「Coral」（header に Stock Header を持つため、ポータル共通メニューが描画される） */
export const OOTB_THEME_CORAL = '281507c44317d210ca4c1f425db8f2fd'

/** OOTB 404画面（ロール不足・存在しないページIDへのアクセス時の遷移先） */
export const OOTB_PAGE_NOT_FOUND = '3c2c9063cb11020000f8d856634c9c1f'

/** OOTB ウィジェット「Header Menu」（sp_instance_menu の描画に使用する） */
export const OOTB_WIDGET_HEADER_MENU = '5ef595c1cb12020000f8d856634c9c6e'

/**
 * OOTB ウィジェット「Login」（widget-login）。
 * 認証は自前実装せずプラットフォーム標準認証へ委譲するため、SC-01 ログイン画面で使用する。
 *   now-sdk query sp_widget -q 'id=widget-login' -f 'sys_id,name,id' -o json
 */
export const OOTB_WIDGET_LOGIN = '6506d341cb33020000f8d856634c9cdc'
