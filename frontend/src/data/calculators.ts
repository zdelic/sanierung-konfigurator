export type CalculatorType =
  | "sanierung"
  | "gemeinschaftsthermen"
  | "sub-sanierung"
  | "brandschaden"
  | "wasserschaden";

export const calculators: Array<{
  type: CalculatorType;
  title: string;
  subtitle: string;
  emoji: string;
}> = [
  {
    type: "sanierung",
    title: "Sanierungs-Konfigurator",
    subtitle: "Wohnungs-/Objektsanierung kalkulieren",
    emoji: "🏠",
  },
  {
    type: "gemeinschaftsthermen",
    title: "Gemeinschaftsthermen-Konfigurator",
    subtitle: "Thermen & Zentralanlagen",
    emoji: "🔥",
  },
  {
    type: "sub-sanierung",
    title: "SUB-Sanierungs-Konfigurator",
    subtitle: "Subunternehmer-Variante / Aufmaß",
    emoji: "🧱",
  },
  {
    type: "brandschaden",
    title: "Brandschadensanierungs-Konfigurator",
    subtitle: "Schadenaufnahme & Sanierung",
    emoji: "🧯",
  },
  {
    type: "wasserschaden",
    title: "Wasserschadensanierungs-Konfigurator",
    subtitle: "Leckage, Trocknung, Wiederherstellung",
    emoji: "💧",
  },
];
