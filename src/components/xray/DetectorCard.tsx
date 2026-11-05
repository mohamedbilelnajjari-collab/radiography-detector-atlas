import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Detector } from "@/data/detectors";
import { toneBg, toneText } from "@/data/detectors";
import { cn } from "@/lib/utils";

export function DetectorCard({ d, index, onClick }: { d: Detector; index: number; onClick: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`${d.name} : voir la fiche détaillée`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="glass group overflow-hidden text-left transition-shadow hover:glow focus-visible:outline-2 focus-visible:outline-ring"
    >
      <div className={cn("h-1.5 w-full", toneBg[d.tone])} />
      <div className="p-6">
        <p className={cn("text-xs font-semibold uppercase tracking-[0.2em]", toneText[d.tone])}>{d.short}</p>
        <p className="mt-6 font-display text-2xl font-bold">{d.summaryValue}</p>
        <p className="mt-1 text-sm text-muted-foreground">{d.summaryLabel}</p>
        <p className="mt-6 text-xs text-primary opacity-70 transition-opacity group-hover:opacity-100">Voir la fiche →</p>
      </div>
    </motion.button>
  );
}
