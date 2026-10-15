#!/usr/bin/env bash
# agentmemory-docker-macos.sh — V3 agentmemory on macOS (Docker Desktop)
#
# Architecture:
#   Docker  → fineso-agentmemory (III engine + worker + viewer, all in one)
#   Host    → MCP shim (npx @agentmemory/mcp → http://localhost:3311)
#
# Isolation:
#   Container name: fineso-agentmemory
#   API: http://localhost:3311
#   Viewer: http://localhost:3313
#
# Usage:
#   ./agentmemory-docker-macos.sh start      # build + start + wait for API
#   ./agentmemory-docker-macos.sh stop       # docker compose down
#   ./agentmemory-docker-macos.sh status     # health + memories + viewer
#   ./agentmemory-docker-macos.sh logs       # tail container logs
#   ./agentmemory-docker-macos.sh rebuild    # --no-cache build + restart

set -euo pipefail

AGENTMEMORY_PLATFORM="macos"
AGENTMEMORY_WRAPPER_NAME="./agentmemory-docker-macos.sh"

# shellcheck source=_agentmemory-docker-common.sh
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_agentmemory-docker-common.sh"

agentmemory_preflight() {
  command -v docker >/dev/null 2>&1 || die "docker not found (install Docker Desktop)"

  if ! docker info >/dev/null 2>&1; then
    die "Docker Desktop is not running — start Docker Desktop and retry"
  fi

  if ! docker compose version >/dev/null 2>&1; then
    die "docker compose not available — update Docker Desktop"
  fi

  command -v curl >/dev/null 2>&1 || die "curl not found"
  command -v python3 >/dev/null 2>&1 || die "python3 not found"
}

agentmemory_main "$@"
