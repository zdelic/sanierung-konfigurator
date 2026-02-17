import Modal from "../../Modal";
import { ESTRICH_PRICEBOOK, clamp0, formatEUR } from "./estrich.pricebook";
import { calcEstrichParts, type EstrichState } from "./estrich.calc";
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

export default function EstrichModal(props: {
  open: boolean;
  wohnflaecheM2: number;
  value: EstrichState;
  onChange: (next: EstrichState) => void;
  onClose: () => void;

  // ✅ cross-gewerk dependency
  abbruch: AbbruchState;
  onAbbruchChange: (next: AbbruchState) => void;
}) {
  const m2 = clamp0(props.wohnflaecheM2);
  const s = props.value;
  const parts = calcEstrichParts(m2, s);

  // dependency check (Abbruch)
  const abbruchEstrichSelected = props.abbruch.estrichMode !== "off";
  const abbruchBelagSelected = props.abbruch.belagMode !== "off";

  function bumpAbbruchDeps(deltaEstrich: number, deltaBelag: number) {
    const cur = props.abbruch;

    // -------- Belag --------
    const nextBelagCount = Math.max(0, (cur.belagAutoCount ?? 0) + deltaBelag);
    const belagIsManual = cur.belagMode !== "off" && cur.belagSource !== "auto";

    let belagMode = cur.belagMode;
    let belagSource = cur.belagSource ?? null;

    if (nextBelagCount > 0 && belagMode === "off" && !belagIsManual) {
      belagMode = "voll";
      belagSource = "auto";
    }
    if (nextBelagCount === 0 && belagMode !== "off" && belagSource === "auto") {
      belagMode = "off";
      belagSource = null;
    }

    // -------- Estrich --------
    const nextEstrichCount = Math.max(
      0,
      (cur.estrichAutoCount ?? 0) + deltaEstrich,
    );
    const estrichIsManual =
      cur.estrichMode !== "off" && cur.estrichSource !== "auto";

    let estrichMode = cur.estrichMode;
    let estrichSource = cur.estrichSource ?? null;

    if (nextEstrichCount > 0 && estrichMode === "off" && !estrichIsManual) {
      estrichMode = "voll";
      estrichSource = "auto";
    }
    if (
      nextEstrichCount === 0 &&
      estrichMode !== "off" &&
      estrichSource === "auto"
    ) {
      estrichMode = "off";
      estrichSource = null;
    }

    // ✅ jedan jedini update
    props.onAbbruchChange({
      ...cur,
      belagAutoCount: nextBelagCount,
      belagMode,
      belagSource,

      estrichAutoCount: nextEstrichCount,
      estrichMode,
      estrichSource,
    });
  }

  return (
    <Modal
      open={props.open}
      title="Estricharbeiten"
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

        {/* Neuherstellung */}
        <Card
          title={ESTRICH_PRICEBOOK.neu6cm.title}
          description={ESTRICH_PRICEBOOK.neu6cm.description}
          checked={s.neuOn}
          // show price ONLY if eligible
          price={parts.neu}
          onToggle={(v) => {
            // if turning OFF and we previously accepted deps, release Abbruch deps
            if (!v && s.depsAccepted) {
              bumpAbbruchDeps(-1, -1);
            }

            props.onChange({
              ...s,
              neuOn: v,
              depsAccepted: v ? s.depsAccepted : false,
              beschleunigerOn: v ? s.beschleunigerOn : false,
            });
          }}
        >
          {/* Dependency acceptance box */}
          <div className="rounded-2xl bg-amber-500/10 p-4 ring-1 ring-amber-400/30">
            <div className="text-sm font-semibold text-amber-200">
              Mit dieser Auswahl müssen Sie die folgenden Positionen auswählen:
            </div>

            <div className="mt-3 grid gap-2">
              <DepStatus ok={abbruchEstrichSelected} label="Abbruch Estrich" />
              <DepStatus ok={abbruchBelagSelected} label="Abbruch Bodenbelag" />
            </div>

            <label className="mt-4 flex items-start gap-3">
              <input
                type="checkbox"
                checked={s.depsAccepted}
                onChange={(e) => {
                  const checked = e.target.checked;

                  props.onChange({ ...s, depsAccepted: checked });
                  if (checked) {
                    bumpAbbruchDeps(+1, +1);
                  } else {
                    bumpAbbruchDeps(-1, -1);
                  }
                }}
                className="mt-1 h-4 w-4"
              />
              <div className="text-xs text-amber-200 whitespace-pre-line">
                {`Ich bestätige, dass die notwendigen Abbruch-Positionen ausgewählt werden.
Beim Akzeptieren werden "Abbruch Estrich" und "Abbruch Bodenbelag" (falls nicht ausgewählt) automatisch aktiviert.`}
              </div>
            </label>

            {!s.depsAccepted ? (
              <div className="mt-3 text-xs text-amber-200">
                Preis wird erst nach Akzeptieren berechnet.
              </div>
            ) : null}
          </div>

          {/* Aufzahlung Beschleuniger (only makes sense if eligible) */}
          <div className="mt-4">
            <Card
              title={ESTRICH_PRICEBOOK.beschleuniger.title}
              description={ESTRICH_PRICEBOOK.beschleuniger.description}
              checked={s.beschleunigerOn}
              price={parts.beschleuniger}
              onToggle={(v) => props.onChange({ ...s, beschleunigerOn: v })}
            >
              {!parts.neuEligible ? (
                <div className="text-xs text-slate-400">
                  Aufzahlung wird erst berechnet, wenn Neuherstellung aktiv ist
                  und die Abbruch-Positionen akzeptiert wurden.
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  Preis nach m²-Staffel (global).
                </div>
              )}
            </Card>
          </div>
        </Card>

        {/* Teilleistungen */}
        <Card
          title="Estrich Teilleistungen"
          description="Einzelflächen / Verdübelung / Trockenestrich"
          checked={s.teilOn}
          price={parts.teilSum}
          onToggle={(v) =>
            props.onChange({
              ...s,
              teilOn: v,
              teilM2: v
                ? s.teilM2
                : Object.fromEntries(Object.keys(s.teilM2).map((k) => [k, 0])),
            })
          }
        >
          <div className="grid gap-4">
            {ESTRICH_PRICEBOOK.teilleistungen.map((line) => (
              <div
                key={line.key}
                className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-sm font-semibold">{line.title}</div>
                  <div className="text-sm font-semibold">
                    {formatEUR(parts.teilLines[line.key] ?? 0)}
                  </div>
                </div>

                <div className="mt-3">
                  <QtyM2
                    label="Teilfläche"
                    value={s.teilM2[line.key] ?? 0}
                    onChange={(v) =>
                      props.onChange({
                        ...s,
                        teilM2: { ...s.teilM2, [line.key]: v },
                      })
                    }
                  />
                  <div className="mt-2 text-xs text-slate-400">
                    Grundpreis {formatEUR(line.base)} +{" "}
                    {line.ratePerM2.toFixed(2)} €/m²
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Total */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">Summe Estricharbeiten</div>
            <div className="text-lg font-semibold">
              {formatEUR(parts.total)}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
