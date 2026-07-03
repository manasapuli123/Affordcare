"use client";

import Icon from "../Icon";
import { MEDS, INSURERS, INCOME_LABELS, fmt } from "../../lib/data";

const ELIGIBILITY_TONE = {
  eligible: "bg-success-light text-success-dark",
  likely: "bg-warning-light text-warning-dark",
  ineligible: "bg-border text-muted",
};

const CATEGORY_LABEL = {
  copay_card: "Copay assistance",
  pap: "Free drug program",
  foundation: "Copay grant",
};

const CATEGORY_STYLE = {
  harbor: { icon: "text-harbor-dark", chip: "bg-harbor-light text-harbor-dark", edge: "border-l-harbor" },
  plum: { icon: "text-plum-dark", chip: "bg-plum-light text-plum-dark", edge: "border-l-plum" },
  gold: { icon: "text-gold-dark", chip: "bg-gold-light text-gold-dark", edge: "border-l-gold" },
};

export default function Affordability({ state, patch, runCalcCost, selectProgram }) {
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
            eligibility result below.
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
        <>
          <h2 className="sr-only">Your cost estimate</h2>
          <div className="bg-white rounded-xl border border-border p-5 mb-3">
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

          <h2 className="text-sm font-medium mb-3">Assistance programs matched to your coverage</h2>
          <p className="text-xs text-muted mb-3">
            {state.costResult.zip && state.incomeRange
              ? "Eligibility below reflects your insurance, ZIP code, and household income."
              : "Eligibility below reflects your insurance and ZIP code. Add your household income above for a more accurate result."}
          </p>
          {state.programs.map((p) => {
            const selected = state.selectedProgram === p.id;
            const style = CATEGORY_STYLE[p.color] || CATEGORY_STYLE.harbor;
            return (
              <div
                key={p.id}
                className={`bg-white rounded-xl p-5 mb-3 border-l-4 ${style.edge} ${
                  selected ? "border-2 border-l-4 border-harbor" : "border border-border"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <Icon name={p.icon} className={style.icon} size={20} />
                  <h3 className="text-sm font-medium m-0">{p.name}</h3>
                </div>
                <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full mb-3 ${style.chip}`}>
                  {CATEGORY_LABEL[p.id]}
                </span>
                <div className="mb-2">
                  <span className="text-xs text-muted">Eligibility</span>
                  <div className="mt-1">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full ${ELIGIBILITY_TONE[p.eligibility.status]}`}>
                      {p.eligibility.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted mt-1">{p.eligibility.reason}</p>
                </div>
                <div className="mb-3">
                  <span className="text-xs text-muted">Benefits</span>
                  <p className="text-sm mt-0.5">{p.benefits}</p>
                </div>
                {p.eligibility.status === "ineligible" ? (
                  <p className="text-sm text-muted">Not available for this program.</p>
                ) : (
                  <button
                    onClick={() => selectProgram(p.id)}
                    aria-label={selected ? `Applied to ${p.name}` : `Apply to ${p.name}`}
                    className={`text-sm rounded-lg px-4 py-2.5 min-h-[44px] transition-colors ${
                      selected
                        ? "border border-harbor text-harbor bg-harbor-light"
                        : "border border-border hover:bg-paper"
                    }`}
                  >
                    {selected ? "Applied" : "Apply"}
                  </button>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
