// bmst.calc.ts
import { BMST_PRICEBOOK, clamp0, round2 } from "./bmst.pricebook";

export type BMSTState = {
  note: string;

  // 1) Türdurchbruch tragend
  tuerdurchbruchOn: boolean;
  tuerdurchbruchQty: number; // Stück

  // 2) Auswechslung bis 20cm (lfm) + statik fee gated
  aus20On: boolean;
  aus20Lfm: number;
  aus20AcceptStatik: boolean;

  // 3) Auswechslung bis 40cm (lfm) + statik fee gated
  aus40On: boolean;
  aus40Lfm: number;
  aus40AcceptStatik: boolean;

  // MWK
  mwkNichtTragendOn: boolean;
  mwkNichtTragendM2: number;

  mwkTragendOn: boolean;
  mwkTragendM2: number;

  // Ausmauerung / Kamin
  ausmauerungOn: boolean;
  ausmauerungM3: number;

  kaminOn: boolean;
  kaminM3: number;

  // Türchen Aufzahlung
  tuerchenOn: boolean;
  tuerchenQty: number;
};

export const DEFAULT_BMST_STATE: BMSTState = {
  note: "",

  tuerdurchbruchOn: false,
  tuerdurchbruchQty: 0,

  aus20On: false,
  aus20Lfm: 0,
  aus20AcceptStatik: false,

  aus40On: false,
  aus40Lfm: 0,
  aus40AcceptStatik: false,

  mwkNichtTragendOn: false,
  mwkNichtTragendM2: 0,

  mwkTragendOn: false,
  mwkTragendM2: 0,

  ausmauerungOn: false,
  ausmauerungM3: 0,

  kaminOn: false,
  kaminM3: 0,

  tuerchenOn: false,
  tuerchenQty: 0,
};

function calcBasePlusRate(base: number, rate: number, qty: number) {
  const q = clamp0(qty);
  return round2(base + q * rate);
}

export function calcBMSTParts(s: BMSTState) {
  const pb = BMST_PRICEBOOK;

  const tuerdurchbruch = s.tuerdurchbruchOn
    ? round2(
        clamp0(s.tuerdurchbruchQty) * pb.tuerdurchbruch_tragend.ratePerPiece,
      )
    : 0;

  // Auswechslung 20 (REQUIRED accept + lfm > 0, otherwise 0)
  const aus20Eligible =
    s.aus20On && s.aus20AcceptStatik && clamp0(s.aus20Lfm) > 0;

  const aus20Core = aus20Eligible
    ? calcBasePlusRate(
        pb.auswechslung20.base,
        pb.auswechslung20.ratePerLfm,
        s.aus20Lfm,
      )
    : 0;

  const aus20Statik = aus20Eligible ? pb.auswechslung20.statikFee : 0;
  const aus20Total = round2(aus20Core + aus20Statik);

  // Auswechslung 40 (REQUIRED accept + lfm > 0, otherwise 0)
  const aus40Eligible =
    s.aus40On && s.aus40AcceptStatik && clamp0(s.aus40Lfm) > 0;

  const aus40Core = aus40Eligible
    ? calcBasePlusRate(
        pb.auswechslung40.base,
        pb.auswechslung40.ratePerLfm,
        s.aus40Lfm,
      )
    : 0;

  const aus40Statik = aus40Eligible ? pb.auswechslung40.statikFee : 0;
  const aus40Total = round2(aus40Core + aus40Statik);

  const mwkNichtTragend = s.mwkNichtTragendOn
    ? calcBasePlusRate(
        pb.mwk_nicht_tragend.base,
        pb.mwk_nicht_tragend.ratePerM2,
        s.mwkNichtTragendM2,
      )
    : 0;

  const mwkTragend = s.mwkTragendOn
    ? calcBasePlusRate(
        pb.mwk_tragend.base,
        pb.mwk_tragend.ratePerM2,
        s.mwkTragendM2,
      )
    : 0;

  const ausmauerung = s.ausmauerungOn
    ? calcBasePlusRate(
        pb.ausmauerung_nf.base,
        pb.ausmauerung_nf.ratePerM3,
        s.ausmauerungM3,
      )
    : 0;

  const kamin = s.kaminOn
    ? calcBasePlusRate(
        pb.kamin_herstellen.base,
        pb.kamin_herstellen.ratePerM3,
        s.kaminM3,
      )
    : 0;

  const tuerchen = s.tuerchenOn
    ? round2(clamp0(s.tuerchenQty) * pb.aufz_tuerchen.ratePerPiece)
    : 0;

  const total = round2(
    tuerdurchbruch +
      aus20Total +
      aus40Total +
      mwkNichtTragend +
      mwkTragend +
      ausmauerung +
      kamin +
      tuerchen,
  );

  return {
    tuerdurchbruch,
    aus20Core,
    aus20Statik,
    aus20Total,
    aus40Core,
    aus40Statik,
    aus40Total,
    mwkNichtTragend,
    mwkTragend,
    ausmauerung,
    kamin,
    tuerchen,
    total,
  };
}

export function calcBMSTTotal(s: BMSTState) {
  return calcBMSTParts(s).total;
}
