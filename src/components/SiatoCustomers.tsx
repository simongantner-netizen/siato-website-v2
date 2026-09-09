import { Reveal } from "./ui/reveal";

// Echte Kunden. logo = Datei in public/logos/ (sonst Wortmarke als Fallback).
const customers: { name: string; logo: string | null; h?: string }[] = [
  { name: "Monopol Colors", logo: "logos/monopol.png" },
  { name: "Peterhans Schibli", logo: "logos/peterhans.svg" },
  { name: "Maurer Lackierwerk", logo: "logos/maurer.svg" },
  { name: "Schänis", logo: "logos/schaenis.png", h: "h-11 md:h-12" },
];

export function SiatoCustomers() {
  return (
    <section className="relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-[90rem] px-6">
        {/* Kunden-Headline */}
        <Reveal className="text-center">
          <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-slate-900 [text-shadow:0_1px_14px_rgba(255,255,255,0.8)] md:text-4xl">
            Kunden, die dank Siato besser und schneller arbeiten.
          </h2>
        </Reveal>

        {/* Kunden-Logos */}
        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-2 items-center gap-x-10 gap-y-10 sm:grid-cols-4">
            {customers.map((c) => (
              <div key={c.name} className="flex items-center justify-center">
                {c.logo ? (
                  <img
                    src={`${import.meta.env.BASE_URL}${c.logo}`}
                    alt={c.name}
                    className={`${c.h ?? "h-9 md:h-10"} w-auto max-w-[170px] object-contain opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0`}
                  />
                ) : (
                  <span className="text-xl font-bold tracking-tight text-slate-400 transition-colors hover:text-slate-700">
                    {c.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
