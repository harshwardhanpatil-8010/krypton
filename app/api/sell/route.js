import { connectToDatabase } from "@/lib/db"

export async function POST(req) {
  try {
    const {
      user_id,
      wallet_id,
      asset_id,
      crypto_amount,
      rate,
      payment_method
    } = await req.json()

    const db = await connectToDatabase()

    console.log("Calling SellCrypto procedure with:", {
      user_id,
      wallet_id,
      asset_id,
      crypto_amount,
      rate,
      payment_method
    });

    await db.execute("CALL SellCrypto(?, ?, ?, ?, ?, ?)", [
      user_id,
      wallet_id,
      asset_id,
      crypto_amount,
      rate,
      payment_method
    ]);

    return Response.json({ message: "Crypto sold successfully" })
  } catch (error) {
    console.error("Sell API error:", error)
    return Response.json({ error: error.message || "Failed to sell" }, { status: 500 })
  }
}
