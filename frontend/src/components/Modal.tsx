import { useEffect } from "react";

export default function Modal(props: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { open, title, subtitle, onClose, headerRight, children } = props;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      {/* dialog */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="flex w-full max-w-3xl max-h-[90vh] flex-col rounded-3xl bg-slate-950/95 ring-1 ring-white/15 shadow-2xl">
          {/* HEADER (fixed) */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
            <div>
              <div className="text-lg font-semibold">{title}</div>
              {subtitle ? (
                <div className="mt-1 text-sm text-slate-300">{subtitle}</div>
              ) : null}
            </div>

            <div className="flex items-start gap-4">
              {headerRight ? headerRight : null} {/* ✅ OVO DODAJ */}
              <button
                onClick={onClose}
                className="rounded-2xl bg-white/10 px-3 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15"
              >
                ✕
              </button>
            </div>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
