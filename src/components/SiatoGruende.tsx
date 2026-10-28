import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { Reveal } from "./ui/reveal";

/* ------------------------------------------------------------------
   Quelle: «Kurzbeschrieb der Module und Kundennutzen» von Christoph
   Gantner (allDates), Abschnitt «Wozu Siato». Die neun Gründe sind
   seine, in einfache Sprache gebracht. Die Antwortzeile («Mit Siato»)
   stammt jeweils aus seinen Modulbeschreibungen im selben Dokument.
   Hier nichts dazuerfinden.
------------------------------------------------------------------ */

type Grund = { nr: number; titel: string; ohne: string; mit: string };

const gruende: Grund[] = [
  {
    nr: 1,
    titel: "Papier und Excel halten nicht",
    ohne: "Eine Massnahme auf der Excel-Liste verschwindet in der Schublade. Wer dran ist und ob sie je erledigt wurde, weiss bald niemand mehr.",
    mit: "Bei jeder Massnahme steht, wer sie erledigt und bis wann. Wird sie überfällig, sehen Sie es sofort.",
  },
  {
    nr: 2,
    titel: "Führung kann nicht überall sein",
    ohne: "Sie können nicht jeden Tag durch jede Abteilung gehen. Was überfällig ist, erfahren Sie erst, wenn es brennt.",
    mit: "Am Montagmorgen sehen Sie die Aufgaben Ihres ganzen Teams und was davon überfällig ist.",
  },
  {
    nr: 3,
    titel: "Beim Audit wird es eng",
    ohne: "ISO 9001 und die Vorschriften Ihrer Branche verlangen lückenlose Nachweise. Ohne System wird die Woche vor dem Audit zur Nachtschicht.",
    mit: "Arbeitsanweisungen liegen versioniert und freigegeben in Siato. Fragt der Auditor nach der gültigen Fassung, ist sie schon da.",
  },
  {
    nr: 4,
    titel: "Probleme werden gesehen, aber nicht gelöst",
    ohne: "In der Shopfloor-Runde wird viel erkannt. Aber wenn niemand zuständig ist und keine Frist gilt, verpufft der Aufwand.",
    mit: "Aus jedem Befund wird eine Massnahme mit Zuständigkeit und Frist. Sie bleibt sichtbar, bis sie erledigt ist.",
  },
  {
    nr: 5,
    titel: "Wissen geht mit den Leuten",
    ohne: "Geht der langjährige Schichtleiter in Pension, nimmt er mit, was nirgends aufgeschrieben ist.",
    mit: "Arbeitsanweisungen und erledigte Massnahmen bleiben in Siato. Neue Leute sehen nach, wie ein Problem schon einmal gelöst wurde.",
  },
  {
    nr: 6,
    titel: "Was nicht gemessen wird, wird nicht besser",
    ohne: "Ohne Zahlen können Sie nicht belegen, ob eine Verbesserung etwas gebracht hat, weder intern noch beim Kunden.",
    mit: "Jede umgesetzte Idee ist dokumentiert, samt dem, was sie gebracht hat. So haben Sie die Zahl, bevor jemand danach fragt.",
  },
  {
    nr: 7,
    titel: "Lean funktioniert nur, wenn alle mitmachen",
    ohne: "Wer an der Maschine steht, sieht jeden Tag, was klemmt. Gibt es keinen einfachen Weg, das zu melden, erfährt es niemand.",
    mit: "Ideen lassen sich am PC oder am Tablet einreichen. Jede wird bewertet und verstaubt nicht im Ideenkasten.",
  },
  {
    nr: 8,
    titel: "Was bei 20 Leuten geht, bricht bei 200",
    ohne: "Zurufe und Excel funktionieren im kleinen Betrieb. Über mehrere Abteilungen oder Standorte hält das nicht.",
    mit: "Alle Abteilungen und Standorte arbeiten nach denselben Standards.",
  },
  {
    nr: 9,
    titel: "Digital geht es schneller",
    ohne: "Protokolle abtippen, Excel-Listen zusammenführen: So wird Verbesserung verwaltet, nicht vorangebracht.",
    mit: "Die Massnahme vom Shopfloor-Board landet bei der Person, die sie erledigt. Abgetippt wird nichts.",
  },
];

const SICHTBAR = 3;

function Zeile({ grund }: { grund: Grund }) {
  return (
    <li className="grid grid-cols-[2.75rem_1fr] gap-x-4 md:grid-cols-[3.5rem_1fr] md:gap-x-6">
      {/* Station auf der Schiene — gleiche Form und Farbe wie die Icon-Flächen
          in der Modulsektion. Die weisse Unterlage deckt die Schiene ab,
          damit die Linie nicht durch die Fläche scheint. */}
      <div className="flex justify-center">
        <span className="relative z-10 flex h-9 w-9 shrink-0 rounded-xl bg-white md:h-11 md:w-11">
          <span className="flex h-full w-full items-center justify-center rounded-xl bg-[#80BA2B]/12 text-sm font-bold text-[#4e7717] md:text-base">
            {grund.nr}
          </span>
        </span>
      </div>

      <div className="pb-12 md:pb-14">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
          {grund.titel}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-500 md:text-base">
          {grund.ohne}
        </p>
        <p className="mt-4 flex gap-2.5 text-[15px] leading-relaxed text-slate-800 md:text-base">
          <Check
            aria-hidden="true"
            className="mt-1 h-4 w-4 shrink-0 text-[#80BA2B]"
            strokeWidth={3}
          />
          <span>{grund.mit}</span>
        </p>
      </div>
    </li>
  );
}

export function SiatoGruende() {
  const listeRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [alleZeigen, setAlleZeigen] = useState(false);

  // Die Schiene wächst mit dem Scrollen. Bewusst scaleY (GPU) statt
  // stroke-dashoffset — das wäre Paint-Arbeit in jedem Frame.
  const { scrollY } = useScroll();
  const fortschritt = useSpring(0, {
    damping: 30,
    stiffness: 120,
    mass: 0.6,
  });

  /* Geometrie der Liste, gemessen NUR bei Layout-Änderungen, nie im Scroll.
     Die Rechnung bildet Framers offset ["start 85%", "end 55%"] nach:
     0, wenn die Oberkante auf 85 % Fensterhöhe steht, 1, wenn die Unterkante
     auf 55 % steht. */
  const geo = useRef({ oben: 0, hoehe: 1 });

  const anteil = useCallback(() => {
    const { oben, hoehe } = geo.current;
    const fenster = window.innerHeight;
    const spanne = hoehe + 0.3 * fenster;
    if (spanne <= 0) return 0;
    const gelaufen = scrollY.get() - oben + 0.85 * fenster;
    return Math.min(1, Math.max(0, gelaufen / spanne));
  }, [scrollY]);

  const messen = useCallback(() => {
    const el = listeRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    geo.current = { oben: r.top + window.scrollY, hoehe: r.height };
  }, []);

  // Vom Scrollen kommt der gefederte Anteil — das weiche Nachlaufen bleibt.
  useMotionValueEvent(scrollY, "change", () => fortschritt.set(anteil()));

  /* Beim Aufklappen wächst die Liste von ~675 auf ~1947 px, also fast auf das
     Dreifache. Die Spitze sitzt bei Anteil × Schienenhöhe. Wächst die Höhe,
     während der Anteil noch der alte ist, schiesst die Spitze mit — gemessen
     316 px nach unten — und die Feder holt sie über eine Sekunde zurück. Das
     war der Sprung.
     Also: bei jeder Höhenänderung neu messen, neu rechnen und mit jump()
     setzen. jump() überspringt die Feder, damit hier nichts nachläuft, was
     nur eine Korrektur ist. Anteil × Höhe bleibt so stetig, die Spitze
     gleitet mit der wachsenden Liste statt zu springen. Läuft nur beim Auf-
     und Zuklappen, nicht beim Scrollen. */
  useEffect(() => {
    const el = listeRef.current;
    if (!el) return;
    const nachfuehren = () => {
      messen();
      fortschritt.jump(anteil());
    };
    nachfuehren();
    const beobachter = new ResizeObserver(nachfuehren);
    beobachter.observe(el);
    window.addEventListener("resize", nachfuehren);
    return () => {
      beobachter.disconnect();
      window.removeEventListener("resize", nachfuehren);
    };
  }, [anteil, fortschritt, messen]);

  return (
    <section id="gruende" className="relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-[90rem] px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#4e7717]">
            Woran es hängt
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 [text-shadow:0_1px_14px_rgba(255,255,255,0.8)] md:text-5xl">
            9 Gründe, warum Lean Management ohne Plattform scheitert
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Lean scheitert selten an der Methode, meist an der Umsetzung. Schulung gemacht, Plakate aufgehängt, und ein paar Monate später ist alles wie vorher.
          </p>
        </Reveal>

        <div ref={listeRef} className="relative mx-auto mt-16 max-w-2xl">
          {/* Schiene: graue Grundlinie, darüber der grüne Fortschritt */}
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-[22px] top-2 w-px -translate-x-1/2 bg-slate-200/90 md:left-7"
          >
            <motion.div
              style={
                reduce
                  ? { transformOrigin: "top" }
                  : { scaleY: fortschritt, transformOrigin: "top" }
              }
              className="h-full w-px bg-gradient-to-b from-[#A4D65E] via-[#80BA2B] to-[#4E7717]"
            />
          </div>

          <ul className="relative">
            {gruende.slice(0, SICHTBAR).map((g) => (
              <Reveal key={g.nr} delay={(g.nr - 1) * 0.06}>
                <Zeile grund={g} />
              </Reveal>
            ))}
          </ul>

          {/* Die übrigen sechs — gleiche Aufklapp-Mechanik wie die FAQ */}
          <motion.div
            initial={false}
            animate={{ height: alleZeigen ? "auto" : 0 }}
            transition={{
              height: alleZeigen
                ? { type: "spring", stiffness: 140, damping: 26, mass: 1.05 }
                : { type: "spring", stiffness: 190, damping: 30, mass: 1.1 },
            }}
            className="relative overflow-hidden"
          >
            <motion.ul
              aria-hidden={!alleZeigen}
              inert={!alleZeigen}
              initial={false}
              animate={{ opacity: alleZeigen ? 1 : 0 }}
              transition={{ duration: alleZeigen ? 0.35 : 0.15 }}
            >
              {gruende.slice(SICHTBAR).map((g) => (
                <Zeile key={g.nr} grund={g} />
              ))}
            </motion.ul>
          </motion.div>

          {/* Knopf sitzt auf der Schiene, damit der Faden nicht abreisst */}
          <div className="grid grid-cols-[2.75rem_1fr] gap-x-4 md:grid-cols-[3.5rem_1fr] md:gap-x-6">
            <div className="flex justify-center">
              <span
                aria-hidden="true"
                className="relative z-10 h-3 w-3 rounded-[5px] bg-[#80BA2B]/25 ring-4 ring-white"
              />
            </div>
            <div className="-mt-1">
              <button
                type="button"
                onClick={() => setAlleZeigen((a) => !a)}
                aria-expanded={alleZeigen}
                className="inline-flex items-center gap-2 rounded-full bg-[#80BA2B] px-6 py-2.5 text-[15px] font-bold text-white shadow-lg shadow-[#80BA2B]/25 outline-none transition-colors hover:bg-[#6da524] focus-visible:ring-2 focus-visible:ring-[#80BA2B]/40 focus-visible:ring-offset-2"
              >
                {alleZeigen ? "Weniger zeigen" : "Die weiteren sechs Gründe"}
                <ChevronDown
                  aria-hidden="true"
                  className={`h-4 w-4 transition-transform duration-300 ${alleZeigen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
