#!/usr/bin/env bun
/**
 * seed-harness-eso-knowledge.mjs
 * 
 * Clones and seeds synthesized Harness ESO (Evidence-Sufficient Orchestration)
 * knowledge into FinESO AgentMemory (port 3311).
 * 
 * Derived from:
 * - agentmemory:3111 (x79 / Harness ESO memories: mem_mv4395e7, mem_mv0pfqto, mem_mv0px5ll, mem_mv0qb84a, etc.)
 * - /Users/thangs2net/Workspaces/harness-eso (documents/01.overview, packages/harness-eso-core, decision-facade)
 * - FinESO Architecture Blueprint & Invariants
 */

const API_URL = process.env.AGENTMEMORY_URL || 'http://localhost:3311';

const esoMemories = [
  {
    type: 'architecture',
    title: 'Harness ESO Core Architecture: Evidence-Sufficient Orchestration Paradigm',
    concepts: ['harness-eso', 'eso-core', 'architecture', 'evidence-sufficiency', 'orchestration', 'control-plane'],
    content: `# Harness ESO Core Architecture: Evidence-Sufficient Orchestration Paradigm

## 1. Bản chất và Mục tiêu của Harness ESO
Harness ESO là control and observation layer tự chủ dành cho AI Coding Agents, giải quyết 3 căn bệnh cố hữu của LLM:
1. **Act without evidence (Hành động vô căn cứ):** Agent sửa code/tài liệu khi chưa đọc luật, chưa nạp đủ ngữ cảnh.
2. **Unattributable work (Thiếu khả năng truy vết):** Hàng chục tool calls trong một turn nhưng không rõ file nào bị sửa, luật nào áp dụng, chi phí token bao nhiêu.
3. **Unverifiable claims (Không thể kiểm chứng):** Agent báo "đã chạy test thành công" nhưng thực tế không có log hay chứng cứ chứng minh.

## 2. Chu trình ESO: Collect → Score → Gate
- **Collect (Thu thập chứng cứ):** Tự động truy vấn Law (docgraph), Code/AST (codegraph), và Context/Preferences (agentmemory).
- **Score (Đánh giá định lượng):** Tính toán Evidence-Sufficiency Score (0..100 hoặc 0..1) dựa trên rubric và đối soát khoảng trống (gaps).
- **Gate (Cổng chặn thực thi):** Quyết định ALLOW, DENY, hoặc HIL (Human-In-The-Loop) dựa trên threshold và chính sách bảo vệ (.harness/decision-policy.json). Nguyên tắc tối thượng: Khi nghi ngờ hoặc thiếu dữ liệu, Gate bắt buộc DENY.

## 3. Khái niệm Cốt lõi
- **Attestation:** Chứng thư đã ký/xác thực ghi nhận kết quả preflight hoặc kiểm tra hợp lệ, được các gate tin cậy.
- **Evidence Gap:** Khoảng trống cụ thể dạng \`{kind, query, priority}\` (law, code, symbol, doc, memory, check, human). Mỗi gap là một gợi ý hành động khắc phục trực tiếp (playbook).
- **Pack:** Tập hợp điều kiện chứng cứ tối thiểu cho từng nhóm tác vụ (backend, frontend, tools, docs, root).`
  },
  {
    type: 'architecture',
    title: 'FinESO Adaptation: 4 Invariants kế thừa từ Harness ESO sang Tài chính',
    concepts: ['fineso', 'invariants', 'financial-audit', 'duckdb', 'evidence-pack', 'no-evidence-no-claim'],
    content: `# FinESO Adaptation: 4 Invariants kế thừa từ Harness ESO sang Tài chính

FinESO chuyển hóa triết lý Harness ESO vào nghiệp vụ Tài chính - Kế toán của Doanh nghiệp với 4 Bất biến thiêng liêng:

## 1. Bất biến 1 (No Evidence → No Claim)
- Mọi nhận định, con số trong báo cáo tài chính (dòng tiền, doanh thu, tuổi nợ, biến động chi phí) bắt buộc gắn với ít nhất một \`evidence_item\`.
- Định danh chứng cứ cụ thể: Mã chứng từ hóa đơn, dòng sao kê ngân hàng (\`bank_tx_id\`), hoặc tọa độ ô Excel (\`Sheet1!D15\`).
- Tuyệt đối cấm đưa ra kết luận định tính vô căn cứ.

## 2. Bất biến 2 (Deterministic Calculator vs Probabilistic LLM)
- Mọi phép tính cộng, trừ, nhân, chia, tổng hợp số dư, tính tuổi nợ (aging) phải được thực hiện bằng **DuckDB / SQL / Python Function tất định**.
- Tuyệt đối cấm LLM tự tính nhẩm trong context prompt. LLM chỉ được nhận output đã tính toán từ Calculator Engine để viết thuyết minh/nhận định.

## 3. Bất biến 3 (Không nạp Raw Excel vào Context)
- Cấm dùng \`view_file\` để mở toàn bộ file Excel/CSV hàng ngàn dòng vào context (gây tràn context và suy giảm suy luận).
- Bắt buộc truy vấn qua DuckDB SQL tool (\`read_parquet\`, \`read_csv_auto\`, \`spatial/excel\`) hoặc lấy slice nhỏ đúng phạm vi cần kiểm tra.

## 4. Bất biến 4 (Rubric Gate ≥ 85)
- Báo cáo và khuyến nghị tài chính chỉ được phát hành khi tổng điểm Evidence-Sufficiency Score đạt từ **85/100** trở lên.
- Nếu thiếu dữ liệu (gaps), hệ thống phải từ chối phát hành và xuất danh sách yêu cầu bổ sung chứng từ.`
  },
  {
    type: 'pattern',
    title: 'Harness ESO Progressive Decision Ladder (L0 đến L3) & Decision Ledger',
    concepts: ['decision-facade', 'decision-policy', 'decision-ladder', 'decision-ledger', 'l0-l3', 'progressive-expansion'],
    content: `# Harness ESO Progressive Decision Ladder (L0 đến L3) & Decision Ledger

## 1. Thang Quyết định Lũy tiến (Progressive Decision Ladder)
Khi tiếp nhận một yêu cầu hoặc chuẩn bị phê duyệt một hành động write/shell, hệ thống giải quyết theo thang từ rẻ nhất đến đắt nhất:
- **L0 (Deterministic Rules):** Khớp quy tắc tĩnh (locked paths, forbidden shell commands, secret keys). Tốc độ microsecond, 0 token, độ tin cậy 100%.
- **L1 (Deterministic Tie-Breaker):** Lựa chọn ưu tiên có điều kiện (ví dụ: cấm shell ghi đè file được bảo vệ, phân quyền vai trò).
- **L2 (Brain Reasoning - LLM Facade):** Gọi DeepSeek Flash / Pro qua MCP \`deepseek-direct\` khi cần suy luận logic tài chính, kiến trúc phức tạp hoặc phân tích tình huống chưa có tiền lệ.
- **L3 (Human Consent / HIL):** Yêu cầu sự phê duyệt trực tiếp của Giám đốc tài chính (Finance Manager) hoặc Ông chủ đối với các khoản chi lớn, thay đổi chính sách kế toán.

## 2. Decision Ledger (Sổ cái quyết định)
- Mọi sự kiện đánh giá từ L0 đến L3 được ghi nhận bất biến vào \`decision_ledger\` trong SQLite/DuckDB.
- Cấu trúc bản ghi: \`requestId\`, \`stage\`, \`resolver_winner\`, \`is_ambiguous\`, \`decision_event_type\`, \`timestamp\`, \`policy_hash\`.
- Đảm bảo tính kiểm toán (auditability): Bất kỳ quyết định nào của AI đều truy ngược được căn cứ luật và tầng xử lý chiến thắng.`
  },
  {
    type: 'workflow',
    title: 'Multi-IDE Harness Parity: Chuẩn đối xứng Cursor và Antigravity',
    concepts: ['multi-ide', 'cursor', 'antigravity', 'harness-parity', 'guard-write', 'hooks'],
    content: `# Multi-IDE Harness Parity: Chuẩn đối xứng Cursor và Antigravity

## 1. Nguyên lý Đối xứng Tuyệt đối (Symmetry Principle)
- Thư mục \`.cursor/\` (Cursor IDE) và \`.agents/\` (Antigravity IDE) phải đồng bộ về cấu hình, rules và skills.
- Việc bổ sung một IDE mới vào monorepo phải là **cấu hình (CONFIG)**, tuyệt đối không được viết code riêng biệt làm rò rỉ layout (generic harness adapter).

## 2. Guard Write & Shell Gates
- **guard-write:** Kiểm tra quyền ghi file tại \`preToolUse\`. Bảo vệ các file core, rule mdc, schema database, và chính file hook (\`guard-write.py\` tự bảo vệ chính nó).
- **guard-shell:** Chặn các lệnh shell nguy hiểm (\`rm -rf\`, bypass write, trỏ link ngoài workspace) tại \`beforeShellExecution\`.

## 3. Bài học xương máu từ x79 và Harness-ESO
- **Event Schema Normalization:** Antigravity và Cursor có cấu trúc event khác nhau. Phải chuẩn hóa event sang chuẩn chung (\`event.harness IN ('cursor', 'agents')\`).
- **Hook Tracing:** Không được giả định file trace luôn tồn tại; cơ chế ghi log phải hỗ trợ fail-open an toàn, không làm crash IDE session.
- **Zero Scratch Junk:** Không xả rác file tạm vào root workspace. Mọi file scratch phải nằm trong \`scratch/\` hoặc \`.agentmemory/\`.`
  },
  {
    type: 'workflow',
    title: 'Token Performance Discipline & Context Diet Standard',
    concepts: ['token-diet', 'context-hygiene', 'range-read', 'shell-output-cap', 'performance'],
    content: `# Token Performance Discipline & Context Diet Standard

## 1. Kỷ luật Range-Read (Slice Reading)
- Không bao giờ đọc toàn bộ file mã nguồn hoặc tài liệu > 100 dòng vào context.
- Bắt buộc dùng slice: \`StartLine\` và \`EndLine\` (khoảng 30-80 dòng cần thiết).
- Tránh hội chứng "Context Drift" và suy giảm khả năng chú ý của Attention Heads khi context quá dài.

## 2. Kỷ luật Shell Output
- Mọi lệnh shell thực thi bắt buộc giới hạn output ≤ 30 dòng (dùng \`head\`, \`tail\`, \`grep\`, \`git status -s\`).
- Tránh việc output dài hàng ngàn dòng làm đầy context window và gây lãng phí chi phí token.

## 3. Execution Pipeline chuẩn
1. **AgentMemory first:** Gọi \`memory_smart_search\` ngay đầu phiên để tải context bài học và sở thích của user.
2. **Docgraph & Codegraph first:** Dùng \`docgraph_query\` và \`codegraph_explore\` khảo sát nhanh trong 1 round-trip.
3. **Implement & Test:** Sửa file gọn gàng, chạy kiểm thử tất định cục bộ (\`bun test\`).
4. **Distillation:** Đóng gói kết quả và bài học cốt lõi vào \`memory_save\` ở cuối phiên làm việc.`
  },
  {
    type: 'fact',
    title: 'Harness Observatory & Observe Server Integration (Port 8792)',
    concepts: ['observatory', 'observe-server', 'telemetry', 'harness-observe', 'transcripts'],
    content: `# Harness Observatory & Observe Server Integration (Port 8792)

## 1. Observe Server Architecture
- Chạy qua Docker Compose (\`harness-observatory-8792-observe-server-1\`) trên port **8792**.
- Tự động ingest:
  - Transcripts từ Cursor (\`.cursor/projects/.../agent-transcripts\`) và Antigravity (\`.gemini/.../transcript.jsonl\`).
  - Route trace hook logs (\`route-trace.jsonl\`).
  - Decision ledger events.

## 2. Web Monitor Cockpit
- Giao diện trực quan hóa dòng chảy yêu cầu (Request Flow Graph với G6/Cytoscape).
- Phân tích chi phí token thực tế theo từng model (Flash, Pro, Sonnet).
- Giám sát độ tuân thủ luật (Conformance Checks) và phát hiện sớm các hành vi agent đi chệch rubric.`
  },
  {
    type: 'architecture',
    title: 'FinESO Monorepo Topology & Data Lake Organization',
    concepts: ['monorepo', 'fineso-packages', 'data-lake', 'duckdb-storage', 'topology'],
    content: `# FinESO Monorepo Topology & Data Lake Organization

## 1. Phân tầng Monorepo
\`\`\`text
FinESO/
├── packages/
│   ├── fineso-foundation/     # Workspace config, company profile, decision-policy
│   ├── fineso-core/           # COLLECT, GATE, Evidence-Sufficiency evaluator
│   ├── fineso-adapters/       # DuckDB engine, Excel reader, Google Sheets sync
│   ├── fineso-decision/       # L0 deterministic SQL rules + LLM commentary facade
│   └── fineso-cockpit/        # Executive financial dashboard & evidence inspector
├── data-lake/                 # Dữ liệu tài chính thô (Excel, Bank CSV, Sync)
│   ├── bank/                  # Sao kê ngân hàng (Vietcombank, Techcombank, MB)
│   ├── invoices/              # Hóa đơn điện tử XML/PDF, bảng kê bán ra/mua vào
│   ├── cashflow/              # Bảng kế hoạch dòng tiền 13 tuần
│   └── google-sync/           # Snapshot đồng bộ từ Google Sheets
├── documents/                 # Tài liệu nghiệp vụ & kiến trúc blueprint
├── SDLC/                      # Chu trình phát triển phần mềm chuẩn
└── .agents/ & .cursor/        # Rules & Skills cho AI Agent
\`\`\`

## 2. Nguyên tắc Lưu trữ & Dữ liệu
- Toàn bộ dữ liệu nhạy cảm trong \`data-lake/\` và \`data.agentmemory/\` được loại trừ khỏi Git (\`.gitignore\`).
- File Parquet / DuckDB Database được xử lý cục bộ với hiệu năng tính toán phân tích cực cao.`
  }
];

async function seed() {
  console.log(`[seed] Connecting to FinESO AgentMemory at ${API_URL}...`);

  // Verify health
  try {
    const health = await fetch(`${API_URL}/agentmemory/livez`);
    if (!health.ok) {
      console.error(`[seed] AgentMemory not healthy: HTTP ${health.status}`);
      process.exit(1);
    }
    const healthData = await health.json();
    console.log(`[seed] AgentMemory live:`, healthData);
  } catch (err) {
    console.error(`[seed] Cannot reach AgentMemory at ${API_URL}:`, err.message);
    process.exit(1);
  }

  let successCount = 0;
  let failCount = 0;

  for (const item of esoMemories) {
    try {
      const res = await fetch(`${API_URL}/agentmemory/remember`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: item.content,
          type: item.type,
          concepts: item.concepts
        })
      });

      if (res.ok) {
        successCount++;
        console.log(`[OK] (${item.type}) ${item.title}`);
      } else {
        failCount++;
        const errText = await res.text();
        console.error(`[FAIL] ${item.title}: HTTP ${res.status} - ${errText}`);
      }
    } catch (err) {
      failCount++;
      console.error(`[ERR] ${item.title}:`, err.message);
    }
  }

  console.log(`\n=== KẾT QUẢ NẠP KNOWLEDGE VÀO FINESO-AGENTMEMORY ===`);
  console.log(`Thành công: ${successCount} / ${esoMemories.length}`);
  console.log(`Thất bại:   ${failCount}`);

  // Inspect memories
  const memRes = await fetch(`${API_URL}/agentmemory/memories`);
  const memData = await memRes.json();
  const total = Array.isArray(memData) ? memData.length : (memData.memories ? memData.memories.length : '?');
  console.log(`Tổng số memories trong fineso-agentmemory hiện tại: ${total}`);
  console.log(`Xem trực tiếp trên Viewer: http://localhost:3313/#memories`);
}

seed().catch(err => {
  console.error('[fatal]', err);
  process.exit(1);
});
