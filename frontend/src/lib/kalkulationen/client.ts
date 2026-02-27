export type KalkulationPayload = {
  name: string;

  project_name: string | null;
  address: string | null;
  customer: string | null;
  created_at_date: string | null;
  note: string | null;
  wohnflaeche_m2: number;
  plz: number;

  bgk: number;
  plz_zuschlag: number;
  overhead_total: number;
  grand_total: number;

  gewerke_totals: Record<string, number> | null;

  // 🔥 ovdje umjesto any:
  gewerke_data: Record<string, unknown>;
};

export type KalkulationListItem = {
  id: number;
  name: string;
  project_name: string | null;
  customer: string | null;
  wohnflaeche_m2: number;
  plz: number;
  grand_total: number;
  updated_at: string;
};

export type KalkulationFull = KalkulationListItem & {
  address: string | null;
  created_at_date: string | null;
  note: string | null;

  bgk: number;
  plz_zuschlag: number;
  overhead_total: number;

  gewerke_totals: Record<string, number> | null;
  gewerke_data: Record<string, unknown>;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function listKalkulationen(page = 1) {
  return http<{ data: KalkulationListItem[] }>(
    `/api/kalkulationen?page=${page}`,
  );
}

export function createKalkulation(payload: KalkulationPayload) {
  return http<KalkulationFull>(`/api/kalkulationen`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateKalkulation(id: number, payload: KalkulationPayload) {
  return http<KalkulationFull>(`/api/kalkulationen/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getKalkulation(id: number) {
  return http<KalkulationFull>(`/api/kalkulationen/${id}`);
}

export function deleteKalkulation(id: number) {
  return http<{ ok: true }>(`/api/kalkulationen/${id}`, { method: "DELETE" });
}
