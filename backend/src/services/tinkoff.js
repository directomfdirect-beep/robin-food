const axios = require('axios');
const crypto = require('crypto');

const TERMINAL_KEY = process.env.TINKOFF_TERMINAL_KEY || '';
const TERMINAL_PASSWORD = process.env.TINKOFF_PASSWORD || '';
const API_URL = process.env.TINKOFF_API_URL || 'https://securepay.tinkoff.ru/v2';

function generateToken(params) {
  const sorted = Object.keys(params)
    .filter(k => k !== 'Token' && k !== 'Receipt' && k !== 'DATA')
    .sort()
    .map(k => params[k]);
  sorted.push(TERMINAL_PASSWORD);
  const concatenated = sorted.join('');
  return crypto.createHash('sha256').update(concatenated).digest('hex');
}

async function initPayment({ orderId, amount, description, customerKey, successUrl, failUrl }) {
  const params = {
    TerminalKey: TERMINAL_KEY,
    Amount: Math.round(amount * 100),
    OrderId: String(orderId),
    Description: description || 'Robin Food order',
    CustomerKey: customerKey,
    SuccessURL: successUrl || process.env.PAYMENT_SUCCESS_URL,
    FailURL: failUrl || process.env.PAYMENT_FAIL_URL,
  };
  params.Token = generateToken(params);

  if (!TERMINAL_KEY) {
    console.log('[TINKOFF MOCK] Init payment:', params);
    return { success: true, paymentId: `mock_${orderId}`, paymentUrl: 'https://mock-payment.example.com', mock: true };
  }

  const { data } = await axios.post(`${API_URL}/Init`, params, { timeout: 15000 });
  if (!data.Success) throw new Error(data.Message || 'Tinkoff Init failed');
  return { success: true, paymentId: data.PaymentId, paymentUrl: data.PaymentURL };
}

async function confirmPayment(paymentId) {
  const params = { TerminalKey: TERMINAL_KEY, PaymentId: String(paymentId) };
  params.Token = generateToken(params);

  if (!TERMINAL_KEY) {
    console.log('[TINKOFF MOCK] Confirm:', paymentId);
    return { success: true, mock: true };
  }

  const { data } = await axios.post(`${API_URL}/Confirm`, params, { timeout: 15000 });
  if (!data.Success) throw new Error(data.Message || 'Tinkoff Confirm failed');
  return { success: true, status: data.Status };
}

async function cancelPayment(paymentId, amount) {
  const params = { TerminalKey: TERMINAL_KEY, PaymentId: String(paymentId) };
  if (amount) params.Amount = Math.round(amount * 100);
  params.Token = generateToken(params);

  if (!TERMINAL_KEY) {
    console.log('[TINKOFF MOCK] Cancel:', paymentId);
    return { success: true, mock: true };
  }

  const { data } = await axios.post(`${API_URL}/Cancel`, params, { timeout: 15000 });
  if (!data.Success) throw new Error(data.Message || 'Tinkoff Cancel failed');
  return { success: true, status: data.Status };
}

function verifyWebhookSignature(body) {
  if (!TERMINAL_PASSWORD) return true;
  const params = { ...body };
  delete params.Token;
  const expected = generateToken(params);
  return body.Token === expected;
}

module.exports = { initPayment, confirmPayment, cancelPayment, verifyWebhookSignature };
