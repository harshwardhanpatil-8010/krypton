import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectToDatabase();
    const [userDetails] = await db.query("SELECT username, user_id, email FROM users WHERE user_id = ?", [userId]);
    const [transactions] = await db.query("SELECT * FROM transactions WHERE user_id = ?", [userId]);
    const [wallets] = await db.query("SELECT * FROM wallets WHERE user_id = ?", [userId]);
    const [crypto_assets] = await db.query("SELECT * FROM crypto_assets WHERE user_id = ?", [userId]);
    return NextResponse.json({
      user: userDetails[0],
      transactions,
      wallets: wallets[0] || null,
      crypto_assets: crypto_assets || [],
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Error fetching data", error: error.message }, { status: 500 });
  }
}
