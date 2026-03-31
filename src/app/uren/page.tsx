import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Calendar, ChevronRight, Users, Clock } from 'lucide-react';

export const revalidate = 0; // Altijd verse data

export default async function UrenPage() {
  // Fetch alle time entries om de unieke periodes te genereren, inclusief info voor aggregatie
  const { data: timeEntries, error } = await supabase
    .from('time_entries')
    .select('period_name, hours_worked, user_id')
    .order('created_at', { ascending: false });

  // Aggegrate periods manually (because Supabase JS doesn't have native distinct/groupBy)
  const periods = new Map<string, { totalHours: number; uniqueUsers: Set<string> }>();

  if (timeEntries && !error) {
    for (const entry of timeEntries) {
      if (!periods.has(entry.period_name)) {
        periods.set(entry.period_name, { totalHours: 0, uniqueUsers: new Set() });
      }
      const p = periods.get(entry.period_name)!;
      p.totalHours += Number(entry.hours_worked) || 0;
      p.uniqueUsers.add(entry.user_id);
    }
  }

  const periodArray = Array.from(periods.entries()).map(([name, stats]) => ({
    name,
    totalHours: stats.totalHours,
    userCount: stats.uniqueUsers.size,
  }));

  // Je zou ze misschien nog op basis van daadwerkelijke data chronologisch willen sorteren,
  // maar omdat we de ruwe array uit supabase aflopen (die gesorteerd was op descending created_at), 
  // staan ze al in de juiste chronologische volgorde (meest recente bovenaan).

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-800">
        <h3 className="text-2xl font-bold leading-6 text-white">Gemaakte uren</h3>
        <p className="mt-2 text-sm text-gray-400">
          Selecteer een periode om de urendeclaraties van alle medewerkers in te zien.
        </p>
      </div>

      {error ? (
        <div className="bg-[#111827] border border-red-900/50 rounded-lg p-6">
          <p className="text-red-400 text-sm">Fout bij ophalen van data: {error.message}</p>
        </div>
      ) : periodArray.length === 0 ? (
        <div className="bg-[#111827] border border-gray-800 rounded-lg p-12 text-center">
          <Calendar className="mx-auto h-8 w-8 text-gray-600 mb-3" />
          <h3 className="text-sm font-semibold text-white">Geen uren gevonden</h3>
          <p className="mt-1 text-sm text-gray-400">
            Zodra de eerste medewerker uren doorgeeft voor een periode, verschijnt deze hier.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {periodArray.map((period) => (
            <Link
              key={period.name}
              href={`/uren/${encodeURIComponent(period.name)}`}
              className="relative flex items-center justify-between rounded-lg border border-gray-800 bg-[#111827] p-5 hover:bg-[#1a2333] transition-colors group"
            >
              <div className="min-w-0 pr-4">
                <p className="text-sm font-semibold text-white flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-indigo-400" />
                  {period.name}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>{period.userCount} ingediend</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{period.totalHours.toFixed(1)} uren totaal</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-300 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
