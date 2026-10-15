---
description: Financial Evidence-Sufficiency discipline (ESO)
globs: packages/**/*.{js,mjs,ts},documents/**/*.md,SDLC/**/*.md
alwaysApply: true
---

# Evidence-Sufficiency Discipline in FinESO

1. **No Evidence → No Claim**: Never produce qualitative or quantitative financial statements without attached audit verification (`evidence_items`).
2. **Evidence Pack Structure**:
   - `claim_id`: Unique identifier (e.g., `CLM-YYYYMM-XXX`).
   - `metrics`: Exact calculated numerical values.
   - `evidence_items`: Array of evidence references including `source_uri` (e.g., `file:///data-lake/...#Sheet1!A1:B10`), `raw_snapshot`, and `audit_status`.
   - `sufficiency_scoring`: Total rubric score meeting or exceeding threshold ($\ge 85/100$).
3. **Audit Trail**: Clicking any numerical figure in the executive cockpit must display the corresponding source data cell or voucher row.
