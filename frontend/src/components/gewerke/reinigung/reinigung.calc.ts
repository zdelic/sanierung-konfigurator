// reinigung.calc.ts
import { clamp0, pickRangePrice, round2 } from "./reinigung.pricebook";
import type { ReinigungPriceBook } from "./reinigung.pricebook.adapter";

export type ReinigungState = {
  note: string;

  // toggles
  raeumenNormalOn: boolean;
  raeumenStarkOn: boolean;
  endreinigungOn: boolean;
};

export const DEFAULT_REINIGUNG_STATE: ReinigungState = {
  note: "",
  raeumenNormalOn: false,
  raeumenStarkOn: false,
  endreinigungOn: false,
};

export function calcReinigungParts(
  wohnflaecheM2: number,
  s: ReinigungState,
  pb: ReinigungPriceBook,
) {
  const m2 = clamp0(wohnflaecheM2);

  // ako nema m2 => 0
  const ok = m2 > 0;

  // po logici: Normal i Stark su međusobno ekskluzivni (ne može oba)
  const raeumenNormal =
    ok && s.raeumenNormalOn ? pickRangePrice(m2, pb.raeumen_normal.ranges) : 0;
  const raeumenStark =
    ok && s.raeumenStarkOn ? pickRangePrice(m2, pb.raeumen_stark.ranges) : 0;
  const endreinigung =
    ok && s.endreinigungOn ? pickRangePrice(m2, pb.endreinigung.ranges) : 0;

  const total = round2(raeumenNormal + raeumenStark + endreinigung);

  return {
    m2,
    raeumenNormal,
    raeumenStark,
    endreinigung,
    total,
  };
}

export function calcReinigungTotal(
  wohnflaecheM2: number,
  s: ReinigungState,
  pb: ReinigungPriceBook,
) {
  return calcReinigungParts(wohnflaecheM2, s, pb).total;
}
