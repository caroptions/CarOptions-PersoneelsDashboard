'use client';

import { useState, useTransition } from 'react';
import { FileText, Download, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { deletePayslip } from '@/app/actions/deletePayslip';

export function PayslipsTabs({ profiles, payslips }: { profiles: any[], payslips: any[] }) {
  const [activeTab, setActiveTab] = useState(profiles[0]?.id || null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activePayslips = payslips.filter(p => p.user_id === activeTab);

  const handleDownload = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from("payslips")
      .createSignedUrl(filePath, 60);

    if (!error && data) {
      window.open(data.signedUrl, "_blank");
    } else {
      alert("Er is een fout opgetreden bij het openen van de loonstrook.");
    }
  };

  const handleDelete = async (payslipId: string, filePath: string) => {
    if (!confirm('Weet je zeker dat je deze loonstrook wilt verwijderen? Deze actie is onomkeerbaar.')) {
      return;
    }
    setDeletingId(payslipId);
    startTransition(async () => {
      const result = await deletePayslip(payslipId, filePath);
      if (result.error) {
        alert(result.error);
      }
      setDeletingId(null);
    });
  };

  if (!profiles.length) {
    return null;
  }

  return (
    <div className="mt-8 bg-[#111827] border border-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 border-r border-gray-800 bg-[#0f172a] shrink-0">
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible min-h-[300px]">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveTab(p.id)}
              className={`whitespace-nowrap px-4 py-3 text-sm font-medium text-left transition-colors md:border-l-2 md:border-b-0 border-b-2 border-l-0 ${
                activeTab === p.id 
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#111827]'
              }`}
            >
              {p.full_name || p.email}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        <h4 className="text-lg font-medium text-white mb-6">
          Geüploade Loonstroken
        </h4>
        
        {activePayslips.length === 0 ? (
          <p className="text-gray-500 text-sm">Geen loonstroken geüpload voor deze medewerker in gekozen periode.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {activePayslips.map(payslip => (
              <div key={payslip.id} className="bg-[#0f172a] border border-gray-800 rounded p-4 flex justify-between items-center group">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="shrink-0 p-2 bg-indigo-500/10 rounded">
                    <FileText className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-sm font-medium text-gray-200 truncate pr-2">{payslip.period_name}</h5>
                    <p className="text-xs text-gray-500">{new Date(payslip.created_at).toLocaleDateString('nl-NL')}</p>
                  </div>
                </div>
                <div className="flex shrink-0 space-x-1">
                  <button
                    onClick={() => handleDownload(payslip.file_path)}
                    className="text-gray-400 hover:text-indigo-400 p-2 rounded-md hover:bg-[#111827] transition-colors"
                    title="Downloaden / Bekijken"
                    disabled={deletingId === payslip.id}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(payslip.id, payslip.file_path)}
                    disabled={deletingId === payslip.id}
                    className="text-gray-500 hover:text-red-400 p-2 rounded-md hover:bg-red-500/10 transition-colors"
                    title="Verwijderen"
                  >
                    {deletingId === payslip.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
