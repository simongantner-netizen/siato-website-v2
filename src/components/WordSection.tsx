import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

/**
 * Eigene, ruhige Sektion mit viel Weissraum: ein grosses Wort im grünen
 * Verlauf (wie „besser und schneller"). Beim Scrollen vier Effekte zugleich:
 *  1. Scale-Reveal — das Wort wächst beim Reinscrollen (0.82× → 1×),
 *  2. kräftiger Parallax (y) + leichte Neigung (rotate) → fliesst durch den Raum,
 *  3. Velocity-Farbfluss — die Grüntöne fliessen durch die Buchstaben, schneller
 *     je schneller man scrollt (wie der Linien-Hintergrund),
 *  4. Grösse pro Wort an die Breite angepasst → bleibt immer lesbar.
 * Bei „Bewegung reduzieren" steht alles still.
 */
const VERLAUF =
  "linear-gradient(90deg, #79a73b 0%, #84b344 4.17%, #8fbe4c 8.33%, #97c854 12.5%, #9ed059 16.67%, #a3d45d 20.83%, #a4d65e 25%, #a3d45d 29.17%, #9ed059 33.33%, #97c854 37.5%, #8fbe4c 41.67%, #84b344 45.83%, #79a73b 50%, #6e9a31 54.17%, #648f29 58.33%, #5b8521 62.5%, #547d1c 66.67%, #4f7918 70.83%, #4e7717 75%, #4f7918 79.17%, #547d1c 83.33%, #5b8521 87.5%, #638f29 91.67%, #6e9a31 95.83%, #79a73a 100%)";

export function WordSection({
  word,
  onClick,
  unterzeile,
  onAktiv,
  onInaktiv,
  ariaLabel,
}: {
  word: string;
  /** Gesetzt = das Wort wird zum Knopf (das "zurueck"-Band ganz unten). */
  onClick?: () => void;
  /** Kleine Zeile unter dem Wort, nur im Knopf-Modus. */
  unterzeile?: string;
  /** Zeiger/Fokus auf dem Knopf - dreht die Stroemung. */
  onAktiv?: () => void;
  onInaktiv?: () => void;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;

  // Position/Grösse: an die Sektions-Scrollposition gekoppelt.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["65%", "-65%"]);
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-3%", "3%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [0.82, 1, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-2.5, 2.5]);

  // Farbfluss: an die Scroll-Geschwindigkeit gekoppelt. Eine Verlaufs-Phase
  // akkumuliert (Ruhe-Drift + Velocity-Schub); daraus oszilliert die
  // background-position sanft hin und her — KEIN Tiling (no-repeat) → keine
  // Kachel-Naht/Haarlinie mehr.
  const { scrollY } = useScroll();
  const smoothVel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300, mass: 1 });
  const phase = useMotionValue(0);
  useAnimationFrame((_t, dtMs) => {
    if (reduce) return;
    const dt = Math.min(dtMs, 50) / 1000;
    const v = Math.abs(smoothVel.get());
    phase.set(phase.get() + (0.25 + v * 0.0009) * dt); // rad/s
  });
  // Fenster wandert nur zwischen 10%..90% → die Verlaufs-Ränder bleiben
  // immer verdeckt (kein transparenter Rand trotz no-repeat).
  const bgPos = useTransform(phase, (p) => `${(50 + 40 * Math.sin(p)).toFixed(2)}%`);

  // Schriftgrösse pro Wort, damit die Breite passt (lange Wörter kleiner).
  const fontSize = `clamp(3rem, ${(162 / word.length).toFixed(1)}vw, 28rem)`;

  const verlauf = {
    backgroundImage: VERLAUF,
    backgroundSize: "250% 100%",
    backgroundRepeat: "no-repeat",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
  } as const;

  /* pr/-mr gleicht die nachlaufende Laufweiten-Verengung aus: tracking-tighter
     zieht -0.05em auch HINTER dem letzten Buchstaben ab, der Elementkasten endet
     dadurch vor dem Zeichenende. Da der Verlauf die Glyphe ueber
     background-clip:text malt und am Kasten endet, blieb der letzte Streifen
     ungemalt — beim «k» von «zurueck» war das sichtbar das halbe Bein.
     Das negative Margin haelt die Layoutbreite unveraendert. */
  const wortKlassen =
    "select-none whitespace-nowrap text-center font-black leading-none tracking-tighter pr-[0.05em] -mr-[0.05em]";

  // Im Knopf-Modus ist das Wort selbst der Knopf; die Bewegung sitzt auf der
  // Huelle, damit die Klickflaeche immer dort ist, wo das Wort zu sehen ist.
  const Wort = onClick ? motion.button : motion.h2;

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden py-24 md:py-40"
    >
      <motion.div
        style={{ y, x, scale, rotate }}
        className="inline-flex flex-col items-center gap-4"
      >
        <Wort
          {...(onClick
            ? {
                type: "button" as const,
                onClick,
                onPointerEnter: onAktiv,
                onPointerLeave: onInaktiv,
                onFocus: onAktiv,
                onBlur: onInaktiv,
                "aria-label": ariaLabel ?? word + " - zurueck nach oben",
              }
            : {})}
          style={{ fontSize, backgroundPositionX: bgPos, ...verlauf }}
          className={
            onClick
              ? wortKlassen +
                " block cursor-pointer rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-[#80BA2B]/60 focus-visible:ring-offset-8"
              : wortKlassen
          }
        >
          {word}
        </Wort>

        {onClick && unterzeile && (
          <span
            aria-hidden="true"
            className="text-xs font-semibold uppercase tracking-widest text-slate-400 md:text-sm"
          >
            {unterzeile}
          </span>
        )}
      </motion.div>
    </section>
  );
}
