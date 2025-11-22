const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query;
    let q = 'SELECT * FROM orders';
    const params = [];
    if (status) {
      q += ' WHERE status=$1';
      params.push(status);
    }
    q += ' ORDER BY created_at DESC LIMIT 200';
    const r = await pool.query(q, params);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const order = await pool.query('SELECT * FROM orders WHERE id=$1', [id]);
    if (order.rows.length === 0) return res.status(404).json({ error: 'not found' });
    const items = await pool.query(
      `SELECT oi.id, oi.qty, oi.menu_id, m.name, m.price
       FROM order_items oi
       LEFT JOIN menu m ON m.id = oi.menu_id
       WHERE oi.order_id=$1`, [id]
    );
    res.json({ order: order.rows[0], items: items.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

router.put('/orders/:id/status', express.json(), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'missing status' });

    await pool.query('UPDATE orders SET status=$1 WHERE id=$2', [status, id]);
    res.json({ ok: true, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

module.exports = router;
