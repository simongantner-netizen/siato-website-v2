import {
  LayoutDashboard,
  Lightbulb,
  AlertTriangle,
  ShieldCheck,
  Presentation,
  Puzzle,
} from "lucide-react";
import { Reveal } from "./ui/reveal";

/* ------------------------------------------------------------------
   Quelle: «Kurzbeschrieb der Module und Kundennutzen» von Christoph
   Gantner (allDates). Bereiche, Modulnamen und Inhalte stammen aus
   diesem Dokument — hier nichts dazuerfinden. Bei Änderungen am
   Funktionsumfang zuerst dort nachführen.

   Stand heute nach Remo Semm (Mail 18.09.2026): fuenf Module plus die
   Moeglichkeit eines eigenen Custom-Moduls und ein Systemmodul fuer die
   Verbindung zu M365. «Mitarbeitenden-Entwicklung» und «Betrieb &
   Instandhaltung» gibt es heute nicht und sind deshalb raus; «Führung &
   Kommunikation» heisst «Kommunikation & Abstimmung», die Chips dort sind die
   Eintraege aus Remos Navigation und iPhone-Dashboard.
------------------------------------------------------------------ */

type Bereich = {
  icon: typeof LayoutDashboard;
  titel: string;
  text: string;
  module: string[];
  /** Das Custom-Modul: kein fertiges Modul, sondern der Platz fuer eigene Prozesse. */
  eigen?: boolean;
};

const bereiche: Bereich[] = [
  {
    icon: LayoutDashboard,
    titel: "Transparenz & Konsequenz",
    text: "Nach dem Anmelden erscheinen zuerst die eigenen Aufgaben und Termine. Führungskräfte sehen dasselbe für ihr Team und merken früh, wo etwas liegen bleibt.",
    module: [
      "Mein persönliches Cockpit",
      "Alle meine Aufgaben",
      "Aufgaben aus Sicht der Führung",
    ],
  },
  {
    icon: Lightbulb,
    titel: "Verbesserung & KVP",
    text: "Ideen aus der Belegschaft werden bewertet und freigegeben. Verbesserungsprojekte laufen im PDCA-Zyklus, und Verschwendung halten Sie beim Rundgang am Tablet fest.",
    module: ["Ideenmanagement", "PDCA-Zyklen", "Waste Walks"],
  },
  {
    icon: AlertTriangle,
    titel: "Qualität & Abweichungen",
    text: "Reklamationen von Kunden, Probleme mit Lieferanten und Fehler aus der eigenen Produktion laufen über denselben Weg. Jeder Schritt ist dokumentiert, bis die Ursache beseitigt ist.",
    module: [
      "Kundenbeanstandungen",
      "Lieferantenbeanstandungen",
      "Interne Abweichungen",
      "8D-Report",
    ],
  },
  {
    icon: ShieldCheck,
    titel: "Audits & Compliance",
    text: "Wer eine Arbeitsanweisung öffnet, hat die gültige vor sich, nicht die vom letzten Jahr. Die Prozesslandkarte zeigt, wie Ihre Abläufe zusammenhängen.",
    module: [
      "Gelenkte Dokumente",
      "Prozesslandkarte",
    ],
  },
  {
    icon: Presentation,
    titel: "Kommunikation & Abstimmung",
    text: "Die tägliche Shopfloor-Runde läuft direkt am Board, die Sitzungen aller Gremien stehen im Kalender. Was nicht warten kann, entscheiden Sie per Zirkularbeschluss.",
    module: ["Besprechungen", "Shopfloor", "Zirkularbeschlüsse"],
  },
  {
    icon: Puzzle,
    titel: "Custom-Modul",
    text: "Passt ein Ablauf in keines der fünf Module, bekommt er sein eigenes. Ein Custom-Modul bildet einen oder mehrere beliebige Prozesse aus Ihrem Betrieb ab, auf derselben Plattform.",
    module: ["Eigene Prozesse", "Excel-Listen ablösen"],
    eigen: true,
  },
];

export function SiatoModules() {
  return (
    <section id="module" className="relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-[90rem] px-6">
        {/* Sektionskopf */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#4e7717]">
            Module
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 [text-shadow:0_1px_14px_rgba(255,255,255,0.8)] md:text-5xl">
            Alles drin, was Lean braucht.
          </h2>
          <p className="mt-4 text-base text-slate-600 md:text-lg">
            Fünf Module, von der ersten Idee bis zum bestandenen Audit. Jedes hilft für sich, zusammen geben sie den Überblick.
          </p>
        </Reveal>

        {/* Bereiche */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bereiche.map((b, i) => (
            <Reveal key={b.titel} delay={(i % 3) * 0.08}>
              {/* Das Custom-Modul traegt einen gestrichelten Rand: der Platz,
                  der erst mit dem eigenen Prozess gefuellt wird. */}
              <div
                className={`group h-full rounded-2xl border bg-white/90 p-6 shadow-sm shadow-slate-900/5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#80BA2B]/50 hover:shadow-lg hover:shadow-[#80BA2B]/10 ${b.eigen ? "border-dashed border-[#80BA2B]/60" : "border-slate-200/80"}`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#80BA2B]/12 text-[#4e7717] transition-colors group-hover:bg-[#80BA2B] group-hover:text-white">
                  <b.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>

                <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
                  {b.titel}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">
                  {b.text}
                </p>

                <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-1.5 border-t border-slate-200/70 pt-4">
                  {b.module.map((m) => (
                    <li
                      key={m}
                      className="rounded-full bg-slate-100/80 px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Systemmodul: Infrastruktur, kein Verkaufsargument – darum als Zeile.
            Der Satz ist Remos Wortlaut (18.09.2026). */}
        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-slate-500">
            Dazu kommt ein Systemmodul, welches Siato mit M365 verbindet.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
