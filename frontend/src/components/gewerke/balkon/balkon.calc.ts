// balkon.calc.ts
import { clamp0, pickRangePrice, round2 } from "./balkon.pricebook";
import type { BalkonPriceBook } from "./balkon.pricebook.adapter";

export type BalkonMainChoice =
  | "off"
  | "bestand"
  | "sanierung_ohne_daemmung"
  | "sanierung_mit_daemmung"
  | "sanierung_mit_daemmung_attika";

export type BalkonState = {
  note: string;

  balkonM2: number;

  main: BalkonMainChoice;

  // Aufzahlungen (samo ako je sanierung_* izabrano)
  stelzlagerOn: boolean;
  feinsteinzeugOn: boolean;
  holzLaercheOn: boolean;
  brandschutzOn: boolean;
  rinneOn: boolean;
  abdichtung3On: boolean;
  gefaelleOn: boolean;
  purOn: boolean;
};

export const DEFAULT_BALKON_STATE: BalkonState = {
  note: "",
  balkonM2: 0,

  main: "off",

  stelzlagerOn: false,
  feinsteinzeugOn: false,
  holzLaercheOn: false,
  brandschutzOn: false,
  rinneOn: false,
  abdichtung3On: false,
  gefaelleOn: false,
  purOn: false,
};

export function calcBalkonParts(s: BalkonState, pb: BalkonPriceBook) {
  const m2 = clamp0(s.balkonM2);

  const mainPrice =
    s.main === "bestand"
      ? pickRangePrice(m2, pb.bestand.ranges)
      : s.main === "sanierung_ohne_daemmung"
        ? pickRangePrice(m2, pb.sanierung_ohne_daemmung.ranges)
        : s.main === "sanierung_mit_daemmung"
          ? pickRangePrice(m2, pb.sanierung_mit_daemmung.ranges)
          : s.main === "sanierung_mit_daemmung_attika"
            ? pickRangePrice(m2, pb.sanierung_mit_daemmung_attika.ranges)
            : 0;

  const sanierungSelected =
    s.main === "sanierung_ohne_daemmung" ||
    s.main === "sanierung_mit_daemmung" ||
    s.main === "sanierung_mit_daemmung_attika";

  // Aufzahlungen samo ako je sanierungSelected i m2>0
  const aufz = sanierungSelected && m2 > 0;

  const stelzlager =
    aufz && s.stelzlagerOn ? pickRangePrice(m2, pb.aufz_stelzlager.ranges) : 0;
  const feinsteinzeug =
    aufz && s.feinsteinzeugOn
      ? pickRangePrice(m2, pb.aufz_feinsteinzeug.ranges)
      : 0;
  const holzLaerche =
    aufz && s.holzLaercheOn
      ? pickRangePrice(m2, pb.aufz_holz_laerche.ranges)
      : 0;
  const brandschutz =
    aufz && s.brandschutzOn
      ? pickRangePrice(m2, pb.aufz_brandschutz.ranges)
      : 0;
  const rinne =
    aufz && s.rinneOn ? pickRangePrice(m2, pb.aufz_rinne.ranges) : 0;
  const abdichtung3 =
    aufz && s.abdichtung3On
      ? pickRangePrice(m2, pb.aufz_abdichtung_3_lage.ranges)
      : 0;
  const gefaelle =
    aufz && s.gefaelleOn
      ? pickRangePrice(m2, pb.aufz_gefaelledaemmung.ranges)
      : 0;
  const pur =
    aufz && s.purOn ? pickRangePrice(m2, pb.aufz_pur_daemmung.ranges) : 0;

  const totalAufz = round2(
    stelzlager +
      feinsteinzeug +
      holzLaerche +
      brandschutz +
      rinne +
      abdichtung3 +
      gefaelle +
      pur,
  );

  const total = round2(mainPrice + totalAufz);

  return {
    m2,
    mainPrice,
    sanierungSelected,
    stelzlager,
    feinsteinzeug,
    holzLaerche,
    brandschutz,
    rinne,
    abdichtung3,
    gefaelle,
    pur,
    totalAufz,
    total,
  };
}

export function calcBalkonTotal(
  _: number,
  s: BalkonState,
  pb: BalkonPriceBook,
) {
  return calcBalkonParts(s, pb).total;
}
