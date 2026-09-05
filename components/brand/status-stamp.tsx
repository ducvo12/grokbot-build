import { STATUS_META, STATUS_THEME, type Status } from "@/lib/constants";
import { cn } from "@/lib/cn";

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
        STATUS_THEME[status].stamp,
        animate && "stamp-in",
        className,
      )}
    >
      {STATUS_META[status].label}
    </span>
  );
}
