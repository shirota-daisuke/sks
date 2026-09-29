/**
 * SC-05 マイページ「申請状況」 — サーバースクリプト
 *
 * 表示項目 D5（申請ID／現在のステータス（事業者用表記）／最終更新日）
 * ステータスは処理No.22 の値を ApplicationStatusUtil で事業者用表記へ変換して表示する。
 */
;(function () {
    data.isApplicant = false
    data.applications = []
    data.listUrl = '?id=' + (options.application_page || 'x_dent2_dentsusoke_apps')

    var ctx = new x_dent2_dentsusoke.PortalContextUtil()
    var entityId = ctx.getMyEntityId()
    if (!entityId) {
        return
    }
    data.isApplicant = true

    var statusUtil = new x_dent2_dentsusoke.ApplicationStatusUtil()
    var maxRecords = parseInt(options.max_records, 10) || 5

    var gr = new GlideRecord('x_dent2_dentsusoke_request')
    gr.addQuery('u_business_entity', entityId)
    gr.orderByDesc('sys_updated_on')
    gr.setLimit(maxRecords)
    gr.query()

    while (gr.next()) {
        var status = gr.getValue('u_application_status')
        var sysId = gr.getUniqueValue()
        data.applications.push({
            sys_id: sysId,
            number: gr.getValue('u_application_number'),
            statusLabel: statusUtil.getApplicantLabel(status),
            statusClass: statusUtil.getLabelClass(status),
            updatedOn: formatDateTime(gr.getDisplayValue('sys_updated_on')),
            url: '?id=' + (options.application_page || 'x_dent2_dentsusoke_apps') + '&sys_id=' + sysId,
        })
    }

    /** 表示用日時（yyyy-mm-dd hh:mm:ss）から日付部分だけを yyyy/mm/dd で返す */
    function formatDateTime(displayValue) {
        if (!displayValue) {
            return ''
        }
        var datePart = (displayValue + '').split(' ')[0]
        return datePart.split('-').join('/')
    }
})()
