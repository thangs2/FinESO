---
name: fineso-duckdb-query
description: Instructions for deterministic DuckDB SQL queries over Excel, CSV, and Parquet files in FinESO
---

# Deterministic DuckDB Query Skill

When aggregating accounting and financial figures:
1. **Never load full Excel files into LLM context**.
2. **Compose deterministic DuckDB SQL queries**:
   ```sql
   SELECT partner_name, SUM(amount) as total
   FROM read_excel('data-lake/invoices/AR_2026.xlsx')
   WHERE due_date < CURRENT_DATE
   GROUP BY partner_name;
   ```
3. **Extract compact JSON results** for the report and store the query string in the `formula` field of the Evidence Item.
