const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

/* =========================
   RADYO VERİTABANI (KATEGORİLİ)
========================= */
let radios = [
  { name: "Radio Paradise", url: "https://stream-uk1.radioparadise.com/mp3-192", cat: "Pop" },
  { name: "BBC Radio 1", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one", cat: "Pop" },

  { name: "KEXP", url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3", cat: "Rock" },
  { name: "Rock Antenne", url: "https://stream.rockantenne.de/rockantenne/stream/mp3", cat: "Rock" },

  { name: "BBC World", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm", cat: "News" },
  { name: "NPR News", url: "https://npr-ice.streamguys1.com/live.mp3", cat: "News" },

  { name: "DI FM", url: "https://stream.difm.com/di_128.mp3", cat: "Electronic" },

  { name: "TRT FM", url: "http://trtfm.canlitv.com/stream", cat: "TR" }
];

/* =========================
   STREAM CHECK
========================= */
async function check(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

/* =========================
   RADYO API + STATS + KATEGORİ
========================= */
app.get("/api/radio", async (req, res) => {

  let grouped = {};
  let ok = 0;
  let broken = 0;

  for (let r of radios) {

    let status = false;

    try {
      const result = await fetch(r.url, { method: "HEAD" });
      status = result.ok;
    } catch {}

    if (status) ok++;
    else broken++;

    if (!grouped[r.cat]) grouped[r.cat] = [];

    grouped[r.cat].push({
      name: r.name,
      url: r.url,
      status: status ? "ok" : "broken"
    });
  }

  res.json({
    stats: {
      total: radios.length,
      ok,
      broken
    },
    radios: grouped
  });
});

/* =========================
   PRAYER API
========================= */
app.get("/api/prayer", (req, res) => {
  res.json({
    city: "Istanbul",
    fajr: "06:00",
    dhuhr: "13:15",
    asr: "16:30",
    maghrib: "19:10",
    isha: "20:45"
  });
});

/* =========================
   PHARMACY
========================= */
app.get("/api/pharmacy", (req, res) => {
  res.json([
    { name: "Merkez Eczanesi", district: "Atakum" },
    { name: "Güneş Eczanesi", district: "Samsun" }
  ]);
});

/* =========================
   PETSHOP
========================= */
app.get("/api/petshop", (req, res) => {
  res.json([
    { name: "Happy Pets", city: "Samsun" },
    { name: "Pet World", city: "İstanbul" }
  ]);
});

/* =========================
   ROOT
========================= */
app.get("/", (req, res) => {
  res.send("RADIO SAAS LIVE 🚀");
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("RADIO SAAS RUNNING:", PORT);
});