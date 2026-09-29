/**
 * 申請の処理履歴（ITCOM-05／07／08／09 のタイムライン）
 *
 * テーブル定義書に未定義の追加テーブル。
 * 画面イメージの各所に処理履歴のタイムラインを置いているが、
 * それを保持するテーブルが存在しなかったため追加する。
 *
 * ■ sys_audit で代替しない理由
 * T03 は audit: true のため列単位の変更履歴は sys_audit に残る。
 * ただし sys_audit は「どの列がどう変わったか」の記録であり、
 *   ・業務上の出来事（申請を提出した／一次審査を完了した）としての単位で並べられない
 *   ・1つの操作で複数列が変わると複数行になる
 *   ・事業者向け画面へ見せる粒度に整えるのが難しい
 * ため、業務イベントとして明示的に記録する。
 *
 * ■ 事業者へ見せる範囲
 * 事務局の内部メモを含みうるため、事業者向け画面へ出す行は
 * u_visible_to_applicant = true のものに限る。
 *
 * TODO(要レビュー): テーブル定義書への追加を提案する。
 */
import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, BooleanColumn, DateTimeColumn, ReferenceColumn } from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_req_log = Table({
    name: 'x_dent2_dentsusoke_req_log',
    label: '申請の処理履歴',
    display: 'u_action',
    audit: false,
    schema: {
        u_request: ReferenceColumn({
            label: '申請',
            referenceTable: 'x_dent2_dentsusoke_request',
            mandatory: true,
        }),

        u_action: ChoiceColumn({
            label: '出来事',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            choices: {
                submitted: '申請を提出',
                /**
                 * 内容確認・提出（ITCOM-04）の同意事項への同意。
                 * 同意を保持する列が T03 に無く文面も未確定のため、
                 * 同意した事実と日時は本履歴で担保する。
                 * TODO(要レビュー): 同意の取得日時を T03 の列として持つかは未確定。
                 */
                consented: '確認事項に同意',
                review_assigned: '審査担当を割当',
                review_started: '一次審査を開始',
                review_passed: '一次審査を完了',
                defect_requested: '不備修正を依頼',
                defect_fixing: '不備修正を開始',
                defect_answered: '不備修正を再提出',
                credit_judged: '信用調査の要否を判定',
                credit_requested: '信用調査を依頼',
                credit_received: '信用調査の結果を取込',
                /**
                 * 信用調査の督促・取消（ITCOM-08）。
                 * 依頼から結果取込までの間に発生する事務局の操作を追えるようにする。
                 */
                credit_reminded: '信用調査を督促',
                credit_cancelled: '信用調査を取消',
                awarded: '採択として確定',
                rejected: '不採択として確定',
                returned: '一次審査へ差し戻し',
                withdrawn: '取下げ',
            },
        }),

        /** 遷移前後の申請ステータス（追跡のため文字列で残す） */
        u_from_status: StringColumn({
            label: '遷移前ステータス',
            maxLength: 40,
        }),
        u_to_status: StringColumn({
            label: '遷移後ステータス',
            maxLength: 40,
        }),

        u_detail: StringColumn({
            label: '内容',
            maxLength: 1000,
        }),

        u_occurred_on: DateTimeColumn({
            label: '発生日時',
            mandatory: true,
        }),

        u_actor: ReferenceColumn({
            label: '実行者',
            referenceTable: 'sys_user',
        }),

        /** 事業者向け画面へ表示してよい行か（事務局の内部メモは非表示にする） */
        u_visible_to_applicant: BooleanColumn({
            label: '事業者へ表示',
            default: true,
        }),
    },
    index: [{ name: 'idx_req_log_request', unique: false, element: ['u_request'] }],
})
