const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        qrId: {
            type: String,
            required: true,
            index: true,
        },
        message: {
            type: String,
            required: true,
            maxlength: 500,
        },
        senderName: {
            type: String,
            default: 'Anonymous',
            maxlength: 100,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notification', notificationSchema);
