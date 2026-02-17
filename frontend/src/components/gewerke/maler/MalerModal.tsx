import Modal from "../../Modal";
import { MALER_PRICEBOOK as pb, clamp0, formatEUR } from "./maler.pricebook";
import {
  calcMalerParts,
  type MalerState,
  type VerputzMode,
} from "./maler.calc";

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

      {props.children ? <div className="mt-4">{props.children}</div> : null}
    </div>
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
          onKeyDown={(e) => {
            if (e.key === "-") e.preventDefault();
          }}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!Number.isFinite(v)) return;
            props.onChange(Math.max(0, Math.floor(v)));
          }}
          className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 outline-none focus:ring-white/20"
        />
        <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-200 ring-1 ring-white/15">
          Stk
        </span>
      </div>
    </label>
  );
}

export default function MalerModal(props: {
  open: boolean;
  wohnflaecheM2: number;
  value: MalerState;
  onChange: (next: MalerState) => void;
  onClose: () => void;
}) {
  const m2 = clamp0(props.wohnflaecheM2);
  const s = props.value;
  const parts = calcMalerParts(m2, s);

  function setVerputzMode(mode: VerputzMode) {
    props.onChange({ ...s, verputzMode: mode });
  }

  return (
    <Modal
      open={props.open}
      title="Malerarbeiten"
      subtitle={`Wohnfläche (global): ${m2} m²`}
      onClose={props.onClose}
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
        {/* Bestand */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">{pb.bestand.title}</div>
          <div className="mt-3 grid gap-3">
            <Card
              title={pb.bestand_vorarbeiten.title}
              description={pb.bestand_vorarbeiten.description}
              checked={s.bestandVorarbeitenOn}
              price={parts.bestandVorarbeiten}
              onToggle={(v) =>
                props.onChange({
                  ...s,
                  bestandVorarbeitenOn: v,
                  ...(v
                    ? {}
                    : {
                        bestandStarkeVerunOn: false,
                        bestandStarkeVerunDepsAccepted: false,
                      }),
                })
              }
            />

            <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold whitespace-pre-line">
                    {pb.bestand_starke_verunreinigungen.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-400 whitespace-pre-line">
                    {pb.bestand_starke_verunreinigungen.description}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold">
                    {formatEUR(parts.bestandStarkeVerun)}
                  </div>
                  <Switch
                    checked={s.bestandStarkeVerunOn}
                    onChange={(v) =>
                      props.onChange({
                        ...s,
                        bestandStarkeVerunOn: v,
                        bestandStarkeVerunDepsAccepted: v
                          ? s.bestandStarkeVerunDepsAccepted
                          : false,
                      })
                    }
                  />
                </div>
              </div>

              {s.bestandStarkeVerunOn ? (
                <div className="mt-4 rounded-2xl bg-amber-500/10 p-4 ring-1 ring-amber-400/25">
                  <div className="text-xs font-semibold text-amber-200">
                    Voraussetzung
                  </div>
                  <div className="mt-2 text-xs text-slate-200">
                    Diese Aufzahlung ist nur möglich, wenn{" "}
                    <b>„Bestand Vorarbeiten“</b> ausgewählt ist.
                  </div>

                  <label className="mt-3 flex items-start gap-3 text-xs text-slate-200">
                    <input
                      type="checkbox"
                      checked={s.bestandStarkeVerunDepsAccepted}
                      onChange={(e) =>
                        props.onChange({
                          ...s,
                          bestandStarkeVerunDepsAccepted: e.target.checked,
                        })
                      }
                      className="mt-0.5"
                    />
                    <span>
                      Ich bestätige, dass „Bestand Vorarbeiten“ ausgewählt ist.
                    </span>
                  </label>

                  {!s.bestandVorarbeitenOn ? (
                    <div className="mt-2 text-xs text-amber-200">
                      Hinweis: Bitte zuerst „Bestand Vorarbeiten“ aktivieren.
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <Card
              title={pb.bestand_oberflaechen_ueberarbeiten.title}
              description={pb.bestand_oberflaechen_ueberarbeiten.description}
              checked={s.bestandOberflaechenUeberarbeitenOn}
              price={parts.bestandOberflaechen}
              onToggle={(v) =>
                props.onChange({ ...s, bestandOberflaechenUeberarbeitenOn: v })
              }
            />
          </div>
        </div>

        {/* Verputz */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">{pb.verputz.title}</div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <RadioRow
              label="Keine Auswahl"
              checked={s.verputzMode === "off"}
              onChange={() => setVerputzMode("off")}
              right={
                <div className="text-sm font-semibold">{formatEUR(0)}</div>
              }
            />
            <RadioRow
              label={pb.innenputz_instand_10.title}
              checked={s.verputzMode === "instand10"}
              onChange={() => setVerputzMode("instand10")}
              right={
                <div className="text-sm font-semibold">
                  {formatEUR(parts.verputz10)}
                </div>
              }
            />
            <RadioRow
              label={pb.innenputz_instand_50.title}
              checked={s.verputzMode === "instand50"}
              onChange={() => setVerputzMode("instand50")}
              right={
                <div className="text-sm font-semibold">
                  {formatEUR(parts.verputz50)}
                </div>
              }
            />
            <RadioRow
              label={pb.innenputz_neu.title}
              checked={s.verputzMode === "neu"}
              onChange={() => setVerputzMode("neu")}
              right={
                <div className="text-sm font-semibold">
                  {formatEUR(parts.verputzNeu)}
                </div>
              }
            />
          </div>

          <div className="mt-4">
            <Card
              title={pb.verputz_einzelflaechen.title}
              description={`${pb.verputz_einzelflaechen.description}\nGrundpreis ${formatEUR(
                pb.verputz_einzelflaechen.base,
              )} + ${pb.verputz_einzelflaechen.ratePerM2.toFixed(2).replace(".", ",")} €/m²`}
              checked={s.verputzEinzelflaechenOn}
              price={parts.verputzEinzelflaechen}
              onToggle={(v) =>
                props.onChange({
                  ...s,
                  verputzEinzelflaechenOn: v,
                  verputzEinzelflaechenM2: v
                    ? Math.max(1, clamp0(s.verputzEinzelflaechenM2)) || 1
                    : 0,
                })
              }
            >
              {s.verputzEinzelflaechenOn ? (
                <QtyM2
                  label="m²"
                  min={pb.verputz_einzelflaechen.minM2 ?? 1}
                  value={s.verputzEinzelflaechenM2}
                  onChange={(v) =>
                    props.onChange({ ...s, verputzEinzelflaechenM2: v })
                  }
                />
              ) : null}
            </Card>
          </div>
        </div>

        {/* Spachtelung */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">{pb.spachtelung.title}</div>

          <div className="mt-3 grid gap-3">
            <Card
              title={pb.neu_spachtelung.title}
              description={pb.neu_spachtelung.description}
              checked={s.neuSpachtelungOn}
              price={parts.neuSpachtelung}
              onToggle={(v) => props.onChange({ ...s, neuSpachtelungOn: v })}
            />

            {/* ✅ Einzelräume spachteln: multi + qty */}
            <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-sm font-semibold">
                {pb.einzelraeume_spachteln.title}
              </div>

              <div className="mt-3 grid gap-3">
                {pb.einzelraeume_spachteln.items.map((item) => {
                  const key = item.key as keyof typeof s.spachtelRoomQty;

                  const qty = Math.max(
                    0,
                    Math.floor(clamp0(s.spachtelRoomQty[key] ?? 0)),
                  );

                  const on = qty > 0;
                  const subtotal = on ? qty * item.price : 0;

                  return (
                    <div
                      key={item.key}
                      className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold">
                            {item.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">
                            Fixpreis: {formatEUR(item.price)} / Raum
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-sm font-semibold">
                            {formatEUR(subtotal)}
                          </div>
                          <Switch
                            checked={on}
                            onChange={(v) =>
                              props.onChange({
                                ...s,
                                spachtelRoomQty: {
                                  ...s.spachtelRoomQty,
                                  [key]: v,
                                },
                              })
                            }
                          />
                        </div>
                      </div>

                      {on ? (
                        <div className="mt-3">
                          <QtyStk
                            label="Stk"
                            value={qty}
                            onChange={(v) =>
                              props.onChange({
                                ...s,
                                spachtelRoomQty: {
                                  ...s.spachtelRoomQty,
                                  [item.key]: v,
                                },
                              })
                            }
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 text-xs text-slate-400">
                Hinweis: Mehrere Raumgrößen möglich (jede Position mit eigener
                Stückzahl).
              </div>

              <div className="mt-2 text-sm font-semibold">
                Summe Einzelräume: {formatEUR(parts.spachtelRoomsTotal)}
              </div>
            </div>

            {/* ✅ Einzelflächen spachteln: corrected formula */}
            <Card
              title={pb.einzelflaechen_spachteln.title}
              description={`Grundpreis ${formatEUR(
                pb.einzelflaechen_spachteln.base,
              )} + ${pb.einzelflaechen_spachteln.ratePerM2.toFixed(2).replace(".", ",")} €/m² (min. ${
                pb.einzelflaechen_spachteln.minM2 ?? 1
              } m²)`}
              checked={s.spachtelEinzelflaechenOn}
              price={parts.spachtelEinzelflaechen}
              onToggle={(v) =>
                props.onChange({
                  ...s,
                  spachtelEinzelflaechenOn: v,
                  spachtelEinzelflaechenM2: v
                    ? Math.max(1, clamp0(s.spachtelEinzelflaechenM2)) || 1
                    : 0,
                })
              }
            >
              {s.spachtelEinzelflaechenOn ? (
                <QtyM2
                  label="m²"
                  min={pb.einzelflaechen_spachteln.minM2 ?? 1}
                  value={s.spachtelEinzelflaechenM2}
                  onChange={(v) =>
                    props.onChange({ ...s, spachtelEinzelflaechenM2: v })
                  }
                />
              ) : null}
            </Card>
          </div>
        </div>

        {/* Malerei */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">{pb.malerei.title}</div>

          <div className="mt-3 grid gap-3">
            <Card
              title={pb.neu_malerei.title}
              description={pb.neu_malerei.description}
              checked={s.neuMalereiOn}
              price={parts.neuMalerei}
              onToggle={(v) => props.onChange({ ...s, neuMalereiOn: v })}
            />

            {/* ✅ Einzelräume malen: multi + qty */}
            <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-sm font-semibold">
                {pb.einzelraeume_malen.title}
              </div>

              <div className="mt-3 grid gap-3">
                {pb.einzelraeume_malen.items.map((item) => {
                  const key = item.key as keyof typeof s.malenRoomQty;

                  const qty = Math.max(
                    0,
                    Math.floor(clamp0(s.malenRoomQty[key] ?? 0)),
                  );

                  const on = qty > 0;
                  const subtotal = on ? qty * item.price : 0;

                  return (
                    <div
                      key={item.key}
                      className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold">
                            {item.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">
                            Fixpreis: {formatEUR(item.price)} / Raum
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-sm font-semibold">
                            {formatEUR(subtotal)}
                          </div>
                          <Switch
                            checked={on}
                            onChange={(v) =>
                              props.onChange({
                                ...s,
                                malenRoomQty: {
                                  ...s.malenRoomQty,
                                  [key]: v ? Math.max(1, qty || 1) : 0,
                                },
                              })
                            }
                          />
                        </div>
                      </div>

                      {on ? (
                        <div className="mt-3">
                          <QtyStk
                            label="Stk"
                            value={qty}
                            onChange={(v) =>
                              props.onChange({
                                ...s,
                                malenRoomQty: {
                                  ...s.malenRoomQty,
                                  [key]: v,
                                },
                              })
                            }
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 text-xs text-slate-400">
                Hinweis: Mehrere Raumgrößen möglich (jede Position mit eigener
                Stückzahl).
              </div>

              <div className="mt-2 text-sm font-semibold">
                Summe Einzelräume: {formatEUR(parts.malenRoomsTotal)}
              </div>
            </div>

            <Card
              title={pb.einzelflaechen_malen.title}
              description={`Grundpreis ${formatEUR(
                pb.einzelflaechen_malen.base,
              )} + ${pb.einzelflaechen_malen.ratePerM2.toFixed(2).replace(".", ",")} €/m² (min. ${
                pb.einzelflaechen_malen.minM2 ?? 1
              } m²)`}
              checked={s.malenEinzelflaechenOn}
              price={parts.malenEinzelflaechen}
              onToggle={(v) =>
                props.onChange({
                  ...s,
                  malenEinzelflaechenOn: v,
                  malenEinzelflaechenM2: v
                    ? Math.max(1, clamp0(s.malenEinzelflaechenM2)) || 1
                    : 0,
                })
              }
            >
              {s.malenEinzelflaechenOn ? (
                <QtyM2
                  label="m²"
                  min={pb.einzelflaechen_malen.minM2 ?? 1}
                  value={s.malenEinzelflaechenM2}
                  onChange={(v) =>
                    props.onChange({ ...s, malenEinzelflaechenM2: v })
                  }
                />
              ) : null}
            </Card>
          </div>
        </div>

        {/* Zargen */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold">{pb.zargen.title}</div>

          <div className="mt-3 grid gap-3">
            <Card
              title={pb.zargen_beschichten.title}
              description={pb.zargen_beschichten.description}
              checked={s.zargenBeschichtenOn}
              price={parts.zargenBeschichten}
              onToggle={(v) => props.onChange({ ...s, zargenBeschichtenOn: v })}
            />

            <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-sm font-semibold">Einzelne Zargen</div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                  <div className="text-sm font-semibold">
                    {pb.einzelne_zarge_bis2.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Fixpreis: {formatEUR(pb.einzelne_zarge_bis2.pricePerStk)} /
                    Stk
                  </div>
                  <div className="mt-3">
                    <QtyStk
                      label="Stk"
                      value={s.einzelneZargeBis2Qty}
                      onChange={(v) =>
                        props.onChange({ ...s, einzelneZargeBis2Qty: v })
                      }
                    />
                  </div>
                  <div className="mt-2 text-sm font-semibold">
                    {formatEUR(parts.einzelneZargeBis2)}
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                  <div className="text-sm font-semibold">
                    {pb.einzelne_zarge_bis4.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Fixpreis: {formatEUR(pb.einzelne_zarge_bis4.pricePerStk)} /
                    Stk
                  </div>
                  <div className="mt-3">
                    <QtyStk
                      label="Stk"
                      value={s.einzelneZargeBis4Qty}
                      onChange={(v) =>
                        props.onChange({ ...s, einzelneZargeBis4Qty: v })
                      }
                    />
                  </div>
                  <div className="mt-2 text-sm font-semibold">
                    {formatEUR(parts.einzelneZargeBis4)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-300">Summe Maler</div>
            <div className="text-lg font-semibold">
              {formatEUR(parts.total)}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
