import { toneBorder, toneText, toneBg, type Tone } from "@/data/detectors";
import { cn } from "@/lib/utils";

export function BadgeTag({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium", toneBorder[tone], toneText[tone])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", toneBg[tone])} aria-hidden />
      {label}
    </span>
  );
}
