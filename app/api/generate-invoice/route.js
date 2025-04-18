import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { parse } from "cookie";

export async function GET(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = parse(cookieHeader);
    const userId = cookies.userId;

    if (!userId) {
      return NextResponse.json({ message: "User ID not found" }, { status: 400 });
    }

    const db = await connectToDatabase();

    const [transactions] = await db.execute(
      `SELECT 
        tnx_id,
        crypto,
        tnx_amount,
        tnx_type,
        network,
        rec_sender_wallet_id,
        rec_recipient_wallet_id,
        tra_sender_wallet_id,
        tra_recipient_wallet_id
      FROM transactions
      WHERE user_id = ?
      ORDER BY tnx_id DESC`,
      [userId]
    );

    return NextResponse.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
