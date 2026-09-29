/**
 * 添付書類の提出（ITCOM-03）— クライアントスクリプト
 *
 * ③アクション No.1「ファイルを選択」／No.2「削除」
 *
 * ■ アップロードの流れ
 *   1. 画面で選んだファイルを添付 REST API（/api/now/attachment/file）へ直接送る
 *   2. 完了後 sync_document でサーバーへ検証を依頼する
 *      （形式・サイズの検証はサーバー側が唯一の判定点。ここでの検証は無駄な通信を避けるため）
 *
 * ■ ファイル入力の持ち方
 * <input type="file"> は ng-model で扱えない。
 * 行ごとに input を置くと ng-repeat 内のスコープを DOM から辿る必要があり、
 * デバッグ情報が無効なインスタンスで動かなくなる。
 * そのため input は画面に1つだけ置き、行のボタンから click() して使う。
 * change の購読は素の DOM API で行う（スコープを辿らない）。
 */
api.controller = function ($http, $window, $element, $timeout) {
    var c = this

    c.uploading = false
    c.removing = false
    c.serverErrors = []
    c.clientErrors = []
    c.saved = false

    /** どの提出書類に対してファイルを選んでいるか */
    var pendingDoc = null

    /** 画面に1つだけ置いたファイル入力 */
    var fileInput = null

    /**
     * ファイル入力の change を購読する。
     * ウィジェットの描画後に要素が現れるため $timeout で1周待つ。
     */
    $timeout(function () {
        fileInput = $element[0].querySelector('.sks-doc-file')
        if (!fileInput) {
            return
        }
        fileInput.addEventListener('change', function () {
            var file = fileInput.files && fileInput.files.length > 0 ? fileInput.files[0] : null
            // 同じファイルを続けて選び直せるよう値を消す
            fileInput.value = ''
            if (!file || !pendingDoc) {
                return
            }
            // DOM のイベント内なので Angular へ変更を伝える
            $timeout(function () {
                upload(pendingDoc, file)
            })
        })
    })

    /** ③No.1 ファイルを選ぶ */
    c.pickFile = function (doc) {
        c.serverErrors = []
        c.clientErrors = []
        c.saved = false
        if (c.uploading || !fileInput) {
            return
        }
        pendingDoc = doc
        fileInput.click()
    }

    /** ③No.2 添付ファイルを削除する */
    c.remove = function (doc) {
        c.serverErrors = []
        c.clientErrors = []
        c.saved = false
        if (c.removing) {
            return
        }
        if (!$window.confirm('「' + doc.documentTypeLabel + '」の添付ファイルを削除します。よろしいですか？')) {
            return
        }

        c.removing = true
        c.data.action = 'remove_document'
        c.data.doc_id = doc.sys_id

        c.server.update().then(function () {
            c.removing = false
            c.data.action = null
            c.data.doc_id = null
            handleResult()
        })
    }

    /** アップロード中の行か（行ごとにスピナーを出すため） */
    c.isUploading = function (doc) {
        return c.uploading && !!pendingDoc && pendingDoc.sys_id === doc.sys_id
    }

    // -----------------------------------------------------------------------
    /**
     * 添付 REST API へ送る。
     *
     * 形式・サイズはサーバー側でも検証するが、上限を超えたファイルを
     * 送ってから削除するのは通信の無駄なのでここでも確認する。
     */
    function upload(doc, file) {
        var errors = validateFile(file)
        if (errors.length > 0) {
            c.clientErrors = errors
            pendingDoc = null
            return
        }

        c.uploading = true

        var url =
            '/api/now/attachment/file?table_name=' +
            encodeURIComponent(c.data.attachmentTable) +
            '&table_sys_id=' +
            encodeURIComponent(doc.sys_id) +
            '&file_name=' +
            encodeURIComponent(file.name)

        $http
            .post(url, file, {
                headers: {
                    'Content-Type': file.type || 'application/octet-stream',
                    Accept: 'application/json',
                    // セッショントークン。付けないと POST が拒否される
                    'X-UserToken': $window.g_ck,
                },
                transformRequest: angular.identity,
            })
            .then(
                function () {
                    // 登録できたらサーバーへ検証と行の更新を依頼する
                    c.data.action = 'sync_document'
                    c.data.doc_id = doc.sys_id

                    c.server.update().then(function () {
                        c.uploading = false
                        pendingDoc = null
                        c.data.action = null
                        c.data.doc_id = null
                        handleResult()
                    })
                },
                function (response) {
                    c.uploading = false
                    pendingDoc = null
                    c.clientErrors = [buildUploadError(response)]
                },
            )
    }

    /** アップロード前の確認（サーバー側の検証と同じ基準） */
    function validateFile(file) {
        var errors = []

        var name = file.name || ''
        var dot = name.lastIndexOf('.')
        var ext = dot < 0 ? '' : name.substring(dot + 1).toLowerCase()
        if (!ext || c.data.allowedExtensions.indexOf(ext) < 0) {
            errors.push('この形式のファイルは登録できません（' + c.data.allowedExtensionsLabel + ' のみ）。')
        }

        if (!file.size) {
            errors.push('ファイルの内容を確認できませんでした。')
        } else if (file.size > c.data.maxFileSize) {
            errors.push('ファイルサイズが上限（' + c.data.maxFileSizeLabel + '）を超えています。')
        }

        return errors
    }

    /**
     * アップロードの失敗理由。
     * 権限不足はインスタンス側の設定（glide.attachment.role など）が原因のことがあり、
     * 「保存に失敗しました」だけでは事務局が調査できないため状態コードを添える。
     */
    function buildUploadError(response) {
        var status = response && response.status ? response.status : 0
        if (status === 401 || status === 403) {
            return 'ファイルを登録する権限がありません（' + status + '）。事務局へお問い合わせください。'
        }
        if (status === 413) {
            return 'ファイルサイズが大きすぎます。' + c.data.maxFileSizeLabel + ' 以下のファイルをご利用ください。'
        }
        return 'ファイルの登録に失敗しました（' + status + '）。時間をおいて再度お試しください。'
    }

    function handleResult() {
        var result = c.data.saveResult
        if (result && result.success) {
            c.saved = true
        } else if (result && result.errors) {
            c.serverErrors = result.errors
        }
    }
}
