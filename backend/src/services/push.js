const axios = require('axios');

const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY || '';
const FCM_URL = 'https://fcm.googleapis.com/fcm/send';

async function sendPush(pushToken, title, body, data = {}) {
  if (!FCM_SERVER_KEY || !pushToken) {
    console.log(`[PUSH MOCK] To ${pushToken}: ${title} - ${body}`);
    return { success: true, mock: true };
  }

  try {
    const response = await axios.post(FCM_URL, {
      to: pushToken,
      notification: { title, body },
      data,
    }, {
      headers: {
        Authorization: `key=${FCM_SERVER_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    return { success: response.data.success === 1 };
  } catch (err) {
    console.error('Push send failed:', err.message);
    return { success: false, error: err.message };
  }
}

async function sendPushToMany(tokens, title, body, data = {}) {
  const results = await Promise.allSettled(
    tokens.map(token => sendPush(token, title, body, data))
  );
  return results;
}

module.exports = { sendPush, sendPushToMany };
