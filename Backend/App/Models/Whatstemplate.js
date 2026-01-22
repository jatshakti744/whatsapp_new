"use strict";

const { Schema, model } = require('mongoose');

const WhatstemplateSchema = new Schema({
    template_name: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    del: {
        type: Number,
        enum: [1, 0],
        default: 0
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Define the model
const Whatstemplate = model('Whatstemplate', WhatstemplateSchema);

module.exports = Whatstemplate;
