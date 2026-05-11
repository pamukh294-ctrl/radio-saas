const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// =========================
// TELEGRAM CONFIG
// =========================
const TELEGRAM_TOKEN = "8662525223:AAGiUvSkyTx3epRNlmf7wVq3dk8dAyOemAw";
const TELEGRAM_CHAT_ID = "8662525223";

// =========================
// MIDDLEWARE
// =========================
app.use(express.static(__dirname));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// =========================
// RADIOS
// =========================
const radios = [
  { name: "Power FM", url: "https://powerfm.example/stream" },
  { name: "Kral FM", url: "https://kralfm.example/stream" },
  { name: "Kafa FM", url: "https://kafafm.example/stream" },
  { name: "TRT FM", url: "https://trtfm.example/stream" }
];

// =========================
// STATE
// =========================
let history = [];
let lastState = {};

// =========================
// TELEGRAM ALERT
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
    console.log("Telegram error", e);
  }
}

// =========================
// STREAM CHECK
// =========================
async function check(url) {
  const start = Date.now();
  try {
    const res = await fetch(url, { method: "HEAD" });
    const ms = Date.now() - start;

    return res.ok
      ? { status: "ok", ms }
      : { status: "broken", ms: null };
  } catch {
    return { status: "broken", ms: null };
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
// HISTORY SNAPSHOT
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

// run loop
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
  console.log("Radio SaaS LIVE on", PORT);
});