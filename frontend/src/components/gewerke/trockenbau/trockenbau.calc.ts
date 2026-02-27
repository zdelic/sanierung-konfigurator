// trockenbau.calc.ts
import {
  TROCKENBAU_KEYS,
  clamp0,
  round2,
  type TrockenbauPriceBook,
} from "./trockenbau.pricebook";

export type TrockenbauLineState = {
  on: boolean;
  qty: number;
};

export type TrockenbauState = {
  note: string;
  lines: Record<string, TrockenbauLineState>;
};

function buildDefaultLines() {
  const lines: Record<string, TrockenbauLineState> = {};
  for (const key of TROCKENBAU_KEYS) {
    lines[key] = { on: false, qty: 0 };
  }
  return lines;
}

export const DEFAULT_TROCKENBAU_STATE: TrockenbauState = {
  note: "",
  lines: buildDefaultLines(),
};

export function calcTrockenbauLine(base: number, rate: number, qty: number) {
  const q = clamp0(qty);
  if (q <= 0) return 0;
  return round2(base + q * rate);
}

export function calcTrockenbauParts(
  s: TrockenbauState,
  pb: TrockenbauPriceBook,
) {
  const parts: Record<string, number> = {};
  let total = 0;

  for (const item of pb.items) {
    const line = s.lines[item.key];
    const value =
      line && line.on ? calcTrockenbauLine(item.base, item.rate, line.qty) : 0;
    parts[item.key] = value;
    total += value;
  }

  return { parts, total: round2(total) };
}

export function calcTrockenbauTotal(
  s: TrockenbauState,
  pb: TrockenbauPriceBook,
) {
  return calcTrockenbauParts(s, pb).total;
}
