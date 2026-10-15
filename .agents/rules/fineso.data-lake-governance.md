---
description: Raw data governance standards in data-lake (Excel, CSV, Google Sheets)
globs: data-lake/**/*,packages/fineso-adapters/**/*.{js,mjs,ts}
alwaysApply: true
---

# Raw Data Lake Governance

1. **Data Partitions (`data-lake/`)**:
   - `bank/`: Bank account statements with sensitive personal identifiable information (PII) masked.
   - `invoices/`: Accounts receivable (AR) and accounts payable (AP) ledgers and invoices.
   - `cashflow/`: Cashbooks and internal fund registers.
   - `google-sync/`: Automated synchronized snapshots from Google Sheets API.
2. **Data Access Principles**:
   - Never commit sensitive raw financial files to Git (enforced via `.gitignore`).
   - All queries must route through `fineso-adapters` (DuckDB / SQL engine).
   - If an Excel file contains formula errors (`#REF!`, `#VALUE!`), the adapter must flag `DATA_CORRUPT` and request human reconciliation.
