/**
 * T03 申請（テーブル定義書 成果物No.9）
 *
 * 設計書物理名 x_gap_application → 本スコープ x_dent2_dentsusoke_request
 * 申請ステータスは業務フロー「申請ステータス一覧」の事務局用ステータスに準拠する。
 * 事業者向け画面（SC-05／SC-07）では ApplicationStatusUtil で事業者用表記へ変換して表示する。
 */
import '@servicenow/sdk/global'
import {
    Table,
    StringColumn,
    ChoiceColumn,
    BooleanColumn,
    DateColumn,
    DateTimeColumn,
    DecimalColumn,
    IntegerColumn,
    ReferenceColumn,
} from '@servicenow/sdk/core'

export const x_dent2_dentsusoke_request = Table({
    name: 'x_dent2_dentsusoke_request',
    label: '申請',
    display: 'u_application_number',
    audit: true,
    schema: {
        u_application_number: StringColumn({
            label: '申請番号',
            maxLength: 20,
            mandatory: true,
            // TODO: 自動採番（APP-YYYY-NNNNN）は申請機能（ITCOM主担当・処理No.16）側で実装する。
            // 本スライス（マイページ）では表示のみを担当する。
        }),
        u_business_entity: ReferenceColumn({
            label: '事業者',
            referenceTable: 'x_dent2_dentsusoke_entity',
            mandatory: true,
        }),
        u_applicant_user: ReferenceColumn({
            label: '申請者ユーザ',
            referenceTable: 'x_dent2_dentsusoke_user',
            mandatory: true,
        }),
        u_organization_type: ChoiceColumn({
            label: '組織形態',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            // TODO: 設計書（T03）に選択肢の定義がないため暫定値。申請情報入力処理（処理No.16）の確定後に見直す。
            choices: {
                corporate: '法人',
                sole_proprietor: '個人事業主',
                other: 'その他',
            },
        }),
        u_employee_count_category: ChoiceColumn({
            label: '従業員数区分',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            // 公募要領「2.(1)基本概要」補助上限表の6区分
            choices: {
                sole_proprietor: '個人事業主',
                le5: '5人以下',
                le20: '6～20人',
                le50: '21～50人',
                le100: '51～100人',
                gt100: '101人以上',
            },
        }),
        u_sales_increase_target_month: DateColumn({
            label: '売上増加率対象月',
            // TODO(A07): 対象期間（2025年1月以降）の終期が未確定。暫定案は申請時点で確定済みの直近月まで。
        }),
        /**
         * 売上増加率。小数で保持する（0.15 ＝ 15%）。
         *
         * scale を明示しないとプラットフォームの既定（小数2桁）になり、
         * 0.153（15.3%）のような入力が 0.15 へ丸められて保存される。
         * 申請者が入力した増加率が審査で参照する値と食い違うため、
         * 0.01%（小数4桁）まで保持する。
         *
         * maxLength（全体の桁数）も明示する。未指定だと sys_dictionary の
         * max_length が空のまま作られ、列の桁数がプラットフォームの既定に依存する。
         *
         * TODO(A08): 端数処理・前年売上ゼロ／欠損値の扱いが未確定。
         */
        u_sales_increase_rate: DecimalColumn({
            label: '売上増加率',
            maxLength: 15,
            scale: 4,
        }),
        u_special_measure_flag: BooleanColumn({
            label: '特例措置対象フラグ',
            default: false,
        }),
        u_subsidy_cap_amount: IntegerColumn({
            label: '補助上限額（円）',
        }),
        u_subsidy_rate: DecimalColumn({
            label: '補助率',
            // 桁数と小数桁数を明示する（未指定だと列の桁数がプラットフォームの既定に依存する）
            maxLength: 15,
            scale: 2,
            /**
             * 補助率マスタ（x_dent2_dentsusoke_rate）から補助金額自動判定処理（処理No.17）が転記する。
             *
             * TODO(要レビュー): 本列の格納精度は小数2桁のため、マスタの 2/3 を転記すると 0.67 になる。
             *   対象経費 10,000,000円 の場合、2/3 との差は 33,300円 で補助金額として無視できない。
             *   DecimalColumn の scale 属性は表示桁数の指定であり、作成済みの列の格納精度は変わらない
             *   （scale=4 を設定して再デプロイしても 0.67 のままになることをインスタンスで確認済み）。
             *   申請ごとに厳密な補助率を残す必要がある場合は、補助率マスタと同様に
             *   分子・分母の整数で保持する構成へ変更する。
             *   本列は申請機能（ITCOM 主担当）の範囲のため本スライスでは変更しない。
             */
        }),
        u_total_expense_amount: IntegerColumn({
            label: '対象経費合計金額（円）',
            default: 0,
        }),
        u_application_status: ChoiceColumn({
            label: '申請ステータス',
            mandatory: true,
            dropdown: 'dropdown_without_none',
            default: 'input',
            // 業務フロー「申請ステータス一覧」事務局用ステータス
            choices: {
                input: '申請入力中',
                accepted: '受付済',
                first_review: '一次審査中',
                defect_request: '不備確認依頼',
                defect_fixing: '不備修正中',
                defect_answered: '不備修正回答あり',
                re_review: '再審査中',
                first_review_done: '一次審査完了',
                credit_judging: '信用調査要否判定中',
                credit_exempt: '信用調査免除',
                ext_preparing: '外部調査準備中',
                ext_reviewing: '外部信用調査中',
                result_waiting: '調査結果取込待ち',
                result_checking: '信用調査結果確認中',
                review_done: '申請審査完了',
                rejected: '不採択',
                withdrawn: '取下げ',
            },
        }),
        u_submitted_on: DateTimeColumn({
            label: '提出日時',
        }),
        u_withdrawal_flag: BooleanColumn({
            label: '取下げフラグ',
            default: false,
            // TODO(A02): 取下げの採用要否が未決。暫定でフィールドのみ保持し、ボタンは非表示とする。
        }),
        u_award_number_for_sync: StringColumn({
            label: '前年度実績連携用採択番号',
            maxLength: 50,
        }),

        /**
         * ===================================================================
         * 以下は申請機能・審査プロセス（ITCOM-01〜09）の実装に伴う追加項目。
         * テーブル定義書 T03 には未定義であり、画面イメージ ITCOM-01〜09 の
         * 注記で「保持する列が無い」と記載していたものを実装するために追加する。
         * TODO(要レビュー): テーブル定義書 T03 への項目追加を提案する。
         * ===================================================================
         */

        /** 公募回次。1事業者が複数回次へ申請する運用を表現できるようにする */
        u_application_round: StringColumn({
            label: '公募回次',
            maxLength: 20,
            // TODO(要確認): 回次の採番・表記（第1回／2026-1 等）が未確定。
        }),

        /**
         * 補助率（分子・分母）。
         *
         * 既存の u_subsidy_rate は DecimalColumn（格納精度2桁）であり 2/3 が 0.67 になる。
         * 対象経費1,000万円で33,300円ずれるため、補助金額の算出には使えない。
         * 補助率マスタと同じ分数で保持し、算出は必ずこの2列で行う。
         * u_subsidy_rate は既存の画面・帳票が参照しているため残し、参照用として引き続き転記する。
         */
        u_subsidy_rate_numerator: IntegerColumn({
            label: '補助率（分子）',
        }),
        u_subsidy_rate_denominator: IntegerColumn({
            label: '補助率（分母）',
            // 0 は設定しない（補助金額の算出でゼロ除算になる）
        }),

        /** 補助金額（申請時の試算＝min(対象経費×補助率, 補助上限額)）。端数は切り捨て */
        u_subsidy_amount: IntegerColumn({
            label: '補助金額（円）',
            default: 0,
            // TODO(A08): 端数処理の規則が未確定。暫定で切り捨て。
        }),

        // --- 一次審査 -------------------------------------------------------

        /** 審査担当者（問合せの u_assigned_staff と同じ役割） */
        u_review_assigned_to: ReferenceColumn({
            label: '審査担当者',
            referenceTable: 'sys_user',
        }),

        /**
         * 一次審査の期限。提出日 ＋ プロパティ
         * x_dent2_dentsusoke.review.sla_days の日数で算出する（提出時に確定）。
         *
         * 期限を列として持つのは、事務局ワークスペースの一覧で
         * 「期限超過」を絞り込めるようにするため。
         * 提出日からの経過日数を一覧で算出することはできない。
         *
         * TODO(要確認): 審査期限・SLA が未確定（暫定30日）。
         *   不備修正の再提出（defect_answered）で期限を延ばすかも未確定。
         *   現状は提出時に一度だけ設定し、再提出では変更しない。
         */
        u_review_due_on: DateColumn({
            label: '一次審査の期限',
        }),

        u_review_result: ChoiceColumn({
            label: '一次審査の判定',
            dropdown: 'dropdown_with_none',
            // TODO(要確認): 判定区分が未確定。暫定で3値とする。
            choices: {
                passed: '一次審査完了',
                defect: '不備確認依頼',
                rejected: '不採択',
            },
        }),

        u_review_note: StringColumn({
            label: '審査理由・特記事項',
            maxLength: 2000,
        }),

        u_reviewed_on: DateTimeColumn({
            label: '一次審査日時',
        }),

        u_reviewed_by: ReferenceColumn({
            label: '一次審査者',
            referenceTable: 'sys_user',
        }),

        // --- 申請の不備対応 -------------------------------------------------

        /**
         * 不備内容と回答。
         *
         * ユーザ登録の不備対応（T02 の u_registration_issue_note）と対象が異なるため
         * 別項目として持つ。
         *
         * ■ 修正用トークンは持たない
         * ユーザ登録の不備対応は、本登録が承認されるまで applicant ロールが付与されず
         * ポータルのページを開けないため、トークン付きリンクで未認証のまま処理している
         * （T02 の u_defect_fix_token）。
         * 申請の不備修正では事業者は既にログインできるため、通常のページとして実装し
         * （ITCOM-05）、範囲は ACL で担保する。
         * そのため当初用意していた u_defect_fix_token／u_defect_fix_expires_on は削除した。
         *
         * TODO(要確認): 指摘の単位が未確定。現状は申請全体への自由記述1件のみで、
         *   項目単位の指摘は保持できない（保持する場合は子テーブルが必要）。
         */
        u_defect_note: StringColumn({
            label: '不備内容',
            maxLength: 2000,
        }),
        u_defect_reply: StringColumn({
            label: '不備修正の回答',
            maxLength: 2000,
        }),
        u_defect_due_on: DateColumn({
            label: '不備修正の回答期限',
            // TODO(要確認): 期限超過時の扱いが未確定。現状は警告のみで再提出は受け付ける。
        }),

        // --- 信用調査 -------------------------------------------------------

        /** 信用調査の要否判定結果。免除の場合は調査を行わず採択判定へ進む */
        u_credit_required: ChoiceColumn({
            label: '信用調査の要否',
            dropdown: 'dropdown_with_none',
            choices: {
                required: '実施する',
                exempt: '免除する',
            },
        }),

        u_credit_judged_on: DateTimeColumn({
            label: '信用調査要否の判定日時',
        }),

        // --- 採択・不採択の確定 ---------------------------------------------

        /**
         * 採択番号。
         * 既存の u_award_number_for_sync は前年度実績を Salesforce へ連携するための項目であり
         * 用途が異なるため、今年度の採択番号は本列で保持する。
         */
        u_award_number: StringColumn({
            label: '採択番号',
            maxLength: 30,
            // TODO(要確認): 採番規則が未確定。暫定で AWD-<西暦>-<4桁連番>。
        }),

        /** 査定後の対象経費（対象外と判断した経費を除いた額） */
        u_approved_expense_amount: IntegerColumn({
            label: '査定後の対象経費（円）',
            // TODO(要確認): 査定による減額を認めるかが未確定。
        }),

        /** 交付決定額（査定後の対象経費 × 補助率、補助上限額で頭打ち） */
        u_award_amount: IntegerColumn({
            label: '交付決定額（円）',
        }),

        u_reject_reason_code: ChoiceColumn({
            label: '不採択理由区分',
            dropdown: 'dropdown_with_none',
            // TODO(要確認): 区分の一覧が未確定。暫定値。
            choices: {
                not_eligible: '補助対象事業に該当しない',
                expense_invalid: '対象経費が要件を満たさない',
                sales_invalid: '売上増加率の要件を満たさない',
                credit: '信用調査の結果による',
                defect_unresolved: '提出書類の不備が解消されない',
                other: 'その他',
            },
        }),

        u_reject_reason: StringColumn({
            label: '不採択理由・申請者への通知文',
            maxLength: 2000,
        }),

        /**
         * 採択判定の理由・特記事項（ITCOM-09）。
         *
         * 査定で対象外とした経費の内容など、交付決定額の根拠を残す。
         * 一次審査の u_review_note とは判定の段階が異なるため別項目として持つ
         * （どちらの段階の判断かが混ざると、後から根拠を追えない）。
         */
        u_decision_note: StringColumn({
            label: '採択判定の理由・特記事項',
            maxLength: 2000,
        }),

        u_decided_on: DateTimeColumn({
            label: '採択判定の確定日時',
        }),

        u_decided_by: ReferenceColumn({
            label: '採択判定の確定者',
            referenceTable: 'sys_user',
        }),
    },
})
