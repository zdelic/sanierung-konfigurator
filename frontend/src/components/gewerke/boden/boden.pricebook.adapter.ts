import type { PricebookItemDTO, PricebookItemMap } from "@/lib/pricebook/types";
import { num } from "@/lib/pricebook/client";
import type { BodenPriceBook, RangePrice } from "./boden.pricebook";

function req(map: PricebookItemMap, key: string): PricebookItemDTO {
  const it = map[key];
  if (!it) throw new Error(`Missing pricebook item: "${key}"`);
  return it;
}

function parseRangeToken(token: string): {
  min: number | null;
  max: number | null;
} {
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
  return Object.keys(map)
    .filter((k) => k.startsWith(prefix))
    .map((k) => {
      const token = k.slice(prefix.length);
      const { min, max } = parseRangeToken(token);
      return { min, max, price: num(req(map, k).grundpreis) };
    })
    .sort((a, b) => (a.min ?? 0) - (b.min ?? 0));
}

export function buildBodenPricebook(map: PricebookItemMap): BodenPriceBook {
  const bestandMeta = req(map, "bestand.meta");

  const btAny = req(map, "bestand_teppich.ranges.0_40");
  const blAny = req(map, "bestand_laminat.ranges.0_40");
  const bpAny = req(map, "bestand_parkett.ranges.0_40");

  const neuTAny = req(map, "neu_teppich.ranges.0_40");
  const neuLAny = req(map, "neu_laminat.ranges.0_40");
  const neuPAny = req(map, "neu_parkett.ranges.0_40");

  const teil = req(map, "teil_sanierung_parkett");
  const eT = req(map, "einzel_teppich");
  const eL = req(map, "einzel_laminat");
  const eP = req(map, "einzel_parkett");

  const antidroe = req(map, "aufz_antidroe");
  const antidroeEinz = req(map, "aufz_antidroe_einzel_laminat");
  const fisch = req(map, "aufz_fischgraet");
  const vv = req(map, "aufz_verlegen_versiegeln");
  const mf = req(map, "mauerfries");

  return {
    bestand: {
      title: bestandMeta.title,
      description: bestandMeta.description ?? "",
    },

    bestand_teppich: {
      title: btAny.title,
      ranges: buildRanges(map, "bestand_teppich.ranges."),
    },
    bestand_laminat: {
      title: blAny.title,
      ranges: buildRanges(map, "bestand_laminat.ranges."),
    },
    bestand_parkett: {
      title: bpAny.title,
      ranges: buildRanges(map, "bestand_parkett.ranges."),
    },

    teil_sanierung_parkett: {
      title: teil.title,
      base: num(teil.grundpreis),
      ratePerM2: num(teil.unitprice),
    },

    neu_teppich: {
      title: neuTAny.title,
      requiresAbbruchBelag: true,
      ranges: buildRanges(map, "neu_teppich.ranges."),
    },
    neu_laminat: {
      title: neuLAny.title,
      requiresAbbruchBelag: true,
      ranges: buildRanges(map, "neu_laminat.ranges."),
    },
    neu_parkett: {
      title: neuPAny.title,
      requiresAbbruchBelag: true,
      ranges: buildRanges(map, "neu_parkett.ranges."),
    },

    einzel_teppich: {
      title: eT.title,
      base: num(eT.grundpreis),
      ratePerM2: num(eT.unitprice),
    },
    einzel_laminat: {
      title: eL.title,
      base: num(eL.grundpreis),
      ratePerM2: num(eL.unitprice),
    },
    einzel_parkett: {
      title: eP.title,
      base: num(eP.grundpreis),
      ratePerM2: num(eP.unitprice),
    },

    aufz_antidroe: {
      title: antidroe.title,
      factorOfNeuLaminat: num(antidroe.unitprice),
    },
    aufz_antidroe_einzel_laminat: {
      title: antidroeEinz.title,
      ratePerM2: num(antidroeEinz.unitprice),
    },

    aufz_fischgraet: {
      title: fisch.title,
      base: num(fisch.grundpreis),
      ratePerM2: num(fisch.unitprice),
    },
    aufz_verlegen_versiegeln: { title: vv.title, ratePerM2: num(vv.unitprice) },

    mauerfries: { title: mf.title, ratePerLfm: num(mf.unitprice) },
  };
}
