// boden.pricebook.ts

export type BodenPriceBook = {
  bestand: { title: string; description: string };

  bestand_teppich: { title: string; ranges: RangePrice[] };
  bestand_laminat: { title: string; ranges: RangePrice[] };
  bestand_parkett: { title: string; ranges: RangePrice[] };

  teil_sanierung_parkett: { title: string; base: number; ratePerM2: number };

  neu_teppich: {
    title: string;
    requiresAbbruchBelag: boolean;
    ranges: RangePrice[];
  };
  neu_laminat: {
    title: string;
    requiresAbbruchBelag: boolean;
    ranges: RangePrice[];
  };
  neu_parkett: {
    title: string;
    requiresAbbruchBelag: boolean;
    ranges: RangePrice[];
  };

  einzel_teppich: { title: string; base: number; ratePerM2: number };
  einzel_laminat: { title: string; base: number; ratePerM2: number };
  einzel_parkett: { title: string; base: number; ratePerM2: number };

  aufz_antidroe: { title: string; factorOfNeuLaminat: number };
  aufz_antidroe_einzel_laminat: { title: string; ratePerM2: number };

  aufz_fischgraet: { title: string; base: number; ratePerM2: number };
  aufz_verlegen_versiegeln: { title: string; ratePerM2: number };

  mauerfries: { title: string; ratePerLfm: number };
};

export type RangePrice = {
  min: number | null;
  max: number | null;
  price: number;
};

export const BODEN_PRICEBOOK = {
  bestand: {
    title: "Bestandbelag",
    description:
      "Angenommener Standard: Alle Zimmer ausgenommen verflieste Zimmer\n" +
      "Bestand: Bestehender Belag wird gereinigt und Fehlstellen werden bestmöglich behoben bzw. kaschiert.\n" +
      "Sockelleisten werden auf Stand gebracht (Zwangsspannungen, Ichsenausführung, etc.)\n" +
      "Hinweis: Oberflächen werden je nach Bestand verbessert, die optische Qualität von Neubelägen kann nicht erreicht werden (Stand der Technik)",
  },

  bestand_teppich: {
    title: "Bestandbelag Teppich – Tiefenreinigung",
    ranges: [
      { min: 0, max: 40, price: 230.08 },
      { min: 41, max: 50, price: 270.62 },
      { min: 51, max: 60, price: 336.44 },
      { min: 61, max: 70, price: 381.55 },
      { min: 71, max: 80, price: 435.18 },
      { min: 81, max: 90, price: 499.8 },
      { min: 91, max: 100, price: 565.62 },
      { min: 101, max: null, price: 726.52 },
    ] as RangePrice[],
  },

  bestand_laminat: {
    title:
      "Bestandbelag Laminat – reinigen, aufpolieren, Sockelleisten überarbeiten",
    ranges: [
      { min: 0, max: 40, price: 707.02 },
      { min: 41, max: 50, price: 894.75 },
      { min: 51, max: 60, price: 1065.41 },
      { min: 61, max: 70, price: 1242.16 },
      { min: 71, max: 80, price: 1453.05 },
      { min: 81, max: 90, price: 1667.59 },
      { min: 91, max: 100, price: 1882.14 },
      { min: 101, max: null, price: 2517.24 },
    ] as RangePrice[],
  },

  bestand_parkett: {
    title:
      "Bestandbelag Parkett – reinigen, ggf. abschleifen, versiegeln, polieren, Sockelleisten überarbeiten/erneuern",
    ranges: [
      { min: 0, max: 40, price: 1751.7 },
      { min: 41, max: 50, price: 2210.05 },
      { min: 51, max: 60, price: 2612.32 },
      { min: 61, max: 70, price: 3041.41 },
      { min: 71, max: 80, price: 3557.04 },
      { min: 81, max: 90, price: 4072.68 },
      { min: 91, max: 100, price: 4588.32 },
      { min: 101, max: null, price: 6132.79 },
    ] as RangePrice[],
  },

  teil_sanierung_parkett: {
    title: "Teilflächen Sanierung Bestandbelag Parkett (min. 10m²)",
    base: 331.35,
    ratePerM2: 71.79,
  },

  // Neuherstellung – dependency Abbruch Belag
  neu_teppich: {
    title: "Neuherstellung Teppich (mit Sockelleiste 7cm, Objektqualität)",
    requiresAbbruchBelag: true,
    ranges: [
      { min: 0, max: 40, price: 1229.35 },
      { min: 41, max: 50, price: 1554.8 },
      { min: 51, max: 60, price: 1853.8 },
      { min: 61, max: 70, price: 2158.55 },
      { min: 71, max: 80, price: 2524.25 },
      { min: 81, max: 90, price: 2896.85 },
      { min: 91, max: 100, price: 3270.6 },
      { min: 101, max: null, price: 4367.7 },
    ] as RangePrice[],
  },

  neu_laminat: {
    title:
      "Neuherstellung Laminat (Standardobjektlaminat, Sockelleiste 7cm, Objektqualität)",
    requiresAbbruchBelag: true,
    ranges: [
      { min: 0, max: 40, price: 2044.7 },
      { min: 41, max: 50, price: 2607.05 },
      { min: 51, max: 60, price: 3140.65 },
      { min: 61, max: 70, price: 3668.5 },
      { min: 71, max: 80, price: 4356.2 },
      { min: 81, max: 90, price: 4981.8 },
      { min: 91, max: 100, price: 5607.4 },
      { min: 101, max: null, price: 7503.75 },
    ] as RangePrice[],
  },

  neu_parkett: {
    title: "Neuherstellung Parkett (Eiche, Sockelleiste 7cm, Objektqualität)",
    requiresAbbruchBelag: true,
    ranges: [
      { min: 0, max: 40, price: 4100.0 },
      { min: 41, max: 50, price: 5232.96 },
      { min: 51, max: 60, price: 6218.28 },
      { min: 61, max: 70, price: 7280.88 },
      { min: 71, max: 80, price: 8623.62 },
      { min: 81, max: 90, price: 9861.48 },
      { min: 91, max: 100, price: 11099.34 },
      { min: 101, max: null, price: 14926.08 },
    ] as RangePrice[],
  },

  // Einzelflächen
  einzel_teppich: {
    title: "Einzelflächen Teppich",
    base: 331.35,
    ratePerM2: 37.56,
  },
  einzel_laminat: {
    title: "Einzelflächen Laminat",
    base: 331.35,
    ratePerM2: 69.21,
  },
  einzel_parkett: {
    title: "Einzelflächen Parkett",
    base: 331.35,
    ratePerM2: 125.91,
  },

  // Aufzahlungen
  aufz_antidroe: {
    title: "Aufzahlung Antidröhnmatte (Neuherstellung Laminat)",
    // 30% od Neuherstellung Laminat (staffel)
    factorOfNeuLaminat: 0.3,
  },
  aufz_antidroe_einzel_laminat: {
    title: "Aufzahlung Antidröhnmatte (Einzelflächen Laminat)",
    ratePerM2: 20.76,
  },

  aufz_fischgraet: {
    title: "Aufzahlung Fischgrätparkett",
    base: 281.32,
    ratePerM2: 72.93,
  },
  aufz_verlegen_versiegeln: {
    title: "Aufzahlung verlegen und versiegeln",
    ratePerM2: 66.7,
  },

  mauerfries: { title: "Mauerfries Eiche", ratePerLfm: 165.0 },
};

export function clamp0(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}
export function round2(n: number) {
  return Math.round(n * 100) / 100;
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
