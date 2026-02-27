//trockenbau.pricebook.adapter.ts

import type { PricebookItemDTO, PricebookItemMap } from "@/lib/pricebook/types";
import { num } from "@/lib/pricebook/client";
import type { TBItem, Unit, TrockenbauPriceBook } from "./trockenbau.pricebook";

function req(map: PricebookItemMap, key: string): PricebookItemDTO {
  const it = map[key];
  if (!it) throw new Error(`Missing pricebook item: "${key}"`);
  return it;
}

function normalizeUnit(u: string | null | undefined): Unit {
  const x = (u ?? "").toLowerCase().trim();

  if (x === "m2" || x === "m²") return "m2";
  if (x === "m") return "m";
  if (x === "lfm") return "lfm";
  if (x === "stk" || x === "stk." || x === "stück" || x === "piece")
    return "stk";

  // fallback: ako je u bazi nešto čudno, ne ruši app
  return "m2";
}

export function buildTrockenbauPricebook(
  map: PricebookItemMap,
): TrockenbauPriceBook {
  // U Trockenbau je najlakše: items sort = redoslijed prikaza
  const keysSorted = Object.values(map)
    .filter((it) => it.is_active)
    .filter((it) => !it.position_key.startsWith("section."))
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((it) => it.position_key);

  const items: TBItem[] = keysSorted.map((k) => {
    const it = req(map, k);
    return {
      key: it.position_key,
      title: it.title,
      description: it.description ?? undefined,
      base: num(it.grundpreis),
      rate: num(it.unitprice),
      unit: normalizeUnit(it.unit),
    };
  });

  return { items };
}
