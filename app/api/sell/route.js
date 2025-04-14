import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from 'next/server';

export async function POST(req) {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ message: "User ID not found" }, { status: 400 });
  }

  try {
    const {
      wallet_id,
      symbol,
      crypto_amount,
      network
    } = await req.json()

    const db = await connectToDatabase()

    console.log("Calling SellCrypto procedure with:", {
      user_id: userId,
      wallet_id,
      symbol,
      crypto_amount,
      network
    });

    await db.execute("CALL sell_crypto(?, ?, ?, ?, ?)", [
      userId,
      wallet_id,
      symbol,
      crypto_amount,
      network
    ]);

    return NextResponse.json({ message: "Crypto sold successfully" })
  } catch (error) {
    console.error("Sell API error:", error)
    return NextResponse.json({ error: error.message || "Failed to sell" }, { status: 500 })
  }
}
