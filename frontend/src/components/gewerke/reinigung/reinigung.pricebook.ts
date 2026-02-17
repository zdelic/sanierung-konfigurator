// reinigung.pricebook.ts
export type RangePrice = {
  min: number | null;
  max: number | null;
  price: number;
};

export const REINIGUNG_PRICEBOOK = {
  meta: {
    title: "Reinigung",
    subtitle: "Räumung, Entsorgung & Endreinigung",
  },

  raeumen_normal: {
    key: "raeumen_normal",
    title: "Whg. räumen inkl. Gesamtentsorgung (normal verunreinigt)",
    description:
      "Entrümpeln, räumen der Bestandswohnung vor Beginn der Umbauarbeiten inkl. sach- und fachgerechter Entsorgung.\nPauschalpreis gilt für eine normal verunreinigte Wohnung.",
    ranges: [
      { min: 0, max: 40, price: 963.01 },
      { min: 40.0000001, max: 50, price: 1133.67 },
      { min: 50.0000001, max: 60, price: 1303.11 },
      { min: 60.0000001, max: 70, price: 1520.09 },
      { min: 70.0000001, max: 80, price: 1643.21 },
      { min: 80.0000001, max: 90, price: 1812.65 },
      { min: 90.0000001, max: 100, price: 1983.31 },
      { min: 100.0000001, max: null, price: 1983.31 },
    ] as RangePrice[],
  },

  raeumen_stark: {
    key: "raeumen_stark",
    title: "Whg. räumen inkl. Gesamtentsorgung (stark verunreinigt)",
    description:
      "Entrümpeln, räumen der Bestandswohnung vor Beginn der Umbauarbeiten inkl. sach- und fachgerechter Entsorgung.\nPauschalpreis gilt für eine stark verunreinigte Wohnung.",
    ranges: [
      { min: 0, max: 40, price: 1557.88 },
      { min: 40.0000001, max: 50, price: 1841.91 },
      { min: 50.0000001, max: 60, price: 2124.72 },
      { min: 60.0000001, max: 70, price: 2478.23 },
      { min: 70.0000001, max: 80, price: 2691.55 },
      { min: 80.0000001, max: 90, price: 2974.36 },
      { min: 90.0000001, max: 100, price: 3257.17 },
      { min: 100.0000001, max: null, price: 4106.81 },
    ] as RangePrice[],
  },

  endreinigung: {
    key: "endreinigung",
    title: "Endreinigung",
    description: "Endreinigung der Wohnung nach erfolgter Sanierung",
    ranges: [
      { min: 0, max: 40, price: 308.41 },
      { min: 40.0000001, max: 50, price: 385.2 },
      { min: 50.0000001, max: 60, price: 404.71 },
      { min: 60.0000001, max: 70, price: 472.97 },
      { min: 70.0000001, max: 80, price: 540.02 },
      { min: 80.0000001, max: 90, price: 558.3 },
      { min: 90.0000001, max: 100, price: 577.81 },
      { min: 100.0000001, max: null, price: 752.12 },
    ] as RangePrice[],
  },
};

// helpers
export function clamp0(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}
export function round2(n: number) {
  return Math.round(n * 100) / 100;
}
export function pickRangePrice(m2: number, ranges: RangePrice[]) {
  const x = clamp0(m2);
  const hit = ranges.find(
    (r) => (r.min == null || x >= r.min) && (r.max == null || x <= r.max),
  );
  return hit?.price ?? 0;
}
export function formatEUR(value: number) {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
