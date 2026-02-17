// abbruch.pricebook.ts

export type RangePrice = {
  min: number | null; // null = offen
  max: number | null;
  price: number; // EUR pauschal
};

export type TeilPrice =
  | {
      type: "per_area";
      unit: "m2";
      base: number; // Grundpauschale
      rate: number; // EUR/m²
    }
  | {
      type: "per_unit";
      unit: "piece";
      base: number; // Grundpauschale pro Einheit
      rate: number; // EUR pro Einheit
    };

export type AbbruchPriceBook = {
  belag: {
    description: string;
    voll: RangePrice[];
    teil: TeilPrice; // per_area
  };
  estrich: {
    description: string;
    voll: RangePrice[];
    teil: TeilPrice; // per_area
  };

  innentueren: {
    description: string;
    voll: RangePrice[];
  };

  tuerenTeil: {
    zarge: {
      description: string;
      teil: TeilPrice; // per_unit
    };
    blatt: {
      description: string;
      teil: TeilPrice; // per_unit
    };
    eingang: {
      description: string;
      pauschal: number;
    };
  };

  waendeDecke: {
    description: string;
    base: number; // 875,25 EUR (einmal)
    positions: {
      mauerwerk: { label: string; rate: number; unit: "m2" };
      vorsatzschale: { label: string; rate: number; unit: "m2" };
      decke: { label: string; rate: number; unit: "m2" };
      trockenbauwaende: { label: string; rate: number; unit: "m2" };
      kamin: { label: string; rate: number; unit: "m2" };
      tuerdurchbruch: { label: string; rate: number; unit: "stk" };
    };
  };
};

export const ABBRUCH_PRICEBOOK: AbbruchPriceBook = {
  belag: {
    description:
      "Abbruch des bestehenden Belags (Teppich, Fliesen, Holz, etc.) inkl. Sockelleisten & inkl. sach- und fachgerechter Entsorgung",
    voll: [
      { min: 0, max: 40, price: 788.26 },
      { min: 41, max: 50, price: 1144.71 },
      { min: 51, max: 60, price: 1373.65 },
      { min: 61, max: 70, price: 1602.59 },
      { min: 71, max: 80, price: 1831.54 },
      { min: 81, max: 90, price: 2060.78 },
      { min: 91, max: 100, price: 2289.42 },
      { min: 101, max: null, price: 2976.25 },
    ],
    teil: { type: "per_area", unit: "m2", base: 371.98, rate: 19.7 },
  },

  estrich: {
    description:
      "Abbruch des Bestandsestrichs inkl. Unterbau & inkl. sach- und fachgerechter Entsorgung",
    voll: [
      { min: 0, max: 40, price: 2283.62 },
      { min: 41, max: 50, price: 2693.69 },
      { min: 51, max: 60, price: 3232.72 },
      { min: 61, max: 70, price: 3770.3 },
      { min: 71, max: 80, price: 4309.33 },
      { min: 81, max: 90, price: 4687.52 },
      { min: 91, max: 100, price: 5067.15 },
      { min: 101, max: null, price: 6587.15 },
    ],
    teil: { type: "per_area", unit: "m2", base: 415.75, rate: 24.0 },
  },

  innentueren: {
    description: "Abbruch – Innentürzargen samt Türblatt",
    voll: [
      { min: 0, max: 40, price: 246.33 },
      { min: 41, max: 50, price: 369.5 },
      { min: 51, max: 60, price: 369.5 },
      { min: 61, max: 80, price: 492.66 },
      { min: 81, max: 90, price: 553.52 },
      { min: 91, max: null, price: 614.38 },
    ],
  },

  tuerenTeil: {
    zarge: {
      description: "Teilleistung – Abbruch – Innentürzarge (Einzelzarge)",
      // ✅ FIX: Stück = (base + rate) * qty
      teil: { type: "per_area", unit: "m2", base: 109.4, rate: 76.58 },
    },
    blatt: {
      description: "Teilleistung – Abbruch – Einzeltürblatt",
      // ✅ FIX: Stück = (base + rate) * qty
      teil: { type: "per_area", unit: "m2", base: 109.4, rate: 43.76 },
    },
    eingang: {
      description:
        "Abbruch Eingangstüre samt Zarge inkl. sach- und fachgerechter Entsorgung",
      pauschal: 333.27,
    },
  },

  waendeDecke: {
    description: "Abbruch Teilleistungen – Wände und Decke",
    base: 875.25,
    positions: {
      mauerwerk: { label: "Abbruch Wände Mauerwerk", rate: 51.8, unit: "m2" },
      vorsatzschale: {
        label: "Abbruch Vorsatzschale",
        rate: 39.38,
        unit: "m2",
      },
      decke: {
        label: "Abbruch abgeh. Decke / Verkleidungen",
        rate: 43.76,
        unit: "m2",
      },
      trockenbauwaende: {
        label: "Abbruch Trockenbauwände",
        rate: 43.76,
        unit: "m2",
      },
      kamin: { label: "Abbruch Kamin", rate: 153.17, unit: "m2" },
      tuerdurchbruch: {
        label:
          "Türdurchbruch herstellen (nicht tragend) bis 100/220cm samt Überlage und Leibungsherstellung",
        rate: 547.03,
        unit: "stk",
      },
    },
  },
};

export function pickRangePrice(menge: number, ranges: RangePrice[]) {
  const m = Math.max(0, Number(menge || 0));
  const hit = ranges.find(
    (r) => (r.min == null || m >= r.min) && (r.max == null || m <= r.max),
  );
  return hit?.price ?? 0;
}
