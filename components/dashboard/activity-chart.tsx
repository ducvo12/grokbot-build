"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardData } from "@/lib/db/queries";

function Tip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm border border-rule bg-paper px-3 py-2 text-xs shadow-md">
      <p className="font-display text-sm text-ink">Week of {label}</p>
      {payload.map((item) => (
        <p key={item.name} className="mt-1 text-ink-soft">
          <span style={{ color: item.color }}>{item.name}</span>: {item.value}
        </p>
      ))}
    </div>
  );
}

export function ActivityChart({ data }: { data: DashboardData["activity"] }) {
  return (
    <section className="rounded-sm border border-rule bg-vellum/70 p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-clay uppercase">The weather</p>
          <h2 className="font-display text-3xl text-ink">Twelve weeks of weather</h2>
        </div>
        <ul className="hidden text-[11px] tracking-[0.16em] text-ink-soft uppercase sm:block">
          <li><span className="mr-2 inline-block h-2 w-2 bg-clay/70" />Roles pressed</li>
          <li className="mt-1"><span className="mr-2 inline-block h-2 w-2 bg-ochre" />Interviews</li>
          <li className="mt-1"><span className="mr-2 inline-block h-2 w-2 bg-gold" />Offers</li>
        </ul>
      </div>
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="inkWash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c24d1d" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#c24d1d" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#cbb89a" strokeDasharray="3 7" />
            <XAxis dataKey="label" tick={{ fill: "#4a4338", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "#4a4338", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <Area
              type="monotone"
              dataKey="created"
              name="Roles pressed"
              stroke="#c24d1d"
              strokeWidth={2}
              fill="url(#inkWash)"
            />
            <Line type="monotone" dataKey="interviews" name="Interviews" stroke="#b47b1a" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="offers" name="Offers" stroke="#8a6a12" strokeWidth={2} dot />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
