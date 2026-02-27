import type { PricebookItemDTO, PricebookItemMap } from "@/lib/pricebook/types";
import { num } from "@/lib/pricebook/client";
import type { MalerPriceBook, RangePrice } from "./maler.pricebook";

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

function buildTier(map: PricebookItemMap, group: string) {
  const any = req(map, `${group}.ranges.0_40`);
  return {
    title: any.title,
    description: any.description ?? undefined,
    ranges: buildRanges(map, `${group}.ranges.`),
  };
}

function buildBaseRateM2(map: PricebookItemMap, key: string, minM2 = 1) {
  const it = req(map, key);
  return {
    title: it.title,
    description: it.description ?? undefined,
    base: num(it.grundpreis),
    ratePerM2: num(it.unitprice),
    minM2,
  };
}

function buildRoomGroup(
  map: PricebookItemMap,
  group: "einzelraeume_spachteln" | "einzelraeume_malen",
) {
  const meta = req(map, `${group}.meta`);
  const prefix = `${group}.items.`;

  const items = Object.keys(map)
    .filter((k) => k.startsWith(prefix))
    .map((k) => {
      const it = req(map, k);
      return {
        key: k.slice(prefix.length),
        title: it.title,
        price: num(it.grundpreis),
      };
    })
    .sort((a, b) => a.key.localeCompare(b.key));

  return { title: meta.title, items };
}

export function buildMalerPricebook(map: PricebookItemMap): MalerPriceBook {
  const sBestand = req(map, "section.bestand");
  const sVerputz = req(map, "section.verputz");
  const sSpachtelung = req(map, "section.spachtelung");
  const sMalerei = req(map, "section.malerei");
  const sZargen = req(map, "section.zargen");

  const zargenAny = req(map, "zargen_beschichten.ranges.0_40");

  return {
    bestand: { title: sBestand.title },
    verputz: { title: sVerputz.title },
    spachtelung: { title: sSpachtelung.title },
    malerei: { title: sMalerei.title },
    zargen: { title: sZargen.title },

    bestand_vorarbeiten: buildTier(map, "bestand_vorarbeiten"),
    bestand_starke_verunreinigungen: buildTier(
      map,
      "bestand_starke_verunreinigungen",
    ),
    bestand_oberflaechen_ueberarbeiten: buildTier(
      map,
      "bestand_oberflaechen_ueberarbeiten",
    ),

    innenputz_instand_10: buildTier(map, "innenputz_instand_10"),
    innenputz_instand_50: buildTier(map, "innenputz_instand_50"),
    innenputz_neu: buildTier(map, "innenputz_neu"),

    verputz_einzelflaechen: buildBaseRateM2(map, "verputz_einzelflaechen", 1),

    neu_spachtelung: buildTier(map, "neu_spachtelung"),
    neu_malerei: buildTier(map, "neu_malerei"),

    einzelflaechen_spachteln: buildBaseRateM2(
      map,
      "einzelflaechen_spachteln",
      1,
    ),
    einzelflaechen_malen: buildBaseRateM2(map, "einzelflaechen_malen", 1),

    einzelraeume_spachteln: buildRoomGroup(map, "einzelraeume_spachteln"),
    einzelraeume_malen: buildRoomGroup(map, "einzelraeume_malen"),

    zargen_beschichten: {
      title: zargenAny.title,
      description: zargenAny.description ?? undefined,
      ranges: buildRanges(map, "zargen_beschichten.ranges."),
    },

    einzelne_zarge_bis2: {
      title: req(map, "einzelne_zarge_bis2").title,
      pricePerStk: num(req(map, "einzelne_zarge_bis2").unitprice),
    },
    einzelne_zarge_bis4: {
      title: req(map, "einzelne_zarge_bis4").title,
      pricePerStk: num(req(map, "einzelne_zarge_bis4").unitprice),
    },
  };
}
