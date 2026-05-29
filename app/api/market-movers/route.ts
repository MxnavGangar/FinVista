import { NextResponse } from "next/server";
import { getQuote } from "@/lib/yahoo";

type AssetType = "stock" | "crypto";

type CuratedAsset = {
  name: string;
  symbol: string;
  type: AssetType;
};

const curatedAssets: CuratedAsset[] = [
  {
    name: "Reliance Industries",
    symbol: "RELIANCE.NS",
    type: "stock",
  },

  {
    name: "Tata Consultancy Services",
    symbol: "TCS.NS",
    type: "stock",
  },

  {
    name: "Infosys",
    symbol: "INFY.NS",
    type: "stock",
  },

  {
    name: "HDFC Bank",
    symbol: "HDFCBANK.NS",
    type: "stock",
  },

  {
    name: "ICICI Bank",
    symbol: "ICICIBANK.NS",
    type: "stock",
  },

  {
    name: "State Bank of India",
    symbol: "SBIN.NS",
    type: "stock",
  },

  {
    name: "Bitcoin",
    symbol: "BTC-USD",
    type: "crypto",
  },

  {
    name: "Ethereum",
    symbol: "ETH-USD",
    type: "crypto",
  },

  {
    name: "Solana",
    symbol: "SOL-USD",
    type: "crypto",
  },

  {
    name: "XRP",
    symbol: "XRP-USD",
    type: "crypto",
  },

  {
    name: "Cardano",
    symbol: "ADA-USD",
    type: "crypto",
  },
];

export async function GET() {

  try {

    const assets = await Promise.all(

      curatedAssets.map(async (asset) => {

        const quote =
          await getQuote(asset.symbol);

        return {
          name: asset.name,

          symbol: asset.symbol,

          type: asset.type,

          price:
            Number(
              quote?.regularMarketPrice || 0
            ),

          percentChange:
            Number(
              quote?.regularMarketChangePercent || 0
            ),

          change:
            Number(
              quote?.regularMarketChange || 0
            ),

          currency:
            asset.type === "crypto"
              ? "USD"
              : "INR",
        };
      })
    );

    return NextResponse.json({
      assets,
      updatedAt: new Date().toISOString(),
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch market movers",
      },
      {
        status: 500,
      }
    );
  }
}