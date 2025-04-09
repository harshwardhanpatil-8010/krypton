import {connectToDatabase} from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { user_id, wallet_id, from_network, to_network, amount, crypto } = req.body;
  const db = await connectToDatabase();
  try {
    const [wallet] = await db.query('SELECT balance FROM wallets WHERE wallet_id = ?', [wallet_id]);
    if (!wallet.length || wallet[0].balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    await db.query(
      'INSERT INTO transactions (user_id, amount, sender_wallet_id, recipient_wallet_id, network, crypto) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, amount, 'private_key', 'public_key', `${from_network}->${to_network}`, crypto]
    );

    await db.query('UPDATE wallets SET balance = balance - ? WHERE wallet_id = ?', [amount, wallet_id]);

    res.json({ success: true, message: 'Bridged successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
}
