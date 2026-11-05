import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, animate, motion, useInView } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { BadgeTag } from "@/components/xray/BadgeTag";
import { AnimatedBackground, ScrollProgress, SideNav } from "@/components/xray/Chrome";
import { DetectorCard } from "@/components/xray/DetectorCard";
import { Quiz } from "@/components/xray/Quiz";
import { RadarCompare } from "@/components/xray/RadarCompare";
import { Section, reveal } from "@/components/xray/Section";
import { Simulator } from "@/components/xray/Simulator";
import { XRayAnimation } from "@/components/xray/XRayAnimation";
import { detectors, tableColumns, tableRows, toneBg, toneText, toneVar, workflow } from "@/data/detectors";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Des rayons X au numérique — Détecteurs en radiographie" },
      { name: "description", content: "Synthèse comparative des détecteurs en radiographie : film nu, écran renforçateur, plaque CR et capteur plan DR." },
      { property: "og:title", content: "Des rayons X au numérique — Détecteurs en radiographie" },
      { property: "og:description", content: "Support pédagogique interactif pour étudiants en génie biomédical." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function Index() {
  return (
    <main className="relative overflow-x-hidden">
      <AnimatedBackground />
      <ScrollProgress />
      <SideNav />
      <Hero />
      <Overview />
      <Timeline />
      <Fiches />
      <Section id="simulateur" kicker="05 — Simulateur" title="Dose, bruit et flou en direct"><Simulator /></Section>
      <Comparatif />
      <TimeGain />
      <Section id="quiz" kicker="08 — Quiz" title="Testez vos connaissances"><Quiz /></Section>
      <Conclusion />
    </main>
  );
}

function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 text-center">
      <motion.div aria-hidden className="beam absolute inset-y-0 w-40 opacity-60 blur-xl" initial={{ left: "-20%" }} animate={{ left: "120%" }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }} />
      <motion.div aria-hidden className="absolute inset-x-0 h-px bg-primary/60" initial={{ top: "0%" }} animate={{ top: "100%" }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
      <div className="relative max-w-4xl">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Des rayons X au numérique
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-gradient text-4xl font-bold leading-tight md:text-7xl">
          Synthèse & Comparatif des Détecteurs en Radiographie
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Analyse comparative des technologies d'imagerie médicale : de l'analogique au numérique direct
        </motion.p>
        <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}
          onClick={() => scrollTo("apercu")} className="glow mt-10 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105">
          Explorer ↓
        </motion.button>
      </div>
    </section>
  );
}

function Overview() {
  return (
    <Section id="apercu" kicker="02 — En un coup d'œil" title="Les 4 technologies">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {detectors.map((d, i) => <DetectorCard key={d.id} d={d} index={i} onClick={() => scrollTo(`fiche-${d.id}`)} />)}
      </div>
    </Section>
  );
}

function Timeline() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="frise" kicker="03 — Évolution" title="Film → Écran → CR → DR">
      <div className="mb-4 hidden justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground md:flex">
        <span>Analogique</span><span className="text-laser">Numérique indirect</span><span className="text-digital">Numérique direct</span>
      </div>
      <div className="relative">
        <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-muted md:block" />
        <motion.div className="absolute left-0 top-6 hidden h-0.5 origin-left bg-gradient-to-r from-neutral-tone via-laser to-digital md:block"
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.6 }} style={{ right: 0 }} />
        <ol className="relative grid gap-6 md:grid-cols-4">
          {detectors.map((d, i) => (
            <li key={d.id}>
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full flex-col items-start gap-3 md:items-center">
                <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.3 }}
                  className={cn("grid h-12 w-12 place-items-center rounded-full font-display font-bold text-background", toneBg[d.tone], open === i && "glow ring-4 ring-primary/30")}>
                  {i + 1}
                </motion.span>
                <span className="font-display font-semibold">{d.short}</span>
                <span className="text-xs text-muted-foreground">{d.era}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <AnimatePresence mode="wait">
        {open !== null && (
          <motion.div key={open} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass mt-10 grid gap-6 p-6 md:grid-cols-[1fr_2fr]">
            <div>
              <p className={cn("text-xs uppercase tracking-[0.2em]", toneText[detectors[open]!.tone])}>{detectors[open]!.tech}</p>
              <h3 className="mt-2 text-2xl font-bold">{detectors[open]!.name}</h3>
              <div className="mt-4 flex flex-wrap gap-2">{detectors[open]!.badges.map((b) => <BadgeTag key={b.label} {...b} />)}</div>
            </div>
            <div>
              <p className="text-muted-foreground">{detectors[open]!.principle}</p>
              <button onClick={() => scrollTo(`fiche-${detectors[open]!.id}`)} className="mt-4 text-sm text-primary">Lire la fiche complète →</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

function Fiches() {
  return (
    <Section id="fiches" kicker="04 — Fiches détaillées" title="Principe & caractéristiques">
      <div className="mb-4 hidden grid-cols-[1fr_1.2fr_1.4fr] gap-6 px-6 text-xs uppercase tracking-[0.2em] text-muted-foreground lg:grid">
        <span>Détecteur</span><span>Principe de fonctionnement</span><span>Points clés & caractéristiques</span>
      </div>
      <div className="space-y-8">
        {detectors.map((d, i) => (
          <motion.article key={d.id} id={`fiche-${d.id}`} {...reveal} transition={{ duration: 0.6 }} className="glass scroll-mt-24 overflow-hidden">
            <div className={cn("h-1", toneBg[d.tone])} />
            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.2fr_1.4fr]">
              <div>
                <p className="text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")} · {d.tech}</p>
                <h3 className={cn("mt-1 text-2xl font-bold", toneText[d.tone])}>{d.name}</h3>
                <div className="mt-3 flex flex-wrap gap-2">{d.badges.map((b) => <BadgeTag key={b.label} {...b} />)}</div>
                <div className="mt-4 rounded-xl border border-glass-border bg-background/40 p-2"><XRayAnimation id={d.id} /></div>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary lg:hidden">Principe</p>
                <p className="text-lg leading-relaxed">{d.principle}</p>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary lg:hidden">Points clés</p>
                <ul className="space-y-3">
                  {d.keyPoints.map((k) => (
                    <li key={k} className="flex gap-3 text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: toneVar[d.tone] }} />{k}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

function Comparatif() {
  const [col, setCol] = useState<number | null>(null);
  return (
    <Section id="comparatif" kicker="06 — Comparatif" title="Tableau & radar">
      <motion.div {...reveal} className="glass mb-10 overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm" onMouseLeave={() => setCol(null)}>
          <thead>
            <tr>
              <th className="p-4 text-left font-display">Détecteur</th>
              {tableColumns.map((c, k) => (
                <th key={c} scope="col" onMouseEnter={() => setCol(k)} onFocus={() => setCol(k)} tabIndex={0}
                  className={cn("cursor-pointer p-4 text-left font-display font-medium transition-colors", col === k ? "bg-primary/15 text-primary" : "text-muted-foreground")}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {detectors.map((d, r) => (
              <motion.tr key={d.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: r * 0.1 }} className="border-t border-glass-border">
                <th scope="row" className={cn("p-4 text-left font-display", toneText[d.tone])}>{d.short}</th>
                {tableRows[d.id].map((c, k) => (
                  <td key={k} onMouseEnter={() => setCol(k)} className={cn("p-4 transition-all", col === k ? "bg-primary/10" : col !== null && "opacity-40")}>
                    <span className={toneText[c.tone]}>{c.v}</span>
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      <RadarCompare />
    </Section>
  );
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}</span>;
}

function TimeGain() {
  const max = Math.max(...workflow.map((w) => w.steps.reduce((a, s) => a + s.t, 0)));
  const stepTone = ["var(--neutral-tone)", "var(--laser)", "var(--digital)"];
  return (
    <Section id="temps" kicker="07 — Productivité" title="Gain de temps du flux de travail">
      <div className="grid items-center gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="glass space-y-6 p-6">
          {workflow.map((w, r) => (
            <div key={w.id}>
              <p className="mb-2 font-display font-semibold">{w.label}</p>
              <div className="flex h-10 overflow-hidden rounded-lg bg-muted">
                {w.steps.filter((s) => s.t > 0).map((s, k) => (
                  <motion.div key={s.name} title={s.name} className="flex items-center justify-center overflow-hidden whitespace-nowrap text-[11px] font-medium text-background"
                    style={{ background: stepTone[k] }}
                    initial={{ width: 0 }} whileInView={{ width: `${(s.t / max) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: r * 0.3 + k * 0.4 }}>
                    {s.t >= 1.5 && s.name}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground">
            {["Cassette", "Développement / lecture", "Affichage"].map((n, k) => (
              <span key={n} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: stepTone[k] }} />{n}</span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Durées relatives illustratives.</p>
        </div>
        <div className="glass glow p-8 text-center">
          <p className="font-display text-7xl font-bold text-digital">&gt; <Counter to={50} /> %</p>
          <p className="mt-3 text-muted-foreground">de gain de temps du DR vs CR</p>
        </div>
      </div>
    </Section>
  );
}

function Conclusion() {
  const [url, setUrl] = useState("https://id-preview--bd862dc5-5b0f-43dd-8155-60e7441b7a2f.lovable.app");
  useEffect(() => setUrl(window.location.origin), []);
  return (
    <Section id="conclusion" kicker="09 — Conclusion" title="Vers le tout numérique">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <motion.div {...reveal} className="glass space-y-4 p-6 text-lg">
          <p>Le film nu offre une excellente résolution, mais au prix d'une dose élevée et d'un traitement chimique.</p>
          <p>L'écran renforçateur réduit la dose au prix d'un flou lumineux, puis la plaque CR ouvre l'ère numérique tout en gardant la cassette.</p>
          <p>Le capteur plan DR achève la transition : image quasi instantanée, sans chimie, avec un gain de temps de plus de 50 %.</p>
          <div className="flex flex-wrap items-center gap-2 pt-4 text-sm">
            {detectors.map((d, i) => (
              <span key={d.id} className="flex items-center gap-2">
                <span className="rounded-full border px-3 py-1" style={{ borderColor: toneVar[d.tone], color: toneVar[d.tone] }}>{d.short}</span>
                {i < detectors.length - 1 && <span className="text-muted-foreground">→</span>}
              </span>
            ))}
          </div>
        </motion.div>
        <motion.div {...reveal} className="glass flex flex-col items-center gap-4 p-6">
          <div className="rounded-xl bg-foreground p-3"><QRCodeSVG value={url} size={140} bgColor="transparent" fgColor="currentColor" className="text-background" /></div>
          <p className="text-sm text-muted-foreground">Scannez pour ouvrir le site</p>
        </motion.div>
      </div>
      <motion.div {...reveal} className="glass mt-8 p-6 text-sm text-muted-foreground">
        <p className="mb-2 font-display font-semibold text-foreground">Sources & références</p>
        <p>Synthèse & comparatif des détecteurs en radiographie — support de cours, génie biomédical (contenu fourni). Radiographie du simulateur : image illustrative générée.</p>
      </motion.div>
    </Section>
  );
}
