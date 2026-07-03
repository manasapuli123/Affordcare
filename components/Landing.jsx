"use client";

import Icon from "./Icon";

const FEATURES = [
  { icon: "Calculator", text: "Estimate medication costs" },
  { icon: "HeartHandshake", text: "Find financial assistance" },
  { icon: "ClipboardList", text: "Complete your application" },
  { icon: "ListChecks", text: "Track your application status" },
  { icon: "Bell", text: "Receive important updates" },
];

export default function Landing({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-paper flex items-center">
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

        <div className="bg-harbor-light rounded-xl p-4 mb-8">
          <p className="text-sm text-harbor-dark m-0">
            <span className="font-medium">Our mission: </span>
            Help patients access treatment with less financial stress.
          </p>
        </div>

        <button
          onClick={onGetStarted}
          className="text-base font-medium bg-harbor text-white rounded-lg px-6 py-3 min-h-[44px] hover:bg-harbor-dark transition-colors"
        >
          Get started
        </button>
      </div>
    </div>
  );
}
