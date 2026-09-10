import { Reveal } from "./ui/reveal";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Start",
    price: "ab CHF 190",
    unit: "pro Modul / Monat",
    desc: "Für KMU, die gezielt einzelne Lean-Themen digitalisieren.",
    features: [
      "Einzelne Module frei wählbar",
      "CHF 5.– pro Nutzer / Monat",
      "Microsoft 365 Integration",
      "Updates im Halbjahres-Rhythmus",
    ],
    cta: "Module wählen",
    featured: false,
  },
  {
    name: "Professional",
    price: "Modulpaket",
    unit: "individuell geschnürt",
    desc: "Die meistgewählte Lösung – mehrere Module im Verbund.",
    features: [
      "Mehrere Module im Paket",
      "Vergünstigter Paketpreis",
      "Onboarding & Schulung",
      "Priorisierter Support",
    ],
    cta: "Beratung anfragen",
    featured: true,
  },
  {
    name: "Custom",
    price: "nach Aufwand",
    unit: "Eigenentwicklung",
    desc: "Eigene Prozesse auf der Power Platform – ohne Lizenz-Mehrkosten.",
    features: [
      "Unternehmenseigene Prozesse",
      "Gleiche Datenbank, keine Extra-Lizenz",
      "Ablösung von Excel & Drittanbietern",
      "Volle Power-Platform-Funktionalität",
    ],
    cta: "Projekt besprechen",
    featured: false,
  },
];

export function SiatoPricing() {
  return (
    <section id="preise" className="relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-[90rem] px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#4e7717]">
            Preise
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Sie zahlen nur, was Sie nutzen
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Modular aufgebaut und mitwachsend. Starten Sie mit einem Modul –
            erweitern Sie, wann immer Sie wollen.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.08} className="h-full">
              <div
                className={`flex h-full flex-col rounded-3xl border p-8 transition-all md:backdrop-blur-sm ${
                  plan.featured
                    ? "border-[#80BA2B] bg-white shadow-xl shadow-[#80BA2B]/15 ring-1 ring-[#80BA2B]"
                    : "border-slate-200/80 bg-white shadow-sm shadow-slate-900/5 md:bg-white/90"
                }`}
              >
                {plan.featured && (
                  <span className="mb-4 w-fit rounded-full bg-[#80BA2B] px-3 py-1 text-xs font-semibold text-white">
                    Beliebt
                  </span>
                )}
                <h3 className="text-lg font-semibold text-slate-900">
                  {plan.name}
                </h3>
                <div className="mt-3">
                  <span className="text-3xl font-bold tracking-tight text-slate-900">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-sm text-slate-500">
                    {plan.unit}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{plan.desc}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#80BA2B]" />
                      <span className="text-sm text-slate-700">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#kontakt"
                  className={`mt-8 rounded-full px-6 py-3 text-center text-[15px] font-bold transition-colors ${
                    plan.featured
                      ? "bg-[#80BA2B] text-white hover:bg-[#6da524]"
                      : "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Power Platform Hosting: CHF 5.– pro Benutzer / Monat · Alle Preise
            exkl. MwSt.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
