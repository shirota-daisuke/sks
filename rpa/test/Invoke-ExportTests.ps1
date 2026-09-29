<#
.SYNOPSIS
    Export-SksAttachments.ps1 の自動テスト。モックサーバに対して13件のシナリオを検証する。

.DESCRIPTION
    転送処理の検証は実インスタンスでは成立しない。
    申請の添付と申請審査完了への遷移が未実装であるうえ
    （いずれも申請機能＝ITCOM 主担当の範囲）、
    サイズ不一致・5xx・401 といった異常系は実インスタンスでは意図的に起こせない。

    そのため Mock-ServiceNow.ps1 を相手に、終了コードとファイルシステムの状態を検証する。

    検証する観点
      ・異常系で正しい終了コードを返し、処理を進めないこと
      ・二重転送しないこと（冪等性）
      ・ファイル名のサニタイズ
      ・ポリシー違反を恒久的な拒否として扱い、繰り返しアラームを上げないこと
      ・完全性の検証で不正なファイルを共有フォルダへ置かないこと
      ・一時的な障害をリトライで回復すること
      ・機微情報をステージングへ残さないこと

.PARAMETER WorkRoot
    テスト用の作業ディレクトリの親。既定は %TEMP%\sks-rpa-test。
    実行ごとに日時付きのサブディレクトリを作成するため、既存の結果は上書きしない。
    不要になったら手動で削除する（誤削除を避けるため本スクリプトは削除しない）。

.PARAMETER BasePort
    モックサーバの待ち受けポートの起点。テストごとに +1 して使用する。

.OUTPUTS
    終了コード 0（全件成功）／1（失敗あり）

.EXAMPLE
    .\Invoke-ExportTests.ps1

.EXAMPLE
    .\Invoke-ExportTests.ps1 -WorkRoot D:\Temp\sks -BasePort 18200
#>
[CmdletBinding()]
param(
    [string] $WorkRoot = (Join-Path $env:TEMP 'sks-rpa-test'),
    [int] $BasePort = 18100
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$exportScript = Join-Path (Split-Path -Parent $scriptDir) 'Export-SksAttachments.ps1'
$mockScript = Join-Path $scriptDir 'Mock-ServiceNow.ps1'
$sampleConfig = Join-Path (Split-Path -Parent $scriptDir) 'config\export-config.sample.json'

foreach ($required in @($exportScript, $mockScript, $sampleConfig)) {
    if (-not (Test-Path -LiteralPath $required)) {
        throw "必要なファイルが見つかりません: $required"
    }
}

$runRoot = Join-Path $WorkRoot ((Get-Date).ToString('yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Force -Path $runRoot | Out-Null

$script:Results = @()
$script:PortOffset = 0

# ---------------------------------------------------------------------------
# ヘルパ
# ---------------------------------------------------------------------------

function Add-Result {
    param(
        [string] $TestId,
        [string] $Name,
        [bool] $Passed,
        [string] $Detail
    )

    $script:Results += [PSCustomObject]@{
        TestId = $TestId
        Name   = $Name
        Passed = $Passed
        Detail = $Detail
    }

    if ($Passed) {
        Write-Host ("  PASS  {0} {1}" -f $TestId, $Name) -ForegroundColor Green
    } else {
        Write-Host ("  FAIL  {0} {1}" -f $TestId, $Name) -ForegroundColor Red
        Write-Host ("        {0}" -f $Detail) -ForegroundColor Red
    }
}

<# 期待値と実際値を比較して結果を記録する #>
function Assert-Value {
    param(
        [string] $TestId,
        [string] $Name,
        $Expected,
        $Actual
    )

    $passed = ("$Expected" -eq "$Actual")
    Add-Result -TestId $TestId -Name $Name -Passed $passed -Detail "期待=$Expected / 実際=$Actual"
}

<# テストごとの作業ディレクトリと設定ファイルを用意する #>
function New-TestCase {
    param(
        [string] $TestId,
        [string] $InstanceUrl,
        [switch] $SkipCredential,
        [switch] $SkipShare
    )

    $dir = Join-Path $runRoot $TestId
    New-Item -ItemType Directory -Force -Path @(
        (Join-Path $dir 'staging'),
        (Join-Path $dir 'ledger'),
        (Join-Path $dir 'logs'),
        (Join-Path $dir 'state')
    ) | Out-Null

    $sharePath = Join-Path $dir 'share'
    if (-not $SkipShare) {
        New-Item -ItemType Directory -Force -Path $sharePath | Out-Null
    }

    $credentialPath = Join-Path $dir 'servicenow.cred.xml'
    if (-not $SkipCredential) {
        # DPAPI で暗号化される。テスト実行ユーザで作成し同一プロセス群から読むため復号できる
        $secure = ConvertTo-SecureString 'dummy-password' -AsPlainText -Force
        $credential = New-Object System.Management.Automation.PSCredential('svc.sks.export', $secure)
        $credential | Export-Clixml -LiteralPath $credentialPath
    }

    $config = Get-Content -LiteralPath $sampleConfig -Raw -Encoding UTF8 | ConvertFrom-Json
    $config.instanceUrl = $InstanceUrl
    $config.credentialPath = $credentialPath
    $config.shareRoot = $sharePath
    $config.stagingDir = Join-Path $dir 'staging'
    $config.ledgerPath = Join-Path $dir 'ledger\exported.json'
    $config.logDir = Join-Path $dir 'logs'
    $config.writeBackField = 'u_file_export_state'

    $configPath = Join-Path $dir 'config.json'
    $config | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $configPath -Encoding UTF8

    return [PSCustomObject]@{
        Dir        = $dir
        ConfigPath = $configPath
        SharePath  = $sharePath
        StagingDir = Join-Path $dir 'staging'
        LedgerPath = Join-Path $dir 'ledger\exported.json'
        LogDir     = Join-Path $dir 'logs'
        StateDir   = Join-Path $dir 'state'
    }
}

<# モックサーバを起動し、応答するまで待つ #>
function Start-Mock {
    param(
        [string] $Scenario,
        [string] $StateDir
    )

    $script:PortOffset++
    $port = $BasePort + $script:PortOffset

    Start-Process -FilePath 'powershell.exe' -ArgumentList @(
        '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $mockScript,
        '-Port', $port, '-StateDir', $StateDir, '-Scenario', $Scenario
    ) -RedirectStandardOutput (Join-Path $StateDir 'mock.out') `
        -RedirectStandardError (Join-Path $StateDir 'mock.err') `
        -WindowStyle Hidden | Out-Null

    # 起動待ち。応答があるまで最大15秒
    $deadline = (Get-Date).AddSeconds(15)
    while ((Get-Date) -lt $deadline) {
        try {
            Invoke-WebRequest -Uri "http://localhost:$port/api/now/attachment" `
                -UseBasicParsing -TimeoutSec 3 | Out-Null
            return $port
        } catch {
            # 401 でも応答していれば起動済み（unauthorized シナリオ）
            if ($_.Exception.PSObject.Properties.Name.Contains('Response') -and $_.Exception.Response) {
                return $port
            }
            Start-Sleep -Milliseconds 400
        }
    }

    $err = ''
    $errPath = Join-Path $StateDir 'mock.err'
    if (Test-Path -LiteralPath $errPath) {
        $err = (Get-Content -LiteralPath $errPath -Raw)
    }
    throw "モックサーバが起動しませんでした（port=$port）。`n$err"
}

function Stop-Mock {
    param([int] $Port)

    try {
        Invoke-WebRequest -Uri "http://localhost:$Port/shutdown" -UseBasicParsing -TimeoutSec 5 | Out-Null
    } catch {
        # 停止要求の応答は受け取れない場合がある（サーバが先に終了するため）
    }
}

<# 転送処理を実行し、終了コードと標準出力を返す #>
function Invoke-Export {
    param(
        [string] $ConfigPath,
        [switch] $DryRun,
        [string] $Since
    )

    $args = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $exportScript, '-ConfigPath', $ConfigPath)
    if ($DryRun) {
        $args += '-DryRun'
    }
    if ($Since) {
        $args += @('-Since', $Since)
    }

    $output = & powershell.exe $args 2>&1
    return [PSCustomObject]@{
        ExitCode = $LASTEXITCODE
        Output   = ($output -join "`n")
    }
}

function Get-ShareFileCount {
    param([string] $SharePath)

    if (-not (Test-Path -LiteralPath $SharePath)) {
        return 0
    }
    return @(Get-ChildItem -LiteralPath $SharePath -Recurse -File).Count
}

# PowerShell は return で配列を展開するため、0件のとき戻り値は $null になる。
# 呼び出し側で $null.Count に触れると Set-StrictMode 配下で例外になるので、
# 各ヘルパは `,` 演算子で包んで配列のまま返す（検証対象の本体と同じ落とし穴）。
function Get-ShareFileNames {
    param([string] $SharePath)

    if (-not (Test-Path -LiteralPath $SharePath)) {
        return , @()
    }
    return , @(Get-ChildItem -LiteralPath $SharePath -Recurse -File | ForEach-Object { $_.Name } | Sort-Object)
}

function Get-LedgerEntries {
    param([string] $LedgerPath)

    if (-not (Test-Path -LiteralPath $LedgerPath)) {
        return , @()
    }
    $raw = Get-Content -LiteralPath $LedgerPath -Raw -Encoding UTF8
    if ([string]::IsNullOrWhiteSpace($raw)) {
        return , @()
    }

    # ConvertFrom-Json は配列を列挙せず1オブジェクトとして返す。
    # そのため @(ConvertFrom-Json ...) と書くと「配列を1件含む配列」になり件数が常に1になる。
    # いったん変数へ受けてから @() で包むと、変数が保持する配列が正しく展開される。
    $parsed = ConvertFrom-Json $raw
    if ($null -eq $parsed) {
        return , @()
    }
    return , @($parsed)
}

function Get-LogText {
    param([string] $LogDir)

    $files = @(Get-ChildItem -LiteralPath $LogDir -Filter 'export-*.log' -File -ErrorAction SilentlyContinue)
    if ($files.Count -eq 0) {
        return ''
    }
    return (($files | ForEach-Object { Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8 }) -join "`n")
}

# ---------------------------------------------------------------------------
# テスト
# ---------------------------------------------------------------------------

Write-Host ''
Write-Host "作業ディレクトリ: $runRoot"
Write-Host ''

# --- T01 設定ファイルが存在しない ------------------------------------------
Write-Host 'T01 設定ファイルが存在しない'
$case = New-TestCase -TestId 'T01' -InstanceUrl 'http://localhost:1'
$result = Invoke-Export -ConfigPath (Join-Path $case.Dir 'not-exist.json')
Assert-Value -TestId 'T01' -Name '終了コードは2（致命的エラー）' -Expected 2 -Actual $result.ExitCode

# --- T02 資格情報ファイルが存在しない --------------------------------------
Write-Host 'T02 資格情報ファイルが存在しない'
$case = New-TestCase -TestId 'T02' -InstanceUrl 'http://localhost:1' -SkipCredential
$result = Invoke-Export -ConfigPath $case.ConfigPath
Assert-Value -TestId 'T02' -Name '終了コードは2' -Expected 2 -Actual $result.ExitCode
Add-Result -TestId 'T02' -Name 'セットアップ手順を案内する' `
    -Passed ($result.Output -like '*Set-SksExportCredential*') -Detail $result.Output

# --- T03 共有フォルダへ到達できない ----------------------------------------
Write-Host 'T03 共有フォルダへ到達できない'
$case = New-TestCase -TestId 'T03' -InstanceUrl 'http://localhost:1' -SkipShare
$result = Invoke-Export -ConfigPath $case.ConfigPath
Assert-Value -TestId 'T03' -Name '終了コードは2' -Expected 2 -Actual $result.ExitCode
Add-Result -TestId 'T03' -Name '共有フォルダ到達不可を検出する（API 呼び出し前に落ちる）' `
    -Passed ($result.Output -like '*共有フォルダへ到達できません*') -Detail $result.Output

# --- T04 認証失敗（401 はリトライしない）-----------------------------------
Write-Host 'T04 認証失敗（401）'
$case = New-TestCase -TestId 'T04' -InstanceUrl 'http://localhost:0'
$port = Start-Mock -Scenario 'unauthorized' -StateDir $case.StateDir
(Get-Content -LiteralPath $case.ConfigPath -Raw -Encoding UTF8).Replace('http://localhost:0', "http://localhost:$port") |
    Set-Content -LiteralPath $case.ConfigPath -Encoding UTF8
$result = Invoke-Export -ConfigPath $case.ConfigPath
Stop-Mock -Port $port
Assert-Value -TestId 'T04' -Name '終了コードは2' -Expected 2 -Actual $result.ExitCode
Add-Result -TestId 'T04' -Name 'ロール確認を案内する' `
    -Passed ($result.Output -like '*ロールを確認*') -Detail $result.Output
Add-Result -TestId 'T04' -Name '401 では再試行しない' `
    -Passed (-not ((Get-LogText -LogDir $case.LogDir) -like '*再試行します*')) -Detail 'ログに再試行の記録がないこと'

# --- T05 対象0件 -----------------------------------------------------------
Write-Host 'T05 対象の申請が0件'
$case = New-TestCase -TestId 'T05' -InstanceUrl 'http://localhost:0'
$port = Start-Mock -Scenario 'empty' -StateDir $case.StateDir
(Get-Content -LiteralPath $case.ConfigPath -Raw -Encoding UTF8).Replace('http://localhost:0', "http://localhost:$port") |
    Set-Content -LiteralPath $case.ConfigPath -Encoding UTF8
$result = Invoke-Export -ConfigPath $case.ConfigPath
Stop-Mock -Port $port
Assert-Value -TestId 'T05' -Name '終了コードは0（対象0件は正常）' -Expected 0 -Actual $result.ExitCode
Assert-Value -TestId 'T05' -Name '共有フォルダへ何も置かない' -Expected 0 -Actual (Get-ShareFileCount -SharePath $case.SharePath)

# --- T06〜T09 正常系（同一ケースで段階的に検証）----------------------------
Write-Host 'T06 DryRun では配置しない'
$case = New-TestCase -TestId 'T06' -InstanceUrl 'http://localhost:0'
$port = Start-Mock -Scenario 'normal' -StateDir $case.StateDir
(Get-Content -LiteralPath $case.ConfigPath -Raw -Encoding UTF8).Replace('http://localhost:0', "http://localhost:$port") |
    Set-Content -LiteralPath $case.ConfigPath -Encoding UTF8

$result = Invoke-Export -ConfigPath $case.ConfigPath -DryRun
Assert-Value -TestId 'T06' -Name '終了コードは0' -Expected 0 -Actual $result.ExitCode
Assert-Value -TestId 'T06' -Name '共有フォルダへ何も置かない' -Expected 0 -Actual (Get-ShareFileCount -SharePath $case.SharePath)
Assert-Value -TestId 'T06' -Name '台帳を作成しない' -Expected 0 -Actual (Get-LedgerEntries -LedgerPath $case.LedgerPath).Count
Add-Result -TestId 'T06' -Name '転送対象の件数を出力する' `
    -Passed ($result.Output -like '*転送=3*') -Detail $result.Output

Write-Host 'T07 正常系（初回転送とファイル名のサニタイズ）'
$result = Invoke-Export -ConfigPath $case.ConfigPath
Assert-Value -TestId 'T07' -Name '終了コードは0' -Expected 0 -Actual $result.ExitCode
Assert-Value -TestId 'T07' -Name '3件配置される' -Expected 3 -Actual (Get-ShareFileCount -SharePath $case.SharePath)
Assert-Value -TestId 'T07' -Name '台帳へ3件記録される' -Expected 3 -Actual (Get-LedgerEntries -LedgerPath $case.LedgerPath).Count

$names = Get-ShareFileNames -SharePath $case.SharePath
Add-Result -TestId 'T07' -Name '日本語のファイル名を保持する' `
    -Passed ($names -contains '決算書_2025年度.pdf') -Detail ($names -join ', ')
Add-Result -TestId 'T07' -Name '予約デバイス名に接頭辞を付ける（CON.pdf → _CON.pdf）' `
    -Passed ($names -contains '_CON.pdf') -Detail ($names -join ', ')
Add-Result -TestId 'T07' -Name '使用できない文字を置換する（bad<name>:file.pdf → bad_name__file.pdf）' `
    -Passed ($names -contains 'bad_name__file.pdf') -Detail ($names -join ', ')
Assert-Value -TestId 'T07' -Name 'ステージングに残留しない' -Expected 0 `
    -Actual @(Get-ChildItem -LiteralPath $case.StagingDir -Recurse -File).Count
Add-Result -TestId 'T07' -Name '申請番号のフォルダへ配置する' `
    -Passed (Test-Path -LiteralPath (Join-Path $case.SharePath 'APP-2026-00123')) -Detail $case.SharePath
Add-Result -TestId 'T07' -Name '申請番号が未採番のレコードをスキップする' `
    -Passed ((Get-LogText -LogDir $case.LogDir) -like '*申請番号が未設定*') -Detail 'ログに WARN があること'
Add-Result -TestId 'T07' -Name 'ハッシュを台帳へ記録する' `
    -Passed (((Get-LedgerEntries -LedgerPath $case.LedgerPath)[0]).sha256.Length -eq 64) -Detail 'SHA-256 は64桁'

Write-Host 'T08 冪等性（再実行で二重転送しない）'
$result = Invoke-Export -ConfigPath $case.ConfigPath
Assert-Value -TestId 'T08' -Name '終了コードは0' -Expected 0 -Actual $result.ExitCode
Assert-Value -TestId 'T08' -Name 'ファイル数が増えない' -Expected 3 -Actual (Get-ShareFileCount -SharePath $case.SharePath)
Add-Result -TestId 'T08' -Name '転送0件・対象外3件になる' `
    -Passed ($result.Output -like '*転送=0*' -and $result.Output -like '*対象外=3*') -Detail $result.Output

Write-Host 'T09 同名ファイルの退避（上書きしない）'
# 台帳を失った状況を再現する。全件が未転送と判定され再転送される
Remove-Item -LiteralPath $case.LedgerPath -Force
$result = Invoke-Export -ConfigPath $case.ConfigPath
Stop-Mock -Port $port
Assert-Value -TestId 'T09' -Name '終了コードは0' -Expected 0 -Actual $result.ExitCode
Assert-Value -TestId 'T09' -Name '上書きせず6件になる' -Expected 6 -Actual (Get-ShareFileCount -SharePath $case.SharePath)
$names = Get-ShareFileNames -SharePath $case.SharePath
Add-Result -TestId 'T09' -Name '連番を付けて退避する（(2) 付き）' `
    -Passed ($names -contains '_CON(2).pdf') -Detail ($names -join ', ')

# --- T10／T11 ポリシー違反 -------------------------------------------------
Write-Host 'T10 ポリシー違反の検出（拡張子・サイズ上限）'
$case = New-TestCase -TestId 'T10' -InstanceUrl 'http://localhost:0'
$port = Start-Mock -Scenario 'policy' -StateDir $case.StateDir
(Get-Content -LiteralPath $case.ConfigPath -Raw -Encoding UTF8).Replace('http://localhost:0', "http://localhost:$port") |
    Set-Content -LiteralPath $case.ConfigPath -Encoding UTF8

$result = Invoke-Export -ConfigPath $case.ConfigPath
Assert-Value -TestId 'T10' -Name '終了コードは3（要確認）' -Expected 3 -Actual $result.ExitCode
Assert-Value -TestId 'T10' -Name '正常な3件のみ配置される' -Expected 3 -Actual (Get-ShareFileCount -SharePath $case.SharePath)
$names = Get-ShareFileNames -SharePath $case.SharePath
Add-Result -TestId 'T10' -Name '実行可能形式を配置しない' -Passed (-not ($names -contains 'malware.exe')) -Detail ($names -join ', ')
Add-Result -TestId 'T10' -Name 'サイズ上限超過を配置しない' -Passed (-not ($names -contains 'huge.pdf')) -Detail ($names -join ', ')

$rejected = @((Get-LedgerEntries -LedgerPath $case.LedgerPath) | Where-Object { $_.status -eq 'rejected' })
Assert-Value -TestId 'T10' -Name '台帳へ rejected として2件記録する' -Expected 2 -Actual $rejected.Count
Add-Result -TestId 'T10' -Name '拒否の理由を記録する' `
    -Passed (@($rejected | Where-Object { $_.reason -like '*拡張子*' }).Count -eq 1) `
    -Detail (($rejected | ForEach-Object { $_.reason }) -join ' / ')

Write-Host 'T11 ポリシー違反は再検出しない（アラームを繰り返さない）'
$result = Invoke-Export -ConfigPath $case.ConfigPath
Stop-Mock -Port $port
Assert-Value -TestId 'T11' -Name '終了コードは0に戻る' -Expected 0 -Actual $result.ExitCode
Add-Result -TestId 'T11' -Name '要確認が0件になる' -Passed ($result.Output -like '*要確認=0*') -Detail $result.Output

# --- T12 完全性の検証 ------------------------------------------------------
Write-Host 'T12 サイズ不一致の検出'
$case = New-TestCase -TestId 'T12' -InstanceUrl 'http://localhost:0'
$port = Start-Mock -Scenario 'sizemismatch' -StateDir $case.StateDir
(Get-Content -LiteralPath $case.ConfigPath -Raw -Encoding UTF8).Replace('http://localhost:0', "http://localhost:$port") |
    Set-Content -LiteralPath $case.ConfigPath -Encoding UTF8

$result = Invoke-Export -ConfigPath $case.ConfigPath
Stop-Mock -Port $port
Assert-Value -TestId 'T12' -Name '終了コードは1（一時的な失敗）' -Expected 1 -Actual $result.ExitCode
Assert-Value -TestId 'T12' -Name '共有フォルダへ置かない' -Expected 0 -Actual (Get-ShareFileCount -SharePath $case.SharePath)
Assert-Value -TestId 'T12' -Name '台帳へ記録しない（再実行で再試行される）' -Expected 0 `
    -Actual (Get-LedgerEntries -LedgerPath $case.LedgerPath).Count
Assert-Value -TestId 'T12' -Name 'ステージングに機微情報を残さない' -Expected 0 `
    -Actual @(Get-ChildItem -LiteralPath $case.StagingDir -Recurse -File).Count
Add-Result -TestId 'T12' -Name 'サイズ不一致をログに残す' `
    -Passed ((Get-LogText -LogDir $case.LogDir) -like '*サイズが一致しません*') -Detail 'ログに ERROR があること'

# --- T13 リトライ ----------------------------------------------------------
Write-Host 'T13 一時的な障害からのリトライ回復'
$case = New-TestCase -TestId 'T13' -InstanceUrl 'http://localhost:0'
$port = Start-Mock -Scenario 'flaky' -StateDir $case.StateDir
(Get-Content -LiteralPath $case.ConfigPath -Raw -Encoding UTF8).Replace('http://localhost:0', "http://localhost:$port") |
    Set-Content -LiteralPath $case.ConfigPath -Encoding UTF8

$result = Invoke-Export -ConfigPath $case.ConfigPath
Stop-Mock -Port $port
Assert-Value -TestId 'T13' -Name '終了コードは0（リトライで回復）' -Expected 0 -Actual $result.ExitCode
Assert-Value -TestId 'T13' -Name '1件配置される' -Expected 1 -Actual (Get-ShareFileCount -SharePath $case.SharePath)
Add-Result -TestId 'T13' -Name '再試行をログに残す' `
    -Passed ((Get-LogText -LogDir $case.LogDir) -like '*再試行します*') -Detail 'ログに WARN があること'

# ---------------------------------------------------------------------------
# 結果
# ---------------------------------------------------------------------------

$passed = @($script:Results | Where-Object { $_.Passed }).Count
$failed = @($script:Results | Where-Object { -not $_.Passed }).Count

Write-Host ''
Write-Host '======================================================'
Write-Host ("検証結果: 成功 {0} 件 / 失敗 {1} 件" -f $passed, $failed)
Write-Host '======================================================'

if ($failed -gt 0) {
    Write-Host ''
    Write-Host '失敗した検証:' -ForegroundColor Red
    $script:Results | Where-Object { -not $_.Passed } | ForEach-Object {
        Write-Host ("  {0} {1}" -f $_.TestId, $_.Name) -ForegroundColor Red
        Write-Host ("    {0}" -f $_.Detail) -ForegroundColor Red
    }
}

Write-Host ''
Write-Host "ログ・配置結果は $runRoot 配下に残しています。"
Write-Host ''

if ($failed -gt 0) {
    exit 1
}
exit 0
