---
name: fineso-evidence
description: Construct and evaluate Evidence Packs according to the FinESO audit standard
---

# Evidence Pack Construction Skill

When drafting financial executive reports or variance explanations for the Finance Manager and Business Owner:

1. **Extract Metrics via DuckDB Tool**:
   - Run SQL queries to obtain raw deterministic figures.
   - Record the executed SQL query and cell/row coordinates.
2. **Build Evidence Pack Object**:
   - `claim_id`: `CLM-YYYYMM-XXX`
   - `statement`: Clear, executive assertion.
   - `metrics`: Verified calculated figures.
   - `evidence_items`: List of supporting evidence references.
3. **Evaluate Rubric Score**:
   - Source authenticity: 40%
   - Arithmetic reconciliation: 30%
   - Period coverage: 20%
   - Data freshness: 10%
4. **Enforce Rubric Gate**:
   - If total score $< 85$: Reject publication, requesting additional bank statements or invoice vouchers.
   - If total score $\ge 85$: Mark as passed and route to Finance Manager sign-off queue.
