import { z } from "zod";
import { STATUSES } from "@/lib/constants";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => value || undefined)
  .refine((value) => !value || /^https?:\/\//i.test(value), {
    message: "Use a full URL starting with http:// or https://",
  });

const optionalNumber = z
  .union([z.string(), z.number()])
  .optional()
  .transform((value) => {
    if (value === undefined || value === "") return undefined;
    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  });

export const applicationSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(1, "Company is required")
      .max(80, "Keep the company name under 80 characters"),
    jobTitle: z
      .string()
      .trim()
      .min(1, "Role title is required")
      .max(120, "Keep the title under 120 characters"),
    companyLogoUrl: optionalUrl,
    location: z
      .string()
      .trim()
      .max(80, "Keep the location under 80 characters")
      .optional()
      .or(z.literal(""))
      .transform((value) => value || undefined),
    salaryMin: optionalNumber.refine(
      (value) => value === undefined || value >= 0,
      "Salary cannot be negative",
    ),
    salaryMax: optionalNumber.refine(
      (value) => value === undefined || value >= 0,
      "Salary cannot be negative",
    ),
    jobUrl: optionalUrl,
    appliedAt: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((value) => value || undefined),
    status: z.enum(STATUSES),
    notes: z
      .string()
      .max(4000, "Notes are limited to 4,000 characters")
      .optional()
      .or(z.literal(""))
      .transform((value) => value || undefined),
    source: z
      .string()
      .max(60)
      .optional()
      .or(z.literal(""))
      .transform((value) => value || undefined),
  })
  .refine(
    (data) =>
      data.salaryMin == null ||
      data.salaryMax == null ||
      data.salaryMin <= data.salaryMax,
    {
      message: "Minimum salary cannot exceed the maximum",
      path: ["salaryMax"],
    },
  );

export type ApplicationFormValues = z.input<typeof applicationSchema>;
export type ApplicationInput = z.output<typeof applicationSchema>;
