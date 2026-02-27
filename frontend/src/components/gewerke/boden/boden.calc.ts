// boden.calc.ts
import {
  clamp0,
  pickRangePrice,
  round2,
  type BodenPriceBook,
} from "./boden.pricebook";

export type BodenState = {
  note: string;

  // Bestand (tiered)
  bestandTeppichOn: boolean;
  bestandLaminatOn: boolean;
  bestandParkettOn: boolean;

  // Teilfläche Parkett (Bestand)
  teilParkettOn: boolean;
  teilParkettM2: number;

  // Neuherstellung (dependency Abbruch Belag)
  neuTeppichOn: boolean;
  neuTeppichDepsAccepted: boolean;

  neuLaminatOn: boolean;
  neuLaminatDepsAccepted: boolean;

  neuParkettOn: boolean;
  neuParkettDepsAccepted: boolean;

  // Einzelflächen
  einzelTeppichOn: boolean;
  einzelTeppichM2: number;

  einzelLaminatOn: boolean;
  einzelLaminatM2: number;
  antidroeEinzelLaminatOn: boolean; // +20,76/m² na te m²

  einzelParkettOn: boolean;
  einzelParkettM2: number;

  // Aufzahlungen Parkett
  fischgraetOn: boolean;
  fischgraetM2: number;

  verlegenVersiegelnOn: boolean;
  verlegenVersiegelnM2: number;

  // Mauerfries
  mauerfriesOn: boolean;
  mauerfriesLfm: number;

  // Aufzahlung Antidröhnmatte (Neu Laminat) = 30% * Neu-Laminat-Preis
  antidroeNeuLaminatOn: boolean;

  neuTeppichAutoCount: number;
  neuTeppichSource: "manual" | "auto" | null;

  neuLaminatAutoCount: number;
  neuLaminatSource: "manual" | "auto" | null;

  neuParkettAutoCount: number;
  neuParkettSource: "manual" | "auto" | null;
};

export const DEFAULT_BODEN_STATE: BodenState = {
  note: "",

  bestandTeppichOn: false,
  bestandLaminatOn: false,
  bestandParkettOn: false,

  teilParkettOn: false,
  teilParkettM2: 0,

  neuTeppichOn: false,
  neuTeppichDepsAccepted: false,

  neuLaminatOn: false,
  neuLaminatDepsAccepted: false,

  neuParkettOn: false,
  neuParkettDepsAccepted: false,

  einzelTeppichOn: false,
  einzelTeppichM2: 0,

  einzelLaminatOn: false,
  einzelLaminatM2: 0,
  antidroeEinzelLaminatOn: false,

  einzelParkettOn: false,
  einzelParkettM2: 0,

  fischgraetOn: false,
  fischgraetM2: 0,

  verlegenVersiegelnOn: false,
  verlegenVersiegelnM2: 0,

  mauerfriesOn: false,
  mauerfriesLfm: 0,

  antidroeNeuLaminatOn: false,
  neuTeppichAutoCount: 0,
  neuTeppichSource: null,

  neuLaminatAutoCount: 0,
  neuLaminatSource: null,

  neuParkettAutoCount: 0,
  neuParkettSource: null,
};

function basePlusRate(base: number, rate: number, m2: number) {
  const q = clamp0(m2);
  if (q <= 0) return 0;
  return round2(base + q * rate);
}
function rateOnly(rate: number, qty: number) {
  const q = clamp0(qty);
  if (q <= 0) return 0;
  return round2(q * rate);
}

export function calcBodenParts(
  globalM2: number,
  s: BodenState,
  pb: BodenPriceBook,
) {
  const m2 = clamp0(globalM2);

  // Bestand tiered (mutually exclusive? -> ovdje dozvoljavamo više ako želiš; možeš kasnije ograničiti)
  const bestandTeppich = s.bestandTeppichOn
    ? pickRangePrice(m2, pb.bestand_teppich.ranges)
    : 0;
  const bestandLaminat = s.bestandLaminatOn
    ? pickRangePrice(m2, pb.bestand_laminat.ranges)
    : 0;
  const bestandParkett = s.bestandParkettOn
    ? pickRangePrice(m2, pb.bestand_parkett.ranges)
    : 0;

  // Teilfläche Parkett (min 10m²) — enforcement: ako <10 ali >0 -> ipak računamo, ali možeš u UI upozorenje
  const teilParkett =
    s.teilParkettOn && clamp0(s.teilParkettM2) > 0
      ? basePlusRate(
          pb.teil_sanierung_parkett.base,
          pb.teil_sanierung_parkett.ratePerM2,
          s.teilParkettM2,
        )
      : 0;

  // Neuherstellung (gated by depsAccepted)
  const neuTeppichEligible = s.neuTeppichOn && s.neuTeppichDepsAccepted;
  const neuTeppich = neuTeppichEligible
    ? pickRangePrice(m2, pb.neu_teppich.ranges)
    : 0;

  const neuLaminatEligible = s.neuLaminatOn && s.neuLaminatDepsAccepted;
  const neuLaminat = neuLaminatEligible
    ? pickRangePrice(m2, pb.neu_laminat.ranges)
    : 0;

  const neuParkettEligible = s.neuParkettOn && s.neuParkettDepsAccepted;
  const neuParkett = neuParkettEligible
    ? pickRangePrice(m2, pb.neu_parkett.ranges)
    : 0;

  // Einzelflächen
  const einzelTeppich =
    s.einzelTeppichOn && clamp0(s.einzelTeppichM2) > 0
      ? basePlusRate(
          pb.einzel_teppich.base,
          pb.einzel_teppich.ratePerM2,
          s.einzelTeppichM2,
        )
      : 0;

  const einzelLaminatQ = clamp0(s.einzelLaminatM2);
  const einzelLaminat =
    s.einzelLaminatOn && einzelLaminatQ > 0
      ? basePlusRate(
          pb.einzel_laminat.base,
          pb.einzel_laminat.ratePerM2,
          s.einzelLaminatM2,
        )
      : 0;

  const antidroeEinzelLaminat =
    s.einzelLaminatOn && s.antidroeEinzelLaminatOn && einzelLaminatQ > 0
      ? round2(einzelLaminatQ * pb.aufz_antidroe_einzel_laminat.ratePerM2)
      : 0;

  const einzelParkett =
    s.einzelParkettOn && clamp0(s.einzelParkettM2) > 0
      ? basePlusRate(
          pb.einzel_parkett.base,
          pb.einzel_parkett.ratePerM2,
          s.einzelParkettM2,
        )
      : 0;

  // Aufzahlungen Parkett (po m² input)
  const fischgraet =
    s.fischgraetOn && clamp0(s.fischgraetM2) > 0
      ? basePlusRate(
          pb.aufz_fischgraet.base,
          pb.aufz_fischgraet.ratePerM2,
          s.fischgraetM2,
        )
      : 0;

  const verlegenVersiegeln =
    s.verlegenVersiegelnOn && clamp0(s.verlegenVersiegelnM2) > 0
      ? round2(
          clamp0(s.verlegenVersiegelnM2) *
            pb.aufz_verlegen_versiegeln.ratePerM2,
        )
      : 0;

  const mauerfries =
    s.mauerfriesOn && clamp0(s.mauerfriesLfm) > 0
      ? rateOnly(pb.mauerfries.ratePerLfm, s.mauerfriesLfm)
      : 0;

  // Aufzahlung Antidröhnmatte (Neu Laminat) = 30% od Neu Laminat — samo ako Neu Laminat eligible
  const antidroeNeuLaminat =
    neuLaminatEligible && s.antidroeNeuLaminatOn
      ? round2(neuLaminat * pb.aufz_antidroe.factorOfNeuLaminat)
      : 0;

  const total = round2(
    bestandTeppich +
      bestandLaminat +
      bestandParkett +
      teilParkett +
      neuTeppich +
      neuLaminat +
      neuParkett +
      antidroeNeuLaminat +
      einzelTeppich +
      einzelLaminat +
      antidroeEinzelLaminat +
      einzelParkett +
      fischgraet +
      verlegenVersiegeln +
      mauerfries,
  );

  return {
    bestandTeppich,
    bestandLaminat,
    bestandParkett,
    teilParkett,

    neuTeppichEligible,
    neuTeppich,
    neuLaminatEligible,
    neuLaminat,
    neuParkettEligible,
    neuParkett,
    antidroeNeuLaminat,

    einzelTeppich,
    einzelLaminat,
    antidroeEinzelLaminat,
    einzelParkett,

    fischgraet,
    verlegenVersiegeln,
    mauerfries,

    total,
  };
}

export function calcBodenTotal(
  globalM2: number,
  s: BodenState,
  pb: BodenPriceBook,
) {
  return calcBodenParts(globalM2, s, pb).total;
}
