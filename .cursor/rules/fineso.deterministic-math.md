---
description: Mandatory deterministic tools for financial computation
globs: packages/**/*.{js,mjs,ts}
alwaysApply: true
---

# Deterministic Math Law

1. **Strictly Prohibit LLM Mental Math**:
   - Do not allow the model to add, subtract, multiply, divide, aggregate ledger balances, or compute debt aging percentages inside prompt contexts.
2. **Deterministic Calculation Engine**:
   - Use DuckDB SQL, JavaScript Math, or Python with 100% precision.
   - The LLM receives pre-calculated metrics strictly for qualitative analysis and commentary.
3. **No Raw Excel/CSV Ingestion into Context**:
   - Use DuckDB to query files directly via `read_excel()` or `read_csv()`, extracting only compact JSON slices.
