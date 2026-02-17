// fenster.calc.ts
import {
  FENSTER_PRICEBOOK as pb,
  clamp0,
  pickRangePrice,
  round2,
} from "./fenster.pricebook";

export type FensterTyp = "off" | "holz_alu" | "pvc_alu" | "pvc";
export type SonnenschutzTyp =
  | "off"
  | "innenjalousie"
  | "aussenjalousie"
  | "blinos";

export type FensterState = {
  note: string;

  // ============================
  // A) POSTOJEĆI "FENSTER"
  // ============================
  servicierenOn: boolean;

  sanierungFensterOn: boolean;
  sanierungFensterM2: number;

  sanierungKastenOn: boolean;
  sanierungKastenM2: number;

  aufzPrallscheibeOn: boolean;
  aufzPrallscheibeM2: number;

  // ============================
  // B) NEU: FENSTER KONFIGURATOR (skriven iza checkboxa)
  // ============================
  konfiguratorOn: boolean;

  lichteBreiteCm: number;
  lichteHoeheCm: number;
  anzahlFenster: number;

  fensterTyp: FensterTyp;

  blindstockOn: boolean;
  mehrteiligkeitOn: boolean;

  schallschutzOn: boolean;
  schallschutzFlaecheM2: number;

  nichtTransparentOn: boolean;
  nichtTransparentFlaecheM2: number;

  oberlichteOn: boolean;
  oberlichteFlaecheM2: number;

  luefterOn: boolean;
  anzahlLuefter: number;

  sonnenschutzAbbruchOn: boolean;
  sonnenschutzTyp: SonnenschutzTyp;

  sonnenschutzAufputzOn: boolean;
  jalousienFlaecheM2: number;
};

export const DEFAULT_FENSTER_STATE: FensterState = {
  note: "",

  // A
  servicierenOn: false,

  sanierungFensterOn: false,
  sanierungFensterM2: 0,

  sanierungKastenOn: false,
  sanierungKastenM2: 0,

  aufzPrallscheibeOn: false,
  aufzPrallscheibeM2: 0,

  // B
  konfiguratorOn: false,

  lichteBreiteCm: 120,
  lichteHoeheCm: 140,
  anzahlFenster: 1,

  fensterTyp: "off",

  blindstockOn: false,
  mehrteiligkeitOn: false,

  schallschutzOn: false,
  schallschutzFlaecheM2: 0,

  nichtTransparentOn: false,
  nichtTransparentFlaecheM2: 0,

  oberlichteOn: false,
  oberlichteFlaecheM2: 0,

  luefterOn: false,
  anzahlLuefter: 0,

  sonnenschutzAbbruchOn: false,
  sonnenschutzTyp: "off",

  sonnenschutzAufputzOn: false,
  jalousienFlaecheM2: 0,
};

function basePlusRate(base: number, rate: number, m2: number, minM2 = 0) {
  const q = clamp0(m2);
  if (q <= 0) return 0;
  return round2(base + Math.max(minM2, q) * rate);
}

export function calcFensterKonfiguratorDerived(s: FensterState) {
  const b = clamp0(s.lichteBreiteCm) / 100;
  const h = clamp0(s.lichteHoeheCm) / 100;
  const stk = Math.max(0, Math.floor(clamp0(s.anzahlFenster)));

  const flaecheProFenster = round2(b * h);
  const flaecheTotal = round2(flaecheProFenster * stk);

  return { flaecheProFenster, flaecheTotal, stk };
}

export function calcFensterParts(globalM2: number, s: FensterState) {
  const m2 = clamp0(globalM2);

  // ============================
  // A) POSTOJEĆI "FENSTER"
  // ============================
  const servicieren = s.servicierenOn
    ? pickRangePrice(m2, pb.servicieren.ranges)
    : 0;

  const sanierungFenster =
    s.sanierungFensterOn && clamp0(s.sanierungFensterM2) > 0
      ? basePlusRate(
          pb.sanierung_bestandsfenster.base,
          pb.sanierung_bestandsfenster.ratePerM2,
          s.sanierungFensterM2,
          pb.sanierung_bestandsfenster.minM2,
        )
      : 0;

  const sanierungKasten =
    s.sanierungKastenOn && clamp0(s.sanierungKastenM2) > 0
      ? basePlusRate(
          pb.sanierung_bestandskastenfenster.base,
          pb.sanierung_bestandskastenfenster.ratePerM2,
          s.sanierungKastenM2,
          pb.sanierung_bestandskastenfenster.minM2,
        )
      : 0;

  const aufzPrallscheibe =
    s.aufzPrallscheibeOn && clamp0(s.aufzPrallscheibeM2) > 0
      ? basePlusRate(
          pb.aufz_prallscheibe.base,
          pb.aufz_prallscheibe.ratePerM2,
          s.aufzPrallscheibeM2,
          pb.aufz_prallscheibe.minM2,
        )
      : 0;

  const totalBasic = round2(
    servicieren + sanierungFenster + sanierungKasten + aufzPrallscheibe,
  );

  // ============================
  // B) FENSTER KONFIGURATOR (samo ako konfiguratorOn)
  // ============================
  const d = calcFensterKonfiguratorDerived(s);
  const A = d.flaecheTotal;

  let k_grundpauschale = 0;
  let k_abbruchFenster = 0;
  let k_fensterTyp = 0;
  let k_blindstock = 0;
  let k_mehrteiligkeit = 0;
  let k_schallschutz = 0;
  let k_nichtTransparent = 0;
  let k_oberlichte = 0;
  let k_luefter = 0;
  let k_sonnenschutzAbbruch = 0;
  let k_sonnenschutzMontage = 0;
  let k_sonnenschutzAufputz = 0;

  if (s.konfiguratorOn && A > 0) {
    k_grundpauschale = pb.grundpauschale_fenstertausch;
    k_abbruchFenster = round2(pb.abbruch_bestehender_fenster_per_m2 * A);

    if (s.fensterTyp === "holz_alu")
      k_fensterTyp = round2(pb.typ_holz_alu_per_m2 * A);
    if (s.fensterTyp === "pvc_alu")
      k_fensterTyp = round2(pb.typ_pvc_alu_per_m2 * A);
    if (s.fensterTyp === "pvc") k_fensterTyp = round2(pb.typ_pvc_per_m2 * A);

    k_blindstock = s.blindstockOn ? round2(pb.blindstock_per_m2 * A) : 0;
    k_mehrteiligkeit = s.mehrteiligkeitOn
      ? round2(pb.mehrteiligkeit_per_m2 * A)
      : 0;

    const schA = clamp0(s.schallschutzFlaecheM2);
    k_schallschutz =
      s.schallschutzOn && schA > 0
        ? round2(pb.schallschutz_43db_per_m2 * schA)
        : 0;

    const ntA = clamp0(s.nichtTransparentFlaecheM2);
    k_nichtTransparent =
      s.nichtTransparentOn && ntA > 0
        ? round2(pb.nicht_transparent_per_m2 * ntA)
        : 0;

    const obA = clamp0(s.oberlichteFlaecheM2);
    k_oberlichte =
      s.oberlichteOn && obA > 0 ? round2(pb.oberlichte_per_m2 * obA) : 0;

    const lQty = Math.max(0, Math.floor(clamp0(s.anzahlLuefter)));
    k_luefter = s.luefterOn && lQty > 0 ? round2(pb.luefter_per_stk * lQty) : 0;

    k_sonnenschutzAbbruch = s.sonnenschutzAbbruchOn
      ? round2(pb.abbruch_sonnenschutz_per_m2 * A)
      : 0;

    if (s.sonnenschutzTyp === "innenjalousie")
      k_sonnenschutzMontage = round2(pb.montage_innenjalousien_per_m2 * A);
    if (s.sonnenschutzTyp === "aussenjalousie")
      k_sonnenschutzMontage = round2(pb.montage_aussenjalousien_per_m2 * A);
    if (s.sonnenschutzTyp === "blinos")
      k_sonnenschutzMontage = round2(pb.montage_blinos_rollo_per_m2 * A);

    const jalA = clamp0(s.jalousienFlaecheM2);
    k_sonnenschutzAufputz =
      s.sonnenschutzAufputzOn && jalA > 0
        ? round2(pb.aufz_sonnenschutz_aufputz_per_m2 * jalA)
        : 0;
  }

  const totalKonfigurator = round2(
    k_grundpauschale +
      k_abbruchFenster +
      k_fensterTyp +
      k_blindstock +
      k_mehrteiligkeit +
      k_schallschutz +
      k_nichtTransparent +
      k_oberlichte +
      k_luefter +
      k_sonnenschutzAbbruch +
      k_sonnenschutzMontage +
      k_sonnenschutzAufputz,
  );

  const total = round2(totalBasic + totalKonfigurator);

  return {
    // A
    servicieren,
    sanierungFenster,
    sanierungKasten,
    aufzPrallscheibe,
    totalBasic,

    // B derived
    k_flaecheProFenster: d.flaecheProFenster,
    k_flaecheTotal: d.flaecheTotal,

    // B parts
    k_grundpauschale,
    k_abbruchFenster,
    k_fensterTyp,
    k_blindstock,
    k_mehrteiligkeit,
    k_schallschutz,
    k_nichtTransparent,
    k_oberlichte,
    k_luefter,
    k_sonnenschutzAbbruch,
    k_sonnenschutzMontage,
    k_sonnenschutzAufputz,

    totalKonfigurator,
    total,
  };
}

export function calcFensterTotal(globalM2: number, s: FensterState) {
  return calcFensterParts(globalM2, s).total;
}
