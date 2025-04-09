import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized User" }, { status: 401 });
  }

  try {
    const { network, fromToken, toToken, amount } = await req.json();

    const connection = await connectToDatabase();

    const [[wallet]] = await connection.execute(
      "SELECT wallet_id FROM wallets WHERE user_id = ? AND crypto_type = ?",
      [userId, fromToken]
    );

    if (!wallet) {
      await connection.end();
      return NextResponse.json({ message: "Wallet not found" }, { status: 404 });
    }

    const [result] = await connection.execute(
      `INSERT INTO transactions 
        (user_id, sender_wallet_id, from_currency, to_currency, from_amount) 
        VALUES (?, ?, ?, ?, ?)`,
      [userId, wallet.wallet_id, fromToken, toToken, amount]
    );

    const [[{ to_amount }]] = await connection.execute(
      "SELECT to_amount FROM transactions WHERE transaction_id = ?",
      [result.insertId]
    );

    await connection.end();

    return NextResponse.json({ convertedAmount: to_amount });
  } catch (error) {
    console.error("Swap error:", error);
    return NextResponse.json({ message: "Swap failed" }, { status: 500 });
  }
}
