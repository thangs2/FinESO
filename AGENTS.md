# Agent Harness — FinESO (Financial Evident-Sufficient Orchestration)

Repo này phát triển nền tảng **FinESO** — Đội ngũ AI Agent Tài chính - Kế toán tự chủ dựa trên Bằng chứng kiểm toán (ESO), phục vụ Ông chủ và Finance Manager (FM).

**Tài liệu nền tảng bắt buộc đọc:** [`SDLC/04.architecture/01.architecture-blueprint.md`](SDLC/04.architecture/01.architecture-blueprint.md).

---

## ⚖️ Các Bất Biến Bắt Buộc (Invariants)

1. **Bất biến 1 (No Evidence → No Claim):** Mọi nhận định, số đo trong báo cáo tài chính bắt buộc phải gắn với ít nhất một `evidence_item` (mã chứng từ, dòng sao kê ngân hàng, hoặc ô Excel `Sheet1!D15`). Tuyệt đối không đưa nhận định định tính vô căn cứ.
2. **Bất biến 2 (Deterministic Calculator vs Probabilistic LLM):** Mọi phép tính cộng, trừ, nhân, chia, tổng hợp số dư, tuổi nợ phải được thực hiện bằng **DuckDB / SQL / Python Function tất định**. Tuyệt đối cấm LLM tự tính nhẩm trong context.
3. **Bất biến 3 (Không nạp Raw Excel vào Context):** Tuyệt đối không dùng `view_file` để mở toàn bộ file Excel/CSV hàng ngàn dòng vào context. Bắt buộc truy vấn qua DuckDB tool hoặc lấy slice nhỏ phục vụ evidence.
4. **Bất biến 4 (Rubric Gate $\ge 85$):** Báo cáo chỉ được phát hành khi tổng điểm Evidence-Sufficiency Score đạt từ $85/100$ trở lên. Nếu thiếu dữ liệu, phải nói rõ và yêu cầu bổ sung.
5. **Bất biến 5 (Dual-Harness Isolation — Cursor vs Antigravity):**
   - Thư mục `.cursor/` là môi trường độc lập, cô lập hoàn toàn dành riêng cho **Cursor IDE**.
   - Thư mục `.agents/` là môi trường độc lập, cô lập hoàn toàn dành riêng cho **Google Antigravity IDE**.
   - **Tuyệt đối CẤM:** Không xóa file, không gộp, không chuyển đổi định dạng chéo, và không đưa ra bất kỳ đề xuất nào về việc "chuẩn hóa hoặc xóa trùng lặp" giữa `.cursor/` và `.agents/`. Sự tồn tại song song của các file rules/configs ở cả 2 cây thư mục là thiết kế kiến trúc chủ đích bắt buộc để đảm bảo tính độc lập và khả năng vận hành tự chủ của từng IDE.

---

## 🛠️ Công Cụ Phục Vụ Agent

| Công cụ | Mục đích | Cách sử dụng |
| :--- | :--- | :--- |
| **AgentMemory** | Context phiên, preferences của user/ông chủ | MCP `agentmemory-mcp` (`memory_smart_search` / `memory_save`). |
| **Docgraph** | Kiến thức tài chính, blueprint, invariants | MCP `docgraph` (`docgraph_query`), index tại `.docgraph/`. |
| **Codegraph** | Cấu trúc code, packages, AST, blast radius | MCP `codegraph` (`codegraph_explore`), `projectPath` = root FinESO. |
| **DeepSeek** | Suy luận tài chính phức tạp, kiến trúc lõi | MCP `deepseek-direct` (`ask_deepseek_flash` mặc định, `pro` khi cần thiết kế phức tạp). |

---

## 🔄 Thứ Tự Làm Việc & Kỷ Luật Vận Hành (Execution Pipeline)

1. **AgentMemory first (Tra cứu sớm):** Gọi `memory_smart_search` ngay đầu phiên để nạp context phiên trước.
2. **Docgraph & Codegraph first:** Dùng `docgraph_query` tra cứu blueprint và `codegraph_explore` khảo sát code trong 1 round-trip.
3. **Kỷ luật Range-Read (Slice Reading):** Khi đọc code hoặc tài liệu > 100 dòng, chỉ đọc đoạn cần thiết (`StartLine`, `EndLine`).
4. **Kỷ luật Shell Output:** Giới hạn output shell $\le 30$ dòng (`git status -s`, `bun test 2>&1 | tail -n 25`).
5. **Implement & Test:** Sửa file gọn gàng, test cục bộ với `bun test`.
6. **Distillation & Memory Save:** Đóng gói kết quả quan trọng vào `memory_save` cuối phiên.

---

## 📦 Bố Cục Monorepo

```text
FinESO/
├── packages/
│   ├── fineso-foundation/     # Workspace config, company profile, decision-policy
│   ├── fineso-core/           # COLLECT, GATE, Evidence-Sufficiency evaluator
│   ├── fineso-adapters/       # DuckDB engine, Excel reader, Google Sheets sync
│   ├── fineso-decision/       # L0 deterministic SQL rules + LLM commentary facade
│   └── fineso-cockpit/        # Executive financial dashboard & evidence inspector
├── data-lake/                 # Thư mục chứa dữ liệu thô (Excel, Bank CSV, Sync)
├── documents/                 # Tài liệu nghiệp vụ & kỹ thuật (architecture, blueprint)
├── SDLC/                      # Chu trình phát triển phần mềm (WBS, requirements, analysis)
├── .cursor/                   # Cấu hình MCP & Rules cho Cursor IDE
└── .agents/                   # Rules & Skills cho Antigravity
```

---

## ⚡ Lệnh Dev (Bun Runtime)

```bash
bun install                   # Cài đặt dependencies monorepo
bun test                      # Chạy kiểm thử tự động
bun run lint                  # Kiểm tra định dạng code
```

Mọi thay đổi code tuân thủ ESM (`.mjs` hoặc TypeScript), giữ diff nhỏ gọn và tôn trọng style hiện có.
