// maler.pricebook.ts

export type RangePrice = {
  min: number | null;
  max: number | null;
  price: number;
};

export const MALER_PRICEBOOK = {
  // -----------------------------
  // MALERARBEITEN - BESTAND
  // -----------------------------
  bestand: {
    title: "Malerarbeiten – Bestand",
  },

  bestand_vorarbeiten: {
    key: "bestand_vorarbeiten",
    title: "Bestand Vorarbeiten",
    description:
      "bestehende Oberflächen entfernen/abscheren wie Tapeten, alte Farben, Farbschichten sowie Schutzabdeckungen von Bädern, Fenster & Türen insofern diese belassen werden.\n" +
      "Abdecken der Schalter und Steckdosen",
    ranges: [
      { min: 0, max: 40, price: 652.17 },
      { min: 41, max: 50, price: 787.47 },
      { min: 51, max: 60, price: 983.73 },
      { min: 61, max: 70, price: 1108.07 },
      { min: 71, max: 80, price: 1243.38 },
      { min: 81, max: 90, price: 1403.07 },
      { min: 91, max: 100, price: 1563.98 },
      { min: 101, max: null, price: 1949.18 },
    ] as RangePrice[],
  },

  bestand_starke_verunreinigungen: {
    key: "bestand_starke_verunreinigungen",
    title: "Bestand starke Verunreinigungen (Aufzahlung)",
    description:
      "Aufzahlung bei starken Verunreinigungen – Desinfektion, Nikotin, Schimmel\n" +
      "Mit dieser Auswahl müssen Sie die folgenden Positionen auswählen: Bestand Vorarbeiten",
    ranges: [
      { min: 0, max: 40, price: 391.3 },
      { min: 41, max: 50, price: 459.56 },
      { min: 51, max: 60, price: 586.34 },
      { min: 61, max: 70, price: 654.6 },
      { min: 71, max: 80, price: 722.87 },
      { min: 81, max: 90, price: 786.26 },
      { min: 91, max: 100, price: 849.64 },
      { min: 101, max: null, price: 917.91 },
    ] as RangePrice[],
  },

  bestand_oberflaechen_ueberarbeiten: {
    key: "bestand_oberflaechen_ueberarbeiten",
    title: "Bestand – bestehende Oberflächen überarbeiten",
    description:
      "Risse ausspachteln – Die Bestandsflächen werden überarbeitet.\n" +
      "Hinweis: Ausbesserungen werden sichtbar bleiben!",
    ranges: [
      { min: 0, max: 40, price: 188.95 },
      { min: 41, max: 50, price: 229.17 },
      { min: 51, max: 60, price: 268.18 },
      { min: 61, max: 70, price: 308.41 },
      { min: 71, max: 80, price: 347.42 },
      { min: 81, max: 90, price: 386.42 },
      { min: 91, max: 100, price: 426.65 },
      { min: 101, max: null, price: 546.11 },
    ] as RangePrice[],
  },

  // -----------------------------
  // VERPUTZ
  // -----------------------------
  verputz: {
    title: "Verputzarbeiten",
  },

  innenputz_instand_10: {
    key: "innenputz_instand_10",
    title: "Innenputz instandsetzen 10%",
    description:
      "Putz abschlagen & wieder instandsetzen. Bis 10% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten inkl. Entsorgung.\n" +
      "HINWEIS: Ergänzungen optisch erkennbar!",
    ranges: [
      { min: 0, max: 40, price: 2407.53 },
      { min: 41, max: 50, price: 3009.71 },
      { min: 51, max: 60, price: 3611.9 },
      { min: 61, max: 70, price: 4212.86 },
      { min: 71, max: 80, price: 4815.05 },
      { min: 81, max: 90, price: 5175.87 },
      { min: 91, max: 100, price: 5536.7 },
      { min: 101, max: null, price: 7198.2 },
    ] as RangePrice[],
  },

  innenputz_instand_50: {
    key: "innenputz_instand_50",
    title: "Innenputz instandsetzen 50%",
    description:
      "Putz abschlagen & wieder instandsetzen. Bis 50% der Verputzfläche nach erfolgter Elektro- und Haustechnikinstallationsarbeiten inkl. Entsorgung.\n" +
      "HINWEIS: Ergänzungen optisch erkennbar!",
    ranges: [
      { min: 0, max: 40, price: 4389.62 },
      { min: 41, max: 50, price: 5487.94 },
      { min: 51, max: 60, price: 6585.04 },
      { min: 61, max: 70, price: 7682.14 },
      { min: 71, max: 80, price: 8779.24 },
      { min: 81, max: 90, price: 9437.5 },
      { min: 91, max: 100, price: 10096.98 },
      { min: 101, max: null, price: 13124.97 },
    ] as RangePrice[],
  },

  innenputz_neu: {
    key: "innenputz_neu",
    title: "Innenputz neu herstellen",
    description:
      "Gesamten Putz abschlagen und nach Elektro-/Haustechnik neu verputzen inkl. Entsorgung.\n" +
      "Nassräume: Zementputz | Wohnräume: Gipsputz",
    ranges: [
      { min: 0, max: 40, price: 4532.24 },
      { min: 41, max: 50, price: 5664.69 },
      { min: 51, max: 60, price: 6797.14 },
      { min: 61, max: 70, price: 7929.6 },
      { min: 71, max: 80, price: 9063.27 },
      { min: 81, max: 90, price: 9742.25 },
      { min: 91, max: 100, price: 10422.45 },
      { min: 101, max: null, price: 13549.19 },
    ] as RangePrice[],
  },

  verputz_einzelflaechen: {
    key: "verputz_einzelflaechen",
    title: "Verputz Einzelflächen",
    description: "Mindestabrechnung 1m² je Einzelfläche",
    base: 147.27,
    ratePerM2: 42.34,
    minM2: 1,
  },

  // -----------------------------
  // SPACHTELUNG
  // -----------------------------
  spachtelung: {
    title: "Spachtelung/Malen",
  },

  neu_spachtelung: {
    key: "neu_spachtelung",
    title: "Neuherstellung Spachtelung",
    description:
      "Wände und Decken vollständig spachteln\n" +
      "HINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)",
    ranges: [
      { min: 0, max: 40, price: 3217.7 },
      { min: 41, max: 50, price: 3965.2 },
      { min: 51, max: 60, price: 4769.05 },
      { min: 61, max: 70, price: 5517.7 },
      { min: 71, max: 80, price: 6265.2 },
      { min: 81, max: 90, price: 7041.45 },
      { min: 91, max: 100, price: 7817.7 },
      { min: 101, max: null, price: 10062.5 },
    ] as RangePrice[],
  },

  einzelraeume_spachteln: {
    title: "Einzelräume spachteln (Fixpreis je Raum)",
    items: [
      {
        key: "spachteln_bis10",
        title: "Einzelräume spachteln – Zi. bis 10m²",
        price: 1538.9,
      },
      {
        key: "spachteln_bis15",
        title: "Einzelräume spachteln – Zi. bis 15m²",
        price: 2142.67,
      },
      {
        key: "spachteln_bis20",
        title: "Einzelräume spachteln – Zi. bis 20m²",
        price: 2746.46,
      },
      {
        key: "spachteln_bis30",
        title: "Einzelräume spachteln – Zi. bis 30m²",
        price: 3501.18,
      },
      {
        key: "spachteln_bis40",
        title: "Einzelräume spachteln – Zi. bis 40m²",
        price: 4557.8,
      },
    ],
  },

  // ✅ ISPRAVLJENO:
  einzelflaechen_spachteln: {
    key: "einzelflaechen_spachteln",
    title: "Einzelflächen spachteln",
    base: 165.66,
    ratePerM2: 36.81,
    minM2: 1,
  },

  // -----------------------------
  // MALEREI
  // -----------------------------
  malerei: {
    title: "Malerei",
  },

  neu_malerei: {
    key: "neu_malerei",
    title: "Neuherstellung Malerei",
    description:
      "Wände und Decken malen: Objektqualität weiß, abwaschbar\n" +
      "HINWEIS: Je nach Qualitätsanspruch (gewählte Vorarbeiten des Untergrundes sowie Bestands)",
    ranges: [
      { min: 0, max: 40, price: 1934.3 },
      { min: 41, max: 50, price: 2402.35 },
      { min: 51, max: 60, price: 2901.45 },
      { min: 61, max: 70, price: 3369.5 },
      { min: 71, max: 80, price: 2687.55 },
      { min: 81, max: 90, price: 4320.55 },
      { min: 91, max: 100, price: 4804.7 },
      { min: 101, max: null, price: 6206.55 },
    ] as RangePrice[],
  },

  einzelraeume_malen: {
    title: "Einzelräume malen (Fixpreis je Raum)",
    items: [
      {
        key: "malen_bis10",
        title: "Einzelräume malen – Zi. bis 10m²",
        price: 815.47,
      },
      {
        key: "malen_bis15",
        title: "Einzelräume malen – Zi. bis 15m²",
        price: 1098.95,
      },
      {
        key: "malen_bis20",
        title: "Einzelräume malen – Zi. bis 20m²",
        price: 1382.43,
      },
      {
        key: "malen_bis30",
        title: "Einzelräume malen – Zi. bis 30m²",
        price: 1736.78,
      },
      {
        key: "malen_bis40",
        title: "Einzelräume malen – Zi. bis 40m²",
        price: 2232.88,
      },
    ],
  },

  einzelflaechen_malen: {
    key: "einzelflaechen_malen",
    title: "Einzelflächen malen",
    base: 138.05,
    ratePerM2: 18.43,
    minM2: 1,
  },

  // -----------------------------
  // ZARGEN
  // -----------------------------
  zargen: {
    title: "Zargen",
  },

  zargen_beschichten: {
    key: "zargen_beschichten",
    title: "Neuherstellung Zargen beschichten",
    description:
      "Neubeschichtung der Bestandszargen inkl. ausbessern von kleinen Beschädigungen (z.B. Kratzer)",
    ranges: [
      { min: 0, max: 40, price: 199.92 },
      { min: 41, max: 50, price: 285.25 },
      { min: 51, max: 60, price: 399.83 },
      { min: 61, max: 70, price: 485.16 },
      { min: 71, max: 80, price: 569.27 },
      { min: 81, max: 90, price: 626.57 },
      { min: 91, max: 100, price: 685.08 },
      { min: 101, max: null, price: 769.19 },
    ] as RangePrice[],
  },

  einzelne_zarge_bis2: {
    key: "einzelne_zarge_bis2",
    title: "Einzelne Zarge – ST Zargen bis 2m²",
    pricePerStk: 110.44,
  },

  einzelne_zarge_bis4: {
    key: "einzelne_zarge_bis4",
    title: "Einzelne Zarge – ST Zargen bis 4m²",
    pricePerStk: 143.6,
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
