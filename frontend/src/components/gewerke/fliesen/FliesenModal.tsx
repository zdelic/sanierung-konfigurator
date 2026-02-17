import Modal from "../../Modal";
import { FLIESEN_PRICEBOOK, clamp0, formatEUR } from "./fliesen.pricebook";
import { calcFliesenParts, type FliesenState } from "./fliesen.calc";
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
  children?: React.ReactNode;
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
}) {
  return (
    <label className="block">
      <div className="text-xs text-slate-400">{props.label}</div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          min={0}
          step={0.1}
          value={props.value}
          onChange={(e) => props.onChange(clamp0(e.target.value))}
          className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 outline-none focus:ring-white/20"
        />
        <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-200 ring-1 ring-white/15">
          m²
        </span>
      </div>
    </label>
  );
}

export default function FliesenModal(props: {
  open: boolean;
  wohnflaecheM2: number;
  value: FliesenState;
  onChange: (next: FliesenState) => void;
  onClose: () => void;

  // dependency
  abbruch: AbbruchState;
  onAbbruchChange: (next: AbbruchState) => void;
}) {
  const m2 = clamp0(props.wohnflaecheM2);
  const s = props.value;
  const parts = calcFliesenParts(m2, s);

  const abbruchBelagSelected = props.abbruch.belagMode !== "off";

  function ensureAbbruchBelag() {
    if (abbruchBelagSelected) return;
    props.onAbbruchChange({ ...props.abbruch, belagMode: "voll" });
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
              if (checked) ensureAbbruchBelag();
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
      title="Fliesen"
      subtitle={`Wohnfläche (global): ${m2} m²`}
      onClose={props.onClose}
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

        {/* Bestand */}
        <Card
          title={FLIESEN_PRICEBOOK.bestand.title}
          description={FLIESEN_PRICEBOOK.bestand.description}
          checked={s.bestandOn}
          price={parts.bestand}
          onToggle={(v) => props.onChange({ ...s, bestandOn: v })}
        />

        {/* Neu Bad/WC (dependency Abbruch Belag) */}
        <Card
          title={FLIESEN_PRICEBOOK.neuBadWc.title}
          description={FLIESEN_PRICEBOOK.neuBadWc.description}
          checked={s.neuBadWcOn}
          price={parts.neuBadWc}
          onToggle={(v) =>
            props.onChange({
              ...s,
              neuBadWcOn: v,
              neuBadWcDepsAccepted: v ? s.neuBadWcDepsAccepted : false,
            })
          }
        >
          {DepBox(s.neuBadWcDepsAccepted, (v) =>
            props.onChange({ ...s, neuBadWcDepsAccepted: v }),
          )}
        </Card>

        {/* Neu VR+Kü (dependency Abbruch Belag) */}
        <Card
          title={FLIESEN_PRICEBOOK.neuVrkue.title}
          description={FLIESEN_PRICEBOOK.neuVrkue.description}
          checked={s.neuVrkueOn}
          price={parts.neuVrkue}
          onToggle={(v) =>
            props.onChange({
              ...s,
              neuVrkueOn: v,
              neuVrkueDepsAccepted: v ? s.neuVrkueDepsAccepted : false,
            })
          }
        >
          {DepBox(s.neuVrkueDepsAccepted, (v) =>
            props.onChange({ ...s, neuVrkueDepsAccepted: v }),
          )}
        </Card>

        {/* Einzelflächen */}
        <Card
          title={FLIESEN_PRICEBOOK.einzelflaechen.title}
          checked={s.einzelflaechenOn}
          price={parts.einzelflaechen}
          onToggle={(v) =>
            props.onChange({
              ...s,
              einzelflaechenOn: v,
              einzelflaechenM2: v ? s.einzelflaechenM2 : 0,
            })
          }
        >
          <QtyM2
            label="Teilfläche"
            value={s.einzelflaechenM2}
            onChange={(v) => props.onChange({ ...s, einzelflaechenM2: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Grundpreis {formatEUR(FLIESEN_PRICEBOOK.einzelflaechen.base)} +{" "}
            {FLIESEN_PRICEBOOK.einzelflaechen.ratePerM2.toFixed(2)} €/m²
          </div>
        </Card>

        {/* Total */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">Summe Fliesen</div>
            <div className="text-lg font-semibold">
              {formatEUR(parts.total)}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
