export const STATUSES = [
  "saved",
  "applied",
  "interview",
  "offer",
  "rejected",
] as const;

export type Status = (typeof STATUSES)[number];

export const STATUS_META: Record<
  Status,
  { label: string; verb: string }
> = {
  saved: { label: "Saved", verb: "shelved" },
  applied: { label: "Applied", verb: "sent" },
  interview: { label: "Interview", verb: "moved to interview" },
  offer: { label: "Offer", verb: "received an offer" },
  rejected: { label: "Rejected", verb: "closed" },
};

export const SOURCES = [
  "Company site",
  "LinkedIn",
  "Referral",
  "Wellfound",
  "Otta",
  "Recruiter",
  "Other",
] as const;

export const NAV_ITEMS = [
  { href: "/", label: "Overview", index: "01" },
  { href: "/board", label: "Board", index: "02" },
  { href: "/applications", label: "Ledger", index: "03" },
] as const;
