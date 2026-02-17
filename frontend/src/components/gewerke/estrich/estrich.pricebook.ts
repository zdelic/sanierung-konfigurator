// estrich.pricebook.ts

export type RangePrice = {
  min: number | null; // inclusive
  max: number | null; // inclusive
  price: number; // pauschal €
};

export type TeilLine = {
  key: string;
  title: string;
  description?: string;
  base: number;
  ratePerM2: number;
};

export const ESTRICH_PRICEBOOK = {
  neu6cm: {
    title: "Neuherstellung Estrich 6cm",
    description:
      "Neuherstellung Estrich 6cm, Dampfsperre, Trittschalldämmung EPS T 650, Baufolie, Trockenschüttung WD20",
    ranges: [
      { min: 0, max: 40, price: 3797.89 },
      { min: 41, max: 50, price: 4533.06 },
      { min: 51, max: 60, price: 5408.33 },
      { min: 61, max: 70, price: 6215.82 },
      { min: 71, max: 80, price: 6878.68 },
      { min: 81, max: 90, price: 7683.15 },
      { min: 91, max: 100, price: 8487.62 },
      { min: 101, max: null, price: 10833.24 },
    ] as RangePrice[],
  },

  teilleistungen: [
    {
      key: "einzelflaechen",
      title: "Estrich Einzelflächen inkl. Aufbau",
      base: 773.48,
      ratePerM2: 95.54,
    },
    {
      key: "verdübelung",
      title: "Verdübelung Bestandsestrich",
      base: 261.62,
      ratePerM2: 34.12,
    },
    {
      key: "trockenestrich",
      title: "Trockenestrich Einzelflächen",
      base: 545.99,
      ratePerM2: 56.87,
    },
    {
      key: "trockenestrich_ertuechtigung",
      title: "Trockenestrich Einzelflächen Ertüchtigung",
      base: 648.35,
      ratePerM2: 40.95,
    },
  ] as TeilLine[],

  beschleuniger: {
    title: "Aufzahlung Ausführung mit Estrichbeschleuniger",
    description:
      "Bei der Aufzahlung Estrich mit Estrichbeschleuniger verkürzt sich die Umbauzeit um 2 Wochen",
    ranges: [
      { min: 0, max: 40, price: 638.76 },
      { min: 41, max: 50, price: 795.43 },
      { min: 51, max: 60, price: 952.11 },
      { min: 61, max: 70, price: 1108.78 },
      { min: 71, max: 80, price: 1263.95 },
      { min: 81, max: 90, price: 1420.63 },
      { min: 91, max: 100, price: 1578.81 },
      { min: 101, max: null, price: 2050.35 },
    ] as RangePrice[],
  },
};

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function clamp0(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export function pickRangePrice(menge: number, ranges: RangePrice[]) {
  const m = clamp0(menge);
  const hit = ranges.find(
    (r) => (r.min == null || m >= r.min) && (r.max == null || m <= r.max),
  );
  return hit?.price ?? 0;
}

export function formatEUR(value: number) {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
