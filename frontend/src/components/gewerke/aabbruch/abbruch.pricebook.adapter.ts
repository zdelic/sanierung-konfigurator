import type { PricebookItemDTO, PricebookItemMap } from "@/lib/pricebook/types";
import { num } from "@/lib/pricebook/client";
import type {
  AbbruchPriceBook,
  RangePrice,
  TeilPrice,
} from "./abbruch.pricebook";

function req(map: PricebookItemMap, key: string): PricebookItemDTO {
  const it = map[key];
  if (!it) throw new Error(`Missing pricebook item: "${key}"`);
  return it;
}

function parseRangeToken(token: string): {
  min: number | null;
  max: number | null;
} {
  // token examples: "0_40", "41_50", "101_plus", "91_plus"
  if (token.endsWith("_plus")) {
    const min = Number(token.replace("_plus", ""));
    return { min: Number.isFinite(min) ? min : null, max: null };
  }
  const [a, b] = token.split("_");
  const min = Number(a);
  const max = Number(b);
  return {
    min: Number.isFinite(min) ? min : null,
    max: Number.isFinite(max) ? max : null,
  };
}

function buildRanges(map: PricebookItemMap, prefix: string): RangePrice[] {
  const keys = Object.keys(map).filter((k) => k.startsWith(prefix));

  return keys
    .map((k) => {
      const token = k.slice(prefix.length);
      const { min, max } = parseRangeToken(token);
      const it = req(map, k);

      return {
        min,
        max,
        price: num(it.grundpreis),
        title: it.title,
        description: it.description ?? undefined,
      };
    })
    .sort((a, b) => (a.min ?? 0) - (b.min ?? 0));
}

function teilPerArea(item: PricebookItemDTO): TeilPrice {
  return {
    type: "per_area",
    unit: "m2",
    base: num(item.grundpreis),
    rate: num(item.unitprice),
  };
}

function teilPerUnit(item: PricebookItemDTO): TeilPrice {
  return {
    type: "per_unit",
    unit: "piece",
    base: num(item.grundpreis),
    rate: num(item.unitprice),
  };
}

export function buildAbbruchPricebook(map: PricebookItemMap): AbbruchPriceBook {
  const belagTeil = req(map, "belag.teil");
  const belagAny = req(map, "belag.voll.0_40");
  const estrichTeil = req(map, "estrich.teil");
  const estrichAny = req(map, "estrich.voll.0_40");

  const innentuerenAny = req(map, "innentueren.voll.0_40");

  const zarge = req(map, "tuerenTeil.zarge");
  const blatt = req(map, "tuerenTeil.blatt");
  const eingang = req(map, "tuerenTeil.eingang");

  const wd_mauerwerk = req(map, "waendeDecke.mauerwerk");
  const wd_vorsatzschale = req(map, "waendeDecke.vorsatzschale");
  const wd_decke = req(map, "waendeDecke.decke");
  const wd_trockenbauwaende = req(map, "waendeDecke.trockenbauwaende");
  const wd_kamin = req(map, "waendeDecke.kamin");
  const wd_tuerdurchbruch = req(map, "waendeDecke.tuerdurchbruch");

  return {
    belag: {
      title: belagAny.title,
      description: belagTeil.description ?? "",
      voll: buildRanges(map, "belag.voll."),
      teil: teilPerArea(belagTeil),
    },

    estrich: {
      title: estrichAny.title,
      description: estrichTeil.description ?? "",
      voll: buildRanges(map, "estrich.voll."),
      teil: teilPerArea(estrichTeil),
    },

    innentueren: {
      title: innentuerenAny.title,
      description: innentuerenAny.description ?? "",
      voll: buildRanges(map, "innentueren.voll."),
    },

    tuerenTeil: {
      zarge: {
        title: zarge.title, // ✅ iz DB
        description: zarge.description ?? "",
        teil: teilPerUnit(zarge),
      },
      blatt: {
        title: blatt.title, // ✅ iz DB
        description: blatt.description ?? "",
        teil: teilPerUnit(blatt),
      },
      eingang: {
        title: eingang.title, // ✅ iz DB
        description: eingang.description ?? "",
        pauschal: num(eingang.grundpreis),
      },
    },

    waendeDecke: {
      title: wd_mauerwerk.title,
      description: wd_mauerwerk.description ?? "",
      base: num(wd_mauerwerk.grundpreis),
      positions: {
        mauerwerk: {
          label: wd_mauerwerk.title,
          rate: num(wd_mauerwerk.unitprice),
          unit: "m2",
        },
        vorsatzschale: {
          label: wd_vorsatzschale.title,
          rate: num(wd_vorsatzschale.unitprice),
          unit: "m2",
        },
        decke: {
          label: wd_decke.title,
          rate: num(wd_decke.unitprice),
          unit: "m2",
        },
        trockenbauwaende: {
          label: wd_trockenbauwaende.title,
          rate: num(wd_trockenbauwaende.unitprice),
          unit: "m2",
        },
        kamin: {
          label: wd_kamin.title,
          rate: num(wd_kamin.unitprice),
          unit: "m2",
        },
        tuerdurchbruch: {
          label: wd_tuerdurchbruch.title,
          rate: num(wd_tuerdurchbruch.unitprice),
          unit: "stk",
        },
      },
    },
  };
}
