// elektro.pricebook.ts
export type RangePrice = {
  min: number | null;
  max: number | null;
  price: number;
};

export const ELEKTRO_PRICEBOOK = {
  meta: {
    title: "Elektro",
    subtitle: "Leistungsgrenze Wohnungsverband exkl. Wohnungszuleitung",
  },

  // =========================
  // Wohnungsbezogen (m²-Staffel)
  // =========================
  befundaufnahme: {
    key: "befundaufnahme",
    title: "Befundaufnahme / Statusbericht",
    description:
      "Befundaufnahme/Statusbericht des Bestands (wohnungsbezogen, exkl. Wohnungszuleitung). Planung & Bemessung, Begleitung & Dokumentation, ÖVE-Befund nach Fertigstellung (bereits in der Grundpauschale enthalten).",
    ranges: [
      { min: 0, max: 40, price: 345.0 },
      { min: 40.0000001, max: 50, price: 425.5 },
      { min: 50.0000001, max: 60, price: 517.5 },
      { min: 60.0000001, max: 70, price: 603.75 },
      { min: 70.0000001, max: 80, price: 690.0 },
      { min: 80.0000001, max: 90, price: 862.5 },
      { min: 90.0000001, max: 100, price: 977.5 },
      { min: 100.0000001, max: null, price: 1035.0 },
    ] as RangePrice[],
  },

  wohnungsverteiler: {
    key: "wohnungsverteiler",
    title: "Erneuerung Wohnungsverteiler",
    description:
      "inkl. Gehäuse, Automaten (Leitungsschutzschalter, Fehlerstromschutzschalter), auf Stand der Technik. Erfordert Befundaufnahme/Statusbericht.",
    price: 1265.0,
  },

  grundinstallation: {
    key: "grundinstallation",
    title: "Erneuerung der Grundinstallation",
    description:
      "Anzahl, Ausführung & Umfang gem. Beilage nach E-8015 inkl. Leerschläuche, auf Stand der Technik (Erneuerung aller Geräte-, Schalter-, und Klemmdosen).",
    ranges: [
      { min: 0, max: 40, price: 3565.0 },
      { min: 40.0000001, max: 50, price: 4462.0 },
      { min: 50.0000001, max: 60, price: 5353.25 },
      { min: 60.0000001, max: 70, price: 6198.5 },
      { min: 70.0000001, max: 80, price: 7143.8 },
      { min: 80.0000001, max: 90, price: 7677.4 },
      { min: 90.0000001, max: 100, price: 10350.0 },
      { min: 100.0000001, max: null, price: 11597.75 },
    ] as RangePrice[],
    infoPdf: {
      label: "Elektro Ausstattung: Mindestausstattung.pdf",
      assetPath: "/src/assets/E-Mindestausstattung.pdf",
    },
  },

  schalter_stecker_sprechst: {
    key: "schalter_stecker_sprechst",
    title: "Erneuerung aller Schalter, Stecker, Sprechstelle, etc.",
    description:
      "Schalterprogramm Schrack, Visio 50, weiß; Sprechstelle nur Audio. Anzahl ident Bestand, auf Stand der Technik. Erfordert Befundaufnahme/Statusbericht.",
    ranges: [
      { min: 0, max: 40, price: 1391.5 },
      { min: 40.0000001, max: 50, price: 1656.0 },
      { min: 50.0000001, max: 60, price: 1794.0 },
      { min: 60.0000001, max: 70, price: 2070.0 },
      { min: 70.0000001, max: 80, price: 2346.0 },
      { min: 80.0000001, max: 90, price: 2553.0 },
      { min: 90.0000001, max: 100, price: 2760.0 },
      { min: 100.0000001, max: null, price: 3174.0 },
    ] as RangePrice[],
  },

  // =========================
  // Teilsanierung (Fix + Qty)
  // =========================
  kleine_e_pauschale: {
    key: "kleine_e_pauschale",
    title: "Kleine E-Pauschale (bis 5 Schalter/Stecker)",
    price: 303.72,
  },
  erdung_badewanne: {
    key: "erdung_badewanne",
    title: "Erdung Badewanne / Dusche",
    price: 331.34,
  },

  e_raum_bis_10: {
    key: "e_raum_bis_10",
    title: "E-Raumweise bis 10m²",
    price: 886.34,
    unit: "st" as const,
  },
  e_raum_bis_10_leer: {
    key: "e_raum_bis_10_leer",
    title:
      "E-Raumweise bis 10m² - Aufzahlung Leerschlauchtausch (inkl. stemmen & verputzen)",
    price: 1115.52,
    unit: "st" as const,
  },

  e_raum_bis_15: {
    key: "e_raum_bis_15",
    title: "E-Raumweise bis 15m²",
    price: 1122.88,
    unit: "st" as const,
  },
  e_raum_bis_15_leer: {
    key: "e_raum_bis_15_leer",
    title: "E-Raumweise bis 15m² - Aufzahlung Leerschlauchtausch",
    price: 1601.49,
    unit: "st" as const,
  },

  e_raum_bis_20: {
    key: "e_raum_bis_20",
    title: "E-Raumweise bis 20m²",
    price: 1270.15,
    unit: "st" as const,
  },
  e_raum_bis_20_leer: {
    key: "e_raum_bis_20_leer",
    title:
      "E-Raumweise bis 20m² - Aufzahlung Leerschlauchtausch (inkl. stemmen & verputzen)",
    price: 1932.82,
    unit: "st" as const,
  },

  e_raum_bis_30: {
    key: "e_raum_bis_30",
    title: "E-Raumweise bis 30m²",
    price: 1610.69,
    unit: "st" as const,
  },
  e_raum_bis_30_leer: {
    key: "e_raum_bis_30_leer",
    title:
      "E-Raumweise bis 30m² - Aufzahlung Leerschlauchtausch (inkl. stemmen & verputzen)",
    price: 2485.07,
    unit: "st" as const,
  },

  e_raum_bis_40: {
    key: "e_raum_bis_40",
    title: "E-Raumweise bis 40m² (inkl. stemmen & verputzen)",
    price: 1905.21,
    unit: "st" as const,
  },
  e_raum_bis_40_leer: {
    key: "e_raum_bis_40_leer",
    title:
      "E-Raumweise bis 40m² - Aufzahlung Leerschlauchtausch (inkl. stemmen & verputzen)",
    price: 3037.3,
    unit: "st" as const,
  },

  // =========================
  // Infrarot-Paneel
  // =========================
  infrarot_panel: {
    key: "infrarot_panel",
    title: "Ansatz Infrarot-Paneel",
    description: "Preis je Paneel lt. Variante.",
    variants: [
      { key: "190w", label: "190W", pricePerSt: 638.76 },
      { key: "300w", label: "300W", pricePerSt: 725.27 },
      { key: "675w", label: "675W", pricePerSt: 1087.91 },
      { key: "890w", label: "890W", pricePerSt: 1399.0 },
      { key: "1050w", label: "1050W", pricePerSt: 1632.78 },
    ],
    aufz_funk: {
      key: "aufz_funk",
      title: "Aufzahlung Funk je Paneel",
      pricePerSt: 165.67,
    },
    aufz_raumthermostat: {
      key: "aufz_raumthermostat",
      title: "Aufzahlung Raumthermostat",
      pricePerSt: 404.98,
    },
  },

  // =========================
  // Base + Unit
  // =========================
  wohnungszuleitung: {
    key: "wohnungszuleitung",
    title: "Wohnungszuleitung",
    base: 331.35,
    unitPrice: 128.86,
    unit: "lfm" as const,
  },

  zaehlerplatz: {
    key: "zaehlerplatz",
    title: "Zählerplatz",
    base: 165.66,
    unitPrice: 460.2,
    unit: "st" as const,
  },
};

// helpers (isto kao u Balkonu)
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
