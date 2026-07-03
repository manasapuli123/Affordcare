"use client";

import { useRef, useState } from "react";
import Icon from "./Icon";

const FEATURES = [
  { icon: "Calculator", text: "Estimate medication costs" },
  { icon: "HeartHandshake", text: "Find financial assistance" },
  { icon: "ClipboardList", text: "Complete your application" },
  { icon: "ListChecks", text: "Track your application status" },
  { icon: "Bell", text: "Receive important updates" },
];

function Field({ id, label, error, children }) {
  return (
    <div className="mb-4 text-left">
      <label className="block text-sm text-muted mb-1" htmlFor={id}>
        {label} <span aria-hidden="true">*</span>
        <span className="sr-only">(required)</span>
      </label>
      {children(error ? `${id}-error` : undefined)}
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

export default function Landing({ onCreateAccount, onContinue }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPasswords, setShowPasswords] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const refs = {
    name: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Enter your full name.";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Enter a valid email address.";
    if (!form.password || form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match.";
    return e;
  }

  function handleCancel() {
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const foundErrors = validate();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      const order = ["name", "email", "password", "confirmPassword"];
      for (const key of order) {
        if (foundErrors[key] && refs[key]?.current) {
          refs[key].current.focus();
          break;
        }
      }
      return;
    }
    setErrors({});
    // Account is created here (name/email only -- the password never leaves
    // this form or gets persisted, since there's no backend to send it to).
    onCreateAccount({ name: form.name.trim(), email: form.email.trim() });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-paper flex items-center">
        <div className="max-w-sm mx-auto px-4 py-16 text-center">
          <Icon name="Check" className="text-success-dark mx-auto mb-3" size={36} />
          <h1 className="font-display text-2xl mb-2">Account created</h1>
          <p className="text-sm text-muted mb-6" aria-live="polite">
            Welcome, {form.name.split(" ")[0]}. Your AffordCare account is ready.
          </p>
          <button
            onClick={onContinue}
            className="text-base font-medium bg-harbor text-white rounded-lg px-6 py-3 min-h-[44px] hover:bg-harbor-dark transition-colors"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Icon name="Heart" className="text-harbor-dark" size={28} />
          <h1 className="font-display text-3xl text-harbor-dark m-0">AffordCare</h1>
        </div>
        <p className="text-lg text-muted mb-4">Financial assistance made simple</p>

        <p className="text-base text-ink mb-8 max-w-lg mx-auto">
          Whether you're insured or uninsured, AffordCare helps you find discounted pricing, copay
          assistance, and other financial support for specialty medications.
        </p>

        <p className="text-base text-ink mb-8">Here's how:</p>

        <ul className="list-none p-0 m-0 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {FEATURES.map((f) => (
            <li
              key={f.text}
              className="bg-white border border-border rounded-xl p-4 flex items-center gap-3"
            >
              <Icon name={f.icon} className="text-harbor-dark shrink-0" size={20} />
              <span className="text-sm">{f.text}</span>
            </li>
          ))}
        </ul>

        <div className="bg-harbor-light rounded-xl p-4 mb-10">
          <p className="text-sm text-harbor-dark m-0">
            <span className="font-medium">Our mission: </span>
            Help patients access treatment with less financial stress.
          </p>
        </div>

        <div className="max-w-sm mx-auto">
          <div className="mb-4">
            <h2 className="font-display text-xl mb-1">Create your account</h2>
            <p className="text-sm text-muted">A few details to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-border rounded-xl p-6 text-left">
            <Field id="suName" label="Name" error={errors.name}>
              {(describedBy) => (
                <input
                  id="suName"
                  ref={refs.name}
                  className={inputClass(errors.name)}
                  value={form.name}
                  autoComplete="name"
                  placeholder="Jordan Ellis"
                  aria-required="true"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={describedBy}
                  onChange={(e) => update("name", e.target.value)}
                />
              )}
            </Field>

            <Field id="suEmail" label="Email" error={errors.email}>
              {(describedBy) => (
                <input
                  id="suEmail"
                  ref={refs.email}
                  type="email"
                  className={inputClass(errors.email)}
                  value={form.email}
                  autoComplete="email"
                  placeholder="jordan@email.com"
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={describedBy}
                  onChange={(e) => update("email", e.target.value)}
                />
              )}
            </Field>

            <Field id="suPassword" label="Password" error={errors.password}>
              {(describedBy) => (
                <input
                  id="suPassword"
                  ref={refs.password}
                  type={showPasswords ? "text" : "password"}
                  className={inputClass(errors.password)}
                  value={form.password}
                  autoComplete="new-password"
                  aria-required="true"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={describedBy}
                  onChange={(e) => update("password", e.target.value)}
                />
              )}
            </Field>

            <Field id="suConfirmPassword" label="Confirm password" error={errors.confirmPassword}>
              {(describedBy) => (
                <input
                  id="suConfirmPassword"
                  ref={refs.confirmPassword}
                  type={showPasswords ? "text" : "password"}
                  className={inputClass(errors.confirmPassword)}
                  value={form.confirmPassword}
                  autoComplete="new-password"
                  aria-required="true"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={describedBy}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                />
              )}
            </Field>

            <label className="flex items-center gap-2 text-sm text-muted mb-5">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
              />
              Show passwords
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 text-base border border-border rounded-lg px-6 py-3 min-h-[44px] hover:bg-paper transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 text-base font-medium bg-harbor text-white rounded-lg px-6 py-3 min-h-[44px] hover:bg-harbor-dark transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
