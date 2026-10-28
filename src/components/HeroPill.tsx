import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const TEXTS = [
  "In der Schweiz entwickelt.",
  "In Microsoft 365 integriert.",
  "Schon ab CHF X.– pro Benutzer.",
  "Für Schweizer KMU gebaut.",
];
const LONGEST = TEXTS.reduce((a, b) => (b.length > a.length ? b : a));
const INTERVAL = 3800; // ruhiges Tempo (ms) — länger = ruhiger

/**
 * Grüner Pill, der eigenständig (Timer) durch die Zeilen wechselt — ruhig und
 * fliessend dank sanftem Ganzwort-Fade (kein nervöses Buchstaben-Stagger).
 * Bei „Bewegung reduzieren" bleibt eine feste Zeile stehen.
 */
export function HeroPill() {
  const reduce = useReducedMotion() ?? false;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % TEXTS.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="mt-7 flex justify-center">
      <div className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#80BA2B] px-6 py-2.5 text-lg font-semibold text-white shadow-lg shadow-[#80BA2B]/25 md:px-8 md:py-3 md:text-2xl">
        {/* Unsichtbarer Platzhalter hält die Breite stabil (kein Springen) */}
        <span className="invisible" aria-hidden>
          {LONGEST}
        </span>
        <span className="absolute inset-0 flex items-center justify-center px-6 md:px-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={idx}
              initial={{ y: "0.6em", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-0.6em", opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="whitespace-nowrap"
            >
              {TEXTS[idx]}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </div>
  );
}
