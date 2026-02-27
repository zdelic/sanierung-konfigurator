import type { PricebookItemDTO, PricebookItemMap } from "@/lib/pricebook/types";
import { num } from "@/lib/pricebook/client";
import type { RangePrice } from "./reinigung.pricebook";

export type ReinigungPriceBook = {
  meta: { title: string; subtitle: string };

  raeumen_normal: { title: string; description?: string; ranges: RangePrice[] };
  raeumen_stark: { title: string; description?: string; ranges: RangePrice[] };
  endreinigung: { title: string; description?: string; ranges: RangePrice[] };
};

function req(map: PricebookItemMap, key: string): PricebookItemDTO {
  const it = map[key];
  if (!it) throw new Error(`Missing pricebook item "${key}"`);
  return it;
}

function parseRangeToken(token: string) {
  // "0_40" | "41_50" | "101_plus"
  if (token.endsWith("_plus")) {
    const min = Number(token.replace("_plus", ""));
    return { min: Number.isFinite(min) ? min : 0, max: null as number | null };
  }
  const [a, b] = token.split("_");
  return { min: Number(a), max: Number(b) };
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

export function buildReinigungPricebook(
  map: PricebookItemMap,
): ReinigungPriceBook {
  const meta = req(map, "meta");

  const anyNormal = req(map, "raeumen_normal.ranges.0_40");
  const anyStark = req(map, "raeumen_stark.ranges.0_40");
  const anyEnd = req(map, "endreinigung.ranges.0_40");

  return {
    meta: {
      title: meta.title,
      subtitle: meta.description ?? "",
    },

    raeumen_normal: {
      title: anyNormal.title.replace(/\s*\(\d.*\)$/, ""),
      description: anyNormal.description ?? undefined,
      ranges: buildRanges(map, "raeumen_normal.ranges."),
    },
    raeumen_stark: {
      title: anyStark.title.replace(/\s*\(\d.*\)$/, ""),
      description: anyStark.description ?? undefined,
      ranges: buildRanges(map, "raeumen_stark.ranges."),
    },
    endreinigung: {
      title: anyEnd.title.replace(/\s*\(\d.*\)$/, ""),
      description: anyEnd.description ?? undefined,
      ranges: buildRanges(map, "endreinigung.ranges."),
    },
  };
}
