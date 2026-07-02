"use client";

import Icon from "../Icon";

const ICON_MAP = {
  submitted: "ClipboardCheck",
  missing_doc: "AlertTriangle",
  approved: "Check",
  reminder: "RefreshCw",
};

const COLOR_MAP = {
  submitted: "text-harbor-dark",
  missing_doc: "text-warning-dark",
  approved: "text-success-dark",
  reminder: "text-muted",
};

export default function Notifications({ state, markNotificationRead }) {
  if (state.notifications.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-5">
        <p className="text-sm text-muted">No notifications yet.</p>
      </div>
    );
  }

  return (
    <ul className="list-none p-0 m-0">
      {state.notifications.map((n) => (
        <li key={n.id}>
          <button
            onClick={() => markNotificationRead(n.id)}
            aria-label={`${n.read ? "" : "Unread. "}${n.title}. ${n.body} ${n.time}.${
              n.read ? "" : " Activate to mark as read."
            }`}
            className={`w-full text-left bg-white rounded-xl p-4 mb-3 ${
              n.read ? "border border-border" : "border-2 border-harbor"
            }`}
          >
            <div className="flex gap-2.5 items-start">
              <Icon
                name={ICON_MAP[n.type] || "Bell"}
                className={COLOR_MAP[n.type] || "text-muted"}
                size={18}
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className={`text-sm ${n.read ? "" : "font-medium"}`} aria-hidden="true">
                    {n.title}
                  </span>
                  {!n.read && (
                    <span aria-hidden="true" className="w-2 h-2 rounded-full bg-harbor mt-1.5" />
                  )}
                </div>
                <p className="text-sm text-muted mt-0.5" aria-hidden="true">
                  {n.body}
                </p>
                <p className="text-xs text-muted mt-1" aria-hidden="true">
                  {n.time}
                </p>
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
