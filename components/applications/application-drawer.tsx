"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import type { Application } from "@/lib/db/schema";
import type { ApplicationInput } from "@/lib/validations/application";
import { deleteApplication, updateApplication } from "@/actions/applications";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ApplicationForm } from "@/components/applications/application-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { CompanySeal } from "@/components/brand/company-seal";
import { StatusStamp } from "@/components/brand/status-stamp";
import { formatRelative, formatSalary } from "@/lib/format";

export function ApplicationDrawer({
  application,
  onClose,
  onUpdated,
}: {
  application: Application | null;
  onClose: () => void;
  onUpdated: (application: Application) => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(values: ApplicationInput) {
    if (!application) return;
    const result = await updateApplication(application.id, values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    onUpdated({
      ...application,
      ...values,
      companyLogoUrl: values.companyLogoUrl ?? null,
      location: values.location ?? null,
      salaryMin: values.salaryMin ?? null,
      salaryMax: values.salaryMax ?? null,
      jobUrl: values.jobUrl ?? null,
      appliedAt: values.appliedAt ?? null,
      notes: values.notes ?? null,
      source: values.source ?? null,
      updatedAt: new Date().toISOString(),
    });
    toast.success("The page was revised.");
  }

  async function onDelete() {
    if (!application) return;
    setPending(true);
    const result = await deleteApplication(application.id);
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Torn from the folio.");
    setConfirmOpen(false);
    onClose();
  }

  return (
    <>
      <Sheet open={Boolean(application)} onOpenChange={(open) => !open && onClose()}>
        {application ? (
          <SheetContent eyebrow="Leaf" title={application.companyName}>
            <div className="flex items-center justify-between gap-3 border-b border-rule px-6 py-4">
              <div className="flex items-center gap-3">
                <CompanySeal name={application.companyName} logoUrl={application.companyLogoUrl} />
                <div>
                  <p className="text-sm text-ink-soft">{application.jobTitle}</p>
                  <p className="text-xs text-ink-soft/80">
                    Revised {formatRelative(application.updatedAt)}
                    {formatSalary(application.salaryMin, application.salaryMax)
                      ? ` · ${formatSalary(application.salaryMin, application.salaryMax)}`
                      : ""}
                  </p>
                </div>
              </div>
              <StatusStamp status={application.status} animate />
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 folio-scroll">
              {application.jobUrl ? (
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mb-5 inline-flex items-center gap-2 text-sm text-clay hover:underline"
                >
                  Open the posting <ExternalLink size={14} />
                </a>
              ) : null}
              <ApplicationForm
                key={application.id + application.updatedAt}
                application={application}
                submitLabel="Revise this leaf"
                onSubmit={onSubmit}
                extra={
                  <Button variant="ghost" onClick={() => setConfirmOpen(true)}>
                    Tear out
                  </Button>
                }
              />
            </div>
          </SheetContent>
        ) : null}
      </Sheet>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Tear out this leaf?"
        description="The role, the notes, and its trail through the folio will be gone. This cannot be undone."
        confirmLabel="Tear it out"
        onConfirm={onDelete}
        pending={pending}
      />
    </>
  );
}
