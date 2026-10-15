---
name: fineso-cashflow-forecast
description: Build and reconcile the 13-week rolling cashflow forecast model
---

# 13-Week Cashflow Forecasting Skill

1. **Collect Three Mandatory Data Inputs**:
   - Available bank cash balance (Bank Cash Balance).
   - Expected cash inflows based on accounts receivable aging schedules and confirmed orders (Cash Inflow).
   - Fixed outflows (payroll, rent) and scheduled accounts payable to suppliers (Cash Outflow).
2. **Simulate 13 Continuous Weeks**:
   - Identify the deepest cash deficit / dip point.
   - Trigger a critical alert if projected cash in any given week drops below the configured safety reserve threshold.
3. **Attach Evidence**: Reference bank statement snapshots and overdue debt aging tables.
