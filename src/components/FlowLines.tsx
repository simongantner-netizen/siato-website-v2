import { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { flussRichtung } from "./flow-signal";
import {
  LAYERS,
  TAU,
  TILE_H,
  TILE_W,
  buildPath,
  type LayerCfg,
  type Line,
} from "./flow-geometrie";

/**
 * Fliessender Linien-Hintergrund — reagiert auf den Scroll.
 *
 * Ruhezustand: die Linien fliessen langsam seitwärts und „atmen" leicht
 * vertikal. Beim Scrollen treibt die Scroll-Geschwindigkeit (velocity) sie an:
 * sie fliessen schneller und schlagen stärker aus (scaleY), danach pendelt
 * alles über eine Feder (useSpring) sanft in den Ruhe-Flow zurück.
 *
 * Performance: nur GPU-Transforms (translateX/scaleY) über Framer-Motion-
 * Motion-Values; pro Frame nur ein paar Zahlen gesetzt, kein Layout/Decode.
 * Bei „Bewegung reduzieren" stehen die Linien still.
 */

function Tile({ lines }: { lines: Line[] }) {
  return (
    <svg
      viewBox={`0 0 ${TILE_W} ${TILE_H}`}
      preserveAspectRatio="none"
      className="h-full w-1/2 shrink-0"
      aria-hidden
    >
      {lines.map((line, i) => (
        <path
          key={i}
          d={buildPath(line)}
          fill="none"
          stroke={line.color}
          strokeWidth={line.width}
          strokeOpacity={line.opacity}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

function FlowLayer({
  cfg,
  boost,
  richtung,
  reduce,
}: {
  cfg: LayerCfg;
  boost: MotionValue<number>;
  richtung: MotionValue<number>;
  reduce: boolean;
}) {
  /* Versetzter Startpunkt pro Ebene, damit die drei Tiefen nicht im
     Gleichschritt laufen. Math.random() stand bis zum 16.09.2026 direkt im
     Render - React darf einen Render aber verwerfen und wiederholen, und dann
     steht beim zweiten Mal eine andere Zahl da. Der Initialisierer von
     useState laeuft dagegen genau einmal je Einhaengung. */
  const [start] = useState(() => Math.random() * -50);
  const pos = useRef(start);
  const x = useMotionValue(start);
  const sy = useMotionValue(1);

  useAnimationFrame((t, delta) => {
    if (reduce) return;
    const dt = Math.min(delta, 50) / 1000;
    const b = boost.get(); // 0..1, geglättet
    // Seitwärts-Tempo: Ruhe + Scroll-Schub
    // Richtung: +1 normal, -1 rueckwaerts. Laeuft ueber eine Feder, damit die
    // Stroemung abbremst, steht und dreht, statt zu schnappen.
    const dir = richtung.get();
    const speed = cfg.idleSpeed * (1 + b * cfg.speedGain) * dir;
    let p = pos.current - speed * dt;
    if (p <= -50) p += 50; // nahtloser Loop vorwaerts (eine Kachel = 50%)
    else if (p >= 0) p -= 50; // und rueckwaerts
    pos.current = p;
    x.set(p);
    // Amplitude: leichtes Ruhe-Atmen + Ausschlag mit Scroll-Tempo
    const breathe = 1 + cfg.breath * Math.sin(t * 0.001 * TAU * cfg.breathSpeed);
    sy.set(breathe + b * cfg.ampGain);
  });

  const transform = useMotionTemplate`translateX(${x}%) scaleY(${sy})`;

  return (
    <motion.div
      className="absolute inset-0 flex w-[200%]"
      style={{
        transform,
        transformOrigin: "50% 50%",
        filter: cfg.blur ? `blur(${cfg.blur}px)` : undefined,
        willChange: "transform",
      }}
    >
      <Tile lines={cfg.lines} />
      <Tile lines={cfg.lines} />
    </motion.div>
  );
}

export function FlowLines() {
  const reduce = useReducedMotion() ?? false;

  const { scrollY } = useScroll();
  const scrollVel = useVelocity(scrollY);
  // Geschwindigkeit glätten → kein Schnappen, sanftes Aus-/Einpendeln.
  const smoothVel = useSpring(scrollVel, { damping: 40, stiffness: 180, mass: 1 });
  // Normalisierter Schub 0..1 (Betrag, gedeckelt). Skala 2350 px/s → ~+10%
  // stärkere Reaktion als zuvor (2600).
  const boost = useTransform(smoothVel, (v) => Math.min(1, Math.abs(v) / 2350));
  // Richtungswechsel weich: die Feder laeuft durch 0 hindurch.
  const richtung = useSpring(flussRichtung, { damping: 26, stiffness: 90, mass: 1 });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0, #000 7%, #000 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0, #000 7%, #000 92%, transparent 100%)",
      }}
    >
      {LAYERS.map((cfg, i) => (
        <FlowLayer key={i} cfg={cfg} boost={boost} richtung={richtung} reduce={reduce} />
      ))}
    </div>
  );
}
