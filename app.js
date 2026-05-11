const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

/* =========================
   RADYO DB
========================= */
let radios = [

/* ================= POP ================= */
{ name: "Radio Paradise", url: "https://stream-uk1.radioparadise.com/mp3-192", cat: "Pop" },
{ name: "BBC Radio 1", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one", cat: "Pop" },
{ name: "Capital FM", url: "http://media-ice.musicradio.com/CapitalMP3", cat: "Pop" },
{ name: "NRJ Pop", url: "http://cdn.nrjaudio.fm/audio1/fr/30001/mp3_128.mp3", cat: "Pop" },
{ name: "Heart FM UK", url: "http://media-the.musicradio.com/HeartLondonMP3", cat: "Pop" },

/* ================= ROCK ================= */
{ name: "KEXP Seattle", url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3", cat: "Rock" },
{ name: "Rock Antenne", url: "https://stream.rockantenne.de/rockantenne/stream/mp3", cat: "Rock" },
{ name: "Classic Rock FL", url: "http://streaming.live365.com/a07616", cat: "Rock" },
{ name: "Rock FM Germany", url: "http://streams.rockfm.de/rockfm.mp3", cat: "Rock" },

/* ================= NEWS ================= */
{ name: "BBC World Service", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm", cat: "News" },
{ name: "NPR News", url: "https://npr-ice.streamguys1.com/live.mp3", cat: "News" },
{ name: "CNN Radio", url: "http://tunein.cnnradio.com/cnn", cat: "News" },

/* ================= ELECTRONIC ================= */
{ name: "DI FM", url: "https://stream.difm.com/di_128.mp3", cat: "Electronic" },
{ name: "Ibiza Global", url: "http://ibizaglobalradio.streaming-pro.com:8024/stream", cat: "Electronic" },
{ name: "Deep House Radio", url: "http://stream.deephouseradio.com/stream", cat: "Electronic" },

/* ================= TURKEY ================= */
{ name: "TRT FM", url: "http://trtfm.canlitv.com/stream", cat: "TR" },
{ name: "Kral FM", url: "http://46.20.3.204:80/", cat: "TR" },
{ name: "Power FM", url: "http://powerfm.listenpowerapp.com/powerfm/mpeg/icecast.audio", cat: "TR" },
{ name: "Metro FM", url: "http://provisioning.streamtheworld.com/pls/METRO_FMAAC.pls", cat: "TR" },
{ name: "Süper FM", url: "http://superfm.canlitv.com/stream", cat: "TR" },
{ name: "Show Radyo", url: "http://showradyo.canlitv.com/stream", cat: "TR" },
{ name: "Best FM", url: "http://bestfm.canlitv.com/stream", cat: "TR" },

/* ================= MIX ================= */
{ name: "Slow Türk", url: "http://slowturk.canlitv.com/stream", cat: "Mix" },
{ name: "Kafa Radyo", url: "http://kafaradyo.canlitv.com/stream", cat: "Mix" },
{ name: "Radyo Viva", url: "http://viva.canlitv.com/stream", cat: "Mix" },
{ name: "Alem FM", url: "http://alemfm.canlitv.com/stream", cat: "Mix" },

/* ================= WORLD ================= */
{ name: "France Inter", url: "http://icecast.radiofrance.fr/franceinter-midfi.mp3", cat: "World" },
{ name: "Swiss Radio", url: "http://stream.srg-ssr.ch/m/drs3/mp3_128", cat: "World" },
{ name: "Japan FM", url: "http://listen.japanfm.co.jp/", cat: "World" },
{ name: "Italy Radio", url: "http://icecast.unitedradio.it/Radio105.mp3", cat: "World" }

];

/* =========================
   USER DB (SIMPLE TEST MODE)
========================= */
let users = [
  {
    id: 1,
    name: "test",
    favorites: []
  }
];

/* =========================
   LOGIN (SIMPLE)
========================= */
app.post("/api/login", (req, res) => {
  const { name } = req.body;

  let user = users.find(u => u.name === name);

  if (!user) {
    user = { id: Date.now(), name, favorites: [] };
    users.push(user);
  }

  res.json(user);
});

/* =========================
   GET RADIOS
========================= */
app.get("/api/radio", (req, res) => {
  res.json(radios);
});

/* =========================
   FAVORİ EKLE / SİL (CLOUD)
========================= */
app.post("/api/favorite", (req, res) => {
  const { userId, radioId } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) return res.json({ error: "user not found" });

  const exists = user.favorites.includes(radioId);

  if (!exists) {
    user.favorites.push(radioId);
  } else {
    user.favorites = user.favorites.filter(f => f !== radioId);
  }

  res.json(user);
});

/* =========================
   GET FAVORITES
========================= */
app.get("/api/favorite/:userId", (req, res) => {
  const user = users.find(u => u.id == req.params.userId);
  res.json(user?.favorites || []);
});

/* =========================
   PRAYER
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
   START
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("SAAS USER SYSTEM ACTIVE:", PORT);
});