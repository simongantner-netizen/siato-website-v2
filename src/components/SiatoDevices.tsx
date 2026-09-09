import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "./ui/reveal";
import { SiatoMark } from "./SiatoLogo";
import {
  Monitor,
  Tablet,
  Smartphone,
  Check,
  Camera,
  ChevronRight,
} from "lucide-react";

const devices = [
  { icon: Monitor, title: "Desktop & Web", text: "Volle Übersicht im Büro – direkt im Browser, ohne Installation." },
  { icon: Tablet, title: "Tablet am Shopfloor", text: "Boards und Kennzahlen griffbereit dort, wo produziert wird." },
  { icon: Smartphone, title: "Smartphone unterwegs", text: "Waste Walks und Aufgaben mit einem Tipp – auch von der Halle aus." },
];

/* Mobiler Siato-Screen im iPhone */
function PhoneScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-[#f7f8f6] text-left select-none">
      {/* App-Header */}
      <div className="flex items-center gap-2 bg-white px-4 pb-3 pt-9">
        <SiatoMark className="h-6 w-6" />
        <span className="text-[13px] font-semibold text-slate-900">
          Mein Cockpit
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-hidden p-3">
        {/* KPI-Kacheln */}
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Offene Aufgaben", "12"],
            ["Ideen aktiv", "8"],
          ].map(([l, v]) => (
            <div key={l} className="rounded-xl bg-white p-3">
              <div className="text-[10px] text-slate-400">{l}</div>
              <div className="mt-0.5 text-xl font-bold text-slate-900">{v}</div>
            </div>
          ))}
        </div>

        {/* Aufgaben */}
        <div className="rounded-xl bg-white p-3">
          <div className="mb-2 text-[11px] font-semibold text-slate-700">
            Heute fällig
          </div>
          {["Waste Walk Halle 2", "8D-Report #482 prüfen"].map((t) => (
            <div
              key={t}
              className="flex items-center justify-between border-t border-slate-100 py-2 first:border-0"
            >
              <span className="text-[11px] text-slate-600">{t}</span>
              <ChevronRight className="h-3 w-3 text-slate-300" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center gap-1.5 rounded-xl bg-[#80BA2B] py-2.5 text-[12px] font-semibold text-white">
          <Camera className="h-3.5 w-3.5" /> Waste Walk erfassen
        </div>
      </div>
    </div>
  );
}

function Phone() {
  return (
    <div
      /* Dieselbe sechslagige Schattenkurve wie beim Tablet in
         container-scroll-animation.tsx, auf rund 30 % herunterskaliert.
         Grund: die Sektion hat nur 96 px Polster, der Tablet-Schatten
         reicht 233 px weit und wuerde am Sektionsrand hart abgeschnitten. */
      style={{
        boxShadow:
          "0 0 #0000004d, 0 3px 6px #0000004a, 0 11px 11px #00000042, 0 25px 15px #00000026, 0 45px 18px #0000000a, 0 70px 20px #00000003",
      }}
      className="relative h-[540px] w-[264px] rounded-[2.75rem] border-[10px] border-[#1d1d1f] bg-[#1d1d1f]"
    >
      {/* Dynamic Island */}
      <div className="absolute left-1/2 top-2.5 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[#1d1d1f]" />
      <div className="h-full w-full overflow-hidden rounded-[2rem] bg-white">
        <PhoneScreen />
      </div>
    </div>
  );
}

export function SiatoDevices() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  // iPhone gleitet beim Scrollen von links in einer Drehbewegung herein.
  // Der Start ist bewusst verzögert (ab 20 % statt 0 %): davor klebt die
  // Sektion noch am unteren Bildrand, dort liefe die Bewegung ins Leere.
  // Die Fensterlänge bleibt gleich (0.6), es verschiebt sich nur nach hinten.
  const x = useTransform(scrollYProgress, [0.2, 0.8], [-280, 0]);
  const rotate = useTransform(scrollYProgress, [0.2, 0.8], [-22, 0]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.45], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.2, 0.8], [0.85, 1]);

  return (
    <section
      ref={ref}
      className="relative scroll-mt-20 overflow-hidden py-24"
    >
      <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        {/* iPhone (von links hereindrehend) */}
        <div
          className="flex justify-center"
          style={{ perspective: "1200px" }}
        >
          <motion.div style={{ x, rotate, opacity, scale, transformOrigin: "left center" }}>
            <Phone />
          </motion.div>
        </div>

        {/* Text */}
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#4e7717]">
            Überall einsatzbereit
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 [text-shadow:0_1px_14px_rgba(255,255,255,0.8)] md:text-5xl">
            Desktop, Tablet oder Smartphone – Siato ist dabei.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Verbesserung passiert nicht am Schreibtisch allein. Siato läuft im
            Browser und als App auf jedem Gerät – im Büro, am Shopfloor-Terminal
            oder unterwegs. Ihr Team erfasst Ideen und Waste Walks genau dort, wo
            sie entstehen.
          </p>

          <div className="mt-8 space-y-4">
            {devices.map((d) => (
              <div key={d.title} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#80BA2B]/12 text-[#4e7717]">
                  <d.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{d.title}</div>
                  <div className="text-[15px] text-slate-600">{d.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm font-medium text-[#4e7717]">
            <Check className="h-4 w-4" /> Ein Login, alle Geräte – dank Microsoft
            365 Single Sign-On.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
