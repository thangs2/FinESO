---
description: FinESO Mermaid Diagram Standard (Adapted from x79 Golden Reference)
globs: SDLC/**,documents/**,task/**,packages/**
alwaysApply: true
version: "1.0.0"
---

# FinESO Mermaid Diagram Standard (Golden Reference)

Adapted from the x79 MSX Golden Reference standard for fail-safe, high-contrast, professional architectural and workflow diagrams.

---

## 1. Forbidden Anti-Patterns (Breaks Rendering or Platform Convention)

| Mistake | Why It Is Prohibited | Mandatory Replacement |
|:---|:---|:---|
| Inline `style NodeId fill:#...` | Fragmented, unmaintainable, breaks dark/light mode themes. | Declare `classDef` at top of diagram and apply via `NodeId["..."\]:::className`. |
| `box` in `sequenceDiagram` | Not portable across markdown renderers; causes parse crashes. | Use `rect rgba(r,g,b,a) ... end` grouping. |
| Arrow pointing directly into `subgraph ID` | Mermaid poorly links container boundaries; distorts layouts. | Target named inner nodes: `A --> B` where B is inside the subgraph. |
| Unquoted special chars (`@`, `:`, `/`) | `@` immediately following `[` parses as `LINK_ID`, breaking syntax. | Always wrap node labels in double quotes: `NodeId["Label with: special chars"]`. |
| Emoji (✅ ⚠️ ❌ 🔲) inside node text | Distorts font baseline and causes cross-platform rendering glitches. | Reserve emojis for **Markdown tables only**. Use text `DONE`, `PARTIAL`, `OPEN`, `GATE` with status classes. |
| Reserved keywords as node IDs | Keywords like `end`, `subgraph`, `graph` abort parser. | Prefix IDs unambiguously: `StepEnd`, `DB_Store`, `Worker_Cashflow`. |
| Unlabeled cross-boundary arrows | Ambiguous communication protocols when read standalone. | Always label edges: `-->|DuckDB SQL|`, `-->|POST /v1/systemone|`. |
| `gantt` for platform rollout / roadmap | Renders poorly and truncates on mobile/narrow viewports. | Use `flowchart LR` or `flowchart TB` with `status*` classes. |

---

## 2. Standard Flowchart Palette (Catppuccin High-Contrast)

Declare once at the top of every `flowchart`:

```mermaid
flowchart TB
    classDef client fill:#1e1e2e,stroke:#89b4fa,stroke-width:2px,color:#cdd6f4;
    classDef edge fill:#181825,stroke:#fab387,stroke-width:2px,color:#cdd6f4;
    classDef service fill:#11111b,stroke:#a6e3a1,stroke-width:2px,color:#cdd6f4;
    classDef fallback fill:#0f766e,stroke:#14b8a6,stroke-width:2px,color:#cdd6f4;
    classDef queue fill:#313244,stroke:#f38ba8,stroke-width:2px,color:#cdd6f4;
    classDef data fill:#1e1e2e,stroke:#cba6f7,stroke-width:2px,color:#cdd6f4;
    
    classDef statusDone fill:#11111b,stroke:#a6e3a1,stroke-width:2px,color:#cdd6f4;
    classDef statusPartial fill:#1e1e2e,stroke:#fab387,stroke-width:2px,color:#cdd6f4;
    classDef statusOpen fill:#1e1e2e,stroke:#94a3b8,stroke-width:2px,color:#cdd6f4;
    classDef statusGate fill:#1e3a8a,stroke:#3b82f6,stroke-width:2px,color:#ffffff;
```

### Semantic Class Mapping:
- `:::client`: User actors, UI Dashboards, Executive Cockpit, FM stations.
- `:::edge`: Dispatcher, Chief of Staff, L2 Jev Intent Router.
- `:::service`: Worker Agents, Computation engines, LLM facades.
- `:::data`: Datastores and databases (use cylinder: `[("Name")]:::data`).
- `:::queue`: Message brokers, event buses, background streams.
- `:::statusGate`: Decision checkpoints, Rubric Gates ($\ge 85$), payment guards.

---

## 3. Standard Sequence Diagram (`sequenceDiagram`)

- Explicit participants: `participant Dispatcher as Dispatcher (Chief of Staff)`
- Partitioning: `rect rgba(30, 58, 138, 0.15) ... end`
- Loop / Conditional: `loop Every Period` and `alt Verified / Rejected`
- Use exact API / SQL names on arrows.
