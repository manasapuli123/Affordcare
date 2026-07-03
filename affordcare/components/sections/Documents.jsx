"use client";

import { useRef, useState } from "react";
import Icon from "../Icon";

const ITEMS = [
  { key: "insurance", label: "Insurance card", icon: "CreditCard" },
  { key: "income", label: "Income verification", icon: "Receipt" },
  { key: "prescription", label: "Prescription", icon: "FileText" },
  { key: "consent", label: "Consent forms", icon: "PenLine" },
];

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

export default function Documents({ state, uploadDoc, removeDoc, allDocsUploaded, goToTrackFromDocuments }) {
  return (
    <div>
      <p className="text-sm text-muted mb-3">
        Upload each document below. Every file can be added by dragging it onto its card or by using the
        Browse files button, which also works with a keyboard or screen reader.
      </p>
      {ITEMS.map((item) => (
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
