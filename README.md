# FinESO — Financial Evident-Sufficient Orchestration Platform

> **Autonomous AI Agent Financial Workforce with Evident-Sufficient Orchestration (ESO), Deterministic Verification, and Executive Cockpit for Business Owners & Finance Managers.**

[![Status](https://img.shields.io/badge/status-active%20development-blue.svg)](https://github.com/thangs2net/FinESO)
[![Runtime](https://img.shields.io/badge/runtime-bun%20%7C%20node%2022+-orange.svg)](https://bun.sh)
[![Engine](https://img.shields.io/badge/computation-duckdb%20sql-yellow.svg)](https://duckdb.org)

---

## 🌟 Vision & Paradigm

FinESO giải quyết bài toán lớn nhất khi đưa AI vào Tài chính - Kế toán: **Nỗi sợ ảo giác số liệu (Hallucination) và thiếu bằng chứng kiểm toán**.

Dựa trên triết lý **Evident-Sufficient Orchestration (ESO)**:
- **Nguyên tắc bất biến**: *"No Evidence → No Claim"* (Mọi con số, nhận định gửi cho Ông chủ bắt buộc phải có bằng chứng từ ô Excel, mã chứng từ hoặc sao kê ngân hàng đối ứng).
- **Phân tách tuyệt đối**:
  - **Deterministic Calculator (DuckDB/SQL/Python)**: Chịu trách nhiệm 100% tính toán số học chính xác tuyệt đối.
  - **LLM Reasoning (DeepSeek / Gemini)**: Chịu trách nhiệm diễn giải nguyên nhân biến động (Variance commentary) và soạn thảo báo cáo.

---

## 📚 Tài Liệu Kiến Trúc (Architecture Blueprint)

Đọc tài liệu kiến trúc toàn diện và kịch bản thực tế tại:
- 📖 [FinESO Architecture Blueprint](SDLC/04.architecture/01.architecture-blueprint.md)

---

## 🏗️ Cấu Trúc Monorepo

```text
FinESO/
├── AGENTS.md                  # Bản hiến chương & Kỷ luật vận hành AI Agent
├── SDLC/                      # Chu trình phát triển phần mềm chuẩn (WBS, architecture, governance)
│   ├── 00.governance/         # Quy chuẩn bất biến & tiêu chuẩn kiểm thử
│   ├── 04.architecture/       # Bản thiết kế kiến trúc toàn diện (01.architecture-blueprint.md)
│   └── 08.wbs/                # Phân rã cấu trúc công việc chi tiết
├── data-lake/                 # Thư mục chứa dữ liệu thô (Local Excel, Bank CSV, Google Sheets)
│   ├── bank/                  # Sao kê ngân hàng
│   ├── invoices/              # Theo dõi hóa đơn, công nợ
│   ├── cashflow/              # Sổ quỹ thu chi
│   └── google-sync/           # Dữ liệu đồng bộ từ Google Sheets API
├── documents/                 # Tài liệu nghiệp vụ & kỹ thuật
├── SDLC/                      # Chu trình phát triển phần mềm (WBS, requirements, analysis)
├── packages/
│   ├── fineso-foundation/     # Cấu hình workspace, nạp hồ sơ DN, chính sách rủi ro
│   ├── fineso-core/           # Pipeline ESO: COLLECT -> GATE -> DECISION
│   ├── fineso-adapters/       # DuckDB engine, Excel parser, Google Sheets sync
│   ├── fineso-decision/       # Quy tắc L0 tất định + LLM reasoning facade
│   └── fineso-cockpit/        # Giao diện điều hành & Cây bằng chứng (Observatory UI)
├── .cursor/                   # Cấu hình IDE Cursor (mcp.json, rules, instructions)
└── .agents/                   # Customizations cho Antigravity & Agent runners
```

---

## 🚀 Bắt Đầu Nhanh (Getting Started)

```bash
# Cài đặt dependencies (sử dụng Bun)
bun install

# Khởi tạo chỉ mục tìm kiếm ngữ nghĩa
codegraph init -i
docgraph init

# Kiểm tra bộ kiểm thử
bun test
```

---
*FinESO © 2026 — Built with Evident-Sufficient Orchestration.*
