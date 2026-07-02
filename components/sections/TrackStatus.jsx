"use client";

import Icon from "../Icon";
import { TRACK_STAGES } from "../../lib/data";

export default function TrackStatus({ state, advanceStatus }) {
  if (state.appStatusIndex < 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-5">
        <p className="text-sm text-muted">Submit your enrollment to start tracking your application.</p>
      </div>
    );
  }

  const currentStage = TRACK_STAGES[state.appStatusIndex];

  return (
    <div>
      <ol className="bg-white rounded-xl border border-border p-2 list-none m-0" aria-label="Application progress">
        {TRACK_STAGES.map((s, i) => {
          let icon = null;
          let colorClass = "text-faint";
          let label = "Pending";
          if (i < state.appStatusIndex) {
            icon = "Check";
            colorClass = "text-success-dark";
            label = "Complete";
          } else if (i === state.appStatusIndex) {
            icon = "Clock";
            colorClass = "text-harbor-dark";
            label = "In progress";
          }
          return (
            <li
              key={s.id}
              className="flex justify-between items-center px-3 py-2.5 border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-2.5">
                <div
                  aria-hidden="true"
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    i <= state.appStatusIndex ? "" : "border border-border"
                  }`}
                >
                  {icon && <Icon name={icon} className={colorClass} size={14} />}
                </div>
                <span className={`text-sm ${i <= state.appStatusIndex ? "text-ink" : "text-faint"}`}>
                  {s.label}
                </span>
              </div>
              <span className={`text-sm ${colorClass}`}>{label}</span>
            </li>
          );
        })}
      </ol>

      <span aria-live="polite" className="sr-only">
        Application status: {currentStage ? `${currentStage.label}, in progress` : "Medication ready, complete"}
      </span>

      {state.appStatusIndex < 5 ? (
        <button
          onClick={advanceStatus}
          className="inline-flex items-center gap-1.5 text-sm border border-harbor text-harbor rounded-lg px-4 py-2.5 min-h-[44px] mt-3 hover:bg-harbor-light transition-colors"
        >
          Simulate progress <Icon name="ArrowRight" size={15} />
        </button>
      ) : (
        <p className="text-sm text-muted mt-3">Your medication is ready. Present your card at the pharmacy.</p>
      )}
    </div>
  );
}
