import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  { title: "Wohnung", desc: "Fläche, Zimmer, Zustand" },
  { title: "Gewerke", desc: "Boden, Maler, Elektro, Sanitär…" },
  { title: "Details", desc: "Material, Qualität, Extras" },
  { title: "Ergebnis", desc: "Kostenübersicht & PDF" },
];

const quickActions = [
  {
    title: "Neue Kalkulation starten",
    desc: "Schritt für Schritt zur Kostenschätzung",
    badge: "Empfohlen",
  },
  {
    title: "Vorlage auswählen",
    desc: "1-Zimmer, Altbau, Neubau…",
    badge: "Schnellstart",
  },
  {
    title: "Letzte Kalkulation öffnen",
    desc: "Fortsetzen, wo du aufgehört hast",
    badge: "Weiter",
  },
];

export default function StartPage() {
  const nav = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return quickActions;
    return quickActions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute top-1/2 left-10 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <span className="text-lg">🏠</span>
            </div>
            <div>
              <div className="text-sm text-slate-300">Wohnungs-Sanierung</div>
              <div className="text-lg font-semibold tracking-tight">
                Kalkulator
              </div>
            </div>
          </div>

          <button className="rounded-2xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15">
            Einstellungen
          </button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/15">
              <span className="opacity-80">✨</span>
              <span className="text-slate-200">
                Modern. Schnell. Übersichtlich.
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Plane deine Sanierung —
              <span className="block text-slate-300">
                klar, modular und professionell.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-slate-300">
              Erstelle eine realistische Kostenschätzung anhand von Gewerken,
              Qualitätsstufen und Wohnungsdaten. Exportiere am Ende eine saubere
              Übersicht als PDF.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => nav("/wizard")}
                className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-400"
              >
                Neue Kalkulation
              </button>
              <button className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-medium ring-1 ring-white/15 hover:bg-white/15">
                Projekt importieren
              </button>
            </div>

            <div className="mt-8">
              <label className="text-xs text-slate-400">Schnellzugriff</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                <span className="text-slate-400">🔎</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Suchen… (z.B. Vorlage, letzte, neu)"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {filtered.map((a) => (
              <div
                key={a.title}
                className="group rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold">{a.title}</div>
                    <div className="mt-1 text-sm text-slate-300">{a.desc}</div>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 ring-1 ring-white/15">
                    {a.badge}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Öffnet den Assistenten
                  </div>
                  <button
                    onClick={() => nav("/wizard")}
                    className="rounded-2xl bg-white/10 px-4 py-2 text-xs ring-1 ring-white/15 hover:bg-white/15"
                  >
                    Öffnen →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm text-slate-300">Ablauf</div>
              <div className="text-2xl font-semibold tracking-tight">
                In 4 Schritten zur Übersicht
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Später: Projekte, Progress, Autosave
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, idx) => (
              <div
                key={s.title}
                className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Schritt {idx + 1}
                  </div>
                  <div className="grid h-8 w-8 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                    <span className="text-sm">{idx + 1}</span>
                  </div>
                </div>
                <div className="mt-3 text-base font-semibold">{s.title}</div>
                <div className="mt-1 text-sm text-slate-300">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Sanierung Kalkulator • React + Tailwind
        </div>
      </div>
    </div>
  );
}
