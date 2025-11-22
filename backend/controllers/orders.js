const pool = require('../db');
const axios = require('axios');

async function getMenu(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, price, category, description, is_active FROM menu WHERE is_active = true ORDER BY category, name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
}

async function createOrder(req, res) {
  const { name, phone, items, delivery_addr, note } = req.body;

  try {
    await pool.query('BEGIN');

    const orderRes = await pool.query(
      `INSERT INTO orders 
      (customer_name, phone, delivery_address, note, status, created_at) 
      VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING id`,
      [name || 'Guest', phone, delivery_addr || '', note || '', 'pending']
    );

    const orderId = orderRes.rows[0].id;

    for (const it of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, menu_id, qty) VALUES ($1,$2,$3)`,
        [orderId, it.menu_id, it.qty]
      );
    }

    await pool.query('COMMIT');

    sendWhatsAppConfirmation(phone, orderId).catch(err =>
      console.error('WA send error', err)
    );

    res.json({ orderId, status: 'created' });

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
}

async function sendWhatsAppConfirmation(toNumber, orderId) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !from) {
    console.log('Twilio not configured — skipping WA send');
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const body = `Thanks! Your order #${orderId} is received. Reply with CONFIRM ${orderId} to confirm or CANCEL ${orderId} to cancel.`;

  const params = new URLSearchParams();
  params.append('From', from);
  params.append('To', `whatsapp:${toNumber}`);
  params.append('Body', body);

  await axios.post(url, params, {
    auth: { username: accountSid, password: authToken }
  });
}

async function whatsappWebhook(req, res) {
  const text = (req.body.Body || '').trim().toUpperCase();
  const parts = text.split(/\s+/);

  if (parts[0] === 'CONFIRM' && parts[1]) {
    const id = +parts[1];
    if (!isNaN(id)) await pool.query('UPDATE orders SET status=$1 WHERE id=$2', ['confirmed', id]);
  }

  if (parts[0] === 'CANCEL' && parts[1]) {
    const id = +parts[1];
    if (!isNaN(id)) await pool.query('UPDATE orders SET status=$1 WHERE id=$2', ['cancelled', id]);
  }

  res.set('Content-Type', 'text/xml');
  res.send('<Response></Response>');
}

module.exports = { getMenu, createOrder, whatsappWebhook };
