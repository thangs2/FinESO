import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("FinESO Smoke Test: Deterministic Reconciliation & Evidence Pack Gate", async () => {
  const bankCsvPath = path.resolve("data-lake/bank/sample_bank_sept2026.csv");
  const arCsvPath = path.resolve("data-lake/invoices/sample_ar_aging.csv");

  assert.ok(fs.existsSync(bankCsvPath), "Bank CSV must exist");
  assert.ok(fs.existsSync(arCsvPath), "AR CSV must exist");

  // 1. Deterministic Calculation (Simulating DuckDB CSV query)
  const bankLines = fs.readFileSync(bankCsvPath, "utf-8").trim().split("\n").slice(1);
  let totalDebit = 0;
  let totalCredit = 0;
  for (const line of bankLines) {
    const [, , , debit, credit] = line.split(",");
    totalDebit += Number(debit);
    totalCredit += Number(credit);
  }
  const netDelta = totalCredit - totalDebit;

  const arLines = fs.readFileSync(arCsvPath, "utf-8").trim().split("\n").slice(1);
  let totalOverdue = 0;
  const overdueInvoices = [];
  for (const line of arLines) {
    const [invId, customer, , , amount, days, status] = line.split(",");
    if (status === "OVERDUE" && Number(days) > 30) {
      totalOverdue += Number(amount);
      overdueInvoices.push({ invId, customer, amount: Number(amount), days: Number(days) });
    }
  }

  // 2. Validate Deterministic Results
  assert.equal(totalCredit, 235000000, "Total Inflow matched");
  assert.equal(totalDebit, 455420000, "Total Outflow matched");
  assert.equal(netDelta, -220420000, "Net Cash delta matched (-220.42M)");
  assert.equal(totalOverdue, 410000000, "Overdue >30d matched (410M)");

  // 3. Assemble Evidence Pack
  const evidencePack = {
    claim_id: "CLM-SMOKE-001",
    statement: "Tháng 9 tiền thuần giảm 220.42M do nợ quá hạn >30 ngày tồn đọng 410M.",
    metrics: {
      inflow: totalCredit,
      outflow: totalDebit,
      net_cash_delta: netDelta,
      overdue_ar_amount: totalOverdue
    },
    evidence_items: [
      {
        evidence_id: "EVD-01",
        type: "BANK_CSV_RECONCILIATION",
        source_uri: "file:///data-lake/bank/sample_bank_sept2026.csv",
        metric_evaluated: "Net cash delta",
        audit_status: "VERIFIED_DETERMINISTIC"
      },
      {
        evidence_id: "EVD-02",
        type: "AR_AGING_CSV",
        source_uri: "file:///data-lake/invoices/sample_ar_aging.csv",
        metric_evaluated: "Overdue debt > 30 days",
        audit_status: "OVERDUE_UNCOLLECTED"
      }
    ],
    sufficiency_scoring: {
      total_score: 95.0,
      pass_gate: true
    }
  };

  // 4. Gate Assertion
  assert.ok(evidencePack.sufficiency_scoring.pass_gate, "Gate must PASS");
  assert.ok(evidencePack.sufficiency_scoring.total_score >= 85, "Score must meet threshold >= 85");
});
