// elektro.calc.ts
import { clamp0, pickRangePrice, round2 } from "./elektro.pricebook";
import type { ElektroPriceBook } from "./elektro.pricebook.adapter";

export type InfrarotVariantKey = "190w" | "300w" | "675w" | "890w" | "1050w";

export type ElektroState = {
  note: string;

  // Wohnungsbezogen (m²)
  befundOn: boolean;
  wohnungsverteilerOn: boolean;
  grundinstallationOn: boolean;
  schalterOn: boolean;

  // Teilsanierung (fix)
  kleinePauschaleOn: boolean;
  erdungOn: boolean;

  // Raumweise (qty st)
  raum10Qty: number;
  raum10LeerQty: number;

  raum15Qty: number;
  raum15LeerQty: number;

  raum20Qty: number;
  raum20LeerQty: number;

  raum30Qty: number;
  raum30LeerQty: number;

  raum40Qty: number;
  raum40LeerQty: number;

  // Infrarot
  infrarotOn: boolean;
  infrarotVariant: InfrarotVariantKey;
  infrarotQty: number;
  infrarotFunkQty: number;
  infrarotThermostatQty: number;

  // Base + Unit
  wohnungszuleitungOn: boolean;
  wohnungszuleitungLfm: number;

  zaehlerplatzOn: boolean;
  zaehlerplatzQty: number; // st
};

export const DEFAULT_ELEKTRO_STATE: ElektroState = {
  note: "",

  befundOn: false,
  wohnungsverteilerOn: false,
  grundinstallationOn: false,
  schalterOn: false,

  kleinePauschaleOn: false,
  erdungOn: false,

  raum10Qty: 0,
  raum10LeerQty: 0,
  raum15Qty: 0,
  raum15LeerQty: 0,
  raum20Qty: 0,
  raum20LeerQty: 0,
  raum30Qty: 0,
  raum30LeerQty: 0,
  raum40Qty: 0,
  raum40LeerQty: 0,

  infrarotOn: false,
  infrarotVariant: "190w",
  infrarotQty: 0,
  infrarotFunkQty: 0,
  infrarotThermostatQty: 0,

  wohnungszuleitungOn: false,
  wohnungszuleitungLfm: 0,

  zaehlerplatzOn: false,
  zaehlerplatzQty: 1,
};

function clampInt0(v: unknown) {
  const n = clamp0(v);
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

export function calcElektroParts(
  wohnflaecheM2: number,
  s: ElektroState,
  pb: ElektroPriceBook,
) {
  const m2 = clamp0(wohnflaecheM2);

  // Dependencies:
  // Wohnungsverteiler + Schalter => Befundaufnahme required
  const befundIncluded =
    !!s.befundOn || !!s.wohnungsverteilerOn || !!s.schalterOn;

  const befundPrice =
    befundIncluded && m2 > 0 ? pickRangePrice(m2, pb.befundaufnahme.ranges) : 0;

  const wohnungsverteiler = s.wohnungsverteilerOn
    ? pb.wohnungsverteiler.price
    : 0;

  const grundinstallation =
    s.grundinstallationOn && m2 > 0
      ? pickRangePrice(m2, pb.grundinstallation.ranges)
      : 0;

  const schalter =
    s.schalterOn && m2 > 0
      ? pickRangePrice(m2, pb.schalter_stecker_sprechst.ranges)
      : 0;

  const kleinePauschale = s.kleinePauschaleOn ? pb.kleine_e_pauschale.price : 0;
  const erdung = s.erdungOn ? pb.erdung_badewanne.price : 0;

  const raum10 = pb.e_raum_bis_10.price * clampInt0(s.raum10Qty);
  const raum10Leer = pb.e_raum_bis_10_leer.price * clampInt0(s.raum10LeerQty);

  const raum15 = pb.e_raum_bis_15.price * clampInt0(s.raum15Qty);
  const raum15Leer = pb.e_raum_bis_15_leer.price * clampInt0(s.raum15LeerQty);

  const raum20 = pb.e_raum_bis_20.price * clampInt0(s.raum20Qty);
  const raum20Leer = pb.e_raum_bis_20_leer.price * clampInt0(s.raum20LeerQty);

  const raum30 = pb.e_raum_bis_30.price * clampInt0(s.raum30Qty);
  const raum30Leer = pb.e_raum_bis_30_leer.price * clampInt0(s.raum30LeerQty);

  const raum40 = pb.e_raum_bis_40.price * clampInt0(s.raum40Qty);
  const raum40Leer = pb.e_raum_bis_40_leer.price * clampInt0(s.raum40LeerQty);

  // Infrarot
  const infrQty = clampInt0(s.infrarotQty);
  const infrVariant =
    pb.infrarot_panel.variants.find((v) => v.key === s.infrarotVariant) ??
    pb.infrarot_panel.variants[0];

  const infrBase =
    s.infrarotOn && infrQty > 0
      ? round2(infrVariant.base + infrVariant.pricePerSt * infrQty)
      : 0;

  const funkQty = clampInt0(s.infrarotFunkQty);
  const thermoQty = clampInt0(s.infrarotThermostatQty);

  const infrFunk =
    funkQty > 0 ? round2(pb.infrarot_panel.aufz_funk.pricePerSt * funkQty) : 0;

  const infrThermo =
    thermoQty > 0
      ? round2(pb.infrarot_panel.aufz_raumthermostat.pricePerSt * thermoQty)
      : 0;

  // Base + unit
  const wohnungszuleitungLfm = clamp0(s.wohnungszuleitungLfm);
  const wohnungszuleitung = s.wohnungszuleitungOn
    ? pb.wohnungszuleitung.base +
      pb.wohnungszuleitung.unitPrice * wohnungszuleitungLfm
    : 0;

  const zaehlerQty = Math.max(0, clampInt0(s.zaehlerplatzQty));
  const zaehlerplatz = s.zaehlerplatzOn
    ? pb.zaehlerplatz.base + pb.zaehlerplatz.unitPrice * zaehlerQty
    : 0;

  const wohnungsbezogenTotal = round2(
    befundPrice + wohnungsverteiler + grundinstallation + schalter,
  );
  const teilsanierungTotal = round2(
    kleinePauschale +
      erdung +
      raum10 +
      raum10Leer +
      raum15 +
      raum15Leer +
      raum20 +
      raum20Leer +
      raum30 +
      raum30Leer +
      raum40 +
      raum40Leer +
      infrBase +
      infrFunk +
      infrThermo,
  );
  const sonstigesTotal = round2(wohnungszuleitung + zaehlerplatz);

  const total = round2(
    wohnungsbezogenTotal + teilsanierungTotal + sonstigesTotal,
  );

  return {
    m2,

    // dependency info
    befundIncluded,

    // wohnungsbezogen
    befundPrice,
    wohnungsverteiler,
    grundinstallation,
    schalter,
    wohnungsbezogenTotal,

    // teilsanierung
    kleinePauschale,
    erdung,
    raum10,
    raum10Leer,
    raum15,
    raum15Leer,
    raum20,
    raum20Leer,
    raum30,
    raum30Leer,
    raum40,
    raum40Leer,
    infrBase,
    infrFunk,
    infrThermo,
    teilsanierungTotal,

    // base+unit
    wohnungszuleitung,
    zaehlerplatz,
    sonstigesTotal,

    total,
  };
}

export function calcElektroTotal(
  wohnflaecheM2: number,
  s: ElektroState,
  pb: ElektroPriceBook,
) {
  return calcElektroParts(wohnflaecheM2, s, pb).total;
}
