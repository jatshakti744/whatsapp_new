"use strict"

const { Schema, model } = require('mongoose');

const LogsModel = Schema({
    message: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    type: {
        type: String,
        trim: true,
        default: null
    },
    ipaddress: {
        type: String,
        trim: true,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },


},
    {
        timestamps: true
    },

)
const Logs_Model = model('Logs', LogsModel);



module.exports = Logs_Model;
