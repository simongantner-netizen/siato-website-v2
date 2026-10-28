import { Reveal } from "./ui/reveal";
import { Check, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

/* ---------- Mini-Visuals ----------
   Nachgebaut nach den Dashboard-Karten der echten iPhone-App (Remo,
   24.10.2026): weisse Karte, Rand #E5E5E5, Titel schwarz, Unterzeile #737373,
   rechts das Total. Die Balken laufen in der gemessenen Gruen-Leiter der App
   vom dunklen zum hellen Ton. Jedes Bild zeigt die echte Ansicht seines
   Bereichs; erfundene Kennzahlen wie die Ruestzeit oder OEE sind raus. */

const LEITER = ["#405D16", "#547B1C", "#6A9A24", "#80BA2B", "#9CC95A", "#B3D680"];

/* label macht die Karte zu einem Bild mit Beschreibung. Ohne label steht sie
   in einem groesseren Bild, das die Beschreibung schon traegt. */
function AppKarte({
  titel,
  unter,
  total,
  label,
  children,
}: {
  titel: string;
  unter: string;
  total?: string;
  label?: string;
  children: ReactNode;
}) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      className="rounded-[20px] border border-[#E5E5E5] bg-white p-5 shadow-lg shadow-slate-900/5 sm:p-6"
    >
      {/* flex-wrap: Bei 320 px passten «Besprechungskalender» und «9 Termine»
          nicht nebeneinander und machten die ganze Spalte 30 px zu breit. */}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div>
          <div className="text-[17px] font-semibold text-[#111]">{titel}</div>
          <div className="mt-0.5 text-[14px] text-[#737373]">{unter}</div>
        </div>
        {total && <span className="shrink-0 text-[14px] text-[#333]">{total}</span>}
      </div>
      {children}
    </div>
  );
}

function Balken({ zeilen, max }: { zeilen: [string, number][]; max: number }) {
  return (
    <div className="mt-4 space-y-3">
      {zeilen.map(([label, wert], i) => (
        <div key={label}>
          <div className="flex justify-between text-[15px] text-[#222]">
            <span>{label}</span>
            <span className="font-semibold tabular-nums">{wert}</span>
          </div>
          <div className="mt-1.5 h-[9px] rounded-full bg-[#F2F2F2]">
            <div
              className="h-full rounded-full"
              style={{ width: `${(wert / max) * 100}%`, background: LEITER[i] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function KvpVisual() {
  const kacheln: [string, string, string, boolean?][] = [
    ["Offene Ideen", "12", "aktiv im Ideenprozess"],
    ["Umsetzung überfällig", "1", "Umsetzungstermin überschritten", true],
    ["Laufende PDCA", "3", "offene PDCA-Zyklen"],
    ["Waste Walks", "4", "durchgeführt in diesem Monat"],
  ];
  return (
    <div
      role="img"
      aria-label="Siato-Dashboard Verbesserung & KVP: offene Ideen, überfällige Umsetzungen, laufende PDCA-Zyklen, Waste Walks und Ideen nach Phase"
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        {kacheln.map(([titel, wert, text, rot]) => (
          <div key={titel} className="rounded-[18px] border border-[#E5E5E5] bg-white px-4 pb-3.5 pt-3 shadow-sm shadow-slate-900/5">
            <div className="flex items-start justify-between gap-1 text-[14px] leading-snug text-[#222] sm:text-[15px]">
              {titel}
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#A0A0A0]" />
            </div>
            <div className={`mt-1 text-[30px] font-semibold leading-tight tabular-nums ${rot ? "text-[#B1241B]" : "text-[#111]"}`}>
              {wert}
            </div>
            <div className="mt-0.5 text-[13px] leading-snug text-[#737373]">{text}</div>
          </div>
        ))}
      </div>
      <AppKarte titel="Offene Ideen nach Phase" unter="Aufnahme bis Review & Abschluss" total="Total 12">
        <Balken zeilen={[["Aufnahme", 2], ["Begutachtung", 6], ["Umsetzung", 4]]} max={6} />
      </AppKarte>
    </div>
  );
}

/* Besprechungskalender wie in der App: Tage mit Sitzung tragen einen Punkt in
   der Farbe ihres Gremiums. Ohne Kalenderwochen-Spalte (Simons Regel). */
function KalenderVisual() {
  const GREMIEN = [
    { name: "Produktionsleitung", farbe: LEITER[0], anzahl: 5 },
    { name: "Qualitätszirkel Fertigung", farbe: LEITER[2], anzahl: 3 },
    { name: "Geschäftsleitung", farbe: LEITER[4], anzahl: 1 },
  ];
  // Erste Zeile beginnt am Montag, 19. Oktober.
  const tage = Array.from({ length: 35 }, (_, i) => {
    const d = 19 + i;
    return d <= 31 ? { zahl: d, monat: d === 19 ? "Okt" : "" } : { zahl: d - 31, monat: d - 31 === 1 ? "Nov" : "" };
  });
  /* Heute ist Montag, 19.10. - derselbe Tag wie im Tablet und im iPhone, und
     der Wochenstart der Produktionsleitung steht in beiden. */
  const punkte: Record<number, number[]> = { 0: [0], 2: [2], 7: [0], 14: [0], 15: [0, 2], 16: [4], 21: [0], 23: [2] };
  const HEUTE = 0;
  return (
    <AppKarte
      titel="Besprechungskalender"
      unter="Oktober bis November"
      total="9 Termine"
      label="Siato-Besprechungskalender: Sitzungen von Produktionsleitung, Qualitätszirkel und Geschäftsleitung über fünf Wochen"
    >
      <div className="mt-4 grid grid-cols-7 text-center tabular-nums">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((t) => (
          <span key={t} className="pb-2 text-[13px] text-[#737373]">{t}</span>
        ))}
        {tage.map((t, i) => {
          const wochenende = i % 7 >= 5;
          return (
            <div key={i} className="flex h-11 flex-col items-center justify-start sm:h-12">
              <span
                className={`flex h-8 min-w-8 items-center justify-center rounded-full text-[16px] ${i === HEUTE ? "bg-[#475F20] px-1 font-semibold text-white" : wochenende ? "text-[#A0A0A0]" : "text-[#222]"}`}
              >
                {t.zahl}
                {t.monat && i !== HEUTE && <sup className="ml-px text-[9px] text-[#737373]">{t.monat}</sup>}
              </span>
              <span className="mt-0.5 flex h-1.5 gap-0.5">
                {(punkte[i] ?? []).map((g) => (
                  <span key={g} className="h-1.5 w-1.5 rounded-full" style={{ background: LEITER[g] }} />
                ))}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 border-t border-[#EEEEEE] pt-3">
        <div className="text-[15px] font-semibold text-[#111]">Heute · Montag, 19. Oktober</div>
        <div className="mt-0.5 text-[14px] text-[#737373]">08:00 Wochenstart Produktion · Sitzungszimmer Halle 1</div>
        <div className="mt-2.5 space-y-1.5">
          {GREMIEN.map((g) => (
            <div key={g.name} className="flex items-center gap-2 text-[14px] text-[#222]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: g.farbe }} />
              {g.name} · {g.anzahl}
            </div>
          ))}
        </div>
      </div>
    </AppKarte>
  );
}

/* Im Original stehen hier Kundenfirmen mit Namen. Auf einer oeffentlichen
   Seite koennten solche Namen echte Firmen treffen, deshalb nach Art der
   Beanstandung - genau die drei Wege, die der Text daneben beschreibt. */
function QualitaetVisual() {
  return (
    <AppKarte
      titel="Offene Beanstandungen je Art"
      unter="Kunden, Lieferanten und interne Abweichungen"
      total="Total 14"
      label="Siato-Auswertung: offene Beanstandungen von Kunden, Lieferanten und intern, nach Sofortmassnahme, Ursachenanalyse und Korrektur"
    >
      <Balken
        zeilen={[
          ["Kundenbeanstandungen", 6],
          ["Lieferantenbeanstandungen", 3],
          ["Interne Abweichungen", 5],
        ]}
        max={6}
      />
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[#EEEEEE] pt-4 text-center">
        {/* Die drei Schritte, die der Text daneben nennt: Sofortmassnahme,
            Ursachenanalyse, Korrektur - zusammen die 14 offenen. Weiche
            Trennstriche (\u00AD), weil die langen Woerter auf 375 px
            aneinanderstiessen. */}
        {[
          ["Sofort\u00ADmassnahme", "4"],
          ["Ursachen\u00ADanalyse", "6"],
          ["Korrektur", "4"],
        ].map(([l, v]) => (
          <div key={l} className="min-w-0">
            <div className="text-[24px] font-semibold tabular-nums text-[#111]">{v}</div>
            <div className="text-[12px] leading-tight text-[#737373] sm:text-[13px]">{l}</div>
          </div>
        ))}
      </div>
    </AppKarte>
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
    text: "Jedes Verbesserungsprojekt läuft nach PDCA: planen, umsetzen, prüfen, verankern. In jeder Phase steht, wer dran ist und wie weit es ist. Was es gebracht hat, sehen Sie am Ende schwarz auf weiss.",
    points: [
      "Ideenmanagement: vom Einfall bis zur Freigabe",
      "PDCA-Zyklen: jede Phase dokumentiert und nachverfolgt",
      "Waste Walks: Verschwendung beim Rundgang am Tablet erfassen",
    ],
    visual: <KvpVisual />,
    reverse: false,
  },
  {
    eyebrow: "Kommunikation & Abstimmung",
    title: "Alle Sitzungen, ein Kalender",
    text: "Von der Shopfloor-Runde bis zur Geschäftsleitung sieht jedes Gremium im selben Kalender, wann es tagt.",
    points: [
      "Besprechungen: jedes Gremium mit seinen Terminen",
      "Shopfloor: die tägliche Runde direkt am Board, ohne Papier",
      "Zirkularbeschlüsse: entscheiden, ohne eine Sitzung einzuberufen",
    ],
    visual: <KalenderVisual />,
    reverse: true,
  },
  {
    eyebrow: "Qualität & Abweichungen",
    title: "Fehler an der Wurzel packen",
    text: "Ob Reklamation oder eigener Fehler: Jeder Fall durchläuft Sofortmassnahme, Ursachenanalyse und Korrektur. Fragt der Kunde ein Jahr später nach, steht die ganze Geschichte da.",
    points: [
      "Kundenbeanstandungen mit vollständiger Kommunikationshistorie",
      "Interne Abweichungen: erkannt, bevor sie beim Kunden ankommen",
      "8D-Report: in acht Schritten vom Problem bis zur Wirksamkeitsprüfung",
    ],
    visual: <QualitaetVisual />,
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
