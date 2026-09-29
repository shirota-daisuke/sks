/**
 * PortalContextUtil
 *
 * ログイン中の事業者ユーザのコンテキスト（所属事業者・事業者区分）を解決するユーティリティ。
 * 権限設計書「3. データスコープ制御方針」の
 *   「対象レコードの事業者参照フィールド ＝ ログインユーザーの所属事業者」
 * という条件判定を、ACL 条件スクリプトと Service Portal ウィジェットの双方から共通利用するために切り出す。
 *
 * Script Include クラス（Class.create）のため Glide API の import は行わない（実行時に自動で利用可能）。
 */
var PortalContextUtil = Class.create()

PortalContextUtil.prototype = {
    initialize: function () {
        this._loaded = false
        this._entityId = ''
        this._entityType = ''
    },

    /**
     * ログイン中の事業者ユーザレコードを1回だけ読み込む。
     * 事業者ユーザ（x_dent2_dentsusoke_user）は sys_user 拡張のため、sys_id はログインユーザと同一。
     */
    _load: function () {
        if (this._loaded) {
            return
        }
        this._loaded = true

        var userId = gs.getUserID()
        if (!userId) {
            return
        }

        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        if (!gr.get(userId)) {
            // 事務局ユーザ・システム管理者は事業者ユーザ拡張テーブルに行を持たない
            return
        }

        this._entityId = gr.getValue('u_business_entity') || ''
        if (this._entityId) {
            var entity = new GlideRecord('x_dent2_dentsusoke_entity')
            if (entity.get(this._entityId)) {
                this._entityType = entity.getValue('u_entity_type') || ''
            }
        }
    },

    /** ログイン中ユーザが事業者ユーザかどうか */
    isApplicant: function () {
        this._load()
        return this._entityId !== ''
    },

    /** ログイン中ユーザの所属事業者 sys_id（事業者ユーザでない場合は空文字） */
    getMyEntityId: function () {
        this._load()
        return this._entityId
    },

    /** ログイン中ユーザの事業者区分（corporate / sole_proprietor、判定不能時は空文字） */
    getMyEntityType: function () {
        this._load()
        return this._entityType
    },

    /**
     * 対象レコードが自社データかを判定する（ACL 条件スクリプトから使用）。
     * @param current 判定対象レコード
     * @param fieldName 事業者参照フィールド名（既定 u_business_entity）
     */
    isMyRecord: function (current, fieldName) {
        if (!current) {
            return false
        }
        var entityId = this.getMyEntityId()
        if (!entityId) {
            return false
        }
        return current.getValue(fieldName || 'u_business_entity') === entityId
    },

    type: 'PortalContextUtil',
}
