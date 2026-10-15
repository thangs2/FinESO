---
name: fineso-mermaid-diagrams
description: Creates, audits, and fixes Mermaid flowcharts and sequence diagrams in FinESO according to the x79 Catppuccin Golden Reference standard
---

# FinESO Mermaid Diagram Skill

**Mandatory Rule:** `fineso.doc.mermaid.mdc`

## Quick Checklist Before Saving
1. **No inline `style`**: Did you use `classDef` + `:::class`?
2. **No `box` in sequence**: Did you use `rect rgba(...)`?
3. **Quoted labels**: Are labels with colons, slashes, or parentheses wrapped in quotes `Node["..."\]`?
4. **No emojis in nodes**: Are emojis confined to markdown tables, with nodes using clean status labels?
5. **Inner-subgraph edges**: Do arrows connect nodes inside subgraphs rather than the subgraph container?

## Standard Palette Snippet
```mermaid
flowchart TB
    classDef client fill:#1e1e2e,stroke:#89b4fa,stroke-width:2px,color:#cdd6f4;
    classDef edge fill:#181825,stroke:#fab387,stroke-width:2px,color:#cdd6f4;
    classDef service fill:#11111b,stroke:#a6e3a1,stroke-width:2px,color:#cdd6f4;
    classDef fallback fill:#0f766e,stroke:#14b8a6,stroke-width:2px,color:#cdd6f4;
    classDef queue fill:#313244,stroke:#f38ba8,stroke-width:2px,color:#cdd6f4;
    classDef data fill:#1e1e2e,stroke:#cba6f7,stroke-width:2px,color:#cdd6f4;
    classDef statusGate fill:#1e3a8a,stroke:#3b82f6,stroke-width:2px,color:#ffffff;
```
