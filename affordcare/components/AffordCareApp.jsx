"use client";

import { useEffect, useRef } from "react";
import { useAffordCare } from "../lib/useAffordCare";
import Nav from "./Nav";
import SummaryBar from "./SummaryBar";
import Landing from "./Landing";
import Signup from "./Signup";
import Dashboard from "./sections/Dashboard";
import FinancialAssistance from "./sections/FinancialAssistance";
import Documents from "./sections/Documents";
import TrackStatus from "./sections/TrackStatus";
import Notifications from "./sections/Notifications";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  "financial-assistance": "Financial Assistance",
  documents: "Documents",
  track: "Application status",
  notifications: "Notifications",
};

export default function AffordCareApp() {
  const ac = useAffordCare();
  const { state } = ac;
  const unreadCount = state.notifications.filter((n) => !n.read).length;
  const headingRef = useRef(null);
  const isFirstRender = useRef(true);

  // Keep the browser tab title in sync with the active section -- many
  // screen readers announce title changes, which is the main orientation
  // cue in a single-page app where the URL doesn't change.
  useEffect(() => {
    if (state.stage === "landing") {
      document.title = "AffordCare";
    } else if (state.stage === "signup") {
      document.title = "Create Account — AffordCare";
    } else {
      document.title = `${PAGE_TITLES[state.stage]} — AffordCare`;
    }
  }, [state.stage]);

  // Move keyboard/screen-reader focus to the new section's heading whenever
  // the person navigates. Without this, focus silently stays on the nav
  // button that was just clicked and screen reader users get no indication
  // the page changed.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [state.stage]);

  if (state.stage === "landing") {
    return <Landing onGetStarted={() => ac.goToStage("signup")} />;
  }

  if (state.stage === "signup") {
    return (
      <Signup
        onCreateAccount={ac.createAccount}
        onContinue={() => ac.goToStage("dashboard")}
        onCancel={() => ac.goToStage("landing")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <span className="font-display text-2xl text-harbor-dark block">AffordCare</span>
          <span className="text-sm text-muted">Financial assistance made simple</span>
        </div>
      </header>

      <main id="main-content" className="max-w-3xl mx-auto px-4 py-6" tabIndex={-1}>
        <Nav stage={state.stage} onNavigate={ac.goToStage} unreadCount={unreadCount} />

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-xl mb-4 outline-none"
        >
          {PAGE_TITLES[state.stage]}
        </h1>

        {/* Announces the new page to screen reader users a beat after focus
            moves, since some screen readers don't reliably announce a
            programmatically focused heading on its own. */}
        <span aria-live="polite" className="sr-only">
          {PAGE_TITLES[state.stage]} page loaded
        </span>

        <SummaryBar state={state} savingsFound={ac.savingsFound} />

        {state.toast && (
          <div
            className="bg-white border-2 border-harbor rounded-xl p-3 mb-4"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm text-harbor-dark m-0">{state.toast}</p>
          </div>
        )}

        {state.stage === "dashboard" && (
          <Dashboard
            state={state}
            nextAction={ac.nextAction}
            onNavigate={ac.goToStage}
            onEditInfo={() =>
              ac.patch({
                stage: "financial-assistance",
                wizardStep: 1,
                wizardFurthest: Math.max(state.wizardFurthest, 1),
              })
            }
          />
        )}

        {state.stage === "financial-assistance" && (
          <FinancialAssistance
            state={state}
            patch={ac.patch}
            patchNested={ac.patchNested}
            runCalcCost={ac.runCalcCost}
            selectProgram={ac.selectProgram}
            wizardBack={ac.wizardBack}
            wizardNext={ac.wizardNext}
            wizardGoto={ac.wizardGoto}
            saveAndExit={ac.saveAndExit}
            submitEnrollment={ac.submitEnrollment}
            goToDocuments={ac.goToDocuments}
          />
        )}

        {state.stage === "documents" && (
          <Documents
            state={state}
            uploadDoc={ac.uploadDoc}
            removeDoc={ac.removeDoc}
            allDocsUploaded={ac.allDocsUploaded}
            goToTrackFromDocuments={ac.goToTrackFromDocuments}
          />
        )}

        {state.stage === "track" && <TrackStatus state={state} advanceStatus={ac.advanceStatus} />}

        {state.stage === "notifications" && (
          <Notifications state={state} markNotificationRead={ac.markNotificationRead} />
        )}
      </main>
    </div>
  );
}
