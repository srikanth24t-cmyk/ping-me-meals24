require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const ordersCtrl = require('./controllers/orders');
const pool = require('./db');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(bodyParser.json());

/* Health */
app.get('/health', (req, res) => res.json({ ok: true }));

/* Customer APIs */
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

/* WhatsApp Webhook */
app.post('/whatsapp/webhook', bodyParser.urlencoded({ extended: false }), ordersCtrl.whatsappWebhook);

/* Admin auth middleware */
function adminAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const parts = auth.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    if (parts[1] === process.env.ADMIN_TOKEN) return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

/* Admin routes */
app.use('/admin', adminAuth, require('./routes/admin'));

/* Individual admin health */
app.get('/admin/health', adminAuth, (req, res) => res.json({ ok: true }));

/* Start server */
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
