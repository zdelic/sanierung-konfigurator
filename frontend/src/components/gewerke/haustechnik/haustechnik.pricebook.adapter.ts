import type { PricebookItemDTO, PricebookItemMap } from "@/lib/pricebook/types";
import { num } from "@/lib/pricebook/client";

export type RangePrice = {
  min: number | null;
  max: number | null;
  price: number;
};

export type HaustechnikPriceBook = {
  meta: { title: string; subtitle: string };

  befund: { title: string; description?: string; ranges: RangePrice[] };

  heizkoerper_tausch: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };
  heizleitungen_tausch: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };
  aufz_sockelkanal: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };
  aufz_fbh: { title: string; description?: string; ranges: RangePrice[] };

  kuehl_heizdecke: { title: string; description?: string; perM2: number };

  lueftung_filter: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };
  lueftung_ventilator: { title: string; description?: string; price: number };
  lueftungszuleitung: {
    title: string;
    base: number;
    unitPrice: number;
    unit: "lfm";
  };

  sanitaer_bad_gesamt: { title: string; description?: string; price: number };
  sanitaer_fallstrang: { title: string; description?: string; price: number };
  sanitaer_zus_dusche: { title: string; description?: string; price: number };
  aufz_vollglas: { title: string; description?: string; price: number };
  sanitaer_zus_wt: { title: string; description?: string; price: number };
  sanitaer_wt_tausch: { title: string; description?: string; price: number };
  sanitaer_wc_tausch: { title: string; description?: string; price: number };
  sanitaer_wanne_dusche_tausch: {
    title: string;
    description?: string;
    price: number;
  };
  sanitaer_gebrauch: { title: string; description?: string; price: number };
  sanitaer_kueche_aufputz: {
    title: string;
    description?: string;
    price: number;
  };

  aufz_sprossen_e: { title: string; description?: string; price: number };
  aufz_haenge_wc: { title: string; description?: string; price: number };
  aufz_duschtasse: { title: string; description?: string; price: number };
  behindertengerecht: { title: string; description?: string; price: number };

  klappsitz: { title: string; price: number };
  armatur: { title: string; price: number };
  wc_sensor: { title: string; price: number };
  gebrauch_2: { title: string; price: number };
  untertisch_10l: { title: string; price: number };
  e_speicher: { title: string; price: number };

  gas_pruefung: { title: string; description?: string; price: number };
  gas_service: { title: string; description?: string; price: number };
  gas_therme_neu: { title: string; description?: string; price: number };
  gas_innenleitungen: {
    title: string;
    description?: string;
    ranges: RangePrice[];
  };

  gaszuleitung: { title: string; base: number; unitPrice: number; unit: "lfm" };
  zaehlerplatte: { title: string; base: number; unitPrice: number; unit: "st" };
};

function req(map: PricebookItemMap, key: string): PricebookItemDTO {
  const it = map[key];
  if (!it) throw new Error(`Missing pricebook item "${key}"`);
  return it;
}

// ✅ Range token parser: "0_40", "40_50", "90_100", "100_plus", "50_plus", "90_plus", "50_70"...
// We mimic your old "40.0000001" gaps by adding EPS to non-first buckets.
const EPS = 0.0000001;

function parseRangeToken(token: string): {
  min: number | null;
  max: number | null;
} {
  if (token.endsWith("_plus")) {
    const rawMin = Number(token.replace("_plus", ""));
    const min = Number.isFinite(rawMin) ? rawMin + (rawMin === 0 ? 0 : EPS) : 0;
    return { min, max: null };
  }

  const [aStr, bStr] = token.split("_");
  const a = Number(aStr);
  const b = Number(bStr);

  const min = Number.isFinite(a) ? a + (a === 0 ? 0 : EPS) : 0;
  const max = Number.isFinite(b) ? b : null;

  return { min, max };
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

function fixed(map: PricebookItemMap, key: string) {
  const it = req(map, key);
  return {
    title: it.title,
    description: it.description ?? undefined,
    price: num(it.grundpreis),
  };
}

function baseUnit(map: PricebookItemMap, key: string) {
  const it = req(map, key);
  return {
    title: it.title,
    base: num(it.grundpreis),
    unitPrice: num(it.unitprice),
    unit: (it.unit ?? "lfm") as "lfm" | "st",
  };
}

export function buildHaustechnikPricebook(
  map: PricebookItemMap,
): HaustechnikPriceBook {
  const sec = req(map, "section.basic");

  return {
    meta: { title: sec.title, subtitle: sec.description ?? "" },

    befund: {
      title: req(map, "befund.ranges.0_40").title.replace(/\s*\(.+\)$/, ""),
      description: req(map, "befund.ranges.0_40").description ?? undefined,
      ranges: buildRanges(map, "befund.ranges."),
    },

    heizkoerper_tausch: {
      title: req(map, "heizkoerper_tausch.ranges.0_40").title.replace(
        /\s*\(.+\)$/,
        "",
      ),
      description:
        req(map, "heizkoerper_tausch.ranges.0_40").description ?? undefined,
      ranges: buildRanges(map, "heizkoerper_tausch.ranges."),
    },
    heizleitungen_tausch: {
      title: req(map, "heizleitungen_tausch.ranges.0_40").title.replace(
        /\s*\(.+\)$/,
        "",
      ),
      description:
        req(map, "heizleitungen_tausch.ranges.0_40").description ?? undefined,
      ranges: buildRanges(map, "heizleitungen_tausch.ranges."),
    },
    aufz_sockelkanal: {
      title: req(map, "aufz_sockelkanal.ranges.0_40").title.replace(
        /\s*\(.+\)$/,
        "",
      ),
      description:
        req(map, "aufz_sockelkanal.ranges.0_40").description ?? undefined,
      ranges: buildRanges(map, "aufz_sockelkanal.ranges."),
    },
    aufz_fbh: {
      title: req(map, "aufz_fbh.ranges.0_40").title.replace(/\s*\(.+\)$/, ""),
      description: req(map, "aufz_fbh.ranges.0_40").description ?? undefined,
      ranges: buildRanges(map, "aufz_fbh.ranges."),
    },

    kuehl_heizdecke: {
      title: req(map, "kuehl_heizdecke.per_m2").title,
      description: req(map, "kuehl_heizdecke.per_m2").description ?? undefined,
      perM2: num(req(map, "kuehl_heizdecke.per_m2").unitprice),
    },

    lueftung_filter: {
      title: req(map, "lueftung_filter.ranges.0_50").title.replace(
        /\s*\(.+\)$/,
        "",
      ),
      description:
        req(map, "lueftung_filter.ranges.0_50").description ?? undefined,
      ranges: buildRanges(map, "lueftung_filter.ranges."),
    },
    lueftung_ventilator: fixed(map, "lueftung_ventilator"),
    lueftungszuleitung: {
      ...baseUnit(map, "lueftungszuleitung"),
      unit: "lfm",
    },

    sanitaer_bad_gesamt: fixed(map, "sanitaer_bad_gesamt"),
    sanitaer_fallstrang: fixed(map, "sanitaer_fallstrang"),
    sanitaer_zus_dusche: fixed(map, "sanitaer_zus_dusche"),
    aufz_vollglas: fixed(map, "aufz_vollglas"),
    sanitaer_zus_wt: fixed(map, "sanitaer_zus_wt"),
    sanitaer_wt_tausch: fixed(map, "sanitaer_wt_tausch"),
    sanitaer_wc_tausch: fixed(map, "sanitaer_wc_tausch"),
    sanitaer_wanne_dusche_tausch: fixed(map, "sanitaer_wanne_dusche_tausch"),
    sanitaer_gebrauch: fixed(map, "sanitaer_gebrauch"),
    sanitaer_kueche_aufputz: fixed(map, "sanitaer_kueche_aufputz"),

    aufz_sprossen_e: fixed(map, "aufz_sprossen_e"),
    aufz_haenge_wc: fixed(map, "aufz_haenge_wc"),
    aufz_duschtasse: fixed(map, "aufz_duschtasse"),
    behindertengerecht: fixed(map, "behindertengerecht"),

    klappsitz: {
      title: req(map, "klappsitz").title,
      price: num(req(map, "klappsitz").grundpreis),
    },
    armatur: {
      title: req(map, "armatur").title,
      price: num(req(map, "armatur").grundpreis),
    },
    wc_sensor: {
      title: req(map, "wc_sensor").title,
      price: num(req(map, "wc_sensor").grundpreis),
    },
    gebrauch_2: {
      title: req(map, "gebrauch_2").title,
      price: num(req(map, "gebrauch_2").grundpreis),
    },
    untertisch_10l: {
      title: req(map, "untertisch_10l").title,
      price: num(req(map, "untertisch_10l").grundpreis),
    },
    e_speicher: {
      title: req(map, "e_speicher").title,
      price: num(req(map, "e_speicher").grundpreis),
    },

    gas_pruefung: fixed(map, "gas_pruefung"),
    gas_service: fixed(map, "gas_service"),
    gas_therme_neu: fixed(map, "gas_therme_neu"),

    gas_innenleitungen: {
      title: req(map, "gas_innenleitungen.ranges.0_50").title.replace(
        /\s*\(.+\)$/,
        "",
      ),
      description:
        req(map, "gas_innenleitungen.ranges.0_50").description ?? undefined,
      ranges: buildRanges(map, "gas_innenleitungen.ranges."),
    },

    gaszuleitung: {
      ...baseUnit(map, "gaszuleitung"),
      unit: "lfm",
    },

    zaehlerplatte: {
      ...baseUnit(map, "zaehlerplatte"),
      unit: "st",
    },
  };
}
