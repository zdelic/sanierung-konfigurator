// maler.calc.ts
import {
  clamp0,
  pickRangePrice,
  round2,
  type MalerPriceBook,
} from "./maler.pricebook";

export type VerputzMode = "off" | "instand10" | "instand50" | "neu";

export type SpachtelRoomKey =
  | "spachteln_bis10"
  | "spachteln_bis15"
  | "spachteln_bis20"
  | "spachteln_bis30"
  | "spachteln_bis40";

export type MalenRoomKey =
  | "malen_bis10"
  | "malen_bis15"
  | "malen_bis20"
  | "malen_bis30"
  | "malen_bis40";

export type MalerState = {
  note: string;

  // Bestand
  bestandVorarbeitenOn: boolean;

  bestandStarkeVerunOn: boolean;
  bestandStarkeVerunDepsAccepted: boolean;

  bestandOberflaechenUeberarbeitenOn: boolean;

  // Verputz (mode exklusiv)
  verputzMode: VerputzMode;

  verputzEinzelflaechenOn: boolean;
  verputzEinzelflaechenM2: number;

  // Spachtelung
  neuSpachtelungOn: boolean;

  spachtelRoomQty: Record<SpachtelRoomKey, number>;

  spachtelEinzelflaechenOn: boolean;
  spachtelEinzelflaechenM2: number;

  // Malerei
  neuMalereiOn: boolean;

  malenRoomQty: Record<MalenRoomKey, number>;

  malenEinzelflaechenOn: boolean;
  malenEinzelflaechenM2: number;

  // Zargen
  zargenBeschichtenOn: boolean;

  einzelneZargeBis2Qty: number;
  einzelneZargeBis4Qty: number;
};

export const DEFAULT_MALER_STATE: MalerState = {
  note: "",

  bestandVorarbeitenOn: false,
  bestandStarkeVerunOn: false,
  bestandStarkeVerunDepsAccepted: false,
  bestandOberflaechenUeberarbeitenOn: false,

  verputzMode: "off",
  verputzEinzelflaechenOn: false,
  verputzEinzelflaechenM2: 0,

  neuSpachtelungOn: false,
  spachtelRoomQty: {
    spachteln_bis10: 0,
    spachteln_bis15: 0,
    spachteln_bis20: 0,
    spachteln_bis30: 0,
    spachteln_bis40: 0,
  },
  spachtelEinzelflaechenOn: false,
  spachtelEinzelflaechenM2: 0,

  neuMalereiOn: false,
  malenRoomQty: {
    malen_bis10: 0,
    malen_bis15: 0,
    malen_bis20: 0,
    malen_bis30: 0,
    malen_bis40: 0,
  },
  malenEinzelflaechenOn: false,
  malenEinzelflaechenM2: 0,

  zargenBeschichtenOn: false,
  einzelneZargeBis2Qty: 0,
  einzelneZargeBis4Qty: 0,
};

function basePlusRate(base: number, rate: number, m2: number, minM2 = 0) {
  const q = clamp0(m2);
  if (q <= 0) return 0;
  const qty = Math.max(minM2, q);
  return round2(base + qty * rate);
}

function fixedPriceTimesQty(price: number, qty: number) {
  const q = Math.max(0, Math.floor(clamp0(qty)));
  if (q <= 0) return 0;
  return round2(price * q);
}

function sumRoomItems(
  items: { key: string; price: number }[],
  qty: Record<string, number>,
) {
  let sum = 0;
  for (const it of items) {
    sum += fixedPriceTimesQty(it.price, qty[it.key] ?? 0);
  }
  return round2(sum);
}

export function calcMalerParts(
  globalM2: number,
  s: MalerState,
  pb: MalerPriceBook,
) {
  const m2 = clamp0(globalM2);

  // Bestand
  const bestandVorarbeiten = s.bestandVorarbeitenOn
    ? pickRangePrice(m2, pb.bestand_vorarbeiten.ranges)
    : 0;

  const starkeVerunEligible =
    s.bestandStarkeVerunOn &&
    s.bestandStarkeVerunDepsAccepted &&
    s.bestandVorarbeitenOn;

  const bestandStarkeVerun = starkeVerunEligible
    ? pickRangePrice(m2, pb.bestand_starke_verunreinigungen.ranges)
    : 0;

  const bestandOberflaechen = s.bestandOberflaechenUeberarbeitenOn
    ? pickRangePrice(m2, pb.bestand_oberflaechen_ueberarbeiten.ranges)
    : 0;

  // Verputz (mode exklusiv)
  const verputz10 =
    s.verputzMode === "instand10"
      ? pickRangePrice(m2, pb.innenputz_instand_10.ranges)
      : 0;

  const verputz50 =
    s.verputzMode === "instand50"
      ? pickRangePrice(m2, pb.innenputz_instand_50.ranges)
      : 0;

  const verputzNeu =
    s.verputzMode === "neu" ? pickRangePrice(m2, pb.innenputz_neu.ranges) : 0;

  const verputzEinzelflaechen =
    s.verputzEinzelflaechenOn && clamp0(s.verputzEinzelflaechenM2) > 0
      ? basePlusRate(
          pb.verputz_einzelflaechen.base,
          pb.verputz_einzelflaechen.ratePerM2,
          s.verputzEinzelflaechenM2,
          pb.verputz_einzelflaechen.minM2 ?? 1,
        )
      : 0;

  // Spachtelung
  const neuSpachtelung = s.neuSpachtelungOn
    ? pickRangePrice(m2, pb.neu_spachtelung.ranges)
    : 0;

  const spachtelRoomsTotal = sumRoomItems(
    pb.einzelraeume_spachteln.items,
    s.spachtelRoomQty,
  );

  const spachtelEinzelflaechen =
    s.spachtelEinzelflaechenOn && clamp0(s.spachtelEinzelflaechenM2) > 0
      ? basePlusRate(
          pb.einzelflaechen_spachteln.base,
          pb.einzelflaechen_spachteln.ratePerM2,
          s.spachtelEinzelflaechenM2,
          pb.einzelflaechen_spachteln.minM2 ?? 1,
        )
      : 0;

  // Malerei
  const neuMalerei = s.neuMalereiOn
    ? pickRangePrice(m2, pb.neu_malerei.ranges)
    : 0;

  const malenRoomsTotal = sumRoomItems(
    pb.einzelraeume_malen.items,
    s.malenRoomQty,
  );

  const malenEinzelflaechen =
    s.malenEinzelflaechenOn && clamp0(s.malenEinzelflaechenM2) > 0
      ? basePlusRate(
          pb.einzelflaechen_malen.base,
          pb.einzelflaechen_malen.ratePerM2,
          s.malenEinzelflaechenM2,
          pb.einzelflaechen_malen.minM2 ?? 1,
        )
      : 0;

  // Zargen
  const zargenBeschichten = s.zargenBeschichtenOn
    ? pickRangePrice(m2, pb.zargen_beschichten.ranges)
    : 0;

  const einzelneZargeBis2 = fixedPriceTimesQty(
    pb.einzelne_zarge_bis2.pricePerStk,
    s.einzelneZargeBis2Qty,
  );
  const einzelneZargeBis4 = fixedPriceTimesQty(
    pb.einzelne_zarge_bis4.pricePerStk,
    s.einzelneZargeBis4Qty,
  );

  const total = round2(
    bestandVorarbeiten +
      bestandStarkeVerun +
      bestandOberflaechen +
      verputz10 +
      verputz50 +
      verputzNeu +
      verputzEinzelflaechen +
      neuSpachtelung +
      spachtelRoomsTotal +
      spachtelEinzelflaechen +
      neuMalerei +
      malenRoomsTotal +
      malenEinzelflaechen +
      zargenBeschichten +
      einzelneZargeBis2 +
      einzelneZargeBis4,
  );

  return {
    bestandVorarbeiten,
    starkeVerunEligible,
    bestandStarkeVerun,
    bestandOberflaechen,

    verputz10,
    verputz50,
    verputzNeu,
    verputzEinzelflaechen,

    neuSpachtelung,
    spachtelRoomsTotal,
    spachtelEinzelflaechen,

    neuMalerei,
    malenRoomsTotal,
    malenEinzelflaechen,

    zargenBeschichten,
    einzelneZargeBis2,
    einzelneZargeBis4,

    total,
  };
}

export function calcMalerTotal(
  globalM2: number,
  s: MalerState,
  pb: MalerPriceBook,
) {
  return calcMalerParts(globalM2, s, pb).total;
}
