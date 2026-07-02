"use client";

import { fmt } from "../lib/data";

export default function SummaryBar({ state, savingsFound }) {
  const cost = state.costResult ? fmt(state.costResult.monthlyOOP) : "—";
  const savings = state.selectedProgram ? `${fmt(savingsFound)}/mo` : "—";

  return (
    <div className="grid grid-cols-2 gap-3 mb-6" aria-live="polite">
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="text-xs text-muted mb-1" id="cost-summary-label">
          Estimated monthly cost
        </div>
        <div className="font-mono text-2xl" aria-labelledby="cost-summary-label">
          {cost}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="text-xs text-muted mb-1" id="savings-summary-label">
          Savings identified
        </div>
        <div className="font-mono text-2xl text-success-dark" aria-labelledby="savings-summary-label">
          {savings}
        </div>
      </div>
    </div>
  );
}
