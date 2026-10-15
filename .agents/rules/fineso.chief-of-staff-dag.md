---
description: DAG Fan-Out coordination discipline and ban on unconstrained group chat
globs: packages/fineso-core/**/*.{js,mjs,ts},packages/fineso-decision/**/*.{js,mjs,ts}
alwaysApply: false
---

# Orchestration Discipline: DAG & Michelin Kitchen Architecture

1. **Strictly Prohibit Unconstrained Group Chat**:
   - Do not allow multiple sub-agents to freely converse or debate within a shared context room, preventing token explosion and context drift.
2. **Fan-Out DAG (Directed Acyclic Graph) Mechanism**:
   - The Dispatcher (Chief of Staff) receives queries from the Business Owner or Finance Manager.
   - The Dispatcher decomposes the high-level goal into independent tasks (FP&A Worker, Debt/AR Worker, Cashflow Worker).
   - Specialized workers execute concurrently and write structured findings into a Shared Structured Artifact (Blackboard).
3. **Synthesis & 1-Round Adversarial Gate**:
   - The Dispatcher consolidates worker findings into an executive briefing.
   - An independent Auditor Agent evaluates the report against the Rubric Gate (Score $\ge 85/100$) in a single verification pass.
