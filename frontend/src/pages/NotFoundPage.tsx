import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center px-6">
      <div className="max-w-md rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="text-2xl font-semibold">404</div>
        <div className="mt-2 text-slate-300">Seite nicht gefunden.</div>
        <Link
          to="/"
          className="mt-6 inline-block rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-400"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
