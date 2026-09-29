import '@servicenow/sdk/global'
import { Property } from '@servicenow/sdk/core'

/**
 * システムプロパティ定義（トンマナ 3.4.4「設定値の外部化」）
 *
 * 運用時に変更される可能性がある値をソースコードから外部化する。
 * これまでコード側の gs.getProperty(name, 既定値) の第2引数のみで動作しており、
 * プロパティレコード自体が未作成だったため、運用担当者が画面から値を変更できない状態だった
 * （命名規則一覧 根拠ID I-10）。本ファイルで sys_properties を作成し、
 * 「コードを修正せずに値を変更できる」状態にする。
 *
 * 値はいずれも現行のコード側既定値と同一にしているため、投入による挙動の変化はない。
 *
 * 命名規則：<スコープ名>.<領域>.<キー>（命名規則一覧 No.16／SDK propertyguide.md L17）
 */

/**
 * ポータルの URL サフィックス。
 * 本登録案内メール・パスワード再設定メールのリンク生成に使用する（src/server/mail-scripts/*.js）。
 * sp_portal.url_suffix を変更した場合は本プロパティも合わせて変更する。
 */
Property({
    $id: Now.ID['prop_portal_url_suffix'],
    name: 'x_dent2_dentsusoke.portal.url_suffix',
    type: 'string',
    value: 'x_dent2_dentsusoke_sks',
    description: '申請ポータルの URL サフィックス（sp_portal.url_suffix と一致させる）。メール本文のリンク生成に使用する。',
})

/**
 * 本登録画面（SC-03）のページID。本登録案内メールのリンク先。
 */
Property({
    $id: Now.ID['prop_page_signup'],
    name: 'x_dent2_dentsusoke.page.signup',
    type: 'string',
    value: 'x_dent2_dentsusoke_signup',
    description: '本登録画面（SC-03）の sp_page.id。本登録案内メールのリンク生成に使用する。',
})

/**
 * パスワードリセット画面（SC-04）のページID。パスワード再設定メールのリンク先。
 */
Property({
    $id: Now.ID['prop_page_reset'],
    name: 'x_dent2_dentsusoke.page.reset',
    type: 'string',
    value: 'x_dent2_dentsusoke_reset',
    description: 'パスワードリセット画面（SC-04）の sp_page.id。パスワード再設定メールのリンク生成に使用する。',
})

/**
 * 登録不備修正画面のページID。不備確認依頼メール（処理No.45）のリンク先。
 */
Property({
    $id: Now.ID['prop_page_defect_fix'],
    name: 'x_dent2_dentsusoke.page.defect_fix',
    type: 'string',
    value: 'x_dent2_dentsusoke_defect_fix',
    description:
        '登録不備修正画面（処理No.7 の事業者側）の sp_page.id。不備確認依頼メールのリンク生成に使用する。',
})

/**
 * 不備修正トークンの有効日数（RegistrationDefectUtil）。
 * TODO(Q12): 不備確認依頼の回答期限が未確定。暫定で14日としている。
 * 変更した場合は不備確認依頼メールの本文（notifications/registration-defect.now.ts）の
 * 「有効期限は発行から14日間」の記載も合わせて修正する。
 */
Property({
    $id: Now.ID['prop_defect_token_valid_days'],
    name: 'x_dent2_dentsusoke.defect.token_valid_days',
    type: 'integer',
    value: 14,
    description:
        '登録不備修正用リンク（一時トークン）の有効日数。不備確認依頼メールの案内文と一致させる。',
})

/**
 * 未読お知らせ件数の集計対象上限（NoticeUtil.countUnread）。
 * 公開中のお知らせがこの件数を超える運用になった場合に調整する。
 * トンマナ 3.3.2「大量レコードの取得及び更新禁止」に基づく上限値であり、無制限には設定しない。
 */
Property({
    $id: Now.ID['prop_notice_max_visible_for_count'],
    name: 'x_dent2_dentsusoke.notice.max_visible_for_count',
    type: 'integer',
    value: 500,
    description:
        '未読お知らせ件数の集計対象とする公開中お知らせの上限件数（NoticeUtil）。処理時間・DB負荷の上限を規定するため、無制限には設定しない。',
})

/**
 * 一次審査の期限（提出日からの日数）。
 * 提出時に u_review_due_on を算出するのに使用する（ApplicationReviewUtil）。
 * TODO(要確認): 審査期限・SLA が未確定。画面イメージ ITCOM-06 の仮置きに合わせて30日としている。
 */
Property({
    $id: Now.ID['prop_review_sla_days'],
    name: 'x_dent2_dentsusoke.review.sla_days',
    type: 'integer',
    value: 30,
    description:
        '一次審査の期限を提出日から何日後とするか。事務局ワークスペースの「一次審査：期限超過」の絞り込みに使われる。',
})

/**
 * 信用調査（ITCOM-08）の要否判定のしきい値（補助金額・円）。
 * 補助金額がこの額以上の申請を調査対象の候補として提示する
 * （ApplicationCreditUtil.suggest）。判定そのものは事務局が行う。
 * TODO(要確認): 要否判定基準が未確定。画面イメージ ITCOM-08 の仮置きに合わせて500万円としている。
 */
Property({
    $id: Now.ID['prop_credit_threshold_amount'],
    name: 'x_dent2_dentsusoke.credit.threshold_amount',
    type: 'integer',
    value: 5000000,
    description:
        '信用調査の実施を推奨する補助金額のしきい値（円）。この額以上の申請を調査対象の候補として提示する（判定は事務局が行う）。',
})

/**
 * 信用調査（ITCOM-08）の回答予定日の既定日数（依頼日からの日数）。
 * TODO(要確認): 調査機関の標準回答期間が未確定。暫定で14日としている。
 */
Property({
    $id: Now.ID['prop_credit_due_days'],
    name: 'x_dent2_dentsusoke.credit.due_days',
    type: 'integer',
    value: 14,
    description:
        '信用調査の回答予定日を依頼日から何日後とするか。事務局が回答予定日を明示的に入力した場合はその値が優先される。',
})

/**
 * 申請の不備確認依頼（ITCOM-07）の回答期限（依頼日からの日数）。
 * 不備確認依頼メールの案内文と一致させる。
 * TODO(要確認): 回答期限と期限超過時の扱いが未確定。暫定で14日としている。
 */
Property({
    $id: Now.ID['prop_review_defect_due_days'],
    name: 'x_dent2_dentsusoke.review.defect_due_days',
    type: 'integer',
    value: 14,
    description:
        '申請の不備確認依頼で回答期限を依頼日から何日後とするか（ApplicationReviewUtil）。事務局が期限を明示的に入力した場合はその値が優先される。',
})

/**
 * 申請の不備修正画面（ITCOM-05）のページID。不備確認依頼メールのリンク先。
 */
Property({
    $id: Now.ID['prop_page_app_defect_fix'],
    name: 'x_dent2_dentsusoke.page.app_defect_fix',
    type: 'string',
    value: 'x_dent2_dentsusoke_app_fix',
    description:
        '申請の不備修正画面（ITCOM-05）の sp_page.id。不備確認依頼メールのリンク生成に使用する。ユーザ登録の不備修正画面（x_dent2_dentsusoke.page.defect_fix）とは別の画面。',
})

/**
 * 申請の添付書類（ITCOM-03）のファイルサイズ上限（MB）。
 * ApplicationDocumentUtil がアップロード後の検証に使用する。
 * TODO(要確認): 提出書類のファイルサイズ上限が未確定。暫定で10MBとしている。
 */
Property({
    $id: Now.ID['prop_document_max_file_size_mb'],
    name: 'x_dent2_dentsusoke.document.max_file_size_mb',
    type: 'integer',
    value: 10,
    description:
        '申請の添付書類1ファイルあたりのサイズ上限（MB）。超過したファイルはアップロード後に削除し、未提出へ戻す。',
})

/**
 * 申請の添付書類（ITCOM-03）で許可する拡張子。
 * カンマ区切り・小文字で指定する。
 * TODO(要確認): 提出書類のファイル形式が未確定。暫定値であり公募要領との突合が必要。
 */
Property({
    $id: Now.ID['prop_document_allowed_extensions'],
    name: 'x_dent2_dentsusoke.document.allowed_extensions',
    type: 'string',
    value: 'pdf,jpg,jpeg,png,xls,xlsx,doc,docx,zip',
    description:
        '申請の添付書類で許可する拡張子（カンマ区切り・小文字）。ここに無い形式はアップロード後に削除し、未提出へ戻す。',
})

/**
 * 重複チェック（処理No.5）の事業者名スキャン上限（SC-03 本登録）。
 * 正規化後の事業者名比較はスクリプト側で行うため、取得件数の上限をここで規定する。
 */
Property({
    $id: Now.ID['prop_signup_duplicate_scan_limit'],
    name: 'x_dent2_dentsusoke.signup.duplicate_scan_limit',
    type: 'integer',
    value: 500,
    description:
        '本登録の重複チェック（処理No.5）で事業者名の正規化比較を行う際の取得件数上限。処理時間・DB負荷の上限を規定するため、無制限には設定しない。',
})
