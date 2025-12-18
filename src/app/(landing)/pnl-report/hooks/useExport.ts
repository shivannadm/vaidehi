// src/app/dashboard/trading/reports/hooks/useExport.ts
"use client";

import { useState } from 'react';
import { captureTradingScreenshot, generateTradingPDF } from '@/lib/utils/tradingExportUtils';
import type { ComprehensiveAnalytics, ExportOptions } from '../types/analytics.types';

export function useExport() {
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportScreenshot = async (options: ExportOptions) => {
    try {
      setExporting(true);
      setExportProgress(30);
      
      await captureTradingScreenshot('trading-analytics-dashboard', {
        username: options.username,
        appName: options.appName,
      });
      
      setExportProgress(100);
      return { success: true };
    } catch (error) {
      console.error('Screenshot export failed:', error);
      return { success: false, error };
    } finally {
      setExporting(false);
      setExportProgress(0);
    }
  };

  const exportPDF = async (
    data: ComprehensiveAnalytics,
    options: ExportOptions
  ) => {
    try {
      setExporting(true);
      setExportProgress(30);

      const pdfData = {
        performance: data.performance,
        riskMetrics: data.risk,
        drawdown: data.drawdown,
        streaks: data.streaks,
        meta: data.meta,
      };

      await generateTradingPDF(pdfData, {
        username: options.username,
        appName: options.appName,
      });

      setExportProgress(100);
      return { success: true };
    } catch (error) {
      console.error('PDF export failed:', error);
      return { success: false, error };
    } finally {
      setExporting(false);
      setExportProgress(0);
    }
  };

  const shareToTwitter = (data: ComprehensiveAnalytics, url: string) => {
    const text = `Check out my trading performance! 📈

Win Rate: ${data.performance.winRate}%
Profit Factor: ${data.performance.profitFactor}
Total P&L: $${data.performance.totalPnL.toLocaleString()}
Sharpe Ratio: ${data.risk.sharpeRatio}

#Trading #Analytics #Investing`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareToLinkedIn = (url: string) => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  };

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      return { success: true };
    } catch (error) {
      console.error('Copy failed:', error);
      return { success: false, error };
    }
  };

  return {
    exporting,
    exportProgress,
    exportScreenshot,
    exportPDF,
    shareToTwitter,
    shareToLinkedIn,
    copyLink,
  };
}