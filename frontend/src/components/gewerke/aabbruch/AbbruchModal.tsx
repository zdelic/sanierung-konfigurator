import Modal from "../../Modal";
import { ABBRUCH_PRICEBOOK } from "./abbruch.pricebook";
import { calcAbbruchParts, type AbbruchState, type Mode } from "./abbruch.calc";

function formatEUR(value: number) {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function clampNum(v: string | number) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function Pill(props: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-200 ring-1 ring-white/15">
      {props.children}
    </span>
  );
}

function RadioPill(props: {
  name: string;
  value: Mode;
  current: Mode;
  onChange: (m: Mode) => void;
  label: string;
}) {
  const active = props.current === props.value;
  return (
    <label
      className={[
        "cursor-pointer select-none rounded-full px-3 py-1.5 text-xs ring-1 transition",
        active
          ? "bg-indigo-500/25 ring-indigo-400/40 text-white"
          : "bg-white/5 ring-white/10 text-slate-200 hover:bg-white/10",
      ].join(" ")}
    >
      <input
        className="hidden"
        type="radio"
        name={props.name}
        checked={active}
        onChange={() => props.onChange(props.value)}
      />
      {props.label}
    </label>
  );
}

function SwitchRow(props: {
  label: string;
  description?: string;
  checked: boolean;
  price: number;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold whitespace-pre-line">
            {props.label}
          </div>
          {props.description ? (
            <div className="mt-1 text-xs text-slate-400 whitespace-pre-line">
              {props.description}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold">{formatEUR(props.price)}</div>
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
        </div>
      </div>
    </div>
  );
}

function Qty(props: {
  label: string;
  value: number;
  suffix?: string;
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
          onChange={(e) => props.onChange(clampNum(e.target.value))}
          className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 outline-none focus:ring-white/20"
        />
        {props.suffix ? <Pill>{props.suffix}</Pill> : null}
      </div>
    </label>
  );
}

export type { AbbruchState };

export default function AbbruchModal(props: {
  open: boolean;
  wohnflaecheM2: number;
  value: AbbruchState;
  onChange: (next: AbbruchState) => void;
  onClose: () => void;
}) {
  const m2 = Math.max(0, Number(props.wohnflaecheM2 || 0));
  const s = props.value;
  const parts = calcAbbruchParts(m2, s);

  return (
    <Modal
      open={props.open}
      title="Abbruch"
      subtitle={`Wohnfläche (global): ${m2} m²`}
      onClose={props.onClose}
    >
      <div className="grid gap-5">
        {/* NOTE */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-xs text-slate-400">Zusätzliche Anmerkung</div>
          <textarea
            value={s.note}
            onChange={(e) => props.onChange({ ...s, note: e.target.value })}
            className="mt-2 min-h-[90px] w-full resize-y rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 outline-none placeholder:text-slate-500 focus:ring-white/20"
            placeholder="..."
          />
        </div>

        {/* BELAG */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Belag</div>
          <div className="mt-1 text-xs text-slate-400">
            {ABBRUCH_PRICEBOOK.belag.description}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <RadioPill
              name="belagMode"
              value="off"
              current={s.belagMode}
              onChange={(m) =>
                props.onChange({
                  ...s,
                  belagMode: m,
                  belagSource: m === "off" ? null : "manual",
                })
              }
              label="Aus"
            />
            <RadioPill
              name="belagMode"
              value="voll"
              current={s.belagMode}
              onChange={(m) =>
                props.onChange({
                  ...s,
                  belagMode: m,
                  belagSource: m === "off" ? null : "manual",
                })
              }
              label="Vollleistung"
            />
            <RadioPill
              name="belagMode"
              value="teil"
              current={s.belagMode}
              onChange={(m) =>
                props.onChange({
                  ...s,
                  belagMode: m,
                  belagSource: m === "off" ? null : "manual",
                })
              }
              label="Teilleistung"
            />
          </div>

          <div className="mt-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            {s.belagMode === "voll" ? (
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-200">
                  Preis nach m²-Staffel (global)
                </div>
                <div className="text-sm font-semibold">
                  {formatEUR(parts.belagVoll)}
                </div>
              </div>
            ) : null}

            {s.belagMode === "teil" ? (
              <div className="grid gap-3">
                <Qty
                  label="Teilfläche Belag"
                  value={s.belagTeilM2}
                  onChange={(v) => props.onChange({ ...s, belagTeilM2: v })}
                  suffix="m²"
                />
                <div className="text-xs text-slate-400">
                  Formel: {formatEUR(ABBRUCH_PRICEBOOK.belag.teil.base)} +{" "}
                  {ABBRUCH_PRICEBOOK.belag.teil.rate.toFixed(2)} €/m²
                </div>
                <div className="text-sm font-semibold">
                  {formatEUR(parts.belagTeil)}
                </div>
              </div>
            ) : null}

            {s.belagMode === "off" ? (
              <div className="text-xs text-slate-400">Nicht ausgewählt.</div>
            ) : null}
          </div>
        </div>

        {/* ESTRICH */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Estrich</div>
          <div className="mt-1 text-xs text-slate-400">
            {ABBRUCH_PRICEBOOK.estrich.description}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <RadioPill
              name="estrichMode"
              value="off"
              current={s.estrichMode}
              onChange={(m) =>
                props.onChange({
                  ...s,
                  estrichMode: m,
                  estrichSource: m === "off" ? null : "manual",
                })
              }
              label="Aus"
            />
            <RadioPill
              name="estrichMode"
              value="voll"
              current={s.estrichMode}
              onChange={(m) =>
                props.onChange({
                  ...s,
                  estrichMode: m,
                  estrichSource: m === "off" ? null : "manual",
                })
              }
              label="Vollleistung"
            />
            <RadioPill
              name="estrichMode"
              value="teil"
              current={s.estrichMode}
              onChange={(m) =>
                props.onChange({
                  ...s,
                  estrichMode: m,
                  estrichSource: m === "off" ? null : "manual",
                })
              }
              label="Teilleistung"
            />
          </div>

          <div className="mt-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            {s.estrichMode === "voll" ? (
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-200">
                  Preis nach m²-Staffel (global)
                </div>
                <div className="text-sm font-semibold">
                  {formatEUR(parts.estrichVoll)}
                </div>
              </div>
            ) : null}

            {s.estrichMode === "teil" ? (
              <div className="grid gap-3">
                <Qty
                  label="Teilfläche Estrich"
                  value={s.estrichTeilM2}
                  onChange={(v) => props.onChange({ ...s, estrichTeilM2: v })}
                  suffix="m²"
                />
                <div className="text-xs text-slate-400">
                  Formel: {formatEUR(ABBRUCH_PRICEBOOK.estrich.teil.base)} +{" "}
                  {ABBRUCH_PRICEBOOK.estrich.teil.rate.toFixed(2)} €/m²
                </div>
                <div className="text-sm font-semibold">
                  {formatEUR(parts.estrichTeil)}
                </div>
              </div>
            ) : null}

            {s.estrichMode === "off" ? (
              <div className="text-xs text-slate-400">Nicht ausgewählt.</div>
            ) : null}
          </div>
        </div>

        {/* TÜREN (✅ ekskluzivno: off/voll/teil) */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Innentüren</div>
          <div className="mt-1 text-xs text-slate-400">
            {ABBRUCH_PRICEBOOK.innentueren.description}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <RadioPill
              name="tuerenMode"
              value="off"
              current={s.tuerenMode}
              onChange={(m) => {
                // ✅ reset teilleistung toggles kad se gasi
                props.onChange({
                  ...s,
                  tuerenMode: m,
                  ...(m !== "teil"
                    ? {
                        innentuerZargeOn: false,
                        innentuerZargeQty: 0,
                        innentuerBlattOn: false,
                        innentuerBlattQty: 0,
                      }
                    : {}),
                });
              }}
              label="Aus"
            />
            <RadioPill
              name="tuerenMode"
              value="voll"
              current={s.tuerenMode}
              onChange={(m) => {
                // ✅ kad ide Voll -> ugasi Teil
                props.onChange({
                  ...s,
                  tuerenMode: m,
                  innentuerZargeOn: false,
                  innentuerZargeQty: 0,
                  innentuerBlattOn: false,
                  innentuerBlattQty: 0,
                });
              }}
              label="Vollleistung"
            />
            <RadioPill
              name="tuerenMode"
              value="teil"
              current={s.tuerenMode}
              onChange={(m) => {
                // ✅ kad ide Teil -> Voll se automatski gasi jer mode
                props.onChange({ ...s, tuerenMode: m });
              }}
              label="Teilleistung"
            />
          </div>

          <div className="mt-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            {s.tuerenMode === "voll" ? (
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-200">
                  Preis nach m²-Staffel (global)
                </div>
                <div className="text-sm font-semibold">
                  {formatEUR(parts.innentuerenVoll)}
                </div>
              </div>
            ) : null}

            {s.tuerenMode === "teil" ? (
              <div className="grid gap-3">
                <SwitchRow
                  label="Einzelzarge"
                  description={ABBRUCH_PRICEBOOK.tuerenTeil.zarge.description}
                  checked={s.innentuerZargeOn}
                  price={parts.innentuerZarge}
                  onChange={(v) =>
                    props.onChange({
                      ...s,
                      innentuerZargeOn: v,
                      innentuerZargeQty: v ? s.innentuerZargeQty || 1 : 0,
                    })
                  }
                />
                {s.innentuerZargeOn ? (
                  <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                    <Qty
                      label="Anzahl Zargen"
                      value={s.innentuerZargeQty}
                      onChange={(v) =>
                        props.onChange({ ...s, innentuerZargeQty: v })
                      }
                      suffix="Stk."
                    />
                    <div className="mt-2 text-xs text-slate-400">
                      Formel:
                      {formatEUR(
                        ABBRUCH_PRICEBOOK.tuerenTeil.zarge.teil.base,
                      )}{" "}
                      + (
                      {ABBRUCH_PRICEBOOK.tuerenTeil.zarge.teil.rate.toFixed(2)}{" "}
                      € × Stk.)
                    </div>
                  </div>
                ) : null}

                <SwitchRow
                  label="Einzeltürblatt"
                  description={ABBRUCH_PRICEBOOK.tuerenTeil.blatt.description}
                  checked={s.innentuerBlattOn}
                  price={parts.innentuerBlatt}
                  onChange={(v) =>
                    props.onChange({
                      ...s,
                      innentuerBlattOn: v,
                      innentuerBlattQty: v ? s.innentuerBlattQty || 1 : 0,
                    })
                  }
                />
                {s.innentuerBlattOn ? (
                  <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                    <Qty
                      label="Anzahl Türblätter"
                      value={s.innentuerBlattQty}
                      onChange={(v) =>
                        props.onChange({ ...s, innentuerBlattQty: v })
                      }
                      suffix="Stk."
                    />
                    <div className="mt-2 text-xs text-slate-400">
                      Formel:
                      {formatEUR(
                        ABBRUCH_PRICEBOOK.tuerenTeil.blatt.teil.base,
                      )}{" "}
                      +{" "}
                      {ABBRUCH_PRICEBOOK.tuerenTeil.blatt.teil.rate.toFixed(2)}{" "}
                      € × Stk.
                    </div>
                  </div>
                ) : null}

                {!s.innentuerZargeOn && !s.innentuerBlattOn ? (
                  <div className="text-xs text-slate-400">
                    Wähle mindestens eine Teilleistung (Zarge oder Türblatt).
                  </div>
                ) : null}
              </div>
            ) : null}

            {s.tuerenMode === "off" ? (
              <div className="text-xs text-slate-400">Nicht ausgewählt.</div>
            ) : null}
          </div>

          {/* Eingangstür (odvojeno) */}
          <div className="mt-4">
            <SwitchRow
              label="Eingangstürzarge samt Türblatt"
              description={ABBRUCH_PRICEBOOK.tuerenTeil.eingang.description}
              checked={s.eingangstuer}
              price={parts.eingangstuer}
              onChange={(v) => props.onChange({ ...s, eingangstuer: v })}
            />
          </div>
        </div>

        {/* WÄNDE / DECKE (Teilleistungen) */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <SwitchRow
            label="Abbruch Teilleistungen – Wände und Decke"
            description="Unterpositionen anzeigen/ausblenden (Berechnung erst bei Menge > 0)."
            checked={s.waendeDeckeOpen}
            price={parts.waendeDecke}
            onChange={(v) => props.onChange({ ...s, waendeDeckeOpen: v })}
          />

          {s.waendeDeckeOpen ? (
            <div className="mt-3 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-xs text-slate-400">
                Mengen (Grundpauschale pro Position nur bei Menge &gt; 0)
              </div>

              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {/* Mauerwerk */}
                <div>
                  <Qty
                    label={
                      ABBRUCH_PRICEBOOK.waendeDecke.positions.mauerwerk.label
                    }
                    value={s.mauerwerkQty}
                    onChange={(v) => props.onChange({ ...s, mauerwerkQty: v })}
                    suffix="m²"
                  />
                  <div className="mt-1 text-xs text-slate-400">
                    Grundpauschale:{" "}
                    {formatEUR(ABBRUCH_PRICEBOOK.waendeDecke.base)} +{" "}
                    {ABBRUCH_PRICEBOOK.waendeDecke.positions.mauerwerk.rate.toFixed(
                      2,
                    )}{" "}
                    €/m²
                  </div>
                </div>

                {/* Vorsatzschale */}
                <div>
                  <Qty
                    label={
                      ABBRUCH_PRICEBOOK.waendeDecke.positions.vorsatzschale
                        .label
                    }
                    value={s.vorsatzschaleQty}
                    onChange={(v) =>
                      props.onChange({ ...s, vorsatzschaleQty: v })
                    }
                    suffix="m²"
                  />
                  <div className="mt-1 text-xs text-slate-400">
                    Grundpauschale:{" "}
                    {formatEUR(ABBRUCH_PRICEBOOK.waendeDecke.base)} +{" "}
                    {ABBRUCH_PRICEBOOK.waendeDecke.positions.vorsatzschale.rate.toFixed(
                      2,
                    )}{" "}
                    €/m²
                  </div>
                </div>

                {/* Decke / Verkleidungen */}
                <div>
                  <Qty
                    label={ABBRUCH_PRICEBOOK.waendeDecke.positions.decke.label}
                    value={s.deckeQty}
                    onChange={(v) => props.onChange({ ...s, deckeQty: v })}
                    suffix="m²"
                  />
                  <div className="mt-1 text-xs text-slate-400">
                    Grundpauschale:{" "}
                    {formatEUR(ABBRUCH_PRICEBOOK.waendeDecke.base)} +{" "}
                    {ABBRUCH_PRICEBOOK.waendeDecke.positions.decke.rate.toFixed(
                      2,
                    )}{" "}
                    €/m²
                  </div>
                </div>

                {/* Trockenbauwände */}
                <div>
                  <Qty
                    label={
                      ABBRUCH_PRICEBOOK.waendeDecke.positions.trockenbauwaende
                        .label
                    }
                    value={s.trockenbauwaendeQty}
                    onChange={(v) =>
                      props.onChange({ ...s, trockenbauwaendeQty: v })
                    }
                    suffix="m²"
                  />
                  <div className="mt-1 text-xs text-slate-400">
                    Grundpauschale:{" "}
                    {formatEUR(ABBRUCH_PRICEBOOK.waendeDecke.base)} +{" "}
                    {ABBRUCH_PRICEBOOK.waendeDecke.positions.trockenbauwaende.rate.toFixed(
                      2,
                    )}{" "}
                    €/m²
                  </div>
                </div>

                {/* Kamin */}
                <div>
                  <Qty
                    label={ABBRUCH_PRICEBOOK.waendeDecke.positions.kamin.label}
                    value={s.kaminQty}
                    onChange={(v) => props.onChange({ ...s, kaminQty: v })}
                    suffix="m²"
                  />
                  <div className="mt-1 text-xs text-slate-400">
                    Grundpauschale:{" "}
                    {formatEUR(ABBRUCH_PRICEBOOK.waendeDecke.base)} +{" "}
                    {ABBRUCH_PRICEBOOK.waendeDecke.positions.kamin.rate.toFixed(
                      2,
                    )}{" "}
                    €/m²
                  </div>
                </div>

                {/* Türdurchbruch */}
                <div>
                  <Qty
                    label={
                      ABBRUCH_PRICEBOOK.waendeDecke.positions.tuerdurchbruch
                        .label
                    }
                    value={s.tuerdurchbruchQty}
                    onChange={(v) =>
                      props.onChange({ ...s, tuerdurchbruchQty: v })
                    }
                    suffix="Stk."
                  />
                  <div className="mt-1 text-xs text-slate-400">
                    Grundpauschale:{" "}
                    {formatEUR(ABBRUCH_PRICEBOOK.waendeDecke.base)} +{" "}
                    {ABBRUCH_PRICEBOOK.waendeDecke.positions.tuerdurchbruch.rate.toFixed(
                      2,
                    )}{" "}
                    €/Stk.
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* FOOTER TOTAL */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">Summe Abbruch</div>
            <div className="text-lg font-semibold">
              {formatEUR(parts.total)}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
