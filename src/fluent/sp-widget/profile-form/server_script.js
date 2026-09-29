/**
 * SC-06 自分の情報参照・変更画面 — サーバースクリプト
 *
 * ③アクション定義
 *   No.1「編集する」（事業者情報）→ 事業者情報変更処理（処理No.14）
 *   No.2「編集する」（アカウント情報）→ アカウント情報変更処理（処理No.15）
 *
 * ②画面項目定義
 *   F1 事業者名／F2 所在地／F3 業種／F4 従業員数 … 事業者情報（表示／編集）
 *   F5 メールアドレス … アカウント情報（表示／編集）
 *   F6 ユーザID     … アカウント情報（表示のみ・変更不可）
 *
 * 更新対象は必ずログインユーザ自身の事業者・アカウントに限定する
 * （サーバースクリプトの GlideRecord は ACL を経由しないため、絞り込みをここで担保する）。
 */
;(function () {
    data.isApplicant = false
    data.message = ''
    data.entityResult = null
    data.accountResult = null

    data.entity = { business_name: '', address: '', industry: '', industry_label: '', employee_count: 0 }
    data.account = { email: '', user_id: '' }
    data.industryChoices = []

    var ctx = new x_dent2_dentsusoke.PortalContextUtil()
    var entityId = ctx.getMyEntityId()
    if (!entityId) {
        data.message = 'このページは事業者ユーザ向けです。事業者情報が紐づいたアカウントでログインしてください。'
        return
    }
    data.isApplicant = true
    data.industryChoices = getIndustryChoices()

    if (input && input.action === 'save_entity') {
        data.entityResult = saveEntity(entityId, input)
    } else if (input && input.action === 'save_account') {
        data.accountResult = saveAccount(input)
    }

    // 保存後も最新値を返すため、読み込みは常に最後に行う
    loadEntity(entityId)
    loadAccount()

    // -----------------------------------------------------------------------
    // 参照
    // -----------------------------------------------------------------------
    function loadEntity(entityId) {
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        if (!gr.get(entityId)) {
            return
        }
        data.entity = {
            business_name: gr.getValue('u_business_name') || '',
            address: gr.getValue('u_address') || '',
            industry: gr.getValue('u_industry') || '',
            industry_label: gr.getDisplayValue('u_industry') || '',
            employee_count: parseInt(gr.getValue('u_employee_count'), 10) || 0,
            entity_type_label: gr.getDisplayValue('u_entity_type') || '',
            corporate_number: gr.getValue('u_corporate_number') || '',
        }
    }

    function loadAccount() {
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        if (!gr.get(gs.getUserID())) {
            return
        }
        data.account = {
            email: gr.getValue('email') || '',
            // F6 ユーザID：ログインIDを表示する（表示のみ・変更不可）
            user_id: gr.getValue('user_name') || '',
        }
    }

    /**
     * 業種の選択肢。
     * 設計書 F3 は「業種マスタ（T15）からの選択」だが、T15 は本スライス範囲外のため
     * 事業者テーブルの選択リスト（u_industry）から取得する。
     * TODO: T15 実装時にマスタ参照へ切り替える。
     */
    function getIndustryChoices() {
        var choices = []
        var seen = {}

        var gr = new GlideRecord('sys_choice')
        gr.addQuery('name', 'x_dent2_dentsusoke_entity')
        gr.addQuery('element', 'u_industry')
        gr.addQuery('inactive', false)
        gr.orderBy('sequence')
        gr.setLimit(100)
        gr.query()
        while (gr.next()) {
            var value = gr.getValue('value')
            if (value && !seen[value]) {
                seen[value] = true
                choices.push({ value: value, label: gr.getValue('label') || value })
            }
        }

        if (choices.length > 0) {
            return choices
        }

        // 選択肢が取得できなかった場合のフォールバック（列定義と同一の内容）
        return [
            { value: 'manufacturing', label: '製造業' },
            { value: 'construction', label: '建設業' },
            { value: 'transportation', label: '運輸業' },
            { value: 'wholesale', label: '卸売業' },
            { value: 'service', label: 'サービス業' },
            { value: 'retail', label: '小売業' },
            { value: 'other', label: 'その他' },
        ]
    }

    // -----------------------------------------------------------------------
    // 事業者情報変更処理（処理No.14）
    // -----------------------------------------------------------------------
    function saveEntity(entityId, input) {
        var businessName = trim(input.business_name)
        var address = trim(input.address)
        var industry = trim(input.industry)
        var employeeCount = trim(input.employee_count)

        var errors = []
        if (!businessName) {
            errors.push('事業者名（法人名／屋号）を入力してください。')
        } else if (businessName.length > 100) {
            errors.push('事業者名は100文字以内で入力してください。')
        }
        if (!address) {
            errors.push('所在地を入力してください。')
        } else if (address.length > 200) {
            errors.push('所在地は200文字以内で入力してください。')
        }
        if (!industry || !isValidIndustry(industry)) {
            errors.push('業種を選択してください。')
        }
        if (employeeCount === '' || !/^[0-9]+$/.test(employeeCount)) {
            errors.push('従業員数は0以上の整数で入力してください。')
        }
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        // 更新対象はログインユーザの所属事業者のみ
        var gr = new GlideRecord('x_dent2_dentsusoke_entity')
        if (!gr.get(entityId)) {
            return { success: false, errors: ['事業者情報が見つかりません。'] }
        }
        gr.setValue('u_business_name', businessName)
        gr.setValue('u_address', address)
        gr.setValue('u_industry', industry)
        gr.setValue('u_employee_count', parseInt(employeeCount, 10))
        if (!gr.update()) {
            gs.error('[SKS] 事業者情報の更新に失敗しました。entity=' + entityId)
            return { success: false, errors: ['事業者情報の更新に失敗しました。時間をおいて再度お試しください。'] }
        }

        gs.info('[SKS] 事業者情報を更新しました。entity=' + entityId)
        return { success: true }
    }

    // -----------------------------------------------------------------------
    // アカウント情報変更処理（処理No.15）
    // -----------------------------------------------------------------------
    function saveAccount(input) {
        var email = trim(input.email)

        var errors = []
        if (!email) {
            errors.push('メールアドレスを入力してください。')
        } else if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) {
            errors.push('メールアドレスの形式が正しくありません。')
        } else if (email.length > 256) {
            errors.push('メールアドレスは256文字以内で入力してください。')
        }
        if (errors.length > 0) {
            return { success: false, errors: errors }
        }

        // TODO(Q06): メールアドレスの一意性ルールが未確定。
        // 暫定として、他の事業者ユーザが使用中のアドレスへの変更は受け付けない（SC-02 の判定と揃える）。
        var dup = new GlideRecord('x_dent2_dentsusoke_user')
        dup.addQuery('email', email)
        dup.addQuery('sys_id', '!=', gs.getUserID())
        dup.setLimit(1)
        dup.query()
        if (dup.hasNext()) {
            return { success: false, errors: ['このメールアドレスは既に使用されています。'] }
        }

        // 更新対象はログインユーザ自身のみ
        var gr = new GlideRecord('x_dent2_dentsusoke_user')
        if (!gr.get(gs.getUserID())) {
            return { success: false, errors: ['アカウント情報が見つかりません。'] }
        }
        // TODO(SC-06 ②F5 備考): メールアドレス変更時の再認証要否が未確定。
        // 暫定として再認証なしで変更を受け付ける。確定後に再認証（パスワード再入力等）を追加する。
        gr.setValue('email', email)
        if (!gr.update()) {
            gs.error('[SKS] アカウント情報の更新に失敗しました。user=' + gs.getUserID())
            return { success: false, errors: ['アカウント情報の更新に失敗しました。時間をおいて再度お試しください。'] }
        }

        gs.info('[SKS] アカウント情報を更新しました。user=' + gs.getUserID())
        return { success: true }
    }

    function isValidIndustry(value) {
        for (var i = 0; i < data.industryChoices.length; i++) {
            if (data.industryChoices[i].value === value) {
                return true
            }
        }
        return false
    }

    function trim(value) {
        if (value === null || value === undefined) {
            return ''
        }
        return (value + '').trim()
    }
})()
