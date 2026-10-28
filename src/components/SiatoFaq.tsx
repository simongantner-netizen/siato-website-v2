import { useCallback, useId, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./ui/reveal";

const PANEL_EASE = [0.16, 1, 0.3, 1] as const;
const OEFFNEN = { type: "spring" as const, stiffness: 150, damping: 26, mass: 1.05 };
const SCHLIESSEN = { type: "spring" as const, stiffness: 190, damping: 30, mass: 1.1 };

type FaqItem = {
  id: string;
  frage: string;
  antwort: string;
};

const faq: FaqItem[] = [
  {
    id: "was-ist-siato",
    frage: "Was ist Siato genau?",
    antwort:
      "Eine Plattform und ein Überblick fürs Lean Management. Ideen, Massnahmen, Reklamationen und Dokumente, die heute in Excel-Listen und auf Papier verstreut sind, liegen damit an einem Ort. Fünf Module decken den Verbesserungsalltag ab, eigene Abläufe kommen als Custom-Modul dazu. Siato ist die Version der allDates-Software, die auf der Microsoft Power Platform läuft, direkt in Ihrem Microsoft 365.",
  },
  {
    id: "microsoft-365",
    frage: "Brauchen wir Microsoft 365?",
    antwort:
      "Ja, Siato ist für Microsoft 365 gebaut: Angemeldet wird mit dem bestehenden Konto, Aufgaben erscheinen in Outlook, Dokumente liegen in SharePoint, Boards gibt es als Tab in Teams. Ohne Microsoft 365 ist der Einsatz nicht vorgesehen.",
  },
  {
    id: "kosten",
    frage: "Was kostet Siato?",
    antwort:
      "Ein Modul kostet ab CHF 190 pro Monat. Dazu braucht jeder Benutzer eine Lizenz «Power Apps per App» von Microsoft, deren Preis von Ihrem Microsoft-Partner (CSP) abhängt. Sie bezahlen nur die Module, die Sie einsetzen. Für mehrere Module machen wir Ihnen ein Angebot. Alle Siato-Preise verstehen sich exkl. MwSt.",
  },
  {
    id: "ein-modul",
    frage: "Können wir mit einem einzelnen Modul starten?",
    antwort:
      "Ja. Fangen Sie dort an, wo es am meisten drückt, zum Beispiel bei den Ideen aus der Halle oder bei den Reklamationen. Weitere Module kommen dazu, sobald das erste im Alltag läuft.",
  },
  {
    id: "mindestnutzer",
    frage: "Gibt es eine Mindestzahl an Benutzern?",
    antwort:
      "Das klären wir mit Ihnen im ersten Gespräch.",
  },
  {
    id: "daten",
    frage: "Wo liegen unsere Daten?",
    antwort:
      "In der Cloud von Microsoft, denn Siato läuft auf der Power Platform. Wo genau Ihre Daten liegen, sagen wir Ihnen vor dem Start verbindlich.",
  },
  {
    id: "einfuehrung",
    frage: "Wie lange dauert die Einführung?",
    antwort:
      "Das hängt vom Modul ab und davon, wie viel angepasst werden soll. Einen Zeitplan bekommen Sie, sobald klar ist, mit welchem Modul Sie beginnen.",
  },
  {
    id: "alldates",
    frage: "Wir arbeiten heute mit allDates. Was heisst das für uns?",
    antwort:
      "Siato ist die Version der allDates-Software, die in Ihrer Microsoft-Umgebung läuft. Ihre heutige allDates-Software können Sie weiterhin einsetzen. Ob ein Wechsel für Sie sinnvoll ist, besprechen wir persönlich.",
  },
  {
    id: "eigene-prozesse",
    frage: "Können wir eigene Prozesse abbilden?",
    antwort:
      "Dafür gibt es das Custom-Modul. Es bildet einen oder mehrere Ihrer Prozesse ab, auf derselben Plattform wie die fünf Module, und wird nach Aufwand abgerechnet. So lassen sich auch Excel-Listen ablösen, die mit Lean nichts zu tun haben.",
  },
  {
    id: "testen",
    frage: "Können wir Siato vorher ausprobieren?",
    antwort:
      "In einer Demo von 30 Minuten zeigen wir Ihnen Siato live. Danach wissen Sie, ob es zu Ihrem Betrieb passt.",
  },
  {
    id: "support",
    frage: "Wer hilft, wenn es klemmt?",
    antwort:
      "Wir, und zwar direkt: am Telefon oder per E-Mail.",
  },
];

/* ---------- Eine Zeile ---------- */

function FaqZeile({
  item,
  offen,
  onToggle,
  panelId,
  triggerId,
}: {
  item: FaqItem;
  offen: boolean;
  onToggle: () => void;
  panelId: string;
  triggerId: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white/85 shadow-sm shadow-slate-900/5 backdrop-blur-sm transition-colors ${
        offen ? "border-[#80BA2B]/50" : "border-slate-200/80"
      }`}
    >
      <button
        type="button"
        id={triggerId}
        aria-controls={panelId}
        aria-expanded={offen}
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#80BA2B]/40 md:px-6 md:py-5"
      >
        <span className="flex items-start gap-2 text-[16px] font-semibold leading-6 tracking-tight text-slate-900 md:text-[17px]">
          <span>{item.frage}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            offen ? "rotate-180 text-[#4e7717]" : ""
          }`}
        />
      </button>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        initial={false}
        animate={{ height: offen ? "auto" : 0 }}
        transition={{ height: offen ? OEFFNEN : SCHLIESSEN }}
        className="overflow-hidden"
      >
        <motion.div
          aria-hidden={!offen}
          inert={!offen}
          initial={false}
          animate={{ opacity: offen ? 1 : 0, y: offen ? 0 : -6 }}
          transition={{
            opacity: {
              duration: offen ? 0.38 : 0.2,
              ease: PANEL_EASE,
              delay: offen ? 0.06 : 0,
            },
            y: offen ? OEFFNEN : SCHLIESSEN,
          }}
          className="px-5 pb-5 text-[15px] leading-relaxed text-slate-600 md:px-6 md:pb-6"
        >
          {item.antwort}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ---------- Sektion ---------- */

export function SiatoFaq() {
  const listId = useId();
  const [offenId, setOffenId] = useState<string | null>(faq[0]?.id ?? null);

  const toggle = useCallback((id: string) => {
    setOffenId((aktuell) => (aktuell === id ? null : id));
  }, []);

  return (
    <section id="faq" className="relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-[90rem] px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#4e7717]">
            Häufige Fragen
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 [text-shadow:0_1px_14px_rgba(255,255,255,0.8)] md:text-5xl">
            Das fragen KMU vor dem Start.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Ihre Frage ist nicht dabei? Rufen Sie Christoph Gantner oder Remo Semm an, das geht schneller als jedes Formular.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mx-auto mt-12 flex w-full max-w-3xl flex-col gap-3">
          {/* Zeilen */}
          <div className="flex flex-col gap-2.5">
            {faq.map((item) => (
              <FaqZeile
                key={item.id}
                item={item}
                offen={offenId === item.id}
                onToggle={() => toggle(item.id)}
                panelId={`${listId}-${item.id}-panel`}
                triggerId={`${listId}-${item.id}-trigger`}
              />
            ))}
          </div>

        </Reveal>
      </div>
    </section>
  );
}
