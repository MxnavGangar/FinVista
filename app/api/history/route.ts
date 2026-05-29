import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(req: Request) {

  try {

    const { searchParams } =
      new URL(req.url);

    const symbol =
      searchParams.get("symbol");

    const range =
      searchParams.get("range") || "1mo";

    if (!symbol) {

      return NextResponse.json(
        { error: "Missing symbol" },
        { status: 400 }
      );
    }

    const result =
      await yahooFinance.chart(symbol, {
        period1: getPeriod(range),
        interval: getInterval(range),
      });

    const formatted =
      result.quotes.map((item) => ({
        date: item.date,
        close: item.close || 0,
      }));

    return NextResponse.json(formatted);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed history fetch" },
      { status: 500 }
    );
  }
}

function getPeriod(range: string) {

  const now = new Date();

  switch (range) {

    case "1d":
      return new Date(
        now.getTime() - 1 * 24 * 60 * 60 * 1000
      );

    case "1w":
      return new Date(
        now.getTime() - 7 * 24 * 60 * 60 * 1000
      );

    case "1m":
      return new Date(
        now.getTime() - 30 * 24 * 60 * 60 * 1000
      );

    case "1y":
      return new Date(
        now.getTime() - 365 * 24 * 60 * 60 * 1000
      );

    default:
      return new Date(
        now.getTime() - 30 * 24 * 60 * 60 * 1000
      );
  }
}

function getInterval(range: string) {

  switch (range) {

    case "1d":
      return "5m";

    case "1w":
      return "1h";

    case "1m":
      return "1d";

    case "1y":
      return "1wk";

    default:
      return "1d";
  }
}