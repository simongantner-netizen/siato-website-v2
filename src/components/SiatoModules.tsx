import {
  LayoutDashboard,
  Lightbulb,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  GraduationCap,
  Wrench,
} from "lucide-react";
import { Reveal } from "./ui/reveal";

/* ------------------------------------------------------------------
   Quelle: «Kurzbeschrieb der Module und Kundennutzen» von Christoph
   Gantner (allDates). Bereiche, Modulnamen und Inhalte stammen aus
   diesem Dokument — hier nichts dazuerfinden. Bei Änderungen am
   Funktionsumfang zuerst dort nachführen.
------------------------------------------------------------------ */

type Bereich = {
  icon: typeof LayoutDashboard;
  titel: string;
  text: string;
  module: string[];
  /** Sitzt allein in der letzten Reihe: gleich breit wie die anderen, mittig. */
  zentriert?: boolean;
};

const bereiche: Bereich[] = [
  {
    icon: LayoutDashboard,
    titel: "Transparenz & Konsequenz",
    text: "Jeder sieht beim Start, was heute ansteht: offene Aufgaben, Termine, eigene Kennzahlen. Führungskräfte sehen dasselbe für ihr Team und merken früh, wo etwas liegen bleibt.",
    module: [
      "Mein persönliches Cockpit",
      "Alle meine Aufgaben",
      "Aufgaben aus Sicht der Führung",
    ],
  },
  {
    icon: Lightbulb,
    titel: "Verbesserung & KVP",
    text: "Ideen aus der Belegschaft werden erfasst, bewertet und freigegeben. Verbesserungsprojekte laufen nach Plan-Do-Check-Act, Verschwendung wird direkt am Shopfloor aufgenommen.",
    module: ["Ideenmanagement", "PDCA-Zyklen", "Waste Walks"],
  },
  {
    icon: AlertTriangle,
    titel: "Qualität & Abweichungen",
    text: "Reklamationen von Kunden, Probleme mit Lieferanten und intern entdeckte Fehler laufen über denselben Weg: Sofortmassnahme, Ursache, Korrektur – alles nachvollziehbar dokumentiert.",
    module: [
      "Kundenbeanstandungen",
      "Lieferantenbeanstandungen",
      "Interne Fehler",
      "8D-Report",
    ],
  },
  {
    icon: ShieldCheck,
    titel: "Audits & Compliance",
    text: "Arbeitsanweisungen sind versioniert und freigegeben, interne Audits laufen nach Plan, Normen wie ISO 9001 werden systematisch geprüft. Unterweisungen bestätigen Mitarbeitende digital.",
    module: [
      "Gelenkte Dokumente",
      "Interne Audits",
      "Normenprüfung",
      "Unterweisungen",
    ],
  },
  {
    icon: BarChart3,
    titel: "Führung & Kommunikation",
    text: "Projekte, Kennzahlen und die täglichen Shopfloor-Runden an einem Ort. Betriebliches Wissen bleibt im Betrieb, auch wenn jemand geht.",
    module: [
      "Projektadministration",
      "Wissensmanagement",
      "Shopfloor",
      "Kennzahlen",
    ],
  },
  {
    icon: GraduationCap,
    titel: "Mitarbeitenden-Entwicklung",
    text: "Ziele werden gemeinsam vereinbart und nachgehalten, Beurteilungen laufen nach demselben Muster. Die Fähigkeitsmatrix zeigt, wer was kann und wo eine Lücke ist.",
    module: [
      "Persönliche Zielvereinbarung",
      "MA-Beurteilungen",
      "Fähigkeitsmatrix",
      "Aus- und Weiterbildung",
    ],
  },
  {
    icon: Wrench,
    titel: "Betrieb & Instandhaltung",
    text: "Wartungspläne liegen pro Maschine hinterlegt, Aufträge werden automatisch ausgelöst, jede Durchführung ist protokolliert. Das senkt ungeplante Ausfälle und verlängert die Lebensdauer der Anlagen.",
    module: ["Wartung und Instandhaltung"],
    zentriert: true,
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
            23 Module in sieben Bereichen – von der ersten Idee bis zum
            bestandenen Audit. Sie greifen ineinander, statt nebeneinander zu
            stehen.
          </p>
        </Reveal>

        {/* Bereiche */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bereiche.map((b, i) => (
            <Reveal
              key={b.titel}
              delay={(i % 3) * 0.08}
              className={
                b.zentriert
                  ? "sm:col-span-2 sm:w-[calc(50%-0.625rem)] sm:justify-self-center lg:col-span-1 lg:w-auto lg:col-start-2"
                  : undefined
              }
            >
              <div className="group h-full rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#80BA2B]/50 hover:shadow-lg hover:shadow-[#80BA2B]/10">
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

        {/* Systemmodule: Infrastruktur, kein Verkaufsargument – darum als Zeile */}
        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-slate-500">
            Dazu kommen vier Systemmodule, die alles zusammenhalten:
            Organisation, Benutzer und Rollen, Stammdaten und die Workflows, die
            dafür sorgen, dass keine Massnahme vergessen geht.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
