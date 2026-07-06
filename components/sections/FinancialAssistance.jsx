"use client";

import { useEffect, useRef, useState } from "react";
import Affordability from "./Affordability";
import Modal from "../Modal";

export default function FinancialAssistance(props) {
  const [showModal, setShowModal] = useState(false);
  const isFirstRun = useRef(true);

  // Pop up right after a program is selected -- but not just from
  // navigating back to this page with a program already selected.
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (props.state.selectedProgram) setShowModal(true);
  }, [props.state.selectedProgram]);

  const programName = props.state.programs.find((pr) => pr.id === props.state.selectedProgram)?.name;

  return (
    <div>
      <Affordability
        state={props.state}
        selectProgram={props.selectProgram}
        onGoToDashboard={props.onGoToDashboard}
      />

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Program selected"
        primaryLabel="Go to Enrollment"
        onPrimary={props.onGoToEnrollment}
      >
        You've selected {programName}. Continue to the Enrollment section to finish your application.
      </Modal>
    </div>
  );
}
