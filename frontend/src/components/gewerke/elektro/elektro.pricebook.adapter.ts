import type { PricebookItemDTO, PricebookItemMap } from "@/lib/pricebook/types";
import { num } from "@/lib/pricebook/client";
import type { RangePrice } from "./elektro.pricebook";
import type { InfrarotVariantKey } from "./elektro.calc";

export type ElektroPriceBook = {
  meta: { title: string; subtitle: string };

  befundaufnahme: { title: string; description?: string; ranges: RangePrice[] };

  wohnungsverteiler: { title: string; description?: string; price: number };

  grundinstallation: {
    title: string;
    description?: string;
    ranges: RangePrice[];
    infoPdf: { label: string; assetPath: string };
  };

  schalter_stecker_sprechst: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };

  kleine_e_pauschale: { title: string; price: number };
  erdung_badewanne: { title: string; price: number };

  e_raum_bis_10: { title: string; price: number };
  e_raum_bis_10_leer: { title: string; price: number };
  e_raum_bis_15: { title: string; price: number };
  e_raum_bis_15_leer: { title: string; price: number };
  e_raum_bis_20: { title: string; price: number };
  e_raum_bis_20_leer: { title: string; price: number };
  e_raum_bis_30: { title: string; price: number };
  e_raum_bis_30_leer: { title: string; price: number };
  e_raum_bis_40: { title: string; price: number };
  e_raum_bis_40_leer: { title: string; price: number };

  infrarot_panel: {
    title: string;
    description?: string;
    variants: {
      key: InfrarotVariantKey;
      label: string;
      base: number;
      pricePerSt: number;
    }[];
    aufz_funk: { title: string; pricePerSt: number };
    aufz_raumthermostat: { title: string; pricePerSt: number };
  };

  wohnungszuleitung: { title: string; base: number; unitPrice: number };
  zaehlerplatz: { title: string; base: number; unitPrice: number };
};

function req(map: PricebookItemMap, key: string): PricebookItemDTO {
  const it = map[key];
  if (!it) throw new Error(`Missing pricebook item "${key}"`);
  return it;
}

function parseToken(token: string) {
  // "0_40" | "41_50" | "101_plus"
  if (token.endsWith("_plus")) {
    const min = Number(token.replace("_plus", ""));
    return { min, max: null as number | null };
  }
  const [a, b] = token.split("_");
  return { min: Number(a), max: Number(b) };
}

function buildRanges(map: PricebookItemMap, prefix: string): RangePrice[] {
  return Object.keys(map)
    .filter((k) => k.startsWith(prefix))
    .map((k) => {
      const token = k.slice(prefix.length);
      const { min, max } = parseToken(token);

      // ✅ da nema overlap na granicama: 41 znači > 40 (isto kao tvoj 40.0000001)
      const EPS = 0.0000001;
      const minAdj = min > 0 ? min + EPS : min;

      return { min: minAdj, max, price: num(req(map, k).grundpreis) };
    })
    .sort((a, b) => (a.min ?? 0) - (b.min ?? 0));
}

export function buildElektroPricebook(map: PricebookItemMap): ElektroPriceBook {
  const sec = req(map, "section.basic");

  const befund = req(map, "befundaufnahme");
  const grund = req(map, "grundinstallation");
  const sch = req(map, "schalter_stecker_sprechst");
  const infr = req(map, "infrarot_panel");

  return {
    meta: { title: sec.title, subtitle: sec.description ?? "" },

    befundaufnahme: {
      title: befund.title,
      description: befund.description ?? undefined,
      ranges: buildRanges(map, "befundaufnahme.ranges."),
    },

    wohnungsverteiler: {
      title: req(map, "wohnungsverteiler").title,
      description: req(map, "wohnungsverteiler").description ?? undefined,
      price: num(req(map, "wohnungsverteiler").grundpreis),
    },

    grundinstallation: {
      title: grund.title,
      description: grund.description ?? undefined,
      ranges: buildRanges(map, "grundinstallation.ranges."),
      // ovo ostaje hardcoded jer nije “cijena”
      infoPdf: {
        label: "Elektro Ausstattung: Mindestausstattung.pdf",
        assetPath: "/src/assets/E-Mindestausstattung.pdf",
      },
    },

    schalter_stecker_sprechst: {
      title: sch.title,
      description: sch.description ?? undefined,
      ranges: buildRanges(map, "schalter_stecker_sprechst.ranges."),
    },

    kleine_e_pauschale: {
      title: req(map, "kleine_e_pauschale").title,
      price: num(req(map, "kleine_e_pauschale").grundpreis),
    },
    erdung_badewanne: {
      title: req(map, "erdung_badewanne").title,
      price: num(req(map, "erdung_badewanne").grundpreis),
    },

    e_raum_bis_10: {
      title: req(map, "e_raum_bis_10").title,
      price: num(req(map, "e_raum_bis_10").grundpreis),
    },
    e_raum_bis_10_leer: {
      title: req(map, "e_raum_bis_10_leer").title,
      price: num(req(map, "e_raum_bis_10_leer").grundpreis),
    },
    e_raum_bis_15: {
      title: req(map, "e_raum_bis_15").title,
      price: num(req(map, "e_raum_bis_15").grundpreis),
    },
    e_raum_bis_15_leer: {
      title: req(map, "e_raum_bis_15_leer").title,
      price: num(req(map, "e_raum_bis_15_leer").grundpreis),
    },
    e_raum_bis_20: {
      title: req(map, "e_raum_bis_20").title,
      price: num(req(map, "e_raum_bis_20").grundpreis),
    },
    e_raum_bis_20_leer: {
      title: req(map, "e_raum_bis_20_leer").title,
      price: num(req(map, "e_raum_bis_20_leer").grundpreis),
    },
    e_raum_bis_30: {
      title: req(map, "e_raum_bis_30").title,
      price: num(req(map, "e_raum_bis_30").grundpreis),
    },
    e_raum_bis_30_leer: {
      title: req(map, "e_raum_bis_30_leer").title,
      price: num(req(map, "e_raum_bis_30_leer").grundpreis),
    },
    e_raum_bis_40: {
      title: req(map, "e_raum_bis_40").title,
      price: num(req(map, "e_raum_bis_40").grundpreis),
    },
    e_raum_bis_40_leer: {
      title: req(map, "e_raum_bis_40_leer").title,
      price: num(req(map, "e_raum_bis_40_leer").grundpreis),
    },

    infrarot_panel: {
      title: infr.title,
      description: infr.description ?? undefined,
      variants: (
        ["190w", "300w", "675w", "890w", "1050w"] as InfrarotVariantKey[]
      ).map((k) => {
        const it = req(map, `infrarot_panel.variants.${k}`);
        return {
          key: k,
          label: k.toUpperCase(),
          base: num(it.grundpreis), // ✅ uzima 441,78
          pricePerSt: num(it.unitprice), // ✅ uzima 638,76 itd.
        };
      }),
      aufz_funk: {
        title: req(map, "infrarot_panel.aufz_funk").title,
        pricePerSt: num(req(map, "infrarot_panel.aufz_funk").unitprice),
      },
      aufz_raumthermostat: {
        title: req(map, "infrarot_panel.aufz_raumthermostat").title,
        pricePerSt: num(
          req(map, "infrarot_panel.aufz_raumthermostat").unitprice,
        ),
      },
    },

    wohnungszuleitung: {
      title: req(map, "wohnungszuleitung").title,
      base: num(req(map, "wohnungszuleitung").grundpreis),
      unitPrice: num(req(map, "wohnungszuleitung").unitprice),
    },

    zaehlerplatz: {
      title: req(map, "zaehlerplatz").title,
      base: num(req(map, "zaehlerplatz").grundpreis),
      unitPrice: num(req(map, "zaehlerplatz").unitprice),
    },
  };
}
