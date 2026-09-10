import { useRef } from "react";
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

export const TILE_W = 1440;
export const TILE_H = 800;
const TAU = Math.PI * 2;

export type Harmonic = { k: number; amp: number; phase: number };
export type Line = {
  baseY: number;
  harmonics: Harmonic[];
  width: number;
  opacity: number;
  color: string;
};
type LayerCfg = {
  idleSpeed: number; // % einer Kachel pro Sekunde (50% = eine Kachel)
  speedGain: number; // wie stark der Scroll das Tempo treibt
  ampGain: number; // zusätzliche scaleY-Amplitude bei vollem Scroll-Tempo
  breath: number; // vertikale Ruhe-Undulation (scaleY)
  breathSpeed: number;
  blur: number;
  lines: Line[];
};

function yAt(x: number, baseY: number, harmonics: Harmonic[], verstaerkung = 1): number {
  let y = baseY;
  for (const h of harmonics) {
    y += h.amp * verstaerkung * Math.sin((h.k * TAU * x) / TILE_W + h.phase);
  }
  return y;
}

/** Seidig-glatter, exakt periodischer Pfad (Catmull-Rom → kubische Béziers,
 *  periodische Nachbarn → auch die Kachel-Naht ist knickfrei). */
export function buildPath(line: Line, verstaerkung = 1, baseY = line.baseY): string {
  const N = 16;
  const dx = TILE_W / N;
  const ys: number[] = [];
  for (let i = 0; i <= N; i++) ys.push(yAt(i * dx, baseY, line.harmonics, verstaerkung));
  const yMod = (i: number) => ys[((i % N) + N) % N];

  let d = `M 0 ${ys[0].toFixed(2)}`;
  for (let i = 0; i < N; i++) {
    const x0 = i * dx;
    const x1 = (i + 1) * dx;
    const cp1y = ys[i] + (ys[i + 1] - yMod(i - 1)) / 6;
    const cp2y = ys[i + 1] - (yMod(i + 2) - ys[i]) / 6;
    d += ` C ${(x0 + dx / 3).toFixed(2)} ${cp1y.toFixed(2)}, ${(x1 - dx / 3).toFixed(2)} ${cp2y.toFixed(2)}, ${x1.toFixed(0)} ${ys[i + 1].toFixed(2)}`;
  }
  return d;
}

const G = "#80BA2B";
const G_DARK = "#6da524";

// Drei Tiefen-Ebenen: hinten langsam/blass/leicht unscharf, vorne klarer.
// Amplituden bewusst kräftiger als zuvor → „mehr Wellen".
export const LAYERS: LayerCfg[] = [
  {
    idleSpeed: 0.55, speedGain: 2.6, ampGain: 0.34, breath: 0.05, breathSpeed: 0.18, blur: 0.6,
    lines: [
      { baseY: 130, width: 1, opacity: 0.1, color: G, harmonics: [ { k: 1, amp: 92, phase: 0.4 }, { k: 2, amp: 30, phase: 1.1 }, { k: 3, amp: 12, phase: 2.0 } ] },
      { baseY: 440, width: 1, opacity: 0.09, color: G, harmonics: [ { k: 1, amp: 82, phase: 2.3 }, { k: 3, amp: 22, phase: 0.2 } ] },
      { baseY: 710, width: 1, opacity: 0.1, color: G, harmonics: [ { k: 1, amp: 98, phase: 4.0 }, { k: 2, amp: 26, phase: 2.7 } ] },
    ],
  },
  {
    idleSpeed: 0.8, speedGain: 2.8, ampGain: 0.26, breath: 0.04, breathSpeed: 0.24, blur: 0,
    lines: [
      { baseY: 240, width: 1.25, opacity: 0.14, color: G, harmonics: [ { k: 1, amp: 74, phase: 1.4 }, { k: 2, amp: 32, phase: 3.0 } ] },
      { baseY: 530, width: 1.25, opacity: 0.13, color: G, harmonics: [ { k: 1, amp: 86, phase: 3.6 }, { k: 3, amp: 22, phase: 1.9 } ] },
      { baseY: 770, width: 1.25, opacity: 0.13, color: G, harmonics: [ { k: 1, amp: 66, phase: 0.9 }, { k: 2, amp: 26, phase: 4.4 } ] },
    ],
  },
  {
    idleSpeed: 1.15, speedGain: 3.0, ampGain: 0.18, breath: 0.03, breathSpeed: 0.32, blur: 0,
    lines: [
      { baseY: 80, width: 1.5, opacity: 0.2, color: G_DARK, harmonics: [ { k: 1, amp: 60, phase: 2.0 }, { k: 2, amp: 34, phase: 0.5 } ] },
      { baseY: 360, width: 1.5, opacity: 0.18, color: G_DARK, harmonics: [ { k: 1, amp: 70, phase: 5.0 }, { k: 3, amp: 22, phase: 3.3 } ] },
      { baseY: 620, width: 1.5, opacity: 0.19, color: G_DARK, harmonics: [ { k: 1, amp: 76, phase: 1.0 }, { k: 2, amp: 28, phase: 2.2 } ] },
    ],
  },
];

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
  const pos = useRef(Math.random() * -50); // versetzter Startpunkt pro Ebene
  const x = useMotionValue(pos.current);
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
