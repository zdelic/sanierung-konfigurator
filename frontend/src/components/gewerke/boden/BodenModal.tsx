import Modal from "../../Modal";
import type { ReactNode } from "react";
import { clamp0, formatEUR, type BodenPriceBook } from "./boden.pricebook";
import { calcBodenParts, type BodenState } from "./boden.calc";
import type { AbbruchState } from "../aabbruch/abbruch.calc";

function Switch(props: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => props.onChange(!props.checked)}
      className={[
        "h-7 w-12 rounded-full p-1 ring-1 transition",
        props.checked
          ? "bg-emerald-500/30 ring-emerald-400/30"
          : "bg-white/10 ring-white/15",
      ].join(" ")}
      aria-label="toggle"
    >
      <div
        className={[
          "h-5 w-5 rounded-full bg-white transition",
          props.checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

function Card(props: {
  title: string;
  description?: string;
  checked: boolean;
  price: number;
  onToggle: (v: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold whitespace-pre-line">
            {props.title}
          </div>
          {props.description ? (
            <div className="mt-1 text-xs text-slate-400 whitespace-pre-line">
              {props.description}
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold">{formatEUR(props.price)}</div>
          <Switch checked={props.checked} onChange={props.onToggle} />
        </div>
      </div>
      {props.checked ? <div className="mt-3">{props.children}</div> : null}
    </div>
  );
}

function DepStatus(props: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
      <div className="text-xs text-slate-300">{props.label}</div>
      <div
        className={[
          "text-xs font-semibold",
          props.ok ? "text-emerald-300" : "text-amber-300",
        ].join(" ")}
      >
        {props.ok ? "OK" : "NICHT AUSGEWÄHLT"}
      </div>
    </div>
  );
}

function QtyM2(props: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  const min = props.min ?? 0;

  return (
    <label className="block">
      <div className="text-xs text-slate-400">{props.label}</div>

      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          min={min}
          step={1}
          value={props.value}
          onKeyDown={(e) => {
            // zabrani minus i strelicu dolje
            if (e.key === "-" || e.key === "ArrowDown") {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!Number.isFinite(v)) return;

            // HARD MIN CLAMP
            props.onChange(Math.max(min, v));
          }}
          className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm
                       ring-1 ring-white/10 outline-none focus:ring-white/20"
        />

        <span
          className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1
                           text-[11px] text-slate-200 ring-1 ring-white/15"
        >
          m²
        </span>
      </div>
    </label>
  );
}

function QtyLfm(props: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="text-xs text-slate-400">{props.label}</div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          min={0}
          step={1}
          value={props.value}
          onChange={(e) => props.onChange(clamp0(e.target.value))}
          className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 outline-none focus:ring-white/20"
        />
        <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-200 ring-1 ring-white/15">
          lfm
        </span>
      </div>
    </label>
  );
}

export default function BodenModal(props: {
  open: boolean;
  wohnflaecheM2: number;
  value: BodenState;
  onChange: (next: BodenState) => void;
  onClose: () => void;
  pricebook: BodenPriceBook | null;
  abbruch: AbbruchState;
  onAbbruchChange: (next: AbbruchState) => void;
}) {
  const pb = props.pricebook;
  if (!pb) {
    return (
      <Modal
        open={props.open}
        title="Bodenbeläge"
        subtitle="Preisbuch wird geladen…"
        onClose={props.onClose}
      >
        <div className="p-6 text-slate-300">Loading…</div>
      </Modal>
    );
  }

  const m2 = clamp0(props.wohnflaecheM2);
  const s = props.value;
  const parts = calcBodenParts(m2, s, pb);

  const abbruchBelagSelected = props.abbruch.belagMode !== "off";

  function bumpAbbruchBelag(delta: number) {
    const cur = props.abbruch;
    const nextCount = Math.max(0, (cur.belagAutoCount ?? 0) + delta);

    // manual means: user selected a mode AND it wasn't auto
    const isManual = cur.belagMode !== "off" && cur.belagSource !== "auto";

    let belagMode = cur.belagMode;
    let belagSource = cur.belagSource ?? null;

    // auto ON
    if (nextCount > 0 && belagMode === "off" && !isManual) {
      belagMode = "voll";
      belagSource = "auto";
    }

    // auto OFF (only if auto)
    if (nextCount === 0 && belagMode !== "off" && belagSource === "auto") {
      belagMode = "off";
      belagSource = null;
    }

    props.onAbbruchChange({
      ...cur,
      belagAutoCount: nextCount,
      belagMode,
      belagSource,
    });
  }

  function DepBox(currentAccepted: boolean, onAccept: (v: boolean) => void) {
    return (
      <div className="rounded-2xl bg-amber-500/10 p-4 ring-1 ring-amber-400/30">
        <div className="text-sm font-semibold text-amber-200">
          Mit dieser Auswahl müssen Sie die folgenden Positionen auswählen:
        </div>

        <div className="mt-3 grid gap-2">
          <DepStatus ok={abbruchBelagSelected} label="Abbruch Belag" />
        </div>

        <label className="mt-4 flex items-start gap-3">
          <input
            type="checkbox"
            checked={currentAccepted}
            onChange={(e) => {
              const checked = e.target.checked;
              onAccept(checked);

              if (checked) {
                bumpAbbruchBelag(+1);
              } else {
                bumpAbbruchBelag(-1);
              }
            }}
            className="mt-1 h-4 w-4"
          />
          <div className="text-xs text-amber-200 whitespace-pre-line">
            {`Ich bestätige, dass die notwendige Abbruch-Position ausgewählt wird.
Beim Akzeptieren wird "Abbruch Belag" (falls nicht ausgewählt) automatisch aktiviert.`}
          </div>
        </label>

        {!currentAccepted ? (
          <div className="mt-3 text-xs text-amber-200">
            Preis wird erst nach Akzeptieren berechnet.
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Modal
      open={props.open}
      title="Bodenbeläge"
      subtitle={`Wohnfläche (global): ${m2} m²`}
      onClose={props.onClose}
      headerRight={
        <div className="text-right">
          <div className="text-xs text-slate-400">Gesamt</div>
          <div className="text-lg font-semibold text-emerald-400">
            {formatEUR(parts.total)}
          </div>
        </div>
      }
    >
      <div className="grid gap-5">
        {/* Note */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-xs text-slate-400">Zusätzliche Anmerkung</div>
          <textarea
            value={s.note}
            onChange={(e) => props.onChange({ ...s, note: e.target.value })}
            className="mt-2 min-h-[90px] w-full resize-y rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 outline-none placeholder:text-slate-500 focus:ring-white/20"
            placeholder="..."
          />
        </div>

        {/* Bestand info */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">{pb.bestand.title}</div>
          <div className="mt-1 text-xs text-slate-400 whitespace-pre-line">
            {pb.bestand.description}
          </div>
        </div>

        {/* Bestand Teppich/Laminat/Parkett */}
        <Card
          title={pb.bestand_teppich.title}
          checked={s.bestandTeppichOn}
          price={parts.bestandTeppich}
          onToggle={(v) => props.onChange({ ...s, bestandTeppichOn: v })}
        />
        <Card
          title={pb.bestand_laminat.title}
          checked={s.bestandLaminatOn}
          price={parts.bestandLaminat}
          onToggle={(v) => props.onChange({ ...s, bestandLaminatOn: v })}
        />
        <Card
          title={pb.bestand_parkett.title}
          checked={s.bestandParkettOn}
          price={parts.bestandParkett}
          onToggle={(v) => props.onChange({ ...s, bestandParkettOn: v })}
        />

        {/* Teilflächen Parkett */}
        <Card
          title={pb.teil_sanierung_parkett.title}
          checked={s.teilParkettOn}
          price={parts.teilParkett}
          onToggle={(v) =>
            props.onChange({
              ...s,
              teilParkettOn: v,
              teilParkettM2: v ? Math.max(10, Number(s.teilParkettM2 || 0)) : 0,
            })
          }
        >
          <QtyM2
            label="Teilfläche (min. 10 m²)"
            value={s.teilParkettM2}
            min={10}
            onChange={(v) => props.onChange({ ...s, teilParkettM2: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Grundpreis {formatEUR(pb.teil_sanierung_parkett.base)} +{" "}
            {pb.teil_sanierung_parkett.ratePerM2.toFixed(2)} €/m²
          </div>
        </Card>

        {/* Neu Teppich */}
        <Card
          title={pb.neu_teppich.title}
          description={`Mit dieser Auswahl müssen Sie die folgenden Positionen auswählen: Abbruch Belag`}
          checked={s.neuTeppichOn}
          price={parts.neuTeppich}
          onToggle={(v) => {
            // If turning OFF and deps were accepted, release Abbruch Belag
            if (!v && s.neuTeppichDepsAccepted) bumpAbbruchBelag(-1);

            props.onChange({
              ...s,
              neuTeppichOn: v,
              neuTeppichDepsAccepted: v ? s.neuTeppichDepsAccepted : false,
            });
          }}
        >
          {DepBox(s.neuTeppichDepsAccepted, (v) =>
            props.onChange({ ...s, neuTeppichDepsAccepted: v }),
          )}
        </Card>

        {/* Einzelflächen Teppich */}
        <Card
          title={pb.einzel_teppich.title}
          checked={s.einzelTeppichOn}
          price={parts.einzelTeppich}
          onToggle={(v) =>
            props.onChange({
              ...s,
              einzelTeppichOn: v,
              einzelTeppichM2: v ? 10 : 0,
            })
          }
        >
          <QtyM2
            label="Teilfläche"
            value={s.einzelTeppichM2}
            min={10}
            onChange={(v) => props.onChange({ ...s, einzelTeppichM2: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Grundpreis {formatEUR(pb.einzel_teppich.base)} +{" "}
            {pb.einzel_teppich.ratePerM2.toFixed(2)} €/m²
          </div>
        </Card>

        {/* Neu Laminat */}
        <Card
          title={pb.neu_laminat.title}
          description={`Mit dieser Auswahl müssen Sie die folgenden Positionen auswählen: Abbruch Belag`}
          checked={s.neuLaminatOn}
          price={parts.neuLaminat}
          onToggle={(v) => {
            if (!v && s.neuLaminatDepsAccepted) bumpAbbruchBelag(-1);

            props.onChange({
              ...s,
              neuLaminatOn: v,
              neuLaminatDepsAccepted: v ? s.neuLaminatDepsAccepted : false,
            });
          }}
        >
          {DepBox(s.neuLaminatDepsAccepted, (v) =>
            props.onChange({ ...s, neuLaminatDepsAccepted: v }),
          )}

          <div className="mt-4">
            <Card
              title={pb.aufz_antidroe.title}
              description={pb.aufz_antidroe.title}
              checked={s.antidroeNeuLaminatOn}
              price={parts.antidroeNeuLaminat}
              onToggle={(v) =>
                props.onChange({ ...s, antidroeNeuLaminatOn: v })
              }
            />
          </div>
        </Card>

        {/* Einzelflächen Laminat */}
        <Card
          title={pb.einzel_laminat.title}
          checked={s.einzelLaminatOn}
          price={parts.einzelLaminat + parts.antidroeEinzelLaminat}
          onToggle={(v) =>
            props.onChange({
              ...s,
              einzelLaminatOn: v,
              einzelLaminatM2: v ? 10 : 0,
              antidroeEinzelLaminatOn: v ? s.antidroeEinzelLaminatOn : false,
            })
          }
        >
          <QtyM2
            label="Teilfläche"
            value={s.einzelLaminatM2}
            min={10}
            onChange={(v) => props.onChange({ ...s, einzelLaminatM2: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Grundpreis {formatEUR(pb.einzel_laminat.base)} +{" "}
            {pb.einzel_laminat.ratePerM2.toFixed(2)} €/m²
          </div>

          <div className="mt-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">
                {pb.aufz_antidroe_einzel_laminat.title}
              </div>
              <Switch
                checked={s.antidroeEinzelLaminatOn}
                onChange={(v) =>
                  props.onChange({ ...s, antidroeEinzelLaminatOn: v })
                }
              />
            </div>
            <div className="mt-2 text-xs text-slate-400">
              {pb.aufz_antidroe_einzel_laminat.ratePerM2.toFixed(2)} €/m²
            </div>
          </div>
        </Card>

        {/* Neu Parkett */}
        <Card
          title={pb.neu_parkett.title}
          description={`Mit dieser Auswahl müssen Sie die folgenden Positionen auswählen: Abbruch Belag`}
          checked={s.neuParkettOn}
          price={parts.neuParkett}
          onToggle={(v) => {
            if (!v && s.neuParkettDepsAccepted) bumpAbbruchBelag(-1);

            props.onChange({
              ...s,
              neuParkettOn: v,
              neuParkettDepsAccepted: v ? s.neuParkettDepsAccepted : false,
            });
          }}
        >
          {DepBox(s.neuParkettDepsAccepted, (v) =>
            props.onChange({ ...s, neuParkettDepsAccepted: v }),
          )}
        </Card>

        {/* Einzelflächen Parkett */}
        <Card
          title={pb.einzel_parkett.title}
          checked={s.einzelParkettOn}
          price={parts.einzelParkett}
          onToggle={(v) =>
            props.onChange({
              ...s,
              einzelParkettOn: v,
              einzelParkettM2: v ? s.einzelParkettM2 : 0,
            })
          }
        >
          <QtyM2
            label="Teilfläche"
            value={s.einzelParkettM2}
            onChange={(v) => props.onChange({ ...s, einzelParkettM2: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Grundpreis {formatEUR(pb.einzel_parkett.base)} +{" "}
            {pb.einzel_parkett.ratePerM2.toFixed(2)} €/m²
          </div>
        </Card>

        {/* Aufzahlung Fischgrät */}
        <Card
          title={pb.aufz_fischgraet.title}
          checked={s.fischgraetOn}
          price={parts.fischgraet}
          onToggle={(v) =>
            props.onChange({
              ...s,
              fischgraetOn: v,
              fischgraetM2: v ? s.fischgraetM2 : 0,
            })
          }
        >
          <QtyM2
            label="Menge"
            value={s.fischgraetM2}
            onChange={(v) => props.onChange({ ...s, fischgraetM2: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Grundpreis {formatEUR(pb.aufz_fischgraet.base)} +{" "}
            {pb.aufz_fischgraet.ratePerM2.toFixed(2)} €/m²
          </div>
        </Card>

        {/* Aufzahlung verlegen & versiegeln */}
        <Card
          title={pb.aufz_verlegen_versiegeln.title}
          checked={s.verlegenVersiegelnOn}
          price={parts.verlegenVersiegeln}
          onToggle={(v) =>
            props.onChange({
              ...s,
              verlegenVersiegelnOn: v,
              verlegenVersiegelnM2: v ? s.verlegenVersiegelnM2 : 0,
            })
          }
        >
          <QtyM2
            label="Menge"
            value={s.verlegenVersiegelnM2}
            onChange={(v) => props.onChange({ ...s, verlegenVersiegelnM2: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            {pb.aufz_verlegen_versiegeln.ratePerM2.toFixed(2)} €/m²
          </div>
        </Card>

        {/* Mauerfries */}
        <Card
          title={pb.mauerfries.title}
          checked={s.mauerfriesOn}
          price={parts.mauerfries}
          onToggle={(v) =>
            props.onChange({
              ...s,
              mauerfriesOn: v,
              mauerfriesLfm: v ? s.mauerfriesLfm : 0,
            })
          }
        >
          <QtyLfm
            label="Laufmeter"
            value={s.mauerfriesLfm}
            onChange={(v) => props.onChange({ ...s, mauerfriesLfm: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            {pb.mauerfries.ratePerLfm.toFixed(2)} €/lfm
          </div>
        </Card>

        {/* Total */}
        {/* <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">Summe Bodenbeläge</div>
            <div className="text-lg font-semibold">
              {formatEUR(parts.total)}
            </div>
          </div>
        </div> */}
      </div>
    </Modal>
  );
}
