import { useState } from "react";
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
        className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#80BA2B] px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-[#80BA2B]/25 transition-colors hover:bg-[#6da524]"
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
              Sehen Sie Siato in 30 Minuten
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
  return (
    <footer className="relative border-t border-slate-200/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto max-w-[90rem] px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-xs">
            <SiatoLogo />
            <p className="mt-3 text-sm text-slate-500">
              Die neue Lean Management Software von allDates.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
            <FooterCol
              title="Produkt"
              links={["Module", "Preise", "Technologie", "Demo"]}
            />
            <FooterCol
              title="Unternehmen"
              links={["Über allDates", "Team", "Kontakt", "Karriere"]}
            />
            <FooterCol
              title="Rechtliches"
              links={["Datenschutz", "Impressum", "AGB"]}
            />
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-slate-200/60 pt-6 text-sm text-slate-400 sm:flex-row">
          <span>© {new Date().getFullYear()} allDates · Siato</span>

          <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
            <span>In der Schweiz entwickelt & gehostet 🇨🇭</span>

            {/* Dachmarke: Siato gehoert der allDates AG */}
            <a
              href="https://www.alldates.ch"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#80BA2B]/40 focus-visible:ring-offset-4"
            >
              <span className="text-xs">Eine Marke der</span>
              <img
                src={`${import.meta.env.BASE_URL}logos/alldates.svg`}
                alt="allDates AG"
                className="h-8 w-auto opacity-65 transition-opacity group-hover:opacity-100"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
