const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    "Pop": [
      { name: "Radio Paradise", url: "https://stream-uk1.radioparadise.com/mp3-192" }
    ],
    "Rock": [
      { name: "KEXP", url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3" }
    ],
    "News": [
      { name: "BBC World", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm" }
    ]
  });
});

module.exports = router;