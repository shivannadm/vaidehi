// src/app/(landing)/pnl-report/components/FileUpload.tsx
'use client';

import { useState } from 'react';

interface FileUploadProps {
  onFileProcessed: (trades: any[], metrics: any) => void;
}

export default function FileUpload({ onFileProcessed }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setProgress(20);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      setProgress(40);

      if (extension === 'xlsx' || extension === 'xls') {
        const XLSX = await import('xlsx');
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        
        setProgress(60);
        const { trades, metrics } = await processExcelFile(workbook);
        
        setProgress(80);
        onFileProcessed(trades, metrics);
        setProgress(100);
      } else if (extension === 'csv') {
        const text = await file.text();
        
        setProgress(60);
        const { trades, metrics } = await processCSVFile(text);
        
        setProgress(80);
        onFileProcessed(trades, metrics);
        setProgress(100);
      } else {
        throw new Error('Unsupported file format. Please upload Excel or CSV.');
      }

      setTimeout(() => setProgress(0), 1000);
    } catch (err: any) {
      console.error('File processing error:', err);
      setError(err.message || 'Failed to process file');
      setProgress(0);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const processExcelFile = async (workbook: any) => {
    // This will be implemented in Part 2
    return { trades: [], metrics: null };
  };

  const processCSVFile = async (text: string) => {
    // This will be implemented in Part 2
    return { trades: [], metrics: null };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">📊</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Advanced Trading Analytics</h1>
            <p className="text-xs text-slate-400">20+ Professional Metrics</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Import Trading Data
          </h2>
          <p className="text-slate-400">Upload Zerodha P&L Excel or CSV file</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-16 text-center hover:border-indigo-500 hover:bg-slate-800/30 transition-all">
              <svg className="w-20 h-20 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xl font-semibold mb-2">
                {loading ? '⏳ Processing...' : 'Drop file or click to upload'}
              </p>
              <p className="text-sm text-slate-400 mb-4">Excel (.xlsx) or CSV files</p>
              <input 
                type="file" 
                accept=".csv,.xlsx,.xls" 
                onChange={handleFileUpload} 
                disabled={loading} 
                className="hidden" 
              />
            </div>
          </label>

          {loading && progress > 0 && (
            <div className="mt-6">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 rounded-full" 
                  style={{width: `${progress}%`}} 
                />
              </div>
              <p className="text-center text-sm text-slate-400 mt-2">{progress}% Complete</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-red-400 font-semibold text-sm">Error</p>
                <p className="text-red-300 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}

          <div className="mt-8 p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h4 className="font-semibold text-indigo-200 mb-3">How to get your file:</h4>
                <ol className="space-y-2 text-sm text-indigo-300">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">1.</span>
                    <span>Login to console.zerodha.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">2.</span>
                    <span>Go to Reports → Tax P&L</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">3.</span>
                    <span>Download the Excel/CSV file</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}