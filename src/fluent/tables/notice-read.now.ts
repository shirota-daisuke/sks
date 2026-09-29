/**
 * T11 お知らせ既読状況（テーブル定義書 成果物No.9）
 *
 * 設計書物理名 x_gap_notice_read → 本スコープ x_dent2_dentsusoke_read
 * お知らせと事業者ユーザの既読／未読を管理する中間テーブル（既読／未読情報取得処理：処理No.43）。
 */
import '@servicenow/sdk/global'
import { Table, BooleanColumn, DateTimeColumn, ReferenceColumn } from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_read = Table({
    name: 'x_dent2_dentsusoke_read',
    label: 'お知らせ既読状況',
    schema: {
        u_notice: ReferenceColumn({
            label: 'お知らせ',
            referenceTable: 'x_dent2_dentsusoke_notice',
            mandatory: true,
        }),
        u_applicant_user: ReferenceColumn({
            label: '事業者ユーザ',
            referenceTable: 'x_dent2_dentsusoke_user',
            mandatory: true,
        }),
        u_read_flag: BooleanColumn({
            label: '既読フラグ',
            mandatory: true,
            default: false,
        }),
        u_read_on: DateTimeColumn({
            label: '既読日時',
        }),
    },
    // 同一ユーザ×同一お知らせの重複行を防ぐ
    index: [{ name: 'idx_notice_user', unique: true, element: ['u_notice', 'u_applicant_user'] }],
})
