"use client";

import { useEffect, useRef, useState } from "react";
import CostEstimator from "../CostEstimator";
import Modal from "../Modal";

export default function Dashboard({ state, patch, runCalcCost, onGoToFinancialAssistance }) {
  const displayName = state.account?.name ? state.account.name.split(" ")[0] : null;
  const [showModal, setShowModal] = useState(false);
  const isFirstRun = useRef(true);

  // Pop up right after a cost estimate finishes calculating -- but not just
  // from navigating back to a Dashboard that already has a saved estimate.
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (state.costResult) setShowModal(true);
  }, [state.costResult]);

  return (
    <div>
      <div className="bg-white rounded-xl border border-border p-5 mb-3">
        <h2 className="font-display text-lg mb-1">
          {displayName ? `Welcome, ${displayName}` : "Welcome"}
        </h2>
        <p className="text-sm text-muted">Estimate your medication cost to get started.</p>
      </div>

      <CostEstimator state={state} patch={patch} runCalcCost={runCalcCost} />

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Your estimate is ready"
        primaryLabel="Go to Financial Assistance"
        onPrimary={onGoToFinancialAssistance}
      >
        See which copay cards, patient assistance programs, and foundation grants you may qualify for.
      </Modal>
    </div>
  );
}
