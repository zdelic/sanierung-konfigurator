import Modal from "../../Modal";
import { clamp0, formatEUR, type BMSTPriceBook } from "./bmst.pricebook";
import type { ReactNode } from "react";
import { calcBMSTParts, type BMSTState } from "./bmst.calc";

function SectionTitle(props: { title: string; subtitle?: string }) {
  return (
    <div>
      <div className="text-sm font-semibold">{props.title}</div>
      {props.subtitle ? (
        <div className="mt-1 text-xs text-slate-400 whitespace-pre-line">
          {props.subtitle}
        </div>
      ) : null}
    </div>
  );
}

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
          step={props.suffix === "lfm" ? 0.1 : 1}
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

function AcceptBox(props: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="mt-3 flex items-start gap-3 rounded-2xl bg-amber-500/10 p-3 ring-1 ring-amber-400/30">
      <input
        type="checkbox"
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
        className="mt-1 h-4 w-4"
      />
      <div className="text-xs text-amber-200 whitespace-pre-line">
        {props.label}
      </div>
    </label>
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

export default function BMSTModal(props: {
  open: boolean;
  value: BMSTState;
  onChange: (next: BMSTState) => void;
  onClose: () => void;
  pricebook: BMSTPriceBook | null;
}) {
  const s = props.value;
  const pb = props.pricebook;

  if (!pb) {
    return (
      <Modal
        open={props.open}
        title="Baumeisterarbeiten"
        subtitle="Preisbuch wird geladen…"
        onClose={props.onClose}
      >
        <div className="p-6 text-slate-300">Loading…</div>
      </Modal>
    );
  }

  const parts = calcBMSTParts(s, pb);

  return (
    <Modal
      open={props.open}
      title="Baumeisterarbeiten"
      subtitle="Tragende Durchbrüche, Auswechslungen, Mauerwerk, Kamin"
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

        {/* 1) Türdurchbruch tragend */}
        <Card
          title={pb.tuerdurchbruch_tragend.title}
          description={pb.tuerdurchbruch_tragend.description}
          checked={s.tuerdurchbruchOn}
          price={parts.tuerdurchbruch}
          onToggle={(v) => props.onChange({ ...s, tuerdurchbruchOn: v })}
        >
          <Qty
            label="Anzahl"
            value={s.tuerdurchbruchQty}
            suffix="Stk."
            onChange={(v) => props.onChange({ ...s, tuerdurchbruchQty: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Satz: {formatEUR(pb.tuerdurchbruch_tragend.ratePerPiece)} / Stk.
          </div>
        </Card>

        {/* 2) Auswechslung bis 20cm */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <SectionTitle
            title={pb.auswechslung20.title}
            subtitle={`${pb.auswechslung20.description}

            ACHTUNG: Für diese Position sind zusätzliche Kosten für „Einreichung + Statische Berechnung“ verpflichtend (+ ${formatEUR(
              pb.auswechslung20.statikFee,
            )}).
            Bitte akzeptieren, sonst wird diese Position nicht berechnet.`}
          />

          <div className="mt-3">
            <Card
              title="Auswechslung aktivieren"
              checked={s.aus20On}
              price={parts.aus20Total}
              onToggle={(v) =>
                props.onChange({
                  ...s,
                  aus20On: v,
                  // ako gasiš, automatski makni accept da ne ostane “true”
                  aus20AcceptStatik: v ? s.aus20AcceptStatik : false,
                })
              }
            >
              <Qty
                label="Laufmeter"
                value={s.aus20Lfm}
                suffix="lfm"
                onChange={(v) => props.onChange({ ...s, aus20Lfm: v })}
              />

              <div className="mt-2 text-xs text-slate-400">
                Grundpreis {formatEUR(pb.auswechslung20.base)} +{" "}
                {!s.aus20AcceptStatik || s.aus20Lfm <= 0 ? (
                  <div className="mt-2 text-xs text-amber-200">
                    Preis wird erst nach Akzeptieren und Eingabe der Laufmeter
                    berechnet.
                  </div>
                ) : null}
                {pb.auswechslung20.ratePerLfm.toFixed(2)} €/lfm
              </div>

              <AcceptBox
                checked={s.aus20AcceptStatik}
                onChange={(v) => props.onChange({ ...s, aus20AcceptStatik: v })}
                label={`ACHTUNG: Einreichung + Statische Berechnung ist für diese Position verpflichtend (+ ${formatEUR(
                  pb.auswechslung20.statikFee,
                )}).
                Ohne Akzeptieren wird die Position nicht kalkuliert.
                
                Ich akzeptiere die zusätzlichen Kosten für Einreichung + Statische Berechnung.`}
              />

              <div className="mt-2 text-xs text-slate-300">
                Statik/Einreichung:{" "}
                <span className="font-semibold">
                  {formatEUR(parts.aus20Statik)}
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* 3) Auswechslung bis 40cm */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <SectionTitle
            title={pb.auswechslung40.title}
            subtitle={`${pb.auswechslung40.description}
            ACHTUNG: Für diese Position sind zusätzliche Kosten für „Einreichung + Statische Berechnung“ verpflichtend (+ ${formatEUR(
              pb.auswechslung40.statikFee,
            )}).
            Bitte akzeptieren, sonst wird diese Position nicht berechnet.`}
          />

          <div className="mt-3">
            <Card
              title="Auswechslung aktivieren"
              checked={s.aus40On}
              price={parts.aus40Total}
              onToggle={(v) =>
                props.onChange({
                  ...s,
                  aus40On: v,
                  aus40AcceptStatik: v ? s.aus40AcceptStatik : false,
                })
              }
            >
              <Qty
                label="Laufmeter"
                value={s.aus40Lfm}
                suffix="lfm"
                onChange={(v) => props.onChange({ ...s, aus40Lfm: v })}
              />

              <div className="mt-2 text-xs text-slate-400">
                Grundpreis {formatEUR(pb.auswechslung40.base)} +{" "}
                {!s.aus20AcceptStatik || s.aus20Lfm <= 0 ? (
                  <div className="mt-2 text-xs text-amber-200">
                    Preis wird erst nach Akzeptieren und Eingabe der Laufmeter
                    berechnet.
                  </div>
                ) : null}
                {pb.auswechslung40.ratePerLfm.toFixed(2)} €/lfm
              </div>

              <AcceptBox
                checked={s.aus40AcceptStatik}
                onChange={(v) => props.onChange({ ...s, aus40AcceptStatik: v })}
                label={`ACHTUNG: Einreichung + Statische Berechnung ist für diese Position verpflichtend (+ ${formatEUR(
                  pb.auswechslung40.statikFee,
                )}).
                Ohne Akzeptieren wird die Position nicht kalkuliert.
                
                Ich akzeptiere die zusätzlichen Kosten für Einreichung + Statische Berechnung.`}
              />

              <div className="mt-2 text-xs text-slate-300">
                Statik/Einreichung:{" "}
                <span className="font-semibold">
                  {formatEUR(parts.aus40Statik)}
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* MWK nicht tragend */}
        <Card
          title={pb.mwk_nicht_tragend.title}
          checked={s.mwkNichtTragendOn}
          price={parts.mwkNichtTragend}
          onToggle={(v) => props.onChange({ ...s, mwkNichtTragendOn: v })}
        >
          <Qty
            label="Menge"
            value={s.mwkNichtTragendM2}
            suffix="m²"
            onChange={(v) => props.onChange({ ...s, mwkNichtTragendM2: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Grundpreis {formatEUR(pb.mwk_nicht_tragend.base)} +{" "}
            {pb.mwk_nicht_tragend.ratePerM2.toFixed(2)} €/m²
          </div>
        </Card>

        {/* MWK tragend */}
        <Card
          title={pb.mwk_tragend.title}
          checked={s.mwkTragendOn}
          price={parts.mwkTragend}
          onToggle={(v) => props.onChange({ ...s, mwkTragendOn: v })}
        >
          <Qty
            label="Menge"
            value={s.mwkTragendM2}
            suffix="m²"
            onChange={(v) => props.onChange({ ...s, mwkTragendM2: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Grundpreis {formatEUR(pb.mwk_tragend.base)} +{" "}
            {pb.mwk_tragend.ratePerM2.toFixed(2)} €/m²
          </div>
        </Card>

        {/* Ausmauerung NF */}
        <Card
          title={pb.ausmauerung_nf.title}
          checked={s.ausmauerungOn}
          price={parts.ausmauerung}
          onToggle={(v) => props.onChange({ ...s, ausmauerungOn: v })}
        >
          <Qty
            label="Menge"
            value={s.ausmauerungM3}
            suffix="m³"
            onChange={(v) => props.onChange({ ...s, ausmauerungM3: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Grundpreis {formatEUR(pb.ausmauerung_nf.base)} +{" "}
            {pb.ausmauerung_nf.ratePerM3.toFixed(2)} €/m³
          </div>
        </Card>

        {/* Kamin herstellen */}
        <Card
          title={pb.kamin_herstellen.title}
          checked={s.kaminOn}
          price={parts.kamin}
          onToggle={(v) => props.onChange({ ...s, kaminOn: v })}
        >
          <Qty
            label="Menge"
            value={s.kaminM3}
            suffix="m³"
            onChange={(v) => props.onChange({ ...s, kaminM3: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Grundpreis {formatEUR(pb.kamin_herstellen.base)} +{" "}
            {pb.kamin_herstellen.ratePerM3.toFixed(2)} €/m³
          </div>
        </Card>

        {/* Aufzahlung Türchen */}
        <Card
          title={pb.aufz_tuerchen.title}
          checked={s.tuerchenOn}
          price={parts.tuerchen}
          onToggle={(v) => props.onChange({ ...s, tuerchenOn: v })}
        >
          <Qty
            label="Anzahl"
            value={s.tuerchenQty}
            suffix="Stk."
            onChange={(v) => props.onChange({ ...s, tuerchenQty: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Satz: {formatEUR(pb.aufz_tuerchen.ratePerPiece)} / Stk.
          </div>
        </Card>

        {/* TOTAL */}
        {/* <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">
              Summe Baumeisterarbeiten
            </div>
            <div className="text-lg font-semibold">
              {formatEUR(parts.total)}
            </div>
          </div>
        </div> */}
      </div>
    </Modal>
  );
}
