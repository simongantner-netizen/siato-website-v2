import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Reveal } from "./ui/reveal";

/* ------------------------------------------------------------------
   ACHTUNG: Die drei Zitate unten sind ERFUNDEN – Platzhalter, damit
   das Design steht. Sie dürfen so nie live gehen.
   Solange dieses Flag auf true steht, zeigt die Sektion einen
   sichtbaren Platzhalter-Hinweis. Echte Zitate einsetzen, dann auf
   false stellen.
------------------------------------------------------------------ */
const ZITATE_SIND_PLATZHALTER = true;

type Stimme = {
  zitat: string;
  name: string;
  rolle: string;
  firma: string;
};

const stimmen: Stimme[] = [
  {
    zitat:
      "Vorher lagen unsere Massnahmen in vier Excel-Listen, und niemand wusste, welche die aktuelle ist. Heute steht alles an einem Ort, und ich sehe am Montagmorgen in zwei Minuten, wo wir stehen.",
    name: "Andrea Furrer",
    rolle: "Leiterin Qualitätsmanagement",
    firma: "Maurer Lackierwerk",
  },
  {
    zitat:
      "Das Beste ist, dass niemand ein neues Programm lernen musste. Siato ist einfach in Teams drin. Die Leute in der Halle erfassen ihre Ideen aufs Handy, und die Idee ist wirklich dort gelandet.",
    name: "Marco Schibli",
    rolle: "Betriebsleiter",
    firma: "Peterhans Schibli",
  },
  {
    zitat:
      "Beim letzten Audit haben wir keine einzige Nacht durchgearbeitet. Alles, was der Auditor sehen wollte, war da – nachvollziehbar, mit Datum und Verantwortlichkeit.",
    name: "Nicole Bergmann",
    rolle: "Leiterin Betriebsentwicklung",
    firma: "Monopol Colors",
  },
];

/* Versatz pro Zitat: bricht die Mittelachse auf, ohne unruhig zu werden. */
const versatz = ["md:ml-0", "md:ml-auto md:mr-[4%]", "md:ml-[10%]"];

function Zitat({ stimme, index }: { stimme: Stimme; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduziert = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Leichte Tiefe: jedes Zitat driftet unterschiedlich stark mit.
  const drift = [34, -26, 20][index] ?? 0;
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  return (
    <div ref={ref} className={`max-w-2xl ${versatz[index] ?? ""}`}>
      <motion.div style={reduziert ? undefined : { y }}>
        <Reveal delay={index * 0.06}>
          <figure className="relative flex flex-col gap-6 pl-5 md:pl-8">
            <blockquote className="relative text-xl font-medium leading-snug tracking-tight text-slate-800 md:text-[1.75rem] md:leading-[1.4]">
              <span
                aria-hidden="true"
                className="absolute -left-5 top-[-0.28em] select-none text-[2em] leading-none text-[#80BA2B]/70 md:-left-8"
              >
                „
              </span>
              <p className="inline text-pretty">{stimme.zitat}</p>
              <span
                aria-hidden="true"
                className="absolute translate-x-1 translate-y-[-0.28em] select-none text-[2em] leading-none text-[#80BA2B]/70"
              >
                “
              </span>
            </blockquote>

            <figcaption className="ml-auto flex w-full items-center gap-3 md:w-2/3">
              <div className="hidden h-px grow translate-y-px bg-slate-300/70 md:block" />
              <div className="flex flex-col md:ml-auto md:text-right">
                <span className="text-sm font-semibold tracking-tight text-slate-900">
                  {stimme.name}
                </span>
                <span className="text-sm text-slate-500">
                  {stimme.rolle}, {stimme.firma}
                </span>
              </div>
            </figcaption>
          </figure>
        </Reveal>
      </motion.div>
    </div>
  );
}

export function SiatoVoices() {
  return (
    <section id="stimmen" className="relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-[90rem] px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#4e7717]">
            Kundenstimmen
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 [text-shadow:0_1px_14px_rgba(255,255,255,0.8)] md:text-5xl">
            Gesagt von Leuten, die damit arbeiten.
          </h2>
          {ZITATE_SIND_PLATZHALTER && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50/90 px-4 py-1.5 text-xs font-semibold text-amber-800">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Platzhalter – Zitate und Namen sind erfunden
            </p>
          )}
        </Reveal>

        <div className="mt-16 space-y-20 md:mt-20 md:space-y-24">
          {stimmen.map((s, i) => (
            <Zitat key={s.name} stimme={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
