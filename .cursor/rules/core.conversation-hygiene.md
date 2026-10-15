---
description: Token efficiency and context hygiene discipline for FinESO
globs: *
alwaysApply: true
---

# Token Efficiency & Context Hygiene Discipline

1. **AgentMemory First**: Call `memory_smart_search` at turn start to retrieve relevant session context efficiently.
2. **Docgraph & Codegraph First**: Use specialized tools to look up symbols/concepts; avoid unguided global greps that blow up context.
3. **Range-Read (Slice Reading)**: When viewing files larger than 100 lines, explicitly specify `StartLine` and `EndLine`.
4. **Shell Output Limit**: Limit shell output to $\le 30$ lines using pipes such as `tail -n 25` or `head -n 30`.
5. **Memory Save**: Call `memory_save` at session completion to distill architectural decisions and key learnings into long-term memory.
