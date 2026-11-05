import { useId, useState } from "react";
import xray from "@/assets/chest-xray.jpg";
import { detectors, toneVar } from "@/data/detectors";

export function Simulator() {
  const [dose, setDose] = useState(60);
  const [det, setDet] = useState(0);
  const d = detectors[det];
  const fid = useId().replace(/:/g, "");

  // Effective signal: film nu needs more dose; screen/CR/DR are more efficient.
  const efficiency = [0.45, 0.85, 0.9, 1][det];
  const signal = Math.min(1, (dose / 100) * efficiency * 1.4);
  const noise = Math.max(0, 1 - signal) * 0.9;
  const blur = det === 1 ? 2.2 : det === 2 ? 0.9 : 0;

  const caption = [
    noise > 0.45 ? "Dose insuffisante : l'image est granuleuse (bruit quantique)." : noise > 0.15 ? "Léger bruit visible." : "Signal suffisant : bruit faible.",
    det === 0 && "Film nu : netteté maximale, mais il faut beaucoup de dose pour noircir l'émulsion.",
    det === 1 && "Écran renforçateur : moins de dose, mais flou par diffusion lumineuse dans l'écran.",
    det === 2 && "Plaque CR : image numérique, résolution limitée par le diamètre du laser de lecture.",
    det === 3 && "Capteur DR : image nette, instantanée, gamme dynamique large.",
  ].filter(Boolean);

  return (
    <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
      <div className="glass relative overflow-hidden p-3">
        <svg className="absolute h-0 w-0" aria-hidden>
          <filter id={fid}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <img src={xray} alt="Radiographie thoracique de face" width={1024} height={1024} loading="lazy"
            className="h-full w-full object-cover transition-all duration-300"
            style={{ filter: `blur(${blur}px) brightness(${0.55 + signal * 0.5}) contrast(${0.8 + signal * 0.4})` }} />
          <svg className="pointer-events-none absolute inset-0 h-full w-full mix-blend-overlay" style={{ opacity: noise }} aria-hidden>
            <rect width="100%" height="100%" filter={`url(#${fid})`} />
          </svg>
          <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-background" style={{ background: toneVar[d.tone] }}>{d.short}</span>
        </div>
      </div>
      <div className="glass flex flex-col gap-8 p-6">
        <label className="block">
          <span className="flex justify-between text-sm"><span>Dose</span><span className="text-dose">{dose} %</span></span>
          <input type="range" min={5} max={100} value={dose} onChange={(e) => setDose(+e.target.value)} className="mt-3 w-full" style={{ accentColor: "var(--dose)" }} />
        </label>
        <label className="block">
          <span className="flex justify-between text-sm"><span>Type de détecteur</span><span style={{ color: toneVar[d.tone] }}>{d.short}</span></span>
          <input type="range" min={0} max={3} step={1} value={det} onChange={(e) => setDet(+e.target.value)} className="mt-3 w-full" style={{ accentColor: toneVar[d.tone] }}
            aria-valuetext={d.short} />
          <span className="mt-1 flex justify-between text-[10px] text-muted-foreground">{detectors.map((x) => <span key={x.id}>{x.short}</span>)}</span>
        </label>
        <div aria-live="polite" className="space-y-2 rounded-xl border border-glass-border p-4 text-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Ce que l'on observe</p>
          {caption.map((c) => <p key={c as string} className="text-muted-foreground">{c}</p>)}
        </div>
      </div>
    </div>
  );
}
