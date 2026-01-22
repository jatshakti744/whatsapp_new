"use strict";

require('dotenv').config();
const mongoose = require('mongoose');

// 1️⃣ Load model using your existing pattern
const db = require("../Models"); // Make sure App/models/index.js exports Role
const Mailtemplate_Modal = db.Mailtemplate;

async function seedMailTemplates() {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });

    // 2️⃣ Define MailTemplate seed data
    const templatesToSeed = [
      {
        _id: "66f6586e01cc91347391827b",
        mail_type: "staff_reset_password",
        mail_subject: "Password Reset",
        mail_body: `Dear Users
Your verification code is {resetToken}. This code is valid for 10 minutes. Please do not share this codea with anyone.`,
      },
      {
        _id: "66f674d601cc913473918286",
        mail_type: "client_password_reset",
        mail_subject: "Password Reset",
        mail_body: `Your verification code is: {resetToken}. This code is valid for 10 minutes. Please do not share this code with anyone.`,
      }

    ];

    // 3️⃣ Insert each one if not exists
    for (const tpl of templatesToSeed) {
      const exists = await Mailtemplate_Modal.findById(tpl._id);
      if (!exists) {
        await Mailtemplate_Modal.create(tpl);
      } else {
      }
    }

  } catch (err) {
  } finally {
    // mongoose.disconnect();
  }
}

module.exports = seedMailTemplates;
