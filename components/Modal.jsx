"use client";

import { useEffect, useRef } from "react";
import Icon from "./Icon";

export default function Modal({ open, onClose, title, children, primaryLabel, onPrimary }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();

    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl border border-border p-6 max-w-sm w-full outline-none"
      >
        <div className="flex justify-between items-start mb-2">
          <h2 id="modal-title" className="font-display text-lg m-0">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted hover:text-ink -mt-1 -mr-1 p-1"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="text-sm text-muted mb-5">{children}</div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 text-sm border border-border rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-paper"
          >
            Stay here
          </button>
          <button
            onClick={onPrimary}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm bg-harbor text-white rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-harbor-dark transition-colors"
          >
            {primaryLabel} <Icon name="ArrowRight" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
