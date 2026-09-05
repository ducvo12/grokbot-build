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

/** Single source for stage color across stamps, board, pipeline, charts. */
export const STATUS_THEME: Record<
  Status,
  { stamp: string; column: string; bar: string; cssVar: string }
> = {
  saved: {
    stamp: "text-slate border-slate/50",
    column: "border-slate text-slate",
    bar: "bg-slate",
    cssVar: "var(--slate)",
  },
  applied: {
    stamp: "text-ochre border-ochre/60",
    column: "border-ochre text-ochre",
    bar: "bg-ochre",
    cssVar: "var(--ochre)",
  },
  interview: {
    stamp: "text-clay border-clay/60",
    column: "border-clay text-clay",
    bar: "bg-clay",
    cssVar: "var(--clay)",
  },
  offer: {
    stamp: "text-sage border-sage/70",
    column: "border-sage text-sage",
    bar: "bg-sage",
    cssVar: "var(--sage)",
  },
  rejected: {
    stamp: "text-rust border-rust/60",
    column: "border-rust text-rust",
    bar: "bg-rust",
    cssVar: "var(--rust)",
  },
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
