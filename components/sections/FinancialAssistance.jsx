"use client";

import Affordability from "./Affordability";
import Enroll from "./Enroll";

export default function FinancialAssistance(props) {
  return (
    <div>
      <Affordability
        state={props.state}
        selectProgram={props.selectProgram}
        onGoToDashboard={props.onGoToDashboard}
      />

      {props.state.selectedProgram && (
        <div className="mt-6 pt-6 border-t border-border">
          <h2 className="text-sm font-medium text-muted mb-3">Enrollment</h2>
          <Enroll
            state={props.state}
            patchNested={props.patchNested}
            wizardBack={props.wizardBack}
            wizardNext={props.wizardNext}
            wizardGoto={props.wizardGoto}
            saveAndExit={props.saveAndExit}
            submitEnrollment={props.submitEnrollment}
            goToDocuments={props.goToDocuments}
          />
        </div>
      )}
    </div>
  );
}
