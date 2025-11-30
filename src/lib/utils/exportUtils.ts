// ============================================
// FILE: src/lib/utils/exportUtils.ts
// ✅ HIGH QUALITY: 2x resolution screenshot
// ============================================

import domtoimage from 'dom-to-image-more';
import jsPDF from 'jspdf';

export interface ScreenshotOptions {
  username: string;
  appName: string;
}

export interface ReportData {
  username: string;
  appName: string;
  stats: {
    totalFocusTime: number;
    weekFocusTime: number;
    todayFocusTime: number;
    totalCompletedTasks: number;
    weekCompletedTasks: number;
    todayCompletedTasks: number;
  };
  projects: Array<{
    name: string;
    daily: number;
    weekly: number;
    monthly: number;
  }>;
  focusGoal?: {
    totalDays: number;
    completedDays: number;
    rate: number;
  };
}

// ============================================
// SCREENSHOT - HIGH QUALITY (2x Resolution)
// ============================================

export async function captureFullPageScreenshot(
  elementId: string,
  options: ScreenshotOptions
): Promise<void> {
  console.log('📸 Starting high-quality screenshot...');
  
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element "${elementId}" not found`);
    }

    // ✅ Temporarily hide all borders
    const style = document.createElement('style');
    style.id = 'screenshot-border-fix';
    style.innerHTML = `
      #${elementId} * {
        border: none !important;
        outline: none !important;
      }
      #${elementId} .border,
      #${elementId} .border-t,
      #${elementId} .border-b,
      #${elementId} .border-l,
      #${elementId} .border-r {
        border: none !important;
      }
    `;
    document.head.appendChild(style);

    console.log('📸 Borders hidden, waiting for render...');
    await new Promise(resolve => setTimeout(resolve, 400));

    console.log('📸 Capturing with dom-to-image (high quality)...');

    // ✅ INCREASED QUALITY: 2x resolution
    const dataUrl = await domtoimage.toPng(element, {
      quality: 1.0,
      bgcolor: '#0f172a',
      cacheBust: true,
      width: element.scrollWidth * 2, // ✅ Double width
      height: element.scrollHeight * 2, // ✅ Double height
      style: {
        transform: 'scale(2)', // ✅ Scale up 2x
        transformOrigin: 'top left',
        width: element.scrollWidth + 'px',
        height: element.scrollHeight + 'px',
      }
    });

    // Remove temporary style
    document.head.removeChild(style);

    console.log('✅ High-quality image captured, adding watermark...');

    // Add watermark
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const watermarkHeight = 160; // ✅ Scaled for 2x
      canvas.width = img.width;
      canvas.height = img.height + watermarkHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Watermark background with gradient
      const watermarkY = img.height;
      const gradient = ctx.createLinearGradient(0, watermarkY, 0, watermarkY + watermarkHeight);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.98)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, watermarkY, canvas.width, watermarkHeight);

      // App name (scaled for 2x)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px system-ui, -apple-system, Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(options.appName, 80, watermarkY + 64);

      // Username (scaled for 2x)
      ctx.font = '34px system-ui, -apple-system, Arial, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(options.username, 80, watermarkY + 116);

      // Date (right side, scaled for 2x)
      const date = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      ctx.textAlign = 'right';
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 34px system-ui, -apple-system, Arial, sans-serif';
      ctx.fillText(date, canvas.width - 80, watermarkY + 64);

      // Time (right side, scaled for 2x)
      const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      ctx.fillStyle = '#94a3b8';
      ctx.font = '30px system-ui, -apple-system, Arial, sans-serif';
      ctx.fillText(time, canvas.width - 80, watermarkY + 116);

      // Download
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create blob');
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().split('T')[0];
        link.download = `vaidehi-trends-${timestamp}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('✅ High-quality screenshot downloaded!');
      }, 'image/png', 1.0);
    };

    img.onerror = () => {
      // Remove style if error occurs
      const styleEl = document.getElementById('screenshot-border-fix');
      if (styleEl) document.head.removeChild(styleEl);
      throw new Error('Failed to load captured image');
    };

    img.src = dataUrl;
    
  } catch (error: any) {
    // Cleanup on error
    const styleEl = document.getElementById('screenshot-border-fix');
    if (styleEl) document.head.removeChild(styleEl);
    
    console.error('❌ Screenshot failed:', error);
    throw error;
  }
}

// ============================================
// PDF REPORT (UNCHANGED)
// ============================================

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export async function generatePDFReport(data: ReportData): Promise<void> {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPos = 20;
    const leftMargin = 15;
    const rightMargin = pageWidth - 15;

    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(data.appName, leftMargin, 22);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('Productivity Analytics Report', leftMargin, 32);

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

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('Focus Time Summary', leftMargin, yPos);
    yPos += 12;

    doc.setFontSize(10);
    const focusData = [
      ['Period', 'Focus Time'],
      ['Today', formatTime(data.stats.todayFocusTime)],
      ['This Week', formatTime(data.stats.weekFocusTime)],
      ['All Time', formatTime(data.stats.totalFocusTime)],
    ];

    const colWidth = 50;
    focusData.forEach((row, i) => {
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

    yPos += 10;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('Completed Tasks Summary', leftMargin, yPos);
    yPos += 12;

    doc.setFontSize(10);
    const tasksData = [
      ['Period', 'Tasks Completed'],
      ['Today', `${data.stats.todayCompletedTasks} tasks`],
      ['This Week', `${data.stats.weekCompletedTasks} tasks`],
      ['All Time', `${data.stats.totalCompletedTasks} tasks`],
    ];

    tasksData.forEach((row, i) => {
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

    if (data.projects.length > 0) {
      if (yPos > pageHeight - 80) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(99, 102, 241);
      doc.text('Project Time Distribution', leftMargin, yPos);
      yPos += 12;

      doc.setFontSize(10);
      const projectHeaders = ['Project', 'Daily', 'Weekly', 'Monthly'];
      const projectColWidths = [75, 25, 25, 25];
      
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(243, 244, 246);
      doc.rect(leftMargin, yPos - 6, projectColWidths.reduce((a, b) => a + b), 9, 'F');
      doc.setTextColor(0, 0, 0);
      
      let xPos = leftMargin;
      projectHeaders.forEach((header, i) => {
        doc.text(header, xPos + 3, yPos);
        xPos += projectColWidths[i];
      });
      yPos += 9;

      doc.setFont('helvetica', 'normal');
      data.projects.forEach((project, idx) => {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = 20;
        }

        if (idx % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(leftMargin, yPos - 6, projectColWidths.reduce((a, b) => a + b), 9, 'F');
        }

        xPos = leftMargin;
        const projectName = project.name.length > 28 
          ? project.name.substring(0, 25) + '...' 
          : project.name;
        
        doc.text(projectName, xPos + 3, yPos);
        doc.text(`${project.daily.toFixed(1)}h`, xPos + projectColWidths[0] + 3, yPos);
        doc.text(`${project.weekly.toFixed(1)}h`, xPos + projectColWidths[0] + projectColWidths[1] + 3, yPos);
        doc.text(`${project.monthly.toFixed(1)}h`, xPos + projectColWidths[0] + projectColWidths[1] + projectColWidths[2] + 3, yPos);
        yPos += 9;
      });

      yPos += 12;
    }

    if (data.focusGoal) {
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(99, 102, 241);
      doc.text('Focus Goal Progress', leftMargin, yPos);
      yPos += 12;

      doc.setFontSize(10);
      const goalData = [
        ['Metric', 'Value'],
        ['Total Focus Days', `${data.focusGoal.totalDays} days`],
        ['Completed Goal Days', `${data.focusGoal.completedDays} days`],
        ['Completion Rate', `${data.focusGoal.rate.toFixed(0)}%`],
      ];

      goalData.forEach((row, i) => {
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
    }

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

    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`vaidehi-report-${timestamp}.pdf`);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}

// ============================================
// ✅ HIGH QUALITY UPGRADE:
// ============================================
/*
CHANGES MADE:
1. Line 84-89: Doubled canvas dimensions (width/height * 2)
2. Line 88: Added scale(2) transform for 2x resolution
3. Line 119-154: Scaled all watermark text by 2x
   - App name: 24px → 48px
   - Username: 17px → 34px  
   - Date: 17px → 34px
   - Time: 15px → 30px
4. Line 96: Watermark height: 80px → 160px

RESULT: Crystal clear 2x resolution screenshots!
*/