import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Reveal } from "./ui/reveal";

type Stimme = {
  zitat: string;
  rolle: string;
  branche: string;
};

const stimmen: Stimme[] = [
  {
    zitat:
      "Vorher lagen unsere Massnahmen in vier Excel-Listen, und niemand wusste, welche die aktuelle ist. Heute steht alles an einem Ort, und ich sehe am Montagmorgen in zwei Minuten, wo wir stehen.",
    rolle: "Leiterin Qualitätsmanagement",
    branche: "Lackierbetrieb",
  },
  {
    zitat:
      "Das Beste ist, dass niemand ein neues Programm lernen musste. Siato ist einfach in Teams drin. Die Leute in der Halle erfassen ihre Ideen aufs Handy, und die Idee ist wirklich dort gelandet.",
    rolle: "Betriebsleiter",
    branche: "Produktionsbetrieb",
  },
  {
    zitat:
      "Beim letzten Audit haben wir keine einzige Nacht durchgearbeitet. Alles, was der Auditor sehen wollte, war da – nachvollziehbar, mit Datum und Verantwortlichkeit.",
    rolle: "Leiterin Betriebsentwicklung",
    branche: "Industriebetrieb",
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
            {/* Guillemets laufen im Textfluss mit: das öffnende hängt per
                negativem Erstzeilen-Einzug in den Rand, das schliessende klebt
                am letzten Wort. Kein absolutes Positionieren — sonst löst sich
                das Zeichen von der Zeile und ragt aus dem Block.
                Der Einzug ist die gemessene Laufweite von « bei 1.15em:
                18.89 px auf 28 px Schrift = 0.675em. Bei einem anderen Zeichen
                oder einer anderen Zeichengrösse neu messen. */}
            <blockquote className="text-pretty text-xl font-medium leading-snug tracking-tight text-slate-800 [text-indent:-0.675em] md:text-[1.75rem] md:leading-[1.4]">
              <span className="text-[1.15em] leading-[0] text-[#80BA2B]">«</span>
              {stimme.zitat}
              <span className="text-[1.15em] leading-[0] text-[#80BA2B]">»</span>
            </blockquote>

            {/* Linksbündig zur Textkante des Zitats. Rechtsbündig war zwar
                exakt auf der Blockkante, aber der Flattersatz erreicht sie nie —
                das Auge misst an der Schrift, nicht an der unsichtbaren Kante. */}
            <figcaption className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                {stimme.rolle}
              </span>
              <span className="text-sm text-slate-500">{stimme.branche}</span>
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

        <div className="space-y-20 md:space-y-24">
          {stimmen.map((s, i) => (
            <Zitat key={s.rolle} stimme={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
