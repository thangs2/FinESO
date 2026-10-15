# SDLC Governance — Chu Trình Phát Triển Phần Mềm Chuẩn Cho FinESO

Hệ thống tài liệu **SDLC (Software Development Life Cycle)** của FinESO được thiết lập theo quy chuẩn kỹ thuật nghiêm ngặt, bảo đảm tính minh bạch, khả năng truy vết (traceability) từ bài toán nghiệp vụ của Ông chủ / Kế toán trưởng (FM) đến từng dòng mã nguồn và bài kiểm thử tự động.

---

## 📂 Cấu Trúc Thư Mục SDLC

```text
SDLC/
├── README.md                      # Mục lục và hướng dẫn điều hướng SDLC
├── 00.governance/                 # 4 Bất biến cốt tử, Tiêu chuẩn DoR và DoD
│   └── 01.invariants-and-gates.md # Quy chế Evidence Gate và TDD Quartet
├── 01.inception/                  # Tầm nhìn, chân dung người dùng và ranh giới hệ thống
├── 02.requirements/               # Yêu cầu nghiệp vụ tài chính (FRD, NFR)
├── 03.analysis/                   # Phân tích ca sử dụng (Use Cases, User Stories)
├── 04.architecture/               # Thiết kế kiến trúc nền tảng & mô hình tư duy kép
│   ├── 01.architecture-blueprint.md # Bản vẽ kiến trúc toàn diện (Source of Truth)
│   ├── 02.typesafe-jev-decision-facade.md # Thiết kế tích hợp sâu mô hình TypeSafe Jev (System 1)
│   └── 03.9-cach-dung-jev-trong-agent.md # 9 điểm can thiệp của Jev trong vòng lặp AI Agent
├── 08.wbs/                        # Phân rã cấu trúc công việc (Work Breakdown Structure)
│   ├── README.md                  # Hướng dẫn và ma trận phân công WBS
│   └── 01.wbs-master-plan.md      # Toàn bộ WBS chi tiết chuẩn SDLC (Phase 0 đến Phase 5)
└── 10.test/                       # Kịch bản kiểm thử, QC và kiểm toán chất lượng
    ├── README.md                  # Chiến lược kiểm thử & TDD Quartet
    └── 04.qc/                     # Kịch bản Quality Control & Smoke Tests (fineso-smoke.test.mjs)
```

---

## 🏛️ Các Trục Quản Trị Cốt Lõi (Governance Pillars)

1. **Tuân thủ tuyệt đối 4 Bất Biến (Invariants)**:
   - *Bất biến 1 (No Evidence → No Claim)*: Mọi con số đều phải truy vết ra chứng từ gốc.
   - *Bất biến 2 (Deterministic Calculator vs Probabilistic LLM)*: 100% tính toán số học do DuckDB/SQL thực hiện.
   - *Bất biến 3 (Không nạp Raw Excel vào Context)*: Chỉ truy vấn qua slice/view tất định.
   - *Bất biến 4 (Rubric Gate $\ge 85$)*: Báo cáo chỉ được phát hành khi đạt điểm kiểm định $\ge 85/100$.
2. **Quy luật TDD Quartet**: Mọi tính năng runtime đều phải đi qua bộ tứ:
   - **UT (Unit Test)** $\to$ **DEV (Implementation)** $\to$ **COV (Coverage $\ge 80\%$)** $\to$ **QC (Quality Control & Audit)**.
3. **Tiêu chuẩn Purpose & Clarity (P-01 đến P-07)**: Mọi nhiệm vụ đều phải làm rõ mục đích kinh doanh, sản phẩm bàn giao bằng code thực tế, và rủi ro nếu tính toán sai lệch.
