/**
 * 未実装画面のプレースホルダ — サーバースクリプト
 *
 * マイページ（SC-05）のトップタブは 申請／お知らせ／問合せ／自分の情報 への遷移を持つ。
 * これらの画面（SC-06／SC-07／SC-08／SC-10）は別スライスで実装するため、
 * リンク切れを避けるためのプレースホルダを表示する。
 */
;(function () {
    data.screenId = options.screen_id || ''
    data.screenName = options.screen_name || '画面'
    data.note = options.note || ''
    data.homeUrl = '?id=' + (options.home_page || 'x_dent2_dentsusoke_mypage')
})()
