import {connectToDatabase} from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { user_id, wallet_id, asset_id, crypto_amount,crypto, rate, payment_method } = req.body;
  const db = await connectToDatabase();
  try {
    await db.query('CALL BuyCrypto(?, ?, ?, ?, ?, ?, ?)', [user_id, wallet_id, asset_id, crypto_amount, crypto, rate, payment_method]);

    res.json({ success: true, message: 'Asset purchased successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
}
