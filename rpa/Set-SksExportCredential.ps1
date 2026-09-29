<#
.SYNOPSIS
    添付エクスポート用の ServiceNow 接続資格情報を暗号化して保存する（初回セットアップ用）。

.DESCRIPTION
    Export-SksAttachments.ps1 が使う資格情報ファイルを作成する。
    パスワードは Windows の DPAPI で暗号化されるため、次の条件を満たさないと復号できない。

      ・暗号化したのと同じ Windows ユーザ
      ・暗号化したのと同じマシン

    したがって本スクリプトは「RPA を実行するサービスアカウントで」「RPA を実行するマシン上で」
    実行する必要がある。管理者の個人アカウントで作成したファイルはサービスアカウントから読めない。

    資格情報をスクリプトや設定ファイルへ平文で書かないための仕組みであり、
    引数でパスワードを受け取らないのは意図的である（コマンド履歴に残さないため）。

.PARAMETER ConfigPath
    設定ファイルのパス。credentialPath の値を保存先として使用する。

.EXAMPLE
    # サービスアカウントでログオンして実行する
    .\Set-SksExportCredential.ps1 -ConfigPath .\config\export-config.json

.NOTES
    ServiceNow 側は専用の連携用アカウントを用意し、必要最小限のロールのみ付与する。
    必要な権限は「対象テーブルの read」と「sys_attachment の read」であり、
    書き戻し（writeBackField）を使う場合のみ対象テーブルの write を追加する。
    admin や事務局ロールを付与してはならない（トンマナ 2.1.1 最小権限の原則）。
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $ConfigPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $ConfigPath)) {
    throw "設定ファイルが見つかりません: $ConfigPath"
}

$config = Get-Content -LiteralPath $ConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json

if ([string]::IsNullOrWhiteSpace($config.credentialPath)) {
    throw '設定ファイルに credentialPath が指定されていません。'
}

$credentialDir = Split-Path -Parent $config.credentialPath
if (-not (Test-Path -LiteralPath $credentialDir)) {
    New-Item -ItemType Directory -Force -Path $credentialDir | Out-Null
}

Write-Host ''
Write-Host "インスタンス : $($config.instanceUrl)"
Write-Host "保存先       : $($config.credentialPath)"
Write-Host "実行ユーザ   : $($env:USERDOMAIN)\$($env:USERNAME)"
Write-Host "マシン       : $($env:COMPUTERNAME)"
Write-Host ''
Write-Host 'このユーザ・このマシンでのみ復号できるファイルを作成します。' -ForegroundColor Yellow
Write-Host 'RPA を実行するサービスアカウントで実行していることを確認してください。' -ForegroundColor Yellow
Write-Host ''

# Get-Credential は対話的にパスワードを受け取り、コマンド履歴に残さない
$credential = Get-Credential -Message 'ServiceNow 連携用アカウントのユーザ名とパスワードを入力してください'

if ($null -eq $credential) {
    throw '資格情報の入力がキャンセルされました。'
}

# Export-Clixml は SecureString を DPAPI で暗号化して書き出す
$credential | Export-Clixml -LiteralPath $config.credentialPath

# 作成したユーザ以外が読めないよう ACL を絞る（DPAPI で復号できないとはいえ、不要な公開を避ける）
$acl = Get-Acl -LiteralPath $config.credentialPath
$acl.SetAccessRuleProtection($true, $false)
$acl.Access | ForEach-Object { $acl.RemoveAccessRule($_) | Out-Null }
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "$($env:USERDOMAIN)\$($env:USERNAME)", 'FullControl', 'Allow')
$acl.AddAccessRule($rule)
Set-Acl -LiteralPath $config.credentialPath -AclObject $acl

Write-Host ''
Write-Host "資格情報を保存しました: $($config.credentialPath)" -ForegroundColor Green
Write-Host ''
Write-Host '接続確認を行うには次を実行してください。'
Write-Host "  .\Export-SksAttachments.ps1 -ConfigPath $ConfigPath -DryRun"
Write-Host ''
