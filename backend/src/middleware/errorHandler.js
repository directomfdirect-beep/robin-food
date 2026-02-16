function errorHandler(err, req, res, next) {
  console.error('Error:', err.message, err.stack);
  
  if (err.type === 'validation') {
    return res.status(400).json({ error: err.message, code: 'VALIDATION_ERROR' });
  }
  if (err.type === 'auth') {
    return res.status(401).json({ error: err.message, code: 'UNAUTHORIZED' });
  }
  if (err.type === 'forbidden') {
    return res.status(403).json({ error: err.message, code: 'FORBIDDEN' });
  }
  if (err.type === 'not_found') {
    return res.status(404).json({ error: err.message, code: 'NOT_FOUND' });
  }
  if (err.type === 'conflict') {
    return res.status(409).json({ error: err.message, code: 'CONFLICT' });
  }
  if (err.type === 'rate_limit') {
    return res.status(429).json({ error: err.message, code: 'RATE_LIMITED' });
  }
  
  res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
}

class AppError extends Error {
  constructor(message, type = 'validation', statusCode = 400) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
  }
}

module.exports = { errorHandler, AppError };
