const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const queue = [];
const results = {};
let cmdCounter = 0;

// Cursor AI sends code to execute in Figma
app.post('/exec', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'code is required' });

  const id = ++cmdCounter;
  queue.push({ id, code });
  console.log(`[+] Command #${id} queued`);

  // Wait up to 300s for the plugin to execute and return result
  const timeout = setTimeout(() => {
    if (!results[id]) {
      results[id] = { error: 'timeout: plugin did not respond in 300s' };
    }
  }, 300000);

  const poll = setInterval(() => {
    if (results[id] !== undefined) {
      clearInterval(poll);
      clearTimeout(timeout);
      const result = results[id];
      delete results[id];
      res.json({ id, result });
    }
  }, 100);
});

// Figma plugin polls for pending commands
app.get('/poll', (req, res) => {
  if (queue.length > 0) {
    const cmd = queue.shift();
    console.log(`[>] Command #${cmd.id} sent to plugin`);
    res.json(cmd);
  } else {
    res.json(null);
  }
});

// Figma plugin posts back the execution result
app.post('/result', (req, res) => {
  const { id, result, error } = req.body;
  console.log(`[<] Result for #${id}:`, error ? `ERROR: ${error}` : JSON.stringify(result).slice(0, 200));
  results[id] = error ? { error } : result;
  res.json({ ok: true });
});

// Health check
app.get('/ping', (req, res) => res.json({ status: 'ok', queue: queue.length }));

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`\nFigma Bridge running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST /exec   — send JS code to execute in Figma');
  console.log('  GET  /poll   — plugin polls for commands');
  console.log('  POST /result — plugin posts back results');
  console.log('  GET  /ping   — health check\n');
});
