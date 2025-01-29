const { makeid } = require('./id'); // Sesuaikan impor dari api/id.js
const QRCode = require('qrcode');
const express = require('express');
const pino = require("pino");
const { default: makeWASocket, useMultiFileAuthState, Browsers, delay } = require("@whiskeysockets/baileys");
const firebase = require('firebase/app');
require('firebase/firestore'); // pastikan firestore sudah terimport

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAig6-4KZYIqb5iU4S54qSY0uNVVxcfF5c",
  authDomain: "geehstore-311ff.firebaseapp.com",
  projectId: "geehstore-311ff",
  storageBucket: "geehstore-311ff.firebasestorage.app",
  messagingSenderId: "130977049398",
  appId: "1:130977049398:web:833580f6c1b66ed66d2197"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const firestore = firebase.firestore();
const router = express.Router();

// Endpoint untuk menghasilkan QR
router.get('/', async (req, res) => {
  const id = makeid();  // Membuat ID sesi unik
  
  async function startSession() {
    const { state, saveCreds } = await useMultiFileAuthState();  // Tidak menggunakan folder lokal
    
    try {
      let sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: "silent" }),
        browser: Browsers.macOS("Desktop"),
      });

      sock.ev.on('creds.update', saveCreds);
      sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
        if (qr) {
          // Menghasilkan QR
          let qrImage = await QRCode.toDataURL(qr);
          
          // Simpan QR dan status ke Firebase
          await firestore.collection('sessions').doc(id).set({
            qr: qrImage,
            status: 'waiting'
          });
          
          // Kembalikan QR ke client
          return res.json({ qr: qrImage });
        }

        if (connection === "open") {
          await delay(5000);
          await sock.ws.close();

          // Update status sesi ke 'connected' di Firebase
          await firestore.collection('sessions').doc(id).update({
            status: 'connected'
          });
        } else if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== 401) {
          // Jika sesi terputus, coba lagi
          await delay(10000);
          startSession();
        }
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(503).json({ error: "Service Unavailable" });
    }
  }

  // Mulai sesi baru
  await startSession();
});

module.exports = router;
