// fliesen.calc.ts
import {
  FLIESEN_PRICEBOOK,
  clamp0,
  pickRangePrice,
  round2,
} from "./fliesen.pricebook";

export type FliesenState = {
  note: string;

  bestandOn: boolean;

  neuBadWcOn: boolean;
  neuBadWcDepsAccepted: boolean;

  neuVrkueOn: boolean;
  neuVrkueDepsAccepted: boolean;

  einzelflaechenOn: boolean;
  einzelflaechenM2: number;
};

export const DEFAULT_FLIESEN_STATE: FliesenState = {
  note: "",
  bestandOn: false,

  neuBadWcOn: false,
  neuBadWcDepsAccepted: false,

  neuVrkueOn: false,
  neuVrkueDepsAccepted: false,

  einzelflaechenOn: false,
  einzelflaechenM2: 0,
};

export function calcFliesenParts(globalM2: number, s: FliesenState) {
  const m2 = clamp0(globalM2);

  const bestand = s.bestandOn
    ? pickRangePrice(m2, FLIESEN_PRICEBOOK.bestand.ranges)
    : 0;

  const neuBadWcEligible = s.neuBadWcOn && s.neuBadWcDepsAccepted;
  const neuBadWc = neuBadWcEligible
    ? pickRangePrice(m2, FLIESEN_PRICEBOOK.neuBadWc.ranges)
    : 0;

  const neuVrkueEligible = s.neuVrkueOn && s.neuVrkueDepsAccepted;
  const neuVrkue = neuVrkueEligible
    ? pickRangePrice(m2, FLIESEN_PRICEBOOK.neuVrkue.ranges)
    : 0;

  const einzelflaechenQ = clamp0(s.einzelflaechenM2);
  const einzelflaechen =
    s.einzelflaechenOn && einzelflaechenQ > 0
      ? round2(
          FLIESEN_PRICEBOOK.einzelflaechen.base +
            einzelflaechenQ * FLIESEN_PRICEBOOK.einzelflaechen.ratePerM2,
        )
      : 0;

  const total = round2(bestand + neuBadWc + neuVrkue + einzelflaechen);

  return {
    bestand,
    neuBadWcEligible,
    neuBadWc,
    neuVrkueEligible,
    neuVrkue,
    einzelflaechen,
    total,
  };
}

export function calcFliesenTotal(globalM2: number, s: FliesenState) {
  return calcFliesenParts(globalM2, s).total;
}
