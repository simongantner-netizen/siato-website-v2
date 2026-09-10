import { Reveal } from "./ui/reveal";
import { ShieldCheck, Plug, Banknote, Blocks } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Schweizer Datenhoheit",
    text: "In der Schweiz entwickelt und gehostet. Ihre Daten bleiben hier – DSGVO- und ISO-konform.",
  },
  {
    icon: Plug,
    title: "Microsoft 365 integriert",
    text: "Single Sign-On, Teams, Outlook und SharePoint. Siato fügt sich nahtlos in Ihre bestehende IT.",
  },
  {
    icon: Banknote,
    title: "Faire KMU-Preise",
    text: "Schon ab CHF 15.– pro Nutzer. Sie zahlen nur die Module, die Sie wirklich brauchen.",
  },
  {
    icon: Blocks,
    title: "Erweiterbar & zukunftssicher",
    text: "Auf Microsoft Power Platform gebaut. Eigene Prozesse ergänzen Sie ohne Lizenz-Mehrkosten.",
  },
];

export function SiatoWhy() {
  return (
    <section id="warum" className="relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-[90rem] px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#4e7717]">
            Warum Siato
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Bewährt seit 15 Jahren. Modern neu gebaut.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Hinter Siato steht allDates: eine Software, die seit über 15 Jahren
            in Schweizer KMU läuft und dort Abläufe verkürzt und Fehler vermeidet.
            Über 80 Betriebe arbeiten damit. Siato übernimmt die erprobten
            Funktionen und baut sie auf heutiger Technik neu.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5 backdrop-blur-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#80BA2B]/12 text-[#4e7717]">
                  <r.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
                  {r.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  {r.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
