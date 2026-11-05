import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { sections } from "@/data/detectors";
import { cn } from "@/lib/utils";

export function AnimatedBackground() {
  const particles = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    left: (i * 37) % 100, top: (i * 53) % 100, size: 2 + (i % 3), delay: (i % 7) * 0.8, dur: 6 + (i % 5),
  })), []);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
      <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      {particles.map((p, i) => (
        <motion.span key={i} className="absolute rounded-full bg-primary" style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ opacity: [0, 0.8, 0], y: [0, -40] }} transition={{ duration: p.dur, delay: p.delay, repeat: Infinity }} />
      ))}
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-primary glow" style={{ scaleX }} />;
}

function useActiveSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(sections.findIndex((s) => s.id === e.target.id)); });
    }, { threshold: 0.45 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

const go = (i: number) => document.getElementById(sections[Math.max(0, Math.min(sections.length - 1, i))]!.id)?.scrollIntoView({ behavior: "smooth" });

export function SideNav() {
  const active = useActiveSection();
  const [present, setPresent] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if (e.key.toLowerCase() === "p") togglePresent();
      if (e.key === "ArrowRight" || (present && e.key === "PageDown")) { e.preventDefault(); go(active + 1); }
      if (e.key === "ArrowLeft" || (present && e.key === "PageUp")) { e.preventDefault(); go(active - 1); }
    };
    const onFs = () => setPresent(!!document.fullscreenElement);
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFs);
    return () => { window.removeEventListener("keydown", onKey); document.removeEventListener("fullscreenchange", onFs); };
  }, [active, present]);

  function togglePresent() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => setPresent((p) => !p));
  }

  return (
    <>
      <nav aria-label="Sections" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {sections.map((s, i) => (
          <button key={s.id} onClick={() => go(i)} aria-label={s.label} aria-current={active === i ? "true" : undefined} className="group flex items-center justify-end gap-3">
            <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">{s.label}</span>
            <span className={cn("h-2.5 w-2.5 rounded-full border border-primary transition-all", active === i ? "scale-125 bg-primary glow" : "bg-transparent")} />
          </button>
        ))}
      </nav>
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        {present && (
          <div className="glass flex items-center gap-2 px-3 py-1.5 text-sm">
            <button onClick={() => go(active - 1)} aria-label="Section précédente">←</button>
            <span className="font-display tabular-nums">{active + 1} / {sections.length}</span>
            <button onClick={() => go(active + 1)} aria-label="Section suivante">→</button>
          </div>
        )}
        <button onClick={togglePresent} className="glass px-4 py-2 text-sm font-medium text-primary hover:glow" aria-pressed={present}>
          {present ? "Quitter (P)" : "Présenter (P)"}
        </button>
      </div>
    </>
  );
}
