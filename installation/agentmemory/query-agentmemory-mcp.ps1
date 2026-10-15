#Requires -Version 5.1
<#
.SYNOPSIS
  Query FinESO agentmemory via MCP shim (Windows).

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\query-agentmemory-mcp.ps1 sessions
  powershell -ExecutionPolicy Bypass -File .\query-agentmemory-mcp.ps1 smart-search "variance analysis"
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Method = if ($args.Count -ge 1) { [string]$args[0] } else { 'sessions' }
$Query = if ($args.Count -ge 2) { [string]$args[1] } else { '' }
$ApiUrl = if ($env:AGENTMEMORY_URL) { $env:AGENTMEMORY_URL } else { 'http://localhost:3311' }

$npx = Get-Command npx.cmd -ErrorAction SilentlyContinue
if (-not $npx) { $npx = Get-Command npx -ErrorAction SilentlyContinue }
if (-not $npx) { throw "npx not found — install Node.js LTS, then retry" }

switch ($Method) {
  { $_ -in @('smart-search', 'recall') } {
    if ([string]::IsNullOrWhiteSpace($Query)) {
      Write-Host "Usage: .\query-agentmemory-mcp.ps1 $Method <query>"
      exit 1
    }
    $escaped = $Query.Replace('\', '\\').Replace('"', '\"')
    $req = @"
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"memory_$Method","arguments":{"query":"$escaped","limit":5}}}
"@
  }
  'sessions' {
    $req = '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"memory_sessions","arguments":{}}}'
  }
  default {
    Write-Host "Usage: .\query-agentmemory-mcp.ps1 <smart-search|recall|sessions> [query]"
    exit 1
  }
}

$tmp = [System.IO.Path]::GetTempFileName()
try {
  $env:AGENTMEMORY_URL = $ApiUrl
  $req | & $npx.Source -y '@agentmemory/mcp' 1>$tmp 2>$null
  $data = Get-Content -LiteralPath $tmp -Raw | ConvertFrom-Json
  $text = $data.result.content[0].text
  $inner = $text | ConvertFrom-Json
  if ($inner.results) {
    $i = 1
    foreach ($r in @($inner.results) | Select-Object -First 5) {
      $cid = ([string]$r.id)
      if ($cid.Length -gt 16) { $cid = $cid.Substring(0, 16) }
      $content = [string]($(if ($r.content) { $r.content } elseif ($r.summary) { $r.summary } else { '' }))
      if ($content.Length -gt 200) { $content = $content.Substring(0, 200) }
      Write-Host "$i. [$cid] $content"
      Write-Host ""
      $i++
    }
  } elseif ($inner.sessions) {
    $i = 1
    $list = if ($inner.sessions) { $inner.sessions } else { $inner.items }
    foreach ($s in @($list) | Select-Object -First 5) {
      $sid = ([string]$s.id)
      if ($sid.Length -gt 12) { $sid = $sid.Substring(0, 12) }
      $st = if ($s.status) { $s.status } else { '?' }
      $ob = if ($s.observationCount) { $s.observationCount } elseif ($s.count) { $s.count } else { '?' }
      Write-Host "$i. [$sid] $st ($ob obs)"
      $i++
    }
  } else {
    $inner | ConvertTo-Json -Depth 6 | Select-Object -First 1
  }
} catch {
  Write-Host "(no results)"
} finally {
  Remove-Item -LiteralPath $tmp -ErrorAction SilentlyContinue
}
