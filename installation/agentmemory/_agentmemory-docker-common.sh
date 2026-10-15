# Shared logic for agentmemory Docker wrappers (macOS / Ubuntu).
# Sourced by agentmemory-docker-macos.sh and agentmemory-docker-ubuntu.sh — do not execute directly.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${AGENTMEMORY_COMPOSE_FILE:-${SCRIPT_DIR}/docker-compose.yml}"

if [[ -f "${SCRIPT_DIR}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${SCRIPT_DIR}/.env"
  set +a
fi

AGENTMEMORY_COMPOSE_PROJECT="${AGENTMEMORY_COMPOSE_PROJECT:-fineso-agentmemory}"
AGENTMEMORY_CONTAINER_NAME="${AGENTMEMORY_CONTAINER_NAME:-fineso-agentmemory}"
AGENTMEMORY_HOST_API_PORT="${AGENTMEMORY_HOST_API_PORT:-3311}"
AGENTMEMORY_HOST_STREAM_PORT="${AGENTMEMORY_HOST_STREAM_PORT:-3312}"
AGENTMEMORY_HOST_VIEWER_PORT="${AGENTMEMORY_HOST_VIEWER_PORT:-3313}"
AGENTMEMORY_HOST_WS_PORT="${AGENTMEMORY_HOST_WS_PORT:-49334}"
AGENTMEMORY_HOST_METRICS_PORT="${AGENTMEMORY_HOST_METRICS_PORT:-9664}"

REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
DATA_DIR="${AGENTMEMORY_DATA_DIR:-${REPO_ROOT}/data.agentmemory}"

export AGENTMEMORY_COMPOSE_PROJECT
export AGENTMEMORY_CONTAINER_NAME
export AGENTMEMORY_HOST_API_PORT
export AGENTMEMORY_HOST_STREAM_PORT
export AGENTMEMORY_HOST_VIEWER_PORT
export AGENTMEMORY_HOST_WS_PORT
export AGENTMEMORY_HOST_METRICS_PORT
export AGENTMEMORY_DATA_DIR="${DATA_DIR}"

API_URL="http://localhost:${AGENTMEMORY_HOST_API_PORT}"
VIEWER_URL="http://localhost:${AGENTMEMORY_HOST_VIEWER_PORT}"

compose() {
  local -a files=()
  local -a args=(-p "${AGENTMEMORY_COMPOSE_PROJECT}")
  local f
  if [[ -n "${AGENTMEMORY_COMPOSE_FILES:-}" ]]; then
    IFS=':' read -r -a files <<< "${AGENTMEMORY_COMPOSE_FILES}"
  else
    files=("${COMPOSE_FILE}")
  fi
  for f in "${files[@]}"; do
    [[ -f "${f}" ]] || die "compose file not found: ${f}"
    args+=(-f "${f}")
  done
  docker compose "${args[@]}" "$@"
}

die() { echo "error: $*" >&2; exit 1; }

agentmemory_warn_busy_ports() {
  local port holder
  for port in "${AGENTMEMORY_HOST_API_PORT}" "${AGENTMEMORY_HOST_VIEWER_PORT}"; do
    holder=""
    if command -v ss >/dev/null 2>&1; then
      if ss -tlnH "sport = :${port}" 2>/dev/null | grep -q .; then
        holder="$(ss -tlnpH "sport = :${port}" 2>/dev/null | head -1 || true)"
        echo "[preflight] WARN: port ${port} already in use: ${holder:-unknown process}"
      fi
    elif command -v lsof >/dev/null 2>&1; then
      if lsof -nP -iTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; then
        holder="$(lsof -nP -iTCP:"${port}" -sTCP:LISTEN 2>/dev/null | awk 'NR==2{print $1,$2}' || true)"
        echo "[preflight] WARN: port ${port} already in use: ${holder:-unknown process}"
      fi
    fi
  done
}

docker_up() {
  agentmemory_preflight
  mkdir -p "${DATA_DIR}/state_store.db" "${DATA_DIR}/stream_store"
  echo "[docker] Project:     ${AGENTMEMORY_COMPOSE_PROJECT}"
  echo "[docker] Container:   ${AGENTMEMORY_CONTAINER_NAME}"
  echo "[docker] Data folder: ${DATA_DIR}"
  echo "[docker] Host ports:  API ${AGENTMEMORY_HOST_API_PORT}  viewer ${AGENTMEMORY_HOST_VIEWER_PORT}  streams ${AGENTMEMORY_HOST_STREAM_PORT}  ws ${AGENTMEMORY_HOST_WS_PORT}  metrics ${AGENTMEMORY_HOST_METRICS_PORT}"
  echo "[docker] Building & starting agentmemory container..."
  echo "  (first build takes ~2-3m — npm install in node:22-slim)"
  compose up -d --build 2>&1 | sed 's/^/  /'
}

docker_down() {
  echo "[docker] Stopping ${AGENTMEMORY_COMPOSE_PROJECT} stack (does not touch other projects)..."
  compose down
}

wait_api() {
  local i
  for i in $(seq 1 60); do
    if curl -sf --max-time 2 "${API_URL}/agentmemory/livez" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  return 1
}

agentmemory_open_dashboard() {
  local url="${VIEWER_URL}/#memories"
  if [[ "${AGENTMEMORY_PLATFORM:-}" == "ubuntu" ]]; then
    if command -v xdg-open >/dev/null 2>&1; then
      xdg-open "${url}" >/dev/null 2>&1 || true
    else
      echo "  Dashboard: ${url}"
    fi
  else
    if command -v open >/dev/null 2>&1; then
      open "${url}" >/dev/null 2>&1 || true
    else
      echo "  Dashboard: ${url}"
    fi
  fi
}

cmd_start() {
  docker_up
  echo "[start] Waiting for API... (up to 60s)"
  if wait_api; then
    echo "[start] agentmemory API ready at ${API_URL}"
  else
    echo "[start] WARN: API not ready after 60s — check logs"
  fi
  echo "[start] Done."
  echo ""
  echo "  MCP is configured in .agents/mcp_config.json and .cursor/mcp.json"
  echo "  Cursor tools: memory_save, memory_recall, memory_smart_search, ..."
  agentmemory_open_dashboard
}

cmd_stop() {
  docker_down
  echo "[stop] Stopped ${AGENTMEMORY_CONTAINER_NAME}."
}

cmd_rebuild() {
  agentmemory_preflight
  echo "[rebuild] Rebuilding image from scratch..."
  compose build --no-cache
  echo "[rebuild] Restarting stack..."
  compose up -d
  echo "[rebuild] Done."
}

cmd_status() {
  echo "=== Platform ==="
  echo "wrapper: ${AGENTMEMORY_WRAPPER_NAME:-agentmemory-docker}"
  echo "target:  ${AGENTMEMORY_PLATFORM:-unknown}"
  echo "project: ${AGENTMEMORY_COMPOSE_PROJECT}"
  echo ""

  echo "=== Data ==="
  echo "folder: ${DATA_DIR}"
  echo ""

  echo "=== Docker container ==="
  docker ps --filter "name=${AGENTMEMORY_CONTAINER_NAME}" --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' 2>/dev/null || echo "(docker unavailable)"
  echo ""

  echo "=== API (${API_URL}) ==="
  if curl -sf --max-time 5 "${API_URL}/agentmemory/livez" >/dev/null 2>&1; then
    echo "  ok"
    local count
    count="$(curl -sf --max-time 5 "${API_URL}/agentmemory/memories" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('memories',[])))" 2>/dev/null || echo "?")"
    echo "  memories: ${count}"
  else
    echo "  not reachable"
  fi
  echo ""

  echo "=== Viewer (${VIEWER_URL}) ==="
  if curl -sf --max-time 2 "${VIEWER_URL}/" >/dev/null 2>&1; then
    echo "  running"
  else
    echo "  not running (check container logs)"
  fi
}

cmd_logs() {
  compose logs --tail=40 2>&1 | sed 's/^/  /'
  echo ""
  echo "--- Tail live: docker compose -p ${AGENTMEMORY_COMPOSE_PROJECT} logs -f"
}

cmd_preflight() {
  agentmemory_preflight
  agentmemory_warn_busy_ports
  echo "[preflight] OK — Docker ready for ${AGENTMEMORY_COMPOSE_PROJECT}."
}

agentmemory_usage() {
  cat <<EOF
Usage:
  ${AGENTMEMORY_WRAPPER_NAME:-./agentmemory-docker.sh} start      # build + start + wait for API
  ${AGENTMEMORY_WRAPPER_NAME:-./agentmemory-docker.sh} stop       # docker compose down (this project only)
  ${AGENTMEMORY_WRAPPER_NAME:-./agentmemory-docker.sh} status     # health + memories + viewer
  ${AGENTMEMORY_WRAPPER_NAME:-./agentmemory-docker.sh} logs       # tail container logs
  ${AGENTMEMORY_WRAPPER_NAME:-./agentmemory-docker.sh} rebuild     # --no-cache build + restart
  ${AGENTMEMORY_WRAPPER_NAME:-./agentmemory-docker.sh} preflight  # check Docker prerequisites
  ${AGENTMEMORY_WRAPPER_NAME:-./agentmemory-docker.sh} help       # this help

Isolation (FinESO vs baplatform / x79):
  project/container  ${AGENTMEMORY_COMPOSE_PROJECT}
  API                ${API_URL}
  viewer             ${VIEWER_URL}
  data               ${DATA_DIR}

Commands:
  start       Build, start, wait for API
  stop        docker compose down (does not stop other workspaces)
  status      Data folder, container, API, viewer
  logs        Show last 40 lines of container logs
  rebuild     --no-cache build + restart
  preflight   Verify Docker daemon, compose plugin, host tools
  help        This help
EOF
}

agentmemory_main() {
  local cmd="${1:-start}"
  case "${cmd}" in
    start) cmd_start ;;
    stop) cmd_stop ;;
    status) cmd_status ;;
    logs) cmd_logs ;;
    rebuild) cmd_rebuild ;;
    preflight) cmd_preflight ;;
    -h|--help|help) agentmemory_usage ;;
    *) agentmemory_usage; die "unknown command: ${cmd}" ;;
  esac
}
