const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { name: "Merkez Eczanesi", district: "Atakum" },
    { name: "Güneş Eczanesi", district: "Samsun" }
  ]);
});

module.exports = router;