import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

const cache: Record<
  string,
  {
    data: any;
    timestamp: number;
  }
> = {};

const CACHE_DURATION = 60 * 1000;

export async function getQuote(symbol: string) {

  const now = Date.now();

  const cached = cache[symbol];

  if (
    cached &&
    now - cached.timestamp < CACHE_DURATION
  ) {
    return cached.data;
  }

  try {

    const quote =
      await yahooFinance.quote(symbol);

    cache[symbol] = {
      data: quote,
      timestamp: now,
    };

    return quote;

  } catch (error) {

    console.error(
      `Failed quote for ${symbol}`,
      error
    );

    return null;
  }
}