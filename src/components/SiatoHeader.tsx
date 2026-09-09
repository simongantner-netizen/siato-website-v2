import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { HeroPill } from "./HeroPill";
import { SiatoDashboard } from "./SiatoDashboard";
import { SiatoLogo } from "./SiatoLogo";
import { ArrowRight, Menu, X } from "lucide-react";

/* Die Navigation bildet die Seite ab, in Lesereihenfolge. „Kontakt" fehlt
   bewusst — dorthin führt der CTA. */
const NAV_LINKS = [
  { href: "#gruende", label: "9 Gründe" },
  { href: "#warum", label: "Warum Siato" },
  { href: "#module", label: "Module" },
  { href: "#preise", label: "Preise" },
  { href: "#faq", label: "FAQ" },
];

// Header beim Laden: Logo, Menüpunkte und CTA gestaffelt einblenden.
const navStage: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const navItem: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

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
  const [open, setOpen] = useState(false);

  return (
    <header className="relative">
      {/* Navigation – sticky, animiert beim Laden ein */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <motion.div
          variants={navStage}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-[90rem] items-center justify-between px-6 py-4"
        >
          <motion.div variants={navItem}>
            <SiatoLogo />
          </motion.div>

          {/* Desktop-Menü */}
          <motion.div
            variants={navStage}
            className="hidden items-center gap-7 text-[15px] text-slate-600 md:flex"
          >
            {NAV_LINKS.map((l) => (
              <motion.a
                key={l.href}
                variants={navItem}
                href={l.href}
                className="transition-colors hover:text-slate-900"
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>

          {/* Desktop-CTA */}
          <motion.a
            variants={navItem}
            href="#kontakt"
            className="group hidden items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#80BA2B] md:flex"
          >
            Demo buchen
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          {/* Mobile-Hamburger */}
          <motion.button
            variants={navItem}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Menü schliessen" : "Menü öffnen"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </motion.div>

        {/* Mobile-Panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-md md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4 text-[16px] text-slate-700">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="py-2.5 transition-colors hover:text-slate-900"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="#kontakt"
                  onClick={() => setOpen(false)}
                  className="mt-3 flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white"
                >
                  Demo buchen
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero mit Scroll-Tablet */}
      <div className="relative flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <motion.div variants={stage} initial="hidden" animate="visible">
              <motion.h1
                variants={maskReveal}
                className="mx-auto max-w-5xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl md:leading-[1.08]"
              >
                Eine Software, die Ihr KMU{" "}
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
                verstreut in Excel, E-Mail, SharePoint und auf Papier. Siato
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
