// src/app/api/zerodha/import/route.ts
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import Papa from "papaparse";

/**
 * Robust parse for numeric strings like "₹ 1,234.50", "-1,234.50", "—" into numbers
 */
function parseNumber(s: any) {
  if (s == null || s === "") return 0;
  const cleaned = String(s).replace(/[₹, ]+/g, "").replace(/—/g, "0").trim();
  const num = Number(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

/**
 * Convert an array of td texts into a trade object (best-effort).
 */
function rowToTrade(cols: string[]) {
  const c = cols.map((x) => (x ? x.trim() : ""));

  const trade_date = c[0] || "";
  const symbol = c[1] || "";
  const trade_type = c[2] || "";
  const segment = c[3] || "";

  // pick numeric-like tokens and parse them
  const numericCols = c.filter((v) => /[\d₹\-\—.,]/.test(v));
  const numericParsed = numericCols.map((v) => parseNumber(v));

  let quantity = 0;
  let buy_value = 0;
  let sell_value = 0;
  let gross_pnl = 0;
  let net_pnl = 0;

  if (numericParsed.length >= 1) net_pnl = numericParsed[numericParsed.length - 1];
  if (numericParsed.length >= 2) gross_pnl = numericParsed[numericParsed.length - 2];
  if (numericParsed.length >= 3) sell_value = numericParsed[numericParsed.length - 3];
  if (numericParsed.length >= 4) buy_value = numericParsed[numericParsed.length - 4];

  // try to detect integer quantity from any token
  for (const token of c) {
    const cleaned = token.replace(/,/g, "");
    if (/^\d+$/.test(cleaned)) {
      quantity = parseInt(cleaned, 10);
      break;
    }
  }

  return {
    trade_date,
    symbol,
    trade_type,
    segment,
    quantity,
    buy_value,
    sell_value,
    gross_pnl,
    charges: 0,
    net_pnl,
    raw: cols,
  };
}

/**
 * Map a CSV row (object) to a trade using common header names
 */
function csvRowToTrade(rowObj: Record<string, any>) {
  // normalize common header names (best-effort)
  const get = (keys: string[]) =>
    keys.map((k) => rowObj[k] ?? rowObj[k.toLowerCase()] ?? rowObj[k.toUpperCase()]).find((v) => v !== undefined);

  const trade_date = get(["Date", "Trade Date", "trade_date", "date"]) || "";
  const symbol = get(["Script", "Symbol", "Instrument", "script"]) || "";
  const qtyRaw = get(["Qty", "Quantity", "qty", "quantity"]) || "0";
  const quantity = parseInt(String(qtyRaw).replace(/,/g, ""), 10) || 0;
  const grossRaw = get(["Realized P&L", "Realised P&L", "Gross P&L", "P&L", "Net P&L"]) || "0";
  const netRaw = get(["Net P&L", "Net PnL", "NetProfit", "Net P&L"]) || grossRaw || "0";
  const buyVal = get(["Buy value", "Buy Value", "Buy_Value"]) || "0";
  const sellVal = get(["Sell value", "Sell Value", "Sell_Value"]) || "0";

  const gross_pnl = parseNumber(grossRaw);
  const net_pnl = parseNumber(netRaw);
  const buy_value = parseNumber(buyVal);
  const sell_value = parseNumber(sellVal);

  return {
    trade_date: String(trade_date),
    symbol: String(symbol),
    trade_type: "",
    segment: "",
    quantity,
    buy_value,
    sell_value,
    gross_pnl,
    charges: 0,
    net_pnl,
    raw: rowObj,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const url = (body?.url as string | undefined) || undefined;
    const csvText = (body?.csv as string | undefined) || undefined;
    const htmlText = (body?.html as string | undefined) || undefined;

    if (!url && !csvText && !htmlText) {
      return NextResponse.json({ error: "No url or csv/html provided" }, { status: 400 });
    }

    let text = "";
    let contentType = "";

    if (csvText) {
      text = csvText;
      contentType = "text/csv";
    } else if (htmlText) {
      text = htmlText;
      contentType = "text/html";
    } else {
      // try fetching the URL server-side (with better headers)
      const res = await fetch(url!, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Vaidehi/1.0)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-IN,en;q=0.9",
          Referer: "https://console.zerodha.com/",
        },
      });

      contentType = (res.headers.get("content-type") || "").toLowerCase();
      text = await res.text();

      if (!res.ok) {
        // return helpful debug so you can see what Zerodha returned (status, headers, snippet)
        return NextResponse.json(
          {
            error: `Failed to fetch URL (status ${res.status})`,
            debug: {
              status: res.status,
              contentType,
              headers: Object.fromEntries(res.headers.entries ? res.headers.entries() : []),
              snippet: text.slice(0, 2000),
            },
          },
          { status: 502 }
        );
      }
    }

    // If the content looks like CSV (by header or content), parse CSV
    const firstLine = text.split(/\r?\n/)[0] || "";
    const looksLikeCSV = contentType.includes("csv") || (firstLine && firstLine.includes(",") && firstLine.toLowerCase().includes("script"));

    if (looksLikeCSV) {
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
      if (parsed.errors && parsed.errors.length) {
        // but still try to map rows
      }
      const rows = (parsed.data as any[]).map(csvRowToTrade);
      return NextResponse.json({ financial_year: "Imported CSV", trades: rows, debug: { rows_parsed: rows.length } });
    }

    // Otherwise assume HTML -> parse with cheerio
    const $ = cheerio.load(text);

    // Find candidate table: prefer headers mentioning P&L
    let chosenTable: any = null;
    $("table").each((i, table) => {
      try {
        const headings = $(table)
          .find("thead th")
          .toArray()
          .map((th) => $(th).text().trim().toLowerCase());
        const headerText = headings.join(" ");
        if (
          headerText.includes("realized") ||
          headerText.includes("net pnl") ||
          headerText.includes("realised") ||
          headerText.includes("p&l") ||
          headerText.includes("netprofit") ||
          headerText.includes("net")
        ) {
          chosenTable = table;
          return false;
        }
      } catch {
        // ignore
      }
    });

    // fallback: first table with rows
    if (!chosenTable) {
      $("table").each((i, table) => {
        const rowsCount = $(table).find("tbody tr").length;
        if (rowsCount >= 1) {
          chosenTable = table;
          return false;
        }
      });
    }

    if (!chosenTable) {
      // no table found — return debug info so you can inspect the returned HTML
      return NextResponse.json(
        {
          error: "No table found in page",
          debug: {
            contentType,
            snippet: text.slice(0, 2000),
            hint: "If Zerodha protects the verified page, the server may return a login/blocked page. Consider downloading the verified report (CSV/HTML) and pasting it into the CSV field, or uploading the file.",
          },
        },
        { status: 422 }
      );
    }

    // parse rows
    const tbodyRows = $(chosenTable).find("tbody tr").toArray();
    const rows: any[] = [];

    for (const tr of tbodyRows) {
      const cols = $(tr)
        .find("td")
        .toArray()
        .map((td) => $(td).text().trim());
      if (cols.length === 0) continue;
      rows.push(rowToTrade(cols));
    }

    const debug = {
      tables_found: $("table").length,
      rows_found: rows.length,
    };

    // try to detect financial year text if present
    let fyCandidate = $("*")
      .toArray()
      .map((el) => $(el).text())
      .find((t) => /\d{4}-\d{4}/.test(String(t)));

    if (!fyCandidate) fyCandidate = $("h1, h2, h3, span, p").first().text().trim() || "Unknown FY";

    return NextResponse.json({ financial_year: String(fyCandidate), trades: rows, debug });
  } catch (err: any) {
    return NextResponse.json({ error: "Parsing failed", message: String(err) }, { status: 500 });
  }
}
