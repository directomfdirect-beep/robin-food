const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'robin-food-jwt-secret-dev';

const connections = new Map();

function setupWebSocket(wss) {
  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, 'http://localhost');
    const token = url.searchParams.get('token');

    try {
      const user = jwt.verify(token, JWT_SECRET);
      ws.userId = user.id;

      if (!connections.has(user.id)) connections.set(user.id, new Set());
      connections.get(user.id).add(ws);

      ws.on('close', () => {
        const userConns = connections.get(user.id);
        if (userConns) {
          userConns.delete(ws);
          if (userConns.size === 0) connections.delete(user.id);
        }
      });

      ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data);
          // Handle client events if needed
        } catch (e) {}
      });
    } catch (e) {
      ws.close(4001, 'Invalid token');
    }
  });
}

function sendToUser(userId, event, data) {
  const userConns = connections.get(userId);
  if (!userConns) return;
  const message = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
  for (const ws of userConns) {
    if (ws.readyState === 1) ws.send(message);
  }
}

function broadcast(event, data) {
  const message = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
  for (const [, conns] of connections) {
    for (const ws of conns) {
      if (ws.readyState === 1) ws.send(message);
    }
  }
}

module.exports = { setupWebSocket, sendToUser, broadcast };
