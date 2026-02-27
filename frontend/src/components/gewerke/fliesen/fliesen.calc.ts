// fliesen.calc.ts
import {
  clamp0,
  pickRangePrice,
  round2,
  type FliesenPriceBook,
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

export function calcFliesenParts(
  globalM2: number,
  s: FliesenState,
  pb: FliesenPriceBook,
) {
  const m2 = clamp0(globalM2);

  const bestand = s.bestandOn ? pickRangePrice(m2, pb.bestand.ranges) : 0;

  const neuBadWcEligible = s.neuBadWcOn && s.neuBadWcDepsAccepted;
  const neuBadWc = neuBadWcEligible
    ? pickRangePrice(m2, pb.neuBadWc.ranges)
    : 0;

  const neuVrkueEligible = s.neuVrkueOn && s.neuVrkueDepsAccepted;
  const neuVrkue = neuVrkueEligible
    ? pickRangePrice(m2, pb.neuVrkue.ranges)
    : 0;

  const einzelflaechenQ = clamp0(s.einzelflaechenM2);
  const einzelflaechen =
    s.einzelflaechenOn && einzelflaechenQ > 0
      ? round2(
          pb.einzelflaechen.base +
            einzelflaechenQ * pb.einzelflaechen.ratePerM2,
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

export function calcFliesenTotal(
  globalM2: number,
  s: FliesenState,
  pb: FliesenPriceBook,
) {
  return calcFliesenParts(globalM2, s, pb).total;
}
