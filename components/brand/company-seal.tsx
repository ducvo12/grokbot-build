import { initials } from "@/lib/format";
import { cn } from "@/lib/cn";

const palettes = [
  "bg-[#3f5c45] text-[#f3ead8]",
  "bg-[#8a2e22] text-[#faf4e8]",
  "bg-[#1c1914] text-[#f3ead8]",
  "bg-[#c24d1d] text-[#faf4e8]",
  "bg-[#8a6a12] text-[#faf4e8]",
  "bg-[#243528] text-[#f3ead8]",
];

function paletteFor(name: string) {
  const sum = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palettes[sum % palettes.length];
}

export function CompanySeal({
  name,
  logoUrl,
  size = "md",
}: {
  name: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? "h-9 w-9 text-[10px]" : size === "lg" ? "h-16 w-16 text-lg" : "h-12 w-12 text-xs";

  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt=""
        className={cn("rounded-full border-2 border-[#d7b56a] object-cover shadow-sm", dim)}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "relative grid place-items-center rounded-full border-2 border-[#d7b56a] font-display tracking-wide shadow-[inset_0_0_0_3px_rgb(250_244_232_/_0.25)]",
        dim,
        paletteFor(name),
      )}
    >
      {initials(name)}
    </div>
  );
}
