<#
.SYNOPSIS
    申請審査完了となった申請の添付ファイルを、社内ファイルサーバの共有フォルダへ複製する。

.DESCRIPTION
    RPA から呼び出される処理本体。ServiceNow の画面は一切操作せず、REST API のみを使用する。
    画面操作による実装は UI のバージョンアップやテーマ変更で壊れるため採用していない。

    処理の流れ
      1. 申請審査完了（u_application_status=review_done）の申請を取得する
      2. 各申請に紐づく添付の一覧を取得する（sys_attachment）
      3. 転送台帳（ledger）に記録済みの添付は除外する
      4. 添付をステージング領域へダウンロードする
      5. 拡張子・サイズ・ハッシュを検証する
      6. 共有フォルダへ配置する
      7. 転送台帳と監査ログへ記録する

    ServiceNow 側の添付は削除しない（要件）。したがって本処理は「移動」ではなく「複製」であり、
    再実行しても二重転送しないよう転送台帳で冪等性を担保している。

.PARAMETER ConfigPath
    設定ファイル（JSON）のパス。config/export-config.sample.json を複製して作成する。

.PARAMETER DryRun
    ダウンロードと配置を行わず、対象の件数のみを出力する。接続確認と影響範囲の確認に使用する。

.PARAMETER Since
    指定日時以降に更新された申請のみを対象とする（yyyy-MM-dd または yyyy-MM-dd HH:mm:ss）。
    転送台帳が大きくなってきた場合に取得対象を絞るために使用する。

.OUTPUTS
    終了コード
      0 … 全件成功（対象0件を含む）
      1 … 一時的な失敗あり（成功した分は配置済み。再実行で未転送分のみ処理される）
      2 … 致命的エラー（設定不備・認証失敗・共有フォルダ到達不可など。1件も処理していない）
      3 … ポリシー違反の添付を検出（拡張子・サイズ。再実行では回復しないため人手での判断が必要）

    RPA 側はこの終了コードで分岐する。運用上の扱いが異なるため区別している。
      1 は次回実行で自動的に回復する可能性がある（再実行で足りる）
      2 は設定・ネットワーク・権限の問題であり、再実行しても回復しない
      3 は添付そのものの問題であり、事務局が内容を確認する必要がある

    3 は検出した実行でのみ返る。ポリシー違反の添付も転送台帳へ記録するため、
    次回以降は対象外として扱われ、同じ添付で繰り返しアラームが上がることはない。
    1 と 3 が同時に発生した場合は、より緊急度の高い 1 を返す。

.EXAMPLE
    .\Export-SksAttachments.ps1 -ConfigPath .\config\export-config.json

.EXAMPLE
    .\Export-SksAttachments.ps1 -ConfigPath .\config\export-config.json -DryRun -Verbose

.NOTES
    対象の添付は決算書・登記簿・見積書等の機微情報を含む。
    ステージング領域は OS ドライブ上の ACL を絞ったフォルダとし、処理後に必ず削除する。
    ログには申請番号・ファイル名・ハッシュを記録するが、ファイルの内容および資格情報は記録しない。

    Windows PowerShell 5.1 で動作する記法のみを使用している（PowerShell 7 固有の構文は使わない）。
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $ConfigPath,

    [switch] $DryRun,

    [string] $Since
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ServiceNow は TLS 1.2 以上を要求する。5.1 の既定は TLS 1.0 のため明示する
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# ---------------------------------------------------------------------------
# 定数
# ---------------------------------------------------------------------------

# Windows のファイル名に使用できない文字（制御文字は別途除去する）
$script:InvalidFileNameChars = @('<', '>', ':', '"', '/', '\', '|', '?', '*')

# Windows の予約デバイス名。これらはファイル名として使用できない
$script:ReservedNames = @(
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
)

# 終了コード
$script:ExitSuccess = 0
$script:ExitPartial = 1
$script:ExitFatal = 2
$script:ExitRejected = 3

# ---------------------------------------------------------------------------
# ログ
# ---------------------------------------------------------------------------

$script:LogFile = $null

<#
    ログを1行追記する。監査証跡として残すため、日次のファイルへ追記していく。
    レベルは INFO / WARN / ERROR の3種類。
#>
function Write-Log {
    param(
        [string] $Level,
        [string] $Message
    )

    $timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    $line = "$timestamp`t$Level`t$Message"

    if ($script:LogFile) {
        # 追記は UTF-8 で行う。Add-Content の既定はシステム ANSI のため明示する
        Add-Content -LiteralPath $script:LogFile -Value $line -Encoding UTF8
    }

    switch ($Level) {
        'ERROR' { Write-Host $line -ForegroundColor Red }
        'WARN' { Write-Host $line -ForegroundColor Yellow }
        default { Write-Verbose $line }
    }
}

<# 保存期間を過ぎたログを削除する（監査要件に合わせて logRetentionDays で調整する） #>
function Remove-OldLogs {
    param(
        [string] $LogDir,
        [int] $RetentionDays
    )

    if ($RetentionDays -le 0) {
        return
    }

    $threshold = (Get-Date).AddDays(-$RetentionDays)
    Get-ChildItem -LiteralPath $LogDir -Filter 'export-*.log' -File |
        Where-Object { $_.LastWriteTime -lt $threshold } |
        ForEach-Object {
            try {
                Remove-Item -LiteralPath $_.FullName -Force
            } catch {
                # ログ削除の失敗は本処理を止める理由にならない
                Write-Log 'WARN' "古いログの削除に失敗しました: $($_.Exception.Message)"
            }
        }
}

# ---------------------------------------------------------------------------
# 設定
# ---------------------------------------------------------------------------

<# 設定ファイルを読み込み、必須項目の有無を検証する #>
function Read-Config {
    param([string] $Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "設定ファイルが見つかりません: $Path"
    }

    $config = Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json

    $required = @(
        'instanceUrl', 'credentialPath', 'shareRoot', 'stagingDir',
        'ledgerPath', 'logDir', 'targetTable', 'targetStatus'
    )
    foreach ($key in $required) {
        if (-not $config.PSObject.Properties.Name.Contains($key)) {
            throw "設定ファイルに $key がありません: $Path"
        }
        if ([string]::IsNullOrWhiteSpace([string]$config.$key)) {
            throw "設定ファイルの $key が空です: $Path"
        }
    }

    # 既定値の補完（省略可能な項目）
    if (-not $config.PSObject.Properties.Name.Contains('pageSize') -or $config.pageSize -le 0) {
        $config | Add-Member -NotePropertyName 'pageSize' -NotePropertyValue 50 -Force
    }
    if (-not $config.PSObject.Properties.Name.Contains('maxApplications') -or $config.maxApplications -le 0) {
        $config | Add-Member -NotePropertyName 'maxApplications' -NotePropertyValue 500 -Force
    }
    if (-not $config.PSObject.Properties.Name.Contains('maxAttachmentBytes') -or $config.maxAttachmentBytes -le 0) {
        $config | Add-Member -NotePropertyName 'maxAttachmentBytes' -NotePropertyValue 52428800 -Force
    }
    if (-not $config.PSObject.Properties.Name.Contains('logRetentionDays')) {
        $config | Add-Member -NotePropertyName 'logRetentionDays' -NotePropertyValue 400 -Force
    }

    # 末尾のスラッシュを除去してから URL を組み立てる
    $config.instanceUrl = ([string]$config.instanceUrl).TrimEnd('/')

    return $config
}

<# DPAPI で暗号化された資格情報ファイルを読み込む #>
function Read-StoredCredential {
    param([string] $Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "資格情報ファイルが見つかりません: $Path`n先に Set-SksExportCredential.ps1 を実行してください。"
    }

    try {
        return Import-Clixml -LiteralPath $Path
    } catch {
        throw "資格情報の復号に失敗しました: $Path`n資格情報を作成したユーザ・マシンと、実行中のユーザ・マシンが一致しているか確認してください。"
    }
}

# ---------------------------------------------------------------------------
# 転送台帳
#
# 「どの添付を、いつ、どこへ配置したか」を保持する。ServiceNow 側の添付を削除しない要件のため、
# 転送済みかどうかをこちらで判断しないと再実行のたびに二重転送する。
#
# キーは sys_attachment の sys_id。添付は更新されず差し替え時は別レコードになるため、
# sys_id が一致すれば同一の実体である。
# ---------------------------------------------------------------------------

<# 転送台帳を読み込み、sys_id をキーとしたハッシュテーブルを返す #>
function Read-Ledger {
    param([string] $Path)

    $ledger = @{}

    if (-not (Test-Path -LiteralPath $Path)) {
        return $ledger
    }

    try {
        $entries = Get-Content -LiteralPath $Path -Raw -Encoding UTF8 | ConvertFrom-Json
    } catch {
        throw "転送台帳の読み込みに失敗しました: $Path`n$($_.Exception.Message)"
    }

    if ($null -eq $entries) {
        return $ledger
    }

    # 1件のみの場合 ConvertFrom-Json は配列を返さないため正規化する
    foreach ($entry in @($entries)) {
        if ($entry -and $entry.attachmentId) {
            $ledger[[string]$entry.attachmentId] = $entry
        }
    }

    return $ledger
}

<#
    転送台帳を書き出す。
    一時ファイルへ書いてから置き換えることで、書き込み中の異常終了で台帳が壊れるのを防ぐ。
    台帳が壊れると全件が未転送と判定され大量の二重転送が発生するため、ここは慎重に扱う。
#>
function Write-Ledger {
    param(
        [string] $Path,
        [hashtable] $Ledger
    )

    $dir = Split-Path -Parent $Path
    if (-not (Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }

    $temp = "$Path.tmp"
    $entries = @($Ledger.Values | Sort-Object -Property exportedAt)

    # 空配列でも JSON 配列として書き出す（次回読み込み時に型が揺れないようにする）
    $json = ConvertTo-Json -InputObject $entries -Depth 5
    if ($entries.Count -eq 0) {
        $json = '[]'
    }

    Set-Content -LiteralPath $temp -Value $json -Encoding UTF8
    Move-Item -LiteralPath $temp -Destination $Path -Force
}

# ---------------------------------------------------------------------------
# ServiceNow REST API
# ---------------------------------------------------------------------------

<#
    REST API を呼び出す。一時的な障害に対して指数バックオフで再試行する。
    再試行するのは通信エラーと 429／5xx のみ。401／403／404 は再試行しても回復しないため即座に失敗させる。
#>
function Invoke-SnApi {
    param(
        [string] $Uri,
        [System.Management.Automation.PSCredential] $Credential,
        [string] $Method = 'Get',
        [string] $Body,
        [string] $OutFile,
        [int] $MaxAttempts = 3
    )

    $attempt = 0
    while ($true) {
        $attempt++
        try {
            $params = @{
                Uri         = $Uri
                Method      = $Method
                Credential  = $Credential
                TimeoutSec  = 120
                ErrorAction = 'Stop'
            }

            # Windows PowerShell 5.1 は Credential を付けても事前に認証ヘッダを送らないため、
            # Authorization ヘッダを明示的に組み立てる（ServiceNow は 401 チャレンジを返さない設定がある）
            $pair = "$($Credential.UserName):$($Credential.GetNetworkCredential().Password)"
            $encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($pair))
            $params['Headers'] = @{ Authorization = "Basic $encoded" }
            $params.Remove('Credential') | Out-Null

            if ($OutFile) {
                $params['OutFile'] = $OutFile
                # バイナリをそのまま保存するため Invoke-WebRequest を使用する
                Invoke-WebRequest @params | Out-Null
                return $null
            }

            if ($Body) {
                $params['Body'] = $Body
                $params['ContentType'] = 'application/json'
            }
            $params['Headers']['Accept'] = 'application/json'

            return Invoke-RestMethod @params
        } catch {
            $status = $null
            if ($_.Exception.PSObject.Properties.Name.Contains('Response') -and $_.Exception.Response) {
                try {
                    $status = [int]$_.Exception.Response.StatusCode
                } catch {
                    $status = $null
                }
            }

            # 回復しないエラーは再試行しない
            if ($status -eq 401 -or $status -eq 403) {
                throw "ServiceNow の認証・認可に失敗しました（HTTP $status）。連携用アカウントのロールを確認してください。"
            }
            if ($status -eq 404) {
                throw "ServiceNow のリソースが見つかりません（HTTP 404）: $Uri"
            }

            if ($attempt -ge $MaxAttempts) {
                $detail = $_.Exception.Message
                if ($status) {
                    $detail = "HTTP $status / $detail"
                }
                throw "ServiceNow の呼び出しに失敗しました（$attempt 回試行）: $detail"
            }

            $wait = [Math]::Pow(2, $attempt)
            Write-Log 'WARN' "呼び出しに失敗したため $wait 秒後に再試行します（$attempt/$MaxAttempts）: $($_.Exception.Message)"
            Start-Sleep -Seconds $wait
        }
    }
}

<# 申請審査完了の申請を取得する（ページングで全件取得する） #>
function Get-TargetApplications {
    param(
        $Config,
        [System.Management.Automation.PSCredential] $Credential,
        [string] $Since
    )

    $query = "u_application_status=$($Config.targetStatus)"
    if (-not [string]::IsNullOrWhiteSpace([string]$Config.additionalQuery)) {
        $query += "^$($Config.additionalQuery)"
    }
    if (-not [string]::IsNullOrWhiteSpace($Since)) {
        # 相対日付ではなく明示的な日時で絞る（境界の解釈揺れを避ける）
        $query += "^sys_updated_on>=$Since"
    }
    $query += '^ORDERBYu_application_number'

    $applications = @()
    $offset = 0

    while ($applications.Count -lt $Config.maxApplications) {
        $limit = [Math]::Min([int]$Config.pageSize, [int]$Config.maxApplications - $applications.Count)
        $uri = "$($Config.instanceUrl)/api/now/table/$($Config.targetTable)" +
            "?sysparm_query=$([Uri]::EscapeDataString($query))" +
            "&sysparm_fields=sys_id,u_application_number" +
            "&sysparm_display_value=false" +
            "&sysparm_exclude_reference_link=true" +
            "&sysparm_limit=$limit&sysparm_offset=$offset"

        $response = Invoke-SnApi -Uri $uri -Credential $Credential
        $page = @($response.result)

        if ($page.Count -eq 0) {
            break
        }

        $applications += $page
        $offset += $page.Count

        if ($page.Count -lt $limit) {
            break
        }
    }

    return $applications
}

<# 指定した申請に紐づく添付の一覧を取得する #>
function Get-Attachments {
    param(
        $Config,
        [System.Management.Automation.PSCredential] $Credential,
        [string] $ApplicationSysId
    )

    $query = "table_name=$($Config.targetTable)^table_sys_id=$ApplicationSysId^ORDERBYsys_created_on"
    $uri = "$($Config.instanceUrl)/api/now/attachment" +
        "?sysparm_query=$([Uri]::EscapeDataString($query))" +
        "&sysparm_limit=200"

    $response = Invoke-SnApi -Uri $uri -Credential $Credential
    return @($response.result)
}

<# 転送済みであることを ServiceNow 側へ書き戻す（writeBackField が設定されている場合のみ） #>
function Set-ExportedFlag {
    param(
        $Config,
        [System.Management.Automation.PSCredential] $Credential,
        [string] $ApplicationSysId
    )

    if ([string]::IsNullOrWhiteSpace([string]$Config.writeBackField)) {
        return
    }

    $uri = "$($Config.instanceUrl)/api/now/table/$($Config.targetTable)/$ApplicationSysId"
    $payload = @{ $Config.writeBackField = [string]$Config.writeBackValue } | ConvertTo-Json -Compress

    Invoke-SnApi -Uri $uri -Credential $Credential -Method 'Patch' -Body $payload | Out-Null
}

# ---------------------------------------------------------------------------
# ファイル名・パス
# ---------------------------------------------------------------------------

<#
    Windows のファイル名として安全な文字列へ変換する。

    ServiceNow 上のファイル名は事業者が任意に付けたものであり、
    Windows で使用できない文字・予約名・末尾の空白やピリオドが含まれうる。
    日本語は保持する（共有フォルダ側が UTF-8／Shift_JIS のどちらでも
    Windows のファイルシステムは Unicode で保持するため問題にならない）。
#>
function Get-SafeFileName {
    param([string] $Name)

    if ([string]::IsNullOrWhiteSpace($Name)) {
        return 'unnamed'
    }

    $safe = $Name

    # 使用できない文字を全角ではなくアンダースコアへ置換する（元の文字数を保つより判別性を優先）
    foreach ($char in $script:InvalidFileNameChars) {
        $safe = $safe.Replace($char, '_')
    }

    # 制御文字を除去する
    $safe = ($safe.ToCharArray() | Where-Object { [int]$_ -ge 32 }) -join ''

    # 末尾の空白・ピリオドは Windows が暗黙に除去し、意図しない名前になるため先に取る
    $safe = $safe.TrimEnd(' ', '.')

    if ([string]::IsNullOrWhiteSpace($safe)) {
        return 'unnamed'
    }

    # 予約デバイス名は拡張子の有無に関係なく使用できないため接頭辞を付ける
    $baseName = [IO.Path]::GetFileNameWithoutExtension($safe)
    if ($script:ReservedNames -contains $baseName.ToUpperInvariant()) {
        $safe = "_$safe"
    }

    return $safe
}

<#
    配置先のフルパスを決定する。
    同名ファイルが既にある場合は連番を付けて退避する（上書きしない）。

    同名ファイルが発生するのは、事業者が同じファイル名で再提出した場合や、
    台帳が失われて再転送された場合である。いずれも上書きすると原本が失われるため
    連番で残し、後から人が判断できるようにする。
#>
function Get-DestinationPath {
    param(
        [string] $Directory,
        [string] $FileName
    )

    $candidate = Join-Path -Path $Directory -ChildPath $FileName
    if (-not (Test-Path -LiteralPath $candidate)) {
        return $candidate
    }

    $baseName = [IO.Path]::GetFileNameWithoutExtension($FileName)
    $extension = [IO.Path]::GetExtension($FileName)

    for ($i = 2; $i -le 999; $i++) {
        $candidate = Join-Path -Path $Directory -ChildPath "$baseName($i)$extension"
        if (-not (Test-Path -LiteralPath $candidate)) {
            return $candidate
        }
    }

    throw "配置先のファイル名を決定できません（同名が999件を超えています）: $FileName"
}

# ---------------------------------------------------------------------------
# 本処理
# ---------------------------------------------------------------------------

$summary = [ordered]@{
    Applications = 0
    Attachments  = 0
    Exported     = 0
    Skipped      = 0
    Rejected     = 0
    Failed       = 0
}

try {
    # --- 準備 -------------------------------------------------------------
    $config = Read-Config -Path $ConfigPath

    if (-not (Test-Path -LiteralPath $config.logDir)) {
        New-Item -ItemType Directory -Force -Path $config.logDir | Out-Null
    }
    $script:LogFile = Join-Path -Path $config.logDir -ChildPath "export-$((Get-Date).ToString('yyyyMMdd')).log"

    Write-Log 'INFO' '===== 添付エクスポートを開始します ====='
    Write-Log 'INFO' "設定=$ConfigPath / DryRun=$($DryRun.IsPresent) / 実行ユーザ=$($env:USERDOMAIN)\$($env:USERNAME)"

    $credential = Read-StoredCredential -Path $config.credentialPath

    # 共有フォルダへ到達できるかを最初に確認する。
    # 到達不可のまま処理を進めるとダウンロードだけ行って全件失敗するため、先に落とす
    if (-not (Test-Path -LiteralPath $config.shareRoot)) {
        throw "共有フォルダへ到達できません: $($config.shareRoot)`nネットワーク到達性とサービスアカウントのアクセス権を確認してください。"
    }

    if (-not (Test-Path -LiteralPath $config.stagingDir)) {
        New-Item -ItemType Directory -Force -Path $config.stagingDir | Out-Null
    }

    $ledger = Read-Ledger -Path $config.ledgerPath
    Write-Log 'INFO' "転送台帳の既存件数=$($ledger.Count)"

    # --- 対象の取得 -------------------------------------------------------
    # PowerShell は return で配列を展開するため、0件のとき関数の戻り値は $null になる。
    # Set-StrictMode 配下では $null.Count が例外になるので、呼び出し側で必ず @() で包む
    $applications = @(Get-TargetApplications -Config $config -Credential $credential -Since $Since)
    $summary.Applications = $applications.Count
    Write-Log 'INFO' "対象申請=$($applications.Count) 件（ステータス=$($config.targetStatus)）"

    if ($applications.Count -ge $config.maxApplications) {
        # 上限で打ち切った可能性がある。黙って切らずに警告する
        Write-Log 'WARN' "取得件数が上限（maxApplications=$($config.maxApplications)）に達しました。未処理の申請が残っている可能性があります。"
    }

    $allowedExtensions = @()
    if ($config.PSObject.Properties.Name.Contains('allowedExtensions')) {
        $allowedExtensions = @($config.allowedExtensions | ForEach-Object { ([string]$_).ToLowerInvariant() })
    }

    $ledgerDirty = $false

    # --- 申請ごとの処理 ---------------------------------------------------
    foreach ($application in $applications) {
        $applicationNumber = [string]$application.u_application_number
        if ([string]::IsNullOrWhiteSpace($applicationNumber)) {
            # 申請番号が未採番のレコードはフォルダ名を決められないため飛ばす
            Write-Log 'WARN' "申請番号が未設定のため対象外とします: sys_id=$($application.sys_id)"
            continue
        }

        # 0件のときに $null にならないよう @() で包む（理由は上記の対象取得と同じ）
        $attachments = @(Get-Attachments -Config $config -Credential $credential -ApplicationSysId $application.sys_id)
        $summary.Attachments += $attachments.Count

        if ($attachments.Count -eq 0) {
            Write-Log 'INFO' "添付なし: $applicationNumber"
            continue
        }

        # 書き戻しの判定に使う、この申請での失敗件数
        $failedInApplication = 0

        # 申請番号ごとのフォルダへ配置する
        $destinationDir = Join-Path -Path $config.shareRoot -ChildPath (Get-SafeFileName -Name $applicationNumber)

        foreach ($attachment in $attachments) {
            $attachmentId = [string]$attachment.sys_id
            $originalName = [string]$attachment.file_name
            $sizeBytes = 0
            if ($attachment.size_bytes) {
                $sizeBytes = [int64]$attachment.size_bytes
            }

            # すでに転送済み
            if ($ledger.ContainsKey($attachmentId)) {
                $summary.Skipped++
                Write-Log 'INFO' "転送済みのため対象外: $applicationNumber / $originalName"
                continue
            }

            $safeName = Get-SafeFileName -Name $originalName
            $extension = ([IO.Path]::GetExtension($safeName)).ToLowerInvariant()

            # 拡張子の許可リスト。実行可能形式が共有フォルダへ入るのを防ぐ
            # ポリシー違反は恒久的な拒否として扱い、転送台帳へ記録する。
            # 記録しないと毎回検出され、同じ添付で永続的にアラームが上がり続ける
            $rejectReason = ''
            if ($allowedExtensions.Count -gt 0 -and $allowedExtensions -notcontains $extension) {
                $rejectReason = "許可されていない拡張子（$extension）"
            } elseif ($sizeBytes -gt $config.maxAttachmentBytes) {
                $rejectReason = "サイズ上限超過（$sizeBytes bytes / 上限 $($config.maxAttachmentBytes) bytes）"
            }

            if ($rejectReason) {
                $summary.Rejected++
                Write-Log 'WARN' "ポリシー違反のため転送しません: $applicationNumber / $originalName / $rejectReason"

                if (-not $DryRun) {
                    $ledger[$attachmentId] = [PSCustomObject]@{
                        attachmentId      = $attachmentId
                        applicationNumber = $applicationNumber
                        originalFileName  = $originalName
                        destination       = ''
                        sizeBytes         = $sizeBytes
                        sha256            = ''
                        status            = 'rejected'
                        reason            = $rejectReason
                        exportedAt        = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
                    }
                    Write-Ledger -Path $config.ledgerPath -Ledger $ledger
                }
                continue
            }

            if ($DryRun) {
                $summary.Exported++
                Write-Log 'INFO' "[DryRun] 転送対象: $applicationNumber / $originalName → $destinationDir"
                continue
            }

            # ステージングのファイル名には sys_id を使う。
            # 事業者が付けた元のファイル名を一時領域で使うと、並行実行時に衝突する可能性がある
            $stagingPath = Join-Path -Path $config.stagingDir -ChildPath "$attachmentId$extension"

            try {
                # --- ダウンロード -----------------------------------------
                $downloadUri = "$($config.instanceUrl)/api/now/attachment/$attachmentId/file"
                Invoke-SnApi -Uri $downloadUri -Credential $credential -OutFile $stagingPath | Out-Null

                if (-not (Test-Path -LiteralPath $stagingPath)) {
                    throw 'ダウンロードしたファイルが存在しません。'
                }

                # --- 検証 -------------------------------------------------
                $downloaded = Get-Item -LiteralPath $stagingPath
                if ($sizeBytes -gt 0 -and $downloaded.Length -ne $sizeBytes) {
                    throw "ダウンロードしたサイズが一致しません（期待 $sizeBytes / 実際 $($downloaded.Length)）。"
                }
                if ($downloaded.Length -eq 0) {
                    throw 'ダウンロードしたファイルが0バイトです。'
                }

                $hash = (Get-FileHash -LiteralPath $stagingPath -Algorithm SHA256).Hash

                # --- 配置 -------------------------------------------------
                if (-not (Test-Path -LiteralPath $destinationDir)) {
                    New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null
                }

                $destinationPath = Get-DestinationPath -Directory $destinationDir -FileName $safeName

                # 共有フォルダ上に不完全なファイルを見せないため、一時名で置いてから改名する。
                # 直接書くと、転送中のファイルを後続の業務処理が拾ってしまう可能性がある
                $tempDestination = "$destinationPath.part"
                Copy-Item -LiteralPath $stagingPath -Destination $tempDestination -Force

                # 配置後にハッシュを再計算し、ネットワーク経由での破損を検出する
                $placedHash = (Get-FileHash -LiteralPath $tempDestination -Algorithm SHA256).Hash
                if ($placedHash -ne $hash) {
                    Remove-Item -LiteralPath $tempDestination -Force -ErrorAction SilentlyContinue
                    throw '配置後のハッシュが一致しません（転送中に破損した可能性があります）。'
                }

                Move-Item -LiteralPath $tempDestination -Destination $destinationPath -Force

                # --- 台帳へ記録 -------------------------------------------
                # 配置が完了してから記録する。逆順にすると、配置に失敗した添付が
                # 転送済みとして扱われ、恒久的な転送漏れになる
                # 台帳のエントリは PSCustomObject で統一する。
                # 読み込み時（ConvertFrom-Json）も PSCustomObject になるため、
                # 新規と既存を同じ配列へ入れても JSON の形が揺れない
                $ledger[$attachmentId] = [PSCustomObject]@{
                    attachmentId      = $attachmentId
                    applicationNumber = $applicationNumber
                    originalFileName  = $originalName
                    destination       = $destinationPath
                    sizeBytes         = $downloaded.Length
                    sha256            = $hash
                    status            = 'exported'
                    reason            = ''
                    exportedAt        = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
                }
                $ledgerDirty = $true

                # 1件ごとに台帳を保存する。まとめて保存すると、途中で異常終了した際に
                # 配置済みの添付が未転送として扱われ二重転送になる
                Write-Ledger -Path $config.ledgerPath -Ledger $ledger
                $ledgerDirty = $false

                $summary.Exported++
                Write-Log 'INFO' "転送しました: $applicationNumber / $originalName → $destinationPath（$($downloaded.Length) bytes / SHA256=$hash）"
            } catch {
                $summary.Failed++
                $failedInApplication++
                Write-Log 'ERROR' "転送に失敗しました: $applicationNumber / $originalName / $($_.Exception.Message)"
            } finally {
                # ステージングに機微情報を残さない
                if (Test-Path -LiteralPath $stagingPath) {
                    Remove-Item -LiteralPath $stagingPath -Force -ErrorAction SilentlyContinue
                }
            }
        }

        # この申請の全添付の転送に成功した場合のみ書き戻す。
        # 全体の失敗件数（$summary.Failed）で判定すると、1件失敗した後に処理した
        # 成功済みの申請すべてが書き戻されなくなるため、申請単位で数える
        if (-not $DryRun -and $failedInApplication -eq 0) {
            try {
                Set-ExportedFlag -Config $config -Credential $credential -ApplicationSysId $application.sys_id
            } catch {
                # 書き戻しの失敗で配置済みのファイルを消すことはしない。
                # 次回実行時は台帳により二重転送されないため、警告として残す
                Write-Log 'WARN' "転送済みフラグの書き戻しに失敗しました: $applicationNumber / $($_.Exception.Message)"
            }
        }
    }

    if ($ledgerDirty) {
        Write-Ledger -Path $config.ledgerPath -Ledger $ledger
    }

    Remove-OldLogs -LogDir $config.logDir -RetentionDays $config.logRetentionDays

    # --- 結果 -------------------------------------------------------------
    $message = "対象申請=$($summary.Applications) / 添付=$($summary.Attachments) / 転送=$($summary.Exported)" +
        " / 対象外=$($summary.Skipped) / 要確認=$($summary.Rejected) / 失敗=$($summary.Failed)"
    Write-Log 'INFO' $message
    Write-Log 'INFO' '===== 添付エクスポートを終了します ====='

    # RPA が解析できるよう標準出力へ1行で出す
    Write-Output $message

    # 一時的な失敗のほうが緊急度が高いため、同時に発生した場合は 1 を優先する
    if ($summary.Failed -gt 0) {
        exit $script:ExitPartial
    }
    if ($summary.Rejected -gt 0) {
        exit $script:ExitRejected
    }
    exit $script:ExitSuccess
} catch {
    # 致命的エラー。1件も処理していないか、処理を継続できない状態
    $detail = $_.Exception.Message
    if ($script:LogFile) {
        Write-Log 'ERROR' "致命的エラーにより中断しました: $detail"
        Write-Log 'ERROR' '===== 添付エクスポートを異常終了します ====='
    } else {
        Write-Host "致命的エラーにより中断しました: $detail" -ForegroundColor Red
    }

    Write-Output "FATAL: $detail"
    exit $script:ExitFatal
}
