import { getQuote } from "./yahoo";

export async function getLivePrice(
  symbol: string
) {

  try {

    const quote =
      await getQuote(symbol);

    return Number(
      quote?.regularMarketPrice || 0
    );

  } catch (error) {

    console.error(error);

    return 0;
  }
}