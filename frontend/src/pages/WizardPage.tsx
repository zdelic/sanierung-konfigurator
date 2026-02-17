import { useState } from "react";
import StepShell from "../components/Wizard/StepShell";

export default function WizardPage() {
  const [step, setStep] = useState(1);

  return (
    <StepShell
      title={
        step === 1
          ? "Wohnung"
          : step === 2
            ? "Gewerke"
            : step === 3
              ? "Details"
              : "Ergebnis"
      }
      subtitle="Wizard skeleton — uskoro unos stvarnih podataka"
      step={step}
      total={4}
      onBack={() =>
        step === 1 ? window.history.back() : setStep((s) => s - 1)
      }
      onNext={() => setStep((s) => Math.min(4, s + 1))}
      nextLabel={step === 4 ? "Fertig" : "Weiter"}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm text-slate-300">Platzhalter</div>
          <div className="mt-1 text-base font-semibold">
            Hier kommen Felder rein
          </div>
          <div className="mt-2 text-sm text-slate-300">
            zB. Fläche, Zimmer, Zustand… 1000+ Felder pro Gewerke.
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm text-slate-300">Architektur</div>
          <div className="mt-1 text-base font-semibold">State model</div>
          <div className="mt-2 text-sm text-slate-300">
            Im nächsten Schritt fügen wir die Zustand-Store- + Struktur von
            Gewerke ein..
          </div>
        </div>
      </div>
    </StepShell>
  );
}
