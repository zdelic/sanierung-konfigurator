// ReinigungModal.tsx
import Modal from "../../Modal";
import { clamp0, formatEUR } from "./reinigung.pricebook";
import type { ReinigungPriceBook } from "./reinigung.pricebook.adapter";
import { calcReinigungParts, type ReinigungState } from "./reinigung.calc";

function IconWrap(props: { children: React.ReactNode }) {
  return (
    <div className="h-11 w-11 shrink-0 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
      {props.children}
    </div>
  );
}

function BroomIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 3l7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 10l7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 11l-2 2c-1.5 1.5-1.5 4 0 5.5S8 20 9.5 18.5l2-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.5 14.5l-2 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 7l1 14h8l1-14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 11v7M14 11v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l1.2 4.2L17.4 8 13.2 9.2 12 13.4 10.8 9.2 6.6 8l4.2-1.8L12 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 12l.8 2.8L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-1.2L19 12z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Switch(props: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !props.disabled && props.onChange(!props.checked)}
      className={[
        "h-7 w-12 rounded-full p-1 ring-1 transition",
        props.disabled ? "opacity-50 cursor-not-allowed" : "",
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

function ToggleRow(props: {
  title: string;
  description?: string;
  checked: boolean;
  price: number;
  disabled?: boolean;
  onToggle: (v: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={[
        "rounded-3xl bg-white/5 p-4 ring-1 ring-white/10",
        props.disabled ? "opacity-60" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex items-start gap-3">
          {props.icon ? <IconWrap>{props.icon}</IconWrap> : null}

          <div className="min-w-0">
            <div className="text-sm font-semibold whitespace-pre-line">
              {props.title}
            </div>
            {props.description ? (
              <div className="mt-1 text-xs text-slate-400 whitespace-pre-line">
                {props.description}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-sm font-semibold">{formatEUR(props.price)}</div>
          <Switch
            checked={props.checked}
            disabled={props.disabled}
            onChange={props.onToggle}
          />
        </div>
      </div>
    </div>
  );
}

export default function ReinigungModal(props: {
  open: boolean;
  wohnflaecheM2: number;
  value: ReinigungState;
  pricebook: ReinigungPriceBook | null;
  onChange: (next: ReinigungState) => void;
  onClose: () => void;
}) {
  const s = props.value;
  const pb = props.pricebook;

  if (!pb) {
    return (
      <Modal
        open={props.open}
        title="Reinigung"
        subtitle="Preisbuch wird geladen…"
        onClose={props.onClose}
      >
        <div className="p-6 text-slate-300">Loading…</div>
      </Modal>
    );
  }
  const m2 = clamp0(props.wohnflaecheM2);
  const parts = calcReinigungParts(props.wohnflaecheM2, s, pb);

  const disabledAll = m2 <= 0;

  function setRaeumenNormal(v: boolean) {
    // normal vs stark: exclusive
    props.onChange({
      ...s,
      raeumenNormalOn: v,
      ...(v ? { raeumenStarkOn: false } : {}),
    });
  }

  function setRaeumenStark(v: boolean) {
    // stark vs normal: exclusive
    props.onChange({
      ...s,
      raeumenStarkOn: v,
      ...(v ? { raeumenNormalOn: false } : {}),
    });
  }

  return (
    <Modal
      open={props.open}
      title={pb.meta.title}
      subtitle={pb.meta.subtitle}
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
      <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
        <div className="text-xs text-slate-400">Zusätzliche Anmerkung</div>
        <textarea
          value={s.note}
          onChange={(e) => props.onChange({ ...s, note: e.target.value })}
          className="mt-2 min-h-[90px] w-full resize-y rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 outline-none placeholder:text-slate-500 focus:ring-white/20"
          placeholder="..."
        />
      </div>
      <div className="grid gap-5">
        {/* Wohnfläche info */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Wohnfläche</div>
              <div className="mt-1 text-xs text-slate-400">
                Preisstaffel nach Wohnfläche (m²).
              </div>
            </div>
            <div className="text-sm font-semibold">{m2.toFixed(1)} m²</div>
          </div>

          {disabledAll ? (
            <div className="mt-3 text-xs text-amber-300">
              Bitte zuerst Wohnfläche eingeben (m² &gt; 0).
            </div>
          ) : null}
        </div>

        {/* Positionen */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Leistungen</div>
          <div className="mt-4 grid gap-3">
            <ToggleRow
              title={pb.raeumen_normal.title}
              description={pb.raeumen_normal.description}
              checked={s.raeumenNormalOn}
              price={parts.raeumenNormal}
              disabled={disabledAll}
              onToggle={setRaeumenNormal}
              icon={<TrashIcon />}
            />
            <ToggleRow
              title={pb.raeumen_stark.title}
              description={pb.raeumen_stark.description}
              checked={s.raeumenStarkOn}
              price={parts.raeumenStark}
              disabled={disabledAll}
              onToggle={setRaeumenStark}
              icon={<BroomIcon />}
            />
            <ToggleRow
              title={pb.endreinigung.title}
              description={pb.endreinigung.description}
              checked={s.endreinigungOn}
              price={parts.endreinigung}
              disabled={disabledAll}
              onToggle={(v) => props.onChange({ ...s, endreinigungOn: v })}
              icon={<SparkleIcon />}
            />
          </div>

          <div className="mt-3 text-xs text-slate-400">
            Hinweis: “normal” und “stark verunreinigt” sind alternativ (nur eine
            Auswahl).
          </div>
        </div>

        {/* Total */}
        {/* <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">Summe Reinigung</div>
            <div className="text-lg font-semibold">
              {formatEUR(parts.total)}
            </div>
          </div>
        </div> */}
      </div>
    </Modal>
  );
}
