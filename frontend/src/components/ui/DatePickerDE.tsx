import { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { de } from "date-fns/locale";
import { format, isValid, parse } from "date-fns";

import "react-day-picker/dist/style.css";

type DatePickerDEProps = {
  label?: string;
  value: string; // "dd.MM.yyyy" ili ""
  onChange: (next: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function DatePickerDE({
  label = "Datum",
  value,
  onChange,
  placeholder = "TT.MM.JJJJ",
  disabled = false,
}: DatePickerDEProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Parse value safely from "dd.MM.yyyy"
  const selectedDate = useMemo(() => {
    if (!value) return undefined;

    // 1) ako je ISO "yyyy-mm-dd"
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      return isValid(dt) ? dt : undefined;
    }

    // 2) ako je DE "dd.MM.yyyy"
    const dt = parse(value, "dd.MM.yyyy", new Date(), { locale: de });
    return isValid(dt) ? dt : undefined;
  }, [value]);

  const displayValue = useMemo(() => {
    if (!value) return "";

    // ISO -> DE string
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-");
      return `${d}.${m}.${y}`;
    }

    return value; // već je dd.MM.yyyy
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {label ? <div className="text-sm text-slate-400">{label}</div> : null}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={[
          "mt-2 w-full rounded-2xl bg-white/5 px-4 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-white/20",
          "flex items-center justify-between", // ✅ centriraj sve
          disabled
            ? "cursor-not-allowed text-slate-500"
            : "text-slate-100 hover:bg-white/10",
        ].join(" ")}
      >
        <span className={value ? "text-slate-100" : "text-slate-500"}>
          {displayValue || placeholder}
        </span>

        <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
          📅
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[320px] rounded-2xl bg-slate-950 p-3 shadow-2xl ring-1 ring-white/10">
          <DayPicker
            mode="single"
            locale={de}
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              // ✅ Always "dd.MM.yyyy"
              onChange(format(date, "dd.MM.yyyy", { locale: de }));
              setOpen(false);
            }}
          />

          <div className="mt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              className="rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              Löschen
            </button>

            <button
              type="button"
              className="rounded-xl bg-emerald-500/15 px-3 py-2 text-xs text-emerald-200 ring-1 ring-emerald-400/20 hover:bg-emerald-500/20"
              onClick={() => {
                onChange(format(new Date(), "dd.MM.yyyy", { locale: de }));
                setOpen(false);
              }}
            >
              Heute
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
