// trockenbau.pricebook.ts

export type Unit = "m2" | "m" | "lfm" | "stk";

export type TBItem = {
  key: string;
  title: string;
  description?: string;
  base: number;
  rate: number;
  unit: Unit;
};

export type TrockenbauPriceBook = {
  items: TBItem[];
};

// samo ključevi za inicijalizaciju state-a (da ne zavisi od pb)
export const TROCKENBAU_KEYS = [
  "vorsatzschale",
  "waende",
  "decke",
  "potterien",
  "akustik",
  "brandschutz",
  "nassraum",
  "revision_std",
  "revision_f90",
  "schottung",
  "nicht_raumhoch",
  "uk_kueche",
  "umfassungszarge",
] as const;

export const TB_BASE = 148.18;

export const TROCKENBAU_ITEMS: TBItem[] = [
  {
    key: "vorsatzschale",
    title: "Vorsatzschale",
    base: TB_BASE,
    rate: 59.27,
    unit: "m2",
  },
  { key: "waende", title: "Wände", base: TB_BASE, rate: 88.91, unit: "m2" },
  {
    key: "decke",
    title: "Abgehängte Decke",
    base: TB_BASE,
    rate: 105.85,
    unit: "m2",
  },

  // “Potterien” — ostavljam naziv kako si poslao; ako je typo (Poterien/Portieren), samo promijeni title.
  {
    key: "potterien",
    title: "Potterien",
    base: TB_BASE,
    rate: 169.35,
    unit: "m",
  },

  {
    key: "akustik",
    title: "Aufzahlung Akustik / Schallschutzanforderung",
    base: TB_BASE,
    rate: 63.51,
    unit: "m2",
  },
  {
    key: "brandschutz",
    title: "Aufzahlung Brandschutzanforderung",
    base: TB_BASE,
    rate: 105.85,
    unit: "m2",
  },
  {
    key: "nassraum",
    title: "Aufzahlung Nassraum",
    base: TB_BASE,
    rate: 5.92,
    unit: "m2",
  },

  {
    key: "revision_std",
    title: "Aufzahlung Revision 30/30 oder 40/40",
    base: TB_BASE,
    rate: 95.26,
    unit: "stk",
  },
  {
    key: "revision_f90",
    title: "Aufzahlung Revision 30/30 F90",
    base: TB_BASE,
    rate: 190.52,
    unit: "stk",
  },

  {
    key: "schottung",
    title: "Schottung",
    base: TB_BASE,
    rate: 148.18,
    unit: "stk",
  },

  {
    key: "nicht_raumhoch",
    title: "Aufzahlung nicht raumhoch / Überhöhen (UK)",
    base: TB_BASE,
    rate: 74.09,
    unit: "stk",
  },

  {
    key: "uk_kueche",
    title: "UK Küche",
    base: TB_BASE,
    rate: 31.75,
    unit: "lfm",
  },

  {
    key: "umfassungszarge",
    title: "Einbau Umfassungszarge Profil 42",
    base: TB_BASE,
    rate: 275.2,
    unit: "stk",
  },
];

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function clamp0(n: unknown) {
  const x = typeof n === "number" ? n : Number(n);
  return Number.isFinite(x) ? Math.max(0, x) : 0;
}

export function formatEUR(value: number) {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function unitLabel(u: Unit) {
  switch (u) {
    case "m2":
      return "m²";
    case "m":
      return "m";
    case "lfm":
      return "lfm";
    case "stk":
      return "Stk.";
  }
}
