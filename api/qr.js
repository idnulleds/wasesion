const express = require('express');
const QRCode = require('qrcode');
const pino = require("pino");
const fs = require('fs');
const firebase = require('firebase'); // SDK untuk web

const router = express.Router();

// Konfigurasi Firebase menggunakan kredensial langsung
const firebaseConfig = {
  apiKey: "AIzaSyAig6-4KZYIqb5iU4S54qSY0uNVVxcfF5c",
  authDomain: "geehstore-311ff.firebaseapp.com",
  projectId: "geehstore-311ff",
  storageBucket: "geehstore-311ff.firebasestorage.app",
  messagingSenderId: "130977049398",
  appId: "1:130977049398:web:833580f6c1b66ed66d2197"
};

// Inisialisasi Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // jika sudah ada instance, pakai yang sudah ada
}

const database = firebase.database();

router.get('/', async (req, res) => {
  const id = makeid();
  const sessionRef = database.ref('sessions').child(id); // Menyimpan session di Firebase

  async function startSession() {
    try {
      // Simulasi proses pembuatan QR code
      let qrCode = await QRCode.toDataURL('sample-qr-code-data');

      // Simpan session dan QR ke Firebase
      await sessionRef.set({
        qr: qrCode,
        status: 'pending', // Status untuk session ini
        timestamp: Date.now(),
      });

      res.json({ qr: qrCode });
    } catch (err) {
      console.error("Error:", err);
      res.status(503).json({ error: "Service Unavailable" });
    }
  }

  await startSession();
});

module.exports = router;
