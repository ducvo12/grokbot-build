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
import { STATUS_META, STATUS_THEME } from "@/lib/constants";
import { useTheme } from "@/components/theme/theme-provider";

const SERIES = [
  {
    key: "created" as const,
    name: "Roles pressed",
    status: "saved" as const,
    kind: "area" as const,
  },
  {
    key: "interviews" as const,
    name: STATUS_META.interview.label,
    status: "interview" as const,
    kind: "line" as const,
  },
  {
    key: "offers" as const,
    name: STATUS_META.offer.label,
    status: "offer" as const,
    kind: "line" as const,
  },
];

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
  const { resolved } = useTheme();
  const savedColor = STATUS_THEME.saved.cssVar;

  return (
    <section className="rounded-sm border border-rule bg-vellum/70 p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-clay uppercase">The weather</p>
          <h2 className="font-display text-3xl text-ink">Twelve weeks of weather</h2>
        </div>
        <ul className="hidden text-[11px] tracking-[0.16em] text-ink-soft uppercase sm:block">
          {SERIES.map((series) => (
            <li key={series.key} className="mt-1 first:mt-0">
              <span
                className="mr-2 inline-block h-2 w-2"
                style={{ backgroundColor: STATUS_THEME[series.status].cssVar }}
              />
              {series.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 h-72" key={resolved}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="stageWash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={savedColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={savedColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--rule)" strokeDasharray="3 7" />
            <XAxis dataKey="label" tick={{ fill: "var(--ink-soft)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "var(--ink-soft)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            {SERIES.map((series) => {
              const color = STATUS_THEME[series.status].cssVar;
              if (series.kind === "area") {
                return (
                  <Area
                    key={series.key}
                    type="monotone"
                    dataKey={series.key}
                    name={series.name}
                    stroke={color}
                    strokeWidth={2}
                    fill="url(#stageWash)"
                  />
                );
              }
              return (
                <Line
                  key={series.key}
                  type="monotone"
                  dataKey={series.key}
                  name={series.name}
                  stroke={color}
                  strokeWidth={2}
                  dot={series.status === "offer"}
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
