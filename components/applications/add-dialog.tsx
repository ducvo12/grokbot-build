"use client";

import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ApplicationForm } from "@/components/applications/application-form";
import { createApplication } from "@/actions/applications";
import type { ApplicationInput } from "@/lib/validations/application";

export function AddDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  async function onSubmit(values: ApplicationInput) {
    const result = await createApplication(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Pressed into the folio.");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Press a role"
        description="A new leaf in the search. You can move it later; just get it down."
      >
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 folio-scroll">
          <ApplicationForm key={String(open)} submitLabel="Set in ink" onSubmit={onSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
