/**
 * Die Geometrie der Siato-Wellen - Zahlen und Kurven, kein React.
 *
 * Sie lag bis zum 16.09.2026 in FlowLines.tsx. Zwei Gruende fuer den Auszug:
 *
 * - Sie gehoert nicht nur dem Hintergrund. Der Vorhang beim Laden zeichnet
 *   dieselben Wellen (Splash.tsx) - es ist dieselbe Geometrie, nicht eine
 *   nachgebaute. Dass beide aus derselben Datei lesen, ist der Punkt.
 * - Eine Datei, die Komponenten UND Konstanten ausgibt, nimmt dem Dev-Server
 *   das gezielte Nachladen: er kann dann nicht mehr wissen, ob sich eine
 *   Komponente oder ein Wert geaendert hat, und laedt die ganze Seite neu.
 *   Genau das hat ESLint hier vier Mal angemahnt.
 */

export const TILE_W = 1440;
export const TILE_H = 800;
export const TAU = Math.PI * 2;

export type Harmonic = { k: number; amp: number; phase: number };
export type Line = {
  baseY: number;
  harmonics: Harmonic[];
  width: number;
  opacity: number;
  color: string;
};
export type LayerCfg = {
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
