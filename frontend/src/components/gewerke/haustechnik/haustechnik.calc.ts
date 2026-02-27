// haustechnik.calc.ts
import { clamp0, pickRangePrice, round2 } from "./haustechnik.pricebook";
import type { HaustechnikPriceBook } from "./haustechnik.pricebook.adapter";

export type BelagChoice = "none" | "teppich" | "laminat" | "parkett";

export type HaustechnikState = {
  note: string;

  // base
  befundOn: boolean;
  befundSource: "manual" | "auto" | null;

  // Heizung
  heizkoerperOn: boolean;
  heizkoerperSource: "manual" | "auto" | null;
  heizleitungenOn: boolean;
  heizleitungenSource: "manual" | "auto" | null;
  heizleitungenBelag: BelagChoice; // Pflicht wenn heizleitungenOn
  sockelkanalOn: boolean;
  fbhOn: boolean;
  abbruchEstrichOn: boolean; // dependency helper (intern)
  abbruchBelagOn: boolean; // dependency helper (intern)
  kuehlHeizdeckeOn: boolean;
  // NEW: remembers if Haustechnik auto-set Boden neu Belag
  bodenBelagAutoApplied: BelagChoice | null;

  // Lüftung
  filtertauschOn: boolean;
  ventilatorOn: boolean;
  lueftungszuleitungOn: boolean;
  lueftungszuleitungLfm: number;

  // Sanitär
  badGesamtOn: boolean;
  fallstrangOn: boolean;
  zusDuscheOn: boolean;
  vollglasOn: boolean;
  zusWTOn: boolean;
  wtTauschOn: boolean;
  wcTauschOn: boolean;
  wanneDuscheTauschOn: boolean;
  gebrauchOn: boolean;
  kuecheAufputzOn: boolean;

  aufzSprossenOn: boolean;
  aufzHaengeWCOn: boolean;
  aufzDuschtasseOn: boolean;
  behindertOn: boolean;

  klappsitzOn: boolean;
  armaturOn: boolean;
  wcSensorOn: boolean;
  gebrauch2On: boolean;
  untertisch10lOn: boolean;
  eSpeicherOn: boolean;

  // Gas
  gasPruefungOn: boolean;
  gasServiceOn: boolean;
  gasThermeNeuOn: boolean;
  gasInnenleitungenOn: boolean;
  gaszuleitungOn: boolean;
  gaszuleitungLfm: number;

  // Zählerplatte
  zaehlerplatteOn: boolean;
  zaehlerplatteQty: number;

  // dependency accepts
  heizkoerperDepsAccepted: boolean;
  heizleitungenDepsAccepted: boolean;
  sockelkanalDepsAccepted: boolean;
  fbhDepsAccepted: boolean;
  kuehlHeizdeckeDepsAccepted: boolean;

  filtertauschDepsAccepted: boolean;
  ventilatorDepsAccepted: boolean;

  kuecheAufputzDepsAccepted: boolean;
  badGesamtDepsAccepted: boolean;
  fallstrangDepsAccepted: boolean;

  gasPruefungDepsAccepted: boolean;
  gasServiceDepsAccepted: boolean;
  gasThermeNeuDepsAccepted: boolean;
  gasInnenleitungenDepsAccepted: boolean;
};

export const DEFAULT_HAUSTECHNIK_STATE: HaustechnikState = {
  note: "",

  befundOn: false,
  befundSource: null,

  heizkoerperOn: false,
  heizkoerperSource: null,
  heizleitungenOn: false,
  heizleitungenSource: null,
  heizleitungenBelag: "none",
  sockelkanalOn: false,
  fbhOn: false,
  abbruchEstrichOn: false,
  abbruchBelagOn: false,
  kuehlHeizdeckeOn: false,
  bodenBelagAutoApplied: null,

  filtertauschOn: false,
  ventilatorOn: false,
  lueftungszuleitungOn: false,
  lueftungszuleitungLfm: 0,

  badGesamtOn: false,
  fallstrangOn: false,
  zusDuscheOn: false,
  vollglasOn: false,
  zusWTOn: false,
  wtTauschOn: false,
  wcTauschOn: false,
  wanneDuscheTauschOn: false,
  gebrauchOn: false,
  kuecheAufputzOn: false,

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

  gasPruefungOn: false,
  gasServiceOn: false,
  gasThermeNeuOn: false,
  gasInnenleitungenOn: false,
  gaszuleitungOn: false,
  gaszuleitungLfm: 0,

  zaehlerplatteOn: false,
  zaehlerplatteQty: 1,
  heizkoerperDepsAccepted: false,
  heizleitungenDepsAccepted: false,
  sockelkanalDepsAccepted: false,
  fbhDepsAccepted: false,
  kuehlHeizdeckeDepsAccepted: false,

  filtertauschDepsAccepted: false,
  ventilatorDepsAccepted: false,

  kuecheAufputzDepsAccepted: false,
  badGesamtDepsAccepted: false,
  fallstrangDepsAccepted: false,

  gasPruefungDepsAccepted: false,
  gasServiceDepsAccepted: false,
  gasThermeNeuDepsAccepted: false,
  gasInnenleitungenDepsAccepted: false,
};

function clampInt0(v: unknown) {
  const n = clamp0(v);
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

export function calcHaustechnikParts(
  wohnflaecheM2: number,
  s: HaustechnikState,
  pb: HaustechnikPriceBook,
) {
  const m2 = clamp0(wohnflaecheM2);

  // --- Dependencies ---
  const befundIncluded =
    !!s.befundOn ||
    s.heizkoerperOn ||
    s.heizleitungenOn ||
    s.sockelkanalOn ||
    s.fbhOn ||
    s.kuehlHeizdeckeOn ||
    s.filtertauschOn ||
    s.ventilatorOn ||
    s.lueftungszuleitungOn ||
    s.badGesamtOn ||
    s.fallstrangOn ||
    s.kuecheAufputzOn ||
    s.aufzSprossenOn ||
    s.aufzHaengeWCOn ||
    s.aufzDuschtasseOn ||
    s.behindertOn ||
    s.gasPruefungOn ||
    s.gasServiceOn ||
    s.gasThermeNeuOn ||
    s.gasInnenleitungenOn ||
    s.gaszuleitungOn ||
    s.zaehlerplatteOn;

  const befundPrice =
    s.befundOn && m2 > 0 ? pickRangePrice(m2, pb.befund.ranges) : 0;

  // Heizung
  const heizkoerper =
    s.heizkoerperOn && s.heizkoerperDepsAccepted && m2 > 0
      ? pickRangePrice(m2, pb.heizkoerper_tausch.ranges)
      : 0;

  // Heizleitungen: zahtijeva heizkoerper + obavezan belag izbor
  const belagOk = !s.heizleitungenOn || s.heizleitungenBelag !== "none";

  const heizleitungen =
    s.heizleitungenOn && s.heizleitungenDepsAccepted && m2 > 0 && belagOk
      ? pickRangePrice(m2, pb.heizleitungen_tausch.ranges)
      : 0;

  const sockelkanal =
    s.sockelkanalOn &&
    s.heizleitungenOn &&
    s.heizleitungenDepsAccepted &&
    m2 > 0
      ? pickRangePrice(m2, pb.aufz_sockelkanal.ranges)
      : 0;

  const fbh =
    s.fbhOn && s.heizleitungenOn && s.heizleitungenDepsAccepted && m2 > 0
      ? pickRangePrice(m2, pb.aufz_fbh.ranges) // ili kako već računaš
      : 0;

  const kuehlHeizdecke =
    s.kuehlHeizdeckeOn && s.kuehlHeizdeckeDepsAccepted && m2 > 0
      ? round2(m2 * pb.kuehl_heizdecke.perM2)
      : 0;

  // Lüftung
  const filtertausch =
    s.filtertauschOn && s.filtertauschDepsAccepted && m2 > 0
      ? pickRangePrice(m2, pb.lueftung_filter.ranges)
      : 0;

  const ventilator =
    s.ventilatorOn && s.ventilatorDepsAccepted && m2 > 0
      ? pb.lueftung_ventilator.price
      : 0;

  const lzLfm = clamp0(s.lueftungszuleitungLfm);
  const lueftungszuleitung = s.lueftungszuleitungOn
    ? pb.lueftungszuleitung.base + pb.lueftungszuleitung.unitPrice * lzLfm
    : 0;

  // Sanitär
  const badGesamt =
    s.badGesamtOn && s.badGesamtDepsAccepted ? pb.sanitaer_bad_gesamt.price : 0;

  const fallstrang =
    s.fallstrangOn && s.fallstrangDepsAccepted
      ? pb.sanitaer_fallstrang.price
      : 0;
  const zusDusche = s.zusDuscheOn ? pb.sanitaer_zus_dusche.price : 0;
  const vollglas = s.vollglasOn ? pb.aufz_vollglas.price : 0;
  const zusWT = s.zusWTOn ? pb.sanitaer_zus_wt.price : 0;
  const wtTausch = s.wtTauschOn ? pb.sanitaer_wt_tausch.price : 0;
  const wcTausch = s.wcTauschOn ? pb.sanitaer_wc_tausch.price : 0;
  const wanneDuscheTausch = s.wanneDuscheTauschOn
    ? pb.sanitaer_wanne_dusche_tausch.price
    : 0;
  const gebrauch = s.gebrauchOn ? pb.sanitaer_gebrauch.price : 0;
  const kuecheAufputz =
    s.kuecheAufputzOn && s.kuecheAufputzDepsAccepted
      ? pb.sanitaer_kueche_aufputz.price
      : 0;

  const aufzSprossen =
    s.aufzSprossenOn && s.badGesamtOn ? pb.aufz_sprossen_e.price : 0;
  const aufzHaengeWC =
    s.aufzHaengeWCOn && s.badGesamtOn ? pb.aufz_haenge_wc.price : 0;
  const aufzDuschtasse =
    s.aufzDuschtasseOn && s.badGesamtOn ? pb.aufz_duschtasse.price : 0;

  const behindert = s.behindertOn && m2 > 0 ? pb.behindertengerecht.price : 0;

  const klappsitz = s.klappsitzOn ? pb.klappsitz.price : 0;
  const armatur = s.armaturOn ? pb.armatur.price : 0;
  const wcSensor = s.wcSensorOn ? pb.wc_sensor.price : 0;
  const gebrauch2 = s.gebrauch2On ? pb.gebrauch_2.price : 0;
  const untertisch10l = s.untertisch10lOn ? pb.untertisch_10l.price : 0;
  const eSpeicher = s.eSpeicherOn ? pb.e_speicher.price : 0;

  // Gas
  const gasPruefung =
    s.gasPruefungOn && s.gasPruefungDepsAccepted ? pb.gas_pruefung.price : 0;

  const gasService =
    s.gasServiceOn && s.gasServiceDepsAccepted ? pb.gas_service.price : 0;

  const gasThermeNeu =
    s.gasThermeNeuOn && s.gasThermeNeuDepsAccepted
      ? pb.gas_therme_neu.price
      : 0;

  const gasInnenleitungen =
    s.gasInnenleitungenOn && s.gasInnenleitungenDepsAccepted && m2 > 0
      ? pickRangePrice(m2, pb.gas_innenleitungen.ranges)
      : 0;
  const gzLfm = clamp0(s.gaszuleitungLfm);
  const gaszuleitung = s.gaszuleitungOn
    ? pb.gaszuleitung.base + pb.gaszuleitung.unitPrice * gzLfm
    : 0;

  const zaehlerQty = clampInt0(s.zaehlerplatteQty);
  const zaehlerplatte = s.zaehlerplatteOn
    ? pb.zaehlerplatte.base + pb.zaehlerplatte.unitPrice * zaehlerQty
    : 0;

  const heizungTotal = round2(
    heizkoerper + heizleitungen + sockelkanal + fbh + kuehlHeizdecke,
  );
  const lueftungTotal = round2(filtertausch + ventilator + lueftungszuleitung);
  const sanitaerTotal = round2(
    badGesamt +
      fallstrang +
      zusDusche +
      vollglas +
      zusWT +
      wtTausch +
      wcTausch +
      wanneDuscheTausch +
      gebrauch +
      kuecheAufputz +
      aufzSprossen +
      aufzHaengeWC +
      aufzDuschtasse +
      behindert +
      klappsitz +
      armatur +
      wcSensor +
      gebrauch2 +
      untertisch10l +
      eSpeicher,
  );
  const gasTotal = round2(
    gasPruefung + gasService + gasThermeNeu + gasInnenleitungen + gaszuleitung,
  );
  const sonstigesTotal = round2(zaehlerplatte);

  const total = round2(
    befundPrice +
      heizungTotal +
      lueftungTotal +
      sanitaerTotal +
      gasTotal +
      sonstigesTotal,
  );

  return {
    m2,
    befundIncluded,
    belagOk,

    befundPrice,

    heizkoerper,
    heizleitungen,
    sockelkanal,
    fbh,
    kuehlHeizdecke,
    heizungTotal,

    filtertausch,
    ventilator,
    lueftungszuleitung,
    lueftungTotal,

    badGesamt,
    fallstrang,
    zusDusche,
    vollglas,
    zusWT,
    wtTausch,
    wcTausch,
    wanneDuscheTausch,
    gebrauch,
    kuecheAufputz,
    aufzSprossen,
    aufzHaengeWC,
    aufzDuschtasse,
    behindert,
    klappsitz,
    armatur,
    wcSensor,
    gebrauch2,
    untertisch10l,
    eSpeicher,
    sanitaerTotal,

    gasPruefung,
    gasService,
    gasThermeNeu,
    gasInnenleitungen,
    gaszuleitung,
    gasTotal,

    zaehlerplatte,
    sonstigesTotal,

    total,
  };
}

export function calcHaustechnikTotal(
  wohnflaecheM2: number,
  s: HaustechnikState,
  pb: HaustechnikPriceBook,
) {
  return calcHaustechnikParts(wohnflaecheM2, s, pb).total;
}
