import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Clock, FileText } from 'lucide-react';

export const revalidate = 0;

export default async function PeriodDetail({ params }: { params: Promise<{ period: string }> }) {
  const { period } = await params;
  const decodedPeriod = decodeURIComponent(period);

  const { data: entries, error } = await supabase
    .from('time_entries')
    .select(`
      id,
      hours_worked,
      breaks,
      file_url,
      created_at,
      profiles (
        full_name,
        has_fixed_hours
      )
    `)
    .eq('period_name', decodedPeriod)
    .order('created_at', { ascending: false });

  const safeEntries = entries || [];
  
  const totalHours = safeEntries.reduce((acc, current) => {
    return acc + (Number(current.hours_worked) || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-800">
        <Link href="/uren" className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Terug naar overzicht
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold leading-6 text-white">{decodedPeriod}</h3>
            <p className="mt-2 text-sm text-gray-400">
              Gedetailleerd overzicht van alle ingediende uren in deze periode.
            </p>
          </div>
          <div className="flex bg-[#111827] border border-gray-800 rounded-lg p-4 items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-md">
              <Clock className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400">Totaal uren</p>
              <p className="text-lg font-semibold text-white">{totalHours.toFixed(1)} <span className="text-sm font-normal text-gray-500">uur</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-lg overflow-hidden">
        {error ? (
          <p className="p-8 text-center text-red-400 text-sm">Fout bij ophalen van gegevens: {error.message}</p>
        ) : safeEntries.length === 0 ? (
          <p className="p-8 text-center text-gray-400 text-sm">Geen gegevens gevonden voor deze periode.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800 text-left text-sm">
              <thead className="bg-[#0f172a]">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-300">Medewerker</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-300 text-right">Gewerkte uren</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-300 text-right">Pauze</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-300">Ingediend op</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-300">Bijlage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-[#111827]">
                {safeEntries.map((entry: any) => {
                  const submitDate = new Date(entry.created_at);
                  const formattedDate = new Intl.DateTimeFormat('nl-NL', {
                    day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
                  }).format(submitDate);

                  return (
                    <tr key={entry.id} className="hover:bg-[#1a2333] transition-colors">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-medium text-white">{entry.profiles?.full_name || 'Onbekend'}</div>
                        <div className="text-gray-500 text-xs mt-0.5">
                          {entry.profiles?.has_fixed_hours ? 'Vaste uren' : 'Flexwerker'}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-gray-300 font-medium">
                        {entry.hours_worked} uur
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-gray-400">
                        {entry.breaks || 0} uur
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-400 text-sm">
                        {formattedDate}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {entry.file_url ? (
                          <a 
                            href={entry.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium"
                          >
                            <FileText className="w-4 h-4 mr-1.5" />
                            Bekijken
                          </a>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
