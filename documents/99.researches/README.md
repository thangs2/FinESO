# 99 — Researches & Diagnostics

Nơi lưu **báo cáo nghiên cứu, audit diagnostic, gap analysis** do agent hoặc đội ngũ soạn — phục vụ quyết định triển khai, không thay thế SoT trong `SDLC/`.

---

## Cấu trúc thư mục

```text
documents/99.researches/
├── README.md                          # Mục này
└── audit-diagnostics/                 # Chẩn đoán doc vs code, readiness, drift
    └── YYYY-MM/                       # Kỳ báo cáo (tháng)
        ├── NN.<slug>.md               # Bản phân tích (prose + findings)
        └── NN.<slug>.evidence.json    # Evidence Pack (inventory / metrics)
```

---

## Quy ước đặt tên

| Trường | Ví dụ |
| :--- | :--- |
| **Document ID** | `RES-AUD-DIAG-202610-001` |
| **Slug file** | `01.documents-packages-readiness` |
| **Harness review** | Appendix A (Cursor), Appendix B (Antigravity) trong cùng file `.md` |

---

## Chỉ mục báo cáo

| Document ID | File | Phạm vi |
| :--- | :--- | :--- |
| `RES-AUD-DIAG-202610-001` | [audit-diagnostics/2026-10/01.documents-packages-readiness.md](audit-diagnostics/2026-10/01.documents-packages-readiness.md) | `documents/`, `packages/`, drift cấu hình gốc |
| `RES-AUD-DIAG-202610-002` | [audit-diagnostics/2026-10/02.antigravity-harness-debate-and-readiness.md](audit-diagnostics/2026-10/02.antigravity-harness-debate-and-readiness.md) | Phản biện harness Antigravity, giải pháp fineso-server & lộ trình scaffold P0 |
| `RES-AUD-DIAG-202610-003` | [audit-diagnostics/2026-10/03.cursor-harness-debate-synthesis.md](audit-diagnostics/2026-10/03.cursor-harness-debate-synthesis.md) | Cursor chốt disposition D-01…D-05 sau debate 002 |

