"use strict";

require('dotenv').config();
const mongoose = require('mongoose');

const db = require("../Models"); // Make sure App/models/index.js exports Role
const BasicSetting = db.BasicSetting;

async function seedBasicSetting() {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });

    // 2️⃣ Define default BasicSetting
    const basicSetting = {
      _id: "66bb3c19542b26b6357bbf4f",
      address: "abc test sadada",
      contact_number: "99912312311",
      email_address: "demo@gmail.com",
      encryption: "SSL",
      favicon: "",
      from_mail: "",
      from_name: "WEB",
      logo: "",
      smtp_host: "",
      smtp_password: "",
      smtp_port: 465,
      smtp_status: 1,
      smtp_username: "",

    };

    // 3️⃣ Insert or update if not exists
    const exists = await BasicSetting.findById(basicSetting._id);
    if (!exists) {
      await BasicSetting.create(basicSetting);
    } else {
    }

  } catch (err) {
  } finally {
    // mongoose.disconnect();
  }
}

module.exports = seedBasicSetting;


