import { supabase } from '@/lib/supabase';
import { getCurrentPeriodInfo } from '@/lib/dateUtils';

export const revalidate = 60; // Revalidate every minute, or adjust as needed for cache

export default async function Home() {
  // 1. Aantal Actieve Medewerkers (count entries in `profiles`)
  const { count: staffCount, error: staffError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true });

  const activeStaff = staffError ? 0 : staffCount;

  // 2. Aantal gemaakte uren voor de actieve periode
  const currentPeriod = getCurrentPeriodInfo();
  const activePeriodString = currentPeriod.id;

  const { data: timeEntries, error: timeError } = await supabase
    .from('time_entries')
    .select('hours_worked')
    .eq('period_name', activePeriodString);

  let totalHours = 0;
  if (!timeError && timeEntries) {
    totalHours = timeEntries.reduce((acc, entry) => acc + (Number(entry.hours_worked) || 0), 0);
  }

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-800">
        <h3 className="text-2xl font-bold leading-6 text-white">Dashboard</h3>
        <p className="mt-2 text-sm text-gray-400">
          Welkom op het Personeelsdashboard. Bekijk en beheer de actuele cijfers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-[#111827] border border-gray-800 p-5">
          <dt className="truncate text-sm font-medium text-gray-400">Actieve Medewerkers</dt>
          <dd className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-white">{activeStaff ?? '-'}</span>
          </dd>
        </div>
        
        <div className="overflow-hidden rounded-lg bg-[#111827] border border-gray-800 p-5">
          <dt className="truncate text-sm font-medium text-gray-400">Gemaakte uren ({currentPeriod.periodName})</dt>
          <dd className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-white">{totalHours.toFixed(1)}</span>
            <span className="text-sm font-medium text-gray-400">uur</span>
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-[#111827] border border-gray-800 p-5">
          <dt className="truncate text-sm font-medium text-gray-400">Aankomende loonstroken</dt>
          <dd className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-white">0</span>
          </dd>
        </div>
      </div>
    </div>
  );
}
