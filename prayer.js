const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    city: "Istanbul",
    fajr: "06:00",
    dhuhr: "13:15",
    asr: "16:30",
    maghrib: "19:10",
    isha: "20:45"
  });
});

module.exports = router;