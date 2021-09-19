const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const SESSION_FILE_PATH = './whatsapp-session.json';
let sessionCfg;
// buat sessioncfg tanpa isi
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require('../../../whatsapp-session.json');
}
// cek file ada atau engga

const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    // untuk menggunakan server nya webwhatsapp saja,memory tidak akan banyak terpakai
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu',
    ],
  },
  session: sessionCfg,
});

client.on('message', (msg) => {
  msg.reply('Ini adalah WhatsApp resmi Online Learning Platform khusus untuk OTP, dan tidak terhubung dengan Customer Service, mohon untuk tidak membalas pesan ini.\nTerimakasih');
});
client.on('ready', () => {
  console.log('Whatsapp ready');
});
client.initialize().catch(() => console.log('Web Whatsapp proses ended'));

module.exports = {
  qrcode: (io) => {
    return new Promise((resolve, reject) => {
      // socket io
      io.on('connection', (socket) => {
        // kirim parameter message,dan valuenya connecting.. ke tujuan
        client.on('qr', (qr) => {
          // Generate and scan this code with your phone
          qrcode.toDataURL(qr, (err, url) => {
            if (err) {
              reject(new Error('Error'));
            } else {
              // mengirim parameter qr
              socket.emit('qr', url);
              socket.emit('message', 'QR CODE SCAN READY');
              resolve('QR SCAN READY');
            }
          });
        });
        client.on('ready', () => {
          resolve('Whatsapp ready');
        });
        client.on('authenticated', (session) => {
          socket.emit('authenticated', 'Authentication..');
          socket.emit('message', 'Whatsapp ready');

          sessionCfg = session;
          fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
            if (err) {
              reject(new Error('Error'));
            }
          });
        });
        client.destroy().catch(() => console.log('Web Whatsapp proses ended'));
        client.initialize().catch(() => console.log('Web Whatsapp proses ended'));
      });
    });
  },
  sendOtp: (number, message) => {
    return new Promise((resolve, reject) => {
      client
        .sendMessage(number, message)
        .then((ress) => {
          resolve(ress);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
