import { supabase } from '@/lib/supabase';
import { Mail, Briefcase, MapPin, CreditCard } from 'lucide-react';

export const revalidate = 0; // Altijd verse data ophalen

export default async function MedewerkersPage() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true });

  const medewerkers = profiles || [];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between pb-5 border-b border-gray-800">
        <div>
          <h3 className="text-2xl font-bold leading-6 text-white">Personeel</h3>
          <p className="mt-2 text-sm text-gray-400">
            Overzicht van alle medewerkers, hun contactgegevens en contractvorm.
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0 flex gap-3">
          {/* Action buttons could be here, kept minimal for 'uncodify' feel */}
          <button
            type="button"
            className="inline-flex items-center rounded bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700"
          >
            Exporteren
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded bg-white text-gray-900 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-gray-100"
          >
            Nieuwe medewerker
          </button>
        </div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-lg overflow-hidden">
        {error ? (
          <p className="p-8 text-center text-red-400 text-sm">Fout bij ophalen van medewerkers: {error.message}</p>
        ) : medewerkers.length === 0 ? (
          <p className="p-8 text-center text-gray-400 text-sm">Geen medewerkers gevonden.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800 text-left text-sm">
              <thead className="bg-[#0f172a]">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-300">
                    Naam
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-300">
                    Salaris/IBAN
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-300">
                    Adres
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-300">
                    Contract
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-[#111827]">
                {medewerkers.map((person) => (
                  <tr key={person.id} className="hover:bg-[#1a2333] transition-colors">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-white">{person.full_name || 'Geen naam opgeven'}</div>
                      <div className="text-gray-400 mt-0.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {person.email}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-300">
                      {person.iban ? (
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                          <span>{person.iban}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-300">
                      {person.address ? (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-500" />
                          <span className="truncate max-w-[200px]">{person.address}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {person.has_fixed_hours ? (
                        <span className="inline-flex items-center text-indigo-300 bg-indigo-500/10 px-2 py-0.5 text-xs rounded border border-indigo-500/20">
                          Vaste uren
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-teal-300 bg-teal-500/10 px-2 py-0.5 text-xs rounded border border-teal-500/20">
                          Flexwerker
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
