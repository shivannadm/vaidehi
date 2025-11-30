// ============================================
// FILE: src/lib/utils/progressExportUtils.ts
// Purpose: Export utilities for Routine Progress Dashboard
// ============================================

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ============================================
// TYPES
// ============================================

export interface ProgressScreenshotOptions {
  username: string;
  appName: string;
}

export interface ProgressReportData {
  username: string;
  appName: string;
  overview: {
    longestStreak: number;
    morningCompletionRate: number;
    eveningCompletionRate: number;
    healthCompletionRate: number;
    habitCompletionRate: number;
    avgMeditationTime: number;
    avgExerciseTime: number;
    avgWellness: number;
    totalEntries: number;
  };
  weeklySummary: {
    weekStart: string;
    weekEnd: string;
    morningDays: number;
    eveningDays: number;
    healthDays: number;
    totalMeditationMinutes: number;
    totalExerciseMinutes: number;
    avgSleepQuality: number;
    avgMood: number;
    overallScore: number;
  };
}

// ============================================
// SCREENSHOT - VISIBLE VIEWPORT ONLY
// ============================================

export async function captureProgressScreenshot(
  elementId: string = 'progress-dashboard-content',
  options?: ProgressScreenshotOptions
): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    console.log('📸 Capturing Progress Dashboard screenshot...');

    const canvas = await html2canvas(element, {
      logging: false,
      useCORS: true,
      allowTaint: true,
      scale: 1,
      backgroundColor: document.documentElement.classList.contains('dark') 
        ? '#0f172a' 
        : '#f8fafc',
      windowWidth: element.offsetWidth,
      windowHeight: element.offsetHeight,
    });

    console.log('✅ Canvas captured successfully');

    // Add watermark (optional)
    if (options) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const watermarkHeight = 60;
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.fillRect(0, canvas.height - watermarkHeight, canvas.width, watermarkHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(options.appName, 25, canvas.height - 35);

        ctx.font = '15px Arial, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(options.username, 25, canvas.height - 15);

        const date = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        ctx.textAlign = 'right';
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '14px Arial, sans-serif';
        ctx.fillText(date, canvas.width - 25, canvas.height - 25);
      }
    }

    console.log('✅ Watermark added, downloading...');

    // Download
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `routine-progress-${timestamp}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      console.log('✅ Progress screenshot saved!');
    }, 'image/png', 0.92);
    
  } catch (error) {
    console.error('❌ Screenshot error:', error);
    throw error;
  }
}

// ============================================
// PDF REPORT - ROUTINE PROGRESS
// ============================================

export async function generateProgressPDF(data: ProgressReportData): Promise<void> {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPos = 20;
    const leftMargin = 15;
    const rightMargin = pageWidth - 15;

    // ============================================
    // HEADER
    // ============================================
    doc.setFillColor(139, 92, 246); // Purple theme for routine
    doc.rect(0, 0, pageWidth, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(data.appName, leftMargin, 22);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('Routine Progress Report', leftMargin, 32);

    doc.setFontSize(11);
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(data.username, rightMargin, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.setTextColor(226, 232, 240);
    doc.text(date, rightMargin, 28, { align: 'right' });

    yPos = 55;
    doc.setTextColor(0, 0, 0);

    // ============================================
    // OVERVIEW STATISTICS
    // ============================================
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 92, 246);
    doc.text('Overall Statistics', leftMargin, yPos);
    yPos += 12;

    doc.setFontSize(10);
    const overviewData = [
      ['Metric', 'Value'],
      ['Longest Streak', `${data.overview.longestStreak} days`],
      ['Total Entries', `${data.overview.totalEntries} entries`],
      ['Morning Completion', `${data.overview.morningCompletionRate}%`],
      ['Evening Completion', `${data.overview.eveningCompletionRate}%`],
      ['Health Completion', `${data.overview.healthCompletionRate}%`],
      ['Habit Completion', `${data.overview.habitCompletionRate}%`],
    ];

    const colWidth = 60;
    overviewData.forEach((row, i) => {
      if (i === 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(243, 244, 246);
        doc.rect(leftMargin, yPos - 6, colWidth * 2, 9, 'F');
        doc.setTextColor(0, 0, 0);
      } else {
        doc.setFont('helvetica', 'normal');
        if (i % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(leftMargin, yPos - 6, colWidth * 2, 9, 'F');
        }
      }
      doc.text(row[0], leftMargin + 3, yPos);
      doc.text(row[1], leftMargin + colWidth + 3, yPos);
      yPos += 9;
    });

    yPos += 12;

    // ============================================
    // WELLNESS METRICS
    // ============================================
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 92, 246);
    doc.text('Wellness Metrics', leftMargin, yPos);
    yPos += 12;

    doc.setFontSize(10);
    const wellnessData = [
      ['Metric', 'Average'],
      ['Meditation Time', `${data.overview.avgMeditationTime} min/day`],
      ['Exercise Time', `${data.overview.avgExerciseTime} min/day`],
      ['Overall Wellness Score', `${data.overview.avgWellness}/10`],
    ];

    wellnessData.forEach((row, i) => {
      if (i === 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(243, 244, 246);
        doc.rect(leftMargin, yPos - 6, colWidth * 2, 9, 'F');
        doc.setTextColor(0, 0, 0);
      } else {
        doc.setFont('helvetica', 'normal');
        if (i % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(leftMargin, yPos - 6, colWidth * 2, 9, 'F');
        }
      }
      doc.text(row[0], leftMargin + 3, yPos);
      doc.text(row[1], leftMargin + colWidth + 3, yPos);
      yPos += 9;
    });

    yPos += 12;

    // ============================================
    // WEEKLY SUMMARY
    // ============================================
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 92, 246);
    doc.text('This Week Summary', leftMargin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(
      `${data.weeklySummary.weekStart} to ${data.weeklySummary.weekEnd}`,
      leftMargin,
      yPos
    );
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const weeklyData = [
      ['Activity', 'Count/Value'],
      ['Morning Routines', `${data.weeklySummary.morningDays}/7 days`],
      ['Evening Routines', `${data.weeklySummary.eveningDays}/7 days`],
      ['Health Entries', `${data.weeklySummary.healthDays}/7 days`],
      ['Total Meditation', `${data.weeklySummary.totalMeditationMinutes} min`],
      ['Total Exercise', `${data.weeklySummary.totalExerciseMinutes} min`],
      ['Average Sleep Quality', `${data.weeklySummary.avgSleepQuality}/10`],
      ['Average Mood', `${data.weeklySummary.avgMood}/10`],
      ['Overall Week Score', `${data.weeklySummary.overallScore}%`],
    ];

    weeklyData.forEach((row, i) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }

      if (i === 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(243, 244, 246);
        doc.rect(leftMargin, yPos - 6, colWidth * 2, 9, 'F');
        doc.setTextColor(0, 0, 0);
      } else {
        doc.setFont('helvetica', 'normal');
        if (i % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(leftMargin, yPos - 6, colWidth * 2, 9, 'F');
        }
      }
      doc.text(row[0], leftMargin + 3, yPos);
      doc.text(row[1], leftMargin + colWidth + 3, yPos);
      yPos += 9;
    });

    yPos += 15;

    // ============================================
    // INSIGHTS
    // ============================================
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 92, 246);
    doc.text('Key Insights', leftMargin, yPos);
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const insights = [
      `Your longest streak is ${data.overview.longestStreak} days - excellent consistency!`,
      `This week you completed ${data.weeklySummary.overallScore}% of your routine goals.`,
      `Average wellness score: ${data.overview.avgWellness}/10`,
      `Keep building these healthy habits for long-term success!`,
    ];

    insights.forEach((insight, i) => {
      const lines = doc.splitTextToSize(`- ${insight}`, pageWidth - 2 * leftMargin);
      lines.forEach((line: string) => {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, leftMargin, yPos);
        yPos += 7;
      });
      yPos += 3;
    });

    // ============================================
    // FOOTER
    // ============================================
    const footerY = pageHeight - 12;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Generated by ${data.appName} - ${date}`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );

    // Save
    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`routine-progress-${timestamp}.pdf`);
    
    console.log('✅ PDF saved successfully!');
    
  } catch (error) {
    console.error('❌ PDF generation error:', error);
    throw error;
  }
}

// ============================================
// JSON EXPORT
// ============================================

export function exportProgressJSON(data: any): void {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `routine-progress-data-${timestamp}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    console.log('✅ JSON exported successfully!');
  } catch (error) {
    console.error('❌ JSON export error:', error);
    throw error;
  }
}