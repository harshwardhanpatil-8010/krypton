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

    // Get all wallets for this user
    const [wallets] = await db.query(
      "SELECT wallet_id FROM wallets WHERE user_id = ?",
      [userId]
    );

    // No wallets found for the user
    if (wallets.length === 0) {
      return NextResponse.json({ message: "No wallets found for the user" }, { status: 404 });
    }

    // Optionally, you can check asset values, but syncing is now handled by the trigger.
    // Since the trigger is in place, we don't need to manually update the wallet balances here.

    return NextResponse.json({ message: "Wallet balances are synced via trigger" }, { status: 200 });

  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ message: "Error syncing balances", error: error.message }, { status: 500 });
  }
}
