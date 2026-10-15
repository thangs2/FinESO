#!/usr/bin/env bash
# query-agentmemory-mcp.sh — CLI helper to query agentmemory via MCP shim
#
# Requires agentmemory container running (./agentmemory-docker-only.sh start).
# Calls npx @agentmemory/mcp against http://localhost:3111 and prints results.
#
# Usage:
#   ./query-agentmemory-mcp.sh sessions
#   ./query-agentmemory-mcp.sh smart-search "msx cqrs patterns"
#   ./query-agentmemory-mcp.sh recall "mongodb standards"

set -euo pipefail
METHOD="${1:-sessions}"
QUERY="${2:-}"
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

case "$METHOD" in
    smart-search|recall)
        if [[ -z "$QUERY" ]]; then
            echo "Usage: $0 ${METHOD} <query>"
            exit 1
        fi
        REQ="{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"memory_${METHOD}\",\"arguments\":{\"query\":\"${QUERY}\",\"limit\":5}}}"
        ;;
    sessions)
        REQ='{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"memory_sessions","arguments":{}}}'
        ;;
    *)
        echo "Usage: $0 <smart-search|recall|sessions> [query]"
        exit 1
        ;;
esac

echo "$REQ" | AGENTMEMORY_URL=${AGENTMEMORY_URL:-http://localhost:3311} npx -y @agentmemory/mcp > "$TMP" 2>/dev/null

python3 -c "
import json
with open('$TMP') as f: data = json.load(f)
text = data['result']['content'][0]['text']
inner = json.loads(text)
if 'results' in inner:
    for i, r in enumerate(inner['results'][:5]):
        cid = r.get('id','')[:16]
        content = (r.get('content','') or r.get('summary','') or '')[:200]
        print(f'{i+1}. [{cid}] {content}')
        print()
elif 'sessions' in inner:
    for i, s in enumerate(inner.get('sessions',inner.get('items',[]))[:5]):
        sid = s.get('id','')[:12]
        st = s.get('status','?')
        ob = s.get('observationCount', s.get('count','?'))
        print(f'{i+1}. [{sid}] {st} ({ob} obs)')
else:
    print(json.dumps(inner, indent=2)[:500])
" 2>/dev/null || echo "(no results)"
