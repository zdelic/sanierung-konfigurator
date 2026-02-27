import { useEffect, useState } from "react";
import DatePickerDE from "@/components/ui/DatePickerDE";
import AreaField from "@/components/ui/AreaField";
import { useNavigate, useParams } from "react-router-dom";
import {
  getKalkulation,
  createKalkulation,
  updateKalkulation,
} from "@/lib/kalkulationen/client";
import { fetchPricebookItems, toItemMap } from "@/lib/pricebook/client";
import { buildAbbruchPricebook } from "@/components/gewerke/aabbruch/abbruch.pricebook.adapter";
import type { AbbruchPriceBook } from "@/components/gewerke/aabbruch/abbruch.pricebook";
import { buildBMSTPricebook } from "@/components/gewerke/bmst/bmst.pricebook.adapter";
import type { BMSTPriceBook } from "@/components/gewerke/bmst/bmst.pricebook";
import { buildTrockenbauPricebook } from "@/components/gewerke/trockenbau/trockenbau.pricebook.adapter";
import type { TrockenbauPriceBook } from "@/components/gewerke/trockenbau/trockenbau.pricebook";
import { buildEstrichPricebook } from "@/components/gewerke/estrich/estrich.pricebook.adapter";
import type { EstrichPriceBook } from "@/components/gewerke/estrich/estrich.pricebook";
import { buildFliesenPricebook } from "@/components/gewerke/fliesen/fliesen.pricebook.adapter";
import type { FliesenPriceBook } from "@/components/gewerke/fliesen/fliesen.pricebook";
import { buildTischlerPricebook } from "@/components/gewerke/tischler/tischler.pricebook.adapter";
import type { TischlerPriceBook } from "@/components/gewerke/tischler/tischler.pricebook";
import { buildBodenPricebook } from "@/components/gewerke/boden/boden.pricebook.adapter";
import type { BodenPriceBook } from "@/components/gewerke/boden/boden.pricebook";
import type { FensterPriceBook } from "@/components/gewerke/fenster/fenster.pricebook.adapter";
import { buildFensterPricebook } from "@/components/gewerke/fenster/fenster.pricebook.adapter";
import type { BalkonPriceBook } from "@/components/gewerke/balkon/balkon.pricebook.adapter";
import { buildBalkonPricebook } from "@/components/gewerke/balkon/balkon.pricebook.adapter";
import type { ElektroPriceBook } from "@/components/gewerke/elektro/elektro.pricebook.adapter";
import { buildElektroPricebook } from "@/components/gewerke/elektro/elektro.pricebook.adapter";
import type { HaustechnikPriceBook } from "@/components/gewerke/haustechnik/haustechnik.pricebook.adapter";
import { buildHaustechnikPricebook } from "@/components/gewerke/haustechnik/haustechnik.pricebook.adapter";
import type { ReinigungPriceBook } from "@/components/gewerke/reinigung/reinigung.pricebook.adapter";
import { buildReinigungPricebook } from "@/components/gewerke/reinigung/reinigung.pricebook.adapter";

import AbbruchModal from "@/components/gewerke/aabbruch/AbbruchModal";
import {
  DEFAULT_ABBRUCH_STATE,
  calcAbbruchTotal,
  type AbbruchState,
} from "@/components/gewerke/aabbruch/abbruch.calc";

import BMSTModal from "@/components/gewerke/bmst/BMSTModal";
import {
  DEFAULT_BMST_STATE,
  calcBMSTTotal,
  type BMSTState,
} from "@/components/gewerke/bmst/bmst.calc";

import TrockenbauModal from "@/components/gewerke/trockenbau/TrockenbauModal";
import {
  DEFAULT_TROCKENBAU_STATE,
  calcTrockenbauTotal,
  type TrockenbauState,
} from "@/components/gewerke/trockenbau/trockenbau.calc";

import EstrichModal from "@/components/gewerke/estrich/EstrichModal";
import {
  DEFAULT_ESTRICH_STATE,
  calcEstrichTotal,
  type EstrichState,
} from "@/components/gewerke/estrich/estrich.calc";

import FliesenModal from "@/components/gewerke/fliesen/FliesenModal";
import {
  DEFAULT_FLIESEN_STATE,
  calcFliesenTotal,
  type FliesenState,
} from "@/components/gewerke/fliesen/fliesen.calc";

import TischlerModal from "@/components/gewerke/tischler/TischlerModal";
import {
  DEFAULT_TISCHLER_STATE,
  calcTischlerTotal,
  type TischlerState,
} from "@/components/gewerke/tischler/tischler.calc";

import BodenModal from "@/components/gewerke/boden/BodenModal";
import {
  DEFAULT_BODEN_STATE,
  calcBodenTotal,
  type BodenState,
} from "@/components/gewerke/boden/boden.calc";

import MalerModal from "@/components/gewerke/maler/MalerModal";
import {
  DEFAULT_MALER_STATE,
  calcMalerTotal,
  type MalerState,
} from "@/components/gewerke/maler/maler.calc";

import FensterModal from "@/components/gewerke/fenster/FensterModal";
import {
  DEFAULT_FENSTER_STATE,
  calcFensterTotal,
  type FensterState,
} from "@/components/gewerke/fenster/fenster.calc";

import BalkonModal from "@/components/gewerke/balkon/BalkonModal";
import {
  DEFAULT_BALKON_STATE,
  calcBalkonTotal,
  type BalkonState,
} from "@/components/gewerke/balkon/balkon.calc";

import ElektroModal from "@/components/gewerke/elektro/ElektroModal";
import {
  DEFAULT_ELEKTRO_STATE,
  calcElektroTotal,
  type ElektroState,
} from "@/components/gewerke/elektro/elektro.calc";

import HaustechnikModal from "@/components/gewerke/haustechnik/HaustechnikModal";
import {
  DEFAULT_HAUSTECHNIK_STATE,
  calcHaustechnikTotal,
  type HaustechnikState,
} from "@/components/gewerke/haustechnik/haustechnik.calc";

import ReinigungModal from "@/components/gewerke/reinigung/ReinigungModal";
import {
  DEFAULT_REINIGUNG_STATE,
  calcReinigungTotal,
  type ReinigungState,
} from "@/components/gewerke/reinigung/reinigung.calc";
import { buildMalerPricebook } from "@/components/gewerke/maler/maler.pricebook.adapter";
import type { MalerPriceBook } from "@/components/gewerke/maler/maler.pricebook";

type GewerkKey =
  | "abbruch"
  | "bmst"
  | "trockenbau"
  | "estrich"
  | "boden"
  | "fliesen"
  | "tischler"
  | "maler"
  | "fenster"
  | "elektro"
  | "haustechnik"
  | "balkon"
  | "reinigung";

type Gewerk = {
  key: GewerkKey;
  title: string;
  subtitle: string;
  emoji: string;
};

const GEWERKE: Gewerk[] = [
  {
    key: "abbruch",
    title: "Abbruch",
    subtitle: "Beläge • Estrich • Türen • Teilabbruch",
    emoji: "🧨",
  },
  {
    key: "bmst",
    title: "Baumeisterarbeiten",
    subtitle: "Tragende Durchbrüche • Statik",
    emoji: "🧰",
  },
  {
    key: "trockenbau",
    title: "Trockenbauarbeiten",
    subtitle: "Wände • Decken • Vorsatzschalen • Revisionen",
    emoji: "🧱",
  },
  {
    key: "estrich",
    title: "Estrich",
    subtitle: "Neuherstellung • Teilleistungen • Aufzahlungen",
    emoji: "🧱",
  },
  {
    key: "fliesen",
    title: "Fliesen",
    subtitle: "Bestand • Neuverfliesung • Einzelflächen",
    emoji: "🧩",
  },
  {
    key: "tischler",
    title: "Tischler",
    subtitle: "Türen • Zargen • Instandsetzungen",
    emoji: "🪚",
  },
  {
    key: "boden",
    title: "Bodenbeläge",
    subtitle: "Parkett • Laminat • Tepich • Aufzahlungen",
    emoji: "🪵",
  },
  {
    key: "maler",
    title: "Malerarbeiten",
    subtitle: "Bestand • Verputz • Spachtel • Malerei",
    emoji: "🎨",
  },
  {
    key: "fenster",
    title: "Fenster",
    subtitle: "Sanierung • Fenster-Konfigurator • Sonnenschutz",
    emoji: "🪟",
  },
  {
    key: "balkon",
    title: "Balkon",
    subtitle: "Sanierung • Abdichtung • Beläge",
    emoji: "🏗️",
  },
  {
    key: "elektro",
    title: "Elektro",
    subtitle: "Leitungen • Schalter • Verteiler",
    emoji: "⚡",
  },
  {
    key: "haustechnik",
    title: "Haustechnik",
    subtitle: "Heizung • Lüftung • Sanitär • Gas",
    emoji: "🚿",
  },
  {
    key: "reinigung",
    title: "Reinigung",
    subtitle: "Bauendreinigung",
    emoji: "🧽",
  },
];

function formatEUR(value: number) {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** BGK tier (paušal po m²) */
function calcBGK(m2: number) {
  if (m2 <= 50) return 697.27;
  if (m2 <= 60) return 833.8;
  if (m2 <= 80) return 866.71;
  if (m2 <= 90) return 971.54;
  return 1076.38;
}

/** PLZ Zuschlag (1010–1099): €/m² * m² */
function calcPlzZuschlag(m2: number, plz: number) {
  const isCentralVienna = plz >= 1010 && plz <= 1099;
  if (!isCentralVienna) return 0;
  const rate = m2 <= 60 ? 65 : 31;
  return round2(rate * m2);
}
// function pickState<T>(
//   obj: Record<string, unknown>,
//   key: string,
//   fallback: T,
// ): T {
//   const v = obj[key];
//   return v === undefined || v === null ? fallback : (v as T);
// }

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function mergeDeep<T>(base: T, patch: unknown): T {
  // ako patch nije objekt -> vrati base
  if (!isPlainObject(patch)) return base;

  // ako base nije plain object -> patch ne može pametno merge
  if (!isPlainObject(base)) return base;

  const out: Record<string, unknown> = { ...base };

  for (const [k, pv] of Object.entries(patch)) {
    const bv = (base as Record<string, unknown>)[k];

    if (isPlainObject(bv) && isPlainObject(pv)) {
      out[k] = mergeDeep(bv, pv);
    } else {
      out[k] = pv; // overwrite
    }
  }

  return out as T;
}

export default function SanierungDashboardPage() {
  const nav = useNavigate();
  const params = useParams();
  const kalkId = params.id ? Number(params.id) : null;
  // --- MODAL STATES ---
  const [abbruchOpen, setAbbruchOpen] = useState(false);
  const [abbruch, setAbbruch] = useState<AbbruchState>(DEFAULT_ABBRUCH_STATE);

  const [abbruchPb, setAbbruchPb] = useState<AbbruchPriceBook | null>(null);
  const [abbruchPbErr, setAbbruchPbErr] = useState<string | null>(null);

  async function ensureAbbruchPb() {
    if (abbruchPb) return;

    try {
      const items = await fetchPricebookItems("abbruch");
      const map = toItemMap(items);
      setAbbruchPb(buildAbbruchPricebook(map));
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : typeof e === "string"
            ? e
            : "Failed to load Abbruch pricebook";
      setAbbruchPbErr(message);
    }
  }

  const [bmstOpen, setBmstOpen] = useState(false);
  const [bmst, setBmst] = useState<BMSTState>(DEFAULT_BMST_STATE);

  const [bmstPb, setBmstPb] = useState<BMSTPriceBook | null>(null);
  const [bmstPbErr, setBmstPbErr] = useState<string | null>(null);

  async function ensureBmstPb() {
    if (bmstPb) return;
    try {
      const items = await fetchPricebookItems("bmst");
      const map = toItemMap(items);
      setBmstPb(buildBMSTPricebook(map));
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Failed to load BMST pricebook";
      setBmstPbErr(msg);
    }
  }

  const [trockenbauOpen, setTrockenbauOpen] = useState(false);
  const [trockenbau, setTrockenbau] = useState<TrockenbauState>(
    DEFAULT_TROCKENBAU_STATE,
  );

  const [trockenbauPb, setTrockenbauPb] = useState<TrockenbauPriceBook | null>(
    null,
  );

  async function ensureTrockenbauPb() {
    if (trockenbauPb) return;
    try {
      const items = await fetchPricebookItems("trockenbau");
      const map = toItemMap(items);
      setTrockenbauPb(buildTrockenbauPricebook(map));
    } catch (e: unknown) {
      console.error(e);
    }
  }

  const [estrichOpen, setEstrichOpen] = useState(false);
  const [estrich, setEstrich] = useState<EstrichState>(DEFAULT_ESTRICH_STATE);
  const [estrichPb, setEstrichPb] = useState<EstrichPriceBook | null>(null);
  //const [estrichPbErr, setEstrichPbErr] = useState<string | null>(null);

  async function ensureEstrichPb() {
    if (estrichPb) return;

    try {
      const items = await fetchPricebookItems("estrich");
      const map = toItemMap(items);
      setEstrichPb(buildEstrichPricebook(map));
    } catch (e: unknown) {
      console.error(e);
    }
  }

  const [fliesenOpen, setFliesenOpen] = useState(false);
  const [fliesen, setFliesen] = useState<FliesenState>(DEFAULT_FLIESEN_STATE);

  const [fliesenPb, setFliesenPb] = useState<FliesenPriceBook | null>(null);
  // optional (ako želiš prikaz greške)
  //const [fliesenPbErr, setFliesenPbErr] = useState<string | null>(null);

  async function ensureFliesenPb() {
    if (fliesenPb) return;

    try {
      const items = await fetchPricebookItems("fliesen");
      const map = toItemMap(items);
      setFliesenPb(buildFliesenPricebook(map));
    } catch (e: unknown) {
      console.error(e);
    }
  }

  const [tischlerOpen, setTischlerOpen] = useState(false);
  const [tischler, setTischler] = useState<TischlerState>(
    DEFAULT_TISCHLER_STATE,
  );
  const [tischlerPb, setTischlerPb] = useState<TischlerPriceBook | null>(null);

  async function ensureTischlerPb() {
    if (tischlerPb) return;
    const items = await fetchPricebookItems("tischler");
    const map = toItemMap(items);
    setTischlerPb(buildTischlerPricebook(map));
  }

  const [bodenOpen, setBodenOpen] = useState(false);
  const [boden, setBoden] = useState<BodenState>(DEFAULT_BODEN_STATE);
  const [bodenPb, setBodenPb] = useState<BodenPriceBook | null>(null);
  const [bodenPbErr, setBodenPbErr] = useState<string | null>(null);

  async function ensureBodenPb() {
    if (bodenPb) return;
    try {
      const items = await fetchPricebookItems("boden");
      const map = toItemMap(items);
      setBodenPb(buildBodenPricebook(map));
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Failed to load Boden pricebook";
      setBodenPbErr(msg);
    }
  }

  const [malerOpen, setMalerOpen] = useState(false);
  const [maler, setMaler] = useState<MalerState>(DEFAULT_MALER_STATE);
  const [malerPb, setMalerPb] = useState<MalerPriceBook | null>(null);

  async function ensureMalerPb() {
    if (malerPb) return;
    const items = await fetchPricebookItems("maler");
    const map = toItemMap(items);
    setMalerPb(buildMalerPricebook(map));
  }

  const [fensterOpen, setFensterOpen] = useState(false);

  const [fenster, setFenster] = useState<FensterState>(DEFAULT_FENSTER_STATE);

  const [fensterPb, setFensterPb] = useState<FensterPriceBook | null>(null);
  //const [fensterPbErr, setFensterPbErr] = useState<string | null>(null);

  async function ensureFensterPb() {
    if (fensterPb) return;
    try {
      const items = await fetchPricebookItems("fenster");
      const map = toItemMap(items);
      setFensterPb(buildFensterPricebook(map));
    } catch (e: unknown) {
      console.error(e);
    }
  }

  const [balkonOpen, setBalkonOpen] = useState(false);
  const [balkon, setBalkon] = useState<BalkonState>(DEFAULT_BALKON_STATE);

  const [balkonPb, setBalkonPb] = useState<BalkonPriceBook | null>(null);
  async function ensureBalkonPb() {
    if (balkonPb) return;
    const items = await fetchPricebookItems("balkon");
    const map = toItemMap(items);
    setBalkonPb(buildBalkonPricebook(map));
  }
  //const balkonTotal = balkonPb ? calcBalkonTotal(0, balkon, balkonPb) : 0;

  const [elektroOpen, setElektroOpen] = useState(false);
  const [elektro, setElektro] = useState<ElektroState>(DEFAULT_ELEKTRO_STATE);
  const [elektroPb, setElektroPb] = useState<ElektroPriceBook | null>(null);

  async function ensureElektroPb() {
    if (elektroPb) return;
    const items = await fetchPricebookItems("elektro");
    const map = toItemMap(items);
    setElektroPb(buildElektroPricebook(map));
  }

  const [haustechnikOpen, setHaustechnikOpen] = useState(false);
  const [haustechnik, setHaustechnik] = useState<HaustechnikState>(
    DEFAULT_HAUSTECHNIK_STATE,
  );
  const [haustechnikPb, setHaustechnikPb] =
    useState<HaustechnikPriceBook | null>(null);

  async function ensureHaustechnikPb() {
    if (haustechnikPb) return;

    try {
      const items = await fetchPricebookItems("haustechnik");
      const map = toItemMap(items);
      setHaustechnikPb(buildHaustechnikPricebook(map));
    } catch (e) {
      console.error("Failed to load haustechnik pricebook", e);
    }
  }

  const [reinigungOpen, setReinigungOpen] = useState(false);
  const [reinigung, setReinigung] = useState<ReinigungState>(
    DEFAULT_REINIGUNG_STATE,
  );
  const [reinigungPb, setReinigungPb] = useState<ReinigungPriceBook | null>(
    null,
  );

  async function ensureReinigungPb() {
    if (reinigungPb) return;
    const items = await fetchPricebookItems("reinigung");
    const map = toItemMap(items);
    setReinigungPb(buildReinigungPricebook(map));
  }

  // --- META / ROUTE ---
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [kalkName, setKalkName] = useState("Kalkulation WHG-Sanierung");

  // --- PROJECT META ---
  const [project, setProject] = useState({
    projectName: "Sanierung Projekt",
    address: "Musterstraße 12, 1010 Wien",
    customer: "Max Mustermann",
    createdAt: new Date().toISOString().slice(0, 10),
    note: "",
    wohnflaecheM2: 60,
    plz: 1010,
  });

  // load existing kalkulation (edit mode)
  useEffect(() => {
    if (!kalkId || Number.isNaN(kalkId)) return;

    (async () => {
      try {
        const k = await getKalkulation(kalkId);

        setCurrentId(k.id);
        setKalkName(k.name);

        setProject({
          projectName: k.project_name ?? "Sanierung Projekt",
          address: k.address ?? "",
          customer: k.customer ?? "",
          createdAt: k.created_at_date ?? new Date().toISOString().slice(0, 10),
          note: k.note ?? "",
          wohnflaecheM2: k.wohnflaeche_m2 ?? 0,
          plz: k.plz ?? 0,
        });

        const gd = (k.gewerke_data ?? {}) as Record<string, unknown>;

        setAbbruch(mergeDeep(DEFAULT_ABBRUCH_STATE, gd.abbruch));
        setBmst(mergeDeep(DEFAULT_BMST_STATE, gd.bmst));
        setTrockenbau(mergeDeep(DEFAULT_TROCKENBAU_STATE, gd.trockenbau));
        setEstrich(mergeDeep(DEFAULT_ESTRICH_STATE, gd.estrich));
        setFliesen(mergeDeep(DEFAULT_FLIESEN_STATE, gd.fliesen));
        setTischler(mergeDeep(DEFAULT_TISCHLER_STATE, gd.tischler));
        setBoden(mergeDeep(DEFAULT_BODEN_STATE, gd.boden));
        setMaler(mergeDeep(DEFAULT_MALER_STATE, gd.maler));
        setFenster(mergeDeep(DEFAULT_FENSTER_STATE, gd.fenster));
        setBalkon(mergeDeep(DEFAULT_BALKON_STATE, gd.balkon));
        setElektro(mergeDeep(DEFAULT_ELEKTRO_STATE, gd.elektro));
        setHaustechnik(mergeDeep(DEFAULT_HAUSTECHNIK_STATE, gd.haustechnik));
        setReinigung(mergeDeep(DEFAULT_REINIGUNG_STATE, gd.reinigung));
        await Promise.all([
          ensureAbbruchPb(),
          ensureBmstPb(),
          ensureTrockenbauPb(),
          ensureEstrichPb(),
          ensureFliesenPb(),
          ensureTischlerPb(),
          ensureBodenPb(),
          ensureMalerPb(),
          ensureFensterPb(),
          ensureBalkonPb(),
          ensureElektroPb(),
          ensureHaustechnikPb(),
          ensureReinigungPb(),
        ]);
      } catch (e) {
        console.error(e);
        alert("Kalkulation kann nicht geladen werden.");
      }
    })();
  }, [kalkId]);

  async function handleSave() {
    const payload = {
      name: kalkName,
      project_name: project.projectName,
      address: project.address,
      customer: project.customer,
      created_at_date: project.createdAt,
      note: project.note,
      wohnflaeche_m2: Number(project.wohnflaecheM2 || 0),
      plz: Number(project.plz || 0),
      bgk,
      plz_zuschlag: plzZuschlag,
      overhead_total: overheadTotal,
      grand_total: grandTotal,
      gewerke_totals: totals,
      gewerke_data: {
        abbruch,
        bmst,
        trockenbau,
        estrich,
        fliesen,
        tischler,
        boden,
        maler,
        fenster,
        balkon,
        elektro,
        haustechnik,
        reinigung,
      },
    };

    try {
      if (currentId === null) {
        const created = await createKalkulation(payload);
        setCurrentId(created.id);
      } else {
        await updateKalkulation(currentId, payload);
      }
      alert("Kalkulation gespeichert!");
    } catch (e) {
      console.error(e);
      alert("Fehler beim Speichern der Berechnung");
    }
  }

  const m2 = Number(project.wohnflaecheM2 || 0);
  const plz = Number(project.plz || 0);

  // --- TOTALS ---
  const totals: Record<GewerkKey, number> = {
    abbruch: abbruchPb ? calcAbbruchTotal(m2, abbruch, abbruchPb) : 0,
    bmst: bmstPb ? calcBMSTTotal(bmst, bmstPb) : 0,
    trockenbau: trockenbauPb
      ? calcTrockenbauTotal(trockenbau, trockenbauPb)
      : 0,

    // ako Estrich/Fliesen/Tischler/Boden koriste global m²:
    estrich: estrichPb ? calcEstrichTotal(m2, estrich, estrichPb) : 0,
    fliesen: fliesenPb ? calcFliesenTotal(m2, fliesen, fliesenPb) : 0,
    tischler: tischlerPb ? calcTischlerTotal(m2, tischler, tischlerPb) : 0,
    boden: bodenPb ? calcBodenTotal(m2, boden, bodenPb) : 0,
    maler: malerPb ? calcMalerTotal(m2, maler, malerPb) : 0,
    fenster: fensterPb ? calcFensterTotal(m2, fenster, fensterPb) : 0,
    balkon: balkonPb ? calcBalkonTotal(m2, balkon, balkonPb) : 0,
    elektro: elektroPb ? calcElektroTotal(m2, elektro, elektroPb) : 0,
    haustechnik: haustechnikPb
      ? calcHaustechnikTotal(m2, haustechnik, haustechnikPb)
      : 0,
    reinigung: reinigungPb ? calcReinigungTotal(m2, reinigung, reinigungPb) : 0,
  };

  const openHaustechnik = () => {
    ensureHaustechnikPb();
    ensureAbbruchPb();
    ensureEstrichPb();
    ensureBodenPb();
    ensureFliesenPb();
    setHaustechnikOpen(true);
  };

  const onAbbruchChangeFromDeps = (next: AbbruchState) => {
    ensureAbbruchPb();
    setAbbruch(next);
  };
  const onEstrichChangeFromDeps = (next: EstrichState) => {
    ensureEstrichPb();
    setEstrich(next);
  };
  const onBodenChangeFromDeps = (next: BodenState) => {
    ensureBodenPb();
    setBoden(next);
  };
  const onFliesenChangeFromDeps = (next: FliesenState) => {
    ensureFliesenPb();
    setFliesen(next);
  };

  const bgk = calcBGK(m2);
  const plzZuschlag = calcPlzZuschlag(m2, plz);
  const overheadTotal = round2(bgk + plzZuschlag);

  const gewerkeSum = Object.values(totals).reduce(
    (sum, v) => sum + (v ?? 0),
    0,
  );
  const grandTotal = round2(gewerkeSum + overheadTotal);

  const activeGewerke = GEWERKE.filter((g) => (totals[g.key] ?? 0) > 0);

  function setAbbruchAndEnsure(next: AbbruchState) {
    setAbbruch(next);
    if (!abbruchPb) void ensureAbbruchPb(); // fire-and-forget
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute top-1/2 left-10 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        {/* top bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => nav("/")}
            className="rounded-2xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15"
          >
            ← Startseite
          </button>

          <button className="rounded-2xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15">
            Einstellungen
          </button>
        </div>

        {/* header + project meta */}
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-slate-300">
                  Sanierungs-Konfigurator
                </div>
                <div className="mt-1 text-2xl font-semibold tracking-tight">
                  {project.projectName}
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  {project.address}
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15">
                Gesamt:{" "}
                <span className="font-semibold">{formatEUR(grandTotal)}</span>
              </div>
            </div>

            {/* project fields */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {/* Row 1 */}
              <Field
                label="Projekt Name"
                value={project.projectName}
                onChange={(v) => setProject((p) => ({ ...p, projectName: v }))}
                className="md:col-span-2"
              />
              {/* ✅ This fills the “hole” by spanning down over the next row */}
              <div className="md:row-span-2 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                <AreaField
                  value={project.wohnflaecheM2}
                  onChange={(v) =>
                    setProject((p) => ({ ...p, wohnflaecheM2: v }))
                  }
                />
              </div>

              {/* Row 2 (Adresse left 2 cols) + Area right spanning 2 rows */}
              <Field
                label="Kunde"
                value={project.customer}
                onChange={(v) => setProject((p) => ({ ...p, customer: v }))}
                className="md:col-span-2"
              />
              <Field
                label="Adresse"
                value={project.address}
                onChange={(v) => setProject((p) => ({ ...p, address: v }))}
              />
              <NumberField
                label="PLZ"
                value={project.plz}
                onChange={(v) => setProject((p) => ({ ...p, plz: v }))}
              />
              <DatePickerDE
                label="Datum"
                value={project.createdAt}
                onChange={(v) => setProject((p) => ({ ...p, createdAt: v }))}
              />

              {/* Row 3 */}

              <Field
                label="Notiz"
                value={project.note}
                onChange={(v) => setProject((p) => ({ ...p, note: v }))}
                className="md:col-span-3"
              />
            </div>

            {/* Overhead preview */}
            <div className="mt-6 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-sm font-semibold">Fixe Projektkosten</div>
              <div className="mt-3 space-y-2 text-sm">
                <Row label="Baustellengemeinkosten" value={formatEUR(bgk)} />
                <Row
                  label={`PLZ-Zuschlag ${plz >= 1010 && plz <= 1099 ? "(Für Wien 1010-1099)" : "(nicht aktiv)"}`}
                  value={formatEUR(plzZuschlag)}
                />
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-slate-300">Summe Fixkosten</span>
                  <span className="font-semibold">
                    {formatEUR(overheadTotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {/* <button
                onClick={() => nav("/k/sanierung/wizard")}
                className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-400"
              >
                Zur Kalkulation (Wizard)
              </button> */}
              <button
                onClick={handleSave}
                className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-400"
              >
                Kalkulation speichern
              </button>
              <button
                onClick={() => {
                  if (!currentId)
                    return alert("Speichern Sie zuerst die Berechnung.");
                  window.open(`/api/kalkulationen/${currentId}/pdf`, "_blank");
                }}
              >
                PDF Export
              </button>
            </div>
          </div>

          {/* quick summary */}
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-sm text-slate-300">Übersicht</div>
            <div className="mt-2 text-base font-semibold">
              Positionen mit Preis
            </div>

            <div className="mt-3 space-y-2">
              <div className="text-xs text-slate-400 pt-1">
                Fixe Projektkosten
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-200">BGK</span>
                <span className="text-slate-300">{formatEUR(bgk)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-200">PLZ Zuschlag</span>
                <span className="text-slate-300">{formatEUR(plzZuschlag)}</span>
              </div>

              <div className="text-xs text-slate-400 pt-4">
                Gewerke (nur {" > "}0)
              </div>
              {activeGewerke.slice(0, 8).map((g) => (
                <div
                  key={g.key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-200">{g.title}</span>
                  <span className="text-slate-300">
                    {formatEUR(totals[g.key] ?? 0)}
                  </span>
                </div>
              ))}

              <div className="pt-3 border-t border-white/10 text-sm flex items-center justify-between">
                <span className="text-slate-300">Gesamt</span>
                <span className="font-semibold">{formatEUR(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* gewerke grid */}
        <div className="mt-10">
          <div className="text-sm text-slate-300">
            Gewerke{" "}
            {bodenPbErr && (
              <div className="text-sm text-red-400">{bodenPbErr}</div>
            )}
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">
            Öffne ein Gewerk zur Bearbeitung
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GEWERKE.map((g) => {
              const total = totals[g.key] ?? 0;
              const showAsActive = total > 0;

              return (
                <button
                  key={g.key}
                  onClick={async () => {
                    if (g.key === "abbruch") {
                      await ensureAbbruchPb();
                      setAbbruchOpen(true);
                      return;
                    }
                    if (g.key === "bmst") {
                      await ensureBmstPb();
                      setBmstOpen(true);
                      return;
                    }
                    if (g.key === "trockenbau") {
                      await ensureTrockenbauPb();
                      setTrockenbauOpen(true);
                      return;
                    }
                    if (g.key === "estrich") {
                      await ensureEstrichPb();
                      setEstrichOpen(true);
                      return;
                    }
                    if (g.key === "fliesen") {
                      await ensureFliesenPb();
                      setFliesenOpen(true);
                      return;
                    }
                    if (g.key === "tischler") {
                      await ensureTischlerPb();
                      setTischlerOpen(true);
                      return;
                    }
                    if (g.key === "boden") {
                      await ensureBodenPb();
                      setBodenOpen(true);
                      return;
                    }
                    if (g.key === "maler") {
                      await ensureMalerPb();
                      setMalerOpen(true);
                      return;
                    }
                    if (g.key === "fenster") {
                      await ensureFensterPb();
                      setFensterOpen(true);
                      return;
                    }
                    if (g.key === "balkon") {
                      await ensureBalkonPb();
                      setBalkonOpen(true);
                      return;
                    }
                    if (g.key === "elektro") {
                      await ensureElektroPb();
                      setElektroOpen(true);
                    }
                    if (g.key === "haustechnik") {
                      openHaustechnik();
                      return;
                    }
                    if (g.key === "reinigung") {
                      await ensureReinigungPb();
                      setReinigungOpen(true);
                      return;
                    }
                  }}
                  className={[
                    "text-left rounded-3xl p-5 ring-1 backdrop-blur transition",
                    showAsActive
                      ? "bg-white/10 ring-white/15 hover:bg-white/15"
                      : "bg-white/5 ring-white/10 hover:bg-white/10",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                        <span className="text-lg">{g.emoji}</span>
                      </div>
                      <div>
                        <div className="text-base font-semibold">{g.title}</div>
                        <div className="mt-1 text-sm text-slate-300">
                          {g.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400">
                        {showAsActive ? "hat Preis" : "0,00"}
                      </div>
                      <div className="mt-1 text-sm font-semibold">
                        {formatEUR(total)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      {showAsActive
                        ? "In Übersicht sichtbar"
                        : "Wird oben nicht angezeigt"}
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-2 text-xs ring-1 ring-white/15">
                      Öffnen →
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <AbbruchModal
            open={abbruchOpen}
            wohnflaecheM2={m2}
            value={abbruch}
            onChange={setAbbruch}
            onClose={() => setAbbruchOpen(false)}
            pricebook={abbruchPb}
          />
          {abbruchPbErr && (
            <div className="text-sm text-red-400">{abbruchPbErr}</div>
          )}

          <BMSTModal
            open={bmstOpen}
            value={bmst}
            onChange={setBmst}
            onClose={() => setBmstOpen(false)}
            pricebook={bmstPb}
          />
          {bmstPbErr && <div className="text-sm text-red-400">{bmstPbErr}</div>}

          <TrockenbauModal
            open={trockenbauOpen}
            value={trockenbau}
            onChange={setTrockenbau}
            onClose={() => setTrockenbauOpen(false)}
            pricebook={trockenbauPb}
          />
          <EstrichModal
            open={estrichOpen}
            wohnflaecheM2={m2}
            value={estrich}
            onChange={setEstrich}
            onClose={() => setEstrichOpen(false)}
            abbruch={abbruch}
            onAbbruchChange={setAbbruchAndEnsure}
            pricebook={estrichPb}
          />
          <FliesenModal
            open={fliesenOpen}
            wohnflaecheM2={m2}
            value={fliesen}
            onChange={setFliesen}
            onClose={() => setFliesenOpen(false)}
            abbruch={abbruch}
            onAbbruchChange={setAbbruchAndEnsure}
            pricebook={fliesenPb}
          />
          <TischlerModal
            open={tischlerOpen}
            wohnflaecheM2={m2}
            value={tischler}
            onChange={setTischler}
            onClose={() => setTischlerOpen(false)}
            abbruch={abbruch}
            onAbbruchChange={setAbbruchAndEnsure}
            pricebook={tischlerPb}
          />
          <BodenModal
            open={bodenOpen}
            wohnflaecheM2={m2}
            value={boden}
            onChange={setBoden}
            pricebook={bodenPb}
            onClose={() => setBodenOpen(false)}
            abbruch={abbruch}
            onAbbruchChange={setAbbruchAndEnsure}
          />
          <MalerModal
            open={malerOpen}
            wohnflaecheM2={m2}
            value={maler}
            onChange={setMaler}
            onClose={() => setMalerOpen(false)}
            pricebook={malerPb}
          />
          <FensterModal
            open={fensterOpen}
            wohnflaecheM2={m2}
            value={fenster}
            onChange={setFenster}
            onClose={() => setFensterOpen(false)}
            pricebook={fensterPb}
          />
          <BalkonModal
            open={balkonOpen}
            wohnflaecheM2={m2}
            value={balkon}
            onChange={setBalkon}
            onClose={() => setBalkonOpen(false)}
            pricebook={balkonPb}
          />
          <ElektroModal
            open={elektroOpen}
            wohnflaecheM2={m2}
            value={elektro}
            onChange={setElektro}
            onClose={() => setElektroOpen(false)}
            pricebook={elektroPb}
          />
          <HaustechnikModal
            open={haustechnikOpen}
            wohnflaecheM2={m2}
            value={haustechnik}
            onChange={setHaustechnik}
            onClose={() => setHaustechnikOpen(false)}
            pricebook={haustechnikPb}
            abbruch={abbruch}
            onAbbruchChange={onAbbruchChangeFromDeps}
            estrich={estrich}
            onEstrichChange={onEstrichChangeFromDeps}
            boden={boden}
            onBodenChange={onBodenChangeFromDeps}
            fliesen={fliesen}
            onFliesenChange={onFliesenChangeFromDeps}
          />
          <ReinigungModal
            open={reinigungOpen}
            wohnflaecheM2={m2}
            value={reinigung}
            onChange={setReinigung}
            onClose={() => setReinigungOpen(false)}
            pricebook={reinigungPb}
          />
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Sanierung Kalkulator • React + Tailwind
        </div>
      </div>
    </div>
  );
}

function Row(props: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-200">{props.label}</span>
      <span className="text-slate-300">{props.value}</span>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={props.className ?? ""}>
      <div className="text-xs text-slate-400">{props.label}</div>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 outline-none placeholder:text-slate-500 focus:ring-white/20"
        placeholder={props.label}
      />
    </div>
  );
}

function NumberField(props: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  return (
    <div className={props.className ?? ""}>
      <div className="text-xs text-slate-400">{props.label}</div>
      <input
        type="number"
        min={0}
        step={1}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value || 0))}
        className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10 outline-none placeholder:text-slate-500 focus:ring-white/20"
        placeholder={props.label}
      />
    </div>
  );
}
