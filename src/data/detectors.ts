export type Tone = "dose" | "reso" | "laser" | "digital" | "neutral";

export const toneText: Record<Tone, string> = {
  dose: "text-dose", reso: "text-reso", laser: "text-laser", digital: "text-digital", neutral: "text-neutral-tone",
};
export const toneBg: Record<Tone, string> = {
  dose: "bg-dose", reso: "bg-reso", laser: "bg-laser", digital: "bg-digital", neutral: "bg-neutral-tone",
};
export const toneBorder: Record<Tone, string> = {
  dose: "border-dose/40", reso: "border-reso/40", laser: "border-laser/40", digital: "border-digital/40", neutral: "border-neutral-tone/40",
};
export const toneVar: Record<Tone, string> = {
  dose: "var(--dose)", reso: "var(--reso)", laser: "var(--laser)", digital: "var(--digital)", neutral: "var(--neutral-tone)",
};

export type DetectorId = "film" | "ecran" | "cr" | "dr";

export interface Detector {
  id: DetectorId;
  short: string;
  name: string;
  tech: string;
  era: string;
  tone: Tone;
  summaryValue: string;
  summaryLabel: string;
  badges: { label: string; tone: Tone }[];
  principle: string;
  keyPoints: string[];
}

export const detectors: Detector[] = [
  {
    id: "film", short: "Film nu", name: "Film radiographique (nu)", tech: "Technologie analogique", era: "Analogique",
    tone: "neutral", summaryValue: "Très élevée", summaryLabel: "Dose / Métabolisme",
    badges: [{ label: "Dose élevée", tone: "dose" }, { label: "Haute résolution", tone: "reso" }],
    principle: "Une émulsion contenant des cristaux de bromure d'argent noircit directement sous l'action directe des rayons X.",
    keyPoints: [
      "Sensible mais peu efficace : nécessite une dose élevée car les rayons X interagissent peu avec l'émulsion.",
      "Très bonne résolution spatiale.",
      "Traitement chimique obligatoire (développement et fixage en chambre noire).",
    ],
  },
  {
    id: "ecran", short: "Écran renforçateur", name: "Écran renforçateur", tech: "Couple écran-film", era: "Analogique",
    tone: "reso", summaryValue: "Modérée", summaryLabel: "Diffusion lumineuse",
    badges: [{ label: "Flou lumineux", tone: "laser" }, { label: "Dose réduite", tone: "reso" }],
    principle: "Le film est placé entre deux écrans. Les écrans absorbent les rayons X et émettent de la lumière qui impressionne le film.",
    keyPoints: [
      "Compromis classique : plus rapide et nécessite moins de dose que le film seul.",
      "L'épaisseur de l'écran introduit un flou par diffusion lumineuse, ce qui limite la résolution spatiale.",
      "Traitement chimique toujours requis.",
    ],
  },
  {
    id: "cr", short: "Plaque CR", name: "Plaque au phosphore (CR)", tech: "Computed Radiography", era: "Numérique indirect",
    tone: "laser", summaryValue: "Numérique indirect", summaryLabel: "Lecture laser (IP)",
    badges: [{ label: "Image numérique", tone: "digital" }, { label: "Lecture laser", tone: "laser" }],
    principle: "Une plaque (IP) stocke l'image sous forme d'énergie dans un phosphore photostimulable. Un laser la scanne ensuite pour libérer la lumière.",
    keyPoints: [
      "Première étape numérique : conserve le concept de cassette.",
      "Permet le post-traitement et l'archivage informatique.",
      "Dose réduite par rapport au film nu.",
      "Résolution limitée par le diamètre du laser de lecture.",
    ],
  },
  {
    id: "dr", short: "Capteur plan DR", name: "Capteur plan (DR)", tech: "Direct Radiography", era: "Numérique direct",
    tone: "digital", summaryValue: "Quasi instantanée", summaryLabel: "Gain de temps > 50 %",
    badges: [{ label: "Temps réel", tone: "digital" }, { label: "Pas de chimie", tone: "digital" }],
    principle: "Détecteur électronique intégré (panneau plat) convertissant les rayons X directement en charges, ou via un scintillateur puis en charges.",
    keyPoints: [
      "Le plus moderne et rapide : pas de cassette, affichage quasi instantané sur écran.",
      "Flux de travail très productif (gain de temps > 50 % vs CR).",
      "Gamme dynamique large et absence totale de traitement chimique.",
    ],
  },
];

export const tableColumns = [
  "Dose", "Résolution spatiale", "Traitement chimique", "Cassette", "Rapidité", "Post-traitement / archivage", "Dynamique",
] as const;

export const tableRows: Record<DetectorId, { v: string; tone: Tone }[]> = {
  film: [
    { v: "Très élevée", tone: "dose" }, { v: "Très bonne", tone: "reso" }, { v: "Oui", tone: "dose" },
    { v: "Oui", tone: "neutral" }, { v: "Lente", tone: "dose" }, { v: "Non", tone: "neutral" }, { v: "Limitée", tone: "neutral" },
  ],
  ecran: [
    { v: "Modérée", tone: "laser" }, { v: "Limitée (flou)", tone: "laser" }, { v: "Oui", tone: "dose" },
    { v: "Oui", tone: "neutral" }, { v: "Plus rapide que le film", tone: "laser" }, { v: "Non", tone: "neutral" }, { v: "Limitée", tone: "neutral" },
  ],
  cr: [
    { v: "Réduite vs film nu", tone: "reso" }, { v: "Limitée (laser)", tone: "laser" }, { v: "Non", tone: "digital" },
    { v: "Oui", tone: "neutral" }, { v: "Lecture laser", tone: "laser" }, { v: "Oui", tone: "digital" }, { v: "Numérique", tone: "digital" },
  ],
  dr: [
    { v: "Réduite", tone: "digital" }, { v: "Bonne", tone: "reso" }, { v: "Non", tone: "digital" },
    { v: "Non", tone: "digital" }, { v: "Quasi instantanée", tone: "digital" }, { v: "Oui", tone: "digital" }, { v: "Large", tone: "digital" },
  ],
};

/** Qualitative scores (0–5) derived from the comparison above, for the radar chart. */
export const radarData = [
  { axis: "Dose faible", film: 1, ecran: 3, cr: 3.5, dr: 4.5 },
  { axis: "Résolution", film: 5, ecran: 3, cr: 3, dr: 4 },
  { axis: "Rapidité", film: 1, ecran: 2, cr: 3, dr: 5 },
  { axis: "Sans chimie", film: 0, ecran: 0, cr: 5, dr: 5 },
  { axis: "Dynamique", film: 2, ecran: 2, cr: 4, dr: 5 },
  { axis: "Archivage", film: 1, ecran: 1, cr: 5, dr: 5 },
];

/** Relative workflow durations (arbitrary units) – DR is > 50 % faster than CR. */
export const workflow: { id: DetectorId; label: string; steps: { name: string; t: number }[] }[] = [
  { id: "ecran", label: "Film / écran", steps: [{ name: "Cassette", t: 3 }, { name: "Développement chimique", t: 8 }, { name: "Affichage", t: 2 }] },
  { id: "cr", label: "CR", steps: [{ name: "Cassette", t: 3 }, { name: "Lecture laser", t: 4 }, { name: "Affichage", t: 1 }] },
  { id: "dr", label: "DR", steps: [{ name: "Cassette", t: 0 }, { name: "Lecture", t: 2.5 }, { name: "Affichage", t: 0.8 }] },
];

export const quiz = [
  {
    q: "Quel(s) détecteur(s) nécessite(nt) un traitement chimique ?",
    options: ["Film nu et écran renforçateur", "Plaque CR uniquement", "Capteur plan DR", "Aucun"],
    answer: 0,
    why: "Le film nu et le couple écran-film exigent développement et fixage en chambre noire ; CR et DR sont numériques.",
  },
  {
    q: "Qu'est-ce qui limite la résolution spatiale de la plaque CR ?",
    options: ["La chimie du révélateur", "Le diamètre du laser de lecture", "L'absence de cassette", "Le bromure d'argent"],
    answer: 1,
    why: "La lecture se fait par balayage laser : la taille du spot de lecture borne la résolution.",
  },
  {
    q: "Pourquoi l'écran renforçateur réduit-il la dose ?",
    options: [
      "Il filtre les rayons X diffusés",
      "Il absorbe les rayons X et émet de la lumière qui impressionne le film",
      "Il stocke l'énergie dans un phosphore",
      "Il convertit directement les rayons X en charges",
    ],
    answer: 1,
    why: "Les écrans convertissent chaque photon X absorbé en nombreux photons lumineux, bien plus efficaces sur le film.",
  },
  {
    q: "Pourquoi le film nu nécessite-t-il une dose élevée ?",
    options: [
      "Les rayons X interagissent peu avec l'émulsion",
      "Le laser est trop large",
      "Le scintillateur est trop épais",
      "La cassette absorbe les rayons",
    ],
    answer: 0,
    why: "Sensible mais peu efficace : peu de photons X sont arrêtés par l'émulsion, il en faut donc beaucoup.",
  },
  {
    q: "Quel gain de temps le DR apporte-t-il par rapport au CR ?",
    options: ["Environ 10 %", "Environ 25 %", "Plus de 50 %", "Aucun"],
    answer: 2,
    why: "Sans cassette et avec affichage quasi instantané, le DR fait gagner plus de 50 % de temps vs CR.",
  },
];

export const sections = [
  { id: "hero", label: "Accueil" },
  { id: "apercu", label: "Aperçu" },
  { id: "frise", label: "Frise" },
  { id: "fiches", label: "Fiches" },
  { id: "simulateur", label: "Simulateur" },
  { id: "comparatif", label: "Comparatif" },
  { id: "temps", label: "Gain de temps" },
  { id: "quiz", label: "Quiz" },
  { id: "conclusion", label: "Conclusion" },
];
