import type { PricebookItemDTO, PricebookItemMap } from "@/lib/pricebook/types";
import { num } from "@/lib/pricebook/client";
import type { FliesenPriceBook, RangePrice } from "./fliesen.pricebook";

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

function stripRangeSuffix(title: string) {
  // skida sve što je u zadnjim zagradama: "Bestand (0–50 m²)" -> "Bestand"
  return title.replace(/\s*\([^)]*\)\s*$/, "").trim();
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

export function buildFliesenPricebook(map: PricebookItemMap): FliesenPriceBook {
  const bestandAny = req(map, "bestand.ranges.0_50");
  const badAny = req(map, "neuBadWc.ranges.0_40");
  const vkAny = req(map, "neuVrkue.ranges.0_40");
  const einzel = req(map, "einzelflaechen");

  return {
    bestand: {
      title: stripRangeSuffix(bestandAny.title),
      description: bestandAny.description ?? "",
      ranges: buildRanges(map, "bestand.ranges."),
    },
    neuBadWc: {
      title: stripRangeSuffix(badAny.title),
      description: badAny.description ?? "",
      requiresAbbruchBelag: true,
      ranges: buildRanges(map, "neuBadWc.ranges."),
    },
    neuVrkue: {
      title: stripRangeSuffix(vkAny.title),
      description: vkAny.description ?? "",
      requiresAbbruchBelag: true,
      ranges: buildRanges(map, "neuVrkue.ranges."),
    },
    einzelflaechen: {
      title: einzel.title,
      description: einzel.description ?? "",
      base: num(einzel.grundpreis),
      ratePerM2: num(einzel.unitprice),
    },
  };
}
