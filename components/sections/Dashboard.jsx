"use client";

import CostEstimator from "../CostEstimator";

export default function Dashboard({ state, onEditInfo, patch, runCalcCost }) {
  const displayName = state.account?.name ? state.account.name.split(" ")[0] : null;

  return (
    <div>
      <div className="bg-white rounded-xl border border-border p-5 mb-3">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-display text-lg mb-1">
              {displayName ? `Welcome, ${displayName}` : "Welcome"}
            </h2>
            <p className="text-sm text-muted">Estimate your medication cost to get started.</p>
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

      <CostEstimator state={state} patch={patch} runCalcCost={runCalcCost} />
    </div>
  );
}
