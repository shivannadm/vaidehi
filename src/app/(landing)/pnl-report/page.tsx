// // src/app/(landing)/pnl-report/page.tsx
// "use client";

// import React, { useState } from "react";
// import { calculateAdvancedMetrics } from "@/lib/trading/metrics";
// import type { Trade, AnalyticsData, ImportStatus } from "./types/analytics.types";
// import {
//   HeroStatsGrid,
//   RiskMetricsCard,
//   DrawdownCard,
//   WinLossCard,
//   StreakCard,
//   BestWorstCard,
//   TradeDurationCard,
//   KellyCard,
// } from "./components/MetricComponents";

// export default function PnLReportPage() {
//   const [url, setUrl] = useState("");
//   const [data, setData] = useState<AnalyticsData | null>(null);
//   const [status, setStatus] = useState<ImportStatus>({
//     status: 'idle',
//     message: '',
//   });

//   const formatCurrency = (amount: number) =>
//     new Intl.NumberFormat("en-IN", { 
//       style: "currency", 
//       currency: "INR", 
//       maximumFractionDigits: 2 
//     }).format(amount);

//   const extractData = async () => {
//     if (!url.trim()) {
//       setStatus({ status: 'error', message: 'Please enter a URL' });
//       return;
//     }

//     setStatus({ status: 'analyzing', message: 'Fetching data from Zerodha...', progress: 20 });

//     try {
//       const res = await fetch("/api/zerodha/import", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url: url.trim() }),
//       });

//       const json = await res.json();

//       if (!res.ok) {
//         setStatus({ status: 'error', message: json.error || 'Failed to extract data' });
//         return;
//       }

//       if (!json.trades || json.trades.length === 0) {
//         setStatus({ status: 'error', message: 'No trades found in the response' });
//         return;
//       }

//       setStatus({ status: 'analyzing', message: 'Calculating advanced metrics...', progress: 60 });

//       console.log('Sample trade:', json.trades[0]);
//       const metrics = calculateAdvancedMetrics(json.trades);
//       console.log('Calculated metrics:', metrics);

//       setStatus({ status: 'analyzing', message: 'Generating visualizations...', progress: 80 });

//       setData({
//         financialYear: json.financial_year,
//         trades: json.trades,
//         metrics,
//         dailyPnL: [],
//       });

//       setStatus({
//         status: 'success',
//         message: `✓ Analysis complete! ${json.trades.length} trades analyzed.`,
//         progress: 100,
//       });

//     } catch (err: any) {
//       console.error('Error:', err);
//       setStatus({
//         status: 'error',
//         message: err.message || 'Failed to analyze trading data',
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
//       {/* Header */}
//       <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
//               <span className="text-xl">📊</span>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold">Advanced Trading Analytics</h1>
//               <p className="text-xs text-slate-400">Professional P&L Analysis</p>
//             </div>
//           </div>
//           {data && (
//             <div className="text-right">
//               <div className="text-xs text-slate-400">Financial Year</div>
//               <div className="text-sm font-semibold">{data.financialYear}</div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Import Section */}
//         {!data && (
//           <div className="max-w-2xl mx-auto">
//             <div className="text-center mb-8">
//               <h2 className="text-3xl font-bold mb-3">Import Your Trading Data</h2>
//               <p className="text-slate-400">Paste your Zerodha verified link to get started</p>
//             </div>

//             <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-slate-300 mb-3">
//                   Zerodha Verified Link
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={url}
//                     onChange={(e) => setUrl(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && extractData()}
//                     placeholder="https://console.zerodha.com/verified/..."
//                     className="w-full px-4 py-4 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                   />
//                 </div>
//               </div>

//               <button
//                 onClick={extractData}
//                 disabled={status.status === 'analyzing' || !url}
//                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
//               >
//                 {status.status === 'analyzing' ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     {status.message}
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                     </svg>
//                     Analyze Trading Data
//                   </>
//                 )}
//               </button>

//               {status.status === 'analyzing' && status.progress && (
//                 <div className="mt-4">
//                   <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
//                     <div
//                       className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
//                       style={{ width: `${status.progress}%` }}
//                     />
//                   </div>
//                 </div>
//               )}

//               {status.status === 'error' && (
//                 <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <p className="text-red-400 text-sm">{status.message}</p>
//                   </div>
//                 </div>
//               )}

//               <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
//                 <div className="flex items-start gap-3">
//                   <svg className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <div>
//                     <h4 className="text-sm font-semibold text-slate-200 mb-2">How to get your link:</h4>
//                     <ol className="text-xs text-slate-400 space-y-1">
//                       <li>1. Login to console.zerodha.com</li>
//                       <li>2. Go to Reports → Tax P&L</li>
//                       <li>3. Generate report and copy the verified link</li>
//                     </ol>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Analytics Dashboard */}
//         {data && data.metrics && (
//           <div className="space-y-6">
//             {/* Hero Metrics */}
//             <HeroStatsGrid metrics={data.metrics} />

//             {/* Main Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <RiskMetricsCard metrics={data.metrics} />
//               <DrawdownCard metrics={data.metrics} />
//               <WinLossCard metrics={data.metrics} />
//               <StreakCard metrics={data.metrics} />
//               <BestWorstCard metrics={data.metrics} />
//               <TradeDurationCard metrics={data.metrics} />
//             </div>

//             {/* Kelly Criterion */}
//             <KellyCard metrics={data.metrics} />

//             {/* Summary Stats */}
//             <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
//               <h3 className="text-lg font-bold mb-4">Performance Summary</h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="text-center p-4 bg-slate-950/50 rounded-lg">
//                   <p className="text-xs text-slate-400 mb-1">Total Trades</p>
//                   <p className="text-2xl font-bold">{data.metrics.totalTrades}</p>
//                 </div>
//                 <div className="text-center p-4 bg-slate-950/50 rounded-lg">
//                   <p className="text-xs text-slate-400 mb-1">Total Charges</p>
//                   <p className="text-lg font-bold text-orange-400">{formatCurrency(data.metrics.totalCharges)}</p>
//                 </div>
//                 <div className="text-center p-4 bg-slate-950/50 rounded-lg">
//                   <p className="text-xs text-slate-400 mb-1">Expectancy</p>
//                   <p className="text-lg font-bold text-indigo-400">{formatCurrency(data.metrics.expectancy)}</p>
//                 </div>
//                 <div className="text-center p-4 bg-slate-950/50 rounded-lg">
//                   <p className="text-xs text-slate-400 mb-1">Date Range</p>
//                   <p className="text-xs font-bold">{data.metrics.startDate} → {data.metrics.endDate}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4 justify-center">
//               <button
//                 onClick={() => setData(null)}
//                 className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-medium transition-all"
//               >
//                 Analyze Another Report
//               </button>
//               <button
//                 className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
//               >
//                 Export Report (PDF)
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from 'react';

interface Trade {
  trade_date: string;
  symbol: string;
  trade_type: string;
  segment: string;
  quantity: number;
  buy_value: number;
  sell_value: number;
  gross_pnl: number;
  charges: number;
  net_pnl: number;
}

interface Metrics {
  totalNetPnL: number;
  totalGrossPnL: number;
  totalCharges: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  expectancy: number;
}

export default function PnLReportCSV() {
  const [data, setData] = useState<{ trades: Trade[], metrics: Metrics } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const text = await file.text();
      const trades = parseCSV(text);
      
      if (trades.length === 0) {
        throw new Error('No valid trades found in CSV');
      }

      const metrics = calculateMetrics(trades);
      setData({ trades, metrics });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseCSV = (text: string): Trade[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const trades: Trade[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length < 8) continue;

      try {
        trades.push({
          trade_date: values[0],
          symbol: values[1],
          trade_type: values[2] || 'equity',
          segment: values[3] || 'EQ',
          quantity: parseFloat(values[4]) || 0,
          buy_value: parseFloat(values[5]) || 0,
          sell_value: parseFloat(values[6]) || 0,
          gross_pnl: parseFloat(values[7]) || 0,
          charges: parseFloat(values[8]) || 0,
          net_pnl: parseFloat(values[9]) || parseFloat(values[7]) || 0,
        });
      } catch (e) {
        console.warn('Skipped invalid row:', values);
      }
    }

    return trades;
  };

  const calculateMetrics = (trades: Trade[]): Metrics => {
    const winning = trades.filter(t => t.net_pnl > 0);
    const losing = trades.filter(t => t.net_pnl <= 0);

    const totalGrossPnL = trades.reduce((sum, t) => sum + t.gross_pnl, 0);
    const totalCharges = trades.reduce((sum, t) => sum + t.charges, 0);
    const totalNetPnL = trades.reduce((sum, t) => sum + t.net_pnl, 0);

    const winRate = (winning.length / trades.length) * 100;
    
    const totalWins = winning.reduce((sum, t) => sum + t.net_pnl, 0);
    const totalLosses = Math.abs(losing.reduce((sum, t) => sum + t.net_pnl, 0));
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? 999 : 0;

    const avgWin = winning.length > 0 ? totalWins / winning.length : 0;
    const avgLoss = losing.length > 0 ? totalLosses / losing.length : 0;
    const expectancy = (winRate / 100) * avgWin - ((100 - winRate) / 100) * avgLoss;

    // Simple Sharpe (using daily returns)
    const returns = trades.map(t => t.net_pnl);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
    const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;

    // Simple max drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let cumulative = 0;
    
    trades.forEach(trade => {
      cumulative += trade.net_pnl;
      if (cumulative > peak) peak = cumulative;
      const dd = peak - cumulative;
      if (dd > maxDrawdown) maxDrawdown = dd;
    });

    return {
      totalGrossPnL,
      totalCharges,
      totalNetPnL,
      totalTrades: trades.length,
      winningTrades: winning.length,
      losingTrades: losing.length,
      winRate: Math.round(winRate * 100) / 100,
      profitFactor: Math.round(profitFactor * 100) / 100,
      sharpeRatio: Math.round(sharpeRatio * 100) / 100,
      maxDrawdown: Math.round(maxDrawdown * 100) / 100,
      expectancy: Math.round(expectancy * 100) / 100,
    };
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { 
      style: "currency", 
      currency: "INR", 
      maximumFractionDigits: 2 
    }).format(amount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Advanced Trading Analytics</h1>
              <p className="text-xs text-slate-400">Upload CSV or Excel file</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!data && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Import Your Trading Data</h2>
              <p className="text-slate-400">Upload your P&L CSV file from Zerodha</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <label className="block">
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                  <svg className="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-lg font-semibold mb-2">Click to upload or drag & drop</p>
                  <p className="text-sm text-slate-400">CSV or Excel file</p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </label>

              {loading && (
                <div className="mt-4 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <p className="mt-2 text-sm text-slate-400">Processing...</p>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <h4 className="text-sm font-semibold mb-2">CSV Format Example:</h4>
                <pre className="text-xs text-slate-400 overflow-auto">
{`trade_date,symbol,type,segment,qty,buy,sell,gross_pnl,charges,net_pnl
2024-01-15,RELIANCE,equity,EQ,10,2450,2480,300,15,285`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {data && data.metrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                label="Total Net P&L"
                value={formatCurrency(data.metrics.totalNetPnL)}
                subtext={`Gross: ${formatCurrency(data.metrics.totalGrossPnL)}`}
                color={data.metrics.totalNetPnL >= 0 ? 'green' : 'red'}
                icon="📈"
              />
              <MetricCard
                label="Win Rate"
                value={`${data.metrics.winRate}%`}
                subtext={`${data.metrics.winningTrades}W / ${data.metrics.losingTrades}L`}
                color="blue"
                icon="🎯"
              />
              <MetricCard
                label="Profit Factor"
                value={data.metrics.profitFactor.toFixed(2)}
                subtext={data.metrics.profitFactor > 1 ? 'Profitable' : 'Unprofitable'}
                color="purple"
                icon="💰"
              />
              <MetricCard
                label="Sharpe Ratio"
                value={data.metrics.sharpeRatio.toFixed(2)}
                subtext={data.metrics.sharpeRatio > 1 ? 'Good' : 'Fair'}
                color="indigo"
                icon="📊"
              />
              <MetricCard
                label="Max Drawdown"
                value={formatCurrency(data.metrics.maxDrawdown)}
                subtext="Peak to trough"
                color="red"
                icon="⚠️"
              />
              <MetricCard
                label="Expectancy"
                value={formatCurrency(data.metrics.expectancy)}
                subtext="Per trade"
                color={data.metrics.expectancy >= 0 ? 'green' : 'red'}
                icon="🔮"
              />
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Performance Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-950/50 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Total Trades</p>
                  <p className="text-2xl font-bold">{data.metrics.totalTrades}</p>
                </div>
                <div className="text-center p-4 bg-slate-950/50 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Total Charges</p>
                  <p className="text-lg font-bold text-orange-400">{formatCurrency(data.metrics.totalCharges)}</p>
                </div>
                <div className="text-center p-4 bg-slate-950/50 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Avg Win</p>
                  <p className="text-lg font-bold text-green-400">
                    {formatCurrency(data.metrics.winningTrades > 0 ? data.trades.filter(t => t.net_pnl > 0).reduce((sum, t) => sum + t.net_pnl, 0) / data.metrics.winningTrades : 0)}
                  </p>
                </div>
                <div className="text-center p-4 bg-slate-950/50 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Avg Loss</p>
                  <p className="text-lg font-bold text-red-400">
                    {formatCurrency(data.metrics.losingTrades > 0 ? data.trades.filter(t => t.net_pnl <= 0).reduce((sum, t) => sum + t.net_pnl, 0) / data.metrics.losingTrades : 0)}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setData(null)}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-medium transition-all"
            >
              Upload Another File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

type ColorType = 'green' | 'red' | 'blue' | 'purple' | 'indigo';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext: string;
  color: ColorType;
  icon: string;
}

function MetricCard({ label, value, subtext, color, icon }: MetricCardProps) {
  const colors: Record<ColorType, string> = {
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-6 hover:scale-[1.02] transition-transform`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <p className="text-slate-500 text-xs">{subtext}</p>
    </div>
  );
}