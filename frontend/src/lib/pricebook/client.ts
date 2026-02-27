import { api } from "@/lib/api";
import type { PricebookItemDTO, PricebookItemMap } from "./types";

const mem = new Map<string, PricebookItemDTO[]>();

export function num(v: string | number | null | undefined): number {
  if (v === null || v === undefined) return 0;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function fetchPricebookItems(
  gewerkKey: string,
): Promise<PricebookItemDTO[]> {
  const hit = mem.get(gewerkKey);
  if (hit) return hit;

  const res = await api.get<PricebookItemDTO[]>("/pricebook", {
    params: { gewerk: gewerkKey },
  });
  mem.set(gewerkKey, res.data);
  return res.data;
}

export function toItemMap(items: PricebookItemDTO[]): PricebookItemMap {
  const map: PricebookItemMap = {};
  for (const it of items) map[it.position_key] = it;
  return map;
}
