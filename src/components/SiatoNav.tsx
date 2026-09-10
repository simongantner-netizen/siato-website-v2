import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { SiatoLogo } from "./SiatoLogo";

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

/** Erst ab dieser Hoehe darf sich die Leiste ueberhaupt wegblenden. */
const AB_HIER_VERSTECKEN = 260;
/** Totzone gegen Flackern bei winzigen Scroll-Zuckungen. */
const TOTZONE = 6;

/**
 * Die Navigation liegt bewusst NICHT im <header>: ein sticky-Element klebt
 * nur innerhalb seines Elternelements, und der Header ist nur den Hero hoch.
 * Als direktes Kind von <main> klebt sie ueber die ganze Seite.
 *
 * Verhalten: beim Runterscrollen gleitet sie weg und gibt Platz, beim
 * Hochscrollen ist sie sofort wieder da — Zurueckkommen ist eine Absicht,
 * Weggehen darf ruhig sein. Nur ein translateY, also reine GPU-Arbeit.
 */
export function SiatoNav() {
  const [open, setOpen] = useState(false);
  const [versteckt, setVersteckt] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const vorher = scrollY.getPrevious() ?? 0;
    if (open || y <= AB_HIER_VERSTECKEN) {
      setVersteckt(false);
      return;
    }
    if (y > vorher + TOTZONE) setVersteckt(true);
    else if (y < vorher - TOTZONE) setVersteckt(false);
  });

  return (
    <motion.nav
      initial={false}
      animate={{ y: versteckt ? "-105%" : "0%" }}
      transition={
        versteckt
          ? { duration: 0.3, ease: [0.4, 0, 1, 1] }
          : { type: "spring", stiffness: 520, damping: 40, mass: 0.7 }
      }
      className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md"
    >
        <motion.div
          variants={navStage}
          initial="hidden"
          animate="visible"
          /* Ab md ein Dreispalter statt justify-between: bei justify-between
             haengt die Mitte an der Differenz von Logo- und CTA-Breite und
             lag dadurch 55 px zu weit links. Der Burger ist ab md display:none
             und belegt deshalb keine Spalte. */
          className="mx-auto flex max-w-[90rem] items-center justify-between px-6 py-4 md:grid md:grid-cols-[1fr_auto_1fr]"
        >
          <motion.div variants={navItem}>
            <SiatoLogo />
          </motion.div>

          {/* Desktop-Menü */}
          <motion.div
            variants={navStage}
            className="hidden items-center gap-7 text-[15px] font-bold text-slate-900 md:flex md:justify-self-center"
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
            className="group hidden items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-[15px] font-bold text-white transition-colors hover:bg-[#80BA2B] md:flex md:justify-self-end"
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
                  className="mt-3 flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-bold text-white"
                >
                  Demo buchen
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </motion.nav>
  );
}
