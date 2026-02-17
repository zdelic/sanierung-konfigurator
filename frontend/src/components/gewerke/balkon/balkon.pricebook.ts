// balkon.pricebook.ts
export type RangePrice = {
  min: number | null;
  max: number | null;
  price: number;
};

export const BALKON_PRICEBOOK = {
  meta: {
    title: "Balkon",
    subtitle: "Sanierung, Abdichtung & Beläge",
  },

  // =========================
  // Bestand (exklusivno)
  // =========================
  bestand: {
    key: "bestand",
    title: "Bestand",
    description:
      "Reinigung der Fugen, Reinigung Rigole + Gully, Nachrichtung Plattenbelag",
    ranges: [
      { min: 0, max: 4, price: 1111.73 },
      { min: 4.0000001, max: 8, price: 1219.0 },
      { min: 8.0000001, max: null, price: 1325.05 },
    ] as RangePrice[],
  },

  // =========================
  // Hauptpositionen (exklusivno)
  // =========================
  sanierung_ohne_daemmung: {
    key: "sanierung_ohne_daemmung",
    title: "Balkonsanierung ohne Wärmedämmung (mit Tropfnase)",
    description:
      "Räumung, Abdichtung 2-lagig, Spengler (Wasserspeier/Fallrohr/Sohlbank), Plattenleger (Estrichplatten, Rigol, Revisionsschacht)",
    ranges: [
      { min: 0, max: 4, price: 4284.9 },
      { min: 4.0000001, max: 8, price: 6557.3 },
      { min: 8.0000001, max: null, price: 9180.45 },
    ] as RangePrice[],
  },

  sanierung_mit_daemmung: {
    key: "sanierung_mit_daemmung",
    title: "Balkonsanierung mit Wärmedämmung (XPS bis 10cm) (mit Tropfnase)",
    description:
      "Räumung, Abdichtung 2-lagig, Verlegung W.D., Spengler, Plattenleger (Estrichplatten, Rigol, Revisionsschacht)",
    ranges: [
      { min: 0, max: 4, price: 4765.6 },
      { min: 4.0000001, max: 8, price: 7305.95 },
      { min: 8.0000001, max: null, price: 10351.15 },
    ] as RangePrice[],
  },

  sanierung_mit_daemmung_attika: {
    key: "sanierung_mit_daemmung_attika",
    title: "Balkonsanierung mit Wärmedämmung (XPS bis 10cm) und Attika",
    description:
      "Räumung, Abdichtung 2-lagig, Verlegung W.D., Spengler, Plattenleger (Estrichplatten, Rigol, Revisionsschacht)",
    ranges: [
      { min: 0, max: 4, price: 6336.5 },
      { min: 4.0000001, max: 8, price: 9423.1 },
      { min: 8.0000001, max: null, price: 12880.0 },
    ] as RangePrice[],
  },

  // =========================
  // Aufzahlungen (multi)
  // =========================
  aufz_stelzlager: {
    key: "aufz_stelzlager",
    title: "Aufzahlung Estrichplatten auf Stelzlager",
    description: "Aufzahlung auf Grundposition",
    ranges: [
      { min: 0, max: 4, price: 236.49 },
      { min: 4.0000001, max: 8, price: 472.97 },
      { min: 8.0000001, max: null, price: 709.46 },
    ] as RangePrice[],
  },

  aufz_feinsteinzeug: {
    key: "aufz_feinsteinzeug",
    title: "Aufzahlung Feinsteinzeugplatte 40/40/2",
    description: "anstatt Estrichplatten",
    ranges: [
      { min: 0, max: 4, price: 413.24 },
      { min: 4.0000001, max: 8, price: 826.48 },
      { min: 8.0000001, max: null, price: 1240.94 },
    ] as RangePrice[],
  },

  aufz_holz_laerche: {
    key: "aufz_holz_laerche",
    title: "Aufzahlung Holzbelag Lärche",
    description: "inkl. Riffelung, inkl. UK aus Alu, Hinweis: Wartung!",
    ranges: [
      { min: 0, max: 4, price: 472.97 },
      { min: 4.0000001, max: 8, price: 944.73 },
      { min: 8.0000001, max: null, price: 1417.7 },
    ] as RangePrice[],
  },

  aufz_brandschutz: {
    key: "aufz_brandschutz",
    title: "Aufzahlung Brandschutz",
    description:
      "Entwässerung mittels LORO-System DN 70 mit Brandschutzmanschette",
    ranges: [
      { min: 0, max: 8, price: 570.49 },
      { min: 8.0000001, max: null, price: 1017.87 },
    ] as RangePrice[],
  },

  aufz_rinne: {
    key: "aufz_rinne",
    title: "Aufzahlung Rinne bei Balkon",
    description: "Rigol vor Balkontüre",
    ranges: [
      { min: 0, max: 4, price: 295.0 },
      { min: 4.0000001, max: 8, price: 591.22 },
      { min: 8.0000001, max: null, price: 886.21 },
    ] as RangePrice[],
  },

  aufz_abdichtung_3_lage: {
    key: "aufz_abdichtung_3_lage",
    title: "Aufzahlung Abdichtung 3te Lage",
    description: "inkl. Hochzügen",
    ranges: [
      { min: 0, max: 4, price: 102.4 },
      { min: 4.0000001, max: 8, price: 203.57 },
      { min: 8.0000001, max: null, price: 260.87 },
    ] as RangePrice[],
  },

  aufz_gefaelledaemmung: {
    key: "aufz_gefaelledaemmung",
    title: "Aufzahlung Gefälledämmung",
    description: "Gefälledämmplatten (wenn möglich & ausführbar)",
    ranges: [
      { min: 0, max: 4, price: 437.62 },
      { min: 4.0000001, max: 8, price: 765.53 },
      { min: 8.0000001, max: null, price: 1093.44 },
    ] as RangePrice[],
  },

  aufz_pur_daemmung: {
    key: "aufz_pur_daemmung",
    title: "Aufzahlung PUR_Dämmung",
    description: "Dämmplatten mit erhöhtem Dämmwert",
    ranges: [
      { min: 0, max: 4, price: 415.68 },
      { min: 4.0000001, max: 8, price: 727.74 },
      { min: 8.0000001, max: null, price: 1039.81 },
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
