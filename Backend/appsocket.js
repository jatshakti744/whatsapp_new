require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./App/connection/db');
// const { connectRedis } = require('./App/connection/redis');
const routes = require('./App/Routes');
const { errorHandler } = require('./App/Middleware/errorHandler');
// const db = require("./App/Models");
const http = require('http');
const socketIo = require('socket.io');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
var privateKey = fs.readFileSync('../crt/privkey.pem', 'utf8');
var certificate = fs.readFileSync('../crt/fullchain.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };
const httpsserver = https.createServer(credentials, app);


const io = socketIo(httpsserver, {
  cors: {
    origin: "*",
    credentials: true
  }
});


io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

});

global.io = io;


app.get("/test", async (req, res) => {
  io.emit("notification", { message: "This is a test notification pppppp" });
  return res.send("Done");
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
// connectRedis();

require("./App/Utils/ioSocketReturn")(app, io);

routes(app);
app.use(errorHandler);
require('./App/Routes/index')(app)

const mongoose = require("mongoose");

const seedBasicSetting = require('./App/Scripts/seedBasicSetting');
const seedMailTemplates = require('./App/Scripts/seedMailTemplates');
const seedRoles = require('./App/Scripts/seedRoles');
const seedUsers = require('./App/Scripts/seedUsers');
const seedSmsProviders = require('./App/Scripts/seedSmsProviders');
const seedSmsTemplates = require('./App/Scripts/seedSmsTemplates');

async function runSeeds() {
  await seedRoles();
  await seedBasicSetting();
  await seedMailTemplates();
  await seedSmsProviders();
  await seedSmsTemplates();
  await seedUsers();


}

// ✅ 2️⃣ Connect Mongo FIRST
mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME,
})
  .then(() => {
    console.log("✅ MongoDB connected!");
    // ✅ 3️⃣ Ab 5 min ke baad seeds run karo
    setTimeout(runSeeds, 1 * 60 * 1000); // 5 min = 300000 ms

  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });


httpsserver.listen(1001)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
