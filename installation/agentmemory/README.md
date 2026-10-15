# Agentmemory — V3 All-in-Docker

**Viewer đã được patch, chạy trong Docker.** Không còn host worker, không cần chạy lệnh `dashboard` riêng.
Container tự phục hồi sau sleep/wake nhờ `restart: unless-stopped` + watchdog.

---

## 1. Deploy nhanh

Chọn script theo **host OS** (container image giống nhau — chỉ khác preflight host):

| Host | Script deploy | Compose file |
|---|---|---|
| **Windows** (Docker Desktop) | `.\agentmemory-docker-windows.ps1` | `docker-compose.yml` |
| **macOS** (Docker Desktop) | `./agentmemory-docker-macos.sh` | `docker-compose.yml` |
| **Ubuntu / Linux** (22.04, 24.04, 26.04…) | `./agentmemory-docker-linux.sh` hoặc `./agentmemory-docker-ubuntu.sh` | `docker-compose.ubuntu.yml` |

### Windows (Docker Desktop / PowerShell)

```powershell
cd installation\agentmemory

# Preflight + deploy
powershell -ExecutionPolicy Bypass -File .\agentmemory-docker-windows.ps1 preflight
powershell -ExecutionPolicy Bypass -File .\agentmemory-docker-windows.ps1 start
powershell -ExecutionPolicy Bypass -File .\agentmemory-docker-windows.ps1 status
```

Dashboard: http://localhost:3313/#memories (script `start` tự mở trình duyệt).

### Ubuntu / Linux (Docker Engine)

```bash
cd installation/agentmemory

# Cài Docker (lần đầu nếu chưa có)
sudo apt update
sudo apt install -y docker.io docker-compose-v2 curl python3
sudo usermod -aG docker "$USER"
# đăng xuất / newgrp docker rồi chạy tiếp

sudo systemctl enable --now docker

# Preflight + deploy
./agentmemory-docker-linux.sh preflight
./agentmemory-docker-linux.sh start
./agentmemory-docker-linux.sh status
```

Dashboard: http://localhost:3313/#memories (script `start` gọi `xdg-open` nếu có).

### macOS (Docker Desktop)

```bash
cd installation/agentmemory

./agentmemory-docker-macos.sh start
./agentmemory-docker-macos.sh status
```

Dashboard: http://localhost:3313/#memories (script `start` gọi `open`).

**Logic dùng chung:** `_agentmemory-docker-common.sh` — hai wrapper chỉ khác bước kiểm tra host.

**Yêu cầu:** Docker daemon đang chạy (`systemctl` trên Ubuntu, Docker Desktop app trên macOS).

---

## 2. Sử dụng hàng ngày

### 2.1 Vận hành container

Chạy từ thư mục `build/docker/agentmemory`:

**Ubuntu / Linux:**

```bash
./agentmemory-docker-ubuntu.sh preflight   # kiểm tra docker, compose, curl, port
./agentmemory-docker-ubuntu.sh start
./agentmemory-docker-ubuntu.sh status
./agentmemory-docker-ubuntu.sh logs
./agentmemory-docker-ubuntu.sh stop
./agentmemory-docker-ubuntu.sh rebuild
./agentmemory-docker-ubuntu.sh help
```

**macOS:**

```bash
./agentmemory-docker-only.sh start
./agentmemory-docker-only.sh status
./agentmemory-docker-only.sh logs
./agentmemory-docker-only.sh stop
./agentmemory-docker-only.sh rebuild
./agentmemory-docker-only.sh help
```

Data persist tại `data.agentmemory/` (repo root, bind mount vào `/data` trong container).

**Compose isolate**: Container name `fineso-agentmemory`, compose project `fineso-agentmemory`.

### 2.2 MCP (Cursor / Antigravity IDE)

File `.cursor/mcp.json` và `.agents/mcp_config.json` đã cấu hình sẵn. Các IDE tự động nhận diện tools:

```
memory_save, memory_recall, memory_smart_search, memory_sessions, ...
```

MCP shim trên host: `npx @agentmemory/mcp` → `http://localhost:3311` (Windows: `npx.cmd`)

### 2.3 Query MCP từ terminal (CLI)

- **macOS / Linux**: `./query-agentmemory-mcp.sh sessions`
- **Windows**: `powershell -ExecutionPolicy Bypass -File .\query-agentmemory-mcp.ps1 sessions`

```bash
cd installation/agentmemory

# Liệt kê sessions
./query-agentmemory-mcp.sh sessions

# Smart search
./query-agentmemory-mcp.sh smart-search "13-week cashflow"

# Recall theo query
./query-agentmemory-mcp.sh recall "variance analysis rubric"
```

### 2.4 Import knowledge

```bash
bun installation/agentmemory/import-to-agentmemory.mjs
```

---

## 3. Kiến trúc (V3 — FinESO)

```
┌─ Host ────────────────────────────────────────────────────────┐
│                                                                │
│  ┌─ Docker container: fineso-agentmemory ───────────────────┐  │
│  │  ┌───────────┐  ┌──────────────────────────────────┐     │  │
│  │  │ iii-engine│◄─┤ agentmemory (Node.js)             │     │  │
│  │  │ (Rust)    │  │ ─ Worker functions               │     │  │
│  │  │ :3111 API │  │ ─ Viewer :3113 (patch 0.0.0.0)  │     │  │
│  │  │ :49134 WS │  │ ─ Consolidation cron             │     │  │
│  │  └───────────┘  └──────────────────────────────────┘     │  │
│  │                                                            │  │
│  │  data: /data ← bind mount → data.agentmemory/              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                │
│  MCP: npx @agentmemory/mcp ────→ http://localhost:3311         │
│  Browser Dashboard ───────────→ http://localhost:3313/        │
└────────────────────────────────────────────────────────────────┘
```

**Viewer patch:** upstream bind `server.listen(port, "127.0.0.1")` — trong container Docker không route được qua port mapping. Dockerfile tìm file `dist/*.mjs` theo pattern (tên file hash thay đổi theo version) và patch thành `"0.0.0.0"`.

### Port map

| Port | Container | Host | Service |
|:---:|:---:|:---:|---|
| 3111 | 0.0.0.0:3111 | 127.0.0.1:3111 | III engine REST API (MCP entrypoint) |
| 3112 | 0.0.0.0:3112 | 127.0.0.1:3112 | III engine Streams |
| **3113** | **0.0.0.0:3113** | **127.0.0.1:3113** | **Viewer dashboard** |
| 49134 | 0.0.0.0:49134 | 127.0.0.1:49134 | III engine WebSocket (worker ↔ engine) |
| 9464 | 0.0.0.0:9464 | 127.0.0.1:9464 | OpenTelemetry metrics |

---

## 4. Các thành phần & file

| File | Vai trò |
|---|---|
| `agentmemory-docker-ubuntu.sh` | **Deploy trên Ubuntu/Linux:** preflight systemd, docker group, `ss` port check |
| `agentmemory-docker-only.sh` | **Deploy trên macOS:** preflight Docker Desktop |
| `_agentmemory-docker-common.sh` | Logic chung: start/stop/status/logs/rebuild (sourced bởi 2 wrapper) |
| `docker-compose.yml` | Stack mặc định (macOS / generic) |
| `docker-compose.ubuntu.yml` | Overlay Linux: `container_name`, `init: true` |
| `query-agentmemory-mcp.sh` | **Query MCP từ CLI:** sessions, smart-search, recall |
| `Dockerfile` | Multi-stage: `iii` binary từ `iiidev/iii`, npm `@agentmemory/agentmemory`, sed patch viewer |
| `entrypoint.sh` | First-boot: chown `/data`, engine config, HMAC secret, gosu, watchdog |
| `docker-compose.yml` | Single service, ports, volume, env, `restart: unless-stopped` |
| `import-to-agentmemory.mjs` | Import knowledge vào agentmemory |
| `cleanup-keep-agentmemory.sh` | Dọn Docker (giữ container agentmemory/iii), tách biệt deploy |
| `README.md` | File này |

---

## 5. Cơ chế self-healing

### 5.1 `restart: unless-stopped`

Container tự khởi động lại khi crash hoặc sau sleep/wake (Docker Desktop reset networking).

### 5.2 Watchdog (entrypoint.sh)

```
sleep 10s → curl http://127.0.0.1:3111/agentmemory/livez (timeout 5s)
  → OK? reset failure=0
  → FAIL? failure++ → nếu >= 6 → kill agentmemory → exit 1 → Docker restart
```

- Interval: 10s
- Timeout: 5s mỗi request
- Threshold: 6 failures (~90s worst-case)

### 5.3 Docker HEALTHCHECK

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3111/agentmemory/livez || exit 1
```

---

## 6. Troubleshooting

### 6.1 Viewer không mở được (http://localhost:3113)

```bash
docker ps --filter name=agentmemory
./agentmemory-docker-only.sh logs | grep -i viewer
lsof -i :3113
curl -s --max-time 5 http://localhost:3113/ | head -5
```

**Nguyên nhân thường gặp:**
- Container chưa start xong (chờ 30–60s)
- Port 3113 conflict (`lsof -ti :3113 | xargs kill -9`)
- Viewer patch chưa chạy → `./agentmemory-docker-only.sh rebuild`

### 6.2 API không trả lời (http://localhost:3111)

```bash
# Ubuntu — container name cố định
docker logs agentmemory --tail 50
docker logs agentmemory 2>&1 | grep watchdog

# macOS — tên compose project
docker logs agentmemory-agentmemory-1 --tail 50

./agentmemory-docker-ubuntu.sh stop && ./agentmemory-docker-ubuntu.sh start
# hoặc trên macOS: ./agentmemory-docker-only.sh stop && ./agentmemory-docker-only.sh start
curl -sf http://localhost:3111/agentmemory/livez && echo ok
```

### 6.3 Container restart liên tục

```bash
docker logs agentmemory --tail 100          # Ubuntu (container_name)
# docker logs agentmemory-agentmemory-1 --tail 100   # macOS compose name

ss -tlnp | grep -E ':3111|:3113'             # Ubuntu
# lsof -i :3111 -i :3113                     # macOS

./agentmemory-docker-ubuntu.sh rebuild      # hoặc agentmemory-docker-only.sh trên macOS
```

### 6.4 Sau sleep/wake

```bash
docker ps --filter name=agentmemory
./agentmemory-docker-only.sh start
./agentmemory-docker-only.sh logs | grep -E "watchdog|unhealthy"
```

Thường chờ 1–2 phút, watchdog + Docker tự recovery.

### 6.5 Reset hoàn toàn (mất data!)

```bash
./agentmemory-docker-only.sh stop
rm -rf .agentmemory
docker rmi agentmemory-agentmemory 2>/dev/null || true
./agentmemory-docker-only.sh start
```

---

## 7. Dockerfile (tóm tắt)

```dockerfile
FROM iiidev/iii:0.11.2 AS iii-image
FROM node:22-slim
# ... ca-certificates, curl, tini, gosu ...
COPY --from=iii-image /app/iii /usr/local/bin/iii
RUN npm install "@agentmemory/agentmemory@0.9.12" ...
# Patch viewer: grep dist/*.mjs by listen pattern → sed 127.0.0.1 → 0.0.0.0
COPY --chmod=0755 entrypoint.sh /usr/local/bin/agentmemory-entrypoint.sh
ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/agentmemory-entrypoint.sh"]
```

Version mặc định: `docker-compose.yml` — `AGENTMEMORY_WORKER_VERSION`, `AGENTMEMORY_III_VERSION`.

---

## 8. Checklist diagnostic

| Triệu chứng | Lệnh | Ý nghĩa |
|---|---|---|
| API down | `curl http://localhost:3111/agentmemory/livez` | Health check |
| Viewer treo | `curl http://localhost:3113/ \| head -5` | HTML response |
| Restart loop | `docker ps --filter name=agentmemory` | Up time, restart count |
| Ubuntu preflight | `./agentmemory-docker-ubuntu.sh preflight` | Docker daemon + compose + ports |
| Watchdog kill? | `docker logs agentmemory-agentmemory-1 2>&1 \| grep watchdog` | Failure count |
| Port conflict | `lsof -i :3111 -i :3113` | Process giữ port |
| Patch viewer | `docker exec agentmemory grep -l '0.0.0.0' /opt/agentmemory/node_modules/@agentmemory/agentmemory/dist/*.mjs \| head -3` | Phải có `0.0.0.0` |
| MCP CLI test | `./query-agentmemory-mcp.sh sessions` | MCP shim + API OK |

---

## 9. Khi nào cần rebuild?

- **Đổi agentmemory version:** sửa `AGENTMEMORY_WORKER_VERSION` trong `docker-compose.yml` → `./agentmemory-docker-only.sh rebuild`
- **Đổi iii-engine version:** sửa `AGENTMEMORY_III_VERSION` → rebuild
- **Sửa `entrypoint.sh` / `Dockerfile`:** rebuild
- **Data hỏng:** xóa `.agentmemory/`, start lại
