import { formatInterviewCue, interviewCueColor } from "@/lib/format";
import { cn } from "@/lib/cn";

export function InterviewCue({
  value,
  className,
  prefix = "",
}: {
  value: string;
  className?: string;
  prefix?: string;
}) {
  const label = formatInterviewCue(value);
  if (!label) return null;

  return (
    <span className={cn(className)} style={{ color: interviewCueColor(value) }}>
      {prefix}
      {label}
    </span>
  );
}
