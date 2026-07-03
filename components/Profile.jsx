"use client";

import { useState } from "react";
import Icon from "./Icon";
import { INSURERS, INCOME_LABELS } from "../lib/data";

const inputClass = "w-full h-11 rounded-lg border border-border px-3";

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-border last:border-b-0">
      <dt className="text-muted">{label}</dt>
      <dd className="m-0 text-right">{value || "—"}</dd>
    </div>
  );
}

function SectionCard({ title, editing, onEdit, onSave, onCancel, children, view }) {
  return (
    <section className="bg-white rounded-xl border border-border p-5 mb-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-medium m-0">{title}</h2>
        {!editing && (
          <button onClick={onEdit} className="text-sm text-harbor-dark min-h-[44px] px-2">
            Edit
          </button>
        )}
      </div>
      {editing ? (
        <div>
          {children}
          <div className="flex gap-2 mt-3">
            <button
              onClick={onCancel}
              className="text-sm border border-border rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-paper"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="text-sm border border-harbor text-harbor rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-harbor-light transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <dl className="m-0">{view}</dl>
      )}
    </section>
  );
}

export default function Profile({ state, patchNested }) {
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState(false);
  const [editingIncome, setEditingIncome] = useState(false);

  const [personalDraft, setPersonalDraft] = useState(state.personal);
  const [insuranceDraft, setInsuranceDraft] = useState(state.insuranceInfo);
  const [incomeDraft, setIncomeDraft] = useState(state.income);

  const insurer = INSURERS.find((i) => i.id === state.insuranceInfo.insurerId);
  const isUninsured = insurer?.category === "uninsured";

  return (
    <div>
      <p className="text-sm text-muted mb-3">
        This information is used across AffordCare -- for cost estimates, program applications, and
        your enrollment. Update it here any time; you won't need to re-enter it elsewhere.
      </p>

      <SectionCard
        title="Personal information"
        editing={editingPersonal}
        onEdit={() => {
          setPersonalDraft(state.personal);
          setEditingPersonal(true);
        }}
        onCancel={() => setEditingPersonal(false)}
        onSave={() => {
          patchNested("personal", personalDraft);
          setEditingPersonal(false);
        }}
        view={
          <>
            <Row label="Name" value={state.personal.name} />
            <Row label="Date of birth" value={state.personal.dob} />
            <Row label="Phone" value={state.personal.phone} />
            <Row label="Email" value={state.personal.email} />
            <Row
              label="Address"
              value={
                state.personal.address
                  ? `${state.personal.address}, ${state.personal.city} ${state.personal.stateAbbr} ${state.personal.zip}`
                  : ""
              }
            />
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="profName">
              Full name
            </label>
            <input
              id="profName"
              className={inputClass}
              value={personalDraft.name}
              onChange={(e) => setPersonalDraft((d) => ({ ...d, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="profDob">
              Date of birth
            </label>
            <input
              id="profDob"
              type="date"
              className={inputClass}
              value={personalDraft.dob}
              onChange={(e) => setPersonalDraft((d) => ({ ...d, dob: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="profPhone">
              Phone
            </label>
            <input
              id="profPhone"
              type="tel"
              className={inputClass}
              value={personalDraft.phone}
              onChange={(e) => setPersonalDraft((d) => ({ ...d, phone: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="profEmail">
              Email
            </label>
            <input
              id="profEmail"
              type="email"
              className={inputClass}
              value={personalDraft.email}
              onChange={(e) => setPersonalDraft((d) => ({ ...d, email: e.target.value }))}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-sm text-muted mb-1" htmlFor="profAddress">
            Street address
          </label>
          <input
            id="profAddress"
            className={inputClass}
            value={personalDraft.address}
            onChange={(e) => setPersonalDraft((d) => ({ ...d, address: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="profCity">
              City
            </label>
            <input
              id="profCity"
              className={inputClass}
              value={personalDraft.city}
              onChange={(e) => setPersonalDraft((d) => ({ ...d, city: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="profState">
              State
            </label>
            <input
              id="profState"
              maxLength={2}
              className={inputClass}
              value={personalDraft.stateAbbr}
              onChange={(e) => setPersonalDraft((d) => ({ ...d, stateAbbr: e.target.value.toUpperCase() }))}
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1" htmlFor="profZip">
              ZIP code
            </label>
            <input
              id="profZip"
              maxLength={5}
              inputMode="numeric"
              className={inputClass}
              value={personalDraft.zip}
              onChange={(e) =>
                setPersonalDraft((d) => ({ ...d, zip: e.target.value.replace(/[^0-9]/g, "").slice(0, 5) }))
              }
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Insurance information"
        editing={editingInsurance}
        onEdit={() => {
          setInsuranceDraft(state.insuranceInfo);
          setEditingInsurance(true);
        }}
        onCancel={() => setEditingInsurance(false)}
        onSave={() => {
          patchNested("insuranceInfo", insuranceDraft);
          setEditingInsurance(false);
        }}
        view={
          isUninsured ? (
            <p className="text-sm text-muted m-0">
              Uninsured / self-pay -- no member ID or group number needed.
            </p>
          ) : (
            <>
              <Row label="Provider" value={insurer ? insurer.name : ""} />
              <Row label="Member ID" value={state.insuranceInfo.memberId} />
              <Row label="Group number" value={state.insuranceInfo.groupNumber} />
            </>
          )
        }
      >
        <div className="mb-3">
          <label className="block text-sm text-muted mb-1" htmlFor="profInsurer">
            Insurance provider
          </label>
          <select
            id="profInsurer"
            className={`${inputClass} bg-white`}
            value={insuranceDraft.insurerId}
            onChange={(e) => setInsuranceDraft((d) => ({ ...d, insurerId: e.target.value }))}
          >
            {INSURERS.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        {INSURERS.find((i) => i.id === insuranceDraft.insurerId)?.category !== "uninsured" && (
          <>
            <div className="mb-3">
              <label className="block text-sm text-muted mb-1" htmlFor="profMember">
                Member ID
              </label>
              <input
                id="profMember"
                className={inputClass}
                value={insuranceDraft.memberId}
                onChange={(e) => setInsuranceDraft((d) => ({ ...d, memberId: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1" htmlFor="profGroup">
                Group number
              </label>
              <input
                id="profGroup"
                className={inputClass}
                value={insuranceDraft.groupNumber}
                onChange={(e) => setInsuranceDraft((d) => ({ ...d, groupNumber: e.target.value }))}
              />
            </div>
          </>
        )}
      </SectionCard>

      <SectionCard
        title="Income information"
        editing={editingIncome}
        onEdit={() => {
          setIncomeDraft(state.income);
          setEditingIncome(true);
        }}
        onCancel={() => setEditingIncome(false)}
        onSave={() => {
          patchNested("income", incomeDraft);
          setEditingIncome(false);
        }}
        view={
          <>
            <Row label="Household size" value={state.income.householdSize} />
            <Row label="Annual household income" value={INCOME_LABELS[state.income.incomeRange]} />
          </>
        }
      >
        <div className="mb-3">
          <label className="block text-sm text-muted mb-1" htmlFor="profHousehold">
            Household size
          </label>
          <input
            id="profHousehold"
            type="number"
            min="1"
            className={inputClass}
            value={incomeDraft.householdSize}
            onChange={(e) => setIncomeDraft((d) => ({ ...d, householdSize: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1" htmlFor="profIncome">
            Annual household income
          </label>
          <select
            id="profIncome"
            className={`${inputClass} bg-white`}
            value={incomeDraft.incomeRange}
            onChange={(e) => setIncomeDraft((d) => ({ ...d, incomeRange: e.target.value }))}
          >
            <option value="">Prefer not to say</option>
            {Object.entries(INCOME_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </SectionCard>
    </div>
  );
}
