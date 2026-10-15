#!/usr/bin/env bash
set -euo pipefail
echo "🧹 Docker Cleanup — giữ lại agentmemory, iii-engine"
echo "================================================"

# 1. Xoá kind cluster (giải phóng ~10-15GB)
echo ""
echo "1. Xoá kind cluster..."
kind cluster delete msx 2>/dev/null || echo "  kind already gone"

# 2. Xoá kind cluster
echo ""
echo "2. Xoá kind cluster..."
kind delete cluster --name mu 2>/dev/null || echo "  kind already gone"

# 3. Xoá tất cả containers TRỪ agentmemory & iii
echo ""
echo "3. Xoá containers (trừ agentmemory/iii)..."
docker ps -aq --filter "name=agentmemory" > /tmp/keep.txt 2>/dev/null || true
docker ps -aq --filter "name=iii" >> /tmp/keep.txt 2>/dev/null || true
ALL_CONTAINERS=$(docker ps -aq 2>/dev/null)
KEPT=0; DELETED=0
for c in $ALL_CONTAINERS; do
  if grep -q "$c" /tmp/keep.txt 2>/dev/null; then
    echo "  KEEP: $(docker ps -a --filter "id=$c" --format '{{.Names}}' 2>/dev/null)"
    KEPT=$((KEPT+1))
  else
    docker rm -f "$c" 2>/dev/null && DELETED=$((DELETED+1)) || true
  fi
done
echo "  Kept: $KEPT, Deleted: $DELETED containers"

# 4. Xoá volumes không dùng
echo ""
echo "4. Xoá unused volumes..."
docker volume prune -f 2>/dev/null || true

# 5. Xoá images không dùng (giữ agentmemory, mu-sts, mu-infra-base)
echo ""
echo "5. Xoá unused images..."
docker image prune -a -f 2>/dev/null || true

# 6. Xoá build cache
echo ""
echo "6. Xoá build cache..."
docker builder prune -a -f 2>/dev/null || true

# 7. Kết quả
echo ""
echo "================================================"
echo "✅ Done! Disk usage:"
docker system df 2>/dev/null || df -h ~ 2>/dev/null | tail -3
rm -f /tmp/keep.txt
