//bmst.pricebook.adapter.ts

import type { PricebookItemDTO, PricebookItemMap } from "@/lib/pricebook/types";
import { num } from "@/lib/pricebook/client";
import type { BMSTPriceBook } from "./bmst.pricebook";

function req(map: PricebookItemMap, key: string): PricebookItemDTO {
  const it = map[key];
  if (!it) throw new Error(`Missing pricebook item: "${key}"`);
  return it;
}

function s(v: string | null | undefined) {
  return v ?? "";
}

export function buildBMSTPricebook(map: PricebookItemMap): BMSTPriceBook {
  const td = req(map, "tuerdurchbruch_tragend");
  const a20 = req(map, "auswechslung20");
  const a40 = req(map, "auswechslung40");

  // ✅ u DB je samo jedan fee za oba:
  const fee = req(map, "auswechslung_statik_fee");

  const mwkN = req(map, "mwk_nicht_tragend");
  const mwkT = req(map, "mwk_tragend");

  const aus = req(map, "ausmauerung_nf");
  const kam = req(map, "kamin_herstellen");

  const tuer = req(map, "aufz_tuerchen");

  const statikFee = num(fee.grundpreis) || num(fee.unitprice);

  // Warning tekst iz DB (title/description) → da ne hardcode-aš:
  const warning = `ACHTUNG! ${fee.title}${fee.description ? `\n${fee.description}` : ""}`;

  return {
    tuerdurchbruch_tragend: {
      title: td.title,
      description: s(td.description),
      ratePerPiece: num(td.unitprice) || num(td.grundpreis),
    },

    auswechslung20: {
      title: a20.title,
      description: s(a20.description),
      warning,
      statikFee,
      base: num(a20.grundpreis),
      ratePerLfm: num(a20.unitprice),
    },

    auswechslung40: {
      title: a40.title,
      description: s(a40.description),
      warning,
      statikFee,
      base: num(a40.grundpreis),
      ratePerLfm: num(a40.unitprice),
    },

    mwk_nicht_tragend: {
      title: mwkN.title,
      description: s(mwkN.description),
      base: num(mwkN.grundpreis),
      ratePerM2: num(mwkN.unitprice),
    },

    mwk_tragend: {
      title: mwkT.title,
      description: s(mwkT.description),
      base: num(mwkT.grundpreis),
      ratePerM2: num(mwkT.unitprice),
    },

    ausmauerung_nf: {
      title: aus.title,
      description: s(aus.description),
      base: num(aus.grundpreis),
      ratePerM3: num(aus.unitprice),
    },

    kamin_herstellen: {
      title: kam.title,
      description: s(kam.description),
      base: num(kam.grundpreis),
      ratePerM3: num(kam.unitprice),
    },

    aufz_tuerchen: {
      title: tuer.title,
      description: s(tuer.description),
      ratePerPiece: num(tuer.unitprice) || num(tuer.grundpreis),
    },
  };
}
