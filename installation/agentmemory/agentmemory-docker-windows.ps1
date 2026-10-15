#Requires -Version 5.1
<#
.SYNOPSIS
  FinESO agentmemory on Windows (Docker Desktop).

.DESCRIPTION
  Same isolated stack as macOS/Linux: container fineso-agentmemory,
  host ports 3311 (API/MCP) and 3313 (viewer). Does not conflict with other
  compose projects (e.g. x79 on 3111-3113 or baplatform on 3211-3213).

  WSL2: if Cursor runs inside WSL, use ./agentmemory-docker-ubuntu.sh there
  instead of this script.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\agentmemory-docker-windows.ps1 preflight
  powershell -ExecutionPolicy Bypass -File .\agentmemory-docker-windows.ps1 start
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ComposeFile = Join-Path $ScriptDir 'docker-compose.yml'
$DotEnv = Join-Path $ScriptDir '.env'

function Import-DotEnv {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) { return }
  Get-Content -LiteralPath $Path | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq '' -or $line.StartsWith('#')) { return }
    $eq = $line.IndexOf('=')
    if ($eq -lt 1) { return }
    $key = $line.Substring(0, $eq).Trim()
    $val = $line.Substring($eq + 1).Trim().Trim('"').Trim("'")
    if ($key -match '^[A-Za-z_][A-Za-z0-9_]*$') {
      Set-Item -Path "Env:$key" -Value $val
    }
  }
}

Import-DotEnv -Path $DotEnv

function Get-EnvOrDefault([string]$Name, [string]$Default) {
  $v = [Environment]::GetEnvironmentVariable($Name)
  if ([string]::IsNullOrWhiteSpace($v)) { return $Default }
  return $v
}

$Project = Get-EnvOrDefault 'AGENTMEMORY_COMPOSE_PROJECT' 'fineso-agentmemory'
$Container = Get-EnvOrDefault 'AGENTMEMORY_CONTAINER_NAME' 'fineso-agentmemory'
$ApiPort = Get-EnvOrDefault 'AGENTMEMORY_HOST_API_PORT' '3311'
$StreamPort = Get-EnvOrDefault 'AGENTMEMORY_HOST_STREAM_PORT' '3312'
$ViewerPort = Get-EnvOrDefault 'AGENTMEMORY_HOST_VIEWER_PORT' '3313'
$WsPort = Get-EnvOrDefault 'AGENTMEMORY_HOST_WS_PORT' '49334'
$MetricsPort = Get-EnvOrDefault 'AGENTMEMORY_HOST_METRICS_PORT' '9664'

$RepoRoot = (Resolve-Path (Join-Path $ScriptDir '..\..')).Path
$DataDir = Get-EnvOrDefault 'AGENTMEMORY_DATA_DIR' (Join-Path $RepoRoot 'data.agentmemory')

$env:AGENTMEMORY_COMPOSE_PROJECT = $Project
$env:AGENTMEMORY_CONTAINER_NAME = $Container
$env:AGENTMEMORY_HOST_API_PORT = $ApiPort
$env:AGENTMEMORY_HOST_STREAM_PORT = $StreamPort
$env:AGENTMEMORY_HOST_VIEWER_PORT = $ViewerPort
$env:AGENTMEMORY_HOST_WS_PORT = $WsPort
$env:AGENTMEMORY_HOST_METRICS_PORT = $MetricsPort
$env:AGENTMEMORY_DATA_DIR = $DataDir

$ApiUrl = "http://localhost:$ApiPort"
$ViewerUrl = "http://localhost:$ViewerPort"

function Get-Curl {
  $cmd = Get-Command curl.exe -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  return $null
}

function Invoke-Compose {
  param([string[]]$ComposeArgs)
  if (-not (Test-Path -LiteralPath $ComposeFile)) {
    throw "compose file not found: $ComposeFile"
  }
  & docker compose -p $Project -f $ComposeFile @ComposeArgs
  if ($LASTEXITCODE -ne 0) {
    throw "docker compose failed (exit $LASTEXITCODE)"
  }
}

function Test-PortListen([int]$Port) {
  try {
    $hits = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($hits) { return $true }
  } catch { }
  $n = netstat -ano 2>$null | Select-String -Pattern ":$Port\s+.*LISTENING"
  return [bool]$n
}

function Assert-Preflight {
  if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "docker not found — install Docker Desktop for Windows"
  }
  docker info 1>$null 2>$null
  if ($LASTEXITCODE -ne 0) {
    throw "Docker Desktop is not running — start Docker Desktop and retry"
  }
  docker compose version 1>$null 2>$null
  if ($LASTEXITCODE -ne 0) {
    throw "docker compose not available — update Docker Desktop"
  }
  if (-not (Get-Curl)) {
    throw "curl.exe not found — Windows 10+ includes it; check PATH"
  }
  foreach ($port in @([int]$ApiPort, [int]$ViewerPort)) {
    if (Test-PortListen -Port $port) {
      Write-Host "[preflight] WARN: port $port already in use"
    }
  }
}

function Wait-Api {
  $curl = Get-Curl
  for ($i = 1; $i -le 60; $i++) {
    & $curl -sf --max-time 2 "$ApiUrl/agentmemory/livez" 1>$null 2>$null
    if ($LASTEXITCODE -eq 0) { return $true }
    Start-Sleep -Seconds 1
  }
  return $false
}

function Show-Usage {
  @"
Usage:
  .\agentmemory-docker-windows.ps1 start      # build + start + wait for API
  .\agentmemory-docker-windows.ps1 stop       # docker compose down (this project only)
  .\agentmemory-docker-windows.ps1 status     # health + memories + viewer
  .\agentmemory-docker-windows.ps1 logs       # tail container logs
  .\agentmemory-docker-windows.ps1 rebuild    # --no-cache build + restart
  .\agentmemory-docker-windows.ps1 preflight  # check Docker Desktop
  .\agentmemory-docker-windows.ps1 help

Isolation (FinESO vs baplatform / x79):
  project/container  $Project
  API                $ApiUrl
  viewer             $ViewerUrl
  data               $DataDir

If PowerShell blocks the script:
  powershell -ExecutionPolicy Bypass -File .\agentmemory-docker-windows.ps1 start
"@
}

function Start-Stack {
  Assert-Preflight
  New-Item -ItemType Directory -Force -Path (Join-Path $DataDir 'stream_store') | Out-Null
  Write-Host "[docker] Project:     $Project"
  Write-Host "[docker] Container:   $Container"
  Write-Host "[docker] Data folder: $DataDir"
  Write-Host "[docker] Compose file: $ComposeFile"
  Write-Host "[docker] Host ports:  API $ApiPort  viewer $ViewerPort  streams $StreamPort  ws $WsPort  metrics $MetricsPort"
  Write-Host "[docker] Building & starting agentmemory container..."
  Write-Host "  (first build takes ~2-3m — npm install in node:22-slim)"
  Invoke-Compose @('up', '-d', '--build')
  Write-Host "[start] Waiting for API... (up to 60s)"
  if (Wait-Api) {
    Write-Host "[start] agentmemory API ready at $ApiUrl"
  } else {
    Write-Host "[start] WARN: API not ready after 60s — check logs"
  }
  Write-Host "[start] Done."
  Write-Host ""
  Write-Host "  Cursor: AGENTMEMORY_URL=$ApiUrl  viewer=$ViewerUrl"
  Write-Host "  MCP configured in .cursor/mcp.json or .cursor/mcp-windows.json"
  Start-Process "$ViewerUrl/#memories"
}

function Stop-Stack {
  Write-Host "[docker] Stopping $Project stack (does not touch other projects)..."
  Invoke-Compose @('down')
  Write-Host "[stop] Stopped $Container."
}

function Rebuild-Stack {
  Assert-Preflight
  Write-Host "[rebuild] Rebuilding image from scratch..."
  Invoke-Compose @('build', '--no-cache')
  Write-Host "[rebuild] Restarting stack..."
  Invoke-Compose @('up', '-d')
  Write-Host "[rebuild] Done."
}

function Show-Status {
  Write-Host "=== Platform ==="
  Write-Host "wrapper: .\agentmemory-docker-windows.ps1"
  Write-Host "target:  windows"
  Write-Host "project: $Project"
  Write-Host ""
  Write-Host "=== Data ==="
  Write-Host "folder: $DataDir"
  Write-Host ""
  Write-Host "=== Docker container ==="
  docker ps --filter "name=$Container" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
  Write-Host ""
  $curl = Get-Curl
  Write-Host "=== API ($ApiUrl) ==="
  & $curl -sf --max-time 5 "$ApiUrl/agentmemory/livez" 1>$null 2>$null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "  ok"
    $raw = & $curl -sf --max-time 5 "$ApiUrl/agentmemory/memories" 2>$null
    try {
      $parsed = $raw | ConvertFrom-Json
      $count = @($parsed.memories).Count
      Write-Host "  memories: $count"
    } catch {
      Write-Host "  memories: ?"
    }
  } else {
    Write-Host "  not reachable"
  }
  Write-Host ""
  Write-Host "=== Viewer ($ViewerUrl) ==="
  & $curl -sf --max-time 2 "$ViewerUrl/" 1>$null 2>$null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "  running"
  } else {
    Write-Host "  not running (check container logs)"
  }
}

function Show-Logs {
  if (-not (Test-Path -LiteralPath $ComposeFile)) {
    throw "compose file not found: $ComposeFile"
  }
  docker compose -p $Project -f $ComposeFile logs --tail=40
  Write-Host ""
  Write-Host "--- Tail live: docker compose -p $Project -f $ComposeFile logs -f"
}

$cmd = 'start'
if ($args.Count -ge 1 -and -not [string]::IsNullOrWhiteSpace($args[0])) {
  $cmd = [string]$args[0]
}

switch ($cmd.ToLowerInvariant()) {
  'start' { Start-Stack }
  'stop' { Stop-Stack }
  'status' { Show-Status }
  'logs' { Show-Logs }
  'rebuild' { Rebuild-Stack }
  'preflight' {
    Assert-Preflight
    Write-Host "[preflight] OK — Docker ready for $Project."
  }
  { $_ -in @('help', '-h', '--help', '/?') } { Show-Usage }
  default {
    Show-Usage
    throw "unknown command: $cmd"
  }
}
