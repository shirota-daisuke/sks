/**
 * SC-00 トップ（未ログイン）画面 案内カード×3 — サーバースクリプト
 *
 * 画面設計書 ①レイアウト構成「案内カード×3（対象者／申請方法／審査の流れ）」
 * 既定の文言は画面イメージ（成果物No.5）SC-00 の記載に合わせている。
 *
 * TODO(SC-00 確認事項): 未ログイン時に表示するサービス説明文言・対象者要件の表示範囲が未確定。
 * 文言確定までコード変更なしで差し替えられるよう、全項目をウィジェットオプションで上書きできる構成としている。
 */
;(function () {
    data.cards = [
        {
            key: 'target',
            title: options.card1_title || '対象者',
            body: options.card1_body || '前年度登録済／未登録いずれの事業者も申請可能',
            glyph: 'building-o',
        },
        {
            key: 'method',
            title: options.card2_title || '申請方法',
            body: options.card2_body || '電子申請（本ポータルより申請）',
            glyph: 'pencil-square-o',
        },
        {
            key: 'review',
            title: options.card3_title || '審査の流れ',
            body: options.card3_body || '事務局1次審査 → 外部審査員による信用調査',
            glyph: 'check-square-o',
        },
    ]
})()
