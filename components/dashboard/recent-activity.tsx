"use client";

import { STATUS_META } from "@/lib/constants";
import type { DashboardData } from "@/lib/db/queries";
import { formatRelative } from "@/lib/format";
import { StatusStamp } from "@/components/brand/status-stamp";

export function RecentActivity({ events }: { events: DashboardData["recent"] }) {
  if (events.length === 0) {
    return (
      <section className="rounded-sm border border-dashed border-rule p-5">
        <p className="text-sm text-ink-soft">No movement yet. The folio is still.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-clay uppercase">The trail</p>
          <h2 className="font-display text-3xl text-ink">Latest marks</h2>
        </div>
      </div>
      <ol className="divide-y divide-rule border-y border-rule">
        {events.map((event) => (
          <li key={event.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-ink">{event.companyName}</p>
              <p className="truncate text-sm text-ink-soft">
                {event.jobTitle}
                {event.fromStatus
                  ? ` · ${STATUS_META[event.fromStatus].label} → ${STATUS_META[event.toStatus].label}`
                  : ` · entered as ${STATUS_META[event.toStatus].label}`}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden text-xs text-ink-soft sm:inline">
                {formatRelative(event.changedAt)}
              </span>
              <StatusStamp status={event.toStatus} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
