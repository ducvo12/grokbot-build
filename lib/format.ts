import { format, formatDistanceToNow, isThisMonth, parseISO } from "date-fns";

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

export function formatLongDate(value: string | null | undefined): string | null {
  if (!value) return null;
  return format(parseISO(value), "d MMMM yyyy");
}

export function formatShortDate(value: string | null | undefined): string | null {
  if (!value) return null;
  return format(parseISO(value), "d MMM");
}

export function formatRelative(value: string | null | undefined): string | null {
  if (!value) return null;
  return formatDistanceToNow(parseISO(value), { addSuffix: true });
}

export function isInCurrentMonth(value: string | null | undefined): boolean {
  if (!value) return false;
  return isThisMonth(parseISO(value));
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
