import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react";
import { Reveal } from "./ui/reveal";

/* ------------------------------------------------------------------
   Antworten mit `entwurf: true` sind noch nicht von allDates bestätigt.
   Solange dieses Flag steht, tragen sie in der Seite einen sichtbaren
   Punkt. Nach der Freigabe: `entwurf` entfernen.
------------------------------------------------------------------ */
const ENTWUERFE_MARKIEREN = true;

const PANEL_EASE = [0.16, 1, 0.3, 1] as const;
const OEFFNEN = { type: "spring" as const, stiffness: 150, damping: 26, mass: 1.05 };
const SCHLIESSEN = { type: "spring" as const, stiffness: 190, damping: 30, mass: 1.1 };

type FaqItem = {
  id: string;
  frage: string;
  antwort: string;
  /** Antwort ist ein Entwurf und muss noch bestätigt werden. */
  entwurf?: boolean;
};

const faq: FaqItem[] = [
  {
    id: "was-ist-siato",
    frage: "Was ist Siato genau?",
    antwort:
      "Eine Software fürs Lean Management: Ideen, Massnahmen, Kennzahlen, Audits und Qualitätsthemen an einem Ort statt in zehn Excel-Listen. Rund 20 Module decken den ganzen Verbesserungsalltag ab. Siato ist der Nachfolger der allDates-Software und läuft auf der Microsoft Power Platform – direkt in Ihrem Microsoft 365.",
  },
  {
    id: "microsoft-365",
    frage: "Brauchen wir Microsoft 365?",
    antwort:
      "Siato ist für den Betrieb in Microsoft 365 gebaut: Anmeldung mit dem bestehenden Konto, Aufgaben in Outlook, Dokumente in SharePoint, Boards als Tab in Teams. Ohne M365-Umgebung ist der Einsatz nicht vorgesehen.",
    entwurf: true,
  },
  {
    id: "kosten",
    frage: "Was kostet Siato?",
    antwort:
      "Ein Modul ab CHF 190.– pro Monat, dazu CHF 5.– pro Nutzer und Monat für den Betrieb auf der Power Platform. Sie zahlen nur die Module, die Sie einsetzen; mehrere Module zusammen gibt es zum vergünstigten Paketpreis. Alle Preise exkl. MwSt.",
  },
  {
    id: "ein-modul",
    frage: "Können wir mit einem einzelnen Modul starten?",
    antwort:
      "Ja, und das ist der übliche Weg. Die meisten beginnen dort, wo es am meisten drückt – oft beim Ideenmanagement oder bei den Abweichungen – und nehmen weitere Module dazu, sobald das erste im Alltag angekommen ist.",
  },
  {
    id: "mindestnutzer",
    frage: "Gibt es eine Mindestzahl an Nutzern?",
    antwort:
      "Nein. Sie lösen so viele Nutzer wie nötig, monatlich abgerechnet, und ändern die Zahl jederzeit.",
    entwurf: true,
  },
  {
    id: "daten",
    frage: "Wo liegen unsere Daten?",
    antwort:
      "In der Schweiz. Siato wird hier entwickelt und in einem Schweizer Rechenzentrum betrieben. Die Datenhaltung erfüllt das revidierte Schweizer Datenschutzgesetz und die DSGVO; Rollen und Berechtigungen steuern Sie selbst.",
    entwurf: true,
  },
  {
    id: "einfuehrung",
    frage: "Wie lange dauert die Einführung?",
    antwort:
      "Ein erstes Modul ist in wenigen Wochen im Einsatz: gemeinsamer Aufsetztermin, Anpassung an Ihre Begriffe und Abläufe, Schulung der Schlüsselpersonen, danach der Start im Alltag. Wir begleiten Sie dabei.",
    entwurf: true,
  },
  {
    id: "alldates",
    frage: "Wir arbeiten heute mit allDates. Was heisst das für uns?",
    antwort:
      "Siato ist der Nachfolger, und niemand wird zu einem Stichtag umgestellt. Wir schauen Ihre bestehende Installation an und planen den Wechsel so, dass Ihre Daten und Ihre gewohnten Abläufe mitkommen.",
    entwurf: true,
  },
  {
    id: "eigene-prozesse",
    frage: "Können wir eigene Prozesse abbilden?",
    antwort:
      "Ja. Siato läuft auf der Microsoft Power Platform, also entstehen eigene Abläufe in derselben Datenbank – ohne zusätzliche Lizenzkosten und ohne Drittanbieter. So lassen sich auch Excel-Lösungen ablösen, die mit Lean nichts zu tun haben.",
  },
  {
    id: "testen",
    frage: "Können wir Siato vorher ausprobieren?",
    antwort:
      "Wir zeigen Siato in einer halben Stunde live an Ihren eigenen Beispielen. Wenn es passt, richten wir Ihnen eine Testumgebung mit Ihren Daten ein, bevor Sie sich entscheiden.",
    entwurf: true,
  },
  {
    id: "support",
    frage: "Wer hilft, wenn es klemmt?",
    antwort:
      "Sie erreichen uns direkt, auf Deutsch, ohne Ticket-Nummern-Karussell. Updates kommen im Halbjahres-Rhythmus und werden angekündigt, nicht übers Wochenende eingespielt.",
    entwurf: true,
  },
];

/* ---------- Suche ---------- */

function maskieren(wert: string) {
  return wert.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hervorheben(text: string, suche: string): ReactNode {
  const q = suche.trim();
  if (!q) return text;

  return text
    .split(new RegExp(`(${maskieren(q)})`, "gi"))
    .map((teil, i) =>
      teil.toLowerCase() === q.toLowerCase() ? (
        <mark
          key={i}
          className="rounded-sm bg-[#80BA2B]/25 px-0.5 text-slate-900"
        >
          {teil}
        </mark>
      ) : (
        <Fragment key={i}>{teil}</Fragment>
      ),
    );
}

function passt(item: FaqItem, suche: string) {
  const q = suche.trim().toLowerCase();
  if (!q) return true;
  return (
    item.frage.toLowerCase().includes(q) ||
    item.antwort.toLowerCase().includes(q)
  );
}

/* ---------- Eine Zeile ---------- */

function FaqZeile({
  item,
  offen,
  onToggle,
  suche,
  panelId,
  triggerId,
}: {
  item: FaqItem;
  offen: boolean;
  onToggle: () => void;
  suche: string;
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
          {ENTWUERFE_MARKIEREN && item.entwurf && (
            <span
              title="Antwort noch nicht bestätigt"
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
            />
          )}
          <span>{hervorheben(item.frage, suche)}</span>
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
          {hervorheben(item.antwort, suche)}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ---------- Sektion ---------- */

export function SiatoFaq() {
  const listId = useId();
  const warSuchend = useRef(false);
  const [suche, setSuche] = useState("");
  const [offenId, setOffenId] = useState<string | null>(faq[0]?.id ?? null);

  const suchend = suche.trim().length > 0;
  const sichtbar = useMemo(() => faq.filter((i) => passt(i, suche)), [suche]);

  useEffect(() => {
    if (suchend) {
      warSuchend.current = true;
      setOffenId((aktuell) =>
        aktuell && sichtbar.some((i) => i.id === aktuell)
          ? aktuell
          : (sichtbar[0]?.id ?? null),
      );
      return;
    }
    if (warSuchend.current) {
      warSuchend.current = false;
      setOffenId(faq[0]?.id ?? null);
    }
  }, [suchend, sichtbar]);

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
            Ihre Frage ist nicht dabei? Rufen Sie an – das geht schneller als
            jedes Formular.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mx-auto mt-12 flex w-full max-w-3xl flex-col gap-3">
          {/* Suche */}
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              placeholder="Frage suchen …"
              aria-label="Häufige Fragen durchsuchen"
              className="h-12 w-full appearance-none rounded-full border border-slate-300 bg-white/85 pl-12 pr-11 text-[15px] text-slate-800 outline-none backdrop-blur-sm transition-colors placeholder:text-slate-400 focus:border-[#80BA2B] focus:ring-2 focus:ring-[#80BA2B]/20 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {suche && (
              <button
                type="button"
                aria-label="Suche löschen"
                onClick={() => setSuche("")}
                className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Zeilen */}
          <div className="flex flex-col gap-2.5">
            <AnimatePresence initial={false} mode="popLayout">
              {sichtbar.length > 0 ? (
                sichtbar.map((item) => (
                  <motion.div
                    key={item.id}
                    layout="position"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: PANEL_EASE }}
                  >
                    <FaqZeile
                      item={item}
                      offen={offenId === item.id}
                      onToggle={() => toggle(item.id)}
                      suche={suche}
                      panelId={`${listId}-${item.id}-panel`}
                      triggerId={`${listId}-${item.id}-trigger`}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.p
                  key="leer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-2 py-10 text-center text-[15px] text-slate-500"
                >
                  Dazu haben wir noch keine Antwort hinterlegt. Fragen Sie uns
                  direkt – wir antworten innerhalb eines Arbeitstages.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {ENTWUERFE_MARKIEREN && faq.some((i) => i.entwurf) && (
            <p className="mt-2 flex items-center justify-center gap-2 text-xs font-medium text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Punkt = Antwort ist ein Entwurf und noch nicht bestätigt
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
