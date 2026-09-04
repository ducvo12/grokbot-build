"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";
import { type Theme } from "@/lib/theme";
import { useTheme } from "@/components/theme/theme-provider";

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Day", icon: Sun },
  { value: "system", label: "Auto", icon: Monitor },
  { value: "dark", label: "Night", icon: Moon },
];

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Appearance"
      className="flex items-center rounded-full border border-rule bg-vellum/80 p-0.5"
    >
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const selected = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            title={option.label}
            onClick={() => setTheme(option.value)}
            className={cn(
              "grid size-8 place-items-center rounded-full text-ink-soft transition hover:text-ink",
              selected && "bg-paper text-ink shadow-[inset_0_1px_0_var(--sheen)]",
            )}
          >
            <Icon size={15} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}
