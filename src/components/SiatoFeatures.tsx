import { Reveal } from "./ui/reveal";
import {
  Check,
  TrendingUp,
  RefreshCcw,
  ClipboardCheck,
  CircleDot,
} from "lucide-react";

/* ---------- Mini-Visuals ---------- */

function PdcaVisual() {
  const steps = [
    { k: "Plan", c: "#80BA2B" },
    { k: "Do", c: "#5e9e1f" },
    { k: "Check", c: "#4e7717" },
    { k: "Act", c: "#3d5e12" },
  ];
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <RefreshCcw className="h-4 w-4 text-[#80BA2B]" /> PDCA-Zyklus · Rüstzeit
        Presse 3
      </div>
      <div className="grid grid-cols-2 gap-3">
        {steps.map((s, i) => (
          <div
            key={s.k}
            className="rounded-xl border border-slate-200 p-3"
            style={{ background: `${s.c}10` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: s.c }}>
                {s.k}
              </span>
              {i < 3 ? (
                <Check className="h-3.5 w-3.5" style={{ color: s.c }} />
              ) : (
                <CircleDot className="h-3.5 w-3.5 text-slate-300" />
              )}
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${[100, 100, 100, 40][i]}%`, background: s.c }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-[#80BA2B]/10 px-4 py-2.5 text-sm">
        <span className="text-slate-600">Rüstzeit vorher → nachher</span>
        <span className="font-bold text-[#4e7717]">42 min → 19 min</span>
      </div>
    </div>
  );
}

function KpiVisual() {
  const bars = [48, 55, 51, 62, 70, 66, 78, 84, 92];
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <TrendingUp className="h-4 w-4 text-[#80BA2B]" /> Shopfloor-Cockpit
        </span>
        <span className="rounded-full bg-[#80BA2B]/10 px-2 py-0.5 text-xs font-medium text-[#4e7717]">
          Live
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          ["OEE", "87%"],
          ["Ausschuss", "1.2%"],
          ["Termintreue", "96%"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-slate-200 p-3">
            <div className="text-[11px] text-slate-400">{l}</div>
            <div className="mt-0.5 text-lg font-bold text-slate-900">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex h-24 items-end gap-1.5">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t ${i === bars.length - 1 ? "bg-[#80BA2B]" : "bg-[#80BA2B]/25"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function QualityVisual() {
  const items = [
    { t: "D1 · Team benannt", done: true },
    { t: "D2 · Problem beschrieben", done: true },
    { t: "D3 · Sofortmassnahme aktiv", done: true },
    { t: "D4 · Ursache identifiziert", done: false },
  ];
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ClipboardCheck className="h-4 w-4 text-[#80BA2B]" /> 8D-Report #482
        </span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          In Bearbeitung
        </span>
      </div>
      <div className="space-y-2.5">
        {items.map((it) => (
          <div key={it.t} className="flex items-center gap-3">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${it.done ? "bg-[#80BA2B]" : "border border-slate-300"}`}
            >
              {it.done && <Check className="h-3 w-3 text-white" />}
            </span>
            <span
              className={`text-sm ${it.done ? "text-slate-500 line-through" : "text-slate-700"}`}
            >
              {it.t}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100">
        <div className="h-1.5 w-3/4 rounded-full bg-[#80BA2B]" />
      </div>
      <div className="mt-2 text-right text-xs text-slate-400">75 % erledigt</div>
    </div>
  );
}

/* ---------- Feature-Daten ---------- */

/* Die Kopfzeile jedes Blocks trägt exakt den Bereichsnamen aus der
   Modulsektion — sonst liest sich der Deep-Dive wie ein anderes Produkt.
   Die Stichpunkte sind die echten Module dieses Bereichs, beschrieben mit
   Christophs eigenen Worten. Kein Block darf zwei Bereiche mischen. */
const features = [
  {
    eyebrow: "Verbesserung & KVP",
    title: "Aus Ideen werden messbare Resultate",
    text: "Jede Verbesserung läuft durch den PDCA-Zyklus – jede Phase dokumentiert, Verantwortlichkeiten zugewiesen, der Fortschritt nachverfolgt. So bleibt KVP kein Schlagwort, sondern wird zur Routine, deren Wirkung Sie schwarz auf weiss sehen.",
    points: [
      "Ideenmanagement – einreichen, bewerten, freigeben",
      "PDCA-Zyklen – jede Phase dokumentiert und nachverfolgt",
      "Waste Walks – Verschwendung direkt am Shopfloor erfassen",
    ],
    visual: <PdcaVisual />,
    reverse: false,
  },
  {
    eyebrow: "Führung & Kommunikation",
    title: "Alle Kennzahlen, ein Blick",
    text: "Vom Shopfloor bis zur Geschäftsleitung sehen alle dieselben Zahlen. Führungskräfte erkennen Trends früh und entscheiden auf Daten statt auf Zuruf.",
    points: [
      "Kennzahlen zentral erfasst, visualisiert und ausgewertet",
      "Shopfloor-Runden direkt am Board – papierlos",
      "Projektstatus mit frühem Signal bei Verzögerung",
    ],
    visual: <KpiVisual />,
    reverse: true,
  },
  {
    eyebrow: "Qualität & Abweichungen",
    title: "Fehler systematisch abstellen",
    text: "Reklamationen von Kunden, Probleme mit Lieferanten und intern entdeckte Fehler laufen über denselben Weg: Sofortmassnahme, Ursachenanalyse, Korrektur – mit lückenloser Historie statt Bauchgefühl.",
    points: [
      "Kundenbeanstandungen mit vollständiger Kommunikationshistorie",
      "Interne Fehler – erkannt, bevor sie den Kunden erreichen",
      "8D-Report von der Ursache bis zur Wirksamkeitsprüfung",
    ],
    visual: <QualityVisual />,
    reverse: false,
  },
];

export function SiatoFeatures() {
  return (
    <section id="features" className="relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-[90rem] space-y-28 px-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
          >
            <Reveal className={f.reverse ? "md:order-2" : ""}>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#4e7717]">
                {f.eyebrow}
              </p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {f.title}
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                {f.text}
              </p>
              <ul className="mt-6 space-y-3">
                {f.points.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#80BA2B]/15">
                      <Check className="h-3 w-3 text-[#4e7717]" />
                    </span>
                    <span className="text-slate-700">{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12} className={f.reverse ? "md:order-1" : ""}>
              {f.visual}
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
