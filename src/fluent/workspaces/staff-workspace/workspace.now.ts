import '@servicenow/sdk/global'
import { Acl, Workspace } from '@servicenow/sdk/core'
import { staffListConfig } from './list-menu.now'
import { staffRole, staffAdminRole, systemAdminRole } from '../../roles/roles.now'

/**
 * SKS 事務局ワークスペース
 *
 * SC-11 ユーザ登録審査画面（プロビジョニング）をワークスペース（Next Experience）で提供する。
 * 題材システム構成図（研究開発計画書 p2／p4）で事務局ユーザの入口が
 * 「ワークスペース（ダッシュボード・ユーザ管理・マスタメンテナンス・問合せ管理・帳票／レポート）」
 * とされていることに合わせた構成であり、SC-12〜SC-17 も同じワークスペースへ追加していく想定。
 *
 * 画面一覧（成果物No.5）では SC-11 の画面分類（大）が「ポータル」となっているが、
 * 事務局向け画面であり構成図はワークスペース配下に置いているため、本実装はワークスペースを採用する。
 * TODO(要レビュー): 画面一覧 SC-11 の画面分類を「ワークスペース」へ修正することを提案する。
 *
 * URL: /x/dent2/sks-staff/home
 *   SDK ガイド（creating-workspaces-guide.md Step 6）の /now/{path}/{landingPath} は Global スコープの形式。
 *   名前付きスコープのアプリではベンダー接頭辞が付き /x/{ベンダー識別子}/{path}/{landingPath} となる
 *   （本アプリはスコープ x_dent2_dentsusoke ＝ ベンダー識別子 dent2）。
 *   UI Builder での編集: /now/builder/ui/experience/9bb6e0517b5842ab9591753b7a87b810
 *
 * 権限（権限設計書 5. 画面アクセス制御）
 *   アノニマス × ／ applicant × ／ applicant_admin × ／ staff ○ ／ staff_admin ○ ／ system_admin ×
 *
 * 収容している画面
 *   SC-11 ユーザ登録審査（プロビジョニング） … カテゴリ「ユーザ管理」
 *   SC-12 事務局ユーザ管理                   … カテゴリ「事務局ユーザ管理」
 *   SC-13 お知らせ作成・編集                 … カテゴリ「お知らせ管理」
 *   SC-14 問合せ管理・返信                   … カテゴリ「問合せ管理」
 *   SC-15 ダッシュボード                     … ランディングページ（dashboard.now.ts）
 *   SC-16 マスタメンテナンス                 … カテゴリ「マスタメンテナンス」
 *   SC-17 帳票／レポート出力                 … カテゴリ「帳票／レポート」＋
 *                                              レポート定義（src/fluent/reports/staff-reports.now.ts）
 */
export const staffWorkspace = Workspace({
    $id: Now.ID['sks_staff_workspace'],
    title: 'SKS 事務局ワークスペース',
    path: 'sks-staff',
    landingPath: 'home',
    active: true,
    order: 100,
    // SC-11 の対象（事業者ユーザ・事業者）／ SC-12 の対象（標準の sys_user・ロール割当・ロール定義）
    // ／ SC-13 の対象（お知らせ）／ SC-14 の対象（問合せ）
    // ／ SC-16 の対象（業種別基準・補助上限額・補助率・対象経費区分・専門家経費日額上限の5マスタ）
    // ／ SC-17 の対象（申請。帳票としての参照のみで、ACL に write を付与していない）
    tables: [
        'x_dent2_dentsusoke_user',
        'x_dent2_dentsusoke_entity',
        'sys_user',
        'sys_user_has_role',
        'sys_user_role',
        'x_dent2_dentsusoke_notice',
        'x_dent2_dentsusoke_inquiry',
        'x_dent2_dentsusoke_industry',
        'x_dent2_dentsusoke_cap',
        'x_dent2_dentsusoke_rate',
        'x_dent2_dentsusoke_expense',
        'x_dent2_dentsusoke_expert_fee',
        'x_dent2_dentsusoke_request',
        /**
         * ITCOM-07 一次審査の申請詳細で参照する子テーブル。
         * いずれも T03 への参照（u_request）を持ち、関連リストとして参照する。
         *   対象経費明細   審査で見積書と突合する対象（ITCOM-02 で事業者が登録）
         *   提出書類       添付ファイルの確認（ITCOM-03 で事業者が提出）
         *   処理履歴       画面イメージ ITCOM-07 右カラムの処理履歴
         *   信用調査       調査の依頼・結果（ITCOM-08。依頼・結果取込の操作対象）
         */
        'x_dent2_dentsusoke_exp_item',
        'x_dent2_dentsusoke_req_doc',
        'x_dent2_dentsusoke_req_log',
        'x_dent2_dentsusoke_credit',
    ],
    listConfig: staffListConfig,
})

/**
 * ワークスペースのルート（画面）に対するアクセス制御。
 *
 * 名前は「now.<ワークスペースの path>.*」と完全に一致させる必要がある
 * （creating-workspaces-guide.md Step 5「Confirm ACL field matches workspace path pattern: {path}.*」）。
 * ux_route 型では table／field プロパティは非推奨（SDK 4.10.1 のビルド警告 TS11）のため
 * name で直接指定する。
 */
Acl({
    $id: Now.ID['sks_staff_workspace_acl'],
    localOrExisting: 'Existing',
    type: 'ux_route',
    operation: 'read',
    name: 'now.sks-staff.*',
    roles: [staffRole, staffAdminRole, systemAdminRole],
    description:
        'SKS 事務局ワークスペースは事務局ユーザ・システム管理者のみアクセス可（権限設計書 5章 SC-11／SC-12）',
})
