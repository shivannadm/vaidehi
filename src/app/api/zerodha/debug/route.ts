// src/app/api/zerodha/debug/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || !url.includes('console.zerodha.com/verified/')) {
      return NextResponse.json(
        { error: 'Invalid Zerodha verified link' },
        { status: 400 }
      );
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    
    // Load cheerio
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);

    // Debug: Extract various elements
    const debug = {
      title: $('title').text(),
      h1: $('h1').text(),
      h2: $('h2').text(),
      tables_count: $('table').length,
      table_classes: $('table').map((i, el) => $(el).attr('class')).get(),
      all_classes: $('[class]').map((i, el) => $(el).attr('class')).get().slice(0, 50),
      first_table_html: $('table').first().html()?.substring(0, 500),
      body_text_preview: $('body').text().substring(0, 500),
      all_tables: $('table').map((i, el) => {
        const rows = $(el).find('tr');
        return {
          index: i,
          rows: rows.length,
          first_row: rows.first().text(),
          headers: rows.first().find('th, td').map((j, th) => $(th).text()).get(),
        };
      }).get(),
    };

    return NextResponse.json({
      success: true,
      debug,
      html_length: html.length,
      html_preview: html.substring(0, 1000),
    });

  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}