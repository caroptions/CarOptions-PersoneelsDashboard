export default function MedewerkersPage() {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between pb-5 border-b border-gray-800">
        <div>
          <h3 className="text-2xl font-bold leading-6 text-white">Personeel</h3>
          <p className="mt-2 text-sm text-gray-400">
            Overzicht van alle medewerkers, hun rollen en toegang.
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Nieuwe medewerker
          </button>
        </div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-lg overflow-hidden">
        <p className="p-8 text-center text-gray-400 text-sm">Geen medewerkers gevonden.</p>
      </div>
    </div>
  );
}
