/**
 * T10 お知らせ（テーブル定義書 成果物No.9）
 *
 * 設計書物理名 x_gap_notice → 本スコープ x_dent2_dentsusoke_notice
 */
import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, BooleanColumn, DateColumn, HtmlColumn, ReferenceColumn } from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_notice = Table({
    name: 'x_dent2_dentsusoke_notice',
    label: 'お知らせ',
    display: 'u_title',
    audit: true,
    schema: {
        u_title: StringColumn({
            label: 'タイトル',
            maxLength: 100,
            mandatory: true,
        }),
        u_body: HtmlColumn({
            label: '本文',
            maxLength: 4000,
            mandatory: true,
        }),
        u_visibility_scope: ChoiceColumn({
            label: '公開範囲',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            default: 'all',
            // 公開範囲設定処理（処理No.40）。事業者区分（法人／個人）と突き合わせる。
            choices: {
                corporate: '法人',
                sole_proprietor: '個人',
                all: '全体',
            },
        }),
        u_publish_start_date: DateColumn({
            label: '公開開始日',
            mandatory: true,
        }),
        u_publish_end_date: DateColumn({
            label: '公開終了日',
            mandatory: true,
        }),
        u_priority: ChoiceColumn({
            label: '重要度',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            default: 'middle',
            choices: {
                high: '高',
                middle: '中',
                low: '低',
            },
        }),
        u_email_notify_flag: BooleanColumn({
            label: 'メール通知有無',
            default: true,
            // TODO(Q13/A21/IF-07): 通知対象イベント・テンプレート・送信元アドレスが未確定。
        }),
        u_publish_status: ChoiceColumn({
            label: '公開状態',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            default: 'private',
            choices: {
                published: '公開',
                private: '非公開',
            },
        }),
        u_created_by_staff: ReferenceColumn({
            label: '作成者',
            referenceTable: 'sys_user',
            mandatory: true,
            /**
             * SC-13 お知らせ作成・編集では作成者を事務局ユーザ自身が入力する項目ではないため、
             * 操作中のユーザを既定値とする（フォームを開いた時点で埋まる）。
             * 必須項目のため既定値なしではフォームから保存できない。
             * フォーム以外の経路（REST 等）で未設定のまま登録された場合の補完は
             * ビジネスルール（src/fluent/business-rules/notice-rules.now.ts）でも行う。
             */
            default: 'javascript:gs.getUserID()',
        }),
    },
})
