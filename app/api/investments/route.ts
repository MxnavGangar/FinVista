import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongodb";
import Investment from "@/models/Investment";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const investments = await Investment.find({
      userId: session.user.id,
    });

    return NextResponse.json(investments);

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const investment = await Investment.create({
      userId: session.user.id,

      assetName: body.assetName,
      symbol: body.symbol,
      type: body.type,
      quantity: body.quantity,
      buyPrice: body.buyPrice,
    });

    return NextResponse.json(investment, {
      status: 201,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}