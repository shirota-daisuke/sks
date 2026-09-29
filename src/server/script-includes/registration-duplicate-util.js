/**
 * RegistrationDuplicateUtil
 *
 * 重複チェック処理（処理No.5）と前年登録判定処理（処理No.4）。
 *
 * もともと SC-03 本登録のウィジェット（signup-form/server_script.js）内の関数として実装していたが、
 * 登録不備対応（処理No.7）で申請者が法人番号・事業者区分を修正した場合にも再判定が必要になったため
 * Script Include へ切り出した。
 *
 * 再判定が必須である理由：重複チェック結果が「重複あり（確定）」のままだと
 * RegistrationReviewUtil.canApprove() が false を返し続け、申請者が法人番号を正しく直しても
 * 事務局が承認できない状態（承認ボタンが表示されない）で固まる。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない。
 */
var RegistrationDuplicateUtil = Class.create()

/** 事業者名の正規化比較で取得する件数の上限の既定値（プロパティ未設定時） */
RegistrationDuplicateUtil.DEFAULT_SCAN_LIMIT = 500

/** スキャン上限のシステムプロパティ名（トンマナ 3.4.4／定義は common/portal-properties.now.ts） */
RegistrationDuplicateUtil.SCAN_LIMIT_PROPERTY = 'x_dent2_dentsusoke.signup.duplicate_scan_limit'

RegistrationDuplicateUtil.prototype = {
    initialize: function () {},

    /**
     * 重複チェック処理（処理No.5）
     *
     * Q04（決定済）「確定一致は登録不可、曖昧一致のみ事務局確認」に対応し、
     *   法人番号／本人識別情報の完全一致 → 重複あり（確定）
     *   事業者名の正規化一致           → 重複あり（要確認）
     *   いずれも該当なし               → 重複なし
     * を返す。登録可否の確定は事務局の承認・却下（処理No.6／SC-11）で行うため、
     * ここでは判定結果のみを返す。
     *
     * @param entityType        事業者区分（corporate／sole_proprietor）
     * @param corporateNumber   法人番号／本人識別情報
     * @param businessName      事業者名
     * @param excludeEntityId   判定対象から除外する事業者（自分自身の事業者レコード）。
     *                          登録不備の再判定では自社レコードが既に存在するため、
     *                          これを除外しないと必ず「重複あり（確定）」になる。
     *
     * TODO(Q02): 照合対象データソースが未確定。Salesforce 横断照合（IF-02）は未実装のため、
     *            現時点では本システム内の事業者データのみを照合している。
     * TODO(Q03): 表記揺れの正規化範囲が未確定。暫定で空白除去・英数の小文字化・法人格表記の除去のみ行う。
     */
    checkDuplicate: function (entityType, corporateNumber, businessName, excludeEntityId) {
        var exclude = excludeEntityId ? excludeEntityId + '' : ''

        var exact = new GlideRecord('x_dent2_dentsusoke_entity')
        exact.addQuery('u_entity_type', entityType)
        exact.addQuery('u_corporate_number', corporateNumber)
        if (exclude) {
            exact.addQuery('sys_id', '!=', exclude)
        }
        exact.setLimit(1)
        exact.query()
        if (exact.hasNext()) {
            return { result: 'duplicate_confirmed' }
        }

        var normalized = this.normalizeName(businessName)
        if (normalized) {
            var candidates = new GlideRecord('x_dent2_dentsusoke_entity')
            candidates.addQuery('u_entity_type', entityType)
            if (exclude) {
                candidates.addQuery('sys_id', '!=', exclude)
            }
            // 正規化後の比較はスクリプト側で行うため、件数上限を設けて取得する（トンマナ 3.3.2）
            candidates.setLimit(this.getScanLimit())
            candidates.query()
            while (candidates.next()) {
                if (this.normalizeName(candidates.getValue('u_business_name')) === normalized) {
                    return { result: 'duplicate_review' }
                }
            }
        }

        return { result: 'no_duplicate' }
    },

    /**
     * 前年登録判定処理（処理No.4）
     *
     * TODO(IF-02／Q02): Salesforce の前年度採択データとの照合が未実装。
     * 連携実装後は Salesforce 側（Account／Opportunity）を照合対象とする。
     * 暫定として、本システム内の前年度採択事業者（u_prior_year_awarded_flag=true）のみを照合する。
     */
    judgePriorYearRegistration: function (corporateNumber, excludeEntityId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        gr.addQuery('u_corporate_number', corporateNumber)
        gr.addQuery('u_prior_year_awarded_flag', true)
        if (excludeEntityId) {
            gr.addQuery('sys_id', '!=', excludeEntityId + '')
        }
        gr.setLimit(1)
        gr.query()
        if (!gr.next()) {
            return { matched: false }
        }
        return {
            matched: true,
            awardNumber: gr.getValue('u_prior_year_award_number'),
            salesforceAccountId: gr.getValue('u_salesforce_account_id'),
        }
    },

    /** 事業者名の正規化（曖昧一致判定用） */
    normalizeName: function (value) {
        if (!value) {
            return ''
        }
        return (value + '')
            .replace(/[\s　]/g, '')
            .replace(/(株式会社|有限会社|合同会社|合資会社|合名会社|\(株\)|（株）|\(有\)|（有）)/g, '')
            .toLowerCase()
    },

    /**
     * 事業者名スキャンの取得上限（プロパティ優先。未作成・不正値の場合は既定値を使用する）。
     * トンマナ 3.3.2「取得件数が明確な場合は setLimit() を使用する」に基づく上限値であり、
     * 無制限（プロパティ未設定時に上限なし）にはしない。
     */
    getScanLimit: function () {
        var configured = parseInt(gs.getProperty(RegistrationDuplicateUtil.SCAN_LIMIT_PROPERTY, ''), 10)
        if (isNaN(configured) || configured <= 0) {
            return RegistrationDuplicateUtil.DEFAULT_SCAN_LIMIT
        }
        return configured
    },

    type: 'RegistrationDuplicateUtil',
}
