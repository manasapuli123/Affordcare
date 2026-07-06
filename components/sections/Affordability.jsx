"use client";

import Icon from "../Icon";
import { fmt } from "../../lib/data";

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

export default function Affordability({ state, selectProgram, onGoToDashboard }) {
  if (!state.costResult) {
    return (
      <div className="bg-white rounded-xl border border-border p-5">
        <p className="text-sm text-muted mb-3">
          Estimate your medication cost on the Dashboard first, and matched assistance programs will
          show up here.
        </p>
        <button
          onClick={onGoToDashboard}
          className="text-sm border border-harbor text-harbor rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-harbor-light transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="sr-only">Your cost estimate</h2>
      <div className="bg-white rounded-xl border border-border p-5 mb-3">
        <div className="flex justify-between text-sm py-1">
          <span className="text-muted">Medication</span>
          <span>{state.costResult.med.name}</span>
        </div>
        <div className="flex justify-between text-sm py-1">
          <span className="text-muted">Insurance</span>
          <span>{state.costResult.insurer.name}</span>
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
          : "Eligibility below reflects your insurance and ZIP code. Add your household income from the Dashboard estimator for a more accurate result."}
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
                aria-label={selected ? `Selected ${p.name}` : `Select ${p.name}`}
                className={`text-sm rounded-lg px-4 py-2.5 min-h-[44px] transition-colors ${
                  selected
                    ? "border border-harbor text-harbor bg-harbor-light"
                    : "border border-border hover:bg-paper"
                }`}
              >
                {selected ? "Selected" : "Select"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
