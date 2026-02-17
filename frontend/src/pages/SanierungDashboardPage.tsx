import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AbbruchModal from "../components/gewerke/aabbruch/AbbruchModal";
import {
  DEFAULT_ABBRUCH_STATE,
  calcAbbruchTotal,
  type AbbruchState,
} from "../components/gewerke/aabbruch/abbruch.calc";

import BMSTModal from "../components/gewerke/bmst/BMSTModal";
import {
  DEFAULT_BMST_STATE,
  calcBMSTTotal,
  type BMSTState,
} from "../components/gewerke/bmst/bmst.calc";

import TrockenbauModal from "../components/gewerke/trockenbau/TrockenbauModal";
import {
  DEFAULT_TROCKENBAU_STATE,
  calcTrockenbauTotal,
  type TrockenbauState,
} from "../components/gewerke/trockenbau/trockenbau.calc";

import EstrichModal from "../components/gewerke/estrich/EstrichModal";
import {
  DEFAULT_ESTRICH_STATE,
  calcEstrichTotal,
  type EstrichState,
} from "../components/gewerke/estrich/estrich.calc";

import FliesenModal from "../components/gewerke/fliesen/FliesenModal";
import {
  DEFAULT_FLIESEN_STATE,
  calcFliesenTotal,
  type FliesenState,
} from "../components/gewerke/fliesen/fliesen.calc";

import TischlerModal from "../components/gewerke/tischler/TischlerModal";
import {
  DEFAULT_TISCHLER_STATE,
  calcTischlerTotal,
  type TischlerState,
} from "../components/gewerke/tischler/tischler.calc";

import BodenModal from "../components/gewerke/boden/BodenModal";
import {
  DEFAULT_BODEN_STATE,
  calcBodenTotal,
  type BodenState,
} from "../components/gewerke/boden/boden.calc";

import MalerModal from "../components/gewerke/maler/MalerModal";
import {
  DEFAULT_MALER_STATE,
  calcMalerTotal,
  type MalerState,
} from "../components/gewerke/maler/maler.calc";

import FensterModal from "../components/gewerke/fenster/FensterModal";
import {
  DEFAULT_FENSTER_STATE,
  calcFensterTotal,
  type FensterState,
} from "../components/gewerke/fenster/fenster.calc";

import BalkonModal from "../components/gewerke/balkon/BalkonModal";
import {
  DEFAULT_BALKON_STATE,
  calcBalkonTotal,
  type BalkonState,
} from "../components/gewerke/balkon/balkon.calc";

import ElektroModal from "../components/gewerke/elektro/ElektroModal";
import {
  DEFAULT_ELEKTRO_STATE,
  calcElektroTotal,
  type ElektroState,
} from "../components/gewerke/elektro/elektro.calc";

import HaustechnikModal from "../components/gewerke/haustechnik/HaustechnikModal";
import {
  DEFAULT_HAUSTECHNIK_STATE,
  calcHaustechnikTotal,
  type HaustechnikState,
} from "../components/gewerke/haustechnik/haustechnik.calc";

import ReinigungModal from "../components/gewerke/reinigung/ReinigungModal";
import {
  DEFAULT_REINIGUNG_STATE,
  calcReinigungTotal,
  type ReinigungState,
} from "../components/gewerke/reinigung/reinigung.calc";

// Ako već imaš Abbruch modal/state u ovom fajlu, samo zadrži.
// Ovdje je fokus: global m² + PLZ + BGK + PLZ Zuschlag + prikaz samo >0.

type GewerkKey =
  | "abbruch"
  | "bmst"
  | "trockenbau"
  | "estrich"
  | "boden"
  | "fliesen"
  | "tischler"
  | "maler"
  | "fenster"
  | "elektro"
  | "haustechnik"
  | "balkon"
  | "reinigung";

type Gewerk = {
  key: GewerkKey;
  title: string;
  subtitle: string;
  emoji: string;
};

const GEWERKE: Gewerk[] = [
  {
    key: "abbruch",
    title: "Abbruch",
    subtitle: "Beläge • Estrich • Türen • Teilabbruch",
    emoji: "🧨",
  },
  {
    key: "bmst",
    title: "Baumeisterarbeiten",
    subtitle: "Tragende Durchbrüche • Statik",
    emoji: "🧰",
  },
  {
    key: "trockenbau",
    title: "Trockenbauarbeiten",
    subtitle: "Wände • Decken • Vorsatzschalen • Revisionen",
    emoji: "🧱",
  },
  {
    key: "estrich",
    title: "Estrich",
    subtitle: "Neuherstellung • Teilleistungen • Aufzahlungen",
    emoji: "🧱",
  },
  {
    key: "fliesen",
    title: "Fliesen",
    subtitle: "Bestand • Neuverfliesung • Einzelflächen",
    emoji: "🧩",
  },
  {
    key: "tischler",
    title: "Tischler",
    subtitle: "Türen • Zargen • Instandsetzungen",
    emoji: "🪚",
  },
  {
    key: "boden",
    title: "Bodenbeläge",
    subtitle: "Parkett • Laminat • Tepich • Aufzahlungen",
    emoji: "🪵",
  },
  {
    key: "maler",
    title: "Malerarbeiten",
    subtitle: "Bestand • Verputz • Spachtel • Malerei",
    emoji: "🎨",
  },
  {
    key: "fenster",
    title: "Fenster",
    subtitle: "Sanierung • Fenster-Konfigurator • Sonnenschutz",
    emoji: "🪟",
  },
  {
    key: "balkon",
    title: "Balkon",
    subtitle: "Sanierung • Abdichtung • Beläge",
    emoji: "🏗️",
  },
  {
    key: "elektro",
    title: "Elektro",
    subtitle: "Leitungen • Schalter • Verteiler",
    emoji: "⚡",
  },
  {
    key: "haustechnik",
    title: "Haustechnik",
    subtitle: "Heizung • Lüftung • Sanitär • Gas",
    emoji: "🚿",
  },
  {
    key: "reinigung",
    title: "Reinigung",
    subtitle: "Bauendreinigung",
    emoji: "🧽",
  },
];

function formatEUR(value: number) {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** BGK tier (paušal po m²) */
function calcBGK(m2: number) {
  if (m2 <= 50) return 697.27;
  if (m2 <= 60) return 833.8;
  if (m2 <= 80) return 866.71;
  if (m2 <= 90) return 971.54;
  return 1076.38;
}

/** PLZ Zuschlag (1010–1099): €/m² * m² */
function calcPlzZuschlag(m2: number, plz: number) {
  const isCentralVienna = plz >= 1010 && plz <= 1099;
  if (!isCentralVienna) return 0;
  const rate = m2 <= 60 ? 65 : 31;
  return round2(rate * m2);
}

export default function SanierungDashboardPage() {
  const nav = useNavigate();

  // --- MODAL STATES ---
  const [abbruchOpen, setAbbruchOpen] = useState(false);
  const [abbruch, setAbbruch] = useState<AbbruchState>(DEFAULT_ABBRUCH_STATE);

  const [bmstOpen, setBmstOpen] = useState(false);
  const [bmst, setBmst] = useState<BMSTState>(DEFAULT_BMST_STATE);

  const [trockenbauOpen, setTrockenbauOpen] = useState(false);
  const [trockenbau, setTrockenbau] = useState<TrockenbauState>(
    DEFAULT_TROCKENBAU_STATE,
  );

  const [estrichOpen, setEstrichOpen] = useState(false);
  const [estrich, setEstrich] = useState<EstrichState>(DEFAULT_ESTRICH_STATE);

  const [fliesenOpen, setFliesenOpen] = useState(false);
  const [fliesen, setFliesen] = useState<FliesenState>(DEFAULT_FLIESEN_STATE);

  const [tischlerOpen, setTischlerOpen] = useState(false);
  const [tischler, setTischler] = useState<TischlerState>(
    DEFAULT_TISCHLER_STATE,
  );

  const [bodenOpen, setBodenOpen] = useState(false);
  const [boden, setBoden] = useState<BodenState>(DEFAULT_BODEN_STATE);

  const [malerOpen, setMalerOpen] = useState(false);
  const [maler, setMaler] = useState<MalerState>(DEFAULT_MALER_STATE);

  const [fensterOpen, setFensterOpen] = useState(false);
  const [fenster, setFenster] = useState<FensterState>(DEFAULT_FENSTER_STATE);

  const [balkonOpen, setBalkonOpen] = useState(false);
  const [balkon, setBalkon] = useState<BalkonState>(DEFAULT_BALKON_STATE);

  const [elektroOpen, setElektroOpen] = useState(false);
  const [elektro, setElektro] = useState<ElektroState>(DEFAULT_ELEKTRO_STATE);

  const [haustechnikOpen, setHaustechnikOpen] = useState(false);
  const [haustechnik, setHaustechnik] = useState<HaustechnikState>(
    DEFAULT_HAUSTECHNIK_STATE,
  );

  const [reinigungOpen, setReinigungOpen] = useState(false);
  const [reinigung, setReinigung] = useState<ReinigungState>(
    DEFAULT_REINIGUNG_STATE,
  );

  // --- PROJECT META ---
  const [project, setProject] = useState({
    projectName: "Sanierung Projekt",
    address: "Musterstraße 12, 1010 Wien",
    customer: "Max Mustermann",
    createdAt: new Date().toISOString().slice(0, 10),
    note: "",
    wohnflaecheM2: 60,
    plz: 1010,
  });

  const m2 = Number(project.wohnflaecheM2 || 0);
  const plz = Number(project.plz || 0);

  // --- TOTALS ---
  const totals = useMemo(() => {
    const base: Record<GewerkKey, number> = {
      abbruch: calcAbbruchTotal(m2, abbruch),
      bmst: calcBMSTTotal(bmst),
      trockenbau: calcTrockenbauTotal(trockenbau),

      // ako Estrich/Fliesen/Tischler/Boden koriste global m²:
      estrich: calcEstrichTotal(m2, estrich),
      fliesen: calcFliesenTotal(m2, fliesen),
      tischler: calcTischlerTotal(m2, tischler),
      boden: calcBodenTotal(m2, boden),
      maler: calcMalerTotal(m2, maler),
      fenster: calcFensterTotal(m2, fenster),
      elektro: calcElektroTotal(m2, elektro),
      haustechnik: calcHaustechnikTotal(m2, haustechnik),
      balkon: calcBalkonTotal(m2, balkon),
      reinigung: calcReinigungTotal(m2, reinigung),
    };
    return base;
  }, [
    m2,
    abbruch,
    bmst,
    trockenbau,
    estrich,
    fliesen,
    tischler,
    boden,
    maler,
    fenster,
    balkon,
    elektro,
    haustechnik,
    reinigung,
  ]);

  const bgk = calcBGK(m2);
  const plzZuschlag = calcPlzZuschlag(m2, plz);
  const overheadTotal = round2(bgk + plzZuschlag);

  const gewerkeSum = Object.values(totals).reduce(
    (sum, v) => sum + (v ?? 0),
    0,
  );
  const grandTotal = round2(gewerkeSum + overheadTotal);

  const activeGewerke = GEWERKE.filter((g) => (totals[g.key] ?? 0) > 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute top-1/2 left-10 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        {/* top bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => nav("/")}
            className="rounded-2xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15"
          >
            ← Konfiguratoren
          </button>

          <button className="rounded-2xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15">
            Einstellungen
          </button>
        </div>

        {/* header + project meta */}
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-slate-300">
                  Sanierungs-Konfigurator
                </div>
                <div className="mt-1 text-2xl font-semibold tracking-tight">
                  {project.projectName}
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  {project.address}
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15">
                Gesamt:{" "}
                <span className="font-semibold">{formatEUR(grandTotal)}</span>
              </div>
            </div>

            {/* project fields */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="Kunde"
                value={project.customer}
                onChange={(v) => setProject((p) => ({ ...p, customer: v }))}
              />
              <Field
                label="Datum"
                value={project.createdAt}
                onChange={(v) => setProject((p) => ({ ...p, createdAt: v }))}
              />
              <Field
                label="Adresse"
                value={project.address}
                onChange={(v) => setProject((p) => ({ ...p, address: v }))}
                className="sm:col-span-2"
              />

              <NumberField
                label="Wohnfläche (m²)"
                value={project.wohnflaecheM2}
                onChange={(v) =>
                  setProject((p) => ({ ...p, wohnflaecheM2: v }))
                }
              />
              <NumberField
                label="PLZ"
                value={project.plz}
                onChange={(v) => setProject((p) => ({ ...p, plz: v }))}
              />

              <Field
                label="Notiz"
                value={project.note}
                onChange={(v) => setProject((p) => ({ ...p, note: v }))}
                className="sm:col-span-2"
              />
            </div>

            {/* Overhead preview */}
            <div className="mt-6 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-sm font-semibold">Fixe Projektkosten</div>
              <div className="mt-3 space-y-2 text-sm">
                <Row label="Baustellengemeinkosten" value={formatEUR(bgk)} />
                <Row
                  label={`PLZ-Zuschlag ${plz >= 1010 && plz <= 1099 ? "(Für Wien 1010-1099)" : "(nicht aktiv)"}`}
                  value={formatEUR(plzZuschlag)}
                />
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-slate-300">Summe Fixkosten</span>
                  <span className="font-semibold">
                    {formatEUR(overheadTotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => nav("/k/sanierung/wizard")}
                className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-400"
              >
                Zur Kalkulation (Wizard)
              </button>
              <button className="rounded-2xl bg-white/10 px-5 py-3 text-sm ring-1 ring-white/15 hover:bg-white/15">
                PDF Export (später)
              </button>
            </div>
          </div>

          {/* quick summary */}
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-sm text-slate-300">Übersicht</div>
            <div className="mt-2 text-base font-semibold">
              Positionen mit Preis
            </div>

            <div className="mt-3 space-y-2">
              <div className="text-xs text-slate-400 pt-1">
                Fixe Projektkosten
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-200">BGK</span>
                <span className="text-slate-300">{formatEUR(bgk)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-200">PLZ Zuschlag</span>
                <span className="text-slate-300">{formatEUR(plzZuschlag)}</span>
              </div>

              <div className="text-xs text-slate-400 pt-4">
                Gewerke (nur {" > "}0)
              </div>
              {activeGewerke.slice(0, 8).map((g) => (
                <div
                  key={g.key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-200">{g.title}</span>
                  <span className="text-slate-300">
                    {formatEUR(totals[g.key] ?? 0)}
                  </span>
                </div>
              ))}

              <div className="pt-3 border-t border-white/10 text-sm flex items-center justify-between">
                <span className="text-slate-300">Gesamt</span>
                <span className="font-semibold">{formatEUR(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* gewerke grid */}
        <div className="mt-10">
          <div className="text-sm text-slate-300">Gewerke</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">
            Öffne ein Gewerk zur Bearbeitung
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GEWERKE.map((g) => {
              const total = totals[g.key] ?? 0;
              const showAsActive = total > 0;

              return (
                <button
                  key={g.key}
                  onClick={() => {
                    if (g.key === "abbruch") setAbbruchOpen(true);
                    if (g.key === "bmst") setBmstOpen(true);
                    if (g.key === "trockenbau") setTrockenbauOpen(true);
                    if (g.key === "estrich") setEstrichOpen(true);
                    if (g.key === "fliesen") setFliesenOpen(true);
                    if (g.key === "tischler") setTischlerOpen(true);
                    if (g.key === "boden") setBodenOpen(true);
                    if (g.key === "maler") setMalerOpen(true);
                    if (g.key === "fenster") setFensterOpen(true);
                    if (g.key === "balkon") setBalkonOpen(true);
                    if (g.key === "elektro") setElektroOpen(true);
                    if (g.key === "haustechnik") setHaustechnikOpen(true);
                    if (g.key === "reinigung") setReinigungOpen(true);
                  }}
                  className={[
                    "text-left rounded-3xl p-5 ring-1 backdrop-blur transition",
                    showAsActive
                      ? "bg-white/10 ring-white/15 hover:bg-white/15"
                      : "bg-white/5 ring-white/10 hover:bg-white/10",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                        <span className="text-lg">{g.emoji}</span>
                      </div>
                      <div>
                        <div className="text-base font-semibold">{g.title}</div>
                        <div className="mt-1 text-sm text-slate-300">
                          {g.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400">
                        {showAsActive ? "hat Preis" : "0,00"}
                      </div>
                      <div className="mt-1 text-sm font-semibold">
                        {formatEUR(total)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      {showAsActive
                        ? "In Übersicht sichtbar"
                        : "Wird oben nicht angezeigt"}
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-2 text-xs ring-1 ring-white/15">
                      Öffnen →
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <AbbruchModal
            open={abbruchOpen}
            wohnflaecheM2={m2}
            value={abbruch}
            onChange={setAbbruch}
            onClose={() => setAbbruchOpen(false)}
          />

          <BMSTModal
            open={bmstOpen}
            value={bmst}
            onChange={setBmst}
            onClose={() => setBmstOpen(false)}
          />
          <TrockenbauModal
            open={trockenbauOpen}
            value={trockenbau}
            onChange={setTrockenbau}
            onClose={() => setTrockenbauOpen(false)}
          />
          <EstrichModal
            open={estrichOpen}
            wohnflaecheM2={m2}
            value={estrich}
            onChange={setEstrich}
            onClose={() => setEstrichOpen(false)}
            abbruch={abbruch}
            onAbbruchChange={setAbbruch}
          />
          <FliesenModal
            open={fliesenOpen}
            wohnflaecheM2={m2}
            value={fliesen}
            onChange={setFliesen}
            onClose={() => setFliesenOpen(false)}
            abbruch={abbruch}
            onAbbruchChange={setAbbruch}
          />
          <TischlerModal
            open={tischlerOpen}
            wohnflaecheM2={m2}
            value={tischler}
            onChange={setTischler}
            onClose={() => setTischlerOpen(false)}
            abbruch={abbruch}
            onAbbruchChange={setAbbruch}
          />
          <BodenModal
            open={bodenOpen}
            wohnflaecheM2={m2}
            value={boden}
            onChange={setBoden}
            onClose={() => setBodenOpen(false)}
            abbruch={abbruch}
            onAbbruchChange={setAbbruch}
          />
          <MalerModal
            open={malerOpen}
            wohnflaecheM2={m2}
            value={maler}
            onChange={setMaler}
            onClose={() => setMalerOpen(false)}
          />
          <FensterModal
            open={fensterOpen}
            wohnflaecheM2={m2}
            value={fenster}
            onChange={setFenster}
            onClose={() => setFensterOpen(false)}
          />
          <BalkonModal
            open={balkonOpen}
            wohnflaecheM2={m2}
            value={balkon}
            onChange={setBalkon}
            onClose={() => setBalkonOpen(false)}
          />
          <ElektroModal
            open={elektroOpen}
            wohnflaecheM2={m2}
            value={elektro}
            onChange={setElektro}
            onClose={() => setElektroOpen(false)}
          />
          <HaustechnikModal
            open={haustechnikOpen}
            wohnflaecheM2={m2}
            value={haustechnik}
            onChange={setHaustechnik}
            abbruch={abbruch}
            onAbbruchChange={setAbbruch}
            boden={boden}
            onBodenChange={setBoden}
            fliesen={fliesen}
            onFliesenChange={setFliesen}
            estrich={estrich}
            onEstrichChange={setEstrich}
            onClose={() => setHaustechnikOpen(false)}
          />
          <ReinigungModal
            open={reinigungOpen}
            wohnflaecheM2={m2}
            value={reinigung}
            onChange={setReinigung}
            onClose={() => setReinigungOpen(false)}
          />
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Sanierung Kalkulator • React + Tailwind
        </div>
      </div>

      {/* ✅ Abbruch Modal (render!) */}
      <AbbruchModal
        open={abbruchOpen}
        wohnflaecheM2={m2}
        value={abbruch}
        onChange={setAbbruch}
        onClose={() => setAbbruchOpen(false)}
      />
    </div>
  );
}

function Row(props: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-200">{props.label}</span>
      <span className="text-slate-300">{props.value}</span>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={props.className ?? ""}>
      <div className="text-xs text-slate-400">{props.label}</div>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 outline-none placeholder:text-slate-500 focus:ring-white/20"
        placeholder={props.label}
      />
    </div>
  );
}

function NumberField(props: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  return (
    <div className={props.className ?? ""}>
      <div className="text-xs text-slate-400">{props.label}</div>
      <input
        type="number"
        min={0}
        step={1}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value || 0))}
        className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 outline-none placeholder:text-slate-500 focus:ring-white/20"
        placeholder={props.label}
      />
    </div>
  );
}
