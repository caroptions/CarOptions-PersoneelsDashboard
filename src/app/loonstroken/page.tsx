import { supabase } from '@/lib/supabase';
import { UploadPayslipForm } from '@/components/UploadPayslipForm';
import { PayslipsTabs } from '@/components/PayslipsTabs';
import { FileText } from 'lucide-react';

export const revalidate = 0;

export default async function LoonstrokenPage() {
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .order('full_name', { ascending: true });

  const { data: payslips, error: payslipsError } = await supabase
    .from('payslips')
    .select('*')
    .order('created_at', { ascending: false });

  const safeProfiles = profiles || [];
  const safePayslips = payslips || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-5 border-b border-gray-800 flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-bold leading-6 text-white">Loonstroken Beheer</h3>
          <p className="mt-2 text-sm text-gray-400">
            Upload hier direct loonstroken voor specifieke medewerkers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Form Area */}
        <div className="bg-[#111827] border border-gray-800 rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-medium text-white mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-indigo-400" />
            Nieuwe Upload
          </h4>
          
          {profileError ? (
            <p className="text-red-400 text-sm">Fout bij ophalen medewerkers: {profileError.message}</p>
          ) : (
            <UploadPayslipForm profiles={safeProfiles} />
          )}
        </div>

        {/* Info/Instructions Area */}
        <div className="bg-[#0f172a] border border-gray-800/50 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-300 mb-4">Hoe werkt dit?</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-700 bg-[#111827] text-xs font-semibold text-gray-300 mr-3">
                1
              </span>
              <span>Kies in de linkerkolom de medewerker waarvoor je een loonstrook wilt klaarzetten.</span>
            </li>
            <li className="flex items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-700 bg-[#111827] text-xs font-semibold text-gray-300 mr-3">
                2
              </span>
              <span>Bedenk een duidelijke titel, bijvoorbeeld "Loonstrook Maart 2026". Deze titel ziet de werknemer direct in zijn portaal.</span>
            </li>
            <li className="flex items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-700 bg-[#111827] text-xs font-semibold text-gray-300 mr-3">
                3
              </span>
              <span>Selecteer de PDF op je computer en klik op uploaden. De loonstrook is vanaf dat moment direct, en <strong>enkel voor die medewerker</strong>, inzichtelijk via work.caroptions.nl.</span>
            </li>
          </ul>
        </div>
      </div>

      <PayslipsTabs profiles={safeProfiles} payslips={safePayslips} />
    </div>
  );
}
