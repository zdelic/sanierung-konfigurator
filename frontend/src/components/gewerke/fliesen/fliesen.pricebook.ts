// fliesen.pricebook.ts
export type FliesenPriceBook = {
  bestand: {
    title: string;
    description: string;
    ranges: RangePrice[];
  };

  neuBadWc: {
    title: string;
    description: string;
    requiresAbbruchBelag: boolean;
    ranges: RangePrice[];
  };

  neuVrkue: {
    title: string;
    description: string;
    requiresAbbruchBelag: boolean;
    ranges: RangePrice[];
  };

  einzelflaechen: {
    title: string;
    description?: string;
    base: number;
    ratePerM2: number;
  };
};

export type RangePrice = {
  min: number | null;
  max: number | null;
  price: number;
};

export const FLIESEN_PRICEBOOK: FliesenPriceBook = {
  bestand: {
    title: "Bestand",
    description:
      "Angenommener Standard: 60/60, 30/60\nVR + Kü mit Fliesenbelag, Bad inkl. Wandverfliesung, WC mit Fliesenbelag und Rückwand bis 1,20m\nServicierung bestehender Verfliesung, Tausch Wartungsfuge, Fugen reinigen und überarbeiten, Prüfung ob Fliesen locker, Dokumentierte Prüfung (falls locker: Wiederergänzung mit Bestandsfliesen im Kleinbereich bis max. 5 Stück)",
    ranges: [
      { min: 0, max: 50, price: 500.82 },
      { min: 51, max: 70, price: 630.03 },
      { min: 71, max: 100, price: 762.9 },
      { min: 101, max: null, price: 900.65 },
    ] as RangePrice[],
  },

  neuBadWc: {
    title: "Neuherstellung Verfliesung Badezimmer und WC",
    description:
      "Bad inkl. Wandverfliesung bis Zargen; WC mit Fliesenbelag und Rückwand bis 1,20m:\nObjektstandardbodenfliese 30/60cm inkl. Sockelleiste 7cm\nAbdichtung Badezimmer gem. Norm: Objektstandardwandfliese 60/60cm inkl. Sockelleiste 7cm",
    // Dependency:
    requiresAbbruchBelag: true,
    ranges: [
      { min: 0, max: 40, price: 2735.2 },
      { min: 41, max: 50, price: 3286.05 },
      { min: 51, max: 60, price: 3678.2 },
      { min: 61, max: 70, price: 3907.05 },
      { min: 71, max: 80, price: 4354.4 },
      { min: 81, max: 90, price: 4578.65 },
      { min: 91, max: 100, price: 4802.9 },
      { min: 101, max: null, price: 5251.4 },
    ] as RangePrice[],
  },

  neuVrkue: {
    title: "Fliesen – VR + Kü mit Fliesenbelag",
    description:
      "Angenommener Standard: VR + Kü mit Fliesenbelag\nObjektstandardwandfliese 60/60cm inkl. Sockelleiste 7cm",
    // Dependency:
    requiresAbbruchBelag: true,
    ranges: [
      { min: 0, max: 40, price: 809.23 },
      { min: 41, max: 50, price: 905.53 },
      { min: 51, max: 60, price: 1255.38 },
      { min: 61, max: 70, price: 1449.2 },
      { min: 71, max: 80, price: 1508.93 },
      { min: 81, max: 90, price: 1605.23 },
      { min: 91, max: 100, price: 1702.75 },
      { min: 101, max: null, price: 1955.09 },
    ] as RangePrice[],
  },

  einzelflaechen: {
    title: "Fliesen Einzelflächen 30/60, 60/60",
    base: 322.96,
    ratePerM2: 82.83,
  },
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
