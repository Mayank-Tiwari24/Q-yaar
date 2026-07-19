const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true,
            index: true,
        },
        senderMobile: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
            maxlength: 500,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Message', messageSchema);
