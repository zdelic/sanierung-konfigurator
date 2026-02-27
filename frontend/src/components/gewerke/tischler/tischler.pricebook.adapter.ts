import type { PricebookItemDTO, PricebookItemMap } from "@/lib/pricebook/types";
import { num } from "@/lib/pricebook/client";
import type {
  LinePrice,
  RangePrice,
  TischlerPriceBook,
} from "./tischler.pricebook";

function req(map: PricebookItemMap, key: string): PricebookItemDTO {
  const it = map[key];
  if (!it) throw new Error(`Missing pricebook item: "${key}"`);
  return it;
}

function parseRangeToken(token: string): {
  min: number | null;
  max: number | null;
} {
  if (token === "0_plus") return { min: 0, max: null };
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

function buildBasePlusRate(
  map: PricebookItemMap,
  key: string,
  title: string,
  description?: string,
): LinePrice {
  const it = req(map, key);
  return {
    kind: "base_plus_rate",
    key,
    title,
    description,
    unit: "stk",
    base: num(it.grundpreis),
    rate: num(it.unitprice),
  };
}

function buildRateOnly(
  map: PricebookItemMap,
  key: string,
  title: string,
  description?: string,
): LinePrice {
  const it = req(map, key);
  return {
    kind: "rate_only",
    key,
    title,
    description,
    unit: "stk",
    rate: num(it.unitprice),
  };
}

function buildTier(
  map: PricebookItemMap,
  prefix: string,
  key: string,
  requires?: "abbruch_eingang" | "abbruch_innentueren_voll",
): LinePrice {
  // title/description uzmi iz bilo kojeg reda (isti su)
  const anyKey = Object.keys(map).find((k) => k.startsWith(prefix));
  if (!anyKey) throw new Error(`Missing tier group prefix: ${prefix}`);
  const any = req(map, anyKey);

  return {
    kind: "tier",
    key,
    title: any.title,
    description: any.description ?? undefined,
    ranges: buildRanges(map, prefix),
    requires,
  };
}

export function buildTischlerPricebook(
  map: PricebookItemMap,
): TischlerPriceBook {
  // Bestand
  const bestandAny = req(map, "bestand.ranges.0_40");

  return {
    bestand: {
      title: bestandAny.title,
      description: bestandAny.description ?? "",
      ranges: buildRanges(map, "bestand.ranges."),
    },

    neu_eingang: buildTier(
      map,
      "neu_eingang.ranges.",
      "neu_eingang",
      "abbruch_eingang",
    ),
    neu_innentueren: buildTier(
      map,
      "neu_innentueren.ranges.",
      "neu_innentueren",
    ),
    neu_zargen: buildTier(
      map,
      "neu_zargen.ranges.",
      "neu_zargen",
      "abbruch_innentueren_voll",
    ),

    sanierung_2m2_simple: buildBasePlusRate(
      map,
      "sanierung_2m2_simple",
      req(map, "sanierung_2m2_simple").title,
    ),
    aufzahlung_2m2_aufwendig: buildBasePlusRate(
      map,
      "aufzahlung_2m2_aufwendig",
      req(map, "aufzahlung_2m2_aufwendig").title,
    ),
    sanierung_4m2_simple: buildBasePlusRate(
      map,
      "sanierung_4m2_simple",
      req(map, "sanierung_4m2_simple").title,
    ),
    aufzahlung_4m2_aufwendig: buildBasePlusRate(
      map,
      "aufzahlung_4m2_aufwendig",
      req(map, "aufzahlung_4m2_aufwendig").title,
    ),

    neu_innentueren_glasausschnitt: buildBasePlusRate(
      map,
      "neu_innentueren_glasausschnitt",
      req(map, "neu_innentueren_glasausschnitt").title,
    ),
    innentuere_80x200: buildBasePlusRate(
      map,
      "innentuere_80x200",
      req(map, "innentuere_80x200").title,
    ),
    zarge_80x200: buildBasePlusRate(
      map,
      "zarge_80x200",
      req(map, "zarge_80x200").title,
    ),

    whg_eingang_h250: buildRateOnly(
      map,
      "whg_eingang_h250",
      req(map, "whg_eingang_h250").title,
      req(map, "whg_eingang_h250").description ?? undefined,
    ),
    whg_eingang_2fluegelig_h250: buildRateOnly(
      map,
      "whg_eingang_2fluegelig_h250",
      req(map, "whg_eingang_2fluegelig_h250").title,
      req(map, "whg_eingang_2fluegelig_h250").description ?? undefined,
    ),
    balkon_bis3: buildRateOnly(
      map,
      "balkon_bis3",
      req(map, "balkon_bis3").title,
      req(map, "balkon_bis3").description ?? undefined,
    ),
    balkon_ueber3: buildRateOnly(
      map,
      "balkon_ueber3",
      req(map, "balkon_ueber3").title,
      req(map, "balkon_ueber3").description ?? undefined,
    ),
    kasten_bis3: buildRateOnly(
      map,
      "kasten_bis3",
      req(map, "kasten_bis3").title,
      req(map, "kasten_bis3").description ?? undefined,
    ),
    kasten_3_5: buildRateOnly(
      map,
      "kasten_3_5",
      req(map, "kasten_3_5").title,
      req(map, "kasten_3_5").description ?? undefined,
    ),
    anstrich_eingang: buildRateOnly(
      map,
      "anstrich_eingang",
      req(map, "anstrich_eingang").title,
      req(map, "anstrich_eingang").description ?? undefined,
    ),
    anstrich_balkon: buildRateOnly(
      map,
      "anstrich_balkon",
      req(map, "anstrich_balkon").title,
      req(map, "anstrich_balkon").description ?? undefined,
    ),
    anstrich_kasten: buildRateOnly(
      map,
      "anstrich_kasten",
      req(map, "anstrich_kasten").title,
      req(map, "anstrich_kasten").description ?? undefined,
    ),
  };
}
