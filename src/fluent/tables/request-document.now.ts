/**
 * 申請の提出書類（ITCOM-03）
 *
 * テーブル定義書に未定義の追加テーブル。
 *
 * ■ なぜ必要か
 * 添付ファイル自体は sys_attachment に保存されるが、sys_attachment には
 * 「どの提出書類としてアップロードされたか」を表す書類種別の項目が無い。
 * そのため必須書類の充足チェック（ITCOM-03 の「必須書類のうち1件が未提出」）や
 * 書類種別ごとの差し替え管理ができない。
 * 本テーブルが「申請 × 書類種別」の1行を持ち、実ファイルは自身へ添付する
 * （sys_attachment.table_name = 本テーブル）。
 *
 * ■ この構成にした理由
 * 申請レコードへ直接添付すると、1つの申請に紐づく添付が種別なしで並ぶため
 * どの書類か判別できない。書類種別ごとに行を持てば、
 *   ・必須／任意の区別と充足チェックができる
 *   ・差し替えの履歴を行単位で追える
 *   ・RPA の共有フォルダ転送（rpa/Export-SksAttachments.ps1）で種別ごとの
 *     フォルダ分けができる（現状は申請番号の直下に平置き）
 * という利点がある。
 *
 * TODO(要レビュー): テーブル定義書への追加を提案する。
 * TODO(要確認): 提出書類の種類と必須区分が未確定。本テーブルの u_document_type の
 *   選択肢は暫定値であり、公募要領の提出書類一覧との突合が必要。
 */
import '@servicenow/sdk/global'
import {
    Table,
    StringColumn,
    ChoiceColumn,
    BooleanColumn,
    DateTimeColumn,
    IntegerColumn,
    ReferenceColumn,
} from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_req_doc = Table({
    name: 'x_dent2_dentsusoke_req_doc',
    label: '申請の提出書類',
    display: 'u_document_type',
    audit: true,
    schema: {
        u_request: ReferenceColumn({
            label: '申請',
            referenceTable: 'x_dent2_dentsusoke_request',
            mandatory: true,
        }),

        u_document_type: ChoiceColumn({
            label: '書類種別',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            // TODO(要確認): 公募要領の提出書類一覧と突合する（現状は暫定値）。
            choices: {
                financial: '決算書（直近1期分）',
                registry: '履歴事項全部証明書',
                quotation: '見積書（対象経費の根拠）',
                sales: '売上を証する書類',
                special: '特例措置の根拠書類',
                other: 'その他',
            },
        }),

        u_required: BooleanColumn({
            label: '必須',
            default: true,
            // 申請の作成時に書類種別ごとの必須区分を転記する。
            // 後から要件が変わっても過去の申請の判定が変わらないようにするため、
            // マスタ参照ではなく申請側に持たせている。
        }),

        /**
         * 提出済みか。実ファイルの有無（sys_attachment）と一致させる。
         * 添付の削除・差し替えを画面以外の経路で行われた場合に食い違うため、
         * 充足チェックは本フラグではなく sys_attachment の実在で判定する
         * （ApplicationDocumentUtil.hasFile）。本フラグは一覧表示用。
         */
        u_submitted: BooleanColumn({
            label: '提出済',
            default: false,
        }),

        u_submitted_on: DateTimeColumn({
            label: '提出日時',
        }),

        u_file_name: StringColumn({
            label: 'ファイル名',
            maxLength: 255,
            // sys_attachment.file_name の写し（一覧で1クエリで出せるようにするため）
        }),

        u_order: IntegerColumn({
            label: '表示順',
            mandatory: true,
            default: 100,
        }),
    },
    index: [{ name: 'idx_req_doc_request', unique: false, element: ['u_request'] }],
})
