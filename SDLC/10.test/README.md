# SDLC 10.test — Chiến Lược Kiểm Thử & Kiểm Soát Chất Lượng (Test & Quality Control)

Thư mục này quản lý toàn bộ các kịch bản kiểm thử tích hợp, kiểm toán chất lượng (Quality Control — QC) và kiểm thử chấp nhận (Acceptance Tests) của FinESO theo quy luật **TDD Quartet**.

---

## 📂 Phân Cấp Thư Mục Kiểm Thử

```text
SDLC/10.test/
├── README.md                      # Chiến lược kiểm thử & hướng dẫn thực thi
├── 01.unit/                       # Unit Tests cấp độ giải thuật (UT)
├── 02.integration/                # Kiểm thử tích hợp DuckDB và Data Lake
├── 03.coverage/                   # Báo cáo đo lường độ bao phủ mã nguồn (Coverage Gate >=80%)
└── 04.qc/                         # Kịch bản kiểm soát chất lượng & Smoke Tests
    └── fineso-smoke.test.mjs      # Smoke Test đối soát số học tất định & Rubric Gate
```

**Research (audit diagnostic, không thay SoT test):** [Báo cáo 01 — Documents × Packages Readiness](../../documents/99.researches/audit-diagnostics/2026-10/01.documents-packages-readiness.md) (`RES-AUD-DIAG-202610-001`) · [Báo cáo 02 — Antigravity Harness Debate & Readiness](../../documents/99.researches/audit-diagnostics/2026-10/02.antigravity-harness-debate-and-readiness.md) (`RES-AUD-DIAG-202610-002`).


---

## 🎯 Vai Trò Của `fineso-smoke.test.mjs`

Bài kiểm thử `fineso-smoke.test.mjs` đóng vai trò là **Proof-of-Concept (PoC) Smoke Test** đầu tiên của FinESO:
1. **Kiểm chứng Bất biến 1 & 2 (Deterministic Reconciliation):**
   - Đọc dữ liệu mẫu từ `data-lake/bank/sample_bank_sept2026.csv` và `data-lake/invoices/sample_ar_aging.csv`.
   - Tính toán dòng tiền ròng thực tế (Net Delta = $-220.42\text{M}$) và nợ quá hạn $>30\text{ ngày}$ ($410\text{M}$).
2. **Kiểm chứng Bất biến 4 (Evidence Pack & Rubric Gate):**
   - Đóng gói cấu trúc `EvidencePack` hoàn chỉnh với các `evidence_items` gắn chặt với tệp nguồn.
   - Thẩm định cổng kiểm soát: Điểm số đạt $95.0 \ge 85/100 \implies$ `pass_gate = true`.
