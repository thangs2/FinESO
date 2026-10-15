#!/bin/bash
# TypeSafe / Jev — sync env to runtime dir and verify API.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${TYPESAFE_RUNTIME_DIR:-$HOME/.gemini/antigravity}"
BUN_BIN="${BUN_BIN:-$(command -v bun || echo "$HOME/.bun/bin/bun")}"
REPO_ENV="$SCRIPT_DIR/typesafe.env"
TARGET_ENV="$TARGET_DIR/typesafe.env"

echo "=== [1/3] Sync typesafe.env → $TARGET_ENV ==="
mkdir -p "$TARGET_DIR"
if [[ -f "$REPO_ENV" ]]; then
  cp "$REPO_ENV" "$TARGET_ENV"
  echo "Copied repo env (private GitLab policy)."
elif [[ -f "$SCRIPT_DIR/typesafe.env.example" ]]; then
  cp "$SCRIPT_DIR/typesafe.env.example" "$TARGET_ENV"
  echo "Created $TARGET_ENV from example — set TYPESAFE_API_KEY."
else
  echo "No typesafe.env in repo; create $TARGET_ENV manually."
fi

echo "=== [2/3] Smoke test (models + systemone) ==="
export TYPESAFE_ENV_FILE="$REPO_ENV"
if [[ -f "$REPO_ENV" ]] && grep -q 'TYPESAFE_API_KEY=apikey_' "$REPO_ENV" 2>/dev/null; then
  "$BUN_BIN" run "$SCRIPT_DIR/smoke-jev.mjs"
else
  echo "Skip smoke: no apikey in $REPO_ENV"
fi

echo "=== [3/3] Harness policy ==="
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
POLICY="$REPO_ROOT/.harness/decision-policy.json"
if [[ -f "$POLICY" ]]; then
  echo "Policy present: $POLICY"
else
  echo "Missing $POLICY — add from design doc §4.1"
fi

echo "=============================================================================="
echo " DONE. Repo env: $REPO_ENV"
echo " Runtime copy: $TARGET_ENV"
echo " Shell: source installation/typesafe/export-env.sh"
echo " Test:  bun run installation/typesafe/smoke-jev.mjs"
echo " Jev stays shadow until Decision Facade WP5+ (policy jev.mode)"
echo "=============================================================================="
