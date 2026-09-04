"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import { cn } from "@/lib/cn";

function Count({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 90, damping: 18 });
  const display = useTransform(spring, (current) => Math.round(current).toString());

  useEffect(() => {
    spring.jump(0);
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function StatBlock({
  index,
  label,
  value,
  suffix,
  hint,
  className,
}: {
  index: string;
  label: string;
  value: number;
  suffix?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden rounded-sm border border-rule bg-vellum/80 p-5",
        className,
      )}
    >
      <p className="text-[11px] tracking-[0.22em] text-clay uppercase">
        {index} · {label}
      </p>
      <p className="font-display mt-2 text-5xl leading-none tracking-tight text-ink">
        <Count value={value} />
        {suffix ? <span className="text-3xl text-ink-soft">{suffix}</span> : null}
      </p>
      {hint ? <p className="mt-3 max-w-[16rem] text-sm leading-6 text-ink-soft">{hint}</p> : null}
    </motion.article>
  );
}
