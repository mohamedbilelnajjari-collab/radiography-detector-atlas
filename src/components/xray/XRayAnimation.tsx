import { motion } from "framer-motion";
import type { DetectorId } from "@/data/detectors";

const P = "var(--primary)";
const loop = { repeat: Infinity, ease: "easeIn" as const };

function Photons({ xs, toY, delay = 0, dur = 1.6 }: { xs: number[]; toY: number; delay?: number; dur?: number }) {
  return (
    <>
      {xs.map((x, i) => (
        <motion.line key={i} x1={x} x2={x} stroke={P} strokeWidth={2} strokeLinecap="round"
          initial={{ y1: 0, y2: 14, opacity: 0 }}
          animate={{ y1: [0, toY - 14], y2: [14, toY], opacity: [0, 1, 0] }}
          transition={{ ...loop, duration: dur, delay: delay + i * 0.35 }} />
      ))}
    </>
  );
}

function Film() {
  const cells = Array.from({ length: 24 }, (_, i) => i);
  return (
    <>
      <Photons xs={[40, 90, 140, 190, 240]} toY={120} />
      <rect x={20} y={120} width={240} height={50} rx={6} fill="var(--card)" stroke="var(--glass-border)" />
      {cells.map((i) => (
        <motion.rect key={i} x={28 + (i % 12) * 19.5} y={128 + Math.floor(i / 12) * 18} width={14} height={14} rx={3}
          fill="var(--neutral-tone)"
          animate={{ opacity: [0.9, 0.1, 0.1, 0.9] }}
          transition={{ duration: 5, repeat: Infinity, delay: (i * 0.37) % 4 }} />
      ))}
      <text x={140} y={192} textAnchor="middle" className="fill-muted-foreground text-[10px]">Cristaux d'AgBr qui noircissent</text>
    </>
  );
}

function Ecran() {
  return (
    <>
      <Photons xs={[70, 140, 210]} toY={100} />
      <rect x={20} y={100} width={240} height={18} rx={3} fill="color-mix(in oklab, var(--reso) 45%, transparent)" />
      <rect x={20} y={120} width={240} height={10} fill="var(--neutral-tone)" opacity={0.5} />
      <rect x={20} y={132} width={240} height={18} rx={3} fill="color-mix(in oklab, var(--reso) 45%, transparent)" />
      {[70, 140, 210].map((x, i) => (
        <motion.path key={x} d={`M${x} 110 L${x - 22} 128 L${x + 22} 128 Z`} fill="var(--laser)"
          animate={{ opacity: [0, 0.8, 0], scale: [0.4, 1.2, 1.4] }} style={{ transformOrigin: `${x}px 110px` }}
          transition={{ duration: 1.6, repeat: Infinity, delay: 1.5 + i * 0.35 }} />
      ))}
      <text x={140} y={175} textAnchor="middle" className="fill-muted-foreground text-[10px]">Écran · Film · Écran — lumière diffusée en cône</text>
    </>
  );
}

function CR() {
  return (
    <>
      <Photons xs={[60, 110, 160, 210]} toY={80} dur={1.2} />
      <rect x={30} y={80} width={220} height={60} rx={6} fill="color-mix(in oklab, var(--laser) 18%, var(--card))" stroke="var(--laser)" strokeOpacity={0.5} />
      <motion.rect x={30} y={80} width={6} height={60} fill="var(--laser)"
        animate={{ x: [30, 244, 30] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
      <motion.circle cy={160} r={4} fill="var(--laser)" animate={{ cx: [33, 247, 33], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
      <motion.rect x={210} y={150} width={50} height={36} rx={4} fill="none" stroke="var(--digital)"
        animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 4, repeat: Infinity }} />
      <text x={20} y={180} className="fill-muted-foreground text-[10px]">Stockage → laser → lumière → image</text>
    </>
  );
}

function DR() {
  const px = Array.from({ length: 60 }, (_, i) => i);
  return (
    <>
      <Photons xs={[50, 100, 150, 200, 250]} toY={70} dur={1} />
      {px.map((i) => (
        <motion.rect key={i} x={30 + (i % 12) * 19} y={72 + Math.floor(i / 12) * 19} width={15} height={15} rx={2}
          fill="var(--digital)"
          animate={{ opacity: [0.08, 0.9, 0.08] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: ((i % 12) + Math.floor(i / 12)) * 0.06 }} />
      ))}
      <text x={140} y={182} textAnchor="middle" className="fill-muted-foreground text-[10px]">Matrice de pixels — image instantanée</text>
    </>
  );
}

export function XRayAnimation({ id }: { id: DetectorId }) {
  return (
    <svg viewBox="0 0 280 200" role="img" aria-label={`Animation du principe : ${id}`} className="h-auto w-full">
      {id === "film" && <Film />}
      {id === "ecran" && <Ecran />}
      {id === "cr" && <CR />}
      {id === "dr" && <DR />}
    </svg>
  );
}
