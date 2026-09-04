"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SOURCES, STATUSES, STATUS_META } from "@/lib/constants";
import {
  applicationSchema,
  type ApplicationFormValues,
  type ApplicationInput,
} from "@/lib/validations/application";
import type { Application } from "@/lib/db/schema";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function toValues(application?: Application | null): ApplicationFormValues {
  return {
    companyName: application?.companyName ?? "",
    jobTitle: application?.jobTitle ?? "",
    companyLogoUrl: application?.companyLogoUrl ?? "",
    location: application?.location ?? "",
    salaryMin: application?.salaryMin ?? undefined,
    salaryMax: application?.salaryMax ?? undefined,
    jobUrl: application?.jobUrl ?? "",
    appliedAt: application?.appliedAt ?? "",
    status: application?.status ?? "saved",
    notes: application?.notes ?? "",
    source: application?.source ?? "",
  };
}

export function ApplicationForm({
  application,
  submitLabel,
  onSubmit,
  extra,
}: {
  application?: Application | null;
  submitLabel: string;
  onSubmit: (values: ApplicationInput) => Promise<void> | void;
  extra?: React.ReactNode;
}) {
  const form = useForm<ApplicationFormValues, unknown, ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: toValues(application),
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="companyName">Company</Label>
          <Input id="companyName" placeholder="The New York Times" {...form.register("companyName")} />
          <FieldError message={form.formState.errors.companyName?.message} />
        </div>
        <div>
          <Label htmlFor="jobTitle">Role</Label>
          <Input id="jobTitle" placeholder="Newsroom tools engineer" {...form.register("jobTitle")} />
          <FieldError message={form.formState.errors.jobTitle?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="location">Where</Label>
          <Input id="location" placeholder="New York, NY or Remote" {...form.register("location")} />
          <FieldError message={form.formState.errors.location?.message} />
        </div>
        <div>
          <Label htmlFor="source">Source</Label>
          <Controller
            name="source"
            control={form.control}
            render={({ field }) => (
              <Select
                id="source"
                name={field.name}
                value={field.value ?? ""}
                onChange={field.onChange}
                options={[
                  { value: "", label: "Unknown" },
                  ...SOURCES.map((source) => ({ value: source, label: source })),
                ]}
              />
            )}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="salaryMin">Salary from</Label>
          <Input id="salaryMin" type="number" min={0} step={1000} placeholder="145000" {...form.register("salaryMin")} />
          <FieldError message={form.formState.errors.salaryMin?.message} />
        </div>
        <div>
          <Label htmlFor="salaryMax">Salary to</Label>
          <Input id="salaryMax" type="number" min={0} step={1000} placeholder="185000" {...form.register("salaryMax")} />
          <FieldError message={form.formState.errors.salaryMax?.message} />
        </div>
        <div>
          <Label htmlFor="appliedAt">Dated</Label>
          <Input id="appliedAt" type="date" {...form.register("appliedAt")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="status">Stage</Label>
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Select
                id="status"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                options={STATUSES.map((status) => ({
                  value: status,
                  label: STATUS_META[status].label,
                }))}
              />
            )}
          />
        </div>
        <div>
          <Label htmlFor="jobUrl">Posting</Label>
          <Input id="jobUrl" placeholder="https://" {...form.register("jobUrl")} />
          <FieldError message={form.formState.errors.jobUrl?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="companyLogoUrl" hint="optional">
          Logo URL
        </Label>
        <Input id="companyLogoUrl" placeholder="https://…" {...form.register("companyLogoUrl")} />
        <FieldError message={form.formState.errors.companyLogoUrl?.message} />
      </div>

      <div>
        <Label htmlFor="notes" hint="margin notes">
          Notes
        </Label>
        <Textarea
          id="notes"
          className="ruled"
          placeholder="What they asked. What you still owe them. What you actually think."
          {...form.register("notes")}
        />
        <FieldError message={form.formState.errors.notes?.message} />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        {extra}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Setting type…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
