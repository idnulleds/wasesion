const firebase = require('firebase');
const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const pino = require("pino");
const {
    default: Maher_Zubair,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("maher-zubair-baileys");
const fs = require("fs");

// Inisialisasi Firebase dengan konfigurasi yang diberikan
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyAig6-4KZYIqb5iU4S54qSY0uNVVxcfF5c",
        authDomain: "geehstore-311ff.firebaseapp.com",
        projectId: "geehstore-311ff",
        storageBucket: "geehstore-311ff.appspot.com",
        messagingSenderId: "130977049398",
        appId: "1:130977049398:web:833580f6c1b66ed66d2197"
    });
}

const db = firebase.firestore();

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const id = makeid();
    let num = req.query.number;

    async function SIGMA_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState(id); // Ganti dengan id untuk menyimpan state di Firestore
        try {
            let Pair_Code_By_Maher_Zubair = Maher_Zubair({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: ["Chrome (Linux)", "", ""]
            });

            if (!Pair_Code_By_Maher_Zubair.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Pair_Code_By_Maher_Zubair.requestPairingCode(num);
                if (!res.headersSent) {
                    // Simpan kode pairing ke Firestore
                    await db.collection('pairing_codes').add({
                        number: num,
                        code: code,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                    return res.json({ code });
                }
            }

            Pair_Code_By_Maher_Zubair.ev.on('creds.update', saveCreds);
            Pair_Code_By_Maher_Zubair.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection == "open") {
                    await delay(5000);
                    // Gunakan Firestore untuk menyimpan kredensial dalam format base64
                    let data = JSON.stringify(state.creds); // Convert creds ke JSON dan encode base64
                    const b64data = Buffer.from(data).toString('base64');

                    // Simpan ke Firestore
                    await db.collection('pairing_data').doc(id).set({
                        creds: b64data,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    });

                    await Pair_Code_By_Maher_Zubair.sendMessage(Pair_Code_By_Maher_Zubair.user.id, { text: b64data });

                    await delay(100);
                    await Pair_Code_By_Maher_Zubair.ws.close();
                } else if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== 401) {
                    await delay(10000);
                    SIGMA_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.error("Service Restarted", err);
            if (!res.headersSent) {
                return res.json({ code: "Service Unavailable" });
            }
        }
    }

    await SIGMA_MD_PAIR_CODE();
};
