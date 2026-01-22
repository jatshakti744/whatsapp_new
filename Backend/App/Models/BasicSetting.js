"use strict";

const { Schema, model } = require('mongoose');

const BasicSettingSchema = new Schema({
    favicon: {
        type: String,
        trim: true,
        default: null
    },
    logo: {
        type: String,
        trim: true,
        default: null
    },
    website_title: {
        type: String,
        trim: true,
        default: null
    },
    email_address: {
        type: String,
        trim: true,
        default: null
    },
    contact_number: {
        type: String,
        trim: true,
        default: null
    },
    address: {
        type: String,
        trim: true,
        default: null
    },
    smtp_status: {
        type: Number,
        default: 0
    },
    smtp_host: {
        type: String,
        trim: true,
        default: null
    },
    smtp_port: {
        type: Number,
        default: 0
    },
    encryption: {
        type: String,
        trim: true,
        default: null
    },
    smtp_username: {
        type: String,
        trim: true,
        default: null
    },
    smtp_password: {
        type: String,
        trim: true,
        default: null
    },
    from_name: {
        type: String,
        trim: true,
        default: null
    },
    smsprovider: {
        type: String,
        trim: true,
        default: null
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const BasicSetting = model('BasicSetting', BasicSettingSchema);

module.exports = BasicSetting;
