// tischler.calc.ts
import {
  clamp0,
  pickRangePrice,
  round2,
  type TischlerPriceBook,
  TISCHLER_QTY_KEYS,
} from "./tischler.pricebook";

function defaultQty(): Record<string, number> {
  const m: Record<string, number> = {};
  for (const k of TISCHLER_QTY_KEYS) m[k] = 0;
  return m;
}

export type TischlerState = {
  note: string;

  bestandOn: boolean;

  // base+rate items (qty)
  qty: Record<string, number>;

  // tiered (global m²) toggles
  neuEingangOn: boolean;
  neuEingangDepsAccepted: boolean;

  neuInnentuerenOn: boolean;

  neuZargenOn: boolean;
  neuZargenDepsAccepted: boolean;
};

export const DEFAULT_TISCHLER_STATE: TischlerState = {
  note: "",
  bestandOn: false,
  qty: defaultQty(),

  neuEingangOn: false,
  neuEingangDepsAccepted: false,

  neuInnentuerenOn: false,

  neuZargenOn: false,
  neuZargenDepsAccepted: false,
};

function calcBasePlusRate(base: number, rate: number, qty: number) {
  const q = clamp0(qty);
  if (q <= 0) return 0;
  return round2(base + q * rate);
}

function calcRateOnly(rate: number, qty: number) {
  const q = clamp0(qty);
  if (q <= 0) return 0;
  return round2(q * rate);
}

export function calcTischlerParts(
  globalM2: number,
  s: TischlerState,
  pb: TischlerPriceBook,
) {
  const m2 = clamp0(globalM2);

  const bestand = s.bestandOn ? pickRangePrice(m2, pb.bestand.ranges) : 0;

  // Neu Eingang: gated by depsAccepted
  const neuEingangEligible = s.neuEingangOn && s.neuEingangDepsAccepted;
  const neuEingang =
    neuEingangEligible && pb.neu_eingang.kind === "tier"
      ? pickRangePrice(m2, pb.neu_eingang.ranges)
      : 0;

  // Neu Innentüren: no dependency
  const neuInnentueren =
    s.neuInnentuerenOn && pb.neu_innentueren.kind === "tier"
      ? pickRangePrice(m2, pb.neu_innentueren.ranges)
      : 0;

  // Neu Zargen: gated by depsAccepted
  const neuZargenEligible = s.neuZargenOn && s.neuZargenDepsAccepted;
  const neuZargen =
    neuZargenEligible && pb.neu_zargen.kind === "tier"
      ? pickRangePrice(m2, pb.neu_zargen.ranges)
      : 0;

  // Qty-based lines
  const lines: Record<string, number> = {};
  let qtySum = 0;

  const basePlus = [
    pb.sanierung_2m2_simple,
    pb.aufzahlung_2m2_aufwendig,
    pb.sanierung_4m2_simple,
    pb.aufzahlung_4m2_aufwendig,
    pb.neu_innentueren_glasausschnitt,
    pb.innentuere_80x200,
    pb.zarge_80x200,
  ] as const;

  for (const item of basePlus) {
    if (item.kind !== "base_plus_rate") continue; // ✅ type narrowing
    const v = calcBasePlusRate(item.base, item.rate, s.qty[item.key]);
    lines[item.key] = v;
    qtySum += v;
  }

  const rateOnly = [
    pb.whg_eingang_h250,
    pb.whg_eingang_2fluegelig_h250,
    pb.balkon_bis3,
    pb.balkon_ueber3,
    pb.kasten_bis3,
    pb.kasten_3_5,
    pb.anstrich_eingang,
    pb.anstrich_balkon,
    pb.anstrich_kasten,
  ] as const;

  for (const item of rateOnly) {
    if (item.kind !== "rate_only") continue; // ✅ type narrowing
    const v = calcRateOnly(item.rate, s.qty[item.key]);
    lines[item.key] = v;
    qtySum += v;
  }

  const total = round2(
    bestand + neuEingang + neuInnentueren + neuZargen + qtySum,
  );

  return {
    bestand,
    neuEingangEligible,
    neuEingang,
    neuInnentueren,
    neuZargenEligible,
    neuZargen,
    lines,
    qtySum: round2(qtySum),
    total,
  };
}

export function calcTischlerTotal(
  globalM2: number,
  s: TischlerState,
  pb: TischlerPriceBook,
) {
  return calcTischlerParts(globalM2, s, pb).total;
}
