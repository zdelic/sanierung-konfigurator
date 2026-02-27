// HaustechnikModal.tsx
import React from "react";
import Modal from "../../Modal";
import { clamp0, formatEUR } from "./haustechnik.pricebook";
import type { HaustechnikPriceBook } from "./haustechnik.pricebook.adapter";
import {
  calcHaustechnikParts,
  type HaustechnikState,
  type BelagChoice,
} from "./haustechnik.calc";

import type { AbbruchState } from "../aabbruch/abbruch.calc";
import type { BodenState } from "../boden/boden.calc";
import type { FliesenState } from "../fliesen/fliesen.calc";
import type { EstrichState } from "../estrich/estrich.calc";

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
  extraRight?: React.ReactNode;
  children?: React.ReactNode;
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

      {props.checked && props.children ? (
        <div className="mt-3">{props.children}</div>
      ) : null}
    </div>
  );
}

function QtyInput(props: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  unitBadge?: string;
}) {
  const step = props.step ?? 1;
  return (
    <label className="block">
      <div className="text-xs text-slate-400">{props.label}</div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          min={0}
          step={step}
          value={props.value}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "ArrowDown") e.preventDefault();
          }}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!Number.isFinite(v)) return;
            props.onChange(Math.max(0, v));
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

function DepBox(props: {
  deps: Array<{ label: string; ok: boolean }>;
  checked: boolean;
  onChange: (v: boolean) => void;
  note?: string;
}) {
  return (
    <div className="rounded-2xl bg-amber-500/10 p-4 ring-1 ring-amber-400/30">
      <div className="text-sm font-semibold text-amber-200">
        Mit dieser Auswahl müssen Sie die folgenden Positionen auswählen:
      </div>

      <div className="mt-3 grid gap-2">
        {props.deps.map((d) => (
          <DepStatus key={d.label} ok={d.ok} label={d.label} />
        ))}
      </div>

      <label className="mt-4 flex items-start gap-3">
        <input
          type="checkbox"
          checked={props.checked}
          onChange={(e) => props.onChange(e.target.checked)}
          className="mt-1 h-4 w-4"
        />
        <div className="text-xs text-amber-200 whitespace-pre-line">
          {props.note ?? `Ich habe den Hinweis gelesen und akzeptiere ihn.`}
        </div>
      </label>

      {!props.checked ? (
        <div className="mt-3 text-xs text-amber-200">
          *Ohne Bestätigung wird diese Position mit 0,00 € berechnet.
        </div>
      ) : null}
    </div>
  );
}

export default function HaustechnikModal(props: {
  open: boolean;
  wohnflaecheM2: number;
  value: HaustechnikState;
  pricebook: HaustechnikPriceBook | null;
  onChange: (next: HaustechnikState) => void;

  // cross-gewerk states
  abbruch: AbbruchState;
  onAbbruchChange: (next: AbbruchState) => void;

  boden: BodenState;
  onBodenChange: (next: BodenState) => void;

  fliesen: FliesenState;
  onFliesenChange: (next: FliesenState) => void;

  estrich: EstrichState;
  onEstrichChange: (next: EstrichState) => void;

  onClose: () => void;
}) {
  const s = props.value;
  const pb = props.pricebook;
  if (!pb) {
    return (
      <Modal
        open={props.open}
        title="Haustechnik"
        subtitle="Preisbuch wird geladen…"
        onClose={props.onClose}
      >
        <div className="p-6 text-slate-300">Loading…</div>
      </Modal>
    );
  }
  const m2 = clamp0(props.wohnflaecheM2);
  const parts = calcHaustechnikParts(props.wohnflaecheM2, s, pb);

  // -----------------------------
  // Auto-deps inside Haustechnik
  // -----------------------------
  function applyAutoDeps(next: HaustechnikState): HaustechnikState {
    // 1) Heizkörper auto logic FIRST
    const needsHeizkoerper =
      next.heizleitungenOn || next.sockelkanalOn || next.fbhOn;

    if (needsHeizkoerper && !next.heizkoerperOn) {
      next = {
        ...next,
        heizkoerperOn: true,
        heizkoerperSource: "auto",
        heizkoerperDepsAccepted: false,
      };
    }

    if (
      !needsHeizkoerper &&
      next.heizkoerperOn &&
      next.heizkoerperSource === "auto"
    ) {
      next = {
        ...next,
        heizkoerperOn: false,
        heizkoerperSource: null,
        heizkoerperDepsAccepted: false,
      };
    }

    const needsBefund =
      next.heizkoerperOn ||
      next.heizleitungenOn ||
      next.sockelkanalOn ||
      next.fbhOn ||
      next.kuehlHeizdeckeOn ||
      next.filtertauschOn ||
      next.ventilatorOn ||
      next.lueftungszuleitungOn ||
      next.badGesamtOn ||
      next.fallstrangOn ||
      next.kuecheAufputzOn ||
      next.aufzSprossenOn ||
      next.aufzHaengeWCOn ||
      next.aufzDuschtasseOn ||
      next.behindertOn ||
      next.gasPruefungOn ||
      next.gasServiceOn ||
      next.gasThermeNeuOn ||
      next.gasInnenleitungenOn ||
      next.gaszuleitungOn ||
      next.zaehlerplatteOn;

    if (needsBefund && !next.befundOn) {
      next = { ...next, befundOn: true, befundSource: "auto" };
    }
    // auto OFF if it was auto OR legacy-null (stari state bez source)
    if (!needsBefund && next.befundOn && next.befundSource !== "manual") {
      next = { ...next, befundOn: false, befundSource: null };
    }

    return next;
  }

  const update = (patch: Partial<HaustechnikState>) => {
    const merged = { ...s, ...patch } as HaustechnikState;
    props.onChange(applyAutoDeps(merged));
  };

  // -----------------------------
  // Cross-Gewerk bump helpers (ref-count)
  // -----------------------------
  function bumpAbbruch(deltaEstrich: number, deltaBelag: number) {
    const cur = props.abbruch;

    // Belag
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

    // Estrich
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

  // Estrich Neu 6cm (and its Abbruch dependencies)
  function bumpEstrichNeu(delta: number, autoAcceptDeps: boolean) {
    const cur = props.estrich;
    const nextCount = Math.max(0, (cur.neuAutoCount ?? 0) + delta);

    const isManual = cur.neuOn && cur.neuSource !== "auto";

    let neuOn = cur.neuOn;
    let neuSource = cur.neuSource ?? null;

    // auto ON
    if (nextCount > 0 && !neuOn && !isManual) {
      neuOn = true;
      neuSource = "auto";
    }

    // auto OFF (only if auto)
    if (nextCount === 0 && neuOn && neuSource === "auto") {
      // release Abbruch deps only if Estrich deps were accepted
      if (cur.depsAccepted) {
        bumpAbbruch(-1, -1);
      }

      props.onEstrichChange({
        ...cur,
        neuAutoCount: nextCount,
        neuOn: false,
        neuSource: null,
        depsAccepted: false,
        beschleunigerOn: false,
      });
      return;
    }

    const nextDepsAccepted = autoAcceptDeps ? true : cur.depsAccepted;

    props.onEstrichChange({
      ...cur,
      neuAutoCount: nextCount,
      neuOn,
      neuSource,
      depsAccepted: nextDepsAccepted,
    });

    // dependency-of-dependency:
    // If we are the one that turns ON + accepts deps (transition false -> true),
    // we HOLD Abbruch Estrich+Belag.
    if (autoAcceptDeps && !cur.depsAccepted) {
      bumpAbbruch(+1, +1);
    }
  }

  function ensureFliesenBadWc() {
    if (props.fliesen.neuBadWcOn && props.fliesen.neuBadWcDepsAccepted) return;
    props.onFliesenChange({
      ...props.fliesen,
      neuBadWcOn: true,
      neuBadWcDepsAccepted: true,
    });
  }

  // -----------------------------
  // Boden auto-apply (IMPORTANT: return patch, don't call update() inside)
  // -----------------------------
  function anyBodenNeuBelagOn(b: BodenState) {
    return b.neuTeppichOn || b.neuLaminatOn || b.neuParkettOn;
  }

  function ensureBodenNeuBelagExclusive(choice: BelagChoice) {
    const next: BodenState = {
      ...props.boden,
      neuTeppichOn: false,
      neuTeppichDepsAccepted: false,
      neuLaminatOn: false,
      neuLaminatDepsAccepted: false,
      neuParkettOn: false,
      neuParkettDepsAccepted: false,
    };

    if (choice === "teppich") {
      next.neuTeppichOn = true;
      next.neuTeppichDepsAccepted = true;
    } else if (choice === "laminat") {
      next.neuLaminatOn = true;
      next.neuLaminatDepsAccepted = true;
    } else if (choice === "parkett") {
      next.neuParkettOn = true;
      next.neuParkettDepsAccepted = true;
    }

    props.onBodenChange(next);
  }

  function applyBodenAuto(choice: BelagChoice): Partial<HaustechnikState> {
    if (choice === "none") return {};
    // if user already had something ON manually -> don't touch Boden
    if (anyBodenNeuBelagOn(props.boden)) {
      return { bodenBelagAutoApplied: null };
    }
    // else we apply auto and remember what we applied
    ensureBodenNeuBelagExclusive(choice);
    return { bodenBelagAutoApplied: choice };
  }

  function clearBodenAuto(): Partial<HaustechnikState> {
    const choice = s.bodenBelagAutoApplied;
    if (!choice || choice === "none") return {};

    const next: BodenState = { ...props.boden };

    if (choice === "teppich") {
      next.neuTeppichOn = false;
      next.neuTeppichDepsAccepted = false;
    } else if (choice === "laminat") {
      next.neuLaminatOn = false;
      next.neuLaminatDepsAccepted = false;
    } else if (choice === "parkett") {
      next.neuParkettOn = false;
      next.neuParkettDepsAccepted = false;
    }

    props.onBodenChange(next);
    return { bodenBelagAutoApplied: null };
  }

  // -----------------------------
  // Heizung handlers
  // -----------------------------
  const setBefund = (v: boolean) =>
    update({ befundOn: v, befundSource: v ? "manual" : null });

  const setHeizkoerper = (v: boolean) => {
    if (!v) {
      update({
        heizkoerperOn: false,
        heizkoerperSource: null,
        heizkoerperDepsAccepted: false,
      });
      return;
    }

    update({
      befundOn: true,
      befundSource: s.befundOn ? s.befundSource : "auto",
      heizkoerperOn: true,
      heizkoerperSource: "manual",
      heizkoerperDepsAccepted: false,
    });
  };

  const setHeizleitungen = (v: boolean) => {
    if (!v) {
      // release cross deps only if Heizleitungen were accepted
      const bodenPatch = s.heizleitungenDepsAccepted ? clearBodenAuto() : {};
      if (s.heizleitungenDepsAccepted) {
        bumpEstrichNeu(-1, false);
      }
      if (s.fbhDepsAccepted) bumpAbbruch(-1, -1);

      update({
        heizleitungenOn: false,
        heizleitungenDepsAccepted: false,
        sockelkanalOn: false,
        fbhOn: false,
        ...bodenPatch,
      });
      return;
    }

    const belag: BelagChoice =
      s.heizleitungenBelag === "none" ? "teppich" : s.heizleitungenBelag;

    update({
      heizleitungenOn: true,
      heizleitungenSource: "manual",
      heizleitungenBelag: belag,
      heizleitungenDepsAccepted: false,

      befundOn: true,
      befundSource: s.befundOn ? s.befundSource : "auto",

      heizkoerperOn: true,
      heizkoerperSource: s.heizkoerperOn ? s.heizkoerperSource : "auto",
      heizkoerperDepsAccepted: s.heizkoerperDepsAccepted,
    });
  };

  const setBelag = (v: BelagChoice) => {
    update({ heizleitungenBelag: v });
    // if Heizleitungen already accepted -> keep Boden exclusive in sync
    if (s.heizleitungenOn && s.heizleitungenDepsAccepted && v !== "none") {
      ensureBodenNeuBelagExclusive(v);
    }
  };

  const setSockelkanal = (v: boolean) => {
    update({ sockelkanalOn: v });
  };

  const setFbh = (v: boolean) => {
    if (!v) {
      // ako želiš da FBH uklanjanjem pusti Abbruch OFF (auto-count)
      bumpAbbruch(-1, -1);
      update({ fbhOn: false });
      return;
    }

    bumpAbbruch(+1, +1);
    update({ fbhOn: true });
  };

  const setKuehlHeizdecke = (v: boolean) => {
    if (!v) {
      update({ kuehlHeizdeckeOn: false, kuehlHeizdeckeDepsAccepted: false });
      return;
    }

    update({
      // osiguraj Befund ON (auto ili manual, kako već radiš)
      befundOn: true,
      befundSource: s.befundOn ? s.befundSource : "auto",

      kuehlHeizdeckeOn: true,
      kuehlHeizdeckeDepsAccepted: false, // ✅ user mora accept
    });
  };

  // -----------------------------
  // Lüftung handlers
  // -----------------------------
  const setFilter = (v: boolean) => {
    if (!v) {
      update({ filtertauschOn: false, filtertauschDepsAccepted: false });
      return;
    }

    update({
      befundOn: true,
      befundSource: s.befundOn ? s.befundSource : "auto",
      filtertauschOn: true,
      filtertauschDepsAccepted: false, // ✅ user mora accept
    });
  };

  const setVentilator = (v: boolean) => {
    if (!v) {
      update({ ventilatorOn: false, ventilatorDepsAccepted: false });
      return;
    }

    update({
      befundOn: true,
      befundSource: s.befundOn ? s.befundSource : "auto",
      ventilatorOn: true,
      ventilatorDepsAccepted: false, // ✅ user mora accept
    });
  };

  // -----------------------------
  // Sanitär handlers
  // -----------------------------
  const setBadGesamt = (v: boolean) => {
    if (!v) {
      // ako je bilo accepted, pusti auto deps
      if (s.badGesamtDepsAccepted) {
        bumpAbbruch(-1, -1);
        bumpEstrichNeu(-1, false);
      }

      update({
        badGesamtOn: false,
        badGesamtDepsAccepted: false,
        aufzSprossenOn: false,
        aufzHaengeWCOn: false,
        aufzDuschtasseOn: false,
        behindertOn: false,
        klappsitzOn: false,
        armaturOn: false,
        wcSensorOn: false,
        gebrauch2On: false,
        untertisch10lOn: false,
        eSpeicherOn: false,
      });
      return;
    }

    update({
      befundOn: true,
      befundSource: s.befundOn ? s.befundSource : "auto",

      badGesamtOn: true,
      badGesamtDepsAccepted: false, // ✅ user mora accept u DepBox
    });

    // Ako želiš da se Fliesen Bad/WC automatski uključi (kao što si imao) ostavi:
    ensureFliesenBadWc();
  };

  const setFallstrang = (v: boolean) => {
    if (!v) {
      update({ fallstrangOn: false, fallstrangDepsAccepted: false });
      return;
    }

    update({
      befundOn: true,
      befundSource: s.befundOn ? s.befundSource : "auto",
      fallstrangOn: true,
      fallstrangDepsAccepted: false, // ✅ user mora accept
    });
  };

  const setKuecheAufputz = (v: boolean) => {
    if (!v) {
      update({ kuecheAufputzOn: false, kuecheAufputzDepsAccepted: false });
      return;
    }

    update({
      befundOn: true,
      befundSource: s.befundOn ? s.befundSource : "auto",
      kuecheAufputzOn: true,
      kuecheAufputzDepsAccepted: false, // ✅ user mora accept
    });
  };

  // -----------------------------
  // Gas handlers
  // -----------------------------
  const setGasPruefung = (v: boolean) => {
    if (!v) {
      update({ gasPruefungOn: false, gasPruefungDepsAccepted: false });
      return;
    }
    update({
      befundOn: true,
      befundSource: s.befundOn ? s.befundSource : "auto",
      gasPruefungOn: true,
      gasPruefungDepsAccepted: false,
    });
  };

  const setGasService = (v: boolean) => {
    if (!v) {
      update({ gasServiceOn: false, gasServiceDepsAccepted: false });
      return;
    }
    update({
      befundOn: true,
      befundSource: s.befundOn ? s.befundSource : "auto",
      gasServiceOn: true,
      gasServiceDepsAccepted: false,
    });
  };

  const setGasThermeNeu = (v: boolean) => {
    if (!v) {
      update({ gasThermeNeuOn: false, gasThermeNeuDepsAccepted: false });
      return;
    }
    update({
      befundOn: true,
      befundSource: s.befundOn ? s.befundSource : "auto",
      gasThermeNeuOn: true,
      gasThermeNeuDepsAccepted: false,
    });
  };

  const setGasInnenleitungen = (v: boolean) => {
    if (!v) {
      update({
        gasInnenleitungenOn: false,
        gasInnenleitungenDepsAccepted: false,
      });
      return;
    }
    update({
      befundOn: true,
      befundSource: s.befundOn ? s.befundSource : "auto",
      gasInnenleitungenOn: true,
      gasInnenleitungenDepsAccepted: false,
    });
  };

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
      {/* FIX: modal uvijek ista visina, scroll samo unutra */}
      <div className="max-h-[80vh] overflow-y-auto pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

          {/* Wohnfläche */}
          <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Wohnfläche</div>
                <div className="mt-1 text-xs text-slate-400">
                  m²-Staffel wird nach Wohnfläche berechnet.
                </div>
              </div>
              <div className="text-sm font-semibold">{m2.toFixed(1)} m²</div>
            </div>
          </div>

          {/* Befund */}
          <ToggleRow
            title={pb.befund.title}
            description={pb.befund.description}
            checked={s.befundOn}
            price={parts.befundPrice}
            disabled={m2 <= 0}
            onToggle={setBefund}
          />

          {/* Heizung */}
          <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold">Heizung</div>
            <div className="mt-4 grid gap-3">
              <ToggleRow
                title={pb.heizkoerper_tausch.title}
                description={pb.heizkoerper_tausch.description}
                checked={s.heizkoerperOn}
                price={parts.heizkoerper}
                disabled={m2 <= 0}
                onToggle={setHeizkoerper}
              >
                <DepBox
                  deps={[
                    {
                      label: "HST Bestand - Befundaufnahme / Statusbericht",
                      ok: s.befundOn,
                    },
                  ]}
                  checked={s.heizkoerperDepsAccepted}
                  onChange={(checked) =>
                    update({ heizkoerperDepsAccepted: checked })
                  }
                />
              </ToggleRow>

              {/* Heizleitungen */}
              <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">
                      {pb.heizleitungen_tausch.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-400 whitespace-pre-line">
                      {pb.heizleitungen_tausch.description}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-sm font-semibold">
                      {formatEUR(parts.heizleitungen)}
                    </div>
                    <Switch
                      checked={s.heizleitungenOn}
                      disabled={m2 <= 0}
                      onChange={setHeizleitungen}
                    />
                  </div>
                </div>

                {s.heizleitungenOn ? (
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                      <DepBox
                        deps={[
                          {
                            label:
                              "HST Bestand - Befundaufnahme / Statusbericht",
                            ok: s.befundOn,
                          },
                          {
                            label:
                              "Heizung - Heizkörper tauschen ab Wohnungsbereich",
                            ok: s.heizkoerperOn && s.heizkoerperDepsAccepted,
                          },
                          {
                            label: "Neuherstellung Estrich",
                            ok: props.estrich.neuOn, // samo status
                          },
                          {
                            label:
                              "Neuherstellung Belag (Teppich/Laminat/Parkett)",
                            ok: s.heizleitungenBelag !== "none",
                          },
                        ]}
                        checked={s.heizleitungenDepsAccepted}
                        onChange={(accepted) => {
                          const was = s.heizleitungenDepsAccepted;

                          // OFF
                          if (was && !accepted) {
                            const bodenPatch = clearBodenAuto();
                            if (s.fbhDepsAccepted) bumpAbbruch(-1, -1);
                            update({
                              heizleitungenDepsAccepted: false,
                              sockelkanalOn: false,
                              fbhOn: false,

                              // ako je Heizkörper bio auto (iz deps), vrati checkbox na false
                              heizkoerperDepsAccepted:
                                s.heizkoerperSource === "auto"
                                  ? false
                                  : s.heizkoerperDepsAccepted,
                              ...bodenPatch,
                            });

                            bumpEstrichNeu(-1, false);
                            return;
                          }

                          // ON
                          if (!was && accepted) {
                            const bodenPatch =
                              s.heizleitungenBelag !== "none"
                                ? applyBodenAuto(s.heizleitungenBelag)
                                : {};

                            update({
                              heizleitungenDepsAccepted: true,
                              heizkoerperDepsAccepted: true,
                              ...bodenPatch,
                            });

                            bumpEstrichNeu(+1, true);
                            return;
                          }

                          // fallback
                          update({ heizleitungenDepsAccepted: accepted });
                        }}
                      />
                      <div className="text-xs text-slate-400 mt-2">
                        Neuer Belag (Pflicht)
                      </div>
                      <select
                        value={s.heizleitungenBelag}
                        onChange={(e) =>
                          setBelag(e.target.value as BelagChoice)
                        }
                        className="mt-2 w-full rounded-2xl bg-slate-900 text-slate-100 px-4 py-3 text-sm ring-1 ring-white/10 outline-none focus:ring-white/20"
                      >
                        <option
                          className="bg-slate-900 text-slate-100"
                          value="none"
                        >
                          Bitte wählen…
                        </option>
                        <option
                          className="bg-slate-900 text-slate-100"
                          value="teppich"
                        >
                          Teppich
                        </option>
                        <option
                          className="bg-slate-900 text-slate-100"
                          value="laminat"
                        >
                          Laminat
                        </option>
                        <option
                          className="bg-slate-900 text-slate-100"
                          value="parkett"
                        >
                          Parkett
                        </option>
                      </select>
                      {/* Add-on: Sockelkanal (nema svoj DepBox, jer je već potvrđeno gore) */}
                      <div className="mt-4">
                        <ToggleRow
                          title={pb.aufz_sockelkanal.title}
                          description={pb.aufz_sockelkanal.description}
                          checked={s.sockelkanalOn}
                          price={parts.sockelkanal}
                          disabled={m2 <= 0 || !s.heizleitungenDepsAccepted}
                          onToggle={setSockelkanal}
                          extraRight={
                            !s.heizleitungenDepsAccepted ? (
                              <span className="text-[11px] text-amber-300">
                                erst Heizungsleitungen bestätigen
                              </span>
                            ) : null
                          }
                        />
                      </div>
                      {/* Add-on: FBH (tek kad su Heizungsleitungen potvrđene) */}
                      <div className="mt-3">
                        <ToggleRow
                          title={pb.aufz_fbh.title}
                          description={pb.aufz_fbh.description}
                          checked={s.fbhOn}
                          price={parts.fbh}
                          disabled={m2 <= 0 || !s.heizleitungenDepsAccepted}
                          onToggle={setFbh}
                          extraRight={
                            !s.heizleitungenDepsAccepted ? (
                              <span className="text-[11px] text-amber-300">
                                erst Heizungsleitungen bestätigen
                              </span>
                            ) : null
                          }
                        />
                      </div>

                      {!parts.belagOk ? (
                        <div className="mt-2 text-xs text-amber-300">
                          Belag-Auswahl ist erforderlich.
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

              <ToggleRow
                title={pb.kuehl_heizdecke.title}
                description={`${pb.kuehl_heizdecke.description} (${formatEUR(
                  pb.kuehl_heizdecke.perM2,
                )}/m²)`}
                checked={s.kuehlHeizdeckeOn}
                price={parts.kuehlHeizdecke}
                disabled={m2 <= 0}
                onToggle={setKuehlHeizdecke}
              >
                <DepBox
                  deps={[
                    {
                      label: "HST Bestand - Befundaufnahme / Statusbericht",
                      ok: s.befundOn,
                    },
                  ]}
                  checked={s.kuehlHeizdeckeDepsAccepted}
                  onChange={(accepted) =>
                    update({ kuehlHeizdeckeDepsAccepted: accepted })
                  }
                />
              </ToggleRow>
            </div>
          </div>

          {/* Lüftung */}
          <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold">Lüftung</div>
            <div className="mt-4 grid gap-3">
              <ToggleRow
                title={pb.lueftung_filter.title}
                description={pb.lueftung_filter.description}
                checked={s.filtertauschOn}
                price={parts.filtertausch}
                disabled={m2 <= 0}
                onToggle={setFilter}
              >
                <DepBox
                  deps={[
                    {
                      label: "HST Bestand - Befundaufnahme / Statusbericht",
                      ok: s.befundOn,
                    },
                  ]}
                  checked={s.filtertauschDepsAccepted}
                  onChange={(accepted) =>
                    update({ filtertauschDepsAccepted: accepted })
                  }
                />
              </ToggleRow>

              <ToggleRow
                title={pb.lueftung_ventilator.title}
                description={pb.lueftung_ventilator.description}
                checked={s.ventilatorOn}
                price={parts.ventilator}
                disabled={m2 <= 0}
                onToggle={setVentilator}
              >
                <DepBox
                  deps={[
                    {
                      label: "HST Bestand - Befundaufnahme / Statusbericht",
                      ok: s.befundOn,
                    },
                  ]}
                  checked={s.ventilatorDepsAccepted}
                  onChange={(accepted) =>
                    update({ ventilatorDepsAccepted: accepted })
                  }
                />
              </ToggleRow>

              <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold">
                      {pb.lueftungszuleitung.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {formatEUR(pb.lueftungszuleitung.base)} +{" "}
                      {formatEUR(pb.lueftungszuleitung.unitPrice)}/lfm
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-sm font-semibold">
                      {formatEUR(parts.lueftungszuleitung)}
                    </div>
                    <Switch
                      checked={s.lueftungszuleitungOn}
                      onChange={(v) => update({ lueftungszuleitungOn: v })}
                    />
                  </div>
                </div>

                {s.lueftungszuleitungOn ? (
                  <div className="mt-4">
                    <QtyInput
                      label="Laufmeter (lfm)"
                      unitBadge="lfm"
                      step={0.1}
                      value={s.lueftungszuleitungLfm}
                      onChange={(v) => update({ lueftungszuleitungLfm: v })}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Sanitär */}
          <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold">Sanitär</div>
            <div className="mt-4 grid gap-3">
              <ToggleRow
                title={pb.sanitaer_bad_gesamt.title}
                description={pb.sanitaer_bad_gesamt.description}
                checked={s.badGesamtOn}
                price={parts.badGesamt}
                onToggle={setBadGesamt}
                extraRight={
                  props.fliesen.neuBadWcOn && props.estrich.neuOn ? (
                    <span className="text-[11px] text-emerald-300">
                      Fliesen+Estrich OK
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-300">
                      setzt Fliesen+Estrich
                    </span>
                  )
                }
              >
                <DepBox
                  deps={[
                    {
                      label: "HST Bestand - Befundaufnahme / Statusbericht",
                      ok: s.befundOn,
                    },
                    {
                      label: "Abbruch Belag",
                      ok: props.abbruch.belagMode !== "off",
                    },
                    {
                      label: "Neuherstellung Fliesen Badezimmer",
                      ok:
                        props.fliesen.neuBadWcOn &&
                        props.fliesen.neuBadWcDepsAccepted,
                    },
                    {
                      label: "Neuherstellung Estrich*",
                      // opcija A (blaže): samo da je estrich neu ON
                      // ok: props.estrich.neuOn,

                      // opcija B (strožije / bolje): da je i deps accepted u Estrich Gewerku
                      ok: props.estrich.neuOn,
                    },
                  ]}
                  checked={s.badGesamtDepsAccepted}
                  onChange={(accepted) => {
                    const was = s.badGesamtDepsAccepted;

                    // OFF
                    if (was && !accepted) {
                      update({ badGesamtDepsAccepted: false });

                      // release auto deps
                      bumpAbbruch(0, -1); // Abbruch Belag release
                      bumpEstrichNeu(-1, false); // Estrich Neu release (bez auto-accept)
                      return;
                    }

                    // ON
                    if (!was && accepted) {
                      update({ badGesamtDepsAccepted: true });

                      // auto deps ON
                      bumpAbbruch(+1, +1); // Abbruch Belag auto ON
                      bumpEstrichNeu(+1, true); // Estrich Neu auto ON (depsAccepted ostaje na useru u Estrich)
                      return;
                    }

                    update({ badGesamtDepsAccepted: accepted });
                  }}
                  note={
                    "Ich habe den Hinweis gelesen und akzeptiere ihn.\n" +
                    "*Estrich hat eine zusätzliche Abhängigkeit (Abbruch Estrich) im Estrich-Gewerk."
                  }
                />
                {/* Zusätze: nur innerhalb Bad-Gesamt (kao add-ons) */}
                {s.badGesamtOn && s.badGesamtDepsAccepted ? (
                  <div className="grid gap-3 mt-3">
                    <p className="text-xs text-emerald-300 mt-2">
                      Zusätze: nur innerhalb Gesamterneuerung Badezimmer:
                    </p>
                    <ToggleRow
                      title={pb.aufz_sprossen_e.title}
                      description={pb.aufz_sprossen_e.description}
                      checked={s.aufzSprossenOn}
                      price={parts.aufzSprossen}
                      onToggle={(v) => update({ aufzSprossenOn: v })}
                    />
                    <ToggleRow
                      title={pb.aufz_haenge_wc.title}
                      description={pb.aufz_haenge_wc.description}
                      checked={s.aufzHaengeWCOn}
                      price={parts.aufzHaengeWC}
                      onToggle={(v) => update({ aufzHaengeWCOn: v })}
                    />
                    <ToggleRow
                      title={pb.aufz_duschtasse.title}
                      description={pb.aufz_duschtasse.description}
                      checked={s.aufzDuschtasseOn}
                      price={parts.aufzDuschtasse}
                      onToggle={(v) => update({ aufzDuschtasseOn: v })}
                    />
                    <ToggleRow
                      title={pb.behindertengerecht.title}
                      description={pb.behindertengerecht.description}
                      checked={s.behindertOn}
                      price={parts.behindert}
                      onToggle={(v) => {
                        // kad se ugasi parent, ugasi i child pozicije
                        if (!v) {
                          update({
                            behindertOn: false,
                            klappsitzOn: false,
                            armaturOn: false,
                            wcSensorOn: false,
                            gebrauch2On: false,
                            untertisch10lOn: false,
                            eSpeicherOn: false,
                          });
                          return;
                        }
                        update({ behindertOn: true });
                      }}
                    >
                      {s.behindertOn ? (
                        <div className="mt-4 ml-4 grid gap-3">
                          <ToggleRow
                            title={pb.klappsitz.title}
                            checked={s.klappsitzOn}
                            price={parts.klappsitz}
                            onToggle={(v) => update({ klappsitzOn: v })}
                          />
                          <ToggleRow
                            title={pb.armatur.title}
                            checked={s.armaturOn}
                            price={parts.armatur}
                            onToggle={(v) => update({ armaturOn: v })}
                          />
                          <ToggleRow
                            title={pb.wc_sensor.title}
                            checked={s.wcSensorOn}
                            price={parts.wcSensor}
                            onToggle={(v) => update({ wcSensorOn: v })}
                          />
                          <ToggleRow
                            title={pb.gebrauch_2.title}
                            checked={s.gebrauch2On}
                            price={parts.gebrauch2}
                            onToggle={(v) => update({ gebrauch2On: v })}
                          />
                          <ToggleRow
                            title={pb.untertisch_10l.title}
                            checked={s.untertisch10lOn}
                            price={parts.untertisch10l}
                            onToggle={(v) => update({ untertisch10lOn: v })}
                          />
                          <ToggleRow
                            title={pb.e_speicher.title}
                            checked={s.eSpeicherOn}
                            price={parts.eSpeicher}
                            onToggle={(v) => update({ eSpeicherOn: v })}
                          />
                        </div>
                      ) : null}
                    </ToggleRow>
                  </div>
                ) : null}
              </ToggleRow>

              <ToggleRow
                title={pb.sanitaer_fallstrang.title}
                description={pb.sanitaer_fallstrang.description}
                checked={s.fallstrangOn}
                price={parts.fallstrang}
                onToggle={setFallstrang}
              >
                <DepBox
                  deps={[
                    {
                      label: "HST Bestand - Befundaufnahme / Statusbericht",
                      ok: s.befundOn,
                    },
                  ]}
                  checked={s.fallstrangDepsAccepted}
                  onChange={(accepted) =>
                    update({ fallstrangDepsAccepted: accepted })
                  }
                />
              </ToggleRow>

              <ToggleRow
                title={pb.sanitaer_zus_dusche.title}
                description={pb.sanitaer_zus_dusche.description}
                checked={s.zusDuscheOn}
                price={parts.zusDusche}
                onToggle={(v) => update({ zusDuscheOn: v })}
              />
              <ToggleRow
                title={pb.aufz_vollglas.title}
                description={pb.aufz_vollglas.description}
                checked={s.vollglasOn}
                price={parts.vollglas}
                onToggle={(v) => update({ vollglasOn: v })}
              />
              <ToggleRow
                title={pb.sanitaer_zus_wt.title}
                description={pb.sanitaer_zus_wt.description}
                checked={s.zusWTOn}
                price={parts.zusWT}
                onToggle={(v) => update({ zusWTOn: v })}
              />
              <ToggleRow
                title={pb.sanitaer_wt_tausch.title}
                description={pb.sanitaer_wt_tausch.description}
                checked={s.wtTauschOn}
                price={parts.wtTausch}
                onToggle={(v) => update({ wtTauschOn: v })}
              />
              <ToggleRow
                title={pb.sanitaer_wc_tausch.title}
                description={pb.sanitaer_wc_tausch.description}
                checked={s.wcTauschOn}
                price={parts.wcTausch}
                onToggle={(v) => update({ wcTauschOn: v })}
              />
              <ToggleRow
                title={pb.sanitaer_wanne_dusche_tausch.title}
                description={pb.sanitaer_wanne_dusche_tausch.description}
                checked={s.wanneDuscheTauschOn}
                price={parts.wanneDuscheTausch}
                onToggle={(v) => update({ wanneDuscheTauschOn: v })}
              />
              <ToggleRow
                title={pb.sanitaer_gebrauch.title}
                description={pb.sanitaer_gebrauch.description}
                checked={s.gebrauchOn}
                price={parts.gebrauch}
                onToggle={(v) => update({ gebrauchOn: v })}
              />

              <ToggleRow
                title={pb.sanitaer_kueche_aufputz.title}
                description={pb.sanitaer_kueche_aufputz.description}
                checked={s.kuecheAufputzOn}
                price={parts.kuecheAufputz}
                onToggle={setKuecheAufputz}
              >
                <DepBox
                  deps={[
                    {
                      label: "HST Bestand - Befundaufnahme / Statusbericht",
                      ok: s.befundOn,
                    },
                  ]}
                  checked={s.kuecheAufputzDepsAccepted}
                  onChange={(accepted) =>
                    update({ kuecheAufputzDepsAccepted: accepted })
                  }
                />
              </ToggleRow>
            </div>
          </div>

          {/* Gas */}
          <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold">Gas</div>
            <div className="mt-4 grid gap-3">
              <ToggleRow
                title={pb.gas_pruefung.title}
                description={pb.gas_pruefung.description}
                checked={s.gasPruefungOn}
                price={parts.gasPruefung}
                onToggle={setGasPruefung}
              >
                <DepBox
                  deps={[
                    {
                      label: "HST Bestand - Befundaufnahme / Statusbericht",
                      ok: s.befundOn,
                    },
                  ]}
                  checked={s.gasPruefungDepsAccepted}
                  onChange={(accepted) =>
                    update({ gasPruefungDepsAccepted: accepted })
                  }
                />
              </ToggleRow>

              <ToggleRow
                title={pb.gas_service.title}
                description={pb.gas_service.description}
                checked={s.gasServiceOn}
                price={parts.gasService}
                onToggle={setGasService}
              >
                <DepBox
                  deps={[
                    {
                      label: "HST Bestand - Befundaufnahme / Statusbericht",
                      ok: s.befundOn,
                    },
                  ]}
                  checked={s.gasServiceDepsAccepted}
                  onChange={(accepted) =>
                    update({ gasServiceDepsAccepted: accepted })
                  }
                />
              </ToggleRow>

              <ToggleRow
                title={pb.gas_therme_neu.title}
                description={pb.gas_therme_neu.description}
                checked={s.gasThermeNeuOn}
                price={parts.gasThermeNeu}
                onToggle={setGasThermeNeu}
              >
                <DepBox
                  deps={[
                    {
                      label: "HST Bestand - Befundaufnahme / Statusbericht",
                      ok: s.befundOn,
                    },
                  ]}
                  checked={s.gasThermeNeuDepsAccepted}
                  onChange={(accepted) =>
                    update({ gasThermeNeuDepsAccepted: accepted })
                  }
                />
              </ToggleRow>

              <ToggleRow
                title={pb.gas_innenleitungen.title}
                description={pb.gas_innenleitungen.description}
                checked={s.gasInnenleitungenOn}
                price={parts.gasInnenleitungen}
                onToggle={setGasInnenleitungen}
                disabled={m2 <= 0}
              >
                <DepBox
                  deps={[
                    {
                      label: "HST Bestand - Befundaufnahme / Statusbericht",
                      ok: s.befundOn,
                    },
                  ]}
                  checked={s.gasInnenleitungenDepsAccepted}
                  onChange={(accepted) =>
                    update({ gasInnenleitungenDepsAccepted: accepted })
                  }
                />
              </ToggleRow>

              <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold">
                      {pb.gaszuleitung.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {formatEUR(pb.gaszuleitung.base)} +{" "}
                      {formatEUR(pb.gaszuleitung.unitPrice)}/lfm
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-sm font-semibold">
                      {formatEUR(parts.gaszuleitung)}
                    </div>
                    <Switch
                      checked={s.gaszuleitungOn}
                      onChange={(v) => update({ gaszuleitungOn: v })}
                    />
                  </div>
                </div>

                {s.gaszuleitungOn ? (
                  <div className="mt-4">
                    <QtyInput
                      label="Laufmeter (lfm)"
                      unitBadge="lfm"
                      step={0.1}
                      value={s.gaszuleitungLfm}
                      onChange={(v) => update({ gaszuleitungLfm: v })}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Zählerplatte */}
          <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold">Zählerplatte</div>

            <div className="mt-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">
                    {pb.zaehlerplatte.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {formatEUR(pb.zaehlerplatte.base)} +{" "}
                    {formatEUR(pb.zaehlerplatte.unitPrice)}/st
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold">
                    {formatEUR(parts.zaehlerplatte)}
                  </div>
                  <Switch
                    checked={s.zaehlerplatteOn}
                    onChange={(v) => update({ zaehlerplatteOn: v })}
                  />
                </div>
              </div>

              {s.zaehlerplatteOn ? (
                <div className="mt-4">
                  <QtyInput
                    label="Stück"
                    unitBadge="st"
                    step={1}
                    value={s.zaehlerplatteQty}
                    onChange={(v) =>
                      update({ zaehlerplatteQty: Math.floor(v) })
                    }
                  />
                </div>
              ) : null}
            </div>
          </div>

          {/* Total */}
          {/* <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-300">Summe Haustechnik</div>
              <div className="text-lg font-semibold">
                {formatEUR(parts.total)}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </Modal>
  );
}
