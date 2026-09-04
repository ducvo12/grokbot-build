"use client";

import { useEffect, useState } from "react";
import { formatRelative, formatShortDate } from "@/lib/format";

export function RelativeTime({ value }: { value: string }) {
  const [text, setText] = useState(() => formatShortDate(value) ?? "");

  useEffect(() => {
    setText(formatRelative(value) ?? formatShortDate(value) ?? "");
  }, [value]);

  return <span>{text}</span>;
}
