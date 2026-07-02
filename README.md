# AffordCare

A patient-facing prototype for medication cost estimation, financial assistance
discovery, digital enrollment, document upload, and application tracking.

Built with Next.js (App Router) and Tailwind CSS. No backend or database —
progress is saved to the browser's `localStorage` so a patient can leave and
resume later on the same device/browser.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy to Vercel

**Option A — via GitHub (recommended)**
1. Push this folder to a new GitHub repository.
2. Go to https://vercel.com/new and import the repository.
3. Vercel auto-detects Next.js — no configuration needed. Click **Deploy**.

**Option B — via CLI**
```bash
npm install -g vercel
vercel
```
Follow the prompts. Running `vercel` from inside this folder is enough;
no environment variables are required.

## Project structure

```
app/                Next.js App Router entry (layout, page, global styles)
components/          UI components
  sections/          One component per portal section
lib/
  data.js            Reference data (medications, insurers, program logic)
  useAffordCare.js    All application state and actions (single source of truth)
```

## Accessibility

Built to WCAG 2.1 AA, with a few choices pushed further because this is a
healthcare form used by people under stress, including elderly and
motor-impaired patients:

- **Keyboard and screen reader navigation**: skip link, landmark regions
  (`header`, `nav`, `main`), a page heading that receives focus on every
  section change, and the document title updates so screen readers announce
  where you are in this single-page app.
- **Forms**: every input has a programmatically associated `<label>`,
  required fields are marked with `aria-required` and `autocomplete` hints
  (name, email, address, etc. — speeds up entry and lets browsers/password
  managers help), and validation errors are tied to their field with
  `aria-describedby` and `aria-invalid`, announced via `role="alert"`, with
  focus moved to the first invalid field.
- **Status changes**: the enrollment wizard, document uploads, application
  tracker, and cost/savings summary all use `aria-live` regions so screen
  reader users hear about updates that happen without a page reload.
- **Color**: no status is conveyed by color alone — every badge, tracker
  stage, and eligibility result pairs color with text or an icon+label. Text
  colors were checked against WCAG AA contrast (4.5:1 for normal text, 3:1
  for large text/icons) against their backgrounds.
- **Touch targets**: interactive controls are at least 44×44px, above the
  WCAG 2.2 AA minimum of 24px, to reduce mis-taps for anyone with limited
  fine motor control.
- **Document upload**: works by drag-and-drop or by keyboard/screen reader
  via a "Browse files" button and hidden native file input — drag-and-drop
  alone is not keyboard accessible, so it's never the only path.
- **Motion**: respects `prefers-reduced-motion` and keeps transitions minor
  regardless.

This covers the patterns that matter most for a form-heavy healthcare app,
but it isn't a substitute for testing with real assistive technology (VoiceOver,
NVDA, JAWS, Dragon) and, ideally, real patients before launch.

## What's mocked vs. real

This is a UI/UX prototype, not a production system:

- **Cost estimates** use flat coverage percentages by insurer category and a
  simplified regional index by ZIP prefix — not real payer benefit data.
- **Program eligibility** reflects general rules (e.g. manufacturer copay
  cards cannot be used by Medicare/Medicaid patients) but not any specific
  program's actual terms.
- **Document upload** accepts a file via drag-and-drop or the file picker and
  records the filename only — nothing is transmitted or stored.
- **Application status** progresses only via the "Simulate progress" button on
  the tracker.

Before handling real patient data, this would need a backend, authentication,
encryption in transit and at rest, and a HIPAA/state-privacy-law compliance
review — enrollment, insurance, and income data collected here are PHI.
