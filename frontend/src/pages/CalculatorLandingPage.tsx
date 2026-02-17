import { useNavigate, useParams } from "react-router-dom";
import type { CalculatorType } from "../data/calculators";
import { calculators } from "../data/calculators";

export default function CalculatorLandingPage() {
  const nav = useNavigate();
  const { type } = useParams();

  const calc = calculators.find((c) => c.type === (type as CalculatorType));

  if (!calc) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center px-6">
        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          Unbekannter Konfigurator.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <button
          onClick={() => nav("/")}
          className="rounded-2xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15"
        >
          ← Zur Liste
        </button>

        <div className="mt-8 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-sm text-slate-300">Konfigurator</div>
          <div className="mt-2 text-2xl font-semibold">{calc.title}</div>
          <div className="mt-2 text-slate-300">{calc.subtitle}</div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => nav(`/k/${calc.type}/wizard`)}
              className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-400"
            >
              Neue Kalkulation
            </button>
            <button
              onClick={() => nav("/")}
              className="rounded-2xl bg-white/10 px-5 py-3 text-sm ring-1 ring-white/15 hover:bg-white/15"
            >
              Meine Kalkulationen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
