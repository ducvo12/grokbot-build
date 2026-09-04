import { STATUS_META, type Status } from "@/lib/constants";
import { cn } from "@/lib/cn";

const tones: Record<Status, string> = {
  saved: "text-sage border-sage/50",
  applied: "text-clay border-clay/60",
  interview: "text-ochre border-ochre/60",
  offer: "text-gold border-gold/70",
  rejected: "text-rust border-rust/60",
};

export function StatusStamp({
  status,
  animate = false,
  className,
}: {
  status: Status;
  animate?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rotate-[-8deg] items-center border-2 px-2 py-0.5 font-display text-[11px] leading-none tracking-[0.18em] uppercase opacity-90",
        tones[status],
        animate && "stamp-in",
        className,
      )}
    >
      {STATUS_META[status].stamp}
    </span>
  );
}
