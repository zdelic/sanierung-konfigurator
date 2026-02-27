import type { PricebookItemDTO, PricebookItemMap } from "@/lib/pricebook/types";
import { num } from "@/lib/pricebook/client";
import type {
  RangePrice,
  TeilLine,
  EstrichPriceBook,
} from "./estrich.pricebook";

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

export function buildEstrichPricebook(map: PricebookItemMap): EstrichPriceBook {
  // use any one range row for title/description (same for all)
  const neuAny = req(map, "neu6cm.ranges.0_40");
  const bAny = req(map, "beschleuniger.ranges.0_40");

  const teilKeys = Object.keys(map).filter((k) =>
    k.startsWith("teilleistungen."),
  );

  const teilleistungen: TeilLine[] = teilKeys
    .map((k) => {
      const it = req(map, k);
      return {
        key: it.position_key.replace("teilleistungen.", ""),
        title: it.title,
        description: it.description ?? undefined,
        base: num(it.grundpreis),
        ratePerM2: num(it.unitprice),
      };
    })
    .sort((a, b) => a.key.localeCompare(b.key));

  return {
    neu6cm: {
      title: neuAny.title,
      description: neuAny.description ?? "",
      ranges: buildRanges(map, "neu6cm.ranges."),
    },
    teilleistungen,
    beschleuniger: {
      title: bAny.title,
      description: bAny.description ?? "",
      ranges: buildRanges(map, "beschleuniger.ranges."),
    },
  };
}
