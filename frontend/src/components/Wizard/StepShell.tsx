import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export default function StepShell(props: {
  title: string;
  subtitle?: string;
  step: number;
  total: number;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
}) {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => (props.onBack ? props.onBack() : nav("/"))}
            className="rounded-2xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15"
          >
            ← Zurück
          </button>

          <div className="text-sm text-slate-300">
            Schritt {props.step} / {props.total}
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="text-2xl font-semibold">{props.title}</div>
          {props.subtitle ? (
            <div className="mt-1 text-sm text-slate-300">{props.subtitle}</div>
          ) : null}

          <div className="mt-6">{props.children}</div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={() => (props.onBack ? props.onBack() : nav("/"))}
              className="rounded-2xl bg-white/10 px-5 py-3 text-sm ring-1 ring-white/15 hover:bg-white/15"
            >
              Zurück
            </button>
            <button
              onClick={props.onNext}
              className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-50"
              disabled={!props.onNext}
            >
              {props.nextLabel ?? "Weiter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
