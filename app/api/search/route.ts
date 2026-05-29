import yahooFinance from "yahoo-finance2";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  try {

    const { searchParams } =
      new URL(req.url);

    const query =
      searchParams.get("query");

    if (!query) {
      return NextResponse.json([]);
    }

    const result =
      await yahooFinance.search(query);

    return NextResponse.json(
      result.quotes || []
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      [],
      { status: 500 }
    );
  }
}