"use client";

import { MEDS, INSURERS, INCOME_LABELS, fmt } from "../lib/data";

export default function CostEstimator({ state, patch, runCalcCost }) {
  return (
    <div>
      <form
        className="bg-white rounded-xl border border-border p-5 mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          runCalcCost();
        }}
      >
        <fieldset className="border-0 p-0 m-0">
          <legend className="text-sm font-medium mb-3">Estimate your medication cost</legend>

          <label className="block text-sm text-muted mb-1" htmlFor="medSel">
            Medication
          </label>
          <select
            id="medSel"
            className="w-full mb-3 h-11 rounded-lg border border-border px-3 bg-white"
            value={state.medId}
            onChange={(e) => patch({ medId: e.target.value })}
          >
            {MEDS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <label className="block text-sm text-muted mb-1" htmlFor="insurerSel">
            Insurance provider
          </label>
          <select
            id="insurerSel"
            className="w-full mb-3 h-11 rounded-lg border border-border px-3 bg-white"
            value={state.insurerId}
            onChange={(e) => patch({ insurerId: e.target.value })}
          >
            {INSURERS.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>

          <label className="block text-sm text-muted mb-1" htmlFor="zipInp">
            ZIP code <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="zipInp"
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="94103"
            required
            aria-required="true"
            aria-invalid={state.zipError ? "true" : "false"}
            aria-describedby={state.zipError ? "zip-error" : "zip-hint"}
            value={state.zip}
            onChange={(e) => patch({ zip: e.target.value.replace(/[^0-9]/g, "").slice(0, 5), zipError: false })}
            className={`w-full h-11 rounded-lg border px-3 mb-1 ${
              state.zipError ? "border-danger" : "border-border"
            }`}
          />
          {state.zipError ? (
            <p id="zip-error" role="alert" className="text-sm text-danger mb-3">
              Enter a valid 5-digit ZIP code.
            </p>
          ) : (
            <p id="zip-hint" className="text-xs text-muted mb-3">
              Used to estimate regional pricing. Not shared outside this estimate.
            </p>
          )}

          <label className="block text-sm text-muted mb-1" htmlFor="incomeSel">
            Annual household income
          </label>
          <select
            id="incomeSel"
            className="w-full mb-1 h-11 rounded-lg border border-border px-3 bg-white"
            value={state.incomeRange}
            aria-describedby="income-hint"
            onChange={(e) => patch({ incomeRange: e.target.value })}
          >
            <option value="">Prefer not to say</option>
            {Object.entries(INCOME_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
          <p id="income-hint" className="text-xs text-muted mb-3">
            Optional, but many assistance programs are income-based -- adding this gives a more accurate
            eligibility result on the Financial Assistance page.
          </p>

          <button
            type="submit"
            className="text-sm border border-harbor text-harbor rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-harbor-light transition-colors"
          >
            Calculate my cost
          </button>
        </fieldset>
      </form>

      {state.costResult && (
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex justify-between text-sm py-1">
            <span className="text-muted">List price</span>
            <span className="font-mono">{fmt(state.costResult.listPrice)}/mo</span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span className="text-muted">Regional adjustment ({state.costResult.regional.region})</span>
            <span className="font-mono">
              {state.costResult.regional.index > 1 ? "+" : ""}
              {Math.round((state.costResult.regional.index - 1) * 100)}%
            </span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span className="text-muted">Estimated insurance coverage</span>
            <span className="font-mono">{Math.round(state.costResult.coverage * 100)}%</span>
          </div>
          <div className="flex justify-between text-sm pt-2 mt-1 border-t border-border font-medium">
            <span>Your estimated cost</span>
            <span className="font-mono">{fmt(state.costResult.monthlyOOP)}/mo</span>
          </div>
        </div>
      )}
    </div>
  );
}
