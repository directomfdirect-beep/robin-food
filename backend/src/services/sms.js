const axios = require('axios');

const SMSC_LOGIN = process.env.SMSC_LOGIN || '';
const SMSC_PASSWORD = process.env.SMSC_PASSWORD || '';
const SMSC_API_URL = 'https://smsc.ru/sys/send.php';

async function sendSms(phone, message) {
  if (!SMSC_LOGIN || !SMSC_PASSWORD) {
    console.log(`[SMS MOCK] To ${phone}: ${message}`);
    return { success: true, mock: true };
  }

  try {
    const response = await axios.get(SMSC_API_URL, {
      params: {
        login: SMSC_LOGIN,
        psw: SMSC_PASSWORD,
        phones: phone,
        mes: message,
        fmt: 3,
        charset: 'utf-8',
      },
      timeout: 10000,
    });

    if (response.data.error) {
      console.error('SMSC error:', response.data);
      return { success: false, error: response.data.error_code };
    }

    return { success: true, id: response.data.id };
  } catch (err) {
    console.error('SMS send failed:', err.message);
    return { success: false, error: err.message };
  }
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

module.exports = { sendSms, generateOtp };
