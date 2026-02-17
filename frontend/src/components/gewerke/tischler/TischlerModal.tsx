import Modal from "../../Modal";
import {
  TISCHLER_PRICEBOOK as pb,
  clamp0,
  formatEUR,
} from "./tischler.pricebook";
import { calcTischlerParts, type TischlerState } from "./tischler.calc";
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

function QtyStk(props: {
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
          Stk.
        </span>
      </div>
    </label>
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

export default function TischlerModal(props: {
  open: boolean;
  wohnflaecheM2: number;
  value: TischlerState;
  onChange: (next: TischlerState) => void;
  onClose: () => void;

  // dependencies (Abbruch)
  abbruch: AbbruchState;
  onAbbruchChange: (next: AbbruchState) => void;
}) {
  const m2 = clamp0(props.wohnflaecheM2);
  const s = props.value;
  const parts = calcTischlerParts(m2, s);

  // Dependencies:
  // 1) Neu Eingangstüre -> Abbruch Eingangstüre samt Türblatt (abbruch.eingangstuer)
  const abbruchEingangOk = props.abbruch.eingangstuer === true;

  // 2) Neu Zargen -> Abbruch Innentürzarge samt Türblatt (tuerenMode voll)
  const abbruchInnentuerenVollOk = props.abbruch.tuerenMode === "voll";

  function ensureAbbruchEingang() {
    if (abbruchEingangOk) return;
    props.onAbbruchChange({ ...props.abbruch, eingangstuer: true });
  }

  function ensureAbbruchInnentuerenVoll() {
    if (abbruchInnentuerenVollOk) return;
    props.onAbbruchChange({
      ...props.abbruch,
      tuerenMode: "voll",
      innentuerZargeOn: false,
      innentuerZargeQty: 0,
      innentuerBlattOn: false,
      innentuerBlattQty: 0,
    });
  }

  const sanierungItems = [
    pb.sanierung_2m2_simple,
    pb.aufzahlung_2m2_aufwendig,
    pb.sanierung_4m2_simple,
    pb.aufzahlung_4m2_aufwendig,
  ] as const;

  const einzelItems = [
    pb.neu_innentueren_glasausschnitt,
    pb.innentuere_80x200,
    pb.zarge_80x200,
  ] as const;

  const fixeItems = [
    pb.whg_eingang_h250,
    pb.whg_eingang_2fluegelig_h250,
    pb.balkon_bis3,
    pb.balkon_ueber3,
    pb.kasten_bis3,
    pb.kasten_3_5,
    pb.anstrich_eingang,
    pb.anstrich_balkon,
    pb.anstrich_kasten,
  ] as const;

  return (
    <Modal
      open={props.open}
      title="Tischlerarbeiten"
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

        {/* Bestand tier */}
        <Card
          title={pb.bestand.title}
          description={pb.bestand.description}
          checked={s.bestandOn}
          price={parts.bestand}
          onToggle={(v) => props.onChange({ ...s, bestandOn: v })}
        />

        {/* Sanierung + Aufzahlungen (Stk) */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">
            Sanierung / Aufzahlungen (Stück)
          </div>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {sanierungItems.map((item) => {
              if (item.kind !== "base_plus_rate") return null;

              return (
                <div
                  key={item.key}
                  className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold">{item.title}</div>
                    <div className="text-sm font-semibold">
                      {formatEUR(parts.lines[item.key] ?? 0)}
                    </div>
                  </div>

                  <div className="mt-3">
                    <QtyStk
                      label="Stück"
                      value={s.qty[item.key] ?? 0}
                      onChange={(v) =>
                        props.onChange({
                          ...s,
                          qty: { ...s.qty, [item.key]: v },
                        })
                      }
                    />
                    <div className="mt-2 text-xs text-slate-400">
                      Grundpreis {formatEUR(item.base)} + {item.rate.toFixed(2)}{" "}
                      €/Stk
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Neuherstellung Eingang (dependency) */}
        <Card
          title={pb.neu_eingang.title}
          description={`${pb.neu_eingang.description}\n\nMit dieser Auswahl müssen Sie die folgenden Positionen auswählen: Abbruch Eingangstüre samt Türblatt`}
          checked={s.neuEingangOn}
          price={parts.neuEingang}
          onToggle={(v) =>
            props.onChange({
              ...s,
              neuEingangOn: v,
              neuEingangDepsAccepted: v ? s.neuEingangDepsAccepted : false,
            })
          }
        >
          <div className="rounded-2xl bg-amber-500/10 p-4 ring-1 ring-amber-400/30">
            <div className="text-sm font-semibold text-amber-200">
              Mit dieser Auswahl müssen Sie die folgenden Positionen auswählen:
            </div>

            <div className="mt-3 grid gap-2">
              <DepStatus
                ok={abbruchEingangOk}
                label="Abbruch Eingangstüre samt Türblatt"
              />
            </div>

            <label className="mt-4 flex items-start gap-3">
              <input
                type="checkbox"
                checked={s.neuEingangDepsAccepted}
                onChange={(e) => {
                  const checked = e.target.checked;
                  props.onChange({ ...s, neuEingangDepsAccepted: checked });
                  if (checked) ensureAbbruchEingang();
                }}
                className="mt-1 h-4 w-4"
              />
              <div className="text-xs text-amber-200 whitespace-pre-line">
                {`Ich bestätige, dass die notwendige Abbruch-Position ausgewählt wird.
Beim Akzeptieren wird "Abbruch Eingangstüre samt Türblatt" (falls nicht ausgewählt) automatisch aktiviert.`}
              </div>
            </label>

            {!s.neuEingangDepsAccepted ? (
              <div className="mt-3 text-xs text-amber-200">
                Preis wird erst nach Akzeptieren berechnet.
              </div>
            ) : null}
          </div>
        </Card>

        {/* Neuherstellung Innentüren tier */}
        <Card
          title={pb.neu_innentueren.title}
          description={pb.neu_innentueren.description}
          checked={s.neuInnentuerenOn}
          price={parts.neuInnentueren}
          onToggle={(v) => props.onChange({ ...s, neuInnentuerenOn: v })}
        />

        {/* Einzelpositionen base+rate */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Einzelpositionen (Stück)</div>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {einzelItems.map((item) => {
              if (item.kind !== "base_plus_rate") return null;

              return (
                <div
                  key={item.key}
                  className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold">{item.title}</div>
                    <div className="text-sm font-semibold">
                      {formatEUR(parts.lines[item.key] ?? 0)}
                    </div>
                  </div>

                  <div className="mt-3">
                    <QtyStk
                      label="Stück"
                      value={s.qty[item.key] ?? 0}
                      onChange={(v) =>
                        props.onChange({
                          ...s,
                          qty: { ...s.qty, [item.key]: v },
                        })
                      }
                    />
                    <div className="mt-2 text-xs text-slate-400">
                      Grundpreis {formatEUR(item.base)} + {item.rate.toFixed(2)}{" "}
                      €/Stk
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Neuherstellung Zargen (dependency) */}
        <Card
          title={pb.neu_zargen.title}
          description={`${pb.neu_zargen.description}\n\nMit dieser Auswahl müssen Sie die folgenden Positionen auswählen: Abbruch Innentürzarge samt Türblatt`}
          checked={s.neuZargenOn}
          price={parts.neuZargen}
          onToggle={(v) =>
            props.onChange({
              ...s,
              neuZargenOn: v,
              neuZargenDepsAccepted: v ? s.neuZargenDepsAccepted : false,
            })
          }
        >
          <div className="rounded-2xl bg-amber-500/10 p-4 ring-1 ring-amber-400/30">
            <div className="text-sm font-semibold text-amber-200">
              Mit dieser Auswahl müssen Sie die folgenden Positionen auswählen:
            </div>

            <div className="mt-3 grid gap-2">
              <DepStatus
                ok={abbruchInnentuerenVollOk}
                label="Abbruch Innentürzarge samt Türblatt"
              />
            </div>

            <label className="mt-4 flex items-start gap-3">
              <input
                type="checkbox"
                checked={s.neuZargenDepsAccepted}
                onChange={(e) => {
                  const checked = e.target.checked;
                  props.onChange({ ...s, neuZargenDepsAccepted: checked });
                  if (checked) ensureAbbruchInnentuerenVoll();
                }}
                className="mt-1 h-4 w-4"
              />
              <div className="text-xs text-amber-200 whitespace-pre-line">
                {`Ich bestätige, dass die notwendige Abbruch-Position ausgewählt wird.
Beim Akzeptieren wird "Abbruch Innentürzarge samt Türblatt" (falls nicht ausgewählt) automatisch aktiviert.`}
              </div>
            </label>

            {!s.neuZargenDepsAccepted ? (
              <div className="mt-3 text-xs text-amber-200">
                Preis wird erst nach Akzeptieren berechnet.
              </div>
            ) : null}
          </div>
        </Card>

        {/* Fixe Stückpreise */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">
            Instandsetzung / Fenster / Anstrich (Stück)
          </div>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {fixeItems.map((item) => {
              if (item.kind !== "rate_only") return null;

              return (
                <div
                  key={item.key}
                  className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{item.title}</div>
                      {item.description ? (
                        <div className="mt-1 text-xs text-slate-400 whitespace-pre-line">
                          {item.description}
                        </div>
                      ) : null}
                    </div>
                    <div className="text-sm font-semibold">
                      {formatEUR(parts.lines[item.key] ?? 0)}
                    </div>
                  </div>

                  <div className="mt-3">
                    <QtyStk
                      label="Stück"
                      value={s.qty[item.key] ?? 0}
                      onChange={(v) =>
                        props.onChange({
                          ...s,
                          qty: { ...s.qty, [item.key]: v },
                        })
                      }
                    />
                    <div className="mt-2 text-xs text-slate-400">
                      {item.rate.toFixed(2)} €/Stk
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">Summe Tischlerarbeiten</div>
            <div className="text-lg font-semibold">
              {formatEUR(parts.total)}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
