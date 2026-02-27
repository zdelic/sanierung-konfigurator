import type { PricebookItemDTO, PricebookItemMap } from "@/lib/pricebook/types";
import { num } from "@/lib/pricebook/client";
import type { RangePrice } from "./balkon.pricebook";

export type BalkonPriceBook = {
  meta: { title: string; subtitle: string };

  bestand: { title: string; description?: string; ranges: RangePrice[] };

  sanierung_ohne_daemmung: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };
  sanierung_mit_daemmung: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };
  sanierung_mit_daemmung_attika: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };

  aufz_stelzlager: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };
  aufz_feinsteinzeug: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };
  aufz_holz_laerche: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };
  aufz_brandschutz: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };
  aufz_rinne: { title: string; description?: string; ranges: RangePrice[] };
  aufz_abdichtung_3_lage: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };
  aufz_gefaelledaemmung: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };
  aufz_pur_daemmung: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };
};

function req(map: PricebookItemMap, key: string): PricebookItemDTO {
  const it = map[key];
  if (!it) throw new Error(`Missing pricebook item "${key}"`);
  return it;
}

function parseRangeToken(token: string) {
  // token: "0_4", "4_8", "8_plus", "0_8" ...
  if (token.endsWith("_plus")) {
    const min = Number(token.replace("_plus", ""));
    return { min: Number.isFinite(min) ? min : 0, max: null as number | null };
  }
  const [a, b] = token.split("_");
  return { min: Number(a), max: Number(b) };
}

/**
 * Balkon je imao overlap na 4 i 8 pa si ranije koristio 4.0000001 / 8.0000001.
 * Ovdje to automatizujemo: svakoj granici koja NIJE 0 dodamo mali epsilon.
 */
function buildRangesBalkon(
  map: PricebookItemMap,
  prefix: string,
): RangePrice[] {
  const EPS = 0.0000001;

  return Object.keys(map)
    .filter((k) => k.startsWith(prefix))
    .map((k) => {
      const token = k.slice(prefix.length); // npr "0_4"
      const { min, max } = parseRangeToken(token);

      // ako je min > 0, guramo ga malo iznad granice da nema overlap-a sa prethodnim
      const minAdj = min > 0 ? min + EPS : min;

      return { min: minAdj, max, price: num(req(map, k).grundpreis) };
    })
    .sort((a, b) => (a.min ?? 0) - (b.min ?? 0));
}

function buildTier(map: PricebookItemMap, baseKey: string) {
  // baseKey: "bestand" -> keys "bestand.ranges.*"
  const any = req(map, `${baseKey}.ranges.0_4`);
  return {
    title: any.title.replace(/\s*\(\d.*\)$/, ""),
    description: any.description ?? undefined,
    ranges: buildRangesBalkon(map, `${baseKey}.ranges.`),
  };
}

export function buildBalkonPricebook(map: PricebookItemMap): BalkonPriceBook {
  const sBasic = req(map, "section.basic");

  return {
    meta: { title: sBasic.title, subtitle: sBasic.description ?? "" },

    bestand: buildTier(map, "bestand"),

    sanierung_ohne_daemmung: buildTier(map, "sanierung_ohne_daemmung"),
    sanierung_mit_daemmung: buildTier(map, "sanierung_mit_daemmung"),
    sanierung_mit_daemmung_attika: buildTier(
      map,
      "sanierung_mit_daemmung_attika",
    ),

    aufz_stelzlager: buildTier(map, "aufz_stelzlager"),
    aufz_feinsteinzeug: buildTier(map, "aufz_feinsteinzeug"),
    aufz_holz_laerche: buildTier(map, "aufz_holz_laerche"),

    // brandschutz koristi 0_8 / 8_plus (radi sa buildRangesBalkon ok)
    aufz_brandschutz: (() => {
      const any = req(map, "aufz_brandschutz.ranges.0_8");
      return {
        title: any.title.replace(/\s*\(\d.*\)$/, ""),
        description: any.description ?? undefined,
        ranges: buildRangesBalkon(map, "aufz_brandschutz.ranges."),
      };
    })(),

    aufz_rinne: buildTier(map, "aufz_rinne"),
    aufz_abdichtung_3_lage: buildTier(map, "aufz_abdichtung_3_lage"),
    aufz_gefaelledaemmung: buildTier(map, "aufz_gefaelledaemmung"),
    aufz_pur_daemmung: buildTier(map, "aufz_pur_daemmung"),
  };
}
