import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectToDatabase();

    
    const [wallets] = await db.query(
      "SELECT wallet_id FROM wallets WHERE user_id = ?",
      [userId]
    );


    if (wallets.length === 0) {
      return NextResponse.json({ message: "No wallets found for the user" }, { status: 404 });
    }


    return NextResponse.json({ message: "Wallet balances are synced via trigger" }, { status: 200 });

  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ message: "Error syncing balances", error: error.message }, { status: 500 });
  }
}
