const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

/* =========================
   DİNAMİK RADYO DB
========================= */
let radios = [
  { name: "Radio Paradise", url: "https://stream-uk1.radioparadise.com/mp3-192" },
  { name: "KEXP", url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3" }
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
   RADIO API (STATUS + ANALYTICS)
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
        ...r,
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
   ADMIN - RADYO EKLE
========================= */
app.post("/api/admin/add", (req, res) => {
  const { name, url } = req.body;

  radios.push({ name, url });

  res.json({ success: true, radios });
});

/* =========================
   ADMIN - RADYO SİL
========================= */
app.post("/api/admin/delete", (req, res) => {
  const { name } = req.body;

  radios = radios.filter(r => r.name !== name);

  res.json({ success: true, radios });
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
  console.log("SAAS ADMIN RUNNING:", PORT);
});