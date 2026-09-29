import '@servicenow/sdk/global'
import { ServicePortal } from '@servicenow/sdk/core'
import { topPage } from '../sp-page/top/top.now'
import { loginPage } from '../sp-page/login/login.now'
import { portalMenu } from '../sp-instance-menu/menu.now'
import { OOTB_PAGE_NOT_FOUND, OOTB_THEME_CORAL } from '../common/ootb-references'

/**
 * 成長加速支援補助金 申請ポータル
 *
 * homePage には SC-00 トップ（未ログイン）画面を割り当てる。
 * SC-00 はログイン済み事業者ユーザを SC-05 マイページへ自動遷移させるため（SC-00 ⑤表示条件）、
 * 「未ログイン → SC-00」「ログイン済み事業者 → SC-05」の振り分けがポータルのルートURLで成立する。
 *
 * loginPage には SC-01 ログイン画面を割り当てる。ロール必須ページ（SC-05 等）へ未認証で
 * アクセスした場合、Service Portal はこのページへ誘導する。
 *
 * テーマ・404画面は OOTB を利用する。SDK 公式ドキュメントが OOTB レコードは sys_id 参照必須と
 * 明記しているため（service-portal-advanced-guide.md L163）、値は src/fluent/common/ootb-references.ts
 * に集約している（トンマナ 3.4.1 の扱いは同ファイルのコメント参照）。
 */
export const sksPortal = ServicePortal({
    $id: Now.ID['x_dent2_dentsusoke_portal'],
    title: '成長加速支援補助金 申請ポータル',
    // urlSuffix はインスタンス全体で一意。スコープ接頭辞付きの値を使用する（sp_portal を照会し未使用を確認済み）
    urlSuffix: 'x_dent2_dentsusoke_sks',
    homePage: topPage,
    loginPage: loginPage,
    notFoundPage: OOTB_PAGE_NOT_FOUND,
    theme: OOTB_THEME_CORAL,
    mainMenu: portalMenu,
    defaultPortal: false,
    enableFavorites: false,
    inactive: false,
    hidePortalName: false,
})
