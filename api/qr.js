const { makeid } = require('../id');
const QRCode = require('qrcode');
const express = require('express');
const pino = require("pino");
const fs = require('fs');
const {
	default: makeWASocket,
	useMultiFileAuthState,
	Browsers,
	delay
} = require("@whiskeysockets/baileys");

let router = express.Router();

router.get('/', async (req, res) => {
	const id = makeid();
	const sessionPath = `/tmp/${id}`; // Gunakan folder sementara di Vercel

	async function startSession() {
		const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

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
					let qrImage = await QRCode.toDataURL(qr);
					return res.json({ qr: qrImage });
				}

				if (connection === "open") {
					await delay(5000);
					await sock.ws.close();
					fs.rmSync(sessionPath, { recursive: true, force: true });
				} else if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== 401) {
					await delay(10000);
					startSession();
				}
			});
		} catch (err) {
			console.error("Error:", err);
			res.status(503).json({ error: "Service Unavailable" });
		}
	}

	await startSession();
});

module.exports = router;
