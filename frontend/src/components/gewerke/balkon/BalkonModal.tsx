import Modal from "../../Modal";
import { clamp0, formatEUR, pickRangePrice } from "./balkon.pricebook";
import type { BalkonPriceBook } from "./balkon.pricebook.adapter";
import {
  calcBalkonParts,
  type BalkonState,
  type BalkonMainChoice,
} from "./balkon.calc";

import balkonImg from "../../../assets/balkon.jpg";

function Switch(props: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
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
          step={0.1}
          value={props.value}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "ArrowDown") e.preventDefault();
          }}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!Number.isFinite(v)) return;
            props.onChange(Math.max(min, v));
          }}
          className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 outline-none focus:ring-white/20"
        />
        <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-200 ring-1 ring-white/15">
          m²
        </span>
      </div>
    </label>
  );
}

function RadioRow(props: {
  label: string;
  checked: boolean;
  onChange: () => void;
  right?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={props.onChange}
      className="w-full rounded-2xl bg-white/5 px-3 py-3 ring-1 ring-white/10 hover:bg-white/7 transition"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={[
              "h-4 w-4 rounded-full ring-2",
              props.checked
                ? "bg-emerald-400 ring-emerald-300/70"
                : "bg-transparent ring-white/25",
            ].join(" ")}
          />
          <div className="text-sm text-slate-200 text-left">{props.label}</div>
        </div>
        {props.right}
      </div>
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
}) {
  return (
    <div
      className={[
        "rounded-3xl bg-white/5 p-4 ring-1 ring-white/10",
        props.disabled ? "opacity-60" : "",
      ].join(" ")}
    >
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

export default function BalkonModal(props: {
  open: boolean;
  wohnflaecheM2: number;
  value: BalkonState;
  onChange: (next: BalkonState) => void;
  onClose: () => void;
  pricebook: BalkonPriceBook | null;
}) {
  const pb = props.pricebook;
  if (!pb) {
    return (
      <Modal
        open={props.open}
        title="Balkon"
        subtitle="Preisbuch wird geladen…"
        onClose={props.onClose}
      >
        <div className="p-6 text-slate-300">Loading…</div>
      </Modal>
    );
  }
  const s = props.value;
  const parts = calcBalkonParts(s, pb);
  const m2 = clamp0(s.balkonM2);

  const priceForChoice = (choice: BalkonMainChoice) => {
    if (m2 <= 0) return 0;

    switch (choice) {
      case "bestand":
        return pickRangePrice(m2, pb.bestand.ranges);
      case "sanierung_ohne_daemmung":
        return pickRangePrice(m2, pb.sanierung_ohne_daemmung.ranges);
      case "sanierung_mit_daemmung":
        return pickRangePrice(m2, pb.sanierung_mit_daemmung.ranges);
      case "sanierung_mit_daemmung_attika":
        return pickRangePrice(m2, pb.sanierung_mit_daemmung_attika.ranges);
      default:
        return 0;
    }
  };
  const rightPrice = (choice: BalkonMainChoice) => {
    if (s.main !== choice) return "€ 0,00";
    if (m2 <= 0) return "—";
    return formatEUR(priceForChoice(choice));
  };

  function setMain(choice: BalkonMainChoice) {
    // Ako pređeš na "bestand" ili "off", ugasi sve Aufzahlungen
    const resetAufz =
      choice !== "sanierung_ohne_daemmung" &&
      choice !== "sanierung_mit_daemmung" &&
      choice !== "sanierung_mit_daemmung_attika";

    props.onChange({
      ...s,
      main: choice,
      ...(resetAufz
        ? {
            stelzlagerOn: false,
            feinsteinzeugOn: false,
            holzLaercheOn: false,
            brandschutzOn: false,
            rinneOn: false,
            abdichtung3On: false,
            gefaelleOn: false,
            purOn: false,
          }
        : {}),
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
        {/* Slika + m² */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Balkonfläche</div>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-white/5 p-3 ring-1 ring-white/10">
              <img
                src={balkonImg}
                alt="Balkon"
                className="w-full rounded-2xl object-cover"
              />
            </div>
            <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <QtyM2
                label="Balkonfläche (m²)"
                value={s.balkonM2}
                onChange={(v) => props.onChange({ ...s, balkonM2: v })}
                min={0}
              />
              <div className="mt-2 text-xs text-slate-400">
                Preisstaffel nach m²: ≤ 4 / 4–8 / &gt; 8
              </div>
            </div>
          </div>
        </div>

        {/* Hauptwahl */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">
            Hauptposition (nur eine Auswahl)
          </div>
          <div className="mt-3 grid gap-2">
            <RadioRow
              label="Keine Auswahl"
              checked={s.main === "off"}
              onChange={() => setMain("off")}
              right={
                <div className="text-sm font-semibold">{formatEUR(0)}</div>
              }
            />

            <RadioRow
              label={pb.bestand.title}
              checked={s.main === "bestand"}
              onChange={() => setMain("bestand")}
              right={
                <div className="text-sm font-semibold">
                  {rightPrice("bestand")}
                </div>
              }
            />

            <RadioRow
              label={pb.sanierung_ohne_daemmung.title}
              checked={s.main === "sanierung_ohne_daemmung"}
              onChange={() => setMain("sanierung_ohne_daemmung")}
              right={
                <div className="text-sm font-semibold">
                  {rightPrice("sanierung_ohne_daemmung")}
                </div>
              }
            />

            <RadioRow
              label={pb.sanierung_mit_daemmung.title}
              checked={s.main === "sanierung_mit_daemmung"}
              onChange={() => setMain("sanierung_mit_daemmung")}
              right={
                <div className="text-sm font-semibold">
                  {rightPrice("sanierung_mit_daemmung")}
                </div>
              }
            />

            <RadioRow
              label={pb.sanierung_mit_daemmung_attika.title}
              checked={s.main === "sanierung_mit_daemmung_attika"}
              onChange={() => setMain("sanierung_mit_daemmung_attika")}
              right={
                <div className="text-sm font-semibold">
                  {rightPrice("sanierung_mit_daemmung_attika")}
                </div>
              }
            />
          </div>

          {s.main !== "off" ? (
            <div className="mt-3 text-xs text-slate-400 whitespace-pre-line">
              {s.main === "bestand"
                ? pb.bestand.description
                : s.main === "sanierung_ohne_daemmung"
                  ? pb.sanierung_ohne_daemmung.description
                  : s.main === "sanierung_mit_daemmung"
                    ? pb.sanierung_mit_daemmung.description
                    : s.main === "sanierung_mit_daemmung_attika"
                      ? pb.sanierung_mit_daemmung_attika.description
                      : ""}
            </div>
          ) : null}
        </div>

        {/* Aufzahlungen */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Aufzahlungen</div>
          {!parts.sanierungSelected ? (
            <div className="mt-2 text-xs text-slate-400">
              Aufzahlungen sind nur verfügbar, wenn eine Balkonsanierung gewählt
              ist (nicht bei Bestand).
            </div>
          ) : null}

          <div className="mt-4 grid gap-3">
            <ToggleRow
              title={pb.aufz_stelzlager.title}
              description={pb.aufz_stelzlager.description}
              checked={s.stelzlagerOn}
              price={parts.stelzlager}
              disabled={!parts.sanierungSelected || clamp0(s.balkonM2) <= 0}
              onToggle={(v) => props.onChange({ ...s, stelzlagerOn: v })}
            />
            <ToggleRow
              title={pb.aufz_feinsteinzeug.title}
              description={pb.aufz_feinsteinzeug.description}
              checked={s.feinsteinzeugOn}
              price={parts.feinsteinzeug}
              disabled={!parts.sanierungSelected || clamp0(s.balkonM2) <= 0}
              onToggle={(v) => props.onChange({ ...s, feinsteinzeugOn: v })}
            />
            <ToggleRow
              title={pb.aufz_holz_laerche.title}
              description={pb.aufz_holz_laerche.description}
              checked={s.holzLaercheOn}
              price={parts.holzLaerche}
              disabled={!parts.sanierungSelected || clamp0(s.balkonM2) <= 0}
              onToggle={(v) => props.onChange({ ...s, holzLaercheOn: v })}
            />
            <ToggleRow
              title={pb.aufz_brandschutz.title}
              description={pb.aufz_brandschutz.description}
              checked={s.brandschutzOn}
              price={parts.brandschutz}
              disabled={!parts.sanierungSelected || clamp0(s.balkonM2) <= 0}
              onToggle={(v) => props.onChange({ ...s, brandschutzOn: v })}
            />
            <ToggleRow
              title={pb.aufz_rinne.title}
              description={pb.aufz_rinne.description}
              checked={s.rinneOn}
              price={parts.rinne}
              disabled={!parts.sanierungSelected || clamp0(s.balkonM2) <= 0}
              onToggle={(v) => props.onChange({ ...s, rinneOn: v })}
            />
            <ToggleRow
              title={pb.aufz_abdichtung_3_lage.title}
              description={pb.aufz_abdichtung_3_lage.description}
              checked={s.abdichtung3On}
              price={parts.abdichtung3}
              disabled={!parts.sanierungSelected || clamp0(s.balkonM2) <= 0}
              onToggle={(v) => props.onChange({ ...s, abdichtung3On: v })}
            />
            <ToggleRow
              title={pb.aufz_gefaelledaemmung.title}
              description={pb.aufz_gefaelledaemmung.description}
              checked={s.gefaelleOn}
              price={parts.gefaelle}
              disabled={!parts.sanierungSelected || clamp0(s.balkonM2) <= 0}
              onToggle={(v) => props.onChange({ ...s, gefaelleOn: v })}
            />
            <ToggleRow
              title={pb.aufz_pur_daemmung.title}
              description={pb.aufz_pur_daemmung.description}
              checked={s.purOn}
              price={parts.pur}
              disabled={!parts.sanierungSelected || clamp0(s.balkonM2) <= 0}
              onToggle={(v) => props.onChange({ ...s, purOn: v })}
            />
          </div>
        </div>

        {/* Total */}
        {/* <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">Summe Balkon</div>
            <div className="text-lg font-semibold">
              {formatEUR(parts.total)}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Hauptposition: {formatEUR(parts.mainPrice)}{" "}
            {parts.totalAufz > 0
              ? ` + Aufzahlungen: ${formatEUR(parts.totalAufz)}`
              : ""}
          </div>
        </div> */}
      </div>
    </Modal>
  );
}
