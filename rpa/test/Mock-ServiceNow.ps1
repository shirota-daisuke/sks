<#
.SYNOPSIS
    Export-SksAttachments.ps1 の検証用モックサーバ。ServiceNow REST API の一部を模倣する。

.DESCRIPTION
    検証のために ServiceNow の検証インスタンスを用意すると、
    申請の添付・申請審査完了への遷移が未実装のため（申請機能は ITCOM 主担当の範囲）
    正常系すら再現できない。またサイズ不一致・5xx・401 といった異常系は
    実インスタンスでは意図的に起こせない。

    そのため localhost で動作するモックサーバを用意し、
    シナリオを切り替えて転送処理の挙動を検証する。

    本スクリプトは検証専用であり、RPA 実行機へ配置する必要はない。

.PARAMETER Port
    待ち受けポート。テストごとに別のポートを使う（TIME_WAIT による再利用失敗を避けるため）。

.PARAMETER StateDir
    アクセスログと、シナリオ flaky の試行回数を保持するディレクトリ。

.PARAMETER Scenario
    normal        … 正常な添付3件（日本語名・予約デバイス名・不正文字を含む）
    policy        … normal に加え、拡張子違反（.exe）とサイズ上限超過の2件
    sizemismatch  … size_bytes と実体のサイズが一致しない添付1件
    flaky         … 添付のダウンロードが2回失敗し3回目で成功する（リトライの検証）
    unauthorized  … すべての要求に 401 を返す
    empty         … 対象の申請が0件

.EXAMPLE
    .\Mock-ServiceNow.ps1 -Port 18100 -StateDir C:\Temp\state -Scenario normal
#>
[CmdletBinding()]
param(
    [int] $Port = 18100,

    [Parameter(Mandatory = $true)]
    [string] $StateDir,

    [ValidateSet('normal', 'policy', 'sizemismatch', 'flaky', 'unauthorized', 'empty')]
    [string] $Scenario = 'normal'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------------------
# 添付の定義
#
# sys_id は実際の ServiceNow と同じ32桁にそろえる。
# Export-SksAttachments.ps1 はトークン長のような桁数検証を添付 sys_id には行わないが、
# 実データと桁が違うと台帳やパスの見え方が変わるため合わせておく。
# ---------------------------------------------------------------------------

$attachments = @{
    'a1000000000000000000000000000001' = @{ name = '決算書_2025年度.pdf'; content = 'PDF-DUMMY-1' }
    'a1000000000000000000000000000002' = @{ name = 'CON.pdf'; content = 'PDF-DUMMY-22' }
    'a1000000000000000000000000000003' = @{ name = 'bad<name>:file.pdf'; content = 'PDF-DUMMY-333' }
    'a1000000000000000000000000000004' = @{ name = 'malware.exe'; content = 'EXE-DUMMY' }
    'a1000000000000000000000000000005' = @{ name = 'huge.pdf'; content = 'PDF-DUMMY-HUGE' }
}

# シナリオごとに、1件目の申請へ紐づける添付
$attachmentsByScenario = @{
    'normal'       = @(
        'a1000000000000000000000000000001',
        'a1000000000000000000000000000002',
        'a1000000000000000000000000000003')
    'policy'       = @(
        'a1000000000000000000000000000001',
        'a1000000000000000000000000000002',
        'a1000000000000000000000000000003',
        'a1000000000000000000000000000004',
        'a1000000000000000000000000000005')
    'sizemismatch' = @('a1000000000000000000000000000001')
    'flaky'        = @('a1000000000000000000000000000001')
    'unauthorized' = @()
    'empty'        = @()
}

$flakyCounterPath = Join-Path -Path $StateDir -ChildPath 'flaky-count.txt'

# ---------------------------------------------------------------------------
# ヘルパ
# ---------------------------------------------------------------------------

function Write-Json {
    param($Response, $Object)

    $json = ConvertTo-Json -InputObject $Object -Depth 6
    $bytes = [Text.Encoding]::UTF8.GetBytes($json)
    $Response.ContentType = 'application/json;charset=UTF-8'
    $Response.ContentLength64 = $bytes.Length
    $Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $Response.Close()
}

function Write-Status {
    param($Response, [int] $StatusCode)

    $Response.StatusCode = $StatusCode
    $Response.Close()
}

<# size_bytes を返す。sizemismatch シナリオでは実体と異なる値を返す #>
function Get-ReportedSize {
    param([string] $AttachmentId)

    $actual = [Text.Encoding]::UTF8.GetByteCount($attachments[$AttachmentId].content)

    if ($Scenario -eq 'sizemismatch') {
        return $actual + 100
    }
    # サイズ上限超過の検証用。実体は小さいが申告値だけ大きくする
    if ($AttachmentId -eq 'a1000000000000000000000000000005') {
        return 999999999
    }
    return $actual
}

<# flaky シナリオ：ダウンロードの試行回数を数え、3回目で成功させる #>
function Get-FlakyAttempt {
    $count = 0
    if (Test-Path -LiteralPath $flakyCounterPath) {
        $count = [int](Get-Content -LiteralPath $flakyCounterPath -Raw)
    }
    $count++
    Set-Content -LiteralPath $flakyCounterPath -Value $count -Encoding UTF8
    return $count
}

# ---------------------------------------------------------------------------
# 起動
# ---------------------------------------------------------------------------

if (-not (Test-Path -LiteralPath $StateDir)) {
    New-Item -ItemType Directory -Force -Path $StateDir | Out-Null
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

Write-Host "mock listening on http://localhost:$Port/ (scenario=$Scenario)"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response
        $path = $req.Url.AbsolutePath
        $query = $req.Url.Query

        Add-Content -LiteralPath (Join-Path $StateDir 'access.log') `
            -Value "$($req.HttpMethod) $path$query" -Encoding UTF8

        # テスト側からの停止要求
        if ($path -eq '/shutdown') {
            Write-Json $res @{ ok = $true }
            break
        }

        # 認証失敗シナリオ
        if ($Scenario -eq 'unauthorized') {
            Write-Status $res 401
            continue
        }

        # --- 申請の取得 ---------------------------------------------------
        if ($path -eq '/api/now/table/x_dent2_dentsusoke_request' -and $req.HttpMethod -eq 'GET') {
            if ($Scenario -eq 'empty') {
                Write-Json $res @{ result = @() }
                continue
            }

            # ページングの2ページ目以降は0件を返す
            $offset = 0
            if ($query -match 'sysparm_offset=(\d+)') {
                $offset = [int]$Matches[1]
            }
            if ($offset -gt 0) {
                Write-Json $res @{ result = @() }
                continue
            }

            Write-Json $res @{ result = @(
                    @{ sys_id = 'r1000000000000000000000000000001'; u_application_number = 'APP-2026-00123' },
                    @{ sys_id = 'r1000000000000000000000000000002'; u_application_number = 'APP-2026-00124' },
                    # 申請番号が未採番のレコード（スキップされることの検証用）
                    @{ sys_id = 'r1000000000000000000000000000003'; u_application_number = '' }
                ) }
            continue
        }

        # --- 添付の一覧 ---------------------------------------------------
        if ($path -eq '/api/now/attachment' -and $req.HttpMethod -eq 'GET') {
            $result = @()

            # 1件目の申請にのみ添付を紐づける（2件目は添付なしの検証用）
            if ($query -like '*r1000000000000000000000000000001*') {
                foreach ($id in $attachmentsByScenario[$Scenario]) {
                    $result += @{
                        sys_id     = $id
                        file_name  = $attachments[$id].name
                        size_bytes = "$(Get-ReportedSize -AttachmentId $id)"
                    }
                }
            }

            Write-Json $res @{ result = $result }
            continue
        }

        # --- 添付のダウンロード -------------------------------------------
        if ($path -match '^/api/now/attachment/([^/]+)/file$' -and $req.HttpMethod -eq 'GET') {
            $id = $Matches[1]

            if (-not $attachments.ContainsKey($id)) {
                Write-Status $res 404
                continue
            }

            # 一時的な障害を2回返し、3回目で成功させる
            if ($Scenario -eq 'flaky' -and (Get-FlakyAttempt) -le 2) {
                Write-Status $res 503
                continue
            }

            $bytes = [Text.Encoding]::UTF8.GetBytes($attachments[$id].content)
            $res.ContentType = 'application/octet-stream'
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
            $res.Close()
            continue
        }

        # --- 転送済みフラグの書き戻し -------------------------------------
        if ($path -like '/api/now/table/x_dent2_dentsusoke_request/*' -and $req.HttpMethod -eq 'PATCH') {
            Write-Json $res @{ result = @{ sys_id = 'ok' } }
            continue
        }

        Write-Status $res 404
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
