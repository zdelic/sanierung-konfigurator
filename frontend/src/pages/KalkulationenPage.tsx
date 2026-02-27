import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteKalkulation,
  listKalkulationen,
  type KalkulationListItem,
} from "@/lib/kalkulationen/client";

function formatEUR(value: number) {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function ActionMenu(props: { onOpen: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
        aria-label="Aktionen"
        title="Aktionen"
      >
        ⋯
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl bg-slate-950/95 ring-1 ring-white/10 backdrop-blur">
          <MenuItem
            label="Öffnen"
            onClick={() => {
              setOpen(false);
              props.onOpen();
            }}
          />

          <div className="h-px bg-white/10" />

          <MenuItem
            label="Entfernen…"
            danger
            onClick={() => {
              setOpen(false);
              props.onDelete();
            }}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem(props: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={[
        "w-full text-left px-4 py-3 text-sm transition",
        props.danger
          ? "text-red-300 hover:bg-red-500/10"
          : "text-slate-200 hover:bg-white/5",
      ].join(" ")}
    >
      {props.label}
    </button>
  );
}

export default function KalkulationenPage() {
  const nav = useNavigate();
  const [items, setItems] = useState<KalkulationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await listKalkulationen(1);
      setItems(res.data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id: number) {
    if (!confirm("Kalkulation wirklich löschen?")) return;
    try {
      await deleteKalkulation(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => nav("/")}
            className="rounded-2xl bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15"
          >
            ← Konfiguratoren
          </button>

          <button
            onClick={() => nav("/k/sanierung")}
            className="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
          >
            + Neue Kalkulation
          </button>
        </div> */}

      <div className="mt-8 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        {/* <div className="text-sm text-slate-300">Sanierung</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">
          Kalkulationen
        </div> */}

        {loading && <div className="mt-6 text-sm text-slate-300">Loading…</div>}

        {err && (
          <div className="mt-6 text-sm text-red-400">
            {err}
            <button
              onClick={load}
              className="ml-3 rounded-xl bg-white/10 px-3 py-1 text-xs ring-1 ring-white/15 hover:bg-white/15"
            >
              Wiederholen
            </button>
          </div>
        )}

        {!loading && !err && items.length === 0 && (
          <div className="mt-6 text-sm text-slate-300">
            Es wurden keine Berechnungen gespeichert.
          </div>
        )}

        <div className="mt-2 grid gap-3">
          {items.map((k) => (
            <div
              key={k.id}
              className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{k.name}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {k.customer ?? "—"} • {k.project_name ?? "—"}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {k.wohnflaeche_m2} m² • PLZ {k.plz} • Updated{" "}
                    {new Date(k.updated_at).toLocaleString()}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-xs text-slate-400">Gesamt</div>
                  <div className="text-sm font-semibold">
                    {formatEUR(k.grand_total)}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-slate-400">Aktionen</div>

                <ActionMenu
                  onOpen={() => nav(`/k/sanierung/${k.id}`)}
                  onDelete={() => onDelete(k.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
