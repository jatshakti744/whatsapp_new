"use strict";

require('dotenv').config();
const mongoose = require('mongoose');

// 1️⃣ Load model using your existing pattern
const db = require("../Models"); // Make sure App/models/index.js exports Role
const Smsprovider_Modal = db.Smsprovider;

async function seedSmsProviders() {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });

    // 2️⃣ Define SmsProviders seed data
    const providersToSeed = [
      {
        _id: "680099bc7f449bc31b57917d",
        name: "bulksmsservice",
        apikey: "",
        username: "",
        password: "",
        sender: "",
        url: "http://smsjust.com/sms/user/urlsms.php",
        entity_id: "",
        route: "",
        status: 0,
      },
      {
        _id: "6800a09c7f449bc31b579180",
        name: "pushsms",
        apikey: "",
        username: "",
        password: "",
        sender: "",
        url: "http://162.55.22.113/api/pushsms.php",
        entity_id: "",
        route: "",
        status: 0,
      },
      {
        _id: "682acb1e27fc544b27485498",
        name: "smartping",
        apikey: "",
        username: "",
        password: "",
        sender: "",
        url: "https://pgapi.smartping.ai/fe/api/v1/multiSend",
        entity_id: "",
        route: "",
        status: 0,
      },
    ];

    // 3️⃣ Insert each one if not exists
    for (const provider of providersToSeed) {
      const exists = await Smsprovider_Modal.findById(provider._id);
      if (!exists) {
        await Smsprovider_Modal.create(provider);
      } else {
      }
    }

  } catch (err) {
  } finally {
    // mongoose.disconnect();
  }
}

module.exports = seedSmsProviders;


