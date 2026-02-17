// abbruch.calc.ts
import {
  ABBRUCH_PRICEBOOK,
  pickRangePrice,
  type TeilPrice,
} from "./abbruch.pricebook";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export type Mode = "off" | "voll" | "teil";

export type AbbruchState = {
  note: string;

  // Belag / Estrich imaju Voll + Teil
  belagMode: Mode;
  belagTeilM2: number;
  belagAutoCount: number;
  belagSource: "manual" | "auto" | null;

  estrichMode: Mode;
  estrichTeilM2: number;
  estrichAutoCount: number;
  estrichSource: "manual" | "auto" | null;

  // Türen (off/voll/teil)
  tuerenMode: Mode;

  // Türen Teilleistung (⚠️ qty je ono što tvoj pricebook kaže: m² ili Stk — calcTeil rješava preko type)
  innentuerZargeOn: boolean;
  innentuerZargeQty: number;

  innentuerBlattOn: boolean;
  innentuerBlattQty: number;

  // Eingangstür pauschal
  eingangstuer: boolean;
  waendeDeckeOpen: boolean;

  // Wände/Decke (NO master toggle; Grundpauschale only if any qty > 0)
  mauerwerkQty: number; // m²
  vorsatzschaleQty: number; // m²
  deckeQty: number; // m²
  trockenbauwaendeQty: number; // m²
  kaminQty: number; // m²
  tuerdurchbruchQty: number; // Stk
};

export const DEFAULT_ABBRUCH_STATE: AbbruchState = {
  note: "",

  belagMode: "off",
  belagTeilM2: 0,
  belagAutoCount: 0,
  belagSource: null,

  estrichMode: "off",
  estrichTeilM2: 0,
  estrichAutoCount: 0,
  estrichSource: null,

  tuerenMode: "off",

  innentuerZargeOn: false,
  innentuerZargeQty: 0,

  innentuerBlattOn: false,
  innentuerBlattQty: 0,

  eingangstuer: false,
  waendeDeckeOpen: false,

  mauerwerkQty: 0,
  vorsatzschaleQty: 0,
  deckeQty: 0,
  trockenbauwaendeQty: 0,
  kaminQty: 0,
  tuerdurchbruchQty: 0,
};

// Centralized Teil calc:
// - per_area: base + rate * qty
// - per_unit: (base + rate) * qty
function calcTeil(teil: TeilPrice, qty: number) {
  const q = Math.max(0, Number(qty || 0));

  if (teil.type === "per_area") {
    return round2(teil.base + q * teil.rate);
  }

  return round2((teil.base + teil.rate) * q);
}

export function calcAbbruchParts(globalM2: number, s: AbbruchState) {
  const m2 = Math.max(0, Number(globalM2 || 0));

  // BELAG
  const belagVoll =
    s.belagMode === "voll"
      ? pickRangePrice(m2, ABBRUCH_PRICEBOOK.belag.voll)
      : 0;

  const belagTeil =
    s.belagMode === "teil"
      ? calcTeil(ABBRUCH_PRICEBOOK.belag.teil, s.belagTeilM2)
      : 0;

  // ESTRICH
  const estrichVoll =
    s.estrichMode === "voll"
      ? pickRangePrice(m2, ABBRUCH_PRICEBOOK.estrich.voll)
      : 0;

  const estrichTeil =
    s.estrichMode === "teil"
      ? calcTeil(ABBRUCH_PRICEBOOK.estrich.teil, s.estrichTeilM2)
      : 0;

  // INNENTÜREN (voll OR teil)
  const innentuerenVoll =
    s.tuerenMode === "voll"
      ? pickRangePrice(m2, ABBRUCH_PRICEBOOK.innentueren.voll)
      : 0;

  const innentuerZarge =
    s.tuerenMode === "teil" && s.innentuerZargeOn && s.innentuerZargeQty > 0
      ? calcTeil(ABBRUCH_PRICEBOOK.tuerenTeil.zarge.teil, s.innentuerZargeQty)
      : 0;

  const innentuerBlatt =
    s.tuerenMode === "teil" && s.innentuerBlattOn && s.innentuerBlattQty > 0
      ? calcTeil(ABBRUCH_PRICEBOOK.tuerenTeil.blatt.teil, s.innentuerBlattQty)
      : 0;

  const eingangstuer = s.eingangstuer
    ? ABBRUCH_PRICEBOOK.tuerenTeil.eingang.pauschal
    : 0;

  // WÄNDE / DECKE:
  // ✅ Grundpauschale (wd.base) se računa PO POZICIJI (ako qty > 0)
  const wd = ABBRUCH_PRICEBOOK.waendeDecke;

  function lineWithBase(qty: number, rate: number) {
    const q = Math.max(0, Number(qty || 0));
    if (q <= 0) return 0;
    return round2(wd.base + q * rate);
  }

  const wd_mauerwerk = lineWithBase(
    s.mauerwerkQty,
    wd.positions.mauerwerk.rate,
  );
  const wd_vorsatzschale = lineWithBase(
    s.vorsatzschaleQty,
    wd.positions.vorsatzschale.rate,
  );
  const wd_decke = lineWithBase(s.deckeQty, wd.positions.decke.rate);
  const wd_trockenbauwaende = lineWithBase(
    s.trockenbauwaendeQty,
    wd.positions.trockenbauwaende.rate,
  );
  const wd_kamin = lineWithBase(s.kaminQty, wd.positions.kamin.rate);
  const wd_tuerdurchbruch = lineWithBase(
    s.tuerdurchbruchQty,
    wd.positions.tuerdurchbruch.rate,
  );

  const waendeDecke = round2(
    wd_mauerwerk +
      wd_vorsatzschale +
      wd_decke +
      wd_trockenbauwaende +
      wd_kamin +
      wd_tuerdurchbruch,
  );

  const total = round2(
    belagVoll +
      belagTeil +
      estrichVoll +
      estrichTeil +
      innentuerenVoll +
      innentuerZarge +
      innentuerBlatt +
      eingangstuer +
      waendeDecke,
  );

  return {
    belagVoll,
    belagTeil,
    estrichVoll,
    estrichTeil,

    innentuerenVoll,
    innentuerZarge,
    innentuerBlatt,
    eingangstuer,

    waendeDecke,
    total,
  };
}

export function calcAbbruchTotal(globalM2: number, s: AbbruchState) {
  return calcAbbruchParts(globalM2, s).total;
}
