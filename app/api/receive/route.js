import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { sender, amount, network, crypto } = body;

    if (!sender || !amount || !network || !crypto) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const userId = req.cookies.get("userId")?.value;
    if (!userId) {
      return NextResponse.json({ message: "User ID not found" }, { status: 400 });
    }

    const db = await connectToDatabase();

    
    const [receiverRows] = await db.execute(
      "SELECT wallet_id, private_key FROM wallets WHERE user_id = ?",
      [userId]
    );
    if (receiverRows.length === 0) {
      return NextResponse.json({ message: "Receiver wallet not found" }, { status: 404 });
    }
    const receiverWallet = receiverRows[0];


    const [senderRows] = await db.execute(
      "SELECT wallet_id, user_id FROM wallets WHERE public_key = ?",
      [sender]
    );
    if (senderRows.length === 0) {
      return NextResponse.json({ message: "Sender wallet not found" }, { status: 404 });
    }
    const senderWallet = senderRows[0];


    const [senderAssetRows] = await db.execute(
      "SELECT asset_amount FROM crypto_assets WHERE wallet_id = ? AND symbol = ?",
      [senderWallet.wallet_id, crypto]
    );
    if (
      senderAssetRows.length === 0 ||
      parseFloat(senderAssetRows[0].asset_amount) < parseFloat(amount)
    ) {
      return NextResponse.json({ message: "Sender has insufficient balance" }, { status: 400 });
    }

  
    await db.execute(
      "UPDATE crypto_assets SET asset_amount = asset_amount - ? WHERE wallet_id = ? AND symbol = ?",
      [amount, senderWallet.wallet_id, crypto]
    );


    const [existingAssetRows] = await db.execute(
      "SELECT asset_id, asset_amount FROM crypto_assets WHERE wallet_id = ? AND symbol = ?",
      [receiverWallet.wallet_id, crypto]
    );

    let assetId;

    if (existingAssetRows.length > 0) {
      assetId = existingAssetRows[0].asset_id;

      await db.execute(
        "UPDATE crypto_assets SET asset_amount = asset_amount + ? WHERE wallet_id = ? AND symbol = ?",
        [amount, receiverWallet.wallet_id, crypto]
      );
    } else {
      const [result] = await db.execute(
        "INSERT INTO crypto_assets (user_id, wallet_id, symbol, name, asset_amount, is_active) VALUES (?, ?, ?, ?, ?, 1)",
        [userId, receiverWallet.wallet_id, crypto, crypto, amount]
      );
      assetId = result.insertId;
    }


    await db.execute(
      `INSERT INTO transactions 
        (user_id, wallet_id, asset_id, rec_sender_wallet_id, rec_recipient_wallet_id, crypto, tnx_amount, network)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        receiverWallet.wallet_id,
        assetId,
        sender,                         
        receiverWallet.private_key,  
        crypto,
        amount,
        network
      ]
    );

    return NextResponse.json({ message: "Crypto received successfully" }, { status: 200 });

  } catch (err) {
    console.error("Receive error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
