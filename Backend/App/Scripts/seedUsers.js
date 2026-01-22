"use strict";

require('dotenv').config();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const db = require("../Models");
const Users_Modal = db.Users;

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });

    const adminUser = {
      _id: new ObjectId("66bc8b0c3fb6f1724c02bfec"),
      FullName: "Admin",
      UserName: "admin",
      Email: "admin@gmail.com",
      PhoneNo: "9123456789",
      password: "$2a$12$E6kVZDniOt3nRulcZ40T5OqreP7w/04rRf6Qvl5D/RekeLOCMQdbi",
      Role: 1,
      del: 0,
      ActiveStatus: 1,
      add_by: null,
      permissions: null,
      forgotPasswordToken: "0a4204324c61bc7210c65a191f1d86e840176d11",
      forgotPasswordTokenExpiry: new Date("2024-11-13T05:24:38.276Z"),
      token: "ea9ce1c14c9b6fed5461",
      crm_user_id: 0
    };

    const exists = await Users_Modal.findById(adminUser._id);

    if (!exists) {
      await Users_Modal.create(adminUser);
    } else {
    }

  } catch (err) {
  } finally {
    // await mongoose.disconnect();
  }
}

module.exports = seedUsers;
