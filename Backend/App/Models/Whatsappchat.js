"use strict"
const { Schema, model } = require('mongoose');

const WhatsappchatModel = new Schema({
    phone: {
        type: String,
        required: true,
        trim: true
    },

    message: {
        type: String,
        trim: true,
        default: null
    },

    message_type: {
        type: String,
        // enum: ['text', 'image', 'video', 'audio', 'document', 'template','button'],
        default: 'text'
    },

    media_url: {
        type: String,
        default: null
    },

    caption: {
        type: String,
        default: null
    },

    sender_type: {
        type: String,
        enum: ['employee', 'admin', 'bot'],
        required: true
    },

    sender_id: {
        type: String,
        default: null
    },

    status: {
        type: String,
        enum: ['sent', 'delivered', 'read', 'failed'],
        default: 'sent'
    },

    whatsapp_msg_id: {
        type: String,
        default: null
    },

    reply_to: {
        type: Schema.Types.ObjectId,
        ref: 'WHATSAPP_CHATS',
        default: null
    },
    is_template: {
        type: Boolean,
        default: false
    },
    del: {
        type: Number,
        enum: [1, 0],
        default: 0
    },

    ActiveStatus: {
        type: Number,
        enum: [1, 0],
        default: 1
    },
    whatsapp_msg_error: {
        type: String,
        default: null
    },
    sendto: {
        type: Number,
        enum: [1, 0],
        default: 0
    },
    crm_user_id: {
        type: String,
         default: null
    },
    old_crm_user_id: {
        type: String,
        default: null
    },
    is_read: {
        type: Number,   // 0 = unread, 1 = read
        default: 0,
    },
    assign_notified: {
     type: Boolean,
     default: false
    }

}, {
    timestamps: true
});

module.exports = model('Whatsappchat', WhatsappchatModel);
