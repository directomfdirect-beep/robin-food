require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { WebSocketServer } = require('ws');
const http = require('http');

const authRoutes = require('./routes/auth');
const catalogRoutes = require('./routes/catalog');
const searchRoutes = require('./routes/search');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const pickerRoutes = require('./routes/picker');
const profileRoutes = require('./routes/profile');
const favoriteRoutes = require('./routes/favorites');
const addressRoutes = require('./routes/addresses');
const alertRoutes = require('./routes/alerts');
const chatRoutes = require('./routes/chat');
const settlementRoutes = require('./routes/settlement');
const webhookRoutes = require('./routes/webhooks');
const adminRoutes = require('./routes/admin');

const { errorHandler } = require('./middleware/errorHandler');
const { setupWebSocket } = require('./ws/handler');
const { startCronJobs } = require('./jobs');
const db = require('./db');

const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'error', message: err.message });
  }
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/stores', catalogRoutes);
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/picker', pickerRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/favorites', favoriteRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/smart-alerts', alertRoutes);
app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/partner', settlementRoutes);

app.use(errorHandler);

const wss = new WebSocketServer({ server, path: '/ws' });
setupWebSocket(wss);

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Robin Food API running on port ${PORT}`);
  startCronJobs();
});
