# FinESO — Cursor Agent Instructions

## Mandatory Reading Before Execution
1. Read the supreme governance constitution: `AGENTS.md`.
2. Read the foundational architecture specification: `SDLC/04.architecture/01.architecture-blueprint.md`.

## Core Invariants & Principles
- **No Evidence → No Claim**: Every financial assertion, metric, or warning must link to verifiable source evidence (cell coordinate, voucher code, or bank transaction line).
- **Deterministic Math**: LLMs must never perform arithmetic calculations (sums, differences, percentages). Use DuckDB / SQL / deterministic functions.
- **MCP First**: Use MCP tools (`agentmemory-mcp`, `docgraph`, `codegraph`, `deepseek-direct`) in their designated lifecycle order.
