"use client";

import { useRef, useState } from "react";
import Icon from "../Icon";
import { INSURERS, INCOME_LABELS } from "../../lib/data";

const STEPS = [
  { n: 1, label: "Your information" },
  { n: 2, label: "Consent" },
  { n: 3, label: "Review" },
];

const DOC_ITEMS = [
  { key: "insurance", label: "Insurance card", icon: "CreditCard" },
  { key: "income", label: "Income verification", icon: "Receipt" },
  { key: "prescription", label: "Prescription", icon: "FileText" },
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

function Field({ id, label, required, error, hint, children }) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(" ") || undefined;
  return (
    <div>
      <label className="block text-sm text-muted mb-1" htmlFor={id}>
        {label}
        {required && (
          <>
            {" "}
            <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </>
        )}
      </label>
      {children(describedBy)}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted mt-1">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-danger mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError) =>
  `w-full h-11 rounded-lg border px-3 ${hasError ? "border-danger" : "border-border"}`;

function DropZone({ item, doc, onUpload, onRemove }) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const hintId = `${item.key}-hint`;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onUpload(item.key, f.name);
      }}
      className={`bg-white rounded-xl p-6 mb-3 text-center border-2 border-dashed transition-colors ${
        dragOver ? "border-harbor bg-harbor-light" : "border-border"
      }`}
    >
      <Icon
        name={doc.uploaded ? "Check" : item.icon}
        className={doc.uploaded ? "text-success-dark mx-auto" : "text-muted mx-auto"}
        size={22}
      />
      <h3 className="text-sm font-medium mt-1.5 mb-0">{item.label}</h3>
      <div aria-live="polite" className="min-h-[1.25rem]">
        {doc.uploaded ? (
          <p className="text-sm text-muted mt-1">
            <span className="sr-only">Uploaded: </span>
            {doc.filename}
          </p>
        ) : (
          <p id={hintId} className="text-sm text-muted mt-1 mb-2">
            Drag a file here, or use the button below. Accepted files: PDF, JPG, or PNG.
          </p>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        aria-label={`Upload ${item.label}`}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(item.key, f.name);
        }}
      />
      {doc.uploaded ? (
        <button
          onClick={() => onRemove(item.key)}
          aria-label={`Remove uploaded ${item.label}, ${doc.filename}`}
          className="text-sm border border-border rounded-lg px-4 py-2.5 min-h-[44px] mt-2 hover:bg-paper"
        >
          Remove
        </button>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          aria-describedby={hintId}
          className="text-sm border border-border rounded-lg px-4 py-2.5 min-h-[44px] mt-1 hover:bg-paper"
        >
          Browse files<span className="sr-only"> for {item.label}</span>
        </button>
      )}
    </div>
  );
}

export default function Enrollment({
  state,
  patchNested,
  wizardBack,
  wizardNext,
  wizardGoto,
  saveAndExit,
  submitEnrollment,
  uploadDoc,
  removeDoc,
  allDocsUploaded,
  goToTrackFromDocuments,
}) {
  const [errors, setErrors] = useState({});
  const refs = {
    name: useRef(null),
    dob: useRef(null),
    email: useRef(null),
    address: useRef(null),
    city: useRef(null),
    stateAbbr: useRef(null),
    zip: useRef(null),
    memberId: useRef(null),
    share: useRef(null),
  };

  if (!state.selectedProgram) {
    return (
      <div className="bg-white rounded-xl border border-border p-5">
        <p className="text-sm text-muted">Apply to a program on Financial Assistance before enrolling.</p>
      </div>
    );
  }

  const p = state.personal;
  const ins = state.insuranceInfo;
  const isUninsured = INSURERS.find((i) => i.id === ins.insurerId)?.category === "uninsured";
  const inc = state.income;
  const con = state.consent;
  const step = state.wizardStep;

  // Once submitted, this section shows document upload instead of the wizard.
  if (state.enrollment.submitted) {
    return (
      <div>
        <div className="bg-white rounded-xl border border-border p-5 mb-3">
          <p className="text-sm text-muted m-0">
            Enrollment submitted. Upload the documents below to keep your application moving.
          </p>
        </div>
        {(isUninsured ? DOC_ITEMS.filter((it) => it.key !== "insurance") : DOC_ITEMS).map((item) => (
          <DropZone
            key={item.key}
            item={item}
            doc={state.docs[item.key]}
            onUpload={uploadDoc}
            onRemove={removeDoc}
          />
        ))}
        {allDocsUploaded ? (
          <button
            onClick={goToTrackFromDocuments}
            className="inline-flex items-center gap-1.5 text-sm border border-harbor text-harbor rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-harbor-light transition-colors"
          >
            All documents received — view status <Icon name="ArrowRight" size={15} />
          </button>
        ) : (
          <p className="text-sm text-muted">Upload all documents to keep your application moving.</p>
        )}
      </div>
    );
  }

  function validateStep1() {
    const e = {};
    if (!p.name.trim()) e.name = "Enter your full legal name.";
    if (!p.dob) e.dob = "Enter your date of birth.";
    if (!p.email.trim() || !p.email.includes("@")) e.email = "Enter a valid email address.";
    if (!p.address.trim()) e.address = "Enter your street address.";
    if (!p.city.trim()) e.city = "Enter your city.";
    if (!/^[A-Za-z]{2}$/.test(p.stateAbbr)) e.stateAbbr = "Enter a 2-letter state abbreviation.";
    if (!/^\d{5}$/.test(p.zip)) e.zip = "Enter a valid 5-digit ZIP code.";
    if (!isUninsured && !ins.memberId.trim()) e.memberId = "Enter your insurance member ID.";
    return e;
  }

  function validateStep2() {
    const e = {};
    if (!con.share) e.share = "You must authorize sharing your information to continue.";
    if (!con.terms) e.terms = "You must agree to the program terms to continue.";
    return e;
  }

  function focusFirstError(errs) {
    const order = ["name", "dob", "email", "address", "city", "stateAbbr", "zip", "memberId", "share"];
    for (const key of order) {
      if (errs[key] && refs[key]?.current) {
        refs[key].current.focus();
        return;
      }
    }
  }

  function handleNext() {
    let stepErrors = {};
    if (step === 1) stepErrors = validateStep1();
    else if (step === 2) stepErrors = validateStep2();

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      focusFirstError(stepErrors);
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
        {errorCount > 0 ? `${errorCount} field${errorCount > 1 ? "s" : ""} need attention.` : ""}
      </span>

      {step === 1 && (
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="text-xs text-muted mb-3 font-normal">Step 1 of 3 — Your information</h2>
          <p className="text-xs text-muted mb-3">
            This also updates your Patient Profile, and vice versa -- they always stay in sync.
          </p>

          <h3 className="text-sm font-medium mb-2">Personal</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field id="pName" label="Full legal name" required error={errors.name}>
              {(describedBy) => (
                <input
                  id="pName"
                  ref={refs.name}
                  className={inputClass(errors.name)}
                  value={p.name}
                  placeholder="Jordan Ellis"
                  aria-required="true"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={describedBy}
                  onChange={(e) => patchNested("personal", { name: e.target.value })}
                />
              )}
            </Field>
            <Field id="pDob" label="Date of birth" required error={errors.dob}>
              {(describedBy) => (
                <input
                  id="pDob"
                  ref={refs.dob}
                  type="date"
                  className={inputClass(errors.dob)}
                  value={p.dob}
                  aria-required="true"
                  aria-invalid={errors.dob ? "true" : "false"}
                  aria-describedby={describedBy}
                  onChange={(e) => patchNested("personal", { dob: e.target.value })}
                />
              )}
            </Field>
            <Field id="pPhone" label="Phone" hint="Optional">
              {(describedBy) => (
                <input
                  id="pPhone"
                  type="tel"
                  className={inputClass(false)}
                  value={p.phone}
                  placeholder="(555) 555-0100"
                  aria-describedby={describedBy}
                  onChange={(e) => patchNested("personal", { phone: e.target.value })}
                />
              )}
            </Field>
            <Field id="pEmail" label="Email" required error={errors.email}>
              {(describedBy) => (
                <input
                  id="pEmail"
                  ref={refs.email}
                  type="email"
                  className={inputClass(errors.email)}
                  value={p.email}
                  placeholder="jordan@email.com"
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={describedBy}
                  onChange={(e) => patchNested("personal", { email: e.target.value })}
                />
              )}
            </Field>
          </div>
          <div className="mt-3">
            <Field id="pAddress" label="Street address" required error={errors.address}>
              {(describedBy) => (
                <input
                  id="pAddress"
                  ref={refs.address}
                  className={inputClass(errors.address)}
                  value={p.address}
                  aria-required="true"
                  aria-invalid={errors.address ? "true" : "false"}
                  aria-describedby={describedBy}
                  onChange={(e) => patchNested("personal", { address: e.target.value })}
                />
              )}
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3 mb-5">
            <Field id="pCity" label="City" required error={errors.city}>
              {(describedBy) => (
                <input
                  id="pCity"
                  ref={refs.city}
                  className={inputClass(errors.city)}
                  value={p.city}
                  aria-required="true"
                  aria-invalid={errors.city ? "true" : "false"}
                  aria-describedby={describedBy}
                  onChange={(e) => patchNested("personal", { city: e.target.value })}
                />
              )}
            </Field>
            <Field id="pState" label="State" required error={errors.stateAbbr}>
              {(describedBy) => (
                <input
                  id="pState"
                  ref={refs.stateAbbr}
                  maxLength={2}
                  className={inputClass(errors.stateAbbr)}
                  value={p.stateAbbr}
                  placeholder="CA"
                  aria-required="true"
                  aria-invalid={errors.stateAbbr ? "true" : "false"}
                  aria-describedby={describedBy}
                  onChange={(e) => patchNested("personal", { stateAbbr: e.target.value.toUpperCase() })}
                />
              )}
            </Field>
            <Field id="pZip" label="ZIP code" required error={errors.zip}>
              {(describedBy) => (
                <input
                  id="pZip"
                  ref={refs.zip}
                  maxLength={5}
                  inputMode="numeric"
                  className={inputClass(errors.zip)}
                  value={p.zip}
                  aria-required="true"
                  aria-invalid={errors.zip ? "true" : "false"}
                  aria-describedby={describedBy}
                  onChange={(e) =>
                    patchNested("personal", { zip: e.target.value.replace(/[^0-9]/g, "").slice(0, 5) })
                  }
                />
              )}
            </Field>
          </div>

          <h3 className="text-sm font-medium mb-2">Insurance</h3>
          <div className="mb-3">
            <Field id="iInsurer" label="Insurance provider">
              {(describedBy) => (
                <select
                  id="iInsurer"
                  className={`${inputClass(false)} bg-white`}
                  value={ins.insurerId}
                  aria-describedby={describedBy}
                  onChange={(e) => patchNested("insuranceInfo", { insurerId: e.target.value })}
                >
                  {INSURERS.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>
          {isUninsured ? (
            <p className="text-sm text-muted bg-paper rounded-lg p-3 mb-5">
              No insurance information needed -- patient assistance programs and foundation grants are
              built to help patients without active coverage.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 mb-5">
              <Field id="iMember" label="Member ID" required error={errors.memberId}>
                {(describedBy) => (
                  <input
                    id="iMember"
                    ref={refs.memberId}
                    className={inputClass(errors.memberId)}
                    value={ins.memberId}
                    placeholder="7841923X"
                    aria-required="true"
                    aria-invalid={errors.memberId ? "true" : "false"}
                    aria-describedby={describedBy}
                    onChange={(e) => patchNested("insuranceInfo", { memberId: e.target.value })}
                  />
                )}
              </Field>
              <Field id="iGroup" label="Group number" hint="Optional">
                {(describedBy) => (
                  <input
                    id="iGroup"
                    className={inputClass(false)}
                    value={ins.groupNumber}
                    placeholder="GRP-00214"
                    aria-describedby={describedBy}
                    onChange={(e) => patchNested("insuranceInfo", { groupNumber: e.target.value })}
                  />
                )}
              </Field>
            </div>
          )}

          <h3 className="text-sm font-medium mb-2">Income</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field id="incSize" label="Household size" hint="Optional">
              {(describedBy) => (
                <input
                  id="incSize"
                  type="number"
                  min="1"
                  className={inputClass(false)}
                  value={inc.householdSize}
                  aria-describedby={describedBy}
                  onChange={(e) => patchNested("income", { householdSize: e.target.value })}
                />
              )}
            </Field>
            <Field id="incRange" label="Annual household income" hint="Optional">
              {(describedBy) => (
                <select
                  id="incRange"
                  className={`${inputClass(false)} bg-white`}
                  value={inc.incomeRange}
                  aria-describedby={describedBy}
                  onChange={(e) => patchNested("income", { incomeRange: e.target.value })}
                >
                  <option value="">Prefer not to say</option>
                  {Object.entries(INCOME_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="text-xs text-muted mb-3 font-normal">Step 2 of 3 — Consent</h2>
          <fieldset className="border-0 p-0 m-0">
            <legend className="sr-only">Consent to share information and program terms</legend>
            <label className="flex items-start gap-2 text-sm mb-1">
              <input
                ref={refs.share}
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
              Edit<span className="sr-only"> your information</span>
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
