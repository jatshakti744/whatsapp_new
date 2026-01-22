"use strict"
const crypto = require('crypto');
const { Schema, model } = require('mongoose');

const clientsModel = new Schema({
    FullName: {
        type: String,
        trim: true,
        default: null
    },

    PhoneNo: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v); // ensures exactly 10 digits
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        default: null
    },
    add_by: {
        type: String,
        trim: true,
        default: null
    },
    del: {
        type: Number,
        enum: [1, 0],
        default: 0
    },
    ActiveStatus: {
        type: Number,
        enum: [1, 0],
        default: 0
    },
    assigned_to: {
        type: String,
        trim: true,
        default: null
    },

}, {
    timestamps: true
});

const Clients_model = model('CLIENTS', clientsModel);



module.exports = Clients_model;
