import { WORTMARKE } from "./SiatoLogo";
import {
  LayoutDashboard,
  ListTodo,
  Lightbulb,
  RefreshCcw,
  ShieldCheck,
  BarChart3,
  Users,
  Search,
  Bell,
  TrendingUp,
  CheckCircle2,
  Circle,
  ArrowUpRight,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Mein Cockpit", active: true },
  { icon: ListTodo, label: "Aufgaben" },
  { icon: Lightbulb, label: "Ideenmanagement" },
  { icon: RefreshCcw, label: "PDCA-Zyklen" },
  { icon: ShieldCheck, label: "Audits" },
  { icon: BarChart3, label: "Kennzahlen" },
  { icon: Users, label: "Mitarbeitende" },
];

const kpis = [
  { label: "Offene Aufgaben", value: "12", delta: "−3 diese Woche", up: false },
  { label: "Ideen in Umsetzung", value: "8", delta: "+2 diese Woche", up: true },
  { label: "Aktive PDCA-Zyklen", value: "5", delta: "2 vor Abschluss", up: true },
  { label: "Audit-Score", value: "94%", delta: "+1.5 Pkt.", up: true },
];

const tasks = [
  { title: "Waste Walk Halle 2 auswerten", tag: "KVP", done: false },
  { title: "8D-Report Beanstandung #482 prüfen", tag: "Qualität", done: false },
  { title: "Fähigkeitsmatrix Team Montage aktualisieren", tag: "MA-Entwicklung", done: true },
  { title: "Internes Audit Q3 vorbereiten", tag: "Compliance", done: false },
];

const bars = [42, 58, 49, 66, 61, 74, 70, 82, 78, 88, 84, 92];

export function SiatoDashboard() {
  return (
    <div className="flex h-full w-full bg-[#f7f8f6] text-left text-slate-800 select-none">
      {/* Sidebar */}
      <aside className="hidden md:flex w-52 shrink-0 flex-col border-r border-slate-200 bg-white">
        {/* Reine Wortmarke, wie in der Navigation - kein Signet davor. Hier
            stand bis zum 16.09.2026 noch das alte Lockup aus Ribbon plus
            Schnitt 600; das ist die Fassung von vor dem 10.09.2026. */}
        <div className="flex items-center px-5 pt-5 pb-6">
          <span className={`${WORTMARKE} text-xl text-slate-900`}>siato</span>
        </div>
        <nav className="flex flex-col gap-1 px-3 text-[13px]">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 ${
                item.active
                  ? "bg-[#80BA2B]/10 text-[#4e7717] font-medium"
                  : "text-slate-500"
              }`}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.8} />
              {item.label}
            </div>
          ))}
        </nav>
        <div className="mt-auto px-5 pb-5 text-[11px] text-slate-400">
          allDates · Siato v1.0
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
          <div>
            <p className="text-[13px] font-semibold text-slate-900">
              Guten Morgen, Christoph
            </p>
            <p className="text-[11px] text-slate-400">
              Mein persönliches Cockpit · Mittwoch, 11. Juni
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-400">
              <Search className="h-3.5 w-3.5" /> Suchen…
            </div>
            <Bell className="h-4 w-4 text-slate-400" />
            <div className="h-7 w-7 rounded-full bg-[#80BA2B]/20 flex items-center justify-center text-[11px] font-semibold text-[#4e7717]">
              CG
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-5 md:grid-cols-3">
          {/* KPI row spans all */}
          <div className="col-span-1 grid grid-cols-2 gap-3 md:col-span-3 md:grid-cols-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <p className="text-[11px] text-slate-400">{kpi.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  {kpi.value}
                </p>
                <p
                  className={`mt-1 flex items-center gap-1 text-[11px] ${
                    kpi.up ? "text-[#4e7717]" : "text-slate-400"
                  }`}
                >
                  <TrendingUp className="h-3 w-3" />
                  {kpi.delta}
                </p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-slate-900">
                Umgesetzte Verbesserungen
              </p>
              <span className="flex items-center gap-1 rounded-full bg-[#80BA2B]/10 px-2 py-0.5 text-[11px] font-medium text-[#4e7717]">
                <ArrowUpRight className="h-3 w-3" /> +18% YoY
              </span>
            </div>
            <div className="mt-4 flex h-32 items-end gap-2">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-md ${
                    i === bars.length - 1 ? "bg-[#80BA2B]" : "bg-[#80BA2B]/25"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-400">
              <span>Jul</span>
              <span>Okt</span>
              <span>Jan</span>
              <span>Apr</span>
              <span>Jun</span>
            </div>
          </div>

          {/* Tasks */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[13px] font-semibold text-slate-900">
              Alle meine Aufgaben
            </p>
            <div className="mt-3 flex flex-col gap-2.5">
              {tasks.map((task) => (
                <div key={task.title} className="flex items-start gap-2">
                  {task.done ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#80BA2B]" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                  )}
                  <div className="min-w-0">
                    <p
                      className={`truncate text-[12px] ${
                        task.done
                          ? "text-slate-400 line-through"
                          : "text-slate-700"
                      }`}
                    >
                      {task.title}
                    </p>
                    <span className="text-[10px] text-slate-400">{task.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
