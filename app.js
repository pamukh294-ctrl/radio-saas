import express from "express";
import fetch from "node-fetch";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ================= CHECK ENV =================
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error("❌ .env missing or invalid");
  process.exit(1);
}

// ================= SERVICES =================
const stripe = new Stripe(process.env.STRIPE_SECRET);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ================= USERS (DEMO DB) =================
const users = {
  "demo@user.com": { token: "user123", plan: "free" }
};

function getUser(req){
  const token = req.headers["x-user"];
  return Object.values(users).find(u => u.token === token);
}

// ================= STREAM CHECK =================
async function check(url){
  if(!url) return null;

  const start = Date.now();
  try{
    const res = await fetch(url);
    if(res.ok) return Date.now() - start;
  }catch{}
  return null;
}

// ================= STATUS =================
function status(p){
  if(p===null) return "broken";
  if(p>500) return "slow";
  return "ok";
}

// ================= UPTIME =================
const history = {};

function uptime(id,st){
  if(!history[id]) history[id]={ok:0,total:0};

  history[id].total++;
  if(st==="ok") history[id].ok++;

  return Math.round((history[id].ok/history[id].total)*100);
}

// ================= MONITOR ENGINE =================
async function run(){
  const {data}=await supabase.from("radios").select("*");
  if(!data) return;

  for(const r of data){

    const ping = await check(r.stream_url);
    const st = status(ping);
    const up = uptime(r.id, st);

    await supabase.from("radios").update({
      response_time_ms: ping,
      stream_status: st,
      uptime_percent: up,
      last_checked_at: new Date()
    }).eq("id", r.id);

    console.log(`📡 ${r.name} → ${st} | ${ping}ms | ${up}%`);
  }
}

// ================= API =================
app.get("/api", async (req,res)=>{

  const user = getUser(req);

  if(!user){
    return res.status(401).json({error:"login required"});
  }

  const {data}=await supabase.from("radios").select("*");

  if(user.plan === "free"){
    return res.json(data.slice(0,3));
  }

  res.json(data);
});

// ================= STRIPE BUY =================
app.post("/buy", async (req,res)=>{

  const session = await stripe.checkout.sessions.create({
    payment_method_types:["card"],
    mode:"payment",
    line_items:[{
      price_data:{
        currency:"usd",
        product_data:{name:"Radio SaaS Pro"},
        unit_amount:500
      },
      quantity:1
    }],
    success_url:"http://localhost:3000/success",
    cancel_url:"http://localhost:3000"
  });

  res.json({url:session.url});
});

// ================= SUCCESS =================
app.get("/success",(req,res)=>{
  users["demo@user.com"].plan = "pro";
  res.send("✅ PRO activated");
});

// ================= DASHBOARD =================
app.get("/", async (req,res)=>{

  const {data}=await supabase.from("radios").select("*");

  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>RADIO SAAS</title>

<style>
body{margin:0;background:#0d0d0d;color:#fff;font-family:Arial}
.header{padding:18px;text-align:center;background:#111}
.container{max-width:900px;margin:auto}
.card{background:#1c1c1c;margin:10px;padding:14px;border-radius:8px;border-left:5px solid #555}
.ok{border-color:#00ff6a}
.slow{border-color:#ffb300}
.broken{border-color:#ff3b3b}
.meta{color:#aaa;font-size:13px}
.bar{height:6px;background:#333;margin-top:10px}
.fill{height:6px;background:#00ff6a}
</style>

</head>
<body>

<div class="header">📡 RADIO SAAS LIVE</div>

<div class="container">

${
  (data||[]).map(r=>`
    <div class="card ${r.stream_status}">
      <b>${r.name}</b>
      <div class="meta">${r.stream_status} | ${r.response_time_ms ?? "-"} ms</div>
      <div class="meta">Uptime: ${r.uptime_percent || 0}%</div>
    </div>
  `).join("")
}

</div>

</body>
</html>
  `);
});

// ================= START =================
app.listen(PORT,()=>{
  console.log("🚀 SAAS DEPLOY READY http://localhost:"+PORT);
});

// ================= LOOP =================
setInterval(run,15000);
run();