import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Section({ id, kicker, title, children }: { id: string; kicker?: string; title?: string; children: ReactNode }) {
  return (
    <section id={id} data-section aria-labelledby={title ? `${id}-title` : undefined} className="relative flex min-h-screen scroll-mt-0 items-center px-5 py-24 md:px-16">
      <div className="mx-auto w-full max-w-6xl">
        {title && (
          <motion.header initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="mb-12">
            {kicker && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">{kicker}</p>}
            <h2 id={`${id}-title`} className="text-3xl font-bold md:text-5xl">{title}</h2>
          </motion.header>
        )}
        {children}
      </div>
    </section>
  );
}

export const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};
