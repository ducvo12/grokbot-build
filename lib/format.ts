import {
  differenceInCalendarDays,
  format,
  formatDistanceToNow,
  isThisMonth,
  isSameDay,
  parse,
  parseISO,
  startOfDay,
} from "date-fns";

export function formatSalary(
  min: number | null | undefined,
  max: number | null | undefined,
): string | null {
  if (min == null && max == null) return null;
  const compact = (n: number) =>
    n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
  if (min != null && max != null) return `${compact(min)}–${compact(max)}`;
  if (min != null) return `From ${compact(min)}`;
  return `Up to ${compact(max!)}`;
}

/** Local calendar day for date-only fields (YYYY-MM-DD). */
function parseDateOnly(value: string) {
  return parse(value.slice(0, 10), "yyyy-MM-dd", new Date());
}

export function formatLongDate(value: string | null | undefined): string | null {
  if (!value) return null;
  return format(parseDateOnly(value), "d MMMM yyyy");
}

export function formatShortDate(value: string | null | undefined): string | null {
  if (!value) return null;
  return format(parseDateOnly(value), "d MMM");
}

export function formatRelative(value: string | null | undefined): string | null {
  if (!value) return null;
  return formatDistanceToNow(parseISO(value), { addSuffix: true });
}

export function isInCurrentMonth(value: string | null | undefined): boolean {
  if (!value) return false;
  return isThisMonth(parseISO(value));
}

export type InterviewTiming = "upcoming" | "today" | "past";

export function getInterviewTiming(value: string): InterviewTiming {
  const day = startOfDay(parseDateOnly(value));
  const today = startOfDay(new Date());
  if (isSameDay(day, today)) return "today";
  if (day > today) return "upcoming";
  return "past";
}

/** Short board/list cue: "11 Sep · in 7 days" / "2 Mar · done" */
export function formatInterviewCue(value: string | null | undefined): string | null {
  if (!value) return null;
  const short = formatShortDate(value);
  if (!short) return null;
  const timing = getInterviewTiming(value);
  if (timing === "today") return `${short} · today`;
  if (timing === "past") return `${short} · done`;

  const days = differenceInCalendarDays(
    startOfDay(parseDateOnly(value)),
    startOfDay(new Date()),
  );
  if (days === 1) return `${short} · in 1 day`;
  return `${short} · in ${days} days`;
}

/**
 * Done → sage. Upcoming/today → ochre→rust by urgency
 * (yellow at ≥30 days out, red at ≤1 day / today).
 */
export function interviewCueColor(value: string): string {
  const timing = getInterviewTiming(value);
  if (timing === "past") return "var(--sage)";

  const days = differenceInCalendarDays(
    startOfDay(parseDateOnly(value)),
    startOfDay(new Date()),
  );
  const urgency = days <= 1 ? 1 : days >= 30 ? 0 : (30 - days) / 29;
  return `color-mix(in srgb, var(--rust) ${Math.round(urgency * 100)}%, var(--ochre))`;
}

export function initials(name: string): string {
  const parts = name
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
}

export function todayLine(): string {
  return format(new Date(), "EEEE · d MMMM yyyy");
}
