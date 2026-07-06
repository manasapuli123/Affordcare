"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MEDS, INSURERS, calcCost as computeCost, buildPrograms } from "./data";

const STORAGE_KEY = "affordcare_state_v1";

function initialState() {
  return {
    stage: "landing",
    account: { name: "", email: "" },
    medId: MEDS[0].id,
    insurerId: INSURERS[0].id,
    zip: "",
    incomeRange: "",
    zipError: false,
    costResult: null,
    programs: [],
    selectedProgram: null,
    wizardStep: 1,
    wizardFurthest: 1,
    personal: { name: "", dob: "", phone: "", email: "", address: "", city: "", stateAbbr: "", zip: "" },
    insuranceInfo: { insurerId: INSURERS[0].id, memberId: "", groupNumber: "" },
    income: { householdSize: "", incomeRange: "" },
    consent: { share: false, terms: false },
    enrollment: { submitted: false },
    docs: {
      insurance: { uploaded: false, filename: "" },
      income: { uploaded: false, filename: "" },
      prescription: { uploaded: false, filename: "" },
    },
    appStatusIndex: -1,
    notifications: [
      {
        id: 1,
        type: "reminder",
        title: "Renewal reminder",
        body: "Your assistance card renews annually. We will remind you before it expires.",
        time: "Ongoing",
        read: true,
      },
    ],
    notifiedMissingDoc: false,
    notifiedApproved: false,
    toast: "",
  };
}

export function useAffordCare() {
  const [state, setState] = useState(initialState);
  const hydrated = useRef(false);
  const toastTimer = useRef(null);

  // Load saved progress on mount (client only).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setState((s) => ({ ...s, ...saved, toast: "" }));
      }
    } catch (e) {
      // ignore corrupt storage
    }
    hydrated.current = true;
  }, []);

  // Persist on every change once hydrated.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // storage unavailable (private mode, quota) — fail silently
    }
  }, [state]);

  const patch = useCallback((partial) => setState((s) => ({ ...s, ...partial })), []);
  const patchNested = useCallback(
    (key, partial) => setState((s) => ({ ...s, [key]: { ...s[key], ...partial } })),
    []
  );

  const createAccount = useCallback(({ name, email }) => {
    setState((s) => ({
      ...s,
      account: { name, email },
      personal: { ...s.personal, name: s.personal.name || name, email: s.personal.email || email },
    }));
  }, []);

  const showToast = useCallback((message, ms = 3200) => {
    patch({ toast: message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => patch({ toast: "" }), ms);
  }, [patch]);

  const goToStage = useCallback((stage) => patch({ stage }), [patch]);

  const runCalcCost = useCallback(() => {
    if (!/^\d{5}$/.test(state.zip)) {
      patch({ zipError: true });
      return;
    }
    const costResult = computeCost({ medId: state.medId, insurerId: state.insurerId, zip: state.zip });
    const programs = buildPrograms(costResult.insurer, costResult.monthlyOOP, state.incomeRange);
    patch({ zipError: false, costResult, programs });
  }, [state.zip, state.medId, state.insurerId, state.incomeRange, patch]);

  const selectProgram = useCallback((programId) => {
    setState((s) => ({
      ...s,
      selectedProgram: programId,
      insuranceInfo: { ...s.insuranceInfo, insurerId: s.insurerId },
      personal: { ...s.personal, zip: s.personal.zip || s.zip },
      income: { ...s.income, incomeRange: s.income.incomeRange || s.incomeRange },
    }));
  }, []);

  const wizardBack = useCallback(
    () => patch({ wizardStep: Math.max(1, state.wizardStep - 1) }),
    [state.wizardStep, patch]
  );

  const wizardNext = useCallback(() => {
    const next = Math.min(4, state.wizardStep + 1);
    patch({ wizardStep: next, wizardFurthest: Math.max(state.wizardFurthest, next) });
  }, [state.wizardStep, state.wizardFurthest, patch]);

  const wizardGoto = useCallback(
    (n) => {
      if (n <= state.wizardFurthest) patch({ wizardStep: n });
    },
    [state.wizardFurthest, patch]
  );

  const saveAndExit = useCallback(() => {
    showToast("Progress saved. Resume anytime from your dashboard.");
    patch({ stage: "dashboard" });
  }, [patch, showToast]);

  const submitEnrollment = useCallback(() => {
    if (!(state.consent.share && state.consent.terms)) {
      showToast("Complete both consent checkboxes before submitting.");
      return;
    }
    const program = state.programs.find((p) => p.id === state.selectedProgram);
    setState((s) => ({
      ...s,
      enrollment: { submitted: true },
      appStatusIndex: 2,
      notifications: [
        {
          id: Date.now(),
          type: "submitted",
          title: "Application submitted",
          body: `We received your enrollment, including your documents, for ${
            program ? program.name : "your program"
          }.`,
          time: "Just now",
          read: false,
        },
        ...s.notifications,
      ],
    }));
  }, [state.consent, state.programs, state.selectedProgram, showToast]);

  const uploadDoc = useCallback((key, filename) => {
    setState((s) => ({ ...s, docs: { ...s.docs, [key]: { uploaded: true, filename } } }));
  }, []);

  const removeDoc = useCallback((key) => {
    setState((s) => ({ ...s, docs: { ...s.docs, [key]: { uploaded: false, filename: "" } } }));
  }, []);

  const goToTrackFromDocuments = useCallback(() => {
    patch({ appStatusIndex: Math.max(state.appStatusIndex, 2), stage: "track" });
  }, [state.appStatusIndex, patch]);

  const advanceStatus = useCallback(() => {
    setState((s) => {
      const next = Math.min(5, s.appStatusIndex + 1);
      if (next === 5 && !s.notifiedApproved) {
        return {
          ...s,
          appStatusIndex: next,
          notifiedApproved: true,
          notifications: [
            {
              id: Date.now(),
              type: "approved",
              title: "Application approved",
              body: "Your medication is ready. Present your card at the pharmacy.",
              time: "Just now",
              read: false,
            },
            ...s.notifications,
          ],
        };
      }
      return { ...s, appStatusIndex: next };
    });
  }, []);

  const markNotificationRead = useCallback((id) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const savingsFound = state.costResult && state.selectedProgram ? state.costResult.monthlyOOP * 0.85 : 0;

  const isUninsuredPatient =
    INSURERS.find((i) => i.id === state.insuranceInfo.insurerId)?.category === "uninsured";

  const allDocsUploaded = Object.entries(state.docs).every(([key, d]) => {
    if (key === "insurance" && isUninsuredPatient) return true;
    return d.uploaded;
  });

  const nextAction = (() => {
    if (!state.costResult)
      return {
        stage: "financial-assistance",
        label: "Estimate your medication cost",
        desc: "Tell us your medication, insurance provider, and ZIP code so we can show what you can expect to pay.",
        icon: "Calculator",
      };
    if (!state.selectedProgram)
      return {
        stage: "financial-assistance",
        label: "Review assistance programs",
        desc: "We matched programs to your coverage that could lower your monthly cost.",
        icon: "Search",
      };
    if (!state.enrollment.submitted) {
      if (state.personal.name)
        return {
          stage: "enrollment",
          label: `Resume your enrollment (step ${state.wizardStep} of 4)`,
          desc: "Pick up right where you left off.",
          icon: "ClipboardList",
        };
      return {
        stage: "enrollment",
        label: "Start your enrollment",
        desc: "A short 4-step form connects you to your selected program.",
        icon: "ClipboardList",
      };
    }
    if (state.appStatusIndex < 5)
      return {
        stage: "track",
        label: "Check your application status",
        desc: "Your enrollment is being reviewed. See where things stand.",
        icon: "ListChecks",
      };
    return {
      stage: "track",
      label: "You are all set",
      desc: "Your medication is ready. Present your card at the pharmacy.",
      icon: "Check",
    };
  })();

  return {
    state,
    patch,
    patchNested,
    createAccount,
    goToStage,
    runCalcCost,
    selectProgram,
    wizardBack,
    wizardNext,
    wizardGoto,
    saveAndExit,
    submitEnrollment,
    uploadDoc,
    removeDoc,
    goToTrackFromDocuments,
    advanceStatus,
    markNotificationRead,
    savingsFound,
    allDocsUploaded,
    nextAction,
  };
}
