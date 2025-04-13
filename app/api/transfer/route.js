import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { recipient, amount, network, crypto } = body;

    if (!recipient || !amount || !network || !crypto) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const userId = req.cookies.get("userId")?.value;
    if (!userId) {
      return NextResponse.json({ message: "User ID not found" }, { status: 400 });
    }

    const db = await connectToDatabase();

    
    const [senderRows] = await db.execute(
      "SELECT wallet_id, private_key FROM wallets WHERE user_id = ?",
      [userId]
    );
    if (senderRows.length === 0) {
      return NextResponse.json({ message: "Sender wallet not found" }, { status: 404 });
    }
    const senderWallet = senderRows[0];

   
    const [recipientRows] = await db.execute(
      "SELECT wallet_id, public_key FROM wallets WHERE public_key = ?",
      [recipient]
    );
    if (recipientRows.length === 0) {
      return NextResponse.json({ message: "Recipient wallet not found" }, { status: 404 });
    }
    const recipientWallet = recipientRows[0];

    
    const [senderAssetRows] = await db.execute(
      "SELECT asset_id, asset_amount FROM crypto_assets WHERE wallet_id = ? AND symbol = ?",
      [senderWallet.wallet_id, crypto]
    );
    if (
      senderAssetRows.length === 0 ||
      parseFloat(senderAssetRows[0].asset_amount) < parseFloat(amount)
    ) {
      return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
    }

    const senderAsset = senderAssetRows[0];

  
    await db.execute(
      "UPDATE crypto_assets SET asset_amount = asset_amount - ? WHERE wallet_id = ? AND symbol = ?",
      [amount, senderWallet.wallet_id, crypto]
    );


    const [recipientAssetRows] = await db.execute(
      "SELECT asset_amount FROM crypto_assets WHERE wallet_id = ? AND symbol = ?",
      [recipientWallet.wallet_id, crypto]
    );

    if (recipientAssetRows.length > 0) {
      await db.execute(
        "UPDATE crypto_assets SET asset_amount = asset_amount + ? WHERE wallet_id = ? AND symbol = ?",
        [amount, recipientWallet.wallet_id, crypto]
      );
    } else {
      await db.execute(
        "INSERT INTO crypto_assets (user_id, wallet_id, symbol, name, asset_amount, is_active) VALUES (?, ?, ?, ?, ?, 1)",
        [userId, recipientWallet.wallet_id, crypto, crypto, amount]
      );
    }

  
    await db.execute(
      `INSERT INTO transactions 
        (user_id, wallet_id, asset_id, tra_sender_wallet_id, tra_recipient_wallet_id, crypto, tnx_amount, network) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        senderWallet.wallet_id,
        senderAsset.asset_id,
        senderWallet.private_key,
        recipientWallet.public_key,
        crypto,
        amount,
        network
      ]
    );

    return NextResponse.json({ message: "Transfer successful" }, { status: 200 });

  } catch (err) {
    console.error("Transfer error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
