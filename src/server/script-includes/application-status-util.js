/**
 * ApplicationStatusUtil
 *
 * 申請ステータス管理処理（処理No.22）のうち、画面表示ラベルの切替を担当する。
 * 業務フロー「申請ステータス一覧」の 事務局用ステータス → 事業者用ステータス 変換表を単一の正とし、
 * 事業者向け画面（SC-05 マイページ／SC-07 申請状況一覧）から共通利用する。
 *
 * 画面設計書 SC-05 備考「事務局用の詳細ステータス（一次審査中／不備修正回答あり等）は事業者には表示しない」
 * に従い、事業者へは変換後のラベルのみを返す。
 */
var ApplicationStatusUtil = Class.create()

/** 事務局用ステータス値 → 事業者用ステータス表記 */
ApplicationStatusUtil.APPLICANT_LABELS = {
    input: '申請入力中',
    accepted: '審査中',
    first_review: '審査中',
    defect_request: '要対応：不備確認',
    defect_fixing: '要対応：不備修正中',
    defect_answered: '審査中',
    re_review: '審査中',
    first_review_done: '一次審査完了',
    credit_judging: '信用調査確認中',
    credit_exempt: '信用調査免除',
    ext_preparing: '信用調査準備中',
    ext_reviewing: '信用調査中',
    result_waiting: '信用調査結果待ち',
    result_checking: '信用調査確認中',
    review_done: '審査完了',
    rejected: '不採択',
    withdrawn: '取下げ',
}

/**
 * ステータス値 → 表示区分。
 * 画面イメージ凡例（成果物No.5）の3区分に対応させる。
 *   done    : 完了／問題なし系（審査完了・一次審査完了・信用調査免除）
 *   progress: 処理中／要確認系（審査中・信用調査中）
 *   error   : エラー／不備系（要対応・不採択・取下げ）
 *   neutral : 入力中
 */
ApplicationStatusUtil.STATUS_TONES = {
    input: 'neutral',
    accepted: 'progress',
    first_review: 'progress',
    defect_request: 'error',
    defect_fixing: 'error',
    defect_answered: 'progress',
    re_review: 'progress',
    first_review_done: 'done',
    credit_judging: 'progress',
    credit_exempt: 'done',
    ext_preparing: 'progress',
    ext_reviewing: 'progress',
    result_waiting: 'progress',
    result_checking: 'progress',
    review_done: 'done',
    rejected: 'error',
    withdrawn: 'error',
}

/** 表示区分 → Bootstrap3 ラベルクラス（テンプレート側で ng-class にバインドする） */
ApplicationStatusUtil.TONE_LABEL_CLASSES = {
    done: 'label-success',
    progress: 'label-warning',
    error: 'label-danger',
    neutral: 'label-default',
}

ApplicationStatusUtil.prototype = {
    initialize: function () {},

    /**
     * 事務局用ステータス値を事業者用ステータス表記へ変換する。
     * 未知の値は空文字ではなく元の値を返し、画面上で欠落しないようにする。
     */
    getApplicantLabel: function (status) {
        if (!status) {
            return ''
        }
        var label = ApplicationStatusUtil.APPLICANT_LABELS[status + '']
        return label || status + ''
    },

    /** ステータス値の表示区分（done / progress / error / neutral） */
    getTone: function (status) {
        return ApplicationStatusUtil.STATUS_TONES[status + ''] || 'neutral'
    },

    /** ステータス値に対応する Bootstrap3 ラベルクラス */
    getLabelClass: function (status) {
        return ApplicationStatusUtil.TONE_LABEL_CLASSES[this.getTone(status)]
    },

    type: 'ApplicationStatusUtil',
}
