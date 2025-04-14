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

    // Fetch the asset_id for the 'fromToken'
    const [[fromAsset]] = await connection.execute(
      "SELECT asset_id FROM crypto_assets WHERE symbol = ?",
      [fromToken]
    );

    // Fetch the asset_id for the 'toToken'
    const [[toAsset]] = await connection.execute(
      "SELECT asset_id FROM crypto_assets WHERE symbol = ?",
      [toToken]
    );

    if (!fromAsset || !toAsset) {
      await connection.end();
      return NextResponse.json({ message: "Asset not found" }, { status: 404 });
    }

    // Call the stored procedure to perform the swap
    await connection.execute("CALL swap_assets(?, ?, ?, ?, ?)", [
      userId,
      fromAsset.asset_id,
      toAsset.asset_id,
      parseFloat(amount),
      network
    ]);

    await connection.end();

    return NextResponse.json({ message: "Swap completed successfully" });
  } catch (error) {
    console.error("Swap error:", error);
    return NextResponse.json({ message: error.message || "Swap failed" }, { status: 500 });
  }
}
