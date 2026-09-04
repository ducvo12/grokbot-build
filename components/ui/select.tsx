"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { fieldClass } from "@/components/ui/field";

const EMPTY = "__empty__";

export type SelectOption = {
  value: string;
  label: string;
};

function encode(value: string) {
  return value === "" ? EMPTY : value;
}

function decode(value: string) {
  return value === EMPTY ? "" : value;
}

export function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  className,
  disabled,
  "aria-label": ariaLabel,
}: {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <SelectPrimitive.Root
      value={encode(value)}
      onValueChange={(next) => onChange(decode(next))}
      name={name}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        id={id}
        type="button"
        aria-label={ariaLabel}
        className={cn(
          fieldClass,
          "group flex items-center justify-between gap-3 pr-2.5 text-left data-[state=open]:border-clay data-[state=open]:bg-vellum disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} className="min-w-0 flex-1 truncate">
          {selectedLabel}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon asChild>
          <ChevronDown
            aria-hidden
            strokeWidth={2.25}
            className="size-5 shrink-0 text-ink transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          collisionPadding={12}
          className="z-[80] overflow-hidden rounded-sm border border-rule bg-vellum shadow-[0_18px_40px_-18px_rgb(28_25_20_/_0.55)]"
        >
          <SelectPrimitive.Viewport className="min-w-[var(--radix-select-trigger-width)] p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value || EMPTY}
                value={encode(option.value)}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-sm px-3 py-2 text-sm text-ink outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[highlighted]:bg-paper-2 data-[state=checked]:text-clay"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <Check aria-hidden className="size-3.5 shrink-0" strokeWidth={2.25} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
