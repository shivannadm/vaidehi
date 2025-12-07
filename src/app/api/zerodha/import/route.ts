// src/app/api/zerodha/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || !url.includes('console.zerodha.com/verified/')) {
      return NextResponse.json(
        { error: 'Invalid Zerodha verified link' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching Zerodha page:', url);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      console.error('❌ Fetch failed:', response.status);
      return NextResponse.json(
        { error: `Failed to fetch page: ${response.status}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    console.log('✅ HTML received, length:', html.length);

    // Log first 1000 characters to see structure
    console.log('📄 HTML Preview:', html.substring(0, 1000));

    const $ = cheerio.load(html);

    // Declare financialYear at the top
    let financialYear = 'FY 2023-24';

    // Extract financial year from anywhere in the page
    const pageText = $('body').text();
    const fyMatch = pageText.match(/FY\s*(\d{4})-(\d{2,4})/i) || pageText.match(/(\d{4})-(\d{2,4})/);
    if (fyMatch) {
      financialYear = `FY ${fyMatch[1]}-${fyMatch[2]}`;
    }

    // First, try to find JSON data in script tags
    let jsonData: any = null;
    
    $('script').each((i, elem) => {
      const scriptContent = $(elem).html() || '';
      
      // Look for JSON data assignments
      const patterns = [
        /var\s+\w+\s*=\s*(\{[\s\S]*?\});/g,
        /const\s+\w+\s*=\s*(\{[\s\S]*?\});/g,
        /window\.\w+\s*=\s*(\{[\s\S]*?\});/g,
        /"trades"\s*:\s*(\[[\s\S]*?\])/g,
      ];

      for (const pattern of patterns) {
        const matches = scriptContent.match(pattern);
        if (matches) {
          for (const match of matches) {
            try {
              // Extract just the JSON part
              const jsonMatch = match.match(/=\s*(\{[\s\S]*\}|\[[\s\S]*\]);?/);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[1].replace(/;$/, ''));
                if (parsed && (parsed.trades || Array.isArray(parsed))) {
                  jsonData = parsed;
                  console.log('✅ Found JSON data in script!');
                  return false; // Break the loop
                }
              }
            } catch (e) {
              // Continue
            }
          }
        }
      }
    });

    // If we found JSON data, use it
    if (jsonData) {
      const trades = Array.isArray(jsonData) ? jsonData : (jsonData.trades || []);
      if (trades.length > 0) {
        console.log(`✅ Extracted ${trades.length} trades from JSON`);
        return NextResponse.json({
          financial_year: jsonData.financial_year || financialYear,
          trades: trades.map((t: any) => ({
            trade_date: t.trade_date || t.date || '',
            symbol: t.symbol || '',
            trade_type: t.trade_type || t.type || 'buy',
            segment: t.segment || 'EQ',
            quantity: parseFloat(t.quantity || 0),
            buy_value: parseFloat(t.buy_value || t.buy || 0),
            sell_value: parseFloat(t.sell_value || t.sell || 0),
            gross_pnl: parseFloat(t.gross_pnl || t.pnl || 0),
            charges: parseFloat(t.charges || t.fees || 0),
            net_pnl: parseFloat(t.net_pnl || (t.pnl - t.charges) || 0),
          })),
        });
      }
    }

    // Debug: Log all table structures
    console.log('📊 Tables found:', $('table').length);

    const trades: any[] = [];

    // Try to find the table - Zerodha uses different selectors
    const possibleTables = [
      'table',
      '.table',
      '#tradebook',
      '[class*="table"]',
      'table.table',
    ];

    let foundTable = false;

    for (const selector of possibleTables) {
      const $table = $(selector);
      
      if ($table.length > 0) {
        console.log(`🎯 Trying selector: ${selector}, found ${$table.length} tables`);
        
        $table.each((tableIndex, tableElem) => {
          // Get all rows (both tbody tr and direct tr)
          const $rows = $(tableElem).find('tr');
          
          console.log(`  📋 Table ${tableIndex + 1}: ${$rows.length} rows`);
          
          $rows.each((rowIndex, row) => {
            const $cells = $(row).find('td');
            
            // Skip if not enough cells or if it's a header row
            if ($cells.length < 8) return;
            
            const cellTexts = $cells.map((i, cell) => $(cell).text().trim()).get();
            
            // Skip header rows
            const firstCell = cellTexts[0].toLowerCase();
            if (firstCell.includes('date') || firstCell.includes('symbol') || firstCell.includes('trade')) {
              return;
            }

            // Parse trade data - adjust indices based on Zerodha's actual format
            try {
              const trade = {
                trade_date: cellTexts[0] || '',
                symbol: cellTexts[1] || '',
                trade_type: cellTexts[2] || 'buy',
                segment: cellTexts[3] || 'EQ',
                quantity: parseFloat((cellTexts[4] || '0').replace(/,/g, '')) || 0,
                buy_value: parseFloat((cellTexts[5] || '0').replace(/[₹,\s]/g, '')) || 0,
                sell_value: parseFloat((cellTexts[6] || '0').replace(/[₹,\s]/g, '')) || 0,
                gross_pnl: parseFloat((cellTexts[7] || '0').replace(/[₹,\s]/g, '')) || 0,
                charges: parseFloat((cellTexts[8] || '0').replace(/[₹,\s]/g, '')) || 0,
                net_pnl: 0,
              };

              trade.net_pnl = trade.gross_pnl - trade.charges;

              // Only add if we have a valid symbol
              if (trade.symbol && trade.symbol.length > 0 && !trade.symbol.toLowerCase().includes('symbol')) {
                trades.push(trade);
                foundTable = true;
                console.log(`  ✅ Parsed trade: ${trade.symbol} - ₹${trade.net_pnl}`);
              }
            } catch (e) {
              console.log(`  ⚠️ Failed to parse row ${rowIndex}:`, e);
            }
          });
        });
      }
    }

    if (!foundTable || trades.length === 0) {
      // Debug output
      console.log('❌ No trades found. Page structure:');
      console.log('Tables:', $('table').length);
      console.log('First 50 rows:', $('tr').slice(0, 50).length);
      
      // Return HTML snippet for debugging
      const tableHTML = $('table').first().html() || 'No table found';
      
      return NextResponse.json(
        { 
          error: 'No trades found in the page',
          debug: {
            tables_found: $('table').length,
            rows_found: $('tr').length,
            financial_year: financialYear,
            sample_html: tableHTML.substring(0, 500),
          }
        },
        { status: 404 }
      );
    }

    console.log(`✅ Successfully extracted ${trades.length} trades`);

    return NextResponse.json({
      financial_year: financialYear,
      trades: trades,
      summary: {
        total_trades: trades.length,
        total_pnl: trades.reduce((sum, t) => sum + t.net_pnl, 0),
      }
    });

  } catch (error: any) {
    console.error('💥 Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to extract data' },
      { status: 500 }
    );
  }
}