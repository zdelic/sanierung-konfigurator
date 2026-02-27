// estrich.calc.ts
import {
  clamp0,
  pickRangePrice,
  round2,
  type EstrichPriceBook,
  ESTRICH_TEIL_KEYS,
} from "./estrich.pricebook";

export type EstrichState = {
  note: string;

  // Neuherstellung
  neuOn: boolean;
  neuAutoCount: number;
  neuSource: "manual" | "auto" | null;

  // ✅ dependency accept checkbox (auto-enables Abbruch items)
  depsAccepted: boolean;

  // Teilleistungen
  teilOn: boolean;
  teilM2: Record<string, number>;

  // Beschleuniger (Aufzahlung) – smisleno samo uz neu
  beschleunigerOn: boolean;
};

function defaultTeilM2() {
  const map: Record<string, number> = {};
  for (const k of ESTRICH_TEIL_KEYS) map[k] = 0;
  return map;
}

export const DEFAULT_ESTRICH_STATE: EstrichState = {
  note: "",
  neuOn: false,
  neuAutoCount: 0,
  neuSource: null,
  depsAccepted: false,
  teilOn: false,
  teilM2: defaultTeilM2(),
  beschleunigerOn: false,
};

export function calcEstrichParts(
  globalM2: number,
  s: EstrichState,
  pb: EstrichPriceBook,
) {
  const m2 = clamp0(globalM2);
  const neuEligible = s.neuOn && s.depsAccepted;

  const neu = neuEligible ? pickRangePrice(m2, pb.neu6cm.ranges) : 0;
  const beschleuniger =
    neuEligible && s.beschleunigerOn
      ? pickRangePrice(m2, pb.beschleuniger.ranges)
      : 0;

  const teilLines: Record<string, number> = {};
  let teilSum = 0;

  if (s.teilOn) {
    for (const line of pb.teilleistungen) {
      const q = clamp0(s.teilM2[line.key]);
      const v = q > 0 ? round2(line.base + q * line.ratePerM2) : 0;
      teilLines[line.key] = v;
      teilSum += v;
    }
  } else {
    for (const line of pb.teilleistungen) teilLines[line.key] = 0;
  }

  const total = round2(neu + beschleuniger + teilSum);

  return {
    neuEligible,
    neu,
    beschleuniger,
    teilLines,
    teilSum: round2(teilSum),
    total,
  };
}

export function calcEstrichTotal(
  globalM2: number,
  s: EstrichState,
  pb: EstrichPriceBook,
) {
  return calcEstrichParts(globalM2, s, pb).total;
}
