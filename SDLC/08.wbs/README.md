# SDLC WBS — Phân Rã Cấu Trúc Công Việc (Work Breakdown Structure)

Thư mục này lưu trữ cấu trúc phân rã công việc chính thức của FinESO, điều phối toàn bộ vòng đời phát triển từ giai đoạn khởi tạo nền móng (Phase 0) cho đến hệ thống tự động hóa kích hoạt định kỳ (Phase 5).

---

## 📑 Danh Mục Tài Liệu WBS

- 📖 [**01.wbs-master-plan.md**](01.wbs-master-plan.md): Toàn bộ kế hoạch WBS chi tiết cho 6 giai đoạn phát triển, áp dụng khối tiêu chuẩn Purpose & Clarity (P-01 đến P-07) và quy luật kiểm thử TDD Quartet.

---

## 🧭 Cấu Trúc Mã Hóa Hạng Mục (Work Item Taxonomy)

- **Mã Giai Đoạn (Phase / Milestone)**:
  - `PHASE-0`: Scaffolding & Foundation Harness (Sprint 0)
  - `PHASE-1`: Deterministic Data Engine & Adapters (Sprint 1)
  - `PHASE-2`: Evidence-Sufficient Core & Gatekeeper (Sprint 2)
  - `PHASE-3`: Financial Decision Rules & Multi-Agent DAG (Sprint 3)
  - `PHASE-4`: FinESO Cockpit — Financial Dashboard & Evidence Tree (Sprint 4)
  - `PHASE-5`: Production Triggers & Automation Hooks (Sprint 5)

- **Cấu Trúc Mã Nhiệm Vụ (Task Code Format)**:
  - `WBS-<Phase>.<Gói công việc>.<Số thứ tự task>`
  - Ví dụ: `WBS-1.2.1` là Task 1 thuộc Gói công việc 2 trong Giai đoạn 1.
