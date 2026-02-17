import Modal from "../../Modal";
import {
  FENSTER_PRICEBOOK as pb,
  clamp0,
  formatEUR,
} from "./fenster.pricebook";
import {
  calcFensterKonfiguratorDerived,
  calcFensterParts,
  type FensterState,
  type FensterTyp,
  type SonnenschutzTyp,
} from "./fenster.calc";

// ✅ slike: stavi ih u src/assets
import imgLichteMasse from "../../../assets/fenster_lichte_masse.png";
import imgTeilung from "../../../assets/fenster_teilungen.png";

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

function Qty(props: {
  label: string;
  suffix: string;
  value: number;
  min?: number;
  step?: number;
  onChange: (v: number) => void;
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
        <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-200 ring-1 ring-white/15">
          {props.suffix}
        </span>
      </div>
    </label>
  );
}

function Radio<T extends string>(props: {
  value: T;
  current: T;
  label: string;
  onChange: (v: T) => void;
}) {
  const checked = props.value === props.current;
  return (
    <button
      type="button"
      onClick={() => props.onChange(props.value)}
      className="w-full rounded-2xl bg-white/5 px-3 py-3 ring-1 ring-white/10 hover:bg-white/7 transition"
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            "h-4 w-4 rounded-full ring-2",
            checked
              ? "bg-emerald-400 ring-emerald-300/70"
              : "bg-transparent ring-white/25",
          ].join(" ")}
        />
        <div className="text-sm text-slate-200 text-left">{props.label}</div>
      </div>
    </button>
  );
}

function Row(props: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
      <div className="text-sm text-slate-200">{props.left}</div>
      <div className="text-sm font-semibold">{props.right}</div>
    </div>
  );
}

export default function FensterModal(props: {
  open: boolean;
  wohnflaecheM2: number;
  value: FensterState;
  onChange: (next: FensterState) => void;
  onClose: () => void;
}) {
  const m2 = clamp0(props.wohnflaecheM2);
  const s = props.value;
  const parts = calcFensterParts(m2, s);
  const d = calcFensterKonfiguratorDerived(s);

  return (
    <Modal
      open={props.open}
      title="Fenster"
      subtitle={`Wohnfläche (global): ${m2} m²`}
      onClose={props.onClose}
    >
      <div className="grid gap-5">
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-xs text-slate-400">Zusätzliche Anmerkung</div>
          <textarea
            value={s.note}
            onChange={(e) => props.onChange({ ...s, note: e.target.value })}
            className="mt-2 min-h-[90px] w-full resize-y rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 outline-none placeholder:text-slate-500 focus:ring-white/20"
            placeholder="..."
          />
        </div>

        {/* ============================
            A) POSTOJEĆI "FENSTER"
        ============================ */}
        <Card
          title={pb.servicieren.title}
          description={pb.servicieren.description}
          checked={s.servicierenOn}
          price={parts.servicieren}
          onToggle={(v) => props.onChange({ ...s, servicierenOn: v })}
        />

        <Card
          title={pb.sanierung_bestandsfenster.title}
          description={pb.sanierung_bestandsfenster.description}
          checked={s.sanierungFensterOn}
          price={parts.sanierungFenster}
          onToggle={(v) =>
            props.onChange({
              ...s,
              sanierungFensterOn: v,
              sanierungFensterM2: v
                ? Math.max(1, clamp0(s.sanierungFensterM2)) || 1
                : 0,
            })
          }
        >
          <QtyM2
            label="Fläche"
            min={1}
            value={s.sanierungFensterM2}
            onChange={(v) => props.onChange({ ...s, sanierungFensterM2: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Grundpreis {formatEUR(pb.sanierung_bestandsfenster.base)} +{" "}
            {pb.sanierung_bestandsfenster.ratePerM2.toFixed(2)} €/m²
          </div>
        </Card>

        <Card
          title={pb.sanierung_bestandskastenfenster.title}
          description={pb.sanierung_bestandskastenfenster.description}
          checked={s.sanierungKastenOn}
          price={parts.sanierungKasten}
          onToggle={(v) =>
            props.onChange({
              ...s,
              sanierungKastenOn: v,
              sanierungKastenM2: v
                ? Math.max(1, clamp0(s.sanierungKastenM2)) || 1
                : 0,
            })
          }
        >
          <QtyM2
            label="Fläche"
            min={1}
            value={s.sanierungKastenM2}
            onChange={(v) => props.onChange({ ...s, sanierungKastenM2: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Grundpreis {formatEUR(pb.sanierung_bestandskastenfenster.base)} +{" "}
            {pb.sanierung_bestandskastenfenster.ratePerM2.toFixed(2)} €/m²
          </div>
        </Card>

        <Card
          title={pb.aufz_prallscheibe.title}
          description={pb.aufz_prallscheibe.description}
          checked={s.aufzPrallscheibeOn}
          price={parts.aufzPrallscheibe}
          onToggle={(v) =>
            props.onChange({
              ...s,
              aufzPrallscheibeOn: v,
              aufzPrallscheibeM2: v
                ? Math.max(1, clamp0(s.aufzPrallscheibeM2)) || 1
                : 0,
            })
          }
        >
          <QtyM2
            label="Fläche"
            min={1}
            value={s.aufzPrallscheibeM2}
            onChange={(v) => props.onChange({ ...s, aufzPrallscheibeM2: v })}
          />
          <div className="mt-2 text-xs text-slate-400">
            Grundpreis {formatEUR(pb.aufz_prallscheibe.base)} +{" "}
            {pb.aufz_prallscheibe.ratePerM2.toFixed(2)} €/m²
          </div>
        </Card>

        {/* ============================
            B) FENSTER KONFIGURATOR (skriven iza checkboxa)
        ============================ */}
        <Card
          title={pb.konfigurator.title}
          description={pb.konfigurator.subtitle}
          checked={s.konfiguratorOn}
          price={parts.totalKonfigurator}
          onToggle={(v) =>
            props.onChange({
              ...s,
              konfiguratorOn: v,
              // ništa ne resetujemo – samo sakrijemo/otkrijemo
            })
          }
        >
          {/* slike */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-white/5 p-3 ring-1 ring-white/10">
              <img
                src={imgLichteMasse}
                alt="Lichte Breite / Höhe"
                className="w-full rounded-2xl object-contain"
              />
            </div>
            <div className="rounded-3xl bg-white/5 p-3 ring-1 ring-white/10">
              <img
                src={imgTeilung}
                alt="Fenster Teilungen"
                className="w-full rounded-2xl object-contain"
              />
            </div>
          </div>

          {/* mjere */}
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Qty
              label="Lichte Breite"
              suffix="cm"
              step={1}
              value={s.lichteBreiteCm}
              onChange={(v) => props.onChange({ ...s, lichteBreiteCm: v })}
            />
            <Qty
              label="Lichte Höhe"
              suffix="cm"
              step={1}
              value={s.lichteHoeheCm}
              onChange={(v) => props.onChange({ ...s, lichteHoeheCm: v })}
            />
            <Qty
              label="Anzahl Fenster"
              suffix="Stk."
              step={1}
              value={s.anzahlFenster}
              onChange={(v) =>
                props.onChange({ ...s, anzahlFenster: Math.floor(v) })
              }
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Row
              left="Fläche pro Fenster"
              right={`${d.flaecheProFenster.toFixed(2)} m²`}
            />
            <Row
              left="Gesamtfläche (FE_Rohbaumaß)"
              right={`${d.flaecheTotal.toFixed(2)} m²`}
            />
          </div>

          {/* fenstertyp */}
          <div className="mt-5 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold">Fenstertyp (exklusiv)</div>
            <div className="mt-3 grid gap-2">
              <Radio<FensterTyp>
                value="off"
                current={s.fensterTyp}
                label="Kein Fenstertyp gewählt"
                onChange={(v) => props.onChange({ ...s, fensterTyp: v })}
              />
              <Radio<FensterTyp>
                value="holz_alu"
                current={s.fensterTyp}
                label={`Holz-Alu-Fenster (${pb.typ_holz_alu_per_m2.toFixed(2)} €/m²)`}
                onChange={(v) => props.onChange({ ...s, fensterTyp: v })}
              />
              <Radio<FensterTyp>
                value="pvc_alu"
                current={s.fensterTyp}
                label={`PVC-Alu-Fenster (${pb.typ_pvc_alu_per_m2.toFixed(2)} €/m²)`}
                onChange={(v) => props.onChange({ ...s, fensterTyp: v })}
              />
              <Radio<FensterTyp>
                value="pvc"
                current={s.fensterTyp}
                label={`PVC-Fenster (${pb.typ_pvc_per_m2.toFixed(2)} €/m²)`}
                onChange={(v) => props.onChange({ ...s, fensterTyp: v })}
              />
            </div>
          </div>

          {/* aufzahlungen + sonnenschutz (kompakt prikaz kroz totals koje već računamo) */}
          <div className="mt-5 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold">
              Aufzahlungen / Kenndaten
            </div>

            <div className="mt-3 grid gap-3">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                <div className="text-sm text-slate-200">
                  Blindstock ({pb.blindstock_per_m2.toFixed(2)} €/m²)
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold">
                    {formatEUR(parts.k_blindstock)}
                  </div>
                  <Switch
                    checked={s.blindstockOn}
                    onChange={(v) => props.onChange({ ...s, blindstockOn: v })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                <div className="text-sm text-slate-200">
                  Mehrteiligkeit ({pb.mehrteiligkeit_per_m2.toFixed(2)} €/m²)
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold">
                    {formatEUR(parts.k_mehrteiligkeit)}
                  </div>
                  <Switch
                    checked={s.mehrteiligkeitOn}
                    onChange={(v) =>
                      props.onChange({ ...s, mehrteiligkeitOn: v })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">
                    Schallschutz 43 dB
                  </div>
                  <Switch
                    checked={s.schallschutzOn}
                    onChange={(v) =>
                      props.onChange({
                        ...s,
                        schallschutzOn: v,
                        schallschutzFlaecheM2: v
                          ? s.schallschutzFlaecheM2 || d.flaecheTotal
                          : 0,
                      })
                    }
                  />
                </div>
                {s.schallschutzOn ? (
                  <>
                    <Qty
                      label="Fläche"
                      suffix="m²"
                      step={0.01}
                      value={s.schallschutzFlaecheM2}
                      onChange={(v) =>
                        props.onChange({ ...s, schallschutzFlaecheM2: v })
                      }
                    />
                    <div className="mt-2 text-sm font-semibold">
                      {formatEUR(parts.k_schallschutz)}
                    </div>
                  </>
                ) : null}
              </div>

              <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">
                    Nicht transparente Gläser
                  </div>
                  <Switch
                    checked={s.nichtTransparentOn}
                    onChange={(v) =>
                      props.onChange({
                        ...s,
                        nichtTransparentOn: v,
                        nichtTransparentFlaecheM2: v
                          ? s.nichtTransparentFlaecheM2 || d.flaecheTotal
                          : 0,
                      })
                    }
                  />
                </div>
                {s.nichtTransparentOn ? (
                  <>
                    <Qty
                      label="Fläche"
                      suffix="m²"
                      step={0.01}
                      value={s.nichtTransparentFlaecheM2}
                      onChange={(v) =>
                        props.onChange({ ...s, nichtTransparentFlaecheM2: v })
                      }
                    />
                    <div className="mt-2 text-sm font-semibold">
                      {formatEUR(parts.k_nichtTransparent)}
                    </div>
                  </>
                ) : null}
              </div>

              <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Oberlichten</div>
                  <Switch
                    checked={s.oberlichteOn}
                    onChange={(v) =>
                      props.onChange({
                        ...s,
                        oberlichteOn: v,
                        oberlichteFlaecheM2: v
                          ? s.oberlichteFlaecheM2 || d.flaecheTotal
                          : 0,
                      })
                    }
                  />
                </div>
                {s.oberlichteOn ? (
                  <>
                    <Qty
                      label="Fläche"
                      suffix="m²"
                      step={0.01}
                      value={s.oberlichteFlaecheM2}
                      onChange={(v) =>
                        props.onChange({ ...s, oberlichteFlaecheM2: v })
                      }
                    />
                    <div className="mt-2 text-sm font-semibold">
                      {formatEUR(parts.k_oberlichte)}
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="mt-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Einbau von Lüfter</div>
                  <div className="text-xs text-slate-400">
                    {pb.luefter_per_stk.toFixed(2)} €/Stk
                  </div>
                </div>
                <Switch
                  checked={s.luefterOn}
                  onChange={(v) =>
                    props.onChange({
                      ...s,
                      luefterOn: v,
                      anzahlLuefter: v
                        ? Math.max(1, Math.floor(s.anzahlLuefter || 0))
                        : 0,
                    })
                  }
                />
              </div>
              {s.luefterOn ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Qty
                    label="Anzahl Lüfter"
                    suffix="Stk."
                    min={1}
                    step={1}
                    value={s.anzahlLuefter}
                    onChange={(v) =>
                      props.onChange({ ...s, anzahlLuefter: Math.floor(v) })
                    }
                  />
                  <Row left="Summe Lüfter" right={formatEUR(parts.k_luefter)} />
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold">Sonnenschutz</div>

            <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
              <div className="text-sm text-slate-200">
                Abbruch bestehender Sonnenschutz
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold">
                  {formatEUR(parts.k_sonnenschutzAbbruch)}
                </div>
                <Switch
                  checked={s.sonnenschutzAbbruchOn}
                  onChange={(v) =>
                    props.onChange({ ...s, sonnenschutzAbbruchOn: v })
                  }
                />
              </div>
            </div>

            <div className="mt-3 grid gap-2">
              <div className="text-xs text-slate-400">
                Montage-Typ (exklusiv)
              </div>
              <Radio<SonnenschutzTyp>
                value="off"
                current={s.sonnenschutzTyp}
                label="Keine Montage"
                onChange={(v) => props.onChange({ ...s, sonnenschutzTyp: v })}
              />
              <Radio<SonnenschutzTyp>
                value="innenjalousie"
                current={s.sonnenschutzTyp}
                label={`Innenjalousien (${pb.montage_innenjalousien_per_m2.toFixed(2)} €/m²)`}
                onChange={(v) => props.onChange({ ...s, sonnenschutzTyp: v })}
              />
              <Radio<SonnenschutzTyp>
                value="aussenjalousie"
                current={s.sonnenschutzTyp}
                label={`Außenjalousien (${pb.montage_aussenjalousien_per_m2.toFixed(2)} €/m²)`}
                onChange={(v) => props.onChange({ ...s, sonnenschutzTyp: v })}
              />
              <Radio<SonnenschutzTyp>
                value="blinos"
                current={s.sonnenschutzTyp}
                label={`BLINOS ROLLO (${pb.montage_blinos_rollo_per_m2.toFixed(2)} €/m²)`}
                onChange={(v) => props.onChange({ ...s, sonnenschutzTyp: v })}
              />
              <Row
                left="Summe Montage"
                right={formatEUR(parts.k_sonnenschutzMontage)}
              />
            </div>

            <div className="mt-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">
                    Aufzahlung Sonnenschutz (Aufputz)
                  </div>
                  <div className="text-xs text-slate-400">
                    {pb.aufz_sonnenschutz_aufputz_per_m2.toFixed(2)} €/m²
                  </div>
                </div>
                <Switch
                  checked={s.sonnenschutzAufputzOn}
                  onChange={(v) =>
                    props.onChange({
                      ...s,
                      sonnenschutzAufputzOn: v,
                      jalousienFlaecheM2: v
                        ? s.jalousienFlaecheM2 || d.flaecheTotal
                        : 0,
                    })
                  }
                />
              </div>

              {s.sonnenschutzAufputzOn ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Qty
                    label="Jalousien Fläche"
                    suffix="m²"
                    step={0.01}
                    value={s.jalousienFlaecheM2}
                    onChange={(v) =>
                      props.onChange({ ...s, jalousienFlaecheM2: v })
                    }
                  />
                  <Row
                    left="Summe Aufputz"
                    right={formatEUR(parts.k_sonnenschutzAufputz)}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
            <Row
              left="Grundpauschale (einmalig)"
              right={formatEUR(parts.k_grundpauschale)}
            />
            <Row
              left="Abbruch bestehender Fenster"
              right={formatEUR(parts.k_abbruchFenster)}
            />
            <Row left="Fenstertyp" right={formatEUR(parts.k_fensterTyp)} />
          </div>
        </Card>

        {/* TOTAL */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">
              Summe Fenster (inkl. Konfigurator)
            </div>
            <div className="text-lg font-semibold">
              {formatEUR(parts.total)}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Basis: {formatEUR(parts.totalBasic)}{" "}
            {s.konfiguratorOn
              ? `+ Konfigurator: ${formatEUR(parts.totalKonfigurator)}`
              : ""}
          </div>
        </div>
      </div>
    </Modal>
  );
}
