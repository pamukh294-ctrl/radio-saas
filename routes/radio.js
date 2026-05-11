const express = require("express");
const router = express.Router();

// 👉 TÜM RADYOLAR BURADA
const radios = [
  { name: "Radio Paradise", url: "https://stream-uk1.radioparadise.com/mp3-192" },
  { name: "KEXP", url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3" },
  { name: "BBC Radio 1", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one" },
  { name: "BBC World", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm" },
  { name: "NPR", url: "https://npr-ice.streamguys1.com/live.mp3" }
];

// 👉 STREAM TEST
async function checkStream(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

// 👉 API
router.get("/", async (req, res) => {
  const result = await Promise.all(
    radios.map(async (r) => {
      const ok = await checkStream(r.url);

      return {
        name: r.name,
        url: r.url,
        status: ok ? "ok" : "broken"
      };
    })
  );

  res.json(result);
});

module.exports = router;