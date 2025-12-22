// src/app/(landing)/pnl-report/page.tsx
"use client";

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { calculateAdvancedMetrics } from '@/lib/trading/metrics';
import type { Trade, AdvancedMetrics } from './types/analytics.types';
import {
  HeroStatsGrid,
  RiskMetricsCard,
  DrawdownCard,
  WinLossCard,
  StreakCard,
  BestWorstCard,
  TradeDurationCard,
  KellyCard,
} from './components/MetricComponents';
import {
  EquityCurveChart,
  WinLossPieChart,
  MonthlyPnLBarChart,
  TradeDistributionChart,
  TopWinnersLosersTable,
  SymbolPerformanceTable,
  TradeHeatmap,
} from './components/Charts';

export default function PnLReportPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [metrics, setMetrics] = useState<AdvancedMetrics | null>(null);
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
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        
        setProgress(60);
        const parsedTrades = parseExcelPnL(workbook);
        
        console.log('Parsed trades:', parsedTrades.length);
        console.log('Sample trade:', parsedTrades[0]);
        
        const calculatedMetrics = calculateAdvancedMetrics(parsedTrades);
        
        setProgress(80);
        setTrades(parsedTrades);
        setMetrics(calculatedMetrics);
        setProgress(100);
      } else if (extension === 'csv') {
        const text = await file.text();
        
        setProgress(60);
        const parsedTrades = parseCSVPnL(text);
        
        console.log('Parsed trades:', parsedTrades.length);
        
        const calculatedMetrics = calculateAdvancedMetrics(parsedTrades);
        
        setProgress(80);
        setTrades(parsedTrades);
        setMetrics(calculatedMetrics);
        setProgress(100);
      } else {
        throw new Error('Unsupported file format. Please upload Excel (.xlsx) or CSV file.');
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

  const parseExcelPnL = (workbook: XLSX.WorkBook): Trade[] => {
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const trades: Trade[] = [];
    let startIndex = -1;
    let totalCharges = 0;

    // Find charges section
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row[0] === 'Charges') {
        // Sum all charges from the section
        for (let j = i + 2; j < jsonData.length && jsonData[j][0]; j++) {
          const chargeValue = parseFloat(jsonData[j][1]);
          if (!isNaN(chargeValue)) {
            totalCharges += chargeValue;
          }
        }
        break;
      }
    }

    console.log('Total charges found:', totalCharges);

    // Find the P&L table (starts with "Symbol")
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row[0] && String(row[0]).toLowerCase() === 'symbol') {
        startIndex = i;
        break;
      }
    }

    if (startIndex === -1) {
      throw new Error('Could not find P&L data in Excel file. Make sure you uploaded the correct Zerodha P&L statement.');
    }

    // Parse trades
    for (let i = startIndex + 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || !row[0]) break;

      const symbol = String(row[0]).trim();
      if (!symbol) break;

      // Columns: Symbol, ISIN, Quantity, Buy Value, Sell Value, Realized P&L, Realized P&L Pct, ...
      const quantity = parseFloat(row[2]) || 0;
      const buyValue = parseFloat(row[3]) || 0;
      const sellValue = parseFloat(row[4]) || 0;
      const realizedPnL = parseFloat(row[5]) || 0;

      if (realizedPnL !== 0) {
        trades.push({
          trade_date: new Date().toISOString().split('T')[0],
          symbol,
          trade_type: 'equity',
          segment: 'EQ',
          quantity,
          buy_value: buyValue,
          sell_value: sellValue,
          gross_pnl: realizedPnL,
          charges: 0, // Will be calculated below
          net_pnl: realizedPnL,
        });
      }
    }

    if (trades.length === 0) {
      throw new Error('No trades found in the file. Please check if this is a valid P&L statement.');
    }

    // Distribute charges proportionally based on gross P&L
    if (totalCharges > 0) {
      const totalGrossPnL = trades.reduce((sum, t) => sum + Math.abs(t.gross_pnl), 0);
      trades.forEach(trade => {
        trade.charges = (Math.abs(trade.gross_pnl) / totalGrossPnL) * totalCharges;
        trade.net_pnl = trade.gross_pnl - trade.charges;
      });
    } else {
      // If no charges found, estimate at 0.1% of trade value
      trades.forEach(trade => {
        trade.charges = Math.abs(trade.gross_pnl) * 0.001;
        trade.net_pnl = trade.gross_pnl - trade.charges;
      });
    }

    console.log('Total trades parsed:', trades.length);

    return trades;
  };

  const parseCSVPnL = (text: string): Trade[] => {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length === 0) throw new Error('Empty CSV file');

    const trades: Trade[] = [];
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));

    console.log('CSV headers:', headers);

    // Find column indices
    const getColIndex = (names: string[]) => {
      for (const name of names) {
        const idx = headers.indexOf(name);
        if (idx !== -1) return idx;
      }
      return -1;
    };

    const symbolIdx = getColIndex(['symbol', 'scrip']);
    const qtyIdx = getColIndex(['quantity', 'qty']);
    const buyIdx = getColIndex(['buy value', 'buy_value', 'buy']);
    const sellIdx = getColIndex(['sell value', 'sell_value', 'sell']);
    const pnlIdx = getColIndex(['realized p&l', 'realized_pnl', 'realized pnl', 'pnl']);

    if (symbolIdx === -1 || pnlIdx === -1) {
      throw new Error('Could not find required columns (Symbol, P&L) in CSV');
    }

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length < 4) continue;

      const pnl = parseFloat(cols[pnlIdx]) || 0;
      if (pnl === 0) continue;

      const buyValue = buyIdx !== -1 ? parseFloat(cols[buyIdx]) || 0 : 0;
      const sellValue = sellIdx !== -1 ? parseFloat(cols[sellIdx]) || 0 : 0;
      const charges = Math.abs(pnl) * 0.001;

      trades.push({
        trade_date: new Date().toISOString().split('T')[0],
        symbol: cols[symbolIdx].replace(/"/g, '').trim(),
        trade_type: 'equity',
        segment: 'EQ',
        quantity: qtyIdx !== -1 ? parseFloat(cols[qtyIdx]) || 0 : 0,
        buy_value: buyValue,
        sell_value: sellValue,
        gross_pnl: pnl,
        charges,
        net_pnl: pnl - charges,
      });
    }

    if (trades.length === 0) {
      throw new Error('No valid trades found in CSV');
    }

    return trades;
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(amount);

  // Upload Screen
  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        {/* Header */}
        <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Advanced Trading Analytics</h1>
                <p className="text-xs text-slate-400">20+ Professional Metrics & Visualizations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Import Your Trading Data
            </h2>
            <p className="text-slate-400">Upload Zerodha P&L Excel or CSV file</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-16 text-center hover:border-indigo-500 hover:bg-slate-800/30 transition-all">
                <svg className="w-20 h-20 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-xl font-semibold mb-2">
                  {loading ? '⏳ Processing Your Data...' : 'Drop file or click to upload'}
                </p>
                <p className="text-sm text-slate-400 mb-4">Excel (.xlsx) or CSV files supported</p>
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
                <p className="text-center text-sm text-slate-400 mt-2">
                  {progress < 40 && 'Reading file...'}
                  {progress >= 40 && progress < 60 && 'Parsing trades...'}
                  {progress >= 60 && progress < 80 && 'Calculating metrics...'}
                  {progress >= 80 && 'Almost done!'}
                  {' '}({progress}%)
                </p>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-red-400 font-semibold text-sm">Error Processing File</p>
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
                      <span>Login to <strong>console.zerodha.com</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">2.</span>
                      <span>Navigate to <strong>Reports → Tax P&L</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">3.</span>
                      <span>Download the <strong>Excel (.xlsx)</strong> or <strong>CSV</strong> file</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">4.</span>
                      <span>Upload it here to see your complete analysis</span>
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

  // Analytics Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pb-20">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Advanced Trading Analytics</h1>
              <p className="text-xs text-slate-400">
                {metrics.totalTrades} Trades Analyzed • {formatCurrency(metrics.totalNetPnL)} Net P&L
              </p>
            </div>
          </div>
          <button 
            onClick={() => { setMetrics(null); setTrades([]); }} 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-all"
          >
            New Analysis
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Hero Stats Grid */}
        <HeroStatsGrid metrics={metrics} />

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RiskMetricsCard metrics={metrics} />
          <DrawdownCard metrics={metrics} />
          <WinLossCard metrics={metrics} />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StreakCard metrics={metrics} />
          <BestWorstCard metrics={metrics} />
          <TradeDurationCard metrics={metrics} />
        </div>

        {/* Kelly Criterion */}
        <KellyCard metrics={metrics} />

        {/* CHARTS SECTION */}
        {/* Equity Curve & Monthly P&L */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EquityCurveChart trades={trades} />
          <WinLossPieChart metrics={metrics} />
        </div>

        {/* Monthly Bar Chart & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyPnLBarChart trades={trades} />
          <TradeDistributionChart trades={trades} />
        </div>

        {/* Trade Heatmap */}
        <TradeHeatmap trades={trades} />

        {/* Top Winners/Losers */}
        <TopWinnersLosersTable trades={trades} />

        {/* Symbol Performance Table */}
        <SymbolPerformanceTable trades={trades} />

        {/* Summary Stats */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">📋 Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-950/50 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Total Trades</p>
              <p className="text-2xl font-bold">{metrics.totalTrades}</p>
            </div>
            <div className="text-center p-4 bg-slate-950/50 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Total Charges</p>
              <p className="text-lg font-bold text-orange-400">{formatCurrency(metrics.totalCharges)}</p>
            </div>
            <div className="text-center p-4 bg-slate-950/50 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Expectancy</p>
              <p className="text-lg font-bold text-indigo-400">{formatCurrency(metrics.expectancy)}</p>
            </div>
            <div className="text-center p-4 bg-slate-950/50 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Date Range</p>
              <p className="text-xs font-bold">{metrics.startDate || 'N/A'} → {metrics.endDate || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={() => { setMetrics(null); setTrades([]); }}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-medium transition-all"
          >
            Analyze Another Report
          </button>
          <button
            onClick={() => alert('PDF export coming soon!')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
          >
            Export Report (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}