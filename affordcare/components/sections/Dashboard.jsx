"use client";

import Icon from "../Icon";
import { MEDS, INSURERS, fmt } from "../../lib/data";

function StatusBadge({ children, tone }) {
  const tones = {
    gray: "bg-border text-muted",
    amber: "bg-warning-light text-warning-dark",
    blue: "bg-sky-light text-sky-dark",
    green: "bg-success-light text-success-dark",
  };
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full ${tones[tone]}`}>{children}</span>
  );
}

export default function Dashboard({ state, nextAction, onNavigate, onEditInfo }) {
  const med = MEDS.find((m) => m.id === state.medId);
  const insurer = INSURERS.find((i) => i.id === state.insurerId);

  let tone = "gray";
  let statusLabel = "Not started";
  let statusText = "Get an estimate to see where you stand.";
  if (state.costResult && !state.selectedProgram) {
    tone = "amber";
    statusLabel = "Cost estimated";
    statusText = "Programs are available to lower this cost.";
  } else if (state.selectedProgram && !state.enrollment.submitted) {
    tone = "amber";
    statusLabel = "Program selected";
    statusText = "Enroll to start using your savings.";
  } else if (state.enrollment.submitted && state.appStatusIndex < 5) {
    tone = "blue";
    statusLabel = "Application in review";
    statusText = "We are processing your enrollment.";
  } else if (state.appStatusIndex >= 5) {
    tone = "green";
    statusLabel = "Active";
    statusText = "Your assistance is active and ready to use.";
  }

  return (
    <div>
      <div className="bg-white rounded-xl border border-border p-5 mb-3">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-display text-lg mb-1">Welcome</h2>
            <p className="text-sm text-muted">{statusText}</p>
          </div>
          {state.personal.name && (
            <button
              onClick={onEditInfo}
              className="text-sm text-harbor-dark min-h-[44px] px-2 whitespace-nowrap"
            >
              Edit my information
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2 text-muted">
            <Icon name="Pill" size={17} />
            <span className="text-xs">Medication</span>
          </div>
          <div className="text-sm font-medium">{med.name}</div>
          {state.costResult ? (
            <div className="text-xs text-muted mt-1">List price {fmt(med.price)}/mo</div>
          ) : (
            <div className="text-xs text-faint mt-1">No estimate on file</div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2 text-muted">
            <Icon name="Shield" size={17} />
            <span className="text-xs">Insurance</span>
          </div>
          <div className="text-sm font-medium">{insurer.name}</div>
          {state.costResult ? (
            <div className="text-xs text-muted mt-1">
              {Math.round(state.costResult.coverage * 100)}% estimated coverage · {state.costResult.zip}
            </div>
          ) : (
            <div className="text-xs text-faint mt-1">No estimate on file</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium m-0">Affordability status</h2>
          <StatusBadge tone={tone}>{statusLabel}</StatusBadge>
        </div>
        <div className="flex justify-between text-sm py-1">
          <span className="text-muted">Estimated monthly cost</span>
          <span className="font-mono">{state.costResult ? fmt(state.costResult.monthlyOOP) : "—"}</span>
        </div>
        <div className="flex justify-between text-sm py-1">
          <span className="text-muted">Program selected</span>
          <span>
            {state.selectedProgram
              ? state.programs.find((p) => p.id === state.selectedProgram)?.name
              : "—"}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-harbor p-5" role="region" aria-labelledby="next-action-heading">
        <div className="flex gap-3 items-start">
          <Icon name={nextAction.icon} className="text-harbor-dark mt-0.5" size={20} />
          <div className="flex-1">
            <h2 id="next-action-heading" className="text-xs text-harbor-dark mb-0.5 font-normal">
              Next recommended action
            </h2>
            <p className="text-sm font-medium mb-1">{nextAction.label}</p>
            <p className="text-sm text-muted mb-3">{nextAction.desc}</p>
            <button
              onClick={() => onNavigate(nextAction.stage)}
              className="inline-flex items-center gap-1.5 text-sm border border-harbor text-harbor rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-harbor-light transition-colors"
            >
              Continue <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
