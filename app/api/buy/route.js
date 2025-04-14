import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from 'next/server';

export async function POST(req) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ message: "User ID not found" }, { status: 400 });
  }

  try {
    const {
      wallet_id,
      symbol,
      crypto_amount,
      name,
      network
    } = await req.json();

    const db = await connectToDatabase();

    console.log("Calling buy_crypto procedure with:", {
      user_id: userId,
      wallet_id,
      symbol,
      crypto_amount,
      name,
      network
    });

    await db.execute("CALL buy_crypto(?, ?, ?, ?, ?, ?)", [
      userId,
      wallet_id,
      symbol,
      crypto_amount,
      name,
      network
    ]);

    return NextResponse.json({ message: "Crypto bought successfully" });
  } catch (error) {
    console.error("Buy API error:", error);
    return NextResponse.json({ error: error.message || "Failed to buy" }, { status: 500 });
  }
}
