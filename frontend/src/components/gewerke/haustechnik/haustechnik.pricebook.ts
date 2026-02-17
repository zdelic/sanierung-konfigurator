// haustechnik.pricebook.ts
export type RangePrice = {
  min: number | null;
  max: number | null;
  price: number;
};

export const HST_PRICEBOOK = {
  meta: {
    title: "Haustechnik",
    subtitle: "Heizung • Lüftung • Sanitär • Gas",
  },

  // =========================
  // Bestand / Befund (m²)
  // =========================
  befund: {
    key: "befund",
    title: "HST Bestand - Befundaufnahme / Statusbericht",
    description:
      "Dichtheitsprobe + visuelle Prüfung. Heizung: Leitungen + Heizkörper. Sanitär: Leitungen + Armaturen + Oberflächen. Brandschutz.",
    ranges: [
      { min: 0, max: 40, price: 282.81 },
      { min: 40.0000001, max: 50, price: 335.23 },
      { min: 50.0000001, max: 60, price: 462.0 },
      { min: 60.0000001, max: 70, price: 514.42 },
      { min: 70.0000001, max: 80, price: 639.98 },
      { min: 80.0000001, max: 90, price: 692.39 },
      { min: 90.0000001, max: 100, price: 744.81 },
      { min: 100.0000001, max: null, price: 975.2 },
    ] as RangePrice[],
  },

  // =========================
  // Heizung (m²)
  // =========================
  heizkoerper_tausch: {
    key: "heizkoerper_tausch",
    title: "Heizung - Heizkörper tauschen ab Wohnungsbereich",
    description:
      "inkl. Entsorgung, inkl. protokollierter Inbetriebnahme (ohne Wasseraufbereitung), inkl. neuer Thermostatköpfe. Erfordert Befundaufnahme.",
    ranges: [
      { min: 0, max: 40, price: 1688.81 },
      { min: 40.0000001, max: 50, price: 1968.69 },
      { min: 50.0000001, max: 60, price: 2336.82 },
      { min: 60.0000001, max: 70, price: 2636.7 },
      { min: 70.0000001, max: 80, price: 3103.57 },
      { min: 80.0000001, max: 90, price: 3520.47 },
      { min: 90.0000001, max: 100, price: 3937.37 },
      { min: 100.0000001, max: null, price: 4838.21 },
    ] as RangePrice[],
  },

  heizleitungen_tausch: {
    key: "heizleitungen_tausch",
    title:
      "Heizungsleitungen tauschen ab Wohnungsbereich (exkl. Energieaufbereitung)",
    description:
      "inkl. Entsorgung. Erfordert: Befundaufnahme + Heizkörper tauschen. Zusätzlich: Neuherstellen Estrich + Neuherstellen Belag (Teppich/Laminat/Parkett - Pflichtauswahl).",
    ranges: [
      { min: 0, max: 40, price: 1834.6 },
      { min: 40.0000001, max: 50, price: 2260.03 },
      { min: 50.0000001, max: 60, price: 2752.5 },
      { min: 60.0000001, max: 70, price: 3177.93 },
      { min: 70.0000001, max: 80, price: 3602.15 },
      { min: 80.0000001, max: 90, price: 4060.49 },
      { min: 90.0000001, max: 100, price: 4520.05 },
      { min: 100.0000001, max: null, price: 5793.91 },
    ] as RangePrice[],
  },

  aufz_sockelkanal: {
    key: "aufz_sockelkanal",
    title: "Aufzahlung - Führung Heizungsleitungen im Sockelkanal",
    description:
      "Dafür entfällt Abbruch & Wiederherstellung Estrich. Preis ident Estrich schlitzen, vergießen, verdübeln. Erfordert: Befundaufnahme + Heizungsleitungen tauschen + Heizkörper tauschen.",
    ranges: [
      { min: 0, max: 40, price: 903.28 },
      { min: 40.0000001, max: 50, price: 1128.8 },
      { min: 50.0000001, max: 60, price: 1354.31 },
      { min: 60.0000001, max: 70, price: 1579.82 },
      { min: 70.0000001, max: 80, price: 1805.34 },
      { min: 80.0000001, max: 90, price: 2030.85 },
      { min: 90.0000001, max: 100, price: 2257.59 },
      { min: 100.0000001, max: null, price: 2934.13 },
    ] as RangePrice[],
  },

  aufz_fbh: {
    key: "aufz_fbh",
    title: "Aufzahlung Ausführung einer Fußbodenheizung",
    description:
      "Aufzahlung auf Heizkörper-Tausch & Heizleitungen tauschen (exkl. Energieaufbereitung). inkl. Raumthermostat, Verteiler, Anpassung Estrich, Ausheizung & Lüftung. Erfordert: Befund + Heizkörper tauschen + Heizleitungen tauschen + Abbruch Estrich + Abbruch Belag.",
    ranges: [
      { min: 0, max: 40, price: 2534.3 },
      { min: 40.0000001, max: 50, price: 3019.46 },
      { min: 50.0000001, max: 60, price: 3335.18 },
      { min: 60.0000001, max: 70, price: 4424.97 },
      { min: 70.0000001, max: 80, price: 4657.8 },
      { min: 80.0000001, max: 90, price: 5057.63 },
      { min: 90.0000001, max: 100, price: 5457.46 },
      { min: 100.0000001, max: null, price: 7193.32 },
    ] as RangePrice[],
  },

  kuehl_heizdecke: {
    key: "kuehl_heizdecke",
    title: "Aufzahlung Kühl- und Heizdecke",
    description: "Erfordert Befundaufnahme. Preis: Wohnung m² * 418,00",
    perM2: 418.0,
  },

  // =========================
  // Lüftung
  // =========================
  lueftung_filter: {
    key: "lueftung_filter",
    title: "Lüftung - Filtertausch",
    description: "Erfordert Befundaufnahme.",
    ranges: [
      { min: 0, max: 50, price: 85.33 },
      { min: 50.0000001, max: null, price: 169.44 },
    ] as RangePrice[],
  },

  lueftung_ventilator: {
    key: "lueftung_ventilator",
    title: "Lüftung - Ventilatortausch exkl. Lüftungsleitungen Bad und WC",
    description:
      "Fabrikat: Helios oder gleichwertig (Nachlauf, Feuchtsteuerung, Bewegungsmelder weiß). Erfordert Befundaufnahme.",
    price: 1246.3,
  },

  lueftungszuleitung: {
    key: "lueftungszuleitung",
    title: "Lüftungszuleitung",
    base: 257.71,
    unitPrice: 423.38,
    unit: "lfm" as const,
  },

  // =========================
  // Sanitär
  // =========================
  sanitaer_bad_gesamt: {
    key: "sanitaer_bad_gesamt",
    title: "Sanitär Gesamterneuerung Badezimmer",
    description:
      "WC + Badewanne 170/75 inkl. Wannenträger, WT inkl. Trägergestell, WM-Anschluss, Stand-WC, Armaturen, Zu-/Abfluss, Brandschutz, Entsorgung. Erfordert: Befund + Abbruch Belag + Neuherstellung Fliesen Bad + Neuherstellung Estrich.",
    price: 8331.12,
  },

  sanitaer_fallstrang: {
    key: "sanitaer_fallstrang",
    title: "Sanitär - Anschluss Ablauf an Fallstrang",
    description:
      "Schacht öffnen, neuer Abzweiger, Wiederherstellung inkl. ggf. Brandschutz. Erfordert Befund.",
    price: 917.91,
  },

  sanitaer_zus_dusche: {
    key: "sanitaer_zus_dusche",
    title: "Zusätzliche Dusche",
    description:
      "(Fabrikat Bernstein oder gleichwertig) inkl. Duschkabine, Verfliesung und Armaturen.",
    price: 5995.0,
  },

  aufz_vollglas: {
    key: "aufz_vollglas",
    title: "Aufzahlung Duschkabine in Vollglas inkl. Drehtüre",
    description: "(Fabrikat Bernstein oder gleichwertig)",
    price: 2750.0,
  },

  sanitaer_zus_wt: {
    key: "sanitaer_zus_wt",
    title: "Sanitär - Zusätzlicher Waschtisch",
    description: "inkl. Kaltwasseranschluss, Abfluss, Siphon, Armaturen",
    price: 975.2,
  },

  sanitaer_wt_tausch: {
    key: "sanitaer_wt_tausch",
    title: "Sanitär - Waschtischtausch",
    description: "WT entsorgen, neuer WT inkl. Siphon und Armatur",
    price: 511.98,
  },

  sanitaer_wc_tausch: {
    key: "sanitaer_wc_tausch",
    title: "Sanitär - WC tauschen",
    description: "WC demontieren/entsorgen, Montage neues WC inkl. Deckel",
    price: 585.12,
  },

  sanitaer_wanne_dusche_tausch: {
    key: "sanitaer_wanne_dusche_tausch",
    title: "Sanitär - Bestehende Badewanne/Dusche tauschen",
    description:
      "Demontage/Entsorgung, Montage inkl. Siphon, Armaturen, Brauseschlauch",
    price: 1194.62,
  },

  sanitaer_gebrauch: {
    key: "sanitaer_gebrauch",
    title: "Sanitär - Gebrauchsoberflächen tauschen",
    description: "z.B. WC-Deckel, Brauseschlauch",
    price: 426.65,
  },

  sanitaer_kueche_aufputz: {
    key: "sanitaer_kueche_aufputz",
    title: "Sanitär/Küche - Warm- & Kaltwasseranschluss sowie Abfluss-Aufputz",
    description: "Erfordert Befundaufnahme.",
    price: 560.74,
  },

  aufz_sprossen_e: {
    key: "aufz_sprossen_e",
    title: "Sanitär - Aufzahlung Sprossenheizkörper mit E-Patrone (Bad)",
    description: "Erfordert: Befund + Sanitär Gesamterneuerung Badezimmer/WC",
    price: 708.24,
  },

  aufz_haenge_wc: {
    key: "aufz_haenge_wc",
    title: "Sanitär - Aufzahlung Stand-WC auf Hänge-WC (soweit umsetzbar)",
    description: "Erfordert: Befund + Sanitär Gesamterneuerung Badezimmer/WC",
    price: 991.05,
  },

  aufz_duschtasse: {
    key: "aufz_duschtasse",
    title:
      "Sanitär - Aufzahlung Duschtasse mit Duschtrennwand anstatt Badewanne",
    description:
      "soweit technisch umsetzbar. Erfordert: Befund + Erneuerung Badezimmer",
    price: 849.64,
  },

  behindertengerecht: {
    key: "behindertengerecht",
    title: "Sanitärgegenstände behindertengerecht (WC, WT, Dusche Superplan)",
    description:
      "inkl. Haltegriffe. Hinweis Vorleistungen: Gesamterneuerung Badezimmer, Aufzahlung Duschtasse, Aufzahlung Stand-WC (Hänge-WC).",
    price: 2623.29,
  },

  klappsitz: { key: "klappsitz", title: "Klappsitz", price: 660.0 },
  armatur: { key: "armatur", title: "Armatur Dusche/Waschtisch", price: 802.0 },
  wc_sensor: {
    key: "wc_sensor",
    title: "WC-Betätigung sensorgesteuert",
    price: 796.4,
  },
  gebrauch_2: {
    key: "gebrauch_2",
    title: "Gebrauchsoberflächen tauschen",
    price: 441.78,
  },
  untertisch_10l: {
    key: "untertisch_10l",
    title: "Untertischspeicher 10l",
    price: 625.86,
  },
  e_speicher: {
    key: "e_speicher",
    title: "E - Speicher 80l/100l",
    price: 1564.66,
  },

  // =========================
  // Gas
  // =========================
  gas_pruefung: {
    key: "gas_pruefung",
    title: "Gas - Überprüfung der Bestandsanlage",
    description:
      "Überprüfung Gas Zu- & Innenleitungen, Druckprotokolle, Dokumentation. Erfordert Befundaufnahme.",
    price: 483.94,
  },

  gas_service: {
    key: "gas_service",
    title: "Gastherme servicieren",
    description: "Erfordert Befundaufnahme.",
    price: 343.76,
  },

  gas_therme_neu: {
    key: "gas_therme_neu",
    title: "Gastherme erneuern",
    description:
      "inkl. Vorbesprechung Gasversorger, Gasleitung außer Betrieb, Entsorgung, Inbetriebnahme & Abnahme. Erfordert Befundaufnahme.",
    price: 6643.55,
  },

  gas_innenleitungen: {
    key: "gas_innenleitungen",
    title: "Gas Innenleitungen erneuern (falls erforderlich)",
    description:
      "vom Wohnungszähler bis Gastherme inkl. Inbetriebnahme & Abnahme. Erfordert Befundaufnahme.",
    ranges: [
      { min: 0, max: 50, price: 2178.35 },
      { min: 50.0000001, max: 70, price: 2240.52 },
      { min: 70.0000001, max: 80, price: 2299.03 },
      { min: 80.0000001, max: 90, price: 2328.29 },
      { min: 90.0000001, max: null, price: 2358.77 },
    ] as RangePrice[],
  },

  gaszuleitung: {
    key: "gaszuleitung",
    title: "Gaszuleitung",
    base: 441.79,
    unitPrice: 202.49,
    unit: "lfm" as const,
  },

  zaehlerplatte: {
    key: "zaehlerplatte",
    title: "Zählerplatte",
    base: 165.66,
    unitPrice: 460.2,
    unit: "st" as const,
  },
};

// helpers (isto kao kod Balkona)
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
