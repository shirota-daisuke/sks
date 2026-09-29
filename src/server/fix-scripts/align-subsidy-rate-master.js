/**
 * SKS 補助率マスタの値の是正（冪等な是正スクリプト）
 *
 * ■ 背景
 * 補助率マスタ（T16 相当・x_dent2_dentsusoke_rate）は、補助率を DecimalColumn から
 * 分子・分母の整数へ作り替えた経緯がある。2/3 を DecimalColumn に投入すると 0.67 へ
 * 丸められ、10,000,000円 の対象経費で 33,300円 の差が出るためである
 * （経緯は src/fluent/tables/subsidy-rate.now.ts のコメントを参照）。
 *
 * アプリのインストールで行われるのは「レコードが存在しない場合の新規作成」のみで、
 * 既存レコードは後続のインストールで更新されない。そのため作り替え前に投入された6行が残り、
 * 分子・分母は列の既定値だった 1/2 のまま、u_note は空のままになっている。
 * 結果として全区分の補助率が 1/2 で同一になり、小規模区分（個人事業主・5人以下）に
 * 適用すべき 2/3 が反映されていない。
 *
 * 当初は SC-16 マスタメンテナンス画面での手修正を想定していたが、
 * 手順が属人化し環境ごとの差異も検出できないため、是正スクリプトとして自動化する。
 *
 * ■ このスクリプトが行うこと
 * コード（u_code）を突合キーに、src/fluent/master-data/subsidy-rate-master.now.ts と
 * 同じ値へ分子・分母をそろえる。
 *
 * u_note は空の場合のみ設定する。補助率は処理No.17 の計算根拠であり
 * ATF テストが唯一の正しい値を検証する対象だが、備考は保守画面での自由記述であり、
 * 運用中に加えられた記載を上書きしてはならないためである。
 *
 * 存在しないコードは作成しない（新規環境ではインストール時に初期データが投入されるため、
 * ここで作成すると投入経路が2つになる）。欠落は警告としてログに残す。
 *
 * ■ 冪等性
 * 値が既に一致している行は更新しない。複数回実行しても影響はない。
 *
 * ■ 実行後の確認
 * ATF テスト「SC-16 マスタメンテナンス：補助率マスタの値」が成功すれば是正完了。
 */
;(function alignSubsidyRateMaster() {
    /**
     * 設定すべき補助率。src/fluent/master-data/subsidy-rate-master.now.ts と同じ値。
     * 小規模区分（個人事業主・5人以下）は 2/3、中小企業区分は 1/2 を適用する。
     *
     * TODO(要確認): 公募要領の補助率と、小規模事業者の定義（従業員数の閾値）が未確定。
     *   確定した場合は初期データと本スクリプトの双方を更新する。
     */
    var EXPECTED = [
        {
            code: 'sole_proprietor',
            numerator: 2,
            denominator: 3,
            note: '小規模事業者（個人事業主）。公募要領の小規模区分に該当するため引き上げ後の補助率を適用する。',
        },
        {
            code: 'le5',
            numerator: 2,
            denominator: 3,
            note: '小規模事業者（従業員5人以下）。公募要領の小規模区分に該当するため引き上げ後の補助率を適用する。',
        },
        {
            code: 'le20',
            numerator: 1,
            denominator: 2,
            note: '中小企業者。デモ申請データ（APP-2026-00123）で確定している補助率。',
        },
        { code: 'le50', numerator: 1, denominator: 2, note: '中小企業者。' },
        { code: 'le100', numerator: 1, denominator: 2, note: '中小企業者。' },
        { code: 'gt100', numerator: 1, denominator: 2, note: '中小企業者。' },
    ]

    var updated = []
    var unchanged = 0
    var missing = []
    var failed = []

    for (var i = 0; i < EXPECTED.length; i++) {
        var expected = EXPECTED[i]

        // コードは一意制約付きのため単一レコード取得となる（トンマナ 3.2.3）
        var gr = new GlideRecord('x_dent2_dentsusoke_rate')
        if (!gr.get('u_code', expected.code)) {
            missing.push(expected.code)
            continue
        }

        var currentNumerator = parseInt(gr.getValue('u_rate_numerator'), 10)
        var currentDenominator = parseInt(gr.getValue('u_rate_denominator'), 10)
        var currentNote = gr.getValue('u_note') || ''
        var changes = []

        if (currentNumerator !== expected.numerator) {
            gr.setValue('u_rate_numerator', expected.numerator)
            changes.push('分子 ' + currentNumerator + '→' + expected.numerator)
        }
        if (currentDenominator !== expected.denominator) {
            gr.setValue('u_rate_denominator', expected.denominator)
            changes.push('分母 ' + currentDenominator + '→' + expected.denominator)
        }
        // 備考は空の場合のみ補う（運用中の記載を上書きしない）
        if (!currentNote) {
            gr.setValue('u_note', expected.note)
            changes.push('備考を設定')
        }

        if (changes.length === 0) {
            unchanged++
            continue
        }

        if (gr.update()) {
            updated.push(expected.code + '（' + changes.join('・') + '）')
        } else {
            failed.push(expected.code)
            gs.error('[SKS] 補助率マスタの是正に失敗しました。code=' + expected.code)
        }
    }

    gs.info(
        '[SKS] 補助率マスタの値を是正しました。' +
            '更新=' + updated.length + '件' +
            ' / 既に一致=' + unchanged + '件' +
            ' / レコードなし=' + missing.length + '件' +
            ' / 更新失敗=' + failed.length + '件',
    )
    if (updated.length > 0) {
        gs.info('[SKS] 是正した補助率: ' + updated.join(', '))
    }
    if (missing.length > 0) {
        // 初期データが投入されていない状態。インストールの成否を確認する必要がある
        gs.warn('[SKS] 補助率マスタに存在しないコード: ' + missing.join(', '))
    }
})()
