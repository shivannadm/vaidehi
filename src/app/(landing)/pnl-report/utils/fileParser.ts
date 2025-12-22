// src/app/(landing)/pnl-report/utils/fileParser.ts

import * as XLSX from 'xlsx';

export interface Trade {
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

/**
 * Parse Zerodha P&L Excel file
 */
export function parseExcelPnL(workbook: XLSX.WorkBook): Trade[] {
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const trades: Trade[] = [];
  let startIndex = -1;
  let totalCharges = 0;

  // Find "Charges" section first
  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row[0] === 'Charges') {
      // Sum up all charges
      for (let j = i + 2; j < jsonData.length && jsonData[j][0]; j++) {
        const value = parseFloat(jsonData[j][1]);
        if (!isNaN(value)) {
          totalCharges += value;
        }
      }
      break;
    }
  }

  // Find P&L table starting with "Symbol"
  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row[0] && String(row[0]).toLowerCase() === 'symbol') {
      startIndex = i;
      break;
    }
  }

  if (startIndex === -1) {
    throw new Error('Could not find P&L data in Excel file');
  }

  // Parse trades
  for (let i = startIndex + 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || !row[0]) break;

    const symbol = String(row[0]).trim();
    if (!symbol) break;

    const quantity = parseFloat(row[2]) || 0;
    const buyValue = parseFloat(row[3]) || 0;
    const sellValue = parseFloat(row[4]) || 0;
    const realizedPnL = parseFloat(row[5]) || 0;

    if (realizedPnL !== 0) {
      // Distribute charges proportionally
      const tradeCharges = totalCharges > 0 
        ? (Math.abs(realizedPnL) / trades.reduce((sum, t) => sum + Math.abs(t.gross_pnl), Math.abs(realizedPnL))) * totalCharges 
        : Math.abs(realizedPnL) * 0.001;

      trades.push({
        trade_date: new Date().toISOString().split('T')[0],
        symbol,
        trade_type: 'equity',
        segment: 'EQ',
        quantity,
        buy_value: buyValue,
        sell_value: sellValue,
        gross_pnl: realizedPnL,
        charges: tradeCharges,
        net_pnl: realizedPnL - tradeCharges,
      });
    }
  }

  // Recalculate net charges distribution
  if (totalCharges > 0 && trades.length > 0) {
    const totalGrossPnL = trades.reduce((sum, t) => sum + Math.abs(t.gross_pnl), 0);
    trades.forEach(trade => {
      trade.charges = (Math.abs(trade.gross_pnl) / totalGrossPnL) * totalCharges;
      trade.net_pnl = trade.gross_pnl - trade.charges;
    });
  }

  return trades;
}

/**
 * Parse CSV P&L file
 */
export function parseCSVPnL(text: string): Trade[] {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length === 0) throw new Error('Empty CSV file');

  const trades: Trade[] = [];
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));

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
    throw new Error('Could not find required columns in CSV');
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
}

/**
 * Parse CSV line handling quotes
 */
function parseCSVLine(line: string): string[] {
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
}