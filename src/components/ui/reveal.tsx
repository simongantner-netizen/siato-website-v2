import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Gerichtetes Einblenden beim Reinscrollen — etwas mehr Weg, sanftes
 * Blur-Auflösen und ein Hauch Scale. Zusammen mit dem globalen Smooth-Scroll
 * (Lenis) fühlt sich das geschmeidig statt „brav" an.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 44,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Start-Versatz nach unten (px). */
  y?: number;
}) {
  const variants: Variants = {
    hidden: { opacity: 0, y, scale: 0.985, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      /* Marke fuers Prerendering: index.html versteckt [data-reveal] per CSS,
         sobald JavaScript laeuft, und das Postbuild-Skript raeumt hier die
         Inline-Styles weg. Siehe prerender.mjs. */
      data-reveal=""
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-90px" }}
    >
      {children}
    </motion.div>
  );
}
