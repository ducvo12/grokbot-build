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
  { label: string; verb: string; stamp: string }
> = {
  saved: { label: "Saved", verb: "shelved", stamp: "SAVED" },
  applied: { label: "Applied", verb: "sent", stamp: "SENT" },
  interview: { label: "Interview", verb: "moved to interview", stamp: "TALK" },
  offer: { label: "Offer", verb: "received an offer", stamp: "YES" },
  rejected: { label: "Rejected", verb: "closed", stamp: "NO" },
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
