// src/app/api/zerodha/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';

type CheerioAPI = ReturnType<typeof load>;

interface TradeRow {
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

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || !url.includes('console.zerodha.com/verified/')) {
      return NextResponse.json(
        { error: 'Invalid Zerodha verified link' },
        { status: 400 }
      );
    }

    // Fetch the verified P&L page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Zerodha data' },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = load(html);

    // Extract financial year
    const financialYear = extractFinancialYear($);

    // Extract trades from the page
    const trades = extractTrades($);

    if (trades.length === 0) {
      return NextResponse.json(
        { error: 'No trades found in the verified P&L' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      financial_year: financialYear,
      trades,
      total_trades: trades.length,
    });

  } catch (error: any) {
    console.error('Zerodha import error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process Zerodha data' },
      { status: 500 }
    );
  }
}

// Extract financial year from the page
function extractFinancialYear($: CheerioAPI): string {
  // Try multiple selectors
  const yearText = $('.financial-year').text() ||
                   $('h1').text() ||
                   $('h2').text() ||
                   '';
  
  const match = yearText.match(/FY\s*(\d{4})-(\d{2,4})/i) ||
                yearText.match(/(\d{4})-(\d{2,4})/);
  
  if (match) {
    return `FY ${match[1]}-${match[2]}`;
  }
  
  return 'FY 2024-25';
}

// Extract trades from HTML table
function extractTrades($: CheerioAPI): TradeRow[] {
  const trades: TradeRow[] = [];
  
  // Find the trades table - try multiple selectors
  const tableSelectors = [
    'table.trades-table',
    'table.pnl-table',
    '.trades-container table',
    'table tbody tr',
  ];

  let $rows: ReturnType<typeof $> | null = null;

  for (const selector of tableSelectors) {
    const found = $(selector);
    if (found.length > 0) {
      $rows = found;
      break;
    }
  }

  if (!$rows) {
    // Fallback: try to find any table with trade data
    $rows = $('table tr').filter((i, el) => {
      const text = $(el).text().toLowerCase();
      return text.includes('symbol') || text.includes('trade') || text.includes('pnl');
    });
  }

  // Parse each row
  $rows.each((index, row) => {
    const $cells = $(row).find('td');
    
    if ($cells.length < 8) return; // Skip header or invalid rows

    const trade: TradeRow = {
      trade_date: cleanText($cells.eq(0).text()),
      symbol: cleanText($cells.eq(1).text()),
      trade_type: cleanText($cells.eq(2).text()),
      segment: cleanText($cells.eq(3).text()),
      quantity: parseNumber($cells.eq(4).text()),
      buy_value: parseNumber($cells.eq(5).text()),
      sell_value: parseNumber($cells.eq(6).text()),
      gross_pnl: parseNumber($cells.eq(7).text()),
      charges: parseNumber($cells.eq(8).text()),
      net_pnl: parseNumber($cells.eq(9).text()),
    };

    // Validate trade has required data
    if (trade.symbol && trade.trade_date) {
      trades.push(trade);
    }
  });

  // If no trades found through tables, try alternative structure
  if (trades.length === 0) {
    trades.push(...extractTradesAlternative($));
  }

  return trades;
}

// Alternative extraction method for different HTML structures
function extractTradesAlternative($: CheerioAPI): TradeRow[] {
  const trades: TradeRow[] = [];
  
  // Look for trade cards or divs
  $('.trade-item, .trade-card, .pnl-row').each((i, el) => {
    const $el = $(el);
    
    const trade: TradeRow = {
      trade_date: cleanText($el.find('.date, .trade-date').text()),
      symbol: cleanText($el.find('.symbol, .stock-name').text()),
      trade_type: cleanText($el.find('.type, .trade-type').text()),
      segment: cleanText($el.find('.segment').text()),
      quantity: parseNumber($el.find('.quantity, .qty').text()),
      buy_value: parseNumber($el.find('.buy, .buy-value').text()),
      sell_value: parseNumber($el.find('.sell, .sell-value').text()),
      gross_pnl: parseNumber($el.find('.gross-pnl, .gross').text()),
      charges: parseNumber($el.find('.charges, .fees').text()),
      net_pnl: parseNumber($el.find('.net-pnl, .net').text()),
    };

    if (trade.symbol) {
      trades.push(trade);
    }
  });

  return trades;
}

// Helper: Clean text
function cleanText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

// Helper: Parse number from string
function parseNumber(text: string): number {
  const cleaned = text.replace(/[₹,\s]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}