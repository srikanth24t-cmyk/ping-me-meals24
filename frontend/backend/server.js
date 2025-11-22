require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const pino = require('pino')();
const { body, validationResult } = require('express-validator');

const ordersCtrl = require('./controllers/orders');
const pool = require('./db');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(bodyParser.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/menu', ordersCtrl.getMenu);

app.post(
  '/order',
  body('phone').isString().notEmpty(),
  body('items').isArray({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    return ordersCtrl.createOrder(req, res);
  }
);

app.post('/whatsapp/webhook', bodyParser.urlencoded({ extended: false }), ordersCtrl.whatsappWebhook);

app.get('/admin/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    pino.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => pino.info(`Backend listening on ${port}`));
