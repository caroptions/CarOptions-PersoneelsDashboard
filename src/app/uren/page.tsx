export default function UrenPage() {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between pb-5 border-b border-gray-800">
        <div>
          <h3 className="text-2xl font-bold leading-6 text-white">Gemaakte uren</h3>
          <p className="mt-2 text-sm text-gray-400">
            Bekijk en accordeer de gewerkte uren van personeel.
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
          >
            Exporteer lijst
          </button>
        </div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-lg overflow-hidden">
        <p className="p-8 text-center text-gray-400 text-sm">Geen urenregistraties gevonden voor deze periode.</p>
      </div>
    </div>
  );
}
