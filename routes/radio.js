const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { name: "Power FM", url: "http://powerfm.listenpowerapp.com/powerfm/mpeg/icecast.audio" },
    { name: "Kral FM", url: "http://46.20.3.204:80/" }
  ]);
});

module.exports = router;