// ElektroModal.tsx
import Modal from "../../Modal";
import { clamp0, formatEUR } from "./elektro.pricebook";
import type { ElektroPriceBook } from "./elektro.pricebook.adapter";
import {
  calcElektroParts,
  type ElektroState,
  type InfrarotVariantKey,
} from "./elektro.calc";

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

function QtyInput(props: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
  unitBadge?: string;
}) {
  const min = props.min ?? 0;
  const step = props.step ?? 1;

  return (
    <label className="block">
      <div className="text-xs text-slate-400">{props.label}</div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          min={min}
          step={step}
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
        {props.unitBadge ? (
          <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-200 ring-1 ring-white/15">
            {props.unitBadge}
          </span>
        ) : null}
      </div>
    </label>
  );
}

function ToggleRow(props: {
  title: string;
  description?: string;
  checked: boolean;
  price: number;
  disabled?: boolean;
  onToggle: (v: boolean) => void;
  extraRight?: React.ReactNode;
}) {
  return (
    <div
      className={[
        "rounded-3xl bg-white/5 p-4 ring-1 ring-white/10",
        props.disabled ? "opacity-60" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
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
        <div className="flex items-center gap-3 shrink-0">
          {props.extraRight}
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

export default function ElektroModal(props: {
  open: boolean;
  wohnflaecheM2: number;
  value: ElektroState;
  onChange: (next: ElektroState) => void;
  onClose: () => void;
  pricebook: ElektroPriceBook | null;
}) {
  const pb = props.pricebook;
  if (!pb) {
    return (
      <Modal
        open={props.open}
        title="Elektro"
        subtitle="Preisbuch wird geladen…"
        onClose={props.onClose}
      >
        <div className="p-6 text-slate-300">Loading…</div>
      </Modal>
    );
  }
  const s = props.value;
  const m2 = clamp0(props.wohnflaecheM2);
  const parts = calcElektroParts(props.wohnflaecheM2, s, pb);

  const befundLocked = s.wohnungsverteilerOn || s.schalterOn;

  function setBefund(v: boolean) {
    // Ne dozvoli gašenje ako je locked (dependency)
    if (!v && befundLocked) return;
    props.onChange({ ...s, befundOn: v });
  }

  function setWohnungsverteiler(v: boolean) {
    // auto include befund
    props.onChange({
      ...s,
      wohnungsverteilerOn: v,
      befundOn: v ? true : s.befundOn,
    });
  }

  function setSchalter(v: boolean) {
    // auto include befund
    props.onChange({
      ...s,
      schalterOn: v,
      befundOn: v ? true : s.befundOn,
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
                Wohnungsbezogene Preise werden nach Wohnfläche (m²) gestaffelt.
              </div>
            </div>
            <div className="text-sm font-semibold">{m2.toFixed(1)} m²</div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Staffel: &lt;= 40 / 41–50 / 51–60 / 61–70 / 71–80 / 81–90 / 91–100 /
            &gt; 100
          </div>
        </div>

        {/* Wohnungsbezogen */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">
            Wohnungsbezogene Positionen
          </div>

          <div className="mt-4 grid gap-3">
            <ToggleRow
              title={pb.befundaufnahme.title}
              description={pb.befundaufnahme.description}
              checked={parts.befundIncluded}
              disabled={befundLocked || m2 <= 0}
              onToggle={(v) => setBefund(v)}
              price={parts.befundPrice}
              extraRight={
                befundLocked ? (
                  <span className="text-[11px] text-amber-300">
                    erforderlich
                  </span>
                ) : null
              }
            />

            <ToggleRow
              title={pb.wohnungsverteiler.title}
              description={pb.wohnungsverteiler.description}
              checked={s.wohnungsverteilerOn}
              onToggle={(v) => setWohnungsverteiler(v)}
              disabled={false}
              price={parts.wohnungsverteiler}
            />

            <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">
                    {pb.grundinstallation.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-400 whitespace-pre-line">
                    {pb.grundinstallation.description}
                  </div>
                  <div className="mt-2 text-xs">
                    <a
                      href={pb.grundinstallation.infoPdf.assetPath}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-200/90 hover:text-emerald-200 underline"
                    >
                      {pb.grundinstallation.infoPdf.label}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-sm font-semibold">
                    {formatEUR(parts.grundinstallation)}
                  </div>
                  <Switch
                    checked={s.grundinstallationOn}
                    disabled={m2 <= 0}
                    onChange={(v) =>
                      props.onChange({ ...s, grundinstallationOn: v })
                    }
                  />
                </div>
              </div>

              {m2 <= 0 ? (
                <div className="mt-2 text-xs text-slate-400">
                  Bitte Wohnfläche &gt; 0 (aus Stammdaten).
                </div>
              ) : null}
            </div>

            <ToggleRow
              title={pb.schalter_stecker_sprechst.title}
              description={pb.schalter_stecker_sprechst.description}
              checked={s.schalterOn}
              onToggle={(v) => setSchalter(v)}
              disabled={m2 <= 0}
              price={parts.schalter}
            />
          </div>
        </div>

        {/* Teilsanierung */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Elektro Teilsanierung</div>

          <div className="mt-4 grid gap-3">
            <ToggleRow
              title={pb.kleine_e_pauschale.title}
              checked={s.kleinePauschaleOn}
              onToggle={(v) => props.onChange({ ...s, kleinePauschaleOn: v })}
              price={parts.kleinePauschale}
            />
            <ToggleRow
              title={pb.erdung_badewanne.title}
              checked={s.erdungOn}
              onToggle={(v) => props.onChange({ ...s, erdungOn: v })}
              price={parts.erdung}
            />

            {/* Raumweise qty */}
            <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-sm font-semibold">Raumweise (Stück)</div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                  <QtyInput
                    label={`${pb.e_raum_bis_10.title} (${formatEUR(pb.e_raum_bis_10.price)}/st)`}
                    unitBadge="st"
                    step={1}
                    value={s.raum10Qty}
                    onChange={(v) =>
                      props.onChange({ ...s, raum10Qty: Math.floor(v) })
                    }
                  />
                  <div className="mt-2 text-xs text-slate-400">
                    Gesamt: {formatEUR(parts.raum10)}
                  </div>
                </div>

                <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                  <QtyInput
                    label={`${pb.e_raum_bis_10_leer.title} (${formatEUR(pb.e_raum_bis_10_leer.price)}/st)`}
                    unitBadge="st"
                    step={1}
                    value={s.raum10LeerQty}
                    onChange={(v) =>
                      props.onChange({ ...s, raum10LeerQty: Math.floor(v) })
                    }
                  />
                  <div className="mt-2 text-xs text-slate-400">
                    Gesamt: {formatEUR(parts.raum10Leer)}
                  </div>
                </div>

                <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                  <QtyInput
                    label={`${pb.e_raum_bis_15.title} (${formatEUR(pb.e_raum_bis_15.price)}/st)`}
                    unitBadge="st"
                    step={1}
                    value={s.raum15Qty}
                    onChange={(v) =>
                      props.onChange({ ...s, raum15Qty: Math.floor(v) })
                    }
                  />
                  <div className="mt-2 text-xs text-slate-400">
                    Gesamt: {formatEUR(parts.raum15)}
                  </div>
                </div>

                <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                  <QtyInput
                    label={`${pb.e_raum_bis_15_leer.title} (${formatEUR(pb.e_raum_bis_15_leer.price)}/st)`}
                    unitBadge="st"
                    step={1}
                    value={s.raum15LeerQty}
                    onChange={(v) =>
                      props.onChange({ ...s, raum15LeerQty: Math.floor(v) })
                    }
                  />
                  <div className="mt-2 text-xs text-slate-400">
                    Gesamt: {formatEUR(parts.raum15Leer)}
                  </div>
                </div>

                <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                  <QtyInput
                    label={`${pb.e_raum_bis_20.title} (${formatEUR(pb.e_raum_bis_20.price)}/st)`}
                    unitBadge="st"
                    step={1}
                    value={s.raum20Qty}
                    onChange={(v) =>
                      props.onChange({ ...s, raum20Qty: Math.floor(v) })
                    }
                  />
                  <div className="mt-2 text-xs text-slate-400">
                    Gesamt: {formatEUR(parts.raum20)}
                  </div>
                </div>

                <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                  <QtyInput
                    label={`${pb.e_raum_bis_20_leer.title} (${formatEUR(pb.e_raum_bis_20_leer.price)}/st)`}
                    unitBadge="st"
                    step={1}
                    value={s.raum20LeerQty}
                    onChange={(v) =>
                      props.onChange({ ...s, raum20LeerQty: Math.floor(v) })
                    }
                  />
                  <div className="mt-2 text-xs text-slate-400">
                    Gesamt: {formatEUR(parts.raum20Leer)}
                  </div>
                </div>

                <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                  <QtyInput
                    label={`${pb.e_raum_bis_30.title} (${formatEUR(pb.e_raum_bis_30.price)}/st)`}
                    unitBadge="st"
                    step={1}
                    value={s.raum30Qty}
                    onChange={(v) =>
                      props.onChange({ ...s, raum30Qty: Math.floor(v) })
                    }
                  />
                  <div className="mt-2 text-xs text-slate-400">
                    Gesamt: {formatEUR(parts.raum30)}
                  </div>
                </div>

                <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                  <QtyInput
                    label={`${pb.e_raum_bis_30_leer.title} (${formatEUR(pb.e_raum_bis_30_leer.price)}/st)`}
                    unitBadge="st"
                    step={1}
                    value={s.raum30LeerQty}
                    onChange={(v) =>
                      props.onChange({ ...s, raum30LeerQty: Math.floor(v) })
                    }
                  />
                  <div className="mt-2 text-xs text-slate-400">
                    Gesamt: {formatEUR(parts.raum30Leer)}
                  </div>
                </div>

                <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                  <QtyInput
                    label={`${pb.e_raum_bis_40.title} (${formatEUR(pb.e_raum_bis_40.price)}/st)`}
                    unitBadge="st"
                    step={1}
                    value={s.raum40Qty}
                    onChange={(v) =>
                      props.onChange({ ...s, raum40Qty: Math.floor(v) })
                    }
                  />
                  <div className="mt-2 text-xs text-slate-400">
                    Gesamt: {formatEUR(parts.raum40)}
                  </div>
                </div>

                <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                  <QtyInput
                    label={`${pb.e_raum_bis_40_leer.title} (${formatEUR(pb.e_raum_bis_40_leer.price)}/st)`}
                    unitBadge="st"
                    step={1}
                    value={s.raum40LeerQty}
                    onChange={(v) =>
                      props.onChange({ ...s, raum40LeerQty: Math.floor(v) })
                    }
                  />
                  <div className="mt-2 text-xs text-slate-400">
                    Gesamt: {formatEUR(parts.raum40Leer)}
                  </div>
                </div>
              </div>
            </div>

            {/* Infrarot */}
            <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">
                    {pb.infrarot_panel.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {pb.infrarot_panel.description}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold">
                    {formatEUR(
                      parts.infrBase + parts.infrFunk + parts.infrThermo,
                    )}
                  </div>
                  <Switch
                    checked={s.infrarotOn}
                    onChange={(v) => props.onChange({ ...s, infrarotOn: v })}
                  />
                </div>
              </div>

              {s.infrarotOn ? (
                <div className="mt-4 grid gap-4">
                  {/* TOP ROW: Variante + Stück */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                      <div className="text-xs text-slate-400">Variante</div>
                      <select
                        value={s.infrarotVariant}
                        onChange={(e) =>
                          props.onChange({
                            ...s,
                            infrarotVariant: e.target
                              .value as InfrarotVariantKey,
                          })
                        }
                        className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-white/20"
                      >
                        {pb.infrarot_panel.variants.map((v) => (
                          <option
                            key={v.key}
                            value={v.key}
                            className="bg-slate-900 text-slate-100"
                          >
                            {v.label} ({formatEUR(v.pricePerSt)}/st)
                          </option>
                        ))}
                      </select>

                      {/* optional: hint line */}
                      <div className="mt-2 text-xs text-slate-400">
                        Grundpreis{" "}
                        {formatEUR(
                          pb.infrarot_panel.variants.find(
                            (v) => v.key === s.infrarotVariant,
                          )?.base ?? 0,
                        )}{" "}
                        +{" "}
                        {formatEUR(
                          pb.infrarot_panel.variants.find(
                            (v) => v.key === s.infrarotVariant,
                          )?.pricePerSt ?? 0,
                        )}
                        /st
                      </div>
                    </div>

                    <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                      <QtyInput
                        label="Stück Paneele"
                        unitBadge="st"
                        step={1}
                        value={s.infrarotQty}
                        onChange={(v) =>
                          props.onChange({ ...s, infrarotQty: Math.floor(v) })
                        }
                      />
                    </div>
                  </div>

                  {/* AUFZAHLUNGEN */}
                  <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-400">Aufzahlungen</div>
                      <div className="text-[11px] text-slate-500">
                        je Stk, unabhängig von Paneelen
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2">
                      {/* Funk row */}
                      <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-200 truncate">
                            {pb.infrarot_panel.aufz_funk.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">
                            {formatEUR(pb.infrarot_panel.aufz_funk.pricePerSt)}{" "}
                            / st
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={s.infrarotFunkQty}
                            onChange={(e) =>
                              props.onChange({
                                ...s,
                                infrarotFunkQty: Math.floor(
                                  clamp0(e.target.value),
                                ),
                              })
                            }
                            className="w-20 rounded-2xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-white/20"
                          />
                          <span className="text-xs text-slate-400">Stk</span>
                        </div>
                      </div>

                      {/* Thermostat row */}
                      <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-200 truncate">
                            {pb.infrarot_panel.aufz_raumthermostat.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">
                            {formatEUR(
                              pb.infrarot_panel.aufz_raumthermostat.pricePerSt,
                            )}{" "}
                            / st
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={s.infrarotThermostatQty}
                            onChange={(e) =>
                              props.onChange({
                                ...s,
                                infrarotThermostatQty: Math.floor(
                                  clamp0(e.target.value),
                                ),
                              })
                            }
                            className="w-20 rounded-2xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-white/20"
                          />
                          <span className="text-xs text-slate-400">Stk</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Base + Unit */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Sonstiges</div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">
                    {pb.wohnungszuleitung.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {formatEUR(pb.wohnungszuleitung.base)} +{" "}
                    {formatEUR(pb.wohnungszuleitung.unitPrice)}/lfm
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold">
                    {formatEUR(parts.wohnungszuleitung)}
                  </div>
                  <Switch
                    checked={s.wohnungszuleitungOn}
                    onChange={(v) =>
                      props.onChange({ ...s, wohnungszuleitungOn: v })
                    }
                  />
                </div>
              </div>

              {s.wohnungszuleitungOn ? (
                <div className="mt-4">
                  <QtyInput
                    label="Laufmeter (lfm)"
                    unitBadge="lfm"
                    step={0.1}
                    value={s.wohnungszuleitungLfm}
                    onChange={(v) =>
                      props.onChange({ ...s, wohnungszuleitungLfm: v })
                    }
                  />
                </div>
              ) : null}
            </div>

            <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">
                    {pb.zaehlerplatz.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {formatEUR(pb.zaehlerplatz.base)} +{" "}
                    {formatEUR(pb.zaehlerplatz.unitPrice)}/st
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold">
                    {formatEUR(parts.zaehlerplatz)}
                  </div>
                  <Switch
                    checked={s.zaehlerplatzOn}
                    onChange={(v) =>
                      props.onChange({ ...s, zaehlerplatzOn: v })
                    }
                  />
                </div>
              </div>

              {s.zaehlerplatzOn ? (
                <div className="mt-4">
                  <QtyInput
                    label="Stück"
                    unitBadge="st"
                    step={1}
                    value={s.zaehlerplatzQty}
                    onChange={(v) =>
                      props.onChange({ ...s, zaehlerplatzQty: Math.floor(v) })
                    }
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Total */}
        {/* <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">Summe Elektro</div>
            <div className="text-lg font-semibold">
              {formatEUR(parts.total)}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Wohnungsbezogen: {formatEUR(parts.wohnungsbezogenTotal)}
            {parts.teilsanierungTotal > 0
              ? ` + Teilsanierung: ${formatEUR(parts.teilsanierungTotal)}`
              : ""}
            {parts.sonstigesTotal > 0
              ? ` + Sonstiges: ${formatEUR(parts.sonstigesTotal)}`
              : ""}
          </div>
        </div> */}
      </div>
    </Modal>
  );
}
