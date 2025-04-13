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

    // Get all wallets for the user
    const [wallets] = await db.query(
      "SELECT wallet_id, balance FROM wallets WHERE user_id = ?",
      [userId]
    );

    for (const wallet of wallets) {
      const walletId = wallet.wallet_id;

      // Calculate total asset amount for this wallet
      const [sumResult] = await db.query(
        "SELECT SUM(asset_amount) AS asset_sum FROM crypto_assets WHERE wallet_id = ?",
        [walletId]
      );

      const assetSum = parseFloat(sumResult[0].asset_sum || 0);
      const storedBalance = parseFloat(wallet.balance || 0);

      // Update balance if mismatch
      if (assetSum !== storedBalance) {
        await db.query(
          "UPDATE wallets SET balance = ? WHERE wallet_id = ?",
          [assetSum, walletId]
        );
      }
    }

    return NextResponse.json({ message: "Wallet balances synced successfully" }, { status: 200 });

  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ message: "Error syncing balances", error: error.message }, { status: 500 });
  }
}
