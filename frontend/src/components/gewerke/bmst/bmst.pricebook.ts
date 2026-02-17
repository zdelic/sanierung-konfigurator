// bmst.pricebook.ts

export type BMSTPriceBook = {
  tuerdurchbruch_tragend: {
    description: string;
    ratePerPiece: number;
  };

  auswechslung20: {
    title: string;
    description: string;
    warning: string;
    statikFee: number; // 2194,20
    base: number;
    ratePerLfm: number;
  };

  auswechslung40: {
    title: string;
    description: string;
    warning: string;
    statikFee: number; // 2194,20
    base: number;
    ratePerLfm: number;
  };

  mwk_nicht_tragend: {
    description: string;
    base: number;
    ratePerM2: number;
  };

  mwk_tragend: {
    description: string;
    base: number;
    ratePerM2: number;
  };

  ausmauerung_nf: {
    description: string;
    base: number;
    ratePerM3: number;
  };

  kamin_herstellen: {
    description: string;
    base: number;
    ratePerM3: number;
  };

  aufz_tuerchen: {
    description: string;
    ratePerPiece: number;
  };
};

export const BMST_PRICEBOOK: BMSTPriceBook = {
  tuerdurchbruch_tragend: {
    description:
      "Türdurchbruch (tragend) bis 100/220cm – samt Überlage und Leibungsherstellung",
    ratePerPiece: 644.27,
  },

  auswechslung20: {
    title: "Auswechslung in tragender Wand bis 20cm",
    description:
      "bis HEA 180 inkl. Auflager, kraftschlüssiges vermörteln sowie verputzen der Leibungen",
    warning: "ACHTUNG! Einreichung + Statische Berechnung",
    statikFee: 2194.2,
    base: 736.32,
    ratePerLfm: 723.06,
  },

  auswechslung40: {
    title: "Auswechslung in tragender Wand bis 40cm",
    description:
      "bis HEA 180 inkl. Auflager, kraftschlüssiges vermörteln sowie verputzen der Leibungen",
    warning: "ACHTUNG! Einreichung + Statische Berechnung",
    statikFee: 2194.2,
    base: 1104.47,
    ratePerLfm: 1799.55,
  },

  mwk_nicht_tragend: {
    description: "MWK (inkl. Verputz) nicht tragend",
    base: 165.66,
    ratePerM2: 254.03,
  },

  mwk_tragend: {
    description: "Tragendes MWK (inkl. Verputz)",
    base: 165.66,
    ratePerM2: 298.2,
  },

  ausmauerung_nf: {
    description: "Ausmauerungen mit NF Ziegel (inkl. Verputz)",
    base: 248.5,
    ratePerM3: 1347.46,
  },

  kamin_herstellen: {
    description: "Kamin herstellen",
    base: 331.35,
    ratePerM3: 294.09,
  },

  aufz_tuerchen: {
    description: "Aufzahlung Türchen",
    ratePerPiece: 128.86,
  },
};

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
