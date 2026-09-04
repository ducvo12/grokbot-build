import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "seal" | "ghost" | "line" | "danger";

const variants: Record<Variant, string> = {
  seal:
    "bg-clay text-cream shadow-[0_10px_0_var(--clay-deep)] hover:-translate-y-0.5 hover:shadow-[0_12px_0_var(--clay-deep)] active:translate-y-1 active:shadow-[0_4px_0_var(--clay-deep)]",
  ghost:
    "bg-transparent text-ink hover:bg-paper-2/80",
  line:
    "border border-rule bg-vellum/70 text-ink hover:border-ink/40 hover:-translate-y-0.5",
  danger:
    "bg-rust text-cream shadow-[0_8px_0_var(--rust-deep)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_var(--rust-deep)]",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ className, variant = "seal", type = "button", ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
});
