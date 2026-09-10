/**
 * Bildmarke: ein dynamisches Flow-Ribbon aus vielen dünnen Strömungslinien —
 * dieselbe Sprache wie der animierte Linien-Hintergrund. Die Linien teilen
 * eine fliessende Wellenform und fächern über einen modulierten Abstand auf
 * (sie bunchen und spreizen), was den dynamischen „Fluss" erzeugt.
 */
const TAU = Math.PI * 2;
const MARK_W = 72;
const MARK_H = 48;

function linePath(yfn: (u: number) => number, step = 2): string {
  let d = "";
  for (let x = 0; x <= MARK_W; x += step) {
    const y = yfn(x / MARK_W);
    d += (d ? " L " : "M ") + x.toFixed(2) + " " + y.toFixed(2);
  }
  return d;
}

// „H1": 7 Linien, eine ruhige, harmonische Welle (ein Crest), gefächerter Abstand.
const RIBBON: string[] = (() => {
  const N = 7;
  const cy = 24;
  const amp = 8;
  const g0 = 4.4;
  const env: [number, number] = [0.62, 0.5];
  const out: string[] = [];
  for (let k = 0; k < N; k++) {
    const kk = k - (N - 1) / 2;
    out.push(
      linePath((u) => {
        const center = cy + amp * Math.sin(TAU * 0.85 * u + 0.8);
        const gap = g0 * (env[0] + env[1] * (0.5 - 0.5 * Math.cos(TAU * u + Math.PI)));
        return center + kk * gap;
      }),
    );
  }
  return out;
})();

export function SiatoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${MARK_W} ${MARK_H}`}
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id="siato-grad"
          x1="0"
          y1="0"
          x2={MARK_W}
          y2={MARK_H}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A4D65E" />
          <stop offset="0.5" stopColor="#80BA2B" />
          <stop offset="1" stopColor="#4E7717" />
        </linearGradient>
      </defs>
      <g stroke="url(#siato-grad)" strokeLinecap="round" fill="none">
        {RIBBON.map((d, i) => (
          <path key={i} d={d} strokeWidth="1.7" vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}

/* Logo = reine Wortmarke „siato" in Schwarz (Bildmarke bewusst weggelassen).
   Gewicht 900 mit -0.045em Laufweite, seit 10.09.2026. Vorher 700 mit
   tracking-tight. Die schwerere Fassung kam aus dem Marken-Moment und hat sich
   dort als die bessere erwiesen; damit Vorhang und Logo dieselbe Form haben,
   gilt sie jetzt fuer beide. Aendert sich das hier, muss der Vorhang in
   index.html mitgehen - sonst springt die Schrift beim Aufsetzen. */
export function SiatoLogo({
  textClassName = "text-2xl text-slate-900",
}: {
  textClassName?: string;
}) {
  return (
    <span data-logo className={`font-black tracking-[-0.045em] ${textClassName}`}>siato</span>
  );
}
