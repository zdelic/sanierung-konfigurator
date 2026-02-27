import type { PricebookItemDTO, PricebookItemMap } from "@/lib/pricebook/types";
import { num } from "@/lib/pricebook/client";
import type { RangePrice } from "./fenster.pricebook";

const toDesc = (v: unknown): string => (typeof v === "string" ? v : "");

export type FensterPriceBook = {
  servicieren: { title: string; description: string; ranges: RangePrice[] };

  sanierung_bestandsfenster: {
    title: string;
    description: string;
    base: number;
    ratePerM2: number;
    minM2: number;
  };
  sanierung_bestandskastenfenster: {
    title: string;
    description: string;
    base: number;
    ratePerM2: number;
    minM2: number;
  };
  aufz_prallscheibe: {
    title: string;
    description: string;
    base: number;
    ratePerM2: number;
    minM2: number;
  };

  // ✅ FLAT konfigurator fields (tačno kako fenster.calc.ts očekuje)
  // ✅ FLAT konfigurator fields (calc koristi brojeve, UI koristi *_title/_desc)
  grundpauschale_fenstertausch: number;
  grundpauschale_fenstertausch_title: string;
  grundpauschale_fenstertausch_desc?: string;

  abbruch_bestehender_fenster_per_m2: number;
  abbruch_bestehender_fenster_title: string;
  abbruch_bestehender_fenster_desc?: string;

  typ_holz_alu_per_m2: number;
  typ_holz_alu_title: string;
  typ_holz_alu_desc?: string;

  typ_pvc_alu_per_m2: number;
  typ_pvc_alu_title: string;
  typ_pvc_alu_desc?: string;

  typ_pvc_per_m2: number;
  typ_pvc_title: string;
  typ_pvc_desc?: string;

  blindstock_per_m2: number;
  blindstock_title: string;
  blindstock_desc?: string;

  mehrteiligkeit_per_m2: number;
  mehrteiligkeit_title: string;
  mehrteiligkeit_desc?: string;

  schallschutz_43db_per_m2: number;
  schallschutz_43db_title: string;
  schallschutz_43db_desc?: string;

  nicht_transparent_per_m2: number;
  nicht_transparent_title: string;
  nicht_transparent_desc?: string;

  oberlichte_per_m2: number;
  oberlichte_title: string;
  oberlichte_desc?: string;

  luefter_per_stk: number;
  luefter_title: string;
  luefter_desc?: string;

  abbruch_sonnenschutz_per_m2: number;
  abbruch_sonnenschutz_title: string;
  abbruch_sonnenschutz_desc?: string;

  montage_innenjalousien_per_m2: number;
  montage_innenjalousien_title: string;
  montage_innenjalousien_desc?: string;

  montage_aussenjalousien_per_m2: number;
  montage_aussenjalousien_title: string;
  montage_aussenjalousien_desc?: string;

  montage_blinos_rollo_per_m2: number;
  montage_blinos_rollo_title: string;
  montage_blinos_rollo_desc?: string;

  aufz_sonnenschutz_aufputz_per_m2: number;
  aufz_sonnenschutz_aufputz_title: string;
  aufz_sonnenschutz_aufputz_desc?: string;
};

function req(map: PricebookItemMap, key: string): PricebookItemDTO {
  const it = map[key];
  if (!it) throw new Error(`Missing pricebook item "${key}"`);
  return it;
}

function parseRangeToken(token: string) {
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

function baseRate(map: PricebookItemMap, key: string, minM2 = 1) {
  const it = req(map, key);
  return {
    title: it.title,
    description: toDesc(it.description),
    base: num(it.grundpreis),
    ratePerM2: num(it.unitprice),
    minM2,
  };
}

export function buildFensterPricebook(map: PricebookItemMap): FensterPriceBook {
  const itGrund = req(map, "konfigurator.grundpauschale");
  const itAbbruchFenster = req(map, "konfigurator.abbruch_bestehender_fenster");
  const itHolzAlu = req(map, "konfigurator.typ.holz_alu");
  const itPvcAlu = req(map, "konfigurator.typ.pvc_alu");
  const itPvc = req(map, "konfigurator.typ.pvc");
  const itBlind = req(map, "konfigurator.aufz.blindstock");
  const itMehr = req(map, "konfigurator.aufz.mehrteiligkeit");
  const itSchall = req(map, "konfigurator.aufz.schallschutz_43db");
  const itNT = req(map, "konfigurator.aufz.nicht_transparent");
  const itOber = req(map, "konfigurator.aufz.oberlichte");
  const itLuefter = req(map, "konfigurator.luefter");
  const itAbbruchSonn = req(map, "konfigurator.sonnenschutz.abbruch");
  const itInnen = req(map, "konfigurator.sonnenschutz.montage.innenjalousien");
  const itAussen = req(
    map,
    "konfigurator.sonnenschutz.montage.aussenjalousien",
  );
  const itBlinos = req(map, "konfigurator.sonnenschutz.montage.blinos");
  const itAufputz = req(map, "konfigurator.sonnenschutz.aufputz");
  const anyServ = req(map, "servicieren.ranges.0_40");
  return {
    servicieren: {
      title: anyServ.title.replace(/\s*\(\d.*\)$/, ""),
      description: toDesc(anyServ.description),
      ranges: buildRanges(map, "servicieren.ranges."),
    },

    sanierung_bestandsfenster: baseRate(map, "sanierung_bestandsfenster", 1),
    sanierung_bestandskastenfenster: baseRate(
      map,
      "sanierung_bestandskastenfenster",
      1,
    ),
    aufz_prallscheibe: baseRate(map, "aufz_prallscheibe", 1),

    // ---- konfigurator
    grundpauschale_fenstertausch: num(itGrund.grundpreis),
    grundpauschale_fenstertausch_title: itGrund.title,
    grundpauschale_fenstertausch_desc: itGrund.description ?? undefined,

    abbruch_bestehender_fenster_per_m2: num(itAbbruchFenster.unitprice),
    abbruch_bestehender_fenster_title: itAbbruchFenster.title,
    abbruch_bestehender_fenster_desc: itAbbruchFenster.description ?? undefined,

    typ_holz_alu_per_m2: num(itHolzAlu.unitprice),
    typ_holz_alu_title: itHolzAlu.title,
    typ_holz_alu_desc: itHolzAlu.description ?? undefined,

    typ_pvc_alu_per_m2: num(itPvcAlu.unitprice),
    typ_pvc_alu_title: itPvcAlu.title,
    typ_pvc_alu_desc: itPvcAlu.description ?? undefined,

    typ_pvc_per_m2: num(itPvc.unitprice),
    typ_pvc_title: itPvc.title,
    typ_pvc_desc: itPvc.description ?? undefined,

    blindstock_per_m2: num(itBlind.unitprice),
    blindstock_title: itBlind.title,
    blindstock_desc: itBlind.description ?? undefined,

    mehrteiligkeit_per_m2: num(itMehr.unitprice),
    mehrteiligkeit_title: itMehr.title,
    mehrteiligkeit_desc: itMehr.description ?? undefined,

    schallschutz_43db_per_m2: num(itSchall.unitprice),
    schallschutz_43db_title: itSchall.title,
    schallschutz_43db_desc: itSchall.description ?? undefined,

    nicht_transparent_per_m2: num(itNT.unitprice),
    nicht_transparent_title: itNT.title,
    nicht_transparent_desc: itNT.description ?? undefined,

    oberlichte_per_m2: num(itOber.unitprice),
    oberlichte_title: itOber.title,
    oberlichte_desc: itOber.description ?? undefined,

    luefter_per_stk: num(itLuefter.unitprice),
    luefter_title: itLuefter.title,
    luefter_desc: itLuefter.description ?? undefined,

    abbruch_sonnenschutz_per_m2: num(itAbbruchSonn.unitprice),
    abbruch_sonnenschutz_title: itAbbruchSonn.title,
    abbruch_sonnenschutz_desc: itAbbruchSonn.description ?? undefined,

    montage_innenjalousien_per_m2: num(itInnen.unitprice),
    montage_innenjalousien_title: itInnen.title,
    montage_innenjalousien_desc: itInnen.description ?? undefined,

    montage_aussenjalousien_per_m2: num(itAussen.unitprice),
    montage_aussenjalousien_title: itAussen.title,
    montage_aussenjalousien_desc: itAussen.description ?? undefined,

    montage_blinos_rollo_per_m2: num(itBlinos.unitprice),
    montage_blinos_rollo_title: itBlinos.title,
    montage_blinos_rollo_desc: itBlinos.description ?? undefined,

    aufz_sonnenschutz_aufputz_per_m2: num(itAufputz.unitprice),
    aufz_sonnenschutz_aufputz_title: itAufputz.title,
    aufz_sonnenschutz_aufputz_desc: itAufputz.description ?? undefined,
  };
}
