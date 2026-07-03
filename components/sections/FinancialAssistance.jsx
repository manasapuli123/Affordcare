"use client";

import Icon from "../Icon";
import Affordability from "./Affordability";

export default function FinancialAssistance(props) {
  return (
    <div>
      <Affordability
        state={props.state}
        selectProgram={props.selectProgram}
        onGoToDashboard={props.onGoToDashboard}
      />

      {props.state.selectedProgram && !props.state.enrollment.submitted && (
        <div className="bg-white rounded-xl border-2 border-harbor p-5 mt-3">
          <p className="text-sm font-medium mb-1">
            You've applied to{" "}
            {props.state.programs.find((pr) => pr.id === props.state.selectedProgram)?.name}.
          </p>
          <p className="text-sm text-muted mb-3">
            Continue to the Enrollment section to finish your application.
          </p>
          <button
            onClick={props.onGoToEnrollment}
            className="inline-flex items-center gap-1.5 text-sm border border-harbor text-harbor rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-harbor-light transition-colors"
          >
            Go to Enrollment <Icon name="ArrowRight" size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
