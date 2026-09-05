"use client";

import { useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Application } from "@/lib/db/schema";
import { CompanySeal } from "@/components/brand/company-seal";
import { StatusStamp } from "@/components/brand/status-stamp";
import { formatSalary, formatShortDate } from "@/lib/format";
import { InterviewCue } from "@/components/shared/interview-cue";
import { RelativeTime } from "@/components/shared/relative-time";
import { useFolioUi } from "@/components/providers";
import { EmptyState } from "@/components/shared/empty-state";
import { deleteApplication, restoreApplication } from "@/actions/applications";

export function ApplicationList({
  applications,
  hasFilters,
}: {
  applications: Application[];
  hasFilters: boolean;
}) {
  const { openApplication } = useFolioUi();
  const [removed, setRemoved] = useState<Application[]>([]);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const removedIds = new Set(removed.map((row) => row.id));
  const visible = applications.filter((row) => !removedIds.has(row.id));
  const lastRemoved = removed.at(-1);

  async function tearOut(application: Application) {
    setPendingId(application.id);
    setRemoved((list) => [...list, application]);
    const result = await deleteApplication(application.id);
    setPendingId(null);
    if (!result.ok) {
      setRemoved((list) => list.filter((row) => row.id !== application.id));
      toast.error(result.error);
    }
  }

  async function undo() {
    const leaf = removed.at(-1);
    if (!leaf) return;
    setPendingId(leaf.id);
    const result = await restoreApplication(leaf);
    setPendingId(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setRemoved((list) => list.slice(0, -1));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 text-sm text-ink-soft">
        <p>
          {visible.length} {visible.length === 1 ? "entry" : "entries"}
        </p>
        <p className="flex min-w-0 items-center justify-end gap-3">
          {lastRemoved ? (
            <span className="min-w-0 truncate">
              {lastRemoved.companyName}
              {removed.length === 1
                ? " torn out"
                : ` and ${removed.length - 1} ${removed.length === 2 ? "other" : "others"} torn out`}
            </span>
          ) : null}
          <button
            type="button"
            onClick={undo}
            disabled={!lastRemoved || pendingId === lastRemoved.id}
            aria-hidden={!lastRemoved}
            tabIndex={lastRemoved ? 0 : -1}
            className="shrink-0 text-clay underline-offset-2 hover:underline disabled:opacity-40 aria-hidden:invisible"
          >
            Undo
          </button>
        </p>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title={hasFilters || removed.length > 0 ? "Nothing matches that query." : "The ledger is blank."}
          copy={
            removed.length > 0
              ? "Undo will put the last leaf back. Reloading this page forgets that chance."
              : hasFilters
                ? "Clear the search or loosen the stage filter. The folio may still have the role elsewhere."
                : "Press a role and it will be entered here like a line in a book."
          }
        />
      ) : (
        <ul className="divide-y divide-rule border-y border-rule">
          {visible.map((application) => {
            const showInterview =
              (application.status === "interview" || application.status === "offer") &&
              Boolean(application.interviewAt);

            return (
            <li
              key={application.id}
              className="flex items-stretch pr-1 transition hover:bg-vellum/70"
            >
              <button
                type="button"
                onClick={() => openApplication(application)}
                className="flex min-w-0 flex-1 items-center gap-4 py-4 text-left"
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
                    {showInterview && application.interviewAt ? (
                      <InterviewCue value={application.interviewAt} />
                    ) : application.appliedAt ? (
                      `Dated ${formatShortDate(application.appliedAt)}`
                    ) : (
                      "No date yet"
                    )}
                    <span>
                      Revised <RelativeTime value={application.updatedAt} />
                    </span>
                  </p>
                </div>
              </button>
              <button
                type="button"
                aria-label={`Tear out ${application.companyName}`}
                disabled={pendingId === application.id}
                onClick={() => void tearOut(application)}
                className="my-4 mr-2 grid h-10 w-10 shrink-0 place-items-center self-center rounded-full text-ink-soft transition hover:text-rust disabled:opacity-40"
              >
                <Trash2 size={16} />
              </button>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
