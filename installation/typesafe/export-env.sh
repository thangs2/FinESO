#!/usr/bin/env bash
# Source from shell: source installation/typesafe/export-env.sh
set -euo pipefail
_TYPESAFE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "$_TYPESAFE_DIR/typesafe.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$_TYPESAFE_DIR/typesafe.env"
  set +a
fi
export TYPESAFE_ENV_FILE="${TYPESAFE_ENV_FILE:-$_TYPESAFE_DIR/typesafe.env}"
