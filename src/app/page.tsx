export default function Home() {
  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-800">
        <h3 className="text-2xl font-bold leading-6 text-white">Dashboard</h3>
        <p className="mt-2 text-sm text-gray-400">
          Welkom op het Personeelsdashboard. Beheer hier de uren en loonstroken van de medewerkers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Metric Cards placeholders matching standard uncodify layout */}
        <div className="overflow-hidden rounded-lg bg-[#111827] border border-gray-800 p-5">
          <dt className="truncate text-sm font-medium text-gray-400">Actieve Medewerkers</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">24</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-[#111827] border border-gray-800 p-5">
          <dt className="truncate text-sm font-medium text-gray-400">Te accorderen uren</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">12</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-[#111827] border border-gray-800 p-5">
          <dt className="truncate text-sm font-medium text-gray-400">Aankomende loonstroken</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">3</dd>
        </div>
      </div>
    </div>
  );
}
