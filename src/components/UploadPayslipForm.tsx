'use client';

import { useState, useRef } from 'react';
import { uploadPayslip } from '@/app/actions/uploadPayslip';
import { CheckCircle, AlertCircle, Upload, File as FileIcon, X } from 'lucide-react';

export function UploadPayslipForm({ profiles }: { profiles: any[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setMessage(null);

    // Grab normal form fields (userId, title)
    const formData = new FormData(e.currentTarget);
    
    // Explicitly add our governed file state
    if (!file) {
      setMessage({ type: 'error', text: 'Selecteer a.u.b. een bestand.' });
      setLoading(false);
      return;
    }
    
    formData.append('file', file);
    
    try {
      const result = await uploadPayslip(formData);
      if (result?.error) {
        setMessage({ type: 'error', text: result.error });
      } else if (result?.success) {
        setMessage({ type: 'success', text: 'Loonstrook succesvol geüpload en gekoppeld!' });
        (e.target as HTMLFormElement).reset();
        setFile(null);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Er is een onverwachte fout opgetreden.' });
    } finally {
      setLoading(false);
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Open the hidden file input when clicking the dropzone
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          PDF Bestand
        </label>
        
        {/* Hidden File Input */}
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".pdf,image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />

        {/* Dropzone */}
        {!file ? (
          <div 
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6 transition-colors cursor-pointer
              ${isDragging 
                ? 'border-indigo-500 bg-indigo-500/10' 
                : 'border-gray-700 bg-[#0f172a]/50 hover:bg-[#0f172a]'}`}
          >
            <div className="space-y-1 text-center pointer-events-none">
              <Upload className={`mx-auto h-8 w-8 ${isDragging ? 'text-indigo-400' : 'text-gray-500'}`} />
              <div className="flex text-sm text-gray-400 justify-center mt-2">
                <span className="font-medium text-indigo-400">Bladeren</span>
                <span className="ml-1">of sleep een bestand hierheen</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">PDF of Afbeelding</p>
            </div>
          </div>
        ) : (
          <div className="mt-1 flex items-center justify-between rounded-md border border-gray-700 bg-[#0f172a]/50 px-4 py-3">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="flex-shrink-0 p-2 bg-indigo-500/10 rounded">
                <FileIcon className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-teal-400 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-red-400 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Uploaden en koppelen...' : 'Loonstrook uploaden'}
        </button>
      </div>
    </form>
  );
}
