---
description: Trigger for FinESO Mermaid verification
version: "1.0.0"
alwaysApply: false
triggerOn: mermaid
# When a markdown file contains a mermaid block, this rule loads and runs the verification rule `fineso.doc.mermaid.verify.md`.
invokeRule: fineso.doc.mermaid.verify.md
---

# No additional checks – this rule simply forwards execution to the verification rule.
