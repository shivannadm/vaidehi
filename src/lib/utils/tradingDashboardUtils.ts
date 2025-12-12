// src/lib/utils/tradingExportUtils.ts
// Complete export functionality for Trading Reports

import domtoimage from 'dom-to-image-more';
import jsPDF from 'jspdf';

export interface TradingExportOptions {
  username: string;
  appName: string;
}

export interface TradingAnalyticsData {
  performance: {
    totalPnL: number;
    netPnL: number;
    winRate: number;
    profitFactor: number;
    expectancy: number;
  };
  riskMetrics: {
    sharpeRatio: number;
    sortinoRatio: number;
    calmarRatio: number;
  };
  drawdown: {
    maxDrawdown: number;
    maxDrawdownPercent: number;
  };
  streaks: {
    longestWinStreak: number;
    longestLossStreak: number;
  };
  meta: {
    totalTrades: number;
    dateRange: string;
  };
}

// ============================================
// HIGH-QUALITY SCREENSHOT
// ============================================

export async function captureTradingScreenshot(
  elementId: string = 'trading-dashboard',
  options?: TradingExportOptions
): Promise<void> {
  console.log('📸 Capturing trading dashboard screenshot...');
  
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element "${elementId}" not found`);
    }

    // Hide borders temporarily
    const style = document.createElement('style');
    style.id = 'screenshot-border-fix';
    style.innerHTML = `
      #${elementId} * {
        border: none !important;
        outline: none !important;
      }
    `;
    document.head.appendChild(style);

    await new Promise(resolve => setTimeout(resolve, 300));

    const isDark = document.documentElement.classList.contains('dark');
    
    // Capture at 2x resolution for quality
    const dataUrl = await domtoimage.toPng(element, {
      quality: 1.0,
      bgcolor: isDark ? '#0f172a' : '#f8fafc',
      cacheBust: true,
      width: element.scrollWidth * 2,
      height: element.scrollHeight * 2,
      style: {
        transform: 'scale(2)',
        transformOrigin: 'top left',
        width: element.scrollWidth + 'px',
        height: element.scrollHeight + 'px',
      }
    });

    document.head.removeChild(style);

    // Add watermark
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const watermarkHeight = 140;
      canvas.width = img.width;
      canvas.height = img.height + watermarkHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      ctx.drawImage(img, 0, 0);

      // Watermark
      const watermarkY = img.height;
      const gradient = ctx.createLinearGradient(0, watermarkY, 0, watermarkY + watermarkHeight);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.98)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, watermarkY, canvas.width, watermarkHeight);

      if (options) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px system-ui, Arial';
        ctx.textAlign = 'left';
        ctx.fillText(options.appName, 60, watermarkY + 50);

        ctx.font = '32px system-ui, Arial';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(options.username, 60, watermarkY + 95);

        const date = new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        ctx.textAlign = 'right';
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 32px system-ui, Arial';
        ctx.fillText(date, canvas.width - 60, watermarkY + 50);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '28px system-ui, Arial';
        const time = new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
        ctx.fillText(time, canvas.width - 60, watermarkY + 95);
      }

      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Failed to create blob');

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().split('T')[0];
        link.download = `trading-dashboard-${timestamp}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('✅ Screenshot saved!');
      }, 'image/png', 1.0);
    };

    img.onerror = () => {
      const styleEl = document.getElementById('screenshot-border-fix');
      if (styleEl) document.head.removeChild(styleEl);
      throw new Error('Failed to load image');
    };

    img.src = dataUrl;
    
  } catch (error: any) {
    const styleEl = document.getElementById('screenshot-border-fix');
    if (styleEl) document.head.removeChild(styleEl);
    console.error('❌ Screenshot failed:', error);
    throw error;
  }
}

// ============================================
// PDF REPORT GENERATION
// ============================================

export async function generateTradingPDF(
  data: TradingAnalyticsData,
  options: TradingExportOptions
): Promise<void> {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPos = 20;
    const leftMargin = 15;

    // Header
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 50, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text(options.appName, leftMargin, 22);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Trading Dashboard Report', leftMargin, 35);

    doc.setFontSize(11);
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(options.username, pageWidth - leftMargin, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.text(date, pageWidth - leftMargin, 30, { align: 'right' });

    yPos = 60;
    doc.setTextColor(0, 0, 0);

    // Performance Metrics
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('Performance Overview', leftMargin, yPos);
    yPos += 12;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const perfData = [
      ['Metric', 'Value'],
      ['Total P&L', `$${data.performance.totalPnL.toLocaleString()}`],
      ['Net P&L', `$${data.performance.netPnL.toLocaleString()}`],
      ['Win Rate', `${data.performance.winRate}%`],
      ['Profit Factor', data.performance.profitFactor.toString()],
      ['Expectancy', `$${data.performance.expectancy}`],
    ];

    const colWidth = 70;
    perfData.forEach((row, i) => {
      if (i === 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(243, 244, 246);
        doc.rect(leftMargin, yPos - 6, colWidth * 2, 10, 'F');
      } else {
        doc.setFont('helvetica', 'normal');
        if (i % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(leftMargin, yPos - 6, colWidth * 2, 10, 'F');
        }
      }
      doc.text(row[0], leftMargin + 3, yPos);
      doc.text(row[1], leftMargin + colWidth + 3, yPos);
      yPos += 10;
    });

    yPos += 15;

    // Risk Metrics
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('Risk Analysis', leftMargin, yPos);
    yPos += 12;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const riskData = [
      ['Metric', 'Value'],
      ['Sharpe Ratio', data.riskMetrics.sharpeRatio.toString()],
      ['Sortino Ratio', data.riskMetrics.sortinoRatio.toString()],
      ['Calmar Ratio', data.riskMetrics.calmarRatio.toString()],
      ['Max Drawdown', `-$${Math.abs(data.drawdown.maxDrawdown).toLocaleString()}`],
      ['Max DD %', `${data.drawdown.maxDrawdownPercent}%`],
    ];

    riskData.forEach((row, i) => {
      if (i === 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(243, 244, 246);
        doc.rect(leftMargin, yPos - 6, colWidth * 2, 10, 'F');
      } else {
        doc.setFont('helvetica', 'normal');
        if (i % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(leftMargin, yPos - 6, colWidth * 2, 10, 'F');
        }
      }
      doc.text(row[0], leftMargin + 3, yPos);
      doc.text(row[1], leftMargin + colWidth + 3, yPos);
      yPos += 10;
    });

    yPos += 15;

    // Streak Analysis
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('Streak Analysis', leftMargin, yPos);
    yPos += 12;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const streakData = [
      ['Metric', 'Value'],
      ['Longest Win Streak', `${data.streaks.longestWinStreak} trades`],
      ['Longest Loss Streak', `${data.streaks.longestLossStreak} trades`],
    ];

    streakData.forEach((row, i) => {
      if (i === 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(243, 244, 246);
        doc.rect(leftMargin, yPos - 6, colWidth * 2, 10, 'F');
      } else {
        doc.setFont('helvetica', 'normal');
        if (i % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(leftMargin, yPos - 6, colWidth * 2, 10, 'F');
        }
      }
      doc.text(row[0], leftMargin + 3, yPos);
      doc.text(row[1], leftMargin + colWidth + 3, yPos);
      yPos += 10;
    });

    // Footer
    const footerY = pageHeight - 12;
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Generated by ${options.appName} - ${date}`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );

    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`trading-dashboard-${timestamp}.pdf`);
    
    console.log('✅ PDF saved successfully!');
    
  } catch (error) {
    console.error('❌ PDF generation error:', error);
    throw error;
  }
}

// ============================================
// SHARE FUNCTIONALITY
// ============================================

export function shareToTwitter(data: TradingAnalyticsData, url: string): void {
  const text = `Check out my trading performance! 📈
  
Win Rate: ${data.performance.winRate}%
Profit Factor: ${data.performance.profitFactor}
Total P&L: $${data.performance.totalPnL.toLocaleString()}

#Trading #Analytics`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
}

export function shareToLinkedIn(url: string): void {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(linkedInUrl, '_blank', 'width=550,height=420');
}

export function copyLinkToClipboard(url: string): Promise<void> {
  return navigator.clipboard.writeText(url);
}