'use client';

import { useState } from 'react';
import { uploadPayslip } from '@/app/actions/uploadPayslip';
import { CheckCircle, AlertCircle, Upload } from 'lucide-react';

export function UploadPayslipForm({ profiles }: { profiles: any[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    
    if (!file || file.size === 0) {
      setMessage({ type: 'error', text: 'Selecteer a.u.b. een bestand.' });
      setLoading(false);
      return;
    }
    
    try {
      const result = await uploadPayslip(formData);
      if (result?.error) {
        setMessage({ type: 'error', text: result.error });
      } else if (result?.success) {
        setMessage({ type: 'success', text: 'Loonstrook succesvol geüpload en gekoppeld!' });
        (e.target as HTMLFormElement).reset();
        setSelectedFileName(null);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Er is een onverwachte fout opgetreden.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-4 rounded-md flex items-start gap-3 border ${message.type === 'success' ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-300 mb-1.5">
          Medewerker
        </label>
        <select
          id="userId"
          name="userId"
          required
          className="block w-full rounded-md border border-gray-700 bg-[#0f172a] px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Selecteer medewerker...</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.full_name || p.email}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1.5">
          Titel van Loonstrook
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          placeholder="bijv. Loonstrook Maart 2026"
          className="block w-full rounded-md border border-gray-700 bg-[#0f172a] px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm placeholder:text-gray-500"
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-1.5">
          PDF Bestand
        </label>
        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-700 px-6 pt-5 pb-6 bg-[#0f172a]/50">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-500" />
            <div className="flex text-sm text-gray-400 justify-center mt-2">
              <label
                htmlFor="file"
                className="relative cursor-pointer rounded-md font-medium text-indigo-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-300"
              >
                <span>Selecteer een bestand</span>
                <input 
                  id="file" 
                  name="file" 
                  type="file" 
                  accept=".pdf,image/*" 
                  className="sr-only" 
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setSelectedFileName(e.target.files[0].name);
                    } else {
                      setSelectedFileName(null);
                    }
                  }}
                />
              </label>
            </div>
            {selectedFileName ? (
              <p className="text-sm text-teal-400 mt-2 font-medium">{selectedFileName}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">PDF of Afbeelding</p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Uploaden en koppelen...' : 'Loonstrook uploaden'}
        </button>
      </div>
    </form>
  );
}
