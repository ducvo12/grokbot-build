import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Label({
  children,
  htmlFor,
  hint,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
        {children}
      </label>
      {hint ? <span className="text-[11px] text-ink-soft/70">{hint}</span> : null}
    </div>
  );
}

export const fieldClass =
  "w-full rounded-sm border border-rule bg-vellum/90 px-3 py-2.5 text-sm text-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.6)] outline-none transition placeholder:text-ink-soft/50 focus:border-clay focus:bg-vellum";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldClass, "min-h-32 resize-y leading-7", className)}
      {...props}
    />
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-rust">{message}</p>;
}
