#!/usr/bin/env bash
# agentmemory-docker-ubuntu.sh — V3 agentmemory on Ubuntu (Docker Engine)
#
# Target: Ubuntu 22.04+ / 24.04 / 26.04 with docker.io or Docker CE + compose plugin.
# Same container stack as macOS (docker-compose.yml + Dockerfile) — only host checks differ.
#
# Usage:
#   ./agentmemory-docker-ubuntu.sh preflight   # verify host before first deploy
#   ./agentmemory-docker-ubuntu.sh start
#   ./agentmemory-docker-ubuntu.sh status
#   ./agentmemory-docker-ubuntu.sh stop
#   ./agentmemory-docker-ubuntu.sh logs
#   ./agentmemory-docker-ubuntu.sh rebuild

set -euo pipefail

_UBUNTU_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENTMEMORY_PLATFORM="ubuntu"
AGENTMEMORY_WRAPPER_NAME="./agentmemory-docker-ubuntu.sh"
export AGENTMEMORY_COMPOSE_FILE="${_UBUNTU_SCRIPT_DIR}/docker-compose.ubuntu.yml"

# shellcheck source=_agentmemory-docker-common.sh
source "${_UBUNTU_SCRIPT_DIR}/_agentmemory-docker-common.sh"

agentmemory_preflight() {
  command -v docker >/dev/null 2>&1 || die "docker not found — install: sudo apt install docker.io docker-compose-v2"

  if ! docker info >/dev/null 2>&1; then
    if systemctl is-active docker >/dev/null 2>&1; then
      die "docker daemon running but current user cannot connect — run: sudo usermod -aG docker \$USER && newgrp docker"
    fi
    die "docker daemon not running — run: sudo systemctl start docker"
  fi

  if ! docker compose version >/dev/null 2>&1; then
    die "docker compose plugin not found — install: sudo apt install docker-compose-v2"
  fi

  command -v curl >/dev/null 2>&1 || die "curl not found — run: sudo apt install curl"
  command -v python3 >/dev/null 2>&1 || die "python3 not found — run: sudo apt install python3"

  agentmemory_warn_busy_ports
}

agentmemory_main "$@"
