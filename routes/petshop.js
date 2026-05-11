const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { name: "Happy Pets", city: "Samsun" },
    { name: "Pet World", city: "İstanbul" }
  ]);
});

module.exports = router;