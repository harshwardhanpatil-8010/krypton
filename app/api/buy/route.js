import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(req) {
  try {
    const cookieStore = await cookies()
    const userSession = cookieStore.get("userId")

    if (!userSession?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user_id = parseInt(userSession.value)
    const body = await req.json()
    const { wallet_id, asset_id, crypto_amount, rate, payment_method, crypto} = body

    const db = await connectToDatabase()

    // Start a transaction
    await db.beginTransaction()

    // 1. Get the user's wallet
    const [userWallet] = await db.query('SELECT * FROM wallets WHERE wallet_id = ? AND user_id = ?', [wallet_id, user_id])
    if (userWallet.length === 0) {
      throw new Error('Wallet not found or unauthorized access')
    }

    // 2. Get the crypto rate for the asset
    const [cryptoRate] = await db.query('SELECT rate FROM crypto_rates WHERE asset_id = ?', [asset_id])
    if (cryptoRate.length === 0) {
      throw new Error('Crypto rate not found')
    }

    
    const totalCost = crypto_amount

    // 4. Check if the user has sufficient balance
    if (userWallet[0].balance < totalCost) {
      throw new Error('Insufficient balance in wallet')
    }

    // 5. Update the user's wallet balance
    await db.query('UPDATE wallets SET balance = balance - ? WHERE wallet_id = ?', [totalCost, wallet_id])

    // 6. Insert the transaction record
    const transactionQuery = `
      INSERT INTO transactions (user_id,asset_id, crypto_amount, rate, payment_method, crypto, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const [transactionResult] = await db.query(transactionQuery, [
      user_id,
      asset_id,
      crypto_amount,
      rate,
      payment_method,
      crypto,
      'Completed',
    ])

    // Commit the transaction
    await db.commit()
    await db.end()


    return NextResponse.json({ message: "Asset purchased successfully", transactionId: transactionResult.insertId }, { status: 200 })
  } catch (err) {
    const db = await connectToDatabase()
    // Rollback in case of error
    await db.rollback()
    console.error("Buy API error:", err)
    return NextResponse.json({ error: err.message || "Server Error" }, { status: 500 })
  }

}
