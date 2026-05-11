const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// CORS (Render + frontend uyumu için)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// STATIC DASHBOARD SERVE (opsiyonel ama iyi)
app.use(express.static(__dirname));

// RADIOS DATA
const radios = [
  { name: "Power FM", stream_url: "https://powerfm.example/stream", stream_status: "ok", response_time_ms: 89 },
  { name: "Kral FM", stream_url: "https://kralfm.example/stream", stream_status: "broken", response_time_ms: null },
  { name: "Kafa FM", stream_url: "https://kafafm.example/stream", stream_status: "null", response_time_ms: null },
  { name: "TRT FM", stream_url: "https://trtfm.example/stream", stream_status: "ok", response_time_ms: 391 }
];

// API (PUBLIC)
app.get("/api", (req, res) => {
  res.json(radios);
});

// DASHBOARD ROOT (opsiyonel redirect)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dashboard.html");
});

app.listen(PORT, () => {
  console.log("Radio SaaS running on port", PORT);
});