import { PublisherForm } from '@/components/editor/PublisherForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),linear-gradient(180deg,#f8fafc,#eef2ff)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">TRN Andalucía</p>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">TRN Publisher</h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              Editor rápido para crear borradores en WordPress desde una interfaz limpia y preparada para crecer.
            </p>
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200 backdrop-blur">
            Estado: <span className="font-semibold text-emerald-700">v1 lista para WordPress</span>
          </div>
        </header>

        <PublisherForm />
      </div>
    </main>
  );
}
