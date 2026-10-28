import { WORTMARKE } from "./SiatoLogo";
import {
  Grip,
  Menu,
  House,
  Clock,
  Pin,
  LayoutGrid,
  ListTodo,
  CalendarDays,
  Mail,
  Lightbulb,
  RefreshCcw,
  Footprints,
  TriangleAlert,
  FileText,
  Network,
  FolderCheck,
  Presentation,
  Search,
  Plus,
  Bell,
  Settings,
  CircleHelp,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  RotateCw,
  ExternalLink,
  CircleCheck,
  Circle,
  ArrowUp,
  Ellipsis,
  List,
  User,
} from "lucide-react";

/* Nachbau der echten Siato-Oberflaeche nach Remos Screenshots vom 18.09.2026
   (Desktop-Cockpit). Die Farben sind aus den Bildern gemessen, nicht geschaetzt:
   Kopfbalken #80BA2A, Grund #EDEFE4, Text #252525, Etiketten #616161,
   Ueberfaellig #A4252C, Erledigt #0E700E, Saeulen Hoch #DC616D und
   Niedrig #CAE2A6.

   Bewusst anders als im Original: keine Personennamen, keine Fremdmarken
   (Maschinen, Copilot), keine Kalenderwochen. Die Navigation zeigt die fuenf
   Lean-Bereiche aus Remos Desktop; Kunden und Vertrieb (das CRM) fehlen, bis
   entschieden ist, ob das CRM auf die Seite gehoert.

   Die Zahlen gehen auf, weil Remo die Logik kennt: heute ist Montag, 19.10.,
   die Woche laeuft bis Sonntag. Saeulen 44 plus 2 am Wochenende = 46 Aufgaben,
   davon 4 erledigt = 42 offen; Hoch-Anteile der Saeulen = 8; offen am Montag
   = 5 = heute faellig. Das iPhone zeigt denselben Tag im Monat und muss
   deshalb mindestens so viel tragen.

   Die Karte, in der dieses Bild steht, ist auf dem Telefon rund 350 px breit,
   am Desktop 1096 px. Deshalb entscheidet die Breite des Containers, nicht die
   des Fensters, was gezeigt wird: unter 32rem die kompakte Ansicht, darueber
   das Cockpit, ab 50rem mit Seitenleiste, ab 62rem mit der rechten Spalte. */

const nav = [
  { gruppe: "", items: [["Startseite", House], ["Letzte", Clock], ["Angeheftet", Pin]] },
  {
    gruppe: "Transparenz & Konsequenz",
    items: [["Cockpit", LayoutGrid], ["Aufgaben", ListTodo], ["Termine", CalendarDays], ["E-Mails", Mail]],
  },
  {
    gruppe: "Verbesserung & KVP",
    items: [["Ideen", Lightbulb], ["PDCA-Zyklen", RefreshCcw], ["Waste Walks", Footprints]],
  },
  {
    gruppe: "Qualität & Abweichungen",
    items: [["Beanstandungen", TriangleAlert], ["8D-Reports", FileText]],
  },
  {
    gruppe: "Audits & Compliance",
    items: [["Prozesslandkarte", Network], ["Gelenkte Dokumente", FolderCheck]],
  },
  {
    gruppe: "Kommunikation & Abstimmung",
    items: [["Besprechungen", Presentation], ["Shopfloor", LayoutGrid]],
  },
] as const;

const reiter = [
  "Cockpit",
  "Verbesserung & KVP",
  "Qualität & Abweichungen",
  "Audits & Compliance",
  "Kommunikation & Abstimmung",
];

/* Die Kacheln sind hier schmaler als im Original (sechs auf rund 120 px statt
   auf 270 px). Die Unterzeilen sind deshalb gekuerzt, statt mit Auslassungs-
   punkten abzubrechen. */
type Kachel = { titel: string; wert: string; text: string; ton?: "rot" | "gruen" };
const kacheln: Kachel[] = [
  { titel: "Offen", wert: "42", text: "Im Zeitraum" },
  { titel: "Überfällig", wert: "0", text: "Nichts überfällig", ton: "rot" },
  { titel: "Heute fällig", wert: "5", text: "Für heute eingeplant" },
  { titel: "Hohe Priorität", wert: "8", text: "Priorisiert offen" },
  { titel: "Ohne Termin", wert: "0", text: "Alle eingeplant" },
  { titel: "Erledigt", wert: "4", text: "4 von 46 Aufgaben", ton: "gruen" },
];

type Aufgabe = {
  titel: string;
  etikett: string;
  datum: string;
  status: string;
  prio: "Hoch" | "Normal" | "Niedrig";
  erledigt?: boolean;
};
/* anzahl ist die ganze Gruppe wie in der Saeule; sichtbar ist nur der Anfang,
   der Rest liegt unter dem Rand der Karte. */
const tage: { tag: string; anzahl: number; aufgaben: Aufgabe[] }[] = [
  {
    tag: "Montag, 19.10.",
    anzahl: 7,
    aufgaben: [
      { titel: "Produktionsrapport Vorwoche zusammenstellen", etikett: "Produktion", datum: "19.10.2026", status: "Abgeschlossen", prio: "Normal", erledigt: true },
      { titel: "Kranzeiten für Rohmaterial mit der Logistik testen", etikett: "Feste Kranzeit", datum: "19.10.2026", status: "Nicht gestartet", prio: "Normal" },
      { titel: "Teillieferung Rohmaterial vereinbaren und Fertigung freigeben", etikett: "Lieferverzug", datum: "19.10.2026", status: "In Bearbeitung", prio: "Hoch" },
      { titel: "Spänecontainer Halle 2: Abholung bestätigen", etikett: "Transporte", datum: "19.10.2026", status: "Nicht gestartet", prio: "Niedrig" },
      { titel: "Kanban Station 1: Mindestmengen mit der Montage festlegen", etikett: "Kanban", datum: "19.10.2026", status: "Abgeschlossen", prio: "Normal", erledigt: true },
    ],
  },
  {
    tag: "Dienstag, 20.10.",
    anzahl: 8,
    aufgaben: [
      { titel: "Rüstreihenfolge Bearbeitungszentrum: Fotos für Bildkarten", etikett: "Rüstzeit", datum: "20.10.2026", status: "In Bearbeitung", prio: "Normal" },
      { titel: "Störung Hydraulik Presse 4: Ersatzventil bestellt", etikett: "Shopfloor", datum: "20.10.2026", status: "Wartet auf jemand anderen", prio: "Normal" },
      { titel: "Kommissionierung Auftrag 26-4502: Fehlteile nachfassen", etikett: "Interne Abweichung", datum: "20.10.2026", status: "Nicht gestartet", prio: "Hoch" },
      { titel: "Messbericht Charge 26-3982 mit der Qualität besprechen", etikett: "Beanstandung", datum: "20.10.2026", status: "In Bearbeitung", prio: "Hoch" },
      { titel: "Shadow-Board für die Montage zeichnen", etikett: "Standardisierte Werkzeuge", datum: "20.10.2026", status: "Nicht gestartet", prio: "Niedrig" },
    ],
  },
];

/* Faelligkeiten je Tag, von unten nach oben gestapelt wie im Original. */
const saeulen = [
  { tag: "Mo", datum: "19.10", hoch: 2, normal: 2, niedrig: 1, erledigt: 2 },
  { tag: "Di", datum: "20.10", hoch: 2, normal: 4, niedrig: 1, erledigt: 1 },
  { tag: "Mi", datum: "21.10", hoch: 1, normal: 6, niedrig: 1, erledigt: 1 },
  { tag: "Do", datum: "22.10", hoch: 1, normal: 5, niedrig: 2, erledigt: 0 },
  { tag: "Fr", datum: "23.10", hoch: 2, normal: 8, niedrig: 2, erledigt: 0 },
];
const SAEULE_MAX = 12;

const termine = [
  { zeit: "07:00–07:20", mail: false, titel: "Shopfloor-Runde CNC-Fertigung", unter: "Produktion · Board CNC" },
  { zeit: "07:12", mail: true, titel: "Teillieferung Rohmaterial heute Vormittag", unter: "von Einkauf · an Produktionsleitung" },
  { zeit: "08:00–09:30", mail: false, titel: "Wochenstart Produktion", unter: "Produktionsleitung · Sitzungszimmer Halle 1" },
  { zeit: "09:30", mail: true, titel: "Messbericht Charge 26-3982", unter: "von Qualität · an Produktionsleitung" },
  { zeit: "10:00–10:45", mail: false, titel: "Wareneingang Rohmaterial begleiten", unter: "Logistik · Wareneingang" },
  { zeit: "11:02", mail: true, titel: "Gehäusedeckel: Besprechung Messbericht", unter: "von Qualität · an Fertigung" },
  { zeit: "13:20", mail: true, titel: "Angebot Schnellspannsystem", unter: "von Lieferant · an Einkauf" },
];

const ICON = "h-[13px] w-[13px] shrink-0";

function Prio({ prio, erledigt }: { prio: Aufgabe["prio"]; erledigt?: boolean }) {
  if (prio === "Hoch" && !erledigt)
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full border border-[#f5c2c7] bg-[#FDE7E9] px-1.5 py-px text-[9px] font-semibold text-[#A4252C]">
        <ArrowUp className="h-2 w-2" strokeWidth={3} /> Hoch
      </span>
    );
  return <span className="text-[10px] text-[#616161]">{prio}</span>;
}

function Kopfbalken() {
  return (
    <div className="flex h-10 shrink-0 items-center gap-3 bg-[#80BA2A] pr-3 text-white">
      <div className="flex h-full w-10 items-center justify-center">
        <Grip className="h-4 w-4" strokeWidth={2} />
      </div>
      {/* Im Original steht hier das allDates-Logo und «Siato» als Text. Die
          Seite fuehrt stattdessen ihre Wortmarke, wie in allen Attrappen. */}
      <span translate="no" className={`${WORTMARKE} text-[17px] leading-none`}>siato</span>
      <div className="mx-auto flex h-6 w-[38%] max-w-[22rem] items-center gap-1.5 rounded-[3px] border border-white/60 bg-white px-2 text-[11px] text-[#616161]">
        <Search className="h-3 w-3 text-[#424242]" strokeWidth={2} /> Suchen
      </div>
      <div className="flex items-center gap-3.5">
        {[Plus, Bell, Settings, CircleHelp].map((Icon, i) => (
          <Icon key={i} className="h-[15px] w-[15px]" strokeWidth={1.8} />
        ))}
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/70 text-[9px] font-semibold">
          LB
        </span>
      </div>
    </div>
  );
}

function Seitenleiste() {
  return (
    <aside className="hidden w-44 shrink-0 flex-col overflow-hidden border-r border-[#e0e0e0] bg-white py-2 text-[11px] text-[#252525] @min-[50rem]:flex">
      <Menu className="mb-2 ml-3 h-4 w-4 text-[#424242]" strokeWidth={1.8} />
      {nav.map((g) => (
        <div key={g.gruppe || "start"} className="mb-1.5">
          {g.gruppe && (
            <div className="flex items-start justify-between px-3 pb-1 pt-1.5 font-semibold leading-tight">
              <span className="max-w-[8.5rem]">{g.gruppe}</span>
              <ChevronUp className="mt-0.5 h-3 w-3 text-[#616161]" />
            </div>
          )}
          {g.items.map(([label, Icon]) => {
            const aktiv = label === "Cockpit";
            return (
              <div
                key={label}
                className={`relative flex items-center gap-2 px-3 py-[5px] ${aktiv ? "bg-[#f5f5f5] font-semibold" : ""}`}
              >
                {/* Der blaue Strich ist Teil der echten Power-App-Navigation. */}
                {aktiv && <span className="absolute inset-y-1 left-0.5 w-[3px] rounded-full bg-[#106CBD]" />}
                <Icon className={`${ICON} text-[#424242]`} strokeWidth={1.7} />
                <span className="truncate">{label}</span>
              </div>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

function Zeitraum() {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-[#252525]">
      <span className="flex h-6 w-6 items-center justify-center rounded border border-[#d1d1d1] bg-white">
        <ChevronLeft className="h-3 w-3" />
      </span>
      <div className="flex h-6 overflow-hidden rounded border border-[#d1d1d1] bg-white">
        <span className="flex items-center px-2.5">Heute</span>
        <span className="flex items-center border-x border-[#80BA2A] bg-[#E4F0D3] px-2.5 font-semibold">Woche</span>
        <span className="flex items-center px-2.5">Monat</span>
      </div>
      <span className="flex h-6 w-6 items-center justify-center rounded border border-[#d1d1d1] bg-white">
        <ChevronRight className="h-3 w-3" />
      </span>
      <div className="hidden items-center gap-1.5 @min-[62rem]:flex">
        <span className="ml-1 text-[#616161]">Von</span>
        <span className="flex h-6 w-[5.5rem] items-center rounded border border-[#d1d1d1] bg-white px-2">19.10.2026</span>
        <span className="text-[#616161]">Bis</span>
        <span className="flex h-6 w-[5.5rem] items-center rounded border border-[#d1d1d1] bg-white px-2">25.10.2026</span>
        <span className="flex h-6 items-center rounded border border-[#d1d1d1] bg-white px-2.5 font-semibold">Übernehmen</span>
      </div>
      <span className="flex h-6 w-6 items-center justify-center rounded bg-[#80BA2A] text-white">
        <RotateCw className="h-3 w-3" strokeWidth={2.2} />
      </span>
    </div>
  );
}

function KachelBox({ k }: { k: Kachel }) {
  const farbe = k.ton === "rot" ? "text-[#A4252C]" : k.ton === "gruen" ? "text-[#0E700E]" : "text-[#252525]";
  return (
    <div className="min-w-0 rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5">
      <div className="truncate text-[9px] font-semibold uppercase tracking-[0.04em] text-[#616161]">{k.titel}</div>
      <div className={`mt-0.5 text-[22px] font-semibold leading-tight tabular-nums ${farbe}`}>{k.wert}</div>
      <div className={`truncate text-[9.5px] ${k.ton === "rot" ? "text-[#A4252C]" : "text-[#616161]"}`}>{k.text}</div>
    </div>
  );
}

function Aufgabenliste() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-md border border-[#e5e5e5] bg-white">
      <div className="flex items-start justify-between px-3 pt-3">
        <div>
          <div className="text-[12px] font-semibold text-[#252525]">Meine Aufgaben</div>
          <div className="text-[9.5px] text-[#616161]">Aufgaben im gewählten Zeitraum · 46 Einträge</div>
        </div>
        <div className="flex h-6 w-44 items-center gap-1.5 rounded border border-[#d1d1d1] px-2 text-[10px] text-[#616161]">
          <Search className="h-3 w-3" /> Aufgaben durchsuchen
        </div>
      </div>
      <div className="mx-3 mt-2 flex items-center gap-2 border-b border-[#eee] pb-2 text-[10px] text-[#616161]">
        <Plus className="h-3 w-3 text-[#80BA2A]" strokeWidth={2.4} />
        Neue Aufgabe – Titel eingeben und mit Enter bestätigen
      </div>
      <div className="grid grid-cols-[1fr_4.8rem_5.6rem_3.6rem_1.4rem_1rem] gap-x-2 border-b border-[#eee] px-3 py-1.5 text-[8.5px] font-semibold uppercase tracking-[0.04em] text-[#616161]">
        <span className="pl-6">Betreff</span>
        <span>Fälligkeit</span>
        <span>Statusgrund</span>
        <span>Priorität</span>
        <span />
        <span />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        {tage.map((t) => (
          <div key={t.tag}>
            <div className="bg-[#fafafa] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.04em] text-[#616161]">
              {t.tag} <span className="ml-1 font-normal">{t.anzahl}</span>
            </div>
            {t.aufgaben.map((a) => (
              <div
                key={a.titel}
                className="grid grid-cols-[1fr_4.8rem_5.6rem_3.6rem_1.4rem_1rem] items-center gap-x-2 border-b border-[#f0f0f0] px-3 py-[5px]"
              >
                <div className="flex min-w-0 items-start gap-2">
                  {a.erledigt ? (
                    <CircleCheck className="mt-px h-4 w-4 shrink-0 fill-[#80BA2A] text-white" strokeWidth={2} />
                  ) : (
                    <Circle className="mt-px h-4 w-4 shrink-0 text-[#8a8a8a]" strokeWidth={1.5} />
                  )}
                  <div className="min-w-0">
                    <div className={`truncate text-[10.5px] font-semibold ${a.erledigt ? "text-[#616161] line-through" : "text-[#252525]"}`}>
                      {a.titel}
                    </div>
                    <span className="mt-px inline-block rounded-sm bg-[#f0f0f0] px-1 text-[8.5px] text-[#616161]">{a.etikett}</span>
                  </div>
                </div>
                <span className="text-[9.5px] tabular-nums text-[#616161]">{a.datum}</span>
                <span className="truncate text-[9.5px] text-[#616161]">{a.status}</span>
                <Prio prio={a.prio} erledigt={a.erledigt} />
                <span
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded-full text-[7px] font-semibold ${a.erledigt ? "bg-[#f3e2a1] text-[#6b5a14]" : "bg-[#e1e1e1] text-[#424242]"}`}
                >
                  LB
                </span>
                <ExternalLink className="h-3 w-3 text-[#8a8a8a]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Faelligkeiten() {
  const legende = [
    ["Hoch", "#DC616D"],
    ["Normal", "#80BA2A"],
    ["Niedrig", "#CAE2A6"],
    ["Erledigt", "#C9CCC3"],
  ];
  return (
    <div className="rounded-md border border-[#e5e5e5] bg-white px-3 pb-2.5 pt-3">
      <div className="text-[12px] font-semibold text-[#252525]">Fälligkeiten im Zeitverlauf</div>
      <div className="text-[9.5px] text-[#616161]">19.10. – 25.10. · nach Fälligkeit</div>
      <div className="mt-2 flex h-[7.5rem] items-end justify-around">
        {saeulen.map((s) => {
          const summe = s.hoch + s.normal + s.niedrig + s.erledigt;
          return (
            <div key={s.tag} className="flex h-full w-9 flex-col items-center justify-end">
              <span className="mb-1 text-[9px] text-[#424242]">{summe}</span>
              <div className="flex w-full flex-col-reverse overflow-hidden rounded-t-[3px]" style={{ height: `${(summe / SAEULE_MAX) * 82}%` }}>
                <div style={{ flexGrow: s.hoch }} className="bg-[#DC616D]" />
                <div style={{ flexGrow: s.normal }} className="bg-[#80BA2A]" />
                <div style={{ flexGrow: s.niedrig }} className="bg-[#CAE2A6]" />
                <div style={{ flexGrow: s.erledigt }} className="bg-[#C9CCC3]" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex justify-around text-[9px] text-[#424242]">
        {saeulen.map((s) => (
          <span key={s.tag} className="w-9 text-center">{s.tag}</span>
        ))}
      </div>
      <div className="mt-0.5 text-center text-[8.5px] text-[#616161]">+ 2 am Wochenende</div>
      <div className="mt-2 flex justify-end gap-2.5 text-[8.5px] text-[#616161]">
        {legende.map(([l, c]) => (
          <span key={l} className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-[1px]" style={{ background: c }} /> {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function Termine() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-[#e5e5e5] bg-white px-3 pt-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[12px] font-semibold text-[#252525]">Termine & E-Mails</div>
          <div className="whitespace-nowrap text-[9.5px] text-[#616161]">22 Termine · 33 E-Mails</div>
        </div>
        <div className="flex shrink-0 overflow-hidden whitespace-nowrap rounded border border-[#d1d1d1] text-[8.5px]">
          <span className="border-r border-[#80BA2A] bg-[#E4F0D3] px-1.5 py-0.5 font-semibold">Alle</span>
          <span className="px-1.5 py-0.5">Termine</span>
          <span className="border-l border-[#d1d1d1] px-1.5 py-0.5">E-Mails</span>
        </div>
      </div>
      <div className="mt-2 text-[8.5px] font-semibold uppercase tracking-[0.04em] text-[#616161]">Mo., 19.10.</div>
      <div className="mt-1 min-h-0 flex-1 overflow-hidden">
        {termine.map((t) => (
          <div key={t.titel} className="flex items-start gap-2 border-l-2 border-[#80BA2A] py-1 pl-2">
            {t.mail ? (
              <Mail className="mt-px h-3 w-3 shrink-0 text-[#80BA2A]" />
            ) : (
              <CalendarDays className="mt-px h-3 w-3 shrink-0 text-[#80BA2A]" />
            )}
            <span className="w-[3.6rem] shrink-0 text-[9px] tabular-nums text-[#424242]">{t.zeit}</span>
            {/* Die Bezugsspalte des Originals (rechts, zu welchem Vorgang)
                bleibt weg: in rund 300 px Spaltenbreite kuerzte sie die Titel
                auf ein Wort. */}
            <div className="min-w-0 flex-1">
              <div className="truncate text-[9.5px] font-semibold text-[#252525]">{t.titel}</div>
              <div className="truncate text-[8.5px] text-[#616161]">{t.unter}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Die kompakte Ansicht fuer das Telefon ist die Aufgaben-Seite der echten
   iPhone-App (Remo, 24.10.2026). Kein gruener Balken, keine Wortmarke: beides
   gibt es in der App nicht. Das Dashboard derselben App steht weiter unten im
   iPhone, hier steht bewusst die andere Seite. Zahlen wie im Cockpit: 42 offen,
   davon 5 heute. */
const kompaktGruppen = [
  { titel: "Heute", anzahl: 5, heute: true, aufgaben: tage[0].aufgaben.filter((a) => !a.erledigt) },
  { titel: "Später", anzahl: 37, heute: false, aufgaben: tage[1].aufgaben.slice(0, 2) },
];

function Kompakt() {
  return (
    <div className="flex h-full w-full flex-col bg-[#FAFAFA] @min-[32rem]:hidden">
      <div className="border-b border-[#E8E8E8] px-4 pb-2.5 pt-4">
        <div className="text-[18px] font-semibold leading-tight text-[#111]">Meine Aufgaben</div>
        <div className="text-[11px] text-[#737373]">42 offene Aufgaben</div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden px-3">
        {kompaktGruppen.map((g) => (
          <div key={g.titel}>
            <div className={`px-1 pb-1.5 pt-2.5 text-[11px] font-semibold ${g.heute ? "text-[#475F20]" : "text-[#333]"}`}>
              {g.titel} <span className="ml-0.5 font-normal text-[#737373]">{g.anzahl}</span>
            </div>
            <div className="overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-white">
              {g.aufgaben.map((a) => (
                <div key={a.titel} className="flex items-center gap-2.5 border-b border-[#f0f0f0] px-3 py-2 last:border-0">
                  <Circle className="h-[18px] w-[18px] shrink-0 text-[#9a9a9a]" strokeWidth={1.5} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11.5px] font-semibold text-[#111]">{a.titel}</div>
                    <div className="truncate text-[10px] text-[#737373]">
                      <span className={g.heute ? "font-semibold text-[#475F20]" : ""}>
                        {g.heute ? "Mo. 19.10." : "Di. 20.10."}
                      </span>{" "}
                      {a.etikett}
                    </div>
                  </div>
                  <Ellipsis className="h-4 w-4 shrink-0 text-[#737373]" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-[#E8E8E8] bg-[#FAFAFA] px-3 py-2">
        <div className="flex h-8 flex-1 items-center rounded-[9px] border border-[#E5E5E5] bg-white px-2.5 text-[10.5px] text-[#9a9a9a]">
          Aufgabe hinzufügen (fällig heute)
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#AFBF9C] text-white">
          <Plus className="h-4 w-4" strokeWidth={2.4} />
        </span>
      </div>
      <div className="flex shrink-0 border-t border-[#E5E5E5] bg-white pb-1.5 pt-1.5">
        {(
          [
            ["Dashboard", LayoutGrid],
            ["Aufgaben", CircleCheck],
            ["Listen", List],
            ["Profil", User],
          ] as const
        ).map(([label, Icon]) => (
          <div
            key={label}
            className={`flex flex-1 flex-col items-center gap-0.5 text-[9px] ${label === "Aufgaben" ? "font-semibold text-[#475F20]" : "text-[#737373]"}`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.8} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function Cockpit() {
  return (
    <div className="hidden h-full w-full flex-col @min-[32rem]:flex">
      <Kopfbalken />
      <div className="flex min-h-0 flex-1">
        <Seitenleiste />
        <div className="flex min-w-0 flex-1 flex-col bg-[#EDEFE4] px-4 pt-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[16px] font-semibold leading-tight text-[#252525]">Guten Morgen, Lea</div>
              <div className="text-[10px] text-[#616161]">Montag, 19. Oktober 2026 · 19.10. – 25.10.2026</div>
            </div>
            <Zeitraum />
          </div>
          <div className="mt-2.5 flex gap-4 overflow-hidden whitespace-nowrap border-b border-[#d9dccf] text-[11px] text-[#424242]">
            {/* Der fuenfte Reiter passt erst ab 62rem; davor wuerde er am Rand
                mitten im Wort abgeschnitten. */}
            {reiter.map((r, i) => (
              <span
                key={r}
                className={`pb-1.5 ${r === "Cockpit" ? "border-b-2 border-[#252525] font-semibold text-[#252525]" : ""} ${i === 4 ? "hidden @min-[62rem]:inline" : ""}`}
              >
                {r}
              </span>
            ))}
          </div>
          <div className="mt-2.5 grid grid-cols-3 gap-2 @min-[50rem]:grid-cols-6">
            {kacheln.map((k) => (
              <KachelBox key={k.titel} k={k} />
            ))}
          </div>
          <div className="mt-2.5 flex min-h-0 flex-1 gap-2.5">
            <Aufgabenliste />
            <div className="hidden w-[34%] min-w-0 flex-col gap-2.5 @min-[62rem]:flex">
              <Faelligkeiten />
              <Termine />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiatoDashboard() {
  return (
    /* Ein Bild aus Text: fuer Screenreader eine Beschreibung statt hundert
       vorgelesener Aufgabenzeilen. */
    <div
      role="img"
      aria-label="Siato-Cockpit am Bildschirm: Kennzahlen der Woche, Aufgabenliste nach Tagen, Fälligkeiten sowie Termine und E-Mails"
      className="@container h-full w-full text-left select-none"
    >
      <Kompakt />
      <Cockpit />
    </div>
  );
}
