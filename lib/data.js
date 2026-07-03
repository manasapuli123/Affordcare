export const MEDS = [
  { id: "humira", name: "Humira (adalimumab)", price: 6800 },
  { id: "enbrel", name: "Enbrel (etanercept)", price: 6300 },
  { id: "stelara", name: "Stelara (ustekinumab)", price: 14500 },
  { id: "ocrevus", name: "Ocrevus (ocrelizumab)", price: 9800 },
  { id: "repatha", name: "Repatha (evolocumab)", price: 450 },
];

export const INSURERS = [
  { id: "aetna", name: "Aetna", category: "commercial" },
  { id: "cigna", name: "Cigna", category: "commercial" },
  { id: "uhc", name: "UnitedHealthcare", category: "commercial" },
  { id: "bcbs", name: "Blue Cross Blue Shield", category: "commercial" },
  { id: "humana", name: "Humana", category: "commercial" },
  { id: "medicare", name: "Medicare Part D", category: "medicare" },
  { id: "medicaid", name: "Medicaid", category: "medicaid" },
  { id: "uninsured", name: "Uninsured / self-pay", category: "uninsured" },
];

export const COVERAGE_BY_CATEGORY = {
  commercial: 0.8,
  medicare: 0.7,
  medicaid: 0.9,
  uninsured: 0,
};

export const REGION_TABLE = {
  0: { region: "Northeast", index: 1.15 },
  1: { region: "Northeast", index: 1.15 },
  2: { region: "Mid-Atlantic", index: 1.05 },
  3: { region: "Southeast", index: 0.95 },
  4: { region: "Midwest", index: 1.0 },
  5: { region: "Midwest", index: 0.98 },
  6: { region: "South Central", index: 0.92 },
  7: { region: "South Central", index: 0.9 },
  8: { region: "Mountain", index: 1.05 },
  9: { region: "West Coast", index: 1.2 },
};

export const NAV_STAGES = [
  { id: "profile", label: "Patient Profile", icon: "User" },
  { id: "dashboard", label: "Dashboard", icon: "Home" },
  { id: "financial-assistance", label: "Financial Assistance", icon: "HeartHandshake" },
  { id: "documents", label: "Documents", icon: "UploadCloud" },
  { id: "track", label: "Application status", icon: "ListChecks" },
  { id: "notifications", label: "Notifications", icon: "Bell" },
];

export const TRACK_STAGES = [
  { id: "submitted", label: "Application submitted" },
  { id: "eligibility_review", label: "Eligibility review" },
  { id: "income_verification", label: "Income verification" },
  { id: "approval", label: "Approval" },
  { id: "ready", label: "Medication ready" },
];

export const INCOME_LABELS = {
  u25: "Under $25,000",
  "25-50": "$25,000–$50,000",
  "50-75": "$50,000–$75,000",
  "75-100": "$75,000–$100,000",
  o100: "Over $100,000",
};

export function fmt(n) {
  return "$" + Math.round(n).toLocaleString();
}

export function regionFromZip(zip) {
  if (!zip || !zip[0]) return { region: "National average", index: 1.0 };
  return REGION_TABLE[zip[0]] || { region: "National average", index: 1.0 };
}

export function calcCost({ medId, insurerId, zip }) {
  const med = MEDS.find((m) => m.id === medId);
  const insurer = INSURERS.find((i) => i.id === insurerId);
  const coverage = COVERAGE_BY_CATEGORY[insurer.category];
  const regional = regionFromZip(zip);
  const adjustedList = med.price * regional.index;
  const monthlyOOP = adjustedList * (1 - coverage);
  return {
    med,
    insurer,
    coverage,
    regional,
    adjustedList,
    monthlyOOP,
    listPrice: med.price,
    zip,
  };
}

function incomeBracket(incomeRange) {
  if (!incomeRange) return "unknown";
  if (incomeRange === "u25" || incomeRange === "25-50" || incomeRange === "50-75") return "low";
  if (incomeRange === "75-100") return "mid";
  return "high"; // o100
}

export function buildPrograms(insurer, oop, incomeRange) {
  const commercial = insurer.category === "commercial";
  const federal = insurer.category === "medicare" || insurer.category === "medicaid";
  const uninsured = insurer.category === "uninsured";
  const bracket = incomeBracket(incomeRange);

  const copay = {
    id: "copay_card",
    name: "Manufacturer copay card",
    icon: "CreditCard",
    color: "harbor",
    eligibility: commercial
      ? {
          status: "eligible",
          label: "Eligible",
          reason: "You have commercial insurance, which qualifies for manufacturer copay support.",
        }
      : {
          status: "ineligible",
          label: "Not eligible",
          reason:
            "Not available with Medicare, Medicaid, or self-pay coverage due to federal anti-kickback rules.",
        },
    benefits: `Reduces your pharmacy copay to as little as ${fmt(Math.min(25, oop))}/month, up to ${fmt(
      6000
    )} per year.`,
  };

  let papEligibility;
  if (uninsured) {
    if (bracket === "unknown")
      papEligibility = {
        status: "eligible",
        label: "Eligible",
        reason: "Uninsured patients typically qualify based on household income.",
      };
    else if (bracket === "low")
      papEligibility = {
        status: "eligible",
        label: "Eligible",
        reason: "You're uninsured and your reported income is within typical program limits.",
      };
    else if (bracket === "mid")
      papEligibility = {
        status: "likely",
        label: "May qualify",
        reason: "You're uninsured, but some programs cap income lower than your reported range.",
      };
    else
      papEligibility = {
        status: "ineligible",
        label: "Not eligible",
        reason: "Your reported household income is above the typical limit for this program, even while uninsured.",
      };
  } else {
    if (bracket === "unknown")
      papEligibility = {
        status: "likely",
        label: "May qualify",
        reason: "Often available to insured patients too if household income falls within program limits.",
      };
    else if (bracket === "low")
      papEligibility = {
        status: "likely",
        label: "May qualify",
        reason: "Some programs assist insured patients at your income level, though most prioritize the uninsured.",
      };
    else
      papEligibility = {
        status: "ineligible",
        label: "Not eligible",
        reason: "With insurance and this household income, you're unlikely to meet program limits.",
      };
  }
  const pap = {
    id: "pap",
    name: "Patient assistance program (PAP)",
    icon: "Gift",
    color: "plum",
    eligibility: papEligibility,
    benefits: "Provides your medication at no cost directly from the manufacturer if your application is approved.",
  };

  let foundationEligibility;
  if (federal) {
    if (bracket === "unknown")
      foundationEligibility = {
        status: "eligible",
        label: "Eligible",
        reason: "Independent charities can help Medicare and Medicaid patients where manufacturer cards cannot be used.",
      };
    else if (bracket === "low" || bracket === "mid")
      foundationEligibility = {
        status: "eligible",
        label: "Eligible",
        reason: "You're on Medicare or Medicaid and your reported income is within typical grant limits.",
      };
    else
      foundationEligibility = {
        status: "likely",
        label: "May qualify",
        reason: "You're on Medicare or Medicaid; some foundations set higher income limits than others.",
      };
  } else {
    if (bracket === "unknown")
      foundationEligibility = {
        status: "likely",
        label: "May qualify",
        reason: "Open to most patients who meet income limits, subject to fund availability.",
      };
    else if (bracket === "low")
      foundationEligibility = {
        status: "likely",
        label: "May qualify",
        reason: "Your reported income is within range for some foundations, subject to fund availability.",
      };
    else
      foundationEligibility = {
        status: "ineligible",
        label: "Not eligible",
        reason: "Your reported household income is above the limit most foundations use for this coverage type.",
      };
  }
  const foundation = {
    id: "foundation",
    name: "Foundation assistance",
    icon: "Heart",
    color: "gold",
    eligibility: foundationEligibility,
    benefits: `Grant of up to ${fmt(4000)} per year applied toward your out-of-pocket costs.`,
  };

  return [copay, pap, foundation];
}
