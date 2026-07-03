"use client";

import { useRef, useState } from "react";
import Icon from "../Icon";
import { INSURERS, INCOME_LABELS } from "../../lib/data";

const STEPS = [
  { n: 1, label: "Your information" },
  { n: 2, label: "Consent" },
  { n: 3, label: "Review" },
];

function ProgressNav({ wizardStep, wizardFurthest, wizardGoto }) {
  return (
    <nav aria-label="Enrollment steps" className="mb-6">
      <ol className="flex list-none p-0 m-0 gap-1">
        {STEPS.map((s) => {
          const completed = s.n < wizardStep;
          const current = s.n === wizardStep;
          const reachable = s.n <= wizardFurthest;
          return (
            <li key={s.n} className="flex-1 text-center">
              <button
                onClick={() => wizardGoto(s.n)}
                disabled={!reachable}
                aria-current={current ? "step" : undefined}
                aria-label={`Step ${s.n} of ${STEPS.length}: ${s.label}${
                  completed ? ", completed" : current ? ", current step" : ""
                }`}
                className={`w-full min-h-[44px] border-t-2 py-1 px-1 bg-transparent ${
                  current || completed ? "border-harbor" : "border-border"
                } ${reachable ? "" : "opacity-40 cursor-default"}`}
              >
                <span
                  className={`block text-xs ${
                    current ? "text-harbor font-medium" : completed ? "text-muted" : "text-faint"
                  }`}
                >
                  {completed && <Icon name="Check" size={11} className="inline -mt-0.5 mr-0.5" />}
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function Enroll({
  state,
  patchNested,
  wizardBack,
  wizardNext,
  wizardGoto,
  saveAndExit,
  submitEnrollment,
  goToDocuments,
  onGoToProfile,
}) {
  const [errors, setErrors] = useState({});
  const shareRef = useRef(null);

  if (!state.selectedProgram) {
    return (
      <div className="bg-white rounded-xl border border-border p-5">
        <p className="text-sm text-muted">Apply to a program above before enrolling.</p>
      </div>
    );
  }

  if (state.enrollment.submitted) {
    return (
      <div className="bg-white rounded-xl border border-border p-8 text-center">
        <Icon name="Check" className="text-success-dark mx-auto" size={32} />
        <div className="font-medium mt-2">Enrollment submitted</div>
        <p className="text-sm text-muted mt-1 mb-4">
          Next, upload your documents so we can process your application.
        </p>
        <button
          onClick={goToDocuments}
          className="inline-flex items-center gap-1.5 text-sm border border-harbor text-harbor rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-harbor-light transition-colors"
        >
          Go to documents <Icon name="ArrowRight" size={15} />
        </button>
      </div>
    );
  }

  const p = state.personal;
  const ins = state.insuranceInfo;
  const isUninsured = INSURERS.find((i) => i.id === ins.insurerId)?.category === "uninsured";
  const inc = state.income;
  const con = state.consent;
  const step = state.wizardStep;

  const profileComplete = Boolean(
    p.name && p.email && p.address && p.city && p.stateAbbr && p.zip
  );

  function validateStep1() {
    const e = {};
    if (!profileComplete) e.profile = "Complete your Patient Profile before continuing.";
    return e;
  }

  function validateStep2() {
    const e = {};
    if (!con.share) e.share = "You must authorize sharing your information to continue.";
    if (!con.terms) e.terms = "You must agree to the program terms to continue.";
    return e;
  }

  function handleNext() {
    let stepErrors = {};
    if (step === 1) stepErrors = validateStep1();
    else if (step === 2) stepErrors = validateStep2();

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      if (stepErrors.share && shareRef.current) shareRef.current.focus();
      return;
    }
    setErrors({});
    wizardNext();
  }

  const errorCount = Object.keys(errors).length;

  return (
    <div>
      <ProgressNav wizardStep={step} wizardFurthest={state.wizardFurthest} wizardGoto={wizardGoto} />

      <span aria-live="assertive" className="sr-only">
        {errorCount > 0 ? `${errorCount} item${errorCount > 1 ? "s" : ""} need attention.` : ""}
      </span>

      {step === 1 && (
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs text-muted font-normal m-0">Step 1 of 3 — Your information</h2>
            <button onClick={onGoToProfile} className="text-sm text-harbor-dark min-h-[44px] px-2">
              Edit in Profile
            </button>
          </div>

          {errors.profile && (
            <p role="alert" className="text-sm text-danger bg-danger-light rounded-lg p-3 mb-3">
              {errors.profile}{" "}
              <button onClick={onGoToProfile} className="underline font-medium">
                Go to Patient Profile
              </button>
            </p>
          )}

          <h3 className="text-sm font-medium mb-1">Personal</h3>
          <p className="text-sm text-muted mb-3">
            {p.name || "—"} · {p.dob || "—"} · {p.email || "—"}
            <br />
            {p.address || "—"}, {p.city || "—"} {p.stateAbbr} {p.zip}
          </p>

          <h3 className="text-sm font-medium mb-1">Insurance</h3>
          <p className="text-sm text-muted mb-3">
            {isUninsured
              ? `${INSURERS.find((i) => i.id === ins.insurerId)?.name || "—"} · no insurance details needed`
              : `${INSURERS.find((i) => i.id === ins.insurerId)?.name || "—"} · Member ID ${
                  ins.memberId || "—"
                } · Group ${ins.groupNumber || "—"}`}
          </p>

          <h3 className="text-sm font-medium mb-1">Income</h3>
          <p className="text-sm text-muted m-0">
            Household size {inc.householdSize || "—"} · {INCOME_LABELS[inc.incomeRange] || "—"}
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="text-xs text-muted mb-3 font-normal">Step 2 of 3 — Consent</h2>
          <fieldset className="border-0 p-0 m-0">
            <legend className="sr-only">Consent to share information and program terms</legend>
            <label className="flex items-start gap-2 text-sm mb-1">
              <input
                ref={shareRef}
                type="checkbox"
                checked={con.share}
                required
                aria-required="true"
                aria-invalid={errors.share ? "true" : "false"}
                aria-describedby={errors.share ? "share-error" : undefined}
                onChange={(e) => patchNested("consent", { share: e.target.checked })}
                className="mt-0.5 w-5 h-5"
              />
              I authorize AffordCare to share my information with the selected assistance program for
              enrollment review.
            </label>
            {errors.share && (
              <p id="share-error" role="alert" className="text-sm text-danger mb-2 ml-7">
                {errors.share}
              </p>
            )}
            <label className="flex items-start gap-2 text-sm mb-1 mt-2">
              <input
                type="checkbox"
                checked={con.terms}
                required
                aria-required="true"
                aria-invalid={errors.terms ? "true" : "false"}
                aria-describedby={errors.terms ? "terms-error" : undefined}
                onChange={(e) => patchNested("consent", { terms: e.target.checked })}
                className="mt-0.5 w-5 h-5"
              />
              I agree to the program terms and the AffordCare privacy policy.
            </label>
            {errors.terms && (
              <p id="terms-error" role="alert" className="text-sm text-danger ml-7">
                {errors.terms}
              </p>
            )}
          </fieldset>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="text-xs text-muted mb-3 font-normal">Step 3 of 3 — Review</h2>

          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium m-0">Your information</h3>
            <button onClick={() => wizardGoto(1)} className="text-sm text-harbor min-h-[44px] px-2">
              Review<span className="sr-only"> your information</span>
            </button>
          </div>
          <p className="text-sm text-muted mb-3">
            {p.name || "—"} · {p.email || "—"} ·{" "}
            {isUninsured ? "Uninsured / self-pay" : INSURERS.find((i) => i.id === ins.insurerId)?.name}
          </p>

          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium m-0">Consent</h3>
            <button onClick={() => wizardGoto(2)} className="text-sm text-harbor min-h-[44px] px-2">
              Edit<span className="sr-only"> consent</span>
            </button>
          </div>
          <p className="text-sm text-muted">
            {con.share && con.terms ? "Authorized" : "Incomplete — return to step 2"}
          </p>
        </div>
      )}

      <div className="flex justify-between gap-2 mt-4">
        <div>
          {step > 1 && (
            <button
              onClick={wizardBack}
              className="text-sm border border-border rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-white"
            >
              Back
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={saveAndExit}
            className="text-sm border border-border rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-white"
          >
            Save & resume later
          </button>
          {step === STEPS.length ? (
            <button
              onClick={submitEnrollment}
              className="text-sm border border-harbor text-harbor rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-harbor-light transition-colors"
            >
              Submit application
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 text-sm border border-harbor text-harbor rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-harbor-light transition-colors"
            >
              Next <Icon name="ArrowRight" size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
