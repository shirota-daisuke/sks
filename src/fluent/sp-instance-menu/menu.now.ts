import '@servicenow/sdk/global'
import { SPMenu } from '@servicenow/sdk/core'
import { mypage } from '../sp-page/mypage/mypage.now'
import { profilePage } from '../sp-page/profile/profile.now'
import { applicationsPage } from '../sp-page/applications/applications.now'
import { applyPage } from '../sp-page/apply/apply.now'
import { noticesPage } from '../sp-page/notices/notices.now'
import { inquiriesPage } from '../sp-page/inquiries/inquiries.now'
import { OOTB_WIDGET_HEADER_MENU } from '../common/ootb-references'

/**
 * ポータル共通メニュー（SC-05 のトップタブ）
 * マイページ／申請／お知らせ／問合せ／自分の情報 の5タブ（画面設計書 SC-05 ①レイアウト構成）。
 *
 * これに加えて「申請の入力」を配置している。画面設計書には無いタブだが、
 * 申請を提出する画面への導線が他に無いため追加した（申請機能は ITCOM 主担当の範囲）。
 * 「申請」（SC-07）が状況の参照、「申請の入力」が入力・提出という切り分けである。
 *
 * widget には OOTB「Header Menu」ウィジェットを指定する。OOTB レコードは sys_id 参照が必須のため、
 * 値は src/fluent/common/ootb-references.ts に集約している（トンマナ 3.4.1）。
 * メニューはテーマの header が設定されている場合のみ描画されるため、
 * ポータルの theme には header 付きの OOTB Coral テーマを割り当てている。
 */
export const portalMenu = SPMenu({
    $id: Now.ID['x_dent2_dentsusoke_main_menu'],
    title: 'SKS 申請ポータル メニュー',
    widget: OOTB_WIDGET_HEADER_MENU,
    items: [
        {
            $id: Now.ID['menu_item_mypage'],
            type: 'page',
            label: 'マイページ',
            page: mypage,
            order: 100,
            active: true,
        },
        {
            $id: Now.ID['menu_item_apps'],
            type: 'page',
            label: '申請',
            page: applicationsPage,
            order: 200,
            active: true,
        },
        {
            $id: Now.ID['menu_item_apply'],
            type: 'page',
            label: '申請の入力',
            page: applyPage,
            order: 250,
            active: true,
        },
        {
            $id: Now.ID['menu_item_notices'],
            type: 'page',
            label: 'お知らせ',
            page: noticesPage,
            order: 300,
            active: true,
        },
        {
            $id: Now.ID['menu_item_inquiries'],
            type: 'page',
            label: '問合せ',
            page: inquiriesPage,
            order: 400,
            active: true,
        },
        {
            $id: Now.ID['menu_item_profile'],
            type: 'page',
            label: '自分の情報',
            page: profilePage,
            order: 500,
            active: true,
        },
    ],
})
