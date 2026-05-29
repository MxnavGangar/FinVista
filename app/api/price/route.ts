import { NextResponse } from "next/server";
import { getLivePrice } from "@/lib/marketData";

export async function GET(req: Request) {

  try {

    const { searchParams } =
      new URL(req.url);

    const symbol =
      searchParams.get("symbol");

    if (!symbol) {

      return NextResponse.json(
        { error: "Missing symbol" },
        { status: 400 }
      );
    }

    const price =
      await getLivePrice(symbol);

    return NextResponse.json({
      price,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}