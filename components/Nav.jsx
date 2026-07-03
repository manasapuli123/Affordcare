"use client";

import Icon from "./Icon";
import { NAV_STAGES } from "../lib/data";

export default function Nav({ stage, onNavigate, unreadCount }) {
  return (
    <nav aria-label="Main sections" className="mb-6">
      <ul className="grid grid-cols-4 sm:grid-cols-7 gap-1 list-none p-0 m-0">
        {NAV_STAGES.map((s) => {
          const active = stage === s.id;
          const hasBadge = s.id === "notifications" && unreadCount > 0;
          return (
            <li key={s.id}>
              <button
                onClick={() => onNavigate(s.id)}
                aria-current={active ? "page" : undefined}
                aria-label={hasBadge ? `${s.label}, ${unreadCount} unread` : undefined}
                className={`relative w-full min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-lg py-2 px-1 border-t-2 transition-colors ${
                  active ? "border-harbor" : "border-transparent hover:bg-white"
                }`}
              >
                <span className="relative">
                  <Icon name={s.icon} className={active ? "text-harbor" : "text-muted"} size={19} />
                  {hasBadge && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-1.5 -right-2.5 bg-danger text-white text-[10px] leading-none rounded-full min-w-[14px] px-1 py-0.5 text-center"
                    >
                      {unreadCount}
                    </span>
                  )}
                </span>
                <span
                  aria-hidden={hasBadge ? "true" : undefined}
                  className={`text-xs ${active ? "text-harbor font-medium" : "text-muted"}`}
                >
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
