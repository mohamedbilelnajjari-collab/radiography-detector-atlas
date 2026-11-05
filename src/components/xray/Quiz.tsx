import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { quiz } from "@/data/detectors";
import { cn } from "@/lib/utils";

export function Quiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= quiz.length;

  if (done) {
    const pct = Math.round((score / quiz.length) * 100);
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass mx-auto max-w-xl p-10 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Score final</p>
        <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="my-4 font-display text-7xl font-bold text-primary">
          {score}/{quiz.length}
        </motion.p>
        <p className="text-muted-foreground">{pct >= 80 ? "Excellent, vous maîtrisez les détecteurs !" : pct >= 50 ? "Bien joué, encore un petit effort." : "Relisez les fiches et retentez !"}</p>
        <button onClick={() => { setI(0); setScore(0); setPicked(null); }} className="mt-6 rounded-full bg-primary px-6 py-2 font-medium text-primary-foreground">Recommencer</button>
      </motion.div>
    );
  }

  const q = quiz[i]!;
  return (
    <div className="glass mx-auto max-w-2xl p-6 md:p-10">
      <div className="mb-6 h-1 overflow-hidden rounded-full bg-muted">
        <motion.div className="h-full bg-primary" animate={{ width: `${(i / quiz.length) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
          <p className="text-xs text-muted-foreground">Question {i + 1} / {quiz.length}</p>
          <h3 className="mt-2 text-xl font-semibold md:text-2xl">{q.q}</h3>
          <div className="mt-6 grid gap-3" role="radiogroup">
            {q.options.map((o, k) => {
              const state = picked === null ? "" : k === q.answer ? "border-digital bg-digital/15" : k === picked ? "border-dose bg-dose/15" : "opacity-50";
              return (
                <button key={k} role="radio" aria-checked={picked === k} disabled={picked !== null}
                  onClick={() => { setPicked(k); if (k === q.answer) setScore((s) => s + 1); }}
                  className={cn("rounded-xl border border-glass-border p-4 text-left transition-colors hover:bg-accent", state)}>
                  {o}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6" aria-live="polite">
              <p className={picked === q.answer ? "font-semibold text-digital" : "font-semibold text-dose"}>{picked === q.answer ? "Correct !" : "Incorrect."}</p>
              <p className="mt-1 text-sm text-muted-foreground">{q.why}</p>
              <button onClick={() => { setI(i + 1); setPicked(null); }} className="mt-4 rounded-full bg-primary px-6 py-2 font-medium text-primary-foreground">
                {i + 1 < quiz.length ? "Question suivante →" : "Voir le score"}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
