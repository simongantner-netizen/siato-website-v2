import { motion, type Variants } from "framer-motion";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { HeroPill } from "./HeroPill";
import { SiatoDashboard } from "./SiatoDashboard";

// Hero-Inhalt: gestaffelter Auftritt statt „brav auftauchen".
const stage: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.35 } },
};
const maskReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", y: "12%", opacity: 0 },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function SiatoHeader() {
  return (
    <header className="relative">

      {/* Hero mit Scroll-Tablet */}
      <div className="relative flex flex-col">
        <ContainerScroll
          titleComponent={
            <motion.div variants={stage} initial="hidden" animate="visible">
              <motion.h1
                variants={maskReveal}
                className="mx-auto max-w-5xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl md:leading-[1.08]"
              >
                Eine Plattform, die Ihr KMU{" "}
                <span className="bg-gradient-to-r from-[#80BA2B] to-[#4e7717] bg-clip-text text-transparent">
                  besser und schneller
                </span>{" "}
                macht.
              </motion.h1>

              <motion.div variants={fadeUp}>
                <HeroPill />
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg"
              >
                Ideen, Massnahmen, Kennzahlen und Audits liegen heute
                verstreut in Excel,{" "}
                <span className="whitespace-nowrap">E-Mail</span>, SharePoint
                und auf Papier. Siato
                führt Ihr Lean Management in einem System zusammen, direkt in
                Microsoft 365. Aus guten Absichten werden verbindliche Prozesse.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 mb-14 flex flex-wrap items-center justify-center gap-3"
              >
                <a
                  href="#kontakt"
                  className="rounded-full bg-[#80BA2B] px-7 py-3 text-[15px] font-semibold text-white shadow-lg shadow-[#80BA2B]/25 transition-colors hover:bg-[#6da524]"
                >
                  Demo buchen
                </a>
                <a
                  href="#module"
                  className="rounded-full border border-slate-300 bg-white px-7 py-3 text-[15px] font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
                >
                  Module entdecken
                </a>
              </motion.div>

            </motion.div>
          }
        >
          <SiatoDashboard />
        </ContainerScroll>
      </div>
    </header>
  );
}
