"use client";

import { INSURERS } from "../../lib/data";

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-border last:border-b-0">
      <dt className="text-muted">{label}</dt>
      <dd className="m-0 text-right">{value || "—"}</dd>
    </div>
  );
}

export default function Profile({ state, onStart, onEdit }) {
  if (!state.personal.name) {
    return (
      <div className="bg-white rounded-xl border border-border p-5">
        <p className="text-sm text-muted mb-3">No profile information yet.</p>
        <button
          onClick={onStart}
          className="text-sm border border-harbor text-harbor rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-harbor-light transition-colors"
        >
          Start enrollment
        </button>
      </div>
    );
  }

  const insurer = INSURERS.find((i) => i.id === state.insuranceInfo.insurerId);

  return (
    <div>
      <section className="bg-white rounded-xl border border-border p-5 mb-3" aria-labelledby="profile-personal">
        <div className="flex justify-between items-center mb-2">
          <h2 id="profile-personal" className="text-sm font-medium m-0">
            Personal information
          </h2>
          <button
            onClick={() => onEdit(1)}
            aria-label="Edit personal information"
            className="text-sm text-harbor min-h-[44px] px-2"
          >
            Edit
          </button>
        </div>
        <dl className="m-0">
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
        </dl>
      </section>

      <section className="bg-white rounded-xl border border-border p-5" aria-labelledby="profile-insurance">
        <div className="flex justify-between items-center mb-2">
          <h2 id="profile-insurance" className="text-sm font-medium m-0">
            Insurance on file
          </h2>
          <button
            onClick={() => onEdit(2)}
            aria-label="Edit insurance information"
            className="text-sm text-harbor min-h-[44px] px-2"
          >
            Edit
          </button>
        </div>
        <dl className="m-0">
          <Row label="Provider" value={insurer ? insurer.name : ""} />
          <Row label="Member ID" value={state.insuranceInfo.memberId} />
          <Row label="Group number" value={state.insuranceInfo.groupNumber} />
        </dl>
      </section>
    </div>
  );
}
