const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

/* =========================
   RADYO VERİ TABANI
========================= */
const radios = [
  { name: "Radio Paradise", url: "https://stream-uk1.radioparadise.com/mp3-192" },
  { name: "KEXP", url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3" },
  { name: "BBC World", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm" },
  { name: "NPR", url: "https://npr-ice.streamguys1.com/live.mp3" }
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
   RADYO API + ANALYTICS
========================= */
app.get("/api/radio", async (req, res) => {

  let ok = 0;
  let broken = 0;

  const data = await Promise.all(
    radios.map(async r => {
      const status = await check(r.url);

      if (status) ok++;
      else broken++;

      return {
        name: r.name,
        url: r.url,
        status: status ? "ok" : "broken"
      };
    })
  );

  res.json({
    stats: {
      total: radios.length,
      ok,
      broken
    },
    radios: data
  });
});

/* =========================
   PRAYER (SABİT V1)
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
  res.send("RADIO SAAS RUNNING 🚀");
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Radio SaaS running on port", PORT);
});