// fenster.pricebook.ts
export type RangePrice = {
  min: number | null;
  max: number | null;
  price: number;
};

export const FENSTER_PRICEBOOK = {
  // ============================
  // A) POSTOJEĆI "FENSTER" (što već imaš)
  // ============================
  servicieren: {
    key: "servicieren",
    title: "Fenster servicieren",
    description:
      "einstellen, gangbar machen, schmieren\n" +
      "HINWEIS: technische Überarbeitung auf Stand der Technik – optisch wird nichts nachgebessert",
    ranges: [
      { min: 0, max: 40, price: 241.5 },
      { min: 41, max: 50, price: 284.05 },
      { min: 51, max: 60, price: 326.6 },
      { min: 61, max: 70, price: 326.6 },
      { min: 71, max: 80, price: 369.15 },
      { min: 81, max: 90, price: 389.85 },
      { min: 91, max: 100, price: 410.55 },
      { min: 101, max: null, price: 453.1 },
    ] as RangePrice[],
  },

  sanierung_bestandsfenster: {
    key: "sanierung_bestandsfenster",
    title: "Sanierung Bestandsfenster",
    description: "schleifen, kitten, malen, gangbar machen",
    base: 331.35,
    ratePerM2: 497.01,
    minM2: 1,
  },

  sanierung_bestandskastenfenster: {
    key: "sanierung_bestandskastenfenster",
    title: "Sanierung Bestandskastenfenster",
    description: "schleifen, kitten, malen, gangbar machen",
    base: 331.35,
    ratePerM2: 699.5,
    minM2: 1,
  },

  aufz_prallscheibe: {
    key: "aufz_prallscheibe",
    title: "Aufzahlung Bestandsfenster mit zusätzlicher Prallscheibe",
    description: "schleifen, kitten, malen, gangbar machen",
    base: 82.83,
    ratePerM2: 147.27,
    minM2: 1,
  },

  // ============================
  // B) NEU: FENSTER KONFIGURATOR (FENSTERTAUSCH)
  // ============================
  konfigurator: {
    title: "Fenster Konfigurator (Fenstertausch)",
    subtitle:
      "Rohbaumaß, Fenstertyp & Sonnenschutz – Berechnung nach Fensterfläche (m²)",
  },

  grundpauschale_fenstertausch: 251.11,

  abbruch_bestehender_fenster_per_m2: 119.46,

  typ_holz_alu_per_m2: 659.48,
  typ_pvc_alu_per_m2: 543.67,
  typ_pvc_per_m2: 525.39,

  // Aufzahlungen
  blindstock_per_m2: 154.81,
  mehrteiligkeit_per_m2: 219.42,

  schallschutz_43db_per_m2: 91.43,
  nicht_transparent_per_m2: 28.04,
  oberlichte_per_m2: 146.28,

  luefter_per_stk: 203.57,

  // Sonnenschutz
  abbruch_sonnenschutz_per_m2: 54.86,

  montage_innenjalousien_per_m2: 70.7,
  montage_aussenjalousien_per_m2: 392.52,
  montage_blinos_rollo_per_m2: 392.52,

  aufz_sonnenschutz_aufputz_per_m2: 112.15,
};

// helpers
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
