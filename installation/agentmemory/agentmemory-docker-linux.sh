#!/usr/bin/env bash
# agentmemory-docker-linux.sh — Linux Docker Engine (Debian / Ubuntu / similar)
#
# Same stack as agentmemory-docker-ubuntu.sh.
# For Docker Desktop on Windows, use agentmemory-docker-windows.ps1 instead.
# For Docker Desktop on macOS, use agentmemory-docker-macos.sh.

set -euo pipefail

_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export AGENTMEMORY_WRAPPER_NAME="./agentmemory-docker-linux.sh"
exec "${_SCRIPT_DIR}/agentmemory-docker-ubuntu.sh" "$@"
