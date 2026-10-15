---
description: FinESO Mermaid Diagram Verification Rule
version: "1.0.0"
alwaysApply: false
triggerOn: mermaid
---

# Purpose
Ensures that all Mermaid diagrams in the FinESO repository conform to the **FinESO Mermaid Diagram Standard** (`fineso.doc.mermaid.md`).

# Checks performed
1. **Arrow Syntax** – All edges must use the standard `-->` (or `---` for dashed) without escaped characters.
2. **Node IDs** – IDs may contain letters, numbers, underscores, or hyphens only. Reserved keywords (`end`, `subgraph`, `graph`, `flowchart`) are prohibited.
3. **Class Definitions** – Every diagram must declare the required classes (`stakeholder`, `component`, `datastore`) at the top of the diagram.
4. **Labeling** – Cross‑boundary arrows must include a label (`-->|Label|`).
5. **Special Characters** – Node labels containing `@`, `:`, `/` must be wrapped in double quotes.
6. **Emoji Restriction** – No emojis inside node texts; use textual status labels (`DONE`, `PARTIAL`, `OPEN`).

# Enforcement
The rule file is automatically applied by the Antigravity agent when any Markdown file containing a ````mermaid```` block is edited. If a violation is detected, the agent will:
- Comment on the offending lines.
- Suggest a corrected snippet.
- Optionally abort the commit until the diagram passes validation.

# Example of a valid block
```mermaid
flowchart TB
    classDef stakeholder fill:#ffcb6b,stroke:#4a4a4a,color:#1e1e2e;
    classDef component   fill:#81c784,stroke:#4a4a4a,color:#1e1e2e;
    classDef datastore   fill:#90a4ae,stroke:#4a4a4a,color:#1e1e2e;
    FM[Finance Manager]:::stakeholder -->|Requests| Cockpit
    Ingest[Evidence Ingestion]:::component --> Core[Deterministic Core (DuckDB)]:::component
```

# Non‑compliant example (will be flagged)
```mermaid
graph TB
    FM[Finance Manager] --\> Cockpit   # escaped arrow, missing classDef
    end   # reserved keyword used as node ID
```

# Integration
Place this file at `.agents/rules/fineso.doc.mermaid.verify.md`. The Antigravity runtime automatically loads all `.md` rule files under `.agents/rules`.
