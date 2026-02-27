import Modal from "../../Modal";
import {
  clamp0,
  formatEUR,
  unitLabel,
  type TrockenbauPriceBook,
} from "./trockenbau.pricebook";
import { calcTrockenbauParts, type TrockenbauState } from "./trockenbau.calc";

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

function Qty(props: {
  label: string;
  value: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="text-xs text-slate-400">{props.label}</div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          min={1}
          step={1}
          value={props.value}
          onChange={(e) => props.onChange(clamp0(e.target.value))}
          className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 outline-none focus:ring-white/20"
        />
        <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-200 ring-1 ring-white/15">
          {props.suffix}
        </span>
      </div>
    </label>
  );
}

function Card(props: {
  title: string;
  description?: string; // ✅ dodaj
  checked: boolean;
  price: string;
  onToggle: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold whitespace-pre-line">
            {props.title}
          </div>

          {/* ✅ podnaslov iz baze */}
          {props.description ? (
            <div className="mt-1 text-xs text-slate-400 whitespace-pre-line">
              {props.description}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-sm font-semibold">{props.price}</div>
          <Switch checked={props.checked} onChange={props.onToggle} />
        </div>
      </div>

      {props.checked ? <div className="mt-3">{props.children}</div> : null}
    </div>
  );
}

export default function TrockenbauModal(props: {
  open: boolean;
  value: TrockenbauState;
  onChange: (next: TrockenbauState) => void;
  onClose: () => void;
  pricebook: TrockenbauPriceBook | null;
}) {
  const s = props.value;
  const pb = props.pricebook;
  if (!pb) {
    return (
      <Modal
        open={props.open}
        title="Trockenbauarbeiten"
        subtitle="Preisbuch wird geladen…"
        onClose={props.onClose}
      >
        <div className="p-6 text-slate-300">Loading…</div>
      </Modal>
    );
  }

  const { parts, total } = calcTrockenbauParts(s, pb);

  return (
    <Modal
      open={props.open}
      title="Trockenbauarbeiten"
      subtitle="Vorsatzschale, Wände, Decken, Aufzahlungen & Details"
      onClose={props.onClose}
      headerRight={
        <div className="text-right">
          <div className="text-xs text-slate-400">Gesamt</div>
          <div className="text-lg font-semibold text-emerald-400">
            {formatEUR(total)}
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

        {/* Lines */}
        {pb.items.map((item) => {
          const line = s.lines[item.key] ?? { on: false, qty: 0 };
          const price = parts[item.key] ?? 0;

          return (
            <Card
              key={item.key}
              title={item.title}
              description={item.description}
              checked={line.on}
              price={formatEUR(price)}
              onToggle={(v) =>
                props.onChange({
                  ...s,
                  lines: {
                    ...s.lines,
                    [item.key]: { ...line, on: v },
                  },
                })
              }
            >
              <Qty
                label="Menge"
                value={line.qty}
                suffix={unitLabel(item.unit)}
                onChange={(v) =>
                  props.onChange({
                    ...s,
                    lines: {
                      ...s.lines,
                      [item.key]: { ...line, qty: v },
                    },
                  })
                }
              />

              <div className="mt-2 text-xs text-slate-400">
                Grundpreis {formatEUR(item.base)} + {item.rate.toFixed(2)} €/
                {unitLabel(item.unit)}
              </div>
            </Card>
          );
        })}

        {/* Total */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">
              Summe Trockenbauarbeiten
            </div>
            <div className="text-lg font-semibold">{formatEUR(total)}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
