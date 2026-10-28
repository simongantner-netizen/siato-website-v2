import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Reveal } from "./ui/reveal";
import {
  Monitor,
  Tablet,
  Smartphone,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Wifi,
  LayoutGrid,
  CircleCheck,
  List,
  User,
} from "lucide-react";

const devices = [
  { icon: Monitor, title: "Desktop & Web", text: "Volle Übersicht im Büro, direkt im Browser und ohne Installation." },
  { icon: Tablet, title: "Tablet am Shopfloor", text: "Boards und Waste Walks griffbereit dort, wo produziert wird." },
  { icon: Smartphone, title: "Smartphone unterwegs", text: "Kennzahlen lesen, Aufgaben abhaken und anlegen. Mit eingeschränktem Funktionsumfang." },
];

/* Mobiler Siato-Screen im iPhone, nachgebaut nach Remos Bildern vom
   24.10.2026 (Dashboard der iPhone-App). Gemessen: Grund #FAFAFA, Karten weiss
   mit Rand #E5E5E5, Dunkelgruen #475F20 fuer Knopf, gute Werte und den
   aktiven Reiter, Rot #B1241B, Etiketten #737373, Umschalter #EBEBEB.

   Gezeichnet wird in den Massen eines echten iPhones (393 pt breit) und dann
   als Ganzes verkleinert: so stimmen Schriftgroessen und Abstaende im
   Verhaeltnis, statt dass jede Zahl einzeln geschrumpft werden muss. Der
   Bildschirm des Geraets ist 244 x 520 px, das ergibt 0.6209 und 837.5 pt.

   Die echte App zeigt kein Logo, nur den Gruss. Deshalb steht hier auch keine
   Wortmarke. Gezeigt wird nur, was die App kann: Kennzahlen lesen, Aufgaben
   abhaken und anlegen - keine Ideen oder Waste Walks erfassen (Remo,
   18.09.2026: am Telefon eingeschraenkt). */
const PT = 244 / 393;

/* Derselbe Tag wie im Tablet (Montag, 19.10.), aber der ganze Monat: darum
   mehr offen als in der Woche (64 statt 42), dieselben 5 heute faellig, und
   die 2 Ueberfaelligen liegen vor dem Wochenbeginn - im Tablet stehen 0. */
const telefonKacheln: { titel: string; wert: string; text: string; ton?: "rot" | "gruen" }[] = [
  { titel: "Offen", wert: "64", text: "Offene Aufgaben im Zeitraum" },
  { titel: "Überfällig", wert: "2", text: "Älteste seit 5 Tagen offen", ton: "rot" },
  { titel: "Heute fällig", wert: "5", text: "Für heute eingeplant" },
  { titel: "Hohe Priorität", wert: "11", text: "Priorisierte offene Aufgaben" },
  { titel: "Ohne Termin", wert: "0", text: "Alle Aufgaben sind eingeplant" },
  { titel: "Erledigt", wert: "19", text: "19 von 83 Aufgaben im Zeitraum", ton: "gruen" },
];

function Statusleiste() {
  return (
    <div className="flex h-[54px] items-end justify-between px-8 pb-2 text-[17px] font-semibold text-black">
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        {/* Empfang, WLAN, Akku - als Formen, nicht als Symbolschrift */}
        <span className="flex items-end gap-[2px]">
          {[5, 8, 11, 13].map((h, i) => (
            <span key={h} className={`w-[3px] rounded-[1px] ${i < 3 ? "bg-black" : "bg-black/25"}`} style={{ height: h }} />
          ))}
        </span>
        <Wifi className="h-[17px] w-[17px]" strokeWidth={2.6} />
        <span className="relative ml-0.5 flex h-[13px] w-[25px] items-center rounded-[4px] border border-black/40 p-[1.5px]">
          <span className="h-full w-[70%] rounded-[2px] bg-black" />
          <span className="absolute -right-[3px] h-[4px] w-[1.5px] rounded-r bg-black/40" />
        </span>
      </span>
    </div>
  );
}

function PhoneScreen() {
  return (
    <div
      role="img"
      aria-label="Siato-App auf dem iPhone: Cockpit mit offenen, überfälligen und erledigten Aufgaben des Monats"
      className="relative h-full w-full overflow-hidden bg-[#FAFAFA] text-left select-none"
    >
      <div
        className="absolute left-0 top-0 flex origin-top-left flex-col"
        style={{ width: 393, height: 520 / PT, transform: `scale(${PT})` }}
      >
        <Statusleiste />

        {/* Gruss und Zeitraum */}
        <div className="px-5 pt-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[27px] font-semibold leading-tight tracking-[-0.01em] text-[#111]">
                Guten Morgen, Lea
              </div>
              <div className="mt-0.5 text-[17px] text-[#737373]">Montag, 19. Oktober</div>
            </div>
            <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-[#475F20] text-white">
              <RotateCw className="h-[22px] w-[22px]" strokeWidth={2.4} />
            </span>
          </div>
          {/* Inter laeuft breiter als die Systemschrift des iPhones; mit 17 pt
              wie im Original stiessen die vier Zeitraeume aneinander. */}
          <div className="mt-3.5 flex items-center gap-2">
            <span className="flex h-[50px] w-[46px] shrink-0 items-center justify-center rounded-[14px] border border-[#E5E5E5] bg-white">
              <ChevronLeft className="h-6 w-6 text-[#111]" />
            </span>
            <div className="flex h-[50px] flex-1 items-center rounded-[14px] bg-[#EBEBEB] p-[3px] text-[15px] text-[#444]">
              {["Heute", "Woche", "Monat", "Von/Bis"].map((z) => (
                <span
                  key={z}
                  className={`flex h-full flex-1 items-center justify-center rounded-[11px] ${z === "Monat" ? "bg-white font-semibold text-[#111] shadow-[0_1px_3px_rgba(0,0,0,0.12)]" : ""}`}
                >
                  {z}
                </span>
              ))}
            </div>
            <span className="flex h-[50px] w-[46px] shrink-0 items-center justify-center rounded-[14px] border border-[#E5E5E5] bg-white">
              <ChevronRight className="h-6 w-6 text-[#111]" />
            </span>
          </div>
          <div className="mt-2 text-[16px] text-[#737373]">Oktober · 01.10. – 31.10.</div>
        </div>

        <div className="mt-2.5 h-px bg-[#E8E8E8]" />

        {/* Cockpit-Kacheln. Knapp gesetzt, damit die dritte Reihe ganz ueber
            der Reiterleiste steht - zwei Pixel darunter sah wie ein Fehler aus. */}
        <div className="flex-1 overflow-hidden px-5 pt-3.5">
          <div className="pl-1 text-[20px] font-semibold text-[#111]">Cockpit</div>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            {telefonKacheln.map((k) => (
              <div key={k.titel} className="rounded-[18px] border border-[#E5E5E5] bg-white px-4 pb-3 pt-3">
                <div className="flex items-center justify-between text-[16px] text-[#222]">
                  {k.titel}
                  <ChevronRight className="h-[18px] w-[18px] text-[#A0A0A0]" />
                </div>
                <div
                  className={`mt-0.5 text-[34px] font-semibold leading-tight tabular-nums ${k.ton === "rot" ? "text-[#B1241B]" : k.ton === "gruen" ? "text-[#475F20]" : "text-[#111]"}`}
                >
                  {k.wert}
                </div>
                <div className="mt-0.5 text-[14px] leading-snug text-[#737373]">{k.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reiterleiste der App */}
        <div className="flex h-[92px] shrink-0 border-t border-[#E5E5E5] bg-white px-2 pt-2.5">
          {[
            ["Dashboard", LayoutGrid],
            ["Aufgaben", CircleCheck],
            ["Listen", List],
            ["Profil", User],
          ].map(([label, Icon], i) => {
            const I = Icon as typeof LayoutGrid;
            return (
              <div
                key={label as string}
                className={`flex flex-1 flex-col items-center gap-1 text-[13px] ${i === 0 ? "font-semibold text-[#475F20]" : "text-[#737373]"}`}
              >
                <I className="h-[26px] w-[26px]" strokeWidth={1.8} />
                {label as string}
              </div>
            );
          })}
        </div>
      </div>
      {/* Home-Balken */}
      <span className="absolute bottom-[5px] left-1/2 h-[3px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
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

  /* Gefedert wie das Tablet und wie alles andere auf dieser Seite. Ohne Feder
     geht jeder Ruckler des Scrolls ungefiltert in die Bewegung, und ein Sprung
     über die halbe Seite rast in wenigen Bildern durch den ganzen Weg. Mehr
     Weg, weicher gefahren, wirkt getragener als wenig Weg hart. */
  const reduce = useReducedMotion() ?? false;
  const gefedert = useSpring(scrollYProgress, {
    damping: 32,
    stiffness: 130,
    mass: 0.7,
    restDelta: 0.0005,
  });
  const lauf = reduce ? scrollYProgress : gefedert;

  const x = useTransform(lauf, [0.2, 0.8], reduce ? [0, 0] : [-360, 0]);
  const rotate = useTransform(lauf, [0.2, 0.8], reduce ? [0, 0] : [-30, 0]);
  const opacity = useTransform(lauf, [0.2, 0.45], [0, 1]);
  const scale = useTransform(lauf, [0.2, 0.8], reduce ? [1, 1] : [0.82, 1]);

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
          <motion.div
            style={{
              x,
              rotate,
              opacity,
              scale,
              transformOrigin: "left center",
              /* Eigene Ebene: der sechslagige Schatten des Geräts sitzt
                 unter diesem Element und würde sonst in jedem Bild neu
                 gerastert. So wird er einmal gezeichnet, und die Bewegung
                 ist reine Compositor-Arbeit. */
              willChange: "transform",
            }}
          >
            <Phone />
          </motion.div>
        </div>

        {/* Text */}
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#4e7717]">
            Überall einsatzbereit
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 [text-shadow:0_1px_14px_rgba(255,255,255,0.8)] md:text-5xl">
            Desktop, Tablet, Smartphone: Siato ist überall dabei.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Verbesserung passiert nicht am Schreibtisch allein. Siato läuft im
            Browser und als App auf jedem Gerät. Gebaut ist es für Desktop und
            Tablet: Dort hat Ihr Team den vollen Funktionsumfang, im Büro wie am
            Shopfloor-Terminal. Unterwegs reicht das Smartphone für Kennzahlen
            und Aufgaben.
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
            <Check className="h-4 w-4" /> Ein Login für alle Geräte: das Microsoft-Konto, das Ihr Team schon hat.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
