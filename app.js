const express = require("express");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// TELEGRAM
// =========================
const TELEGRAM_TOKEN = "8604030991:AAH0C4sNHArVMLtEh3hgPPJZnFzVq708WhE";
const TELEGRAM_CHAT_ID = "8604030991";

// =========================
// MIDDLEWARE
// =========================
app.use(express.static(__dirname));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// =========================
// RADIOS (20 ADET)
// =========================
const radios = [
  { name: "Power FM", url: "http://powerfm.listenpowerapp.com/powerfm/mpeg/icecast.audio" },
  { name: "Kral FM", url: "http://46.20.3.204:80/" },
  { name: "Metro FM", url: "http://provisioning.streamtheworld.com/pls/METRO_FMAAC.pls" },
  { name: "Joy FM", url: "http://provisioning.streamtheworld.com/pls/JOY_FMAAC.pls" },
  { name: "Virgin Radio", url: "http://virginradio.com.tr/stream" },

  { name: "TRT FM", url: "http://trtfm.canlitv.com/stream" },
  { name: "Süper FM", url: "http://superfm.canlitv.com/stream" },
  { name: "Alem FM", url: "http://alemfm.canlitv.com/stream" },
  { name: "Best FM", url: "http://bestfm.canlitv.com/stream" },
  { name: "Show Radyo", url: "http://showradyo.canlitv.com/stream" },

  { name: "Slow Türk", url: "http://slowturk.canlitv.com/stream" },
  { name: "Kafa Radyo", url: "http://kafaradyo.canlitv.com/stream" },
  { name: "Radyo Fenomen", url: "http://fenomen.canlitv.com/stream" },
  { name: "Number One FM", url: "http://numberonefm.canlitv.com/stream" },
  { name: "Pal Station", url: "http://palstation.canlitv.com/stream" },

  { name: "Radyo D", url: "http://radyod.canlitv.com/stream" },
  { name: "Virgin Rock", url: "http://virginrock.canlitv.com/stream" },
  { name: "Radyo Viva", url: "http://viva.canlitv.com/stream" },
  { name: "Capital Radio", url: "http://capital.canlitv.com/stream" },
  { name: "Borusan Klasik", url: "http://borusanklasik.canlitv.com/stream" }
];

// =========================
// STATE
// =========================
let history = [];
let lastState = {};

// =========================
// TELEGRAM
// =========================
async function sendTelegram(msg) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: msg
      })
    });
  } catch (e) {
    console.log("Telegram error:", e.message);
  }
}

// =========================
// STREAM CHECK (FIXED)
// =========================
async function check(url) {
  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal
    });

    clearTimeout(timeout);

    const ms = Date.now() - start;

    return {
      status: res.ok ? "ok" : "broken",
      ms
    };

  } catch {
    return {
      status: "broken",
      ms: null
    };
  }
}

// =========================
// ALERT ENGINE
// =========================
function detectChange(results) {
  results.forEach(r => {
    const prev = lastState[r.name];

    if (prev === "ok" && r.stream_status === "broken") {
      console.log("🚨 DOWN:", r.name);
      sendTelegram(`🚨 ${r.name} DOWN`);
    }

    if (prev === "broken" && r.stream_status === "ok") {
      console.log("✅ RECOVER:", r.name);
      sendTelegram(`✅ ${r.name} RECOVERED`);
    }

    lastState[r.name] = r.stream_status;
  });
}

// =========================
// HISTORY
// =========================
async function snapshot() {
  const results = await Promise.all(
    radios.map(async r => {
      const c = await check(r.url);
      return { name: r.name, status: c.status };
    })
  );

  const ok = results.filter(r => r.status === "ok").length;
  const broken = results.filter(r => r.status === "broken").length;

  history.push({
    time: new Date().toISOString(),
    ok,
    broken
  });

  if (history.length > 50) history.shift();
}

setInterval(snapshot, 10000);
snapshot();

// =========================
// API
// =========================
app.get("/api", async (req, res) => {
  const results = await Promise.all(
    radios.map(async r => {
      const c = await check(r.url);

      return {
        name: r.name,
        stream_url: r.url,
        stream_status: c.status,
        response_time_ms: c.ms
      };
    })
  );

  detectChange(results);

  res.json(results);
});

// =========================
// HISTORY
// =========================
app.get("/history", (req, res) => {
  res.json(history);
});

// =========================
// START
// =========================
app.listen(PORT, () => {
  console.log("🚀 Radio SaaS LIVE on port", PORT);
});