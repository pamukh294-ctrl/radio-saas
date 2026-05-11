const express = require("express");
const app = express();

const radioRoutes = require("./routes/radio");
const prayerRoutes = require("./routes/prayer");
const pharmacyRoutes = require("./routes/pharmacy");
const petshopRoutes = require("./routes/petshop");

app.use(express.static(__dirname));
app.use(express.static("public"));
app.use(express.json());

// =========================
// ROUTES BAĞLAMA (KRİTİK KISIM)
// =========================
app.use("/api/radio", radioRoutes);
app.use("/api/prayer", prayerRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/petshop", petshopRoutes);

// =========================
// ROOT TEST
// =========================
app.get("/", (req, res) => {
  res.send("🚀 Local Life Hub API Running");
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});