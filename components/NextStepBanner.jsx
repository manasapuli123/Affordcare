"use client";

import Icon from "./Icon";

export default function NextStepBanner({ nextAction, currentStage, onNavigate }) {
  if (nextAction.stage === currentStage) return null;

  return (
    <div
      className="bg-white rounded-xl border-2 border-harbor p-5 mb-3"
      role="region"
      aria-labelledby="next-step-heading"
    >
      <div className="flex gap-3 items-start">
        <Icon name={nextAction.icon} className="text-harbor-dark mt-0.5" size={20} />
        <div className="flex-1">
          <h2 id="next-step-heading" className="text-xs text-harbor-dark mb-0.5 font-normal">
            Next recommended step
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
  );
}
