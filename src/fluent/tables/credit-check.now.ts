/**
 * 信用調査（ITCOM-08）
 *
 * テーブル定義書に未定義の追加テーブル。
 * T03 申請には信用調査系の6ステータスがあるだけで、
 * 調査機関・依頼日・結果を保持する項目が無かったため追加する。
 *
 * ■ 1対多にしている理由
 * 1つの申請に対して再調査が発生しうる。T03 へ列を足す方式だと
 * 2回目の調査で1回目の記録が上書きされ履歴が残らない。
 *
 * ■ 外部機関との連携
 * 外部審査員には ServiceNow のロール・アカウントを付与しない方針（A17）のため、
 * 外部機関が直接このテーブルへ入力する経路は取れない。
 * 依頼書・結果ファイルの授受を前提とし、事務局が結果を登録する。
 * 依頼書・結果ファイルは本テーブルへ添付する（sys_attachment）。
 *
 * TODO(要レビュー): テーブル定義書への追加を提案する。
 * TODO(要確認): 調査機関・依頼様式・結果の受領形式が未確定。
 * TODO(要確認): 調査費用の負担と記録の要否が未確定。
 */
import '@servicenow/sdk/global'
import {
    Table,
    StringColumn,
    ChoiceColumn,
    DateColumn,
    DateTimeColumn,
    IntegerColumn,
    ReferenceColumn,
} from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_credit = Table({
    name: 'x_dent2_dentsusoke_credit',
    label: '信用調査',
    display: 'u_request',
    audit: true,
    schema: {
        u_request: ReferenceColumn({
            label: '申請',
            referenceTable: 'x_dent2_dentsusoke_request',
            mandatory: true,
        }),

        /** 何回目の調査か（再調査を区別する） */
        u_sequence: IntegerColumn({
            label: '回次',
            mandatory: true,
            default: 1,
        }),

        u_agency: StringColumn({
            label: '調査機関',
            maxLength: 100,
            // TODO(要確認): 調査機関が未確定。マスタ化の要否も含めて検討する。
        }),

        u_requested_on: DateColumn({
            label: '依頼日',
        }),

        u_due_on: DateColumn({
            label: '回答予定日',
        }),

        u_state: ChoiceColumn({
            label: '調査の状態',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            default: 'preparing',
            // T03 の申請ステータス（ext_preparing／ext_reviewing／result_waiting／result_checking）に対応
            choices: {
                preparing: '準備中',
                requested: '依頼済（調査中）',
                received: '結果受領',
                checked: '結果確認済',
                cancelled: '取消',
            },
        }),

        u_result: ChoiceColumn({
            label: '調査結果',
            dropdown: 'dropdown_with_none',
            // TODO(要確認): 結果の区分が未確定。暫定で3値。
            choices: {
                ok: '問題なし',
                conditional: '条件付き（要確認事項あり）',
                ng: '問題あり',
            },
        }),

        u_received_on: DateTimeColumn({
            label: '結果の取込日時',
        }),

        /**
         * 事務局メモ。
         * 調査結果に含まれる情報は機微情報であるため、記録範囲の方針が必要。
         * TODO(要確認): 記録範囲と保存期間の方針。
         */
        u_note: StringColumn({
            label: '事務局メモ',
            maxLength: 2000,
        }),

        u_updated_by_staff: ReferenceColumn({
            label: '登録した事務局ユーザ',
            referenceTable: 'sys_user',
        }),
    },
    index: [{ name: 'idx_credit_request', unique: false, element: ['u_request'] }],
})
