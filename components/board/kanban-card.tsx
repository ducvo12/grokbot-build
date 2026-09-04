"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MapPin } from "lucide-react";
import type { Application } from "@/lib/db/schema";
import { CompanySeal } from "@/components/brand/company-seal";
import { formatSalary, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useFolioUi } from "@/components/providers";

function CardFace({ application }: { application: Application }) {
  const salary = formatSalary(application.salaryMin, application.salaryMax);

  return (
    <>
      <div className="flex items-start gap-3">
        <CompanySeal name={application.companyName} logoUrl={application.companyLogoUrl} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{application.companyName}</p>
          <p className="truncate text-sm text-ink-soft">{application.jobTitle}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tracking-wide text-ink-soft uppercase">
        {application.location ? (
          <span className="inline-flex items-center gap-1">
            <MapPin size={11} />
            {application.location}
          </span>
        ) : null}
        {salary ? <span>{salary}</span> : null}
        {application.appliedAt ? <span>{formatShortDate(application.appliedAt)}</span> : null}
      </div>
    </>
  );
}

export function KanbanCard({
  application,
  overlay = false,
}: {
  application: Application;
  overlay?: boolean;
}) {
  const { openApplication } = useFolioUi();
  const tilt = overlay ? -3 : ((application.companyName.length % 5) - 2) * 0.6;

  if (overlay) {
    return (
      <article
        className="card-tilt relative w-[16.5rem] cursor-grabbing rounded-sm border border-rule bg-vellum p-3 shadow-[0_28px_40px_-18px_rgb(28_25_20_/_0.55)]"
        style={{ rotate: `${tilt}deg` }}
      >
        <CardFace application={application} />
      </article>
    );
  }

  return (
    <SortableLeaf
      application={application}
      tilt={tilt}
      onOpen={() => openApplication(application)}
    />
  );
}

function SortableLeaf({
  application,
  tilt,
  onOpen,
}: {
  application: Application;
  tilt: number;
  onOpen: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application.id,
    data: { application },
  });

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        rotate: isDragging ? undefined : `${tilt}deg`,
      }}
      className={cn(
        "card-tilt relative cursor-grab rounded-sm border border-rule bg-vellum p-3 shadow-[0_10px_24px_-20px_rgb(28_25_20_/_0.8)] before:absolute before:top-0 before:right-0 before:border-t-[14px] before:border-l-[14px] before:border-t-paper-2 before:border-l-transparent",
        isDragging && "opacity-30",
      )}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!isDragging) onOpen();
      }}
    >
      <CardFace application={application} />
    </article>
  );
}
