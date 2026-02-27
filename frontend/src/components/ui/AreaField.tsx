import React from "react";

type Props = {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
};

export default function AreaField({
  value,
  onChange,
  min = 5,
  max = 350,
}: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm text-slate-400">Wohnfläche (m²)</label>
        <div className="text-lg font-semibold text-emerald-400">{value} m²</div>
      </div>

      {/* Slider */}
      <div className="mt-3">
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-emerald-400"
        />
      </div>

      {/* Manual input */}
      <div className="mt-3">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-2xl bg-white/5 px-4 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-white/20"
        />
      </div>

      {/* Quick presets */}
      <div className="mt-2 flex gap-2">
        {[40, 60, 80, 100].map((m2) => (
          <button
            key={m2}
            type="button"
            onClick={() => onChange(m2)}
            className="rounded-xl bg-white/5 px-3 py-1 text-sm ring-1 ring-white/10 hover:bg-white/10"
          >
            {m2} m²
          </button>
        ))}
      </div>
    </div>
  );
}
