const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        qrId: {
            type: String,
            required: true,
            index: true,
        },
        scannerMobile: {
            type: String,
            required: true,
            index: true,
        },
        ownerMobile: {
            type: String,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'EXPIRED', 'BLOCKED'],
            default: 'ACTIVE',
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        scannerMessageCount: {
            type: Number,
            default: 0,
        },
        ownerHasReplied: {
            type: Boolean,
            default: false,
        },
        lastMessage: {
            text: { type: String, default: '' },
            senderMobile: { type: String, default: '' },
            timestamp: { type: Date, default: null },
        },
    },
    {
        timestamps: true,
    }
);

// Auto-expire sessions
chatSessionSchema.methods.isExpired = function () {
    return new Date() > this.expiresAt;
};

// Compound index for preventing duplicate active sessions
chatSessionSchema.index({ qrId: 1, scannerMobile: 1, status: 1 });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
