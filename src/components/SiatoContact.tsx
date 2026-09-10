import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  anfassen,
  flaecheDruck,
  flaecheHover,
  linkDruck,
  linkHover,
} from "../bewegung";
import { Reveal } from "./ui/reveal";
import { SiatoLogo } from "./SiatoLogo";
import { Mail, Phone, Check, ArrowRight } from "lucide-react";

function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex h-full min-h-[20rem] flex-col items-center justify-center rounded-3xl border border-[#80BA2B]/40 bg-[#80BA2B]/8 p-8 text-center backdrop-blur-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#80BA2B]">
          <Check className="h-7 w-7 text-white" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-slate-900">
          Danke für Ihre Anfrage!
        </h3>
        <p className="mt-2 max-w-sm text-slate-600">
          Wir melden uns innerhalb eines Arbeitstages bei Ihnen, um einen Termin
          für Ihre persönliche Demo zu vereinbaren.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-lg shadow-slate-900/5 backdrop-blur-md"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" placeholder="Vor- und Nachname" required />
        <Field label="Firma" name="company" placeholder="Ihr Unternehmen" required />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="E-Mail"
          name="email"
          type="email"
          placeholder="name@firma.ch"
          required
        />
        <Field label="Telefon" name="phone" placeholder="+41 …" />
      </div>
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Worum geht es?
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="Welche Module oder Themen interessieren Sie?"
          className="w-full resize-none rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-[#80BA2B] focus:ring-2 focus:ring-[#80BA2B]/20"
        />
      </div>
      <button
        type="submit"
        className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#80BA2B] px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-[#80BA2B]/25 transition-colors hover:bg-[#6da524]"
      >
        Demo anfragen
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
      <p className="mt-3 text-center text-xs text-slate-400">
        Unverbindlich · Antwort innerhalb eines Arbeitstages
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-[#80BA2B] focus:ring-2 focus:ring-[#80BA2B]/20"
      />
    </div>
  );
}

export function SiatoContact() {
  return (
    <section id="kontakt" className="relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-[90rem] px-6">
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#4e7717]">
              Demo buchen
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Sehen Sie sich Siato in 30 Minuten an
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Wir zeigen Ihnen live, wie Siato Ihre Lean-Prozesse abbildet – an
              Ihren eigenen Beispielen, ohne Verpflichtung.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#80BA2B]/15 text-base font-bold text-[#4e7717]">
                  CG
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    Christoph Gantner
                  </div>
                  <div className="text-sm text-slate-500">Inhaber · allDates</div>
                </div>
              </div>
              <div className="mt-5 space-y-2.5 text-sm">
                <a
                  href="mailto:christoph.gantner@alldates.ch"
                  className="flex items-center gap-3 text-slate-600 transition-colors hover:text-[#4e7717]"
                >
                  <Mail className="h-4 w-4 text-[#80BA2B]" />
                  christoph.gantner@alldates.ch
                </a>
                <a
                  href="tel:+41792178271"
                  className="flex items-center gap-3 text-slate-600 transition-colors hover:text-[#4e7717]"
                >
                  <Phone className="h-4 w-4 text-[#80BA2B]" />
                  +41 79 217 82 71
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function SiatoFooter() {
  const reduce = useReducedMotion() ?? false;
  return (
    <footer className="relative border-t border-slate-200/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto max-w-[90rem] px-6 py-10 md:py-12">
        {/* Ab md ein Dreispalter mit 1fr_auto_1fr: die mittlere Spalte liegt
            dadurch exakt auf der Mittelachse des Footers, unabhaengig davon,
            wie breit die Bloecke links und rechts sind. */}
        <div className="flex flex-col items-start gap-9 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8">
          <div className="max-w-xs">
            <SiatoLogo />
            {/* text-balance verteilt die Zeilen gleichmaessig, damit «allDates.»
                nicht allein auf der zweiten Zeile steht. */}
            <p className="mt-3 text-balance text-sm text-slate-500">
              Die neue Lean Management Software von allDates.
            </p>

          </div>

          {/* Dachmarke: Siato gehoert der allDates AG */}
          <motion.a
            href="https://www.alldates.ch"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Siato ist eine Marke der allDates AG – zur Website von allDates"
            whileHover={reduce ? undefined : flaecheHover}
            whileTap={reduce ? undefined : flaecheDruck}
            transition={anfassen}
            className="group inline-flex rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#80BA2B]/40 focus-visible:ring-offset-4 md:justify-self-center"
          >
            <img
              src={`${import.meta.env.BASE_URL}logos/alldates.svg`}
              alt="allDates AG"
              className="h-12 w-auto opacity-65 transition-opacity group-hover:opacity-100 md:h-20"
            />
          </motion.a>
          {/* Flex statt grid-cols-3: bei gleich breiten Spalten haengt der
              ungenutzte Rest der kuerzesten Spalte als Weissraum an der Luecke —
              «Produkt» ist 53 px breit in einer 93-px-Spalte, die sichtbare
              Luecke war dadurch 88 statt 48 px. Auf Inhaltsbreite ist sie ueberall
              genau der gap-Wert. */}
          <div className="flex flex-wrap gap-x-12 gap-y-8 md:justify-self-end md:flex-nowrap">
            <FooterCol
              title="Produkt"
              links={[
                { label: "Module", href: "#module" },
                { label: "Preise", href: "#preise" },
                { label: "Demo", href: "#kontakt" },
              ]}
            />
            <FooterCol
              title="Unternehmen"
              links={[
                {
                  label: "Über allDates",
                  href: "https://www.alldates.ch",
                  extern: true,
                },
                {
                  label: "Team",
                  href: "https://www.alldates.ch/team/",
                  extern: true,
                },
                {
                  label: "Kontakt",
                  href: "mailto:christoph.gantner@alldates.ch",
                },
              ]}
            />
            {/* Ziele fehlen noch: die drei Rechtsseiten existieren nicht. */}
            <FooterCol
              title="Langweiliges"
              links={[
                { label: "Datenschutz", href: "#" },
                { label: "Impressum", href: "#" },
                { label: "AGB", href: "#" },
              ]}
            />
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-200/60 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} allDates AG · Siato</span>
          <span>In der Schweiz entwickelt & gehostet 🇨🇭</span>
        </div>
      </div>
    </footer>
  );
}

type FussLink = { label: string; href: string; extern?: boolean };

function FooterCol({ title, links }: { title: string; links: FussLink[] }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <div>
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <motion.a
              href={l.href}
              {...(l.extern
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              whileHover={reduce ? undefined : linkHover}
              whileTap={reduce ? undefined : linkDruck}
              transition={anfassen}
              /* Aus der linken Kante heraus wachsen, nicht aus der Mitte:
                 in einer linksbuendigen Liste wandert der Text sonst sichtbar
                 nach links aus der Flucht. */
              style={{ transformOrigin: "left center", display: "inline-block" }}
              className="text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              {l.label}
            </motion.a>
          </li>
        ))}
      </ul>
    </div>
  );
}
