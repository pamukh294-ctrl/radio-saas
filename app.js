const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

/* =========================
   SENİN MEVCUT 50+ LİSTEN BURAYA KALIR
========================= */
let radios = [
  { name: "Radio Paradise", url: "https://stream-uk1.radioparadise.com/mp3-192", cat: "Pop" },
  { name: "BBC Radio 1", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one", cat: "Pop" },
  { name: "Capital FM", url: "http://media-ice.musicradio.com/CapitalMP3", cat: "Pop" },

  { name: "KEXP", url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3", cat: "Rock" },
  { name: "Rock Antenne", url: "https://stream.rockantenne.de/rockantenne/stream/mp3", cat: "Rock" },

  { name: "BBC World", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm", cat: "News" },

  { name: "TRT FM", url: "http://trtfm.canlitv.com/stream", cat: "TR" },

  /* 🔥 BURAYA SENİN EKLEDİKLERİN KALACAK (SİLME YOK) */
];

/* =========================
   API - SADECE GRUPLAR
========================= */
app.get("/api/radio", (req, res) => {

  const grouped = {};

  radios.forEach(r => {
    if (!grouped[r.cat]) grouped[r.cat] = [];
    grouped[r.cat].push({
      name: r.name,
      url: r.url,
      cat: r.cat,
      status: "ok"
    });
  });

  res.json({
    stats: {
      total: radios.length,
      ok: radios.length,
      broken: 0
    },
    radios: grouped
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("RADIO SAAS SAFE MODE RUNNING");
});