#!/bin/sh
# agentmemory entrypoint.
#
# Must run as root to:
# 1. Overwrite npm-bundled iii-config.yaml (bind 0.0.0.0, use /data).
# 2. chown mounted /data volume to runtime user.
# 3. Generate HMAC secret on first boot.
#
# Then starts agentmemory under gosu + watchdog that kills the container
# when the API stays unhealthy (handles macOS sleep/wake, where Docker
# Desktop resets networking but processes don't crash).
#
# Viewer at :3113 binds 0.0.0.0 (patched in Dockerfile) so Docker port
# mapping works correctly — all-in Docker, no host-side viewer needed.

set -eu

DATA_DIR="${AGENTMEMORY_DATA_DIR:-/data}"
HMAC_FILE="${AGENTMEMORY_HMAC_FILE:-${DATA_DIR}/.hmac}"
RUN_AS="node:node"
III_CONFIG="/opt/agentmemory/node_modules/@agentmemory/agentmemory/dist/iii-config.yaml"

PUBLIC_API_PORT="${AGENTMEMORY_HOST_API_PORT:-3311}"
PUBLIC_VIEWER_PORT="${AGENTMEMORY_HOST_VIEWER_PORT:-3313}"

# ── Prepare data directory ────────────────────────────────────────────
mkdir -p "$DATA_DIR"
chown -R "$RUN_AS" "$DATA_DIR"

# ── Overwrite engine config to bind 0.0.0.0 + use /data ──────────────
cat > "$III_CONFIG" <<CONFIGEOF
workers:
  - name: iii-http
    config:
      port: 3111
      host: 0.0.0.0
      default_timeout: 180000
      cors:
        allowed_origins:
          - "http://localhost:3111"
          - "http://localhost:3113"
          - "http://127.0.0.1:3111"
          - "http://127.0.0.1:3113"
          - "http://localhost:${PUBLIC_API_PORT}"
          - "http://localhost:${PUBLIC_VIEWER_PORT}"
          - "http://127.0.0.1:${PUBLIC_API_PORT}"
          - "http://127.0.0.1:${PUBLIC_VIEWER_PORT}"
        allowed_methods: [GET, POST, PUT, DELETE, OPTIONS]
  - name: iii-state
    config:
      adapter:
        name: kv
        config:
          store_method: file_based
          file_path: /data/state_store.db
  - name: iii-queue
    config:
      adapter:
        name: builtin
  - name: iii-pubsub
    config:
      adapter:
        name: local
  - name: iii-cron
    config:
      adapter:
        name: kv
  - name: iii-stream
    config:
      port: 3112
      host: 0.0.0.0
      adapter:
        name: kv
        config:
          store_method: file_based
          file_path: /data/stream_store
  - name: iii-observability
    config:
      enabled: true
      service_name: agentmemory
      exporter: memory
      sampling_ratio: 1.0
      metrics_enabled: true
      logs_enabled: true
      logs_console_output: true
CONFIGEOF
chown "$RUN_AS" "$III_CONFIG"

# ── Generate HMAC secret on first boot ────────────────────────────────
if [ ! -s "$HMAC_FILE" ]; then
  SECRET="$(openssl rand -hex 32)"
  umask 077
  printf '%s\n' "$SECRET" > "$HMAC_FILE"
  chmod 600 "$HMAC_FILE"
  chown "$RUN_AS" "$HMAC_FILE"
  echo "================================================================"
  echo "agentmemory: generated HMAC secret on first boot"
  echo "Stored at: $HMAC_FILE (chmod 600)"
  echo "================================================================"
fi

export AGENTMEMORY_SECRET

# ── Start agentmemory in background (as unprivileged user) ───────────
gosu "$RUN_AS" agentmemory "$@" &
AGENTMEMORY_PID=$!

# ── Wait for API to be ready ─────────────────────────────────────────
for i in $(seq 1 30); do
  if curl -sf --max-time 3 http://127.0.0.1:3111/agentmemory/livez >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "[watchdog] agentmemory started (PID $AGENTMEMORY_PID). Polling health every 10s..."

# ── Watchdog: poll health every 10s, exit if 6 consecutive failures ──
# Critical: --max-time 5 prevents watchdog from hanging when API is hung.
# 6 fails × ~15s per cycle (10s sleep + 5s timeout) = ~90s worst-case.
# High enough to survive transient MCP request slowness,
# low enough to auto-recover from macOS sleep/wake.
FAILURES=0
MAX_FAILURES=6

while true; do
  sleep 10
  if curl -sf --max-time 5 http://127.0.0.1:3111/agentmemory/livez >/dev/null 2>&1; then
    FAILURES=0
  else
    FAILURES=$((FAILURES + 1))
    echo "[watchdog] API unreachable (failure $FAILURES/$MAX_FAILURES)"
    if [ "$FAILURES" -ge "$MAX_FAILURES" ]; then
      echo "[watchdog] API unhealthy. Killing agentmemory (PID $AGENTMEMORY_PID)..."
      kill -TERM "$AGENTMEMORY_PID" 2>/dev/null || true
      wait "$AGENTMEMORY_PID" 2>/dev/null || true
      echo "[watchdog] Container exiting. Docker restart will bring it back."
      exit 1
    fi
  fi
done
