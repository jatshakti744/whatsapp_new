"use strict";

require('dotenv').config();
const mongoose = require('mongoose');

// ✅ Load model using your existing pattern
const db = require("../Models"); // Make sure App/models/index.js exports Role
const Smstemplate_Modal = db.Smstemplate;

async function seedSmsTemplates() {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });

    // ✅ Define seed data
    const templatesToSeed = [
      {
        _id: "68008bb27f449bc31b57916c",
        templateid: "123456",
        sms_body: "test",
        sms_type: "otp",
      },
    ];

    // ✅ Insert each if not exists
    for (const template of templatesToSeed) {
      const exists = await Smstemplate_Modal.findById(template._id);
      if (!exists) {
        await Smstemplate_Modal.create(template);
      } else {
      }
    }

  } catch (err) {
  } finally {
    // mongoose.disconnect();
  }
}

module.exports = seedSmsTemplates;


