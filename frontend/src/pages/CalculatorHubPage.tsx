import { useNavigate } from "react-router-dom";
import { calculators } from "../data/calculators";

export default function CalculatorHubPage() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute top-1/2 left-10 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        {/* header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <span className="text-lg">🧮</span>
            </div>
            <div>
              <div className="text-sm text-slate-300">Konfiguratoren</div>
              <div className="text-lg font-semibold tracking-tight">Start</div>
            </div>
          </div>

          <button className="rounded-2xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15">
            Einstellungen
          </button>
        </div>

        {/* calculators */}
        <div className="mt-10">
          <div className="text-sm text-slate-300">Kalkulatoren</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">
            Wähle den passenden Konfigurator
          </div>

          <div className="mt-6 grid gap-4">
            {calculators.map((c) => (
              <button
                key={c.type}
                onClick={() => nav(`/k/${c.type}`)}
                className="group text-left rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                      <span className="text-xl">{c.emoji}</span>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{c.title}</div>
                      <div className="mt-1 text-sm text-slate-300">
                        {c.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 group-hover:bg-white/15">
                    Öffnen →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* my calculations placeholder */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <div className="text-sm text-slate-300">Meine Kalkulationen</div>
          <div className="mt-2 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-base font-semibold">
              Noch keine Daten verbunden
            </div>
            <div className="mt-1 text-sm text-slate-300">
              Ovdje ćemo kasnije prikazati listu projekata (lokalno ili iz
              API-ja) sa “Weiter / Duplizieren / PDF”.
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Sanierung Kalkulator • React + Tailwind
        </div>
      </div>
    </div>
  );
}
