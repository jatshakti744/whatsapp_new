"use strict";

require('dotenv').config();
const mongoose = require('mongoose');

// 1️⃣ Load model using your existing pattern
const db = require("../Models"); // Make sure App/models/index.js exports Role
const Role = db.Role;

async function seedRoles() {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });

    // 2️⃣ Define default roles
    const rolesToSeed = [
      {
        _id: "66bc76c530d6ea730026c486",
        title: "admin",
        permission: ["add,edit"],
        add_by: "1",
        del: false
      }
    ];

    // 3️⃣ Insert if not exists
    for (const role of rolesToSeed) {
      const exists = await Role.findById(role._id);
      if (!exists) {
        await Role.create(role);
      } else {
      }
    }

  } catch (err) {
  } finally {
    // mongoose.disconnect();
  }
}

// 4️⃣ Run it
module.exports = seedRoles;