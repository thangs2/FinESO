---
description: Workspace isolation for FinESO from external repositories
layer: core
alwaysApply: true
version: "1.0.0"
canonical: AGENTS.md
---

# Workspace Isolation (FinESO)

**Principle: One Cursor / Antigravity Window = One root repository.**

1. **FinESO Scope (This Window)**:
   - Law Agent: `AGENTS.md`, `.cursor/rules/*`, `.agents/rules/*` inside this repository.
   - MCP `codegraph`: Must target `--path /Users/thangs2net/Workspaces/FinESO`.
   - MCP `docgraph`: Must target `DOCGRAPH_REPO=/Users/thangs2net/Workspaces/FinESO`.
   - Implementation: Source code located under `packages/*` within FinESO.
2. **Strictly Prohibited**:
   - Applying rules or assumptions from sibling repositories (`x79` or `harness-eso`) to FinESO modifications.
   - Pointing codegraph or docgraph tools to sibling workspace directories.
   - Creating unstructured scratch files outside of designated directories (`scratch/` or `.agents/`).
   - Proposing to merge, delete, or cross-normalize rules/configs between `.cursor/` and `.agents/`.
3. **Dual-Harness Isolation (Cursor vs Antigravity)**:
   - `.cursor/`: Dedicated, isolated harness tree for Cursor IDE.
   - `.agents/`: Dedicated, isolated harness tree for Google Antigravity IDE.
   - Both trees run concurrently and independently. Parallel rules in both trees are mandatory by design.
