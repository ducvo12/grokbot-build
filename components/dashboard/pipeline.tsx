"use client";

import { motion } from "motion/react";
import { STATUS_META, type Status } from "@/lib/constants";

const river: Record<Status, string> = {
  saved: "bg-sage",
  applied: "bg-clay",
  interview: "bg-ochre",
  offer: "bg-gold",
  rejected: "bg-rust",
};

export function Pipeline({ counts }: { counts: Record<Status, number> }) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0) || 1;

  return (
    <section className="rounded-sm border border-rule bg-ink p-5 text-paper">
      <p className="text-[11px] tracking-[0.22em] text-clay uppercase">The current</p>
      <h2 className="font-display text-3xl">Where the roles sit</h2>
      <div className="mt-6 space-y-4">
        {(Object.keys(counts) as Status[]).map((status, index) => {
          const value = counts[status];
          const width = Math.max(8, (value / total) * 100);
          return (
            <div key={status}>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <span className="tracking-wide">{STATUS_META[status].label}</span>
                <span className="font-display text-xl">{value}</span>
              </div>
              <div className="h-3 overflow-hidden bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full ${river[status]}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
