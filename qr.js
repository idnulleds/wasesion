const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL')
const {makeid} = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
let router = express.Router()
const pino = require("pino");
const {
	default: Maher_Zubair,
	useMultiFileAuthState,
	jidNormalizedUser,
	Browsers,
	delay,
	makeInMemoryStore,
} = require("maher-zubair-baileys");

function removeFile(FilePath) {
	if (!fs.existsSync(FilePath)) return false;
	fs.rmSync(FilePath, {
		recursive: true,
		force: true
	})
};
const {
	readFile
} = require("node:fs/promises")
router.get('/', async (req, res) => {
	const id = makeid();
	async function SIGMA_MD_QR_CODE() {
		const {
			state,
			saveCreds
		} = await useMultiFileAuthState('./temp/' + id)
		try {
			let Qr_Code_By_Maher_Zubair = Maher_Zubair({
				auth: state,
				printQRInTerminal: false,
				logger: pino({
					level: "silent"
				}),
				browser: Browsers.macOS("Desktop"),
			});

			Qr_Code_By_WHITE-DEVIL.ev.on('creds.update', saveCreds)
			Qr_Code_By_WHITE-DEVIL.ev.on("connection.update", async (s) => {
				const {
					connection,
					lastDisconnect,
					qr
				} = s;
				if (qr) await res.end(await QRCode.toBuffer(qr));
				if (connection == "open") {
					await delay(5000);
					let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
					await delay(800);
				   let b64data = Buffer.from(data).toString('base64');
				   let session = await Qr_Code_By_Maher_Zubair.sendMessage(Qr_Code_By_Maher_Zubair.user.id, { text: "" + b64data });
	
				   let SIGMA_MD_TEXT = `
┏━━━━━━━━━━━━━━
┃WHITE-DEVIL MD SESSION IS 
┃SUCCESSFULLY
┃CONNECTED ✅🔥
┗━━━━━━━━━━━━━━━
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
❶ || Owner = Denuwa / Loku White Devil👨🏻‍💻
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
❷ || Bot WA Channel = https://whatsapp.com/channel/0029ValmRUuIN9ivgXD4k12t
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
❸ || Owner Number = https://wa.me/+94705209559
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
❺ || YT Chanel = https://www.youtube.com/@devil-programer99
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
❻ || Mine WA Chanel = https://whatsapp.com/channel/0029VaivwGS96H4baEiYFE1s
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
> POWERED BY WHITE-DEVIL 🔱
       `
	 await Qr_Code_By_WHITE-DEVIL.sendMessage(Qr_Code_By_Maher_WHITE-DEVIL.user.id,{text:SIGMA_MD_TEXT},{quoted:session})



					await delay(100);
					await Qr_Code_By_WHITE-DEVIL.ws.close();
					return await removeFile("temp/" + id);
				} else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
					await delay(10000);
					WHITE_DEVIL_MD_QR_CODE();
				}
			});
		} catch (err) {
			if (!res.headersSent) {
				await res.json({
					code: "Service Unavailable"
				});
			}
			console.log(err);
			await removeFile("temp/" + id);
		}
	}
	return await WHITE_DEVIL_MD_QR_CODE()
});
module.exports = router
