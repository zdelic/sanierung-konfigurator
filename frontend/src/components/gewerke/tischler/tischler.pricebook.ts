// tischler.pricebook.ts

export type TischlerPriceBook = {
  bestand: { title: string; description: string; ranges: RangePrice[] };

  neu_eingang: LinePrice; // tier (single range)
  neu_innentueren: LinePrice; // tier
  neu_zargen: LinePrice; // tier

  sanierung_2m2_simple: LinePrice;
  aufzahlung_2m2_aufwendig: LinePrice;
  sanierung_4m2_simple: LinePrice;
  aufzahlung_4m2_aufwendig: LinePrice;

  neu_innentueren_glasausschnitt: LinePrice;
  innentuere_80x200: LinePrice;
  zarge_80x200: LinePrice;

  whg_eingang_h250: LinePrice;
  whg_eingang_2fluegelig_h250: LinePrice;
  balkon_bis3: LinePrice;
  balkon_ueber3: LinePrice;
  kasten_bis3: LinePrice;
  kasten_3_5: LinePrice;
  anstrich_eingang: LinePrice;
  anstrich_balkon: LinePrice;
  anstrich_kasten: LinePrice;
};

export const TISCHLER_QTY_KEYS = [
  "sanierung_2m2_simple",
  "aufzahlung_2m2_aufwendig",
  "sanierung_4m2_simple",
  "aufzahlung_4m2_aufwendig",
  "neu_innentueren_glasausschnitt",
  "innentuere_80x200",
  "zarge_80x200",
  "whg_eingang_h250",
  "whg_eingang_2fluegelig_h250",
  "balkon_bis3",
  "balkon_ueber3",
  "kasten_bis3",
  "kasten_3_5",
  "anstrich_eingang",
  "anstrich_balkon",
  "anstrich_kasten",
] as const;

export type RangePrice = {
  min: number | null;
  max: number | null;
  price: number; // pauschal €
};

export type Unit = "stk";

export type LinePrice =
  | {
      kind: "tier";
      key: string;
      title: string;
      description?: string;
      ranges: RangePrice[];
      requires?: "abbruch_eingang" | "abbruch_innentueren_voll";
    }
  | {
      kind: "base_plus_rate";
      key: string;
      title: string;
      description?: string;
      unit: Unit;
      base: number; // Grundpreis (einmal, wenn qty>0)
      rate: number; // €/Stk
    }
  | {
      kind: "rate_only";
      key: string;
      title: string;
      description?: string;
      unit: Unit;
      rate: number; // €/Stk
    };

export const TISCHLER_PRICEBOOK = {
  bestand: {
    key: "bestand",
    title: "Bestand",
    description:
      "Hinweis: Technische Überarbeitung, auf Stand der Technik, optisch wird nicht nachgebessert\nServicierung bestehender Türblätter\nWohnungseingangstüre\nInnentüren: einstellen, gangbar machen, schmieren",
    ranges: [
      { min: 0, max: 40, price: 213.33 },
      { min: 41, max: 50, price: 226.73 },
      { min: 51, max: 60, price: 241.36 },
      { min: 61, max: 70, price: 256.0 },
      { min: 71, max: 80, price: 269.4 },
      { min: 81, max: 90, price: 282.81 },
      { min: 91, max: 100, price: 297.44 },
      { min: 101, max: null, price: 340.1 },
    ] as RangePrice[],
  },

  // Sanierung Bestandstüre
  sanierung_2m2_simple: {
    kind: "base_plus_rate",
    key: "sanierung_2m2_simple",
    title: "Sanierung Bestandstüre bis 2m² (einfache, glatte Oberfläche)",
    unit: "stk",
    base: 211.7,
    rate: 147.27,
  } as LinePrice,

  aufzahlung_2m2_aufwendig: {
    kind: "base_plus_rate",
    key: "aufzahlung_2m2_aufwendig",
    title:
      "Aufzahlung aufwendige, gegliederte Oberfläche (Bestandstüre bis 2m²)",
    unit: "stk",
    base: 165.67,
    rate: 257.71,
  } as LinePrice,

  sanierung_4m2_simple: {
    kind: "base_plus_rate",
    key: "sanierung_4m2_simple",
    title: "Sanierung Bestandstüre bis 4m² (einfache, glatte Oberfläche)",
    unit: "stk",
    base: 211.69,
    rate: 294.52,
  } as LinePrice,

  aufzahlung_4m2_aufwendig: {
    kind: "base_plus_rate",
    key: "aufzahlung_4m2_aufwendig",
    title:
      "Aufzahlung aufwendige, gegliederte Oberfläche (Bestandstüre bis 4m²)",
    unit: "stk",
    base: 165.67,
    rate: 515.42,
  } as LinePrice,

  // Neuherstellung
  neu_eingang: {
    kind: "tier",
    key: "neu_eingang",
    title: "Neuherstellung – Eingangstüre",
    description:
      "Wohnungseingangstüre 85-90/200-210cm Objekttürblatt weiß mit Stahlblockzarge, Spion, Sicherheitsbeschlag, WK3, Klimaanforderung Whg./Stg. sowie Türstopper schwer",
    requires: "abbruch_eingang",
    ranges: [{ min: 0, max: null, price: 2711.06 }],
  } as LinePrice,

  neu_innentueren: {
    kind: "tier",
    key: "neu_innentueren",
    title: "Neuherstellung – Innentüren",
    description:
      "Innentürblätter 80/200cm, Objekttürblatt Wabe, weiß, Standardbeschlag und Buntbartschlüssel, AR mit Lüftungsgitter, WC und Bad mit Sanitärbeschlag, Türblätter gekürzt sowie Türstopper leicht",
    ranges: [
      { min: 0, max: 40, price: 720.43 },
      { min: 41, max: 50, price: 956.91 },
      { min: 51, max: 60, price: 1178.77 },
      { min: 61, max: 70, price: 1400.63 },
      { min: 71, max: 80, price: 1623.71 },
      { min: 81, max: 90, price: 1763.89 },
      { min: 91, max: 100, price: 1905.3 },
      { min: 101, max: null, price: 2127.15 },
    ],
  } as LinePrice,

  neu_innentueren_glasausschnitt: {
    kind: "base_plus_rate",
    key: "neu_innentueren_glasausschnitt",
    title: "Neuherstellung – Innentüren – Aufzahlung Glasausschnitt",
    unit: "stk",
    base: 128.86,
    rate: 147.27,
  } as LinePrice,

  innentuere_80x200: {
    kind: "base_plus_rate",
    key: "innentuere_80x200",
    title: "Innentüre 80/200",
    unit: "stk",
    base: 211.69,
    rate: 294.52,
  } as LinePrice,

  neu_zargen: {
    kind: "tier",
    key: "neu_zargen",
    title: "Neuherstellung Zargen",
    description:
      "Objektholzzarge weiß in bestehendem Durchbruch bzw. Stahlzarge Profil 42 je nach Einbausituation",
    requires: "abbruch_innentueren_voll",
    ranges: [
      { min: 0, max: 40, price: 958.13 },
      { min: 41, max: 50, price: 1382.35 },
      { min: 51, max: 60, price: 1861.41 },
      { min: 61, max: 70, price: 2285.63 },
      { min: 71, max: 80, price: 2711.06 },
      { min: 81, max: 90, price: 2949.98 },
      { min: 91, max: 100, price: 3188.9 },
      { min: 101, max: null, price: 3614.34 },
    ],
  } as LinePrice,

  zarge_80x200: {
    kind: "base_plus_rate",
    key: "zarge_80x200",
    title: "Zarge 80/200",
    unit: "stk",
    base: 211.69,
    rate: 404.98,
  } as LinePrice,

  // Fixe Stückpreise
  whg_eingang_h250: {
    kind: "rate_only",
    key: "whg_eingang_h250",
    title: "Wohnungseingangstür bis H 250 – Instandsetzen",
    description:
      "Tischlermäßiges Instandsetzen, sämtliche Zusatzschlösser entfernen, Schraublöcher verkitten, inklusive neuer Türstaffel und dreifach Verriegelung",
    unit: "stk",
    rate: 1078.0,
  } as LinePrice,

  whg_eingang_2fluegelig_h250: {
    kind: "rate_only",
    key: "whg_eingang_2fluegelig_h250",
    title: "2-Flügelig Wohnungseingangstür bis H 250 – Instandsetzen",
    description:
      "Tischlermäßiges Instandsetzen, sämtliche Zusatzschlösser entfernen, Schraublöcher verkitten, inklusive neuer Türstaffel und dreifach Verriegelung",
    unit: "stk",
    rate: 1782.0,
  } as LinePrice,

  balkon_bis3: {
    kind: "rate_only",
    key: "balkon_bis3",
    title: "Balkon Innentüre: bis 3m²",
    description:
      "Tischlermäßiges Instandsetzen inklusive Beschläge, neue Dichtungen liefern und einfräsen, neues Isolierglas 4-8-4, Argon gefüllt liefern und einbauen",
    unit: "stk",
    rate: 1164.0,
  } as LinePrice,

  balkon_ueber3: {
    kind: "rate_only",
    key: "balkon_ueber3",
    title: "Balkon Innentüre: über 3m²",
    description:
      "Tischlermäßiges Instandsetzen inklusive Beschläge, neue Dichtungen liefern und einfräsen, neues Isolierglas 4-8-4, Argon gefüllt liefern und einbauen",
    unit: "stk",
    rate: 1716.0,
  } as LinePrice,

  kasten_bis3: {
    kind: "rate_only",
    key: "kasten_bis3",
    title: "Kastenfenster bis 3m²",
    description:
      "Tischlermäßiges Instandsetzen inklusive Beschläge. Stock und Vertäfelung sanieren, Innen Flügel–Stock neue Dichtungen liefern und einfräsen, neues Isolierglas 4-8-4 (Argon) liefern und einbauen.",
    unit: "stk",
    rate: 1524.0,
  } as LinePrice,

  kasten_3_5: {
    kind: "rate_only",
    key: "kasten_3_5",
    title: "Kastenfenster: 3–5 m²",
    description:
      "Tischlermäßiges Instandsetzen inklusive Beschläge. Stock und Vertäfelung sanieren, Innen Flügel–Stock neue Dichtungen liefern und einfräsen, neues Isolierglas 4-8-4 (Argon) liefern und einbauen.",
    unit: "stk",
    rate: 2178.0,
  } as LinePrice,

  anstrich_eingang: {
    kind: "rate_only",
    key: "anstrich_eingang",
    title: "Anstricharbeiten Eingangstür",
    description:
      "Erneuern von vorhandenen Holzanstrichen: anschleifen, grundieren, verkitten, überziehen und mit PU-Wasserlack deckend lackieren. RAL 9016/8017",
    unit: "stk",
    rate: 923.5,
  } as LinePrice,

  anstrich_balkon: {
    kind: "rate_only",
    key: "anstrich_balkon",
    title: "Anstricharbeiten Balkoninnentür (bis 3m²)",
    description:
      "Erneuern von vorhandenen Holzanstrichen: anschleifen, grundieren, verkitten, überziehen und mit PU-Wasserlack deckend lackieren. RAL 9016",
    unit: "stk",
    rate: 894.3,
  } as LinePrice,

  anstrich_kasten: {
    kind: "rate_only",
    key: "anstrich_kasten",
    title: "Anstricharbeiten Kastenfenster (bis 3m²)",
    description:
      "Erneuern von vorhandenen Holzanstrichen: anschleifen, grundieren, verkitten, überziehen und mit PU-Wasserlack deckend lackieren. RAL 9016",
    unit: "stk",
    rate: 828.3,
  } as LinePrice,
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
