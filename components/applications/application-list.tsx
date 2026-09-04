"use client";

import { MapPin } from "lucide-react";
import type { Application } from "@/lib/db/schema";
import { CompanySeal } from "@/components/brand/company-seal";
import { StatusStamp } from "@/components/brand/status-stamp";
import { formatSalary, formatShortDate } from "@/lib/format";
import { RelativeTime } from "@/components/shared/relative-time";
import { useFolioUi } from "@/components/providers";
import { EmptyState } from "@/components/shared/empty-state";

export function ApplicationList({
  applications,
  hasFilters,
}: {
  applications: Application[];
  hasFilters: boolean;
}) {
  const { openApplication } = useFolioUi();

  if (applications.length === 0) {
    return (
      <EmptyState
        title={hasFilters ? "Nothing matches that query." : "The ledger is blank."}
        copy={
          hasFilters
            ? "Clear the search or loosen the stage filter. The folio may still have the role elsewhere."
            : "Press a role and it will be entered here like a line in a book."
        }
      />
    );
  }

  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {applications.map((application) => (
        <li key={application.id}>
          <button
            type="button"
            onClick={() => openApplication(application)}
            className="flex w-full items-center gap-4 py-4 text-left transition hover:bg-vellum/70"
          >
            <CompanySeal name={application.companyName} logoUrl={application.companyLogoUrl} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-2xl leading-none text-ink">
                  {application.companyName}
                </p>
                <StatusStamp status={application.status} className="scale-90" />
              </div>
              <p className="mt-1 truncate text-sm text-ink-soft">{application.jobTitle}</p>
              <p className="mt-1 flex flex-wrap gap-x-3 text-[11px] tracking-wide text-ink-soft uppercase">
                {application.location ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={11} />
                    {application.location}
                  </span>
                ) : null}
                {formatSalary(application.salaryMin, application.salaryMax)}
                {application.appliedAt
                  ? `Dated ${formatShortDate(application.appliedAt)}`
                  : "No date yet"}
                <span>
                  Revised <RelativeTime value={application.updatedAt} />
                </span>
              </p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
