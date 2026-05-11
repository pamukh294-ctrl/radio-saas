const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    {
      name: "Radio Paradise",
      url: "https://stream-uk1.radioparadise.com/mp3-192"
    },
    {
      name: "BBC Radio 1",
      url: "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one"
    },
    {
      name: "KEXP",
      url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3"
    }
  ]);
});

module.exports = router;