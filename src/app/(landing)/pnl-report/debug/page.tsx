// Create this as: src/app/(landing)/pnl-report/debug/page.tsx
"use client";

import { useState } from 'react';

export default function DebugPage() {
  const [url, setUrl] = useState('https://console.zerodha.com/verified/cbb37752');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testFetch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/zerodha/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const data = await res.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Zerodha Debug Tool</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Zerodha URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded"
            />
          </div>

          <button
            onClick={testFetch}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 rounded font-medium"
          >
            {loading ? 'Testing...' : 'Test Fetch'}
          </button>

          {result && (
            <div className="bg-slate-900 border border-slate-700 rounded p-4">
              <h2 className="text-lg font-bold mb-3">Result:</h2>
              <pre className="text-xs overflow-auto max-h-96 bg-slate-950 p-4 rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}